# Дизайн-спека: секция Services — «Charges» (обвинительный акт)

> Дата: 2026-06-21. Статус: согласовано владельцем в брейншторме.
> Спека ТРЕТЬЕГО среза сборки (секция после About). Развивает концепт «Case File»
> из `2026-06-20-hero-prison-portfolio-design.md` и `2026-06-20-about-the-inmate-design.md`
> — читать вместе с ними (та же дизайн-система: бетон + сталь + prison-orange).
> Язык сайта — **EN-only**. **Скоуп — ТОЛЬКО секция services.** Контакты/форма/CTA, SEO,
> Soul-фото — вне этого среза.

## 1. Что это и зачем

Секция `#services` (в навигации FileNav — `CHARGES`). Показывает, что умеет автор, переупаковав
список услуг в **обвинительный акт против заключённого**. Ирония концепта: он «виновен» в том,
что делает вещи, которые работают. Каждая услуга — это **count (пункт обвинения)**, по которому
выносится приговор `GUILTY`. Метафора садится без натяжки и наследует тон hero/About.

**Выбранное направление:** B — «The Read-Out» (зачитывание обвинения по скроллу), подвариант
**B1** (на сцене всегда один count). Подтверждено владельцем.

**Финал секции:** экран `VERDICT / SENTENCE` как чистая кульминация. **CTA нет** (контакты —
отдельный будущий срез). Финал естественно передаёт скролл вниз к следующей секции.

## 2. Раскладка (desktop)

Секция `min-h ~100vh`, **пиннится**. Внутри:

- **Сцена (центр-лево):** активный count — крупная цифра `0i`, заголовок обвинения (`charge`),
  пояснение (`gloss`, моно), штамп `GUILTY`.
- **Индекс дела (правый рейл, постоянный):** список `01–05`, активный подсвечен; счётчик
  `GUILTY ×N` (растёт по мере штамповки); пункт `SENTENCE` внизу.
- **Scrub-полоса (низ):** прогресс прохода по делу + индикатор `0i / 05`.
- **Хедер секции:** эйдброу `§ CHARGES` + интро `The people charge the defendant with:`.

## 3. Хореография — сигнатура секции

**Ключевое решение: `pin + snap` по сегментам** (а не чистый scrub). Каждый count
«защёлкивается», и при активации **одноразово** играет его таймлайн `playCount(i)`:

1. цифра count'а быстро скрэмблится (**ScrambleText**);
2. `charge` выезжает по словам/буквам (**SplitText**, `power3.out`);
3. `gloss` проявляется (fade + small y, моно);
4. **штамп `GUILTY` слэмается**: `scale 1.8→1`, лёгкий `rotate`, `ease: back.out(1.7)` +
   **ink-bleed** самоотрисовкой контура штампа (**DrawSVG**) + **микро-тряска самой сцены**
   (2–3px, НЕ всей страницы);
5. рейл реагирует: активный индекс → i, `GUILTY ×N` инкремент, scrub-полоса и `0i / 05` обновляются.

`revealCount(card)` — **один и тот же таймлайн** на каждый count (срабатывает при snap-активации).
DRY. **Звука нет** — слэм чисто визуальный.

**Финал (`SENTENCE`):** после count 05 — экран вердикта: `GUILTY ON ALL FIVE COUNTS` (slam,
как штампы) + строка приговора. Без кнопок. Вердикт — слой поверх сцены; на нём рейл прячется.

## 4. Поведение на мобиле/планшете

> **ОБНОВЛЕНО 2026-06-21 после фидбэка владельца:** решение M2 (стопка без пиннинга) ОТМЕНЕНО.
> Владелец захотел на телефоне/планшете **то же, что на ПК** — стопка не нравилась. Делаем
> **единый пин для всех экранов** (это к тому же консистентно с hero/`ManifestMotion`, который
> уже пиннится на мобиле в проде).

- **Единое поведение** через `gsap.matchMedia()`: и desktop, и mobile — `pin + snap`, один count
  на сцене, тот же `revealCount`. Отличие только в **длине пиннинга** (`end`): desktop `+=540%`
  (6×90%), мобайл/планшет короче — `+=384%` (6×64%), т.к. тач уже даёт «тяжёлый» скролл.
- **Раскладка карточки адаптивна:** desktop/планшет — число слева, заголовок справа; узкий экран
  (`max-md`) — число над заголовком. Рейл виден на всех (компактнее на мобиле).
- **Честный нюанс:** превью — эмуляция; финальную плавность на реальном тач-устройстве проверяет
  владелец (телефон в той же сети / после превью-деплоя).

## 5. Контент / копи (черновик, EN)

Источник — `docs/content-backup.md` (5 услуг), переупаковка в пункты обвинения. Точные строки
финализируем на вёрстке; ниже — рабочая версия. Выносим в `src/content/services.ts`.

