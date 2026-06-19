# Portfolio — правила проекта и статус

> Проектный CLAUDE.md (приоритетнее глобального ~/.claude/CLAUDE.md). Сайт-портфолио **Vladyslav Babii** уровня aboutluca. Отвечать по-русски.

## Что это

Кинематографичный двуязычный (EN/UK) портфолио-сайт. Сам сайт — доказательство навыков: WebGL-поле частиц + GSAP-моушн. Цель-действие — заявка в Telegram от работодателей/клиентов. Референс: **aboutluca.com** (берём технику и моушн-язык, НЕ клон).

## Стек

Next.js 16 (App Router) · React 19 · TS strict · **Tailwind v4** (токены в `src/app/globals.css` через `@theme`, без tailwind.config) · **GSAP** (ScrollTrigger, SplitText) · **Lenis** · **OGL** (WebGL) · **next-intl v4** (EN/UK) · Vitest · Prettier/ESLint/Husky.

- Next 16: middleware = **`src/proxy.ts`** (не middleware.ts).
- Шрифты: Archivo (sans/display) + Space Mono (mono) через next/font.

## Как запускать (Windows!)

- ⚠️ **cwd сбрасывается** после каждой команды → начинать команды с `Set-Location 'C:\Users\ювелир\Desktop\portfolio'`.
- Dev: `npm run dev` → http://localhost:3000 (редирект на `/en`). Build: `npm run build`. Tests: `npm test`. Types: `npm run typecheck`.
- ✅ **Анимации работают у ВСЕХ** (проектное решение от 2026-06-19, как aboutluca): `prefers-reduced-motion` НЕ гейтит анимации. Раньше у владельца (reduce ВКЛ в Windows) была статика — теперь поле/комета/прелоадер/reveal/секвенция карточек/плавный скролл идут для всех (в т.ч. в его Chrome). При желании позже — кнопка-переключатель «reduce motion» на сайте (лучший компромисс).
- Проверка motion: установлен **Playwright** (`python .verify\*.py`, запускать с `reduced_motion="no-preference"`) — снимает кадры анимаций; либо смотреть прямо в Chrome (теперь анимации видны).

## Правила

- Дизайн-конвейер: `frontend-design` / `design-taste-frontend` / `ui-ux-pro-max` → `impeccable` перед «готово». «Готово» = чистый `npm run build` + проверено в браузере (375/768/1280).
- a11y: контраст ≥4.5:1, видимый focus, alt/aria. **`prefers-reduced-motion` сознательно НЕ респектим** (проектное решение — полный движ у всех, как aboutluca); компромисс на будущее — in-page toggle «reduce motion».
- Осознанные переопределения design-taste по просьбе владельца: **кастомный кометный курсор** + **«scroll to explore»** + **анимации без учёта reduced-motion** (скилл их не любит — но владелец явно захотел aboutluca-стиль, «у всех одинаково красиво»).
- Графика/картинки — через **Higgsfield**. Контент проектов — **TS + MDX**. Свой домен — в самом конце.

## Контент

- Имя: **Vladyslav Babii**. Манифест-слова: **BUILD → CRAFT**, финальная подпись **«Ready when it matters.»**
- Карточки What I do: Websites (синий) · Telegram Mini Apps (голубой) · AI Products (фиолетовый) · Automation (изумруд) · Design (янтарь). Появляются по очереди с приближением + hover-динамика (как у Luca).
- Контакты: `vladbabii31@gmail.com` · `@BabiiVladyslav` · LinkedIn · GitHub · Instagram. Форма «Let's talk» → serverless → Telegram.
- Кейс-флагман: **Dream Gold (Telegram Mini App)** — `t.me/dreamgold_jewelry_bot/shop`, демо `dreamgold-jewelry.vercel.app`. Фишки: AI-карточки (GPT-4o-mini vision), размер кольца (px→мм), HMAC-заказы, 3 языка. Фото с телефона предоставит владелец. + Dream Gold website «скоро» + слот будущих проектов.

## Документы (в соседнем репо about-me-website)

- Спека: `../about-me-website/docs/superpowers/specs/2026-06-19-portfolio-design.md`
- План (фазы 0-10): `../about-me-website/docs/superpowers/plans/2026-06-19-portfolio-build.md`

## Текущий статус (ОБНОВЛЯТЬ по ходу)

