# Дизайн-спека: секция Work — «Evidence Locker» (вещдоки)

> Дата: 2026-06-21. Статус: согласовано владельцем в брейншторме.
> Спека ЧЕТВЁРТОГО среза сборки (секция после Services «Charges»). Развивает концепт «Case File»
> из `2026-06-20-hero-prison-portfolio-design.md`, `2026-06-20-about-the-inmate-design.md` и
> `2026-06-21-services-charges-design.md` — читать вместе с ними (та же дизайн-система:
> бетон + сталь + prison-orange). Язык сайта — **EN-only**. **Скоуп — ТОЛЬКО секция work.**
> Контакт-форма (#contact), SEO (sitemap/robots), Soul-фото — вне этого среза.

## 1. Что это и зачем

Секция `#work` (в навигации FileNav — `EVIDENCE`). Доказывает, что обвинения из Charges — не
слова: автор реально **строит работающие вещи**. Переупаковка кейсов в **вещдоки по делу**.
Главный (и пока единственный живой) экспонат — **Dream Gold**, рабочий Telegram Mini App, через
который реальная ювелирная мастерская ежедневно принимает заказы. Метафора: телефон с живым
продуктом — это **физическая улика**, изъятая и приобщённая к делу.

**Выбранная форма:** **A — один иммерсивный экспонат** (а не галерея/сетка). Причина: живой
продукт честно ОДИН (Dream Gold live) + сайт DG (coming-soon). Сетка из «1,5 карточек» выглядела
бы жидко. Форма A концентрирует внимание на единственной убойной улике и **легко расширяется** —
позже EVID-03/04 встают рядом тем же приёмом. Подтверждено владельцем.

**Выбранное направление:** **«Evidence Locker»** — телефон подан как вещдок в «пакете для улик»
с биркой chain-of-custody; пронумерованные форензик-маркеры тыкают в фишки продукта; финал —
слэм-штамп `ADMITTED` + горизонтальная полоса chain-of-custody с **живой ссылкой**. Подтверждено.

**Нейминг (решено):** экспонат маркируем **`EVID-01`**, НЕ «Exhibit A» — чтобы не дублировать
мугшот в hero (он остаётся единственным «Exhibit A» во всём сайте). Сайт DG = **`EVID-02 · PENDING`**.

## 2. Раскладка (desktop)

Секция `min-h ~100vh`, **БЕЗ пиннинга** (см. §3 — решение по ритму). Внутри, центрировано
по `max-w ~1100px`:

- **Хедер секции:** эйдброу `● EVIDENCE` + семантический `<h2>` `The people submit the following
  evidence:` (зеркалит интро Charges `The people charge the defendant with:`). NB: в Charges
  семантического h2 нет (стилизованный `<p>`) — тут делаем правильно.
- **Сцена (две колонки):**
  - **Лево — устройство-экспонат:** телефон в «пакете для улик» (прозрачный контур + бирка
    chain-of-custody со штрихкодом и подписью `EVID-01`). Экран = **карусель живых скринов**
    Dream Gold: `shop → product → sizer → cart`. Под/над пакетом — слэм-штамп `ADMITTED`.
  - **Право — маркеры-улики + факты:** заголовок экспоната «Dream Gold — Telegram Mini App» +
    summary; стопка **форензик-маркеров** (1/2/3 — оранжевый «тент» + номер + подпись фишки);
    мини-строка фактов `LIVE · Telegram Mini App · ~77 KB · ×3 lang`; теги-чипы.
- **Низ — полоса `CHAIN OF CUSTODY`:** горизонтальный лог-ряд:
  `t.me/dreamgold_jewelry_bot/shop` (живая ссылка, кнопка `Open exhibit ↗`) ·
  `dreamgold-jewelry.vercel.app` (web-демо) · `EVID-02 — Dream Gold website · PENDING`.

## 3. Хореография — сигнатура секции

**Ключевое решение: `on-enter reveal` БЕЗ пиннинга** (сиблинг `DossierMotion` из About, НЕ клон
пиннящегося `ChargesMotion`). Причина — **ритм**: Charges уже длинно пиннится (pin+snap). Второй
длинный пин сразу следом ощущался бы как «сайт не отпускает скролл». About даёт дыхание именно
тем, что раскрывается на входе без пина — Evidence наследует этот контраст: визуально близок к
Charges по языку, но по механике другой. Подтверждено владельцем.

**Таймлайн при входе секции** (`ScrollTrigger` once, `start ~'top 70%'`):

1. **«пакет» прорисовывается** — DrawSVG контур пакета + штрихкод бирки `EVID-01`.
2. **телефон поднимается/доворачивается к камере** — `y`+`rotate` → 0, `power3.out`, экран «загорается»
   (autoAlpha 0→1).
3. **маркеры падают по очереди** — `stagger`, `back.out(1.7)`; подписи печатаются (ScrambleText на
   номере маркера, SplitText по словам на подписи фишки).
4. **«измерительная» линейка/скан чертится** по корпусу телефона — DrawSVG, лёгкий форензик-штрих.
5. **слэм-штамп `ADMITTED`** — `scale 1.8→1` + лёгкий `rotate`, `ease: back.out(1.7)` +
   **микро-тряска самой сцены** (2–4px, НЕ всей страницы) — тот же приём, что слэм `GUILTY` в Charges.
6. **`CHAIN OF CUSTODY` проявляется** снизу — `stagger` по строкам лога.

**Карусель скринов** (живёт после reveal, независимо):

- авто-смена каждые ~2.5 с, cross-fade между кадрами; подпись текущего кадра меняется
  (`shop`/`product`/`sizer`/`cart`).
- **ручное управление:** тап/клик по экрану листает вперёд; точки-индикаторы внизу экрана
  (prev/next опционально). Пауза авто-плея по `hover`/`focus`.
- скрины — статичные изображения (`next/image`) из `public/media/dream-gold/`, НЕ видео/3D.

**Звука нет** (как и в Charges — слэм чисто визуальный).

## 4. Поведение на мобиле/планшете

- **Та же on-enter механика** на всех экранах (без пина — поэтому адаптив проще, чем у Charges).
- **Раскладка:** desktop/планшет — две колонки (устройство слева, маркеры/факты справа);
  узкий экран (`max-md`) — **одна колонка**: header → устройство по центру → маркеры списком →
  факты → chain-of-custody. Маркеры стаггерятся вертикально.
- Без горизонтального скролла; тач-цели ≥44px (экран-карусель, точки, ссылки, кнопка `Open exhibit`);
  размеры через `clamp()`.
- **Честный нюанс:** превью — эмуляция; финальную плавность на реальном тач-устройстве проверяет
  владелец (после превью-деплоя).

## 5. Контент / копи (EN)

Источник — `docs/content-backup.md` (кейс Dream Gold). Выносим в `src/content/evidence.ts`.
Скрины уже лежат в `public/media/dream-gold/` (`shop.png`, `product.png`, `sizer.png`, `cart.png`,
`extra.png`).

- Эйдброу: `● EVIDENCE` · Интро (h2): `The people submit the following evidence:`
- Экспонат: метка `EVID-01` · статус `ADMITTED · LIVE`
  - Заголовок: **Dream Gold — Telegram Mini App**
  - Summary: `A production storefront living inside Telegram — used daily by a real jewelry atelier to take orders.`
  - Маркеры (фишки-улики):
    - `1` — **AI product cards** — `GPT-4o-mini vision`
    - `2` — **On-screen ring sizer** — `px → mm`
    - `3` — **HMAC-signed orders** — `trilingual · light + dark · ~77 KB bundle`
  - Факты: `LIVE` · `Telegram Mini App` · `~77 KB` · `×3 lang`
  - Теги: `Telegram Mini App · React · TypeScript · OpenAI · Supabase`
  - Ссылки: `https://t.me/dreamgold_jewelry_bot/shop` (Open exhibit) ·
    `https://dreamgold-jewelry.vercel.app` (web demo)
- EVID-02 (pending): метка `EVID-02 · PENDING` — **Dream Gold — Website** —
  `A full marketing site for the atelier — in the works.` (без ссылок, статус-чип `PENDING`).

Точные строки финализируем на вёрстке; копи может слегка ужаться под раскладку.

## 6. Технологии и анимации

- **GSAP ScrollTrigger** — on-enter триггер секции (once), без пина.
- **GSAP Timeline** — оркестровка reveal-таймлайна (пакет → телефон → маркеры → линейка → штамп → custody).
- **ScrambleText** — номера маркеров.
- **SplitText** — подписи фишек / заголовок экспоната.
- **DrawSVG** — контур «пакета», штрихкод бирки, «измерительная» линейка, ink-bleed штампа `ADMITTED`.
- **gsap.utils** / Timeline `stagger` — падение маркеров, проявление custody.
- Карусель — лёгкая своя логика (setInterval + cross-fade через GSAP/CSS); пауза по hover/focus.
- **Lenis** (уже глобально) — плавный скролл.
- Фон — единый `ConcreteBg` (уже глобальный), новый шейдер НЕ нужен; per-section grain/bars НЕ добавляем.
- `next/image` для скринов (корректный `sizes`, без CLS).

Все плагины GSAP уже зарегистрированы в `src/lib/gsap.ts` (ScrollTrigger/SplitText/ScrambleText/DrawSVG).

## 7. Компоненты / файлы

```
src/content/evidence.ts            — данные экспоната(ов): метка, заголовок, summary, маркеры, факты, теги, ссылки, pending
src/components/work/
  Evidence.tsx                     — <section id="work"> + хедер + сцена (две колонки) + chain-of-custody (server component)
  ExhibitDevice.tsx                — 'use client': телефон в «пакете» + бирка + карусель скринов (авто + тап/точки) + штамп ADMITTED
  EvidenceMarkers.tsx              — список форензик-маркеров (тент + номер + подпись)
  ChainOfCustody.tsx               — нижняя полоса: живые ссылки + EVID-02 PENDING
  EvidenceMotion.tsx               — 'use client', useGSAP: on-enter reveal-таймлайн (как DossierMotion), без пина
```

Монтаж: `<Evidence />` в `src/app/page.tsx` **после `<Services/>`** (порядок страницы
hero → about → services → work). Якорь `#work` в FileNav оживёт.
Ветка: **`feat/work-evidence` от свежего `main`**.

## 8. a11y (с учётом решения проекта по движению)

- `prefers-reduced-motion` намеренно НЕ уважаем (см. спеку hero §2), но **контент всегда в DOM**:
  при несработавшем ScrollTrigger (SSR/headless/тесты) экспонат виден как обычный блок — секция
  не «уезжает в пустоту» (паттерн `DossierMotion`).
- Семантика: один `<h2>` секции; маркеры — список (`<ol>`/`<li>`); заголовок/summary/факты в DOM
  независимо от анимации.
- `alt` у скринов (осмысленный: `Dream Gold storefront inside Telegram`, `Product card`, `On-screen
  ring sizer`, `Cart`); `aria-label` у кнопок карусели и иконок-ссылок.
- Живые ссылки — настоящие `<a target="_blank" rel="noopener">`; карусель управляется клавиатурой
  (точки/кнопки фокусируемы, видимый `:focus-visible`).
- Контраст по токенам (bone/steel/orange/dim — уже AA). Карусель: авто-плей с паузой по hover/focus.
- Брейкпоинты 375 / 768 / 1280, без горизонтального скролла, тач-цели ≥44px, размеры через `clamp()`.
- Тяжёлый моушн — только в браузере; в юнит-тестах не гоняем.

## 9. Тесты (Vitest)

- `evidence.ts` — структура контента (экспонат, маркеры, ссылки, факты на месте; EVID-02 pending).
- `Evidence` / `ExhibitDevice` / `EvidenceMarkers` / `ChainOfCustody` — контент рендерится в DOM
  (фолбэк-видимость, ссылки присутствуют, alt у картинок).
- Моушн (reveal/slam/карусель) и 60fps — проверяем в браузере (preview 375/768/1280), не в юнитах.

## 10. Открытые вопросы (решим на сборке)

- **SVG-контур «пакета» и бирки** под DrawSVG — нарисовать свой `path` (рамка + штрихкод) или
  собрать из существующего стиля `.stamp`.
- **Тайминги карусели** — ~2.5 с авто-смена подобрать по факту, чтобы успевалось прочитать кадр.
- **Мокап телефона** — рамка устройства: чистый CSS-frame или лёгкий SVG-контур (без тяжёлых ассетов).
- **Амплитуда микро-тряски** сцены на слэм `ADMITTED` — финализировать в браузере (ощутимо, но не «дёргано»).
- **LCP-нюанс:** первый скрин карусели (`shop.png`) может ловить next/image LCP-варнинг —
  при необходимости `priority`/`loading="eager"` на активном кадре.

## 11. Вне этого среза (потом)

- VISITING HOURS (#contact) + контакт-форма → Telegram (портировать из `archive/luca-portfolio-2026-06-20`).
- SEO: sitemap/robots (OG/og-image уже сделаны).
- Soul ID для лица (3–5 фото).
- Галерея нескольких экспонатов (форма B) / EVID-03+ — когда появятся новые живые кейсы.
- P1-бэклог: мёртвые hero-CTA `Open the case file`/`Make contact` оживут, когда появятся #work/#contact
  (после этого среза `#work` уже живой — CTA `Open the case file` можно нацелить на `#work`).
