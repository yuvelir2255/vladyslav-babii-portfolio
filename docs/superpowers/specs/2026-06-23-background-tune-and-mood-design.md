# Background — Tune (A) + Per-Section Mood (C) — Design Spec

> Дата: 2026-06-23 · Область: глобальный фон (`src/components/bg/*` + `globals.css`) · Ветка: feature от свежего `main`

## Проблема

Фон читается как «плоский чёрный», хотя там уже многослойная система (`ConcreteBg`:
радиальный градиент + `ShaderBg` OGL + grain + bars). Причина — всё настроено на грани
различимости: `surface (#2a2620)` светлее `bg (#100f0d)` лишь на ~6% яркости; шум
шейдера тёмный (0.06→0.16); прожектор слабый (0.22); **прутья `rgba(0,0,0,.4)` —
чёрное на тёмном, фактически невидимы** (а это ядро концепта «клетки»); grain 0.07.

**Важно про слои на desktop:** `ShaderBg` — непрозрачный canvas (`alpha:false`,
`inset-0`), он **перекрывает** радиальный градиент `ConcreteBg`. Значит на desktop
видимая база = шейдер + grain/bars поверх; радиальный градиент виден только на тач
(где шейдер не грузится). Вывод: слои мудов (C) и vignette/dome (A) должны лежать
**поверх шейдера** (после `ShaderBg` в DOM), тогда работают на обеих платформах.

## Решение

### A — дотюнить существующее (статично, обе платформы)

1. **Прутья видимыми** (`globals.css .bars::after`): вместо одной тёмной полосы — светлый
   блик на грани + тень = сталь ловит свет.
   `repeating-linear-gradient(90deg, transparent 0 76px, rgba(236,231,218,0.05) 76px 77px,
   rgba(0,0,0,0.4) 77px 81px, rgba(236,231,218,0.03) 81px 82px)`. Маску оставить.
   Прозрачность через переменную `--bar-opacity` (по умолчанию `0.4`).
2. **Шейдер** (`ShaderBg.tsx`, desktop only): расширить диапазон бетон-шума и поднять
   прожектор. `mix(vec3(0.063,0.059,0.051), vec3(0.16,0.15,0.13), c)` → верхняя
   `vec3(0.20,0.185,0.16)`, нижняя `vec3(0.072,0.067,0.058)`; прожектор `* 0.22` → `* 0.30`.
   Больше **ничего** в шейдере не трогаем (никаких новых uniform — C делаем на CSS,
   чтобы desktop/мобайл были в паритете и без JS-связки с GL).
3. **Vignette** — новый слой `div.bg-vignette` поверх всего:
   `box-shadow: inset 0 0 140px 40px color-mix(in srgb, #000 calc(var(--vig) * 100%), transparent)`,
   `--vig` по умолчанию `0.45`. (Через переменную — её крутит C.)
4. **Dome-glow** (опц., обе платформы): тонкий тёплый купол поверх шейдера
   `radial-gradient(95% 70% at 50% -8%, color-mix(in srgb, var(--color-surface) 60%, transparent), transparent 60%)`
   — чтобы верхнее свечение читалось и на desktop (где шейдер перекрывает базовый градиент).

### C — атмосфера по секциям (scroll-linked, деликатно)

Поверх шейдера — **3 мод-слоя** (`div`, `fixed inset-0`), прозрачность каждого = CSS-переменная,
плавно блендится `transition: opacity 0.8s ease`:

- `.mood-steel` — `radial-gradient(100% 70% at 50% -10%, rgba(150,175,200,0.06), transparent 60%)`, opacity `var(--m-steel)`
- `.mood-warm` — `radial-gradient(80% 60% at 50% 25%, rgba(255,90,30,0.07), transparent 70%)`, opacity `var(--m-warm)`
- `.mood-day` — `radial-gradient(120% 80% at 50% 120%, rgba(255,196,130,0.10), transparent 70%)`, opacity `var(--m-day)`

Базовые альфы низкие (0.06–0.10), множитель 0..1 → максимум ~0.10 = деликатно (≈1.5–2×
тише мока). Дополнительно C крутит `--bar-opacity` и `--vig`.

**Карта секция → мооды** (пишутся на `#concrete-bg` при входе в секцию):

| section | --m-steel | --m-warm | --m-day | --bar-opacity | --vig |
| --- | --- | --- | --- | --- | --- |
| `#yard` (intake) | 1 | 0 | 0 | 0.4 | 0.45 |
| `#about` (inmate) | 0.5 | 0 | 0 | 0.6 | 0.6 |
| `#services` (charges) | 0 | 1 | 0 | 0.35 | 0.45 |
| `#work` (evidence) | 0.2 | 0 | 0 | 0.4 | 0.45 |
| `#contact` (release) | 0 | 0.15 | 1 | 0.25 | 0.3 |