- ✅ **Фаза 0** — фундамент: next-intl EN/UK, шрифты, тёмные токены, тулинг. Коммит.
- ✅ **Фаза 1** — примитивы: кометный курсор, grain, прелоадер, Lenis, реестр GSAP. Коммит.
- ✅ **Фаза 2** — WebGL-поле (`src/components/field/Field.tsx`): дюны с глубиной/горизонтом, звёздное небо с мерцанием (Transform-сцена, отдельная программа), реакция на курсор — параллакс камеры за мышью, провод скролл-камеры (uScroll по прогрессу скролла). Проверено в браузере. Коммиты.
- ✅ **Курсор исправлен**: кастомный орб показывается всегда (для мыши); в обычном режиме — комета с хвостом, в reduced-motion — аккуратная яркая точка без хвоста (раньше под reduce курсор полностью отключался → владелец его не видел).
- ✅ **Фаза 3 ЗАКРЫТА** — секции героя, манифеста и About:
  - ✅ **Task 3.1** примитивы reveal: `src/lib/motion.ts` (stagger-тайминги, **по TDD**, `motion.test.ts` 4/4), `ui/SplitReveal.tsx` (пословно через SplitText + маска строк `.split-line`, ScrollTrigger), `ui/Reveal.tsx` (блочный fade+rise). Фолбэк без JS / reduced-motion. Коммит.
  - ✅ **Task 3.2** Hero (`sections/Hero.tsx` + `ui/LangSwitcher`, `SocialLinks`, `ScrollCue`): «available»-индикатор, EN/UK, имя+роль пословно после прелоадера (delay ~1.35/1.65с), соц-ссылки (реальные URL: github.com/yuvelir2255, linkedin вход vladyslav-babii-886052385, instagram babii.vladyslavv), scroll-подсказка. Проверено десктоп+мобайл 375. Коммит.
  - ✅ **Task 3.3** Манифест (`sections/Manifesto.tsx`): BUILD + текст (спека §5.2) и CRAFT + стек, пословный reveal на скролле. BUILD/CRAFT оставлены англ. в обеих локалях (подпись-айдентика). EN+UK проверены. Коммит.
  - ✅ **Task 3.4** About (`sections/About.tsx`): био из спеки §5.3 (EN/UK), reveal по абзацам (эйбрау «About» + крупный лид + 2 приглушённых абзаца). Проверено EN+UK в браузере. Коммит.
- ✅ **Фаза 4 ЗАКРЫТА** — карточки «What I do»: `ui/GlassCard.tsx` (стеклянная карточка со свечением, крупный глиф-буква, hover оживляет глиф/свечение/линию + подъём) и `sections/WhatIDo.tsx` (по умолчанию вертикальный список; с JS — pinned-секвенция: карточки по очереди наезжают с зумом/блюром, текущая уходит). 5 услуг §5.4. Проверено в browser (Chrome + Playwright motion): статика, hover, EN/UK, **секвенция в движении** (m02 Telegram→m03 переход→m04 Design). Коммиты.
- ✅ **Рефактор «анимации у всех»** (по просьбе владельца): сняты все гейты `prefers-reduced-motion` (Field, Cursor, Preloader, SmoothScroll, SplitReveal, Reveal, WhatIDo, CSS scroll-cue). `npm run build` чистый. Комета/поле/reveal/секвенция подтверждены Playwright'ом.
- ✅ **Фаза 5 ЗАКРЫТА** — подпись + кейс + контент-модель: 5.1 контент-модель по TDD (`content/projects/`: types/validateProject + dream-gold-app[live] + dream-gold-site[coming-soon] + index; projects.test.ts), 5.2 Signature («Ready when it matters.»), 5.3 кейс Dream Gold (`sections/WorkDreamGold.tsx` + `ui/TiltCard.tsx`): лид/фишки/ссылки/теги из модели, **3 реальных скриншота Mini App** (`public/media/dream-gold/{shop,product,sizer}.png`, через `next/image fill` + 3D-наклон) + «coming soon» сайт + слот. (Доп. фото в папке: cart.png, extra.png — про запас.)
- ✅ **Фаза 6 ЗАКРЫТА** — контакт-форма «Let's talk» → Telegram: 6.1 по TDD (`lib/telegram.ts`: validateContact/isSpam-honeypot/buildTelegramMessage/sendTelegramMessage + `app/api/contact/route.ts`: 422/honeypot/rate-limit/send), 6.2 секция Contact (форма + состояния + a11y) + Footer. **Секреты в `.env.local`** (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) — gitignored; `.env.example` закоммичен. Реальная отправка в Telegram подтверждена.
  - Порядок секций в `page.tsx`: Hero → Manifesto → About → WhatIDo → Signature → WorkDreamGold → Contact → Footer. **Сайт структурно ПОЛНЫЙ.**