- Эйдброу: `§ CHARGES` · Интро: `The people charge the defendant with:`
- `COUNT 01` — **Unlawful web construction** — `Fast, distinctive sites — motion that earns attention.` — plea `Guilty`
- `COUNT 02` — **Operating products inside Telegram** — `Full products that live inside the chat.` — `Guilty`
- `COUNT 03` — **Deployment of autonomous AI** — `Tools that ship and take real orders.` — `Guilty`
- `COUNT 04` — **Elimination of manual labour** — `Deletes the busywork — automation that runs itself.` — `Guilty`
- `COUNT 05` — **Designing what he builds** — `End to end — from the first pixel to the bottom line.` — `Guilty`
- Вердикт: `GUILTY ON ALL FIVE COUNTS` + приговор `Sentenced to keep shipping products that take real orders.`

## 6. Технологии и анимации

- **GSAP ScrollTrigger** — pin секции + `snap` по сегментам (desktop); on-enter триггеры (mobile).
- **GSAP Timeline** — `playCount(i)` (оркестровка реверса прошлого count'а + reveal + slam).
- **ScrambleText** — скрэмбл цифры count'а.
- **SplitText** — выезд заголовка обвинения.
- **DrawSVG** — ink-bleed самоотрисовка контура штампа `GUILTY`.
- **gsap.matchMedia** — разветвление desktop (pin+snap) / mobile (on-enter).
- **Lenis** (уже глобально) — плавный скролл под сцену.
- Фон — единый `ConcreteBg` (уже глобальный), новый шейдер НЕ нужен; per-section grain/bars НЕ добавляем.

Все плагины GSAP уже зарегистрированы в `src/lib/gsap.ts` (ScrollTrigger/SplitText/ScrambleText/DrawSVG).

## 7. Компоненты / файлы

```
src/content/services.ts          — данные counts (n, charge, gloss, plea) + копи (эйдброу/интро/вердикт)
src/components/services/
  Services.tsx                   — <section id="services"> + хедер + сцена + рейл + финал
  CountCard.tsx                  — презентационный один count (цифра / charge / gloss / штамп GUILTY)
  CaseRail.tsx                   — индекс-рейл 01–05 + счётчик GUILTY ×N + SENTENCE + scrub-полоса (desktop) / номер (mobile)
  Verdict.tsx                    — финал SENTENCE
  ChargesMotion.tsx              — 'use client', useGSAP: matchMedia (pin+snap desktop / on-enter mobile), playCount(i)
```

Монтаж: `<Services />` в `src/app/page.tsx` **после `<About/>`** (порядок страницы hero → about →
services). Якорь `#services` в FileNav оживёт.

## 8. a11y (с учётом решения проекта по движению)

- `prefers-reduced-motion` намеренно НЕ уважаем (см. спеку hero §2), но **контент всегда в DOM**:
  при несработавшем ScrollTrigger (SSR/headless/тесты) counts видны как обычный список — секция
  не «уезжает в пустоту» (паттерн `DossierMotion`).
- Семантика: один `<h2>` секции; counts — список (`<ol>`/`<li>`), цифра/charge/gloss доступны
  скринридеру независимо от анимации.
- Контраст по токенам (bone/steel/orange/dim — уже AA), видимый `:focus-visible`.
- Брейкпоинты 375 / 768 / 1280, без горизонтального скролла, тач-цели ≥44px, размеры через `clamp()`.
- Тяжёлый моушн — только в браузере; в юнит-тестах не гоняем.

## 9. Тесты (Vitest)

- `services.ts` — структура контента (5 counts, поля на месте).
- `Services` / `CountCard` / `Verdict` / `CaseRail` — контент рендерится в DOM (фолбэк-видимость).
- Моушн (pin/snap/slam/matchMedia) и 60fps — проверяем в браузере (preview 375/768/1280), не в юнитах.

## 10. Открытые вопросы (решим на сборке)

- **SVG-контур штампа `GUILTY`** под DrawSVG — нарисовать свой `path` (рамка + текст-аутлайн) или
  собрать из существующего стиля `.stamp`.
- **Длина пиннинга / тайминги snap** — подобрать по факту (цель 60fps, без ощущения «залипания»).
- **Амплитуда микро-тряски сцены** — финализировать в браузере (достаточно ощутимо, но не «дёргано»).

## 11. Вне этого среза (потом)

- EVIDENCE (#work) — следующая секция; затем VISITING HOURS (#contact).
- Контакт-форма → Telegram, SEO (sitemap/robots/OG).
- Soul ID для лица (3–5 фото).
- SFX-«удар» штампа — владелец решил **не брать** (можно вернуться позже как улучшение).