Нарратив: сталь-холод → темнее+прутья плотнее → тёплый оранж-свелл → нейтрально →
дневной свет снизу (продолжает existing световой шафт Contact).

## Механизм (scroll)

- Чистая функция `moodForSection(id)` (`src/components/bg/bgMood.ts`) → объект
  `{ '--m-steel', '--m-warm', '--m-day', '--bar-opacity', '--vig' }` (строки).
  `SECTION_MOODS` — карта выше; неизвестный/дефолт → мооды `#yard`.
- Клиент-компонент `BgMood.tsx` (`'use client'`): в `useEffect` на каждую из 5 секций
  вешает `ScrollTrigger.create({ trigger:'#<id>', start:'top center', onEnter, onEnterBack })`
  → применяет `moodForSection(id)` к `document.getElementById('concrete-bg')` через
  `el.style.setProperty(k, v)`. Cleanup: `st.kill()` каждого. Импорт `ScrollTrigger`
  из `@/lib/gsap`. jsdom-guard не нужен (ScrollTrigger noop без layout; компонент
  всё равно client — но обернуть тело в `if (typeof window!=='undefined')` для SSR-сейфа).
- `ConcreteBg.tsx`: добавить `id="concrete-bg"`, дефолтные переменные через `style`
  (или в globals.css `#concrete-bg{ --m-steel:1; --m-warm:0; --m-day:0; --bar-opacity:.4; --vig:.45 }`),
  3 мод-слоя + dome + vignette (после `ShaderBg`), отрендерить `<BgMood/>`. Остаётся
  `aria-hidden`, `pointer-events-none`, `fixed inset-0 -z-10`.

## Перф / риск

- Scroll пишет только CSS-переменные (дёшево); `transition` сглаживает — без RAF/реков.
- Мод-слои — 3 composited div'а (GPU), `pointer-events-none`. Шейдер-тюнинг = смена
  констант (тот же троттл/пауза/dpr-кап). Reduced-motion не уважаем (политика владельца).
- Откат изолирован в `bg/` + блок правил `globals.css`. NB dev-кэш: новые CSS-правила/
  классы Turbopack в dev не подхватывает — `Remove-Item .next` + рестарт.

## A11y

- Весь фон `aria-hidden`, декоративный, некликабельный — изменения не влияют на контент.
- Контраст текста не трогаем (мооды очень слабые, поверх — текст тех же токенов).
  Проверить в браузере, что в Charges (тёплый свелл) и About (темнее) текст всё ещё
  читаем (bone/steel/orange на bg — AA уже с запасом).

## Тесты (Vitest, jsdom)

- `bgMood.test.ts`: `moodForSection('about')['--vig']` = `'0.6'` и `['--bar-opacity']`=`'0.6'`;
  `moodForSection('contact')['--m-day']`=`'1'`; `moodForSection('services')['--m-warm']`=`'1'`;
  неизвестный id (`'zzz'`) → равно `moodForSection('yard')`. Каждый объект содержит все 5 ключей.
- `ConcreteBg.test.tsx`: рендерит элемент `#concrete-bg` с `aria-hidden`; содержит
  `.mood-steel`, `.mood-warm`, `.mood-day`, `.bg-vignette`. (Моушн/ScrollTrigger не гоняем —
  проверка в браузере.)
- `npm test` остаётся зелёным; новые тесты поверх текущих 78.

## «Готово» = доказано

- Чистый `npm run build` + `npm test` зелёный + `npm run typecheck`.
- Браузер (preview): прокрутка по секциям — мооды плавно меняются (steel→dark→warm→
  neutral→daylight), прутья ВИДНЫ, vignette собирает кадр; на мобайле (без шейдера)
  мооды/прутья тоже работают. Текст везде читаем, без H-скролла. Скрин-доказательства
  hero / charges / contact (desktop) + один мобайл.

## Вне scope (YAGNI)

- B (прожектор-обыск / пылинки) — не делаем (можно отдельным шагом позже).
- Новые uniform в шейдере / связка GL с прогрессом скролла — не делаем.
- Изменение контента/моушна секций, токенов текста.

## Откат

Изолировано в `src/components/bg/*` + блок `globals.css`. Откат — revert коммита фичи.
Прод (`main`) — только по явному «ок» владельца (feature-ветка → preview).