- ✅ **Фаза 7 ЗАКРЫТА** — i18n: тест паритета ключей en↔uk + «нет пустых значений» (`src/messages/i18n-parity.test.ts`, тесты колокально, не в `tests/`). Аудит секций — весь копирайт через `t()`. Локализованы 2 CTA-кнопки кейса (`Work.openApp`/`webDemo`; в модели ссылок добавлен опц. `labelKey`, резолв в `WorkDreamGold.tsx`). `npm test` 16/16, build/typecheck чисто, рендер `/en`+`/uk` проверен (curl dev-сервера). Осознанно отложено в Фазу 9 (a11y): `alt` картинок + `aria-label="Language"` — англ. в обеих локалях.
- ✅ **Фаза 8.1 ЗАКРЫТА** — SEO/OG: `generateMetadata` в `[locale]/layout.tsx` (локализ. title/description из нового `Meta`-неймспейса, `metadataBase`, canonical + hreflang en/uk/x-default, OpenGraph + Twitter summary_large_image, robots index/follow). Базовый URL — `src/lib/site.ts` (`NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → localhost; в `.env.example`). `src/app/sitemap.ts` (обе локали + hreflang) + `src/app/robots.ts`. OG-картинка `src/app/[locale]/opengraph-image.tsx` через `next/og` — бренд-карточка (тёмный фон + сине-фиол. свечение + имя + тэглайн), **дефолтный шрифт next/og рендерит без подгрузки** (Latin/бренд, общий на обе локали; локализованы og:title/description в HTML-мете). Один `<h1>` (Hero) подтверждён. `npm test` 16/16, build чистый, рендер robots/sitemap/og + метатеги обеих локалей проверены curl'ом (картинка визуально ок).
- ⏭️ **Фаза 8.2 (графика Higgsfield) — РЕКОМЕНДОВАНО ПРОПУСТИТЬ**: OG сделана кодом, скрины Dream Gold реальные, фон — WebGL-поле; доп. генерация не нужна (ждёт решения владельца).
- ✅ **Фаза 9 (полировка) ЗАКРЫТА** — `impeccable audit` (14/20 «Good», слабое звено a11y; AI-slop тест ПРОЙДЕН — поле+комета distinctive) → `polish` пофиксил P1/P2:
  - **Контраст:** `--color-dim` 0.55→0.62 (≈7:1), `--color-faint` 0.32→0.5 (≈4.9:1) — оба проходят WCAG AA (раньше faint ≈2.6:1 проваливал). `color-scheme: dark`.
  - **Читаемость над полем:** утилита `.legible` (text-shadow-гало) на корнях 7 секций — текст не тонет в ярких дюнах, поле НЕ затемняется (его не трогаем — это подпись). WhatIDo пропущен (текст на стеклокарточках).
  - **Focus:** глобальный `:focus-visible` (2px fg outline) — раньше был только слабый UA-дефолт.
  - **Тач-цели:** соц-ссылки + LangSwitcher ≥24px (WCAG 2.5.8).
  - **Форма:** `aria-describedby` связывает ошибку с полем.
  - **Перф:** Field масштабируется на мобайле (`isSmall<768`: точки 220→140, звёзды 900→520, dpr 2→1.5, antialias off).
  - **Семантика:** WhatIDo лейбл `<p>`→`<h2>`.
  - **reduced-motion: ОСТАВЛЕН ОТКЛЮЧЁННЫМ** (повторное решение владельца 2026-06-19 — кнопку-тогл НЕ добавляли). `onScroll`-кэш P3 НЕ трогали (pinned-секция меняет высоту → сломало бы uScroll). Manifesto 15rem overflow — проверено Playwright'ом, **overflow нет** на 375/768/1280.
  - Проверки: `npm test` 16/16, build+typecheck чисто, Playwright-скрины 1280/768/375 (контраст/фокус/легибилити/форма) — ок. Скрипты verify удалены.
- ✅ **Фаза 10 — DONE, сайт live** (детали ниже в «Git / деплой»). Опц. на будущее: Lighthouse-замер, in-page «reduce motion» toggle (если передумает).
- ℹ️ Запуск/проверка: dev иногда отваливается между сессиями — `npm run dev` (порт 3000); при смене `.env` ПЕРЕЗАПУСКАТЬ сервер. Проверка: Claude_in_Chrome (**выбирать Browser 1 Windows**) или Playwright (`.verify/*.py`, `reduced_motion="no-preference"`, потом удалять). Анимации видны везде.

## Git / деплой (Фаза 10 — В ПРОЦЕССЕ)

- Git: ветка переименована **`master`→`main`**. **GitHub-репо создан:** https://github.com/yuvelir2255/vladyslav-babii-portfolio — **PUBLIC** (владелец выбрал public; секрет-скан перед пушем чист: `.env.local` не в истории, токенов в коде нет). `main`→`origin/main`.
- **Vercel:** проект `portfolio` под командой **`vladyslav-s-projects9`** (Vercel-аккаунт vladbabii31; кросс-аккаунт с GitHub yuvelir2255). Первый `vercel deploy` ушёл в **target=production** (дефолт для первого деплоя нового проекта). Сборка **Ready**. Прод-алиас: **https://portfolio-vladyslav-s-projects9.vercel.app**. Проект НЕ привязан к Git (деплой был CLI-аплоадом) → автодеплой по push пока НЕ работает.
- ✅ **САЙТ LIVE И ПУБЛИЧЕН** (владелец отключил Deployment Protection + добавил env, агент перевыкатил прод `vercel deploy --prod`). Все роуты **200**: `/`,`/en`,`/uk`,`/sitemap.xml`,`/robots.txt`,`/en/opengraph-image`. Живой рендер проверен Playwright-скрином. Метатеги/canonical/OG/sitemap — абсолютные, на прод-домен `VERCEL_PROJECT_PRODUCTION_URL` = `portfolio-lake-one-70s392j0p5.vercel.app` (некрасивый, но валидный публичный алиас; сменится на свой домен через `NEXT_PUBLIC_SITE_URL`).
- ✅ **Форма → Telegram проверена на проде:** `POST /api/contact → 200 {"ok":true}`, доходит в Telegram (chat 491267017).
- ✅ **Push-деплой подключён и подтверждён:** `git push` в `main` автоматически триггерит прод-деплой (владелец подключил Git в Settings→Git). Последний коммит на проде — `7840c42`.
- **Свой домен** — в самом конце по отдельному «ок» (тогда выставить `NEXT_PUBLIC_SITE_URL`). Старый `about-me-website` (статика на Vercel с автодеплоем) живёт до переключения; не трогать.

## Дизайн — пост-деплой моушн-пасс v1 (по просьбе владельца «красивые анимации»)

Через brainstorming согласован «курированный набор v1», исполнен по gsap-конвейеру (ScrollTrigger), проверен Playwrightّом (моушн + перф + overflow). **Не закоммичено — ждёт ревью/коммита.**

- **Разные reveal'ы:** `ui/ClipReveal` (BUILD клип-вайп слева, CRAFT справа — два «движения»), `ui/SignatureLine` (char-scrub: «Ready when it matters.» собирается на входе, полный белый к центру), `ui/StaggerReveal` (скрины кейса въезжают стаггером). Заменили однотипный пословный reveal в Manifesto/Signature/Work.
- **Поле оживает (`field/Field.tsx`):** `uEnergy` от скорости скролла (ярче/выше дюны, плавно гаснет) + `uTint` — поле мягко холоднеет к нижним секциям (mood). Тонко.
- **Velocity-skew (`providers/SmoothScroll.tsx`):** обёртка контента + лёгкий `skewY` по скорости Lenis (clamp ±1°). Из-за трансформа обёртки пиннингу **WhatIDo задан `pinType:'transform'`** (иначе position:fixed-пин ломается) — проверено, секвенция карточек жива, overflow нет на 375/768/1280.
- **Hero showcase — имя собирается из частиц (`ui/HeroName.tsx`):** имя «Vladyslav Babii» семплится из реального `<h1>` (computed-шрифт, offscreen-канвас → пиксели) в точки; частицы слетаются из рассеянного облака в форму имени (~1.15с, старт после прелоадера delay 1.5с), затем растворяются — проявляется чёткий DOM-`<h1>` (hand-off через WAAPI, читаемый финал). Отдельный 2D-канвас поверх поля (НЕ трогает WebGL-поле), в той же эстетике светящихся точек; цикл идёт только во время входа (~2с), потом стоп — нет постоянной нагрузки. `<h1>` остаётся в DOM (SEO/a11y, один h1), без JS виден (фолбэк); ждёт `document.fonts.ready` для совпадения глифов. Роль появляется после (delay 2.7с). Проверено desktop+mobile (перенос ок), overflow нет, 0 ошибок в консоли.
- reduced-motion по-прежнему ОТКЛЮЧЁН (решение владельца). Дальше по желанию: микро-взаимодействия/delight, иммерсия кейса, поле↔имя взаимодействие глубже.
