# Portfolio — правила проекта и статус

> Проектный CLAUDE.md (приоритетнее глобального ~/.claude/CLAUDE.md). Отвечать по-русски.

## Что это

Персональный сайт-портфолио **Vladyslav Babii** (разработчик: Telegram Mini Apps, сайты, AI-продукты). Аудитория — обычные люди познакомиться с автором; внизу — мягкая заявка для агентств/предпринимателей.

**Статус (2026-06-21): ПРОД (`main`) = hero + About «The Inmate» + Services «Charges» + Work «Evidence» (Case File).** Концепт утверждён — **«Case File» (тюрьма/дело: тёмный бетон + сталь + prison-orange, метафора «неудержимый билдер, сбегающий из клетки демок»)**. Секция Evidence смержена в `main` (`31ad07d`, ветка `feat/work-evidence`) и задеплоена в прод.

> ⚠️ **Важно (история):** merge hero в `main` ЗАМЕНИЛ прежний полный сайт на hero-only. Прежний прод (i18n `[locale]`, контактная форма `sections/Contact.tsx` + `api/contact` → Telegram, SEO `sitemap.ts`/`robots.ts`/OG-image, кейс Dream Gold) — НЕ на проде, цел в ветке **`archive/luca-portfolio-2026-06-20`** и в истории до `11586d9` — оттуда портировать форму/SEO, не писать заново.

- **Сделано (на проде, `main`):** фундамент (токены/шрифты), hero (2 экрана) с **манифестом (pin + слово-за-словом подсветка по скроллу)**, секция **About «The Inmate»** — досье: `src/components/about/*` + `src/content/about.ts`, моушн `DossierMotion` (on-enter reveal без пиннинга: фото+текст одновременно сверху-вниз, declassify грифов кликом/тапом, count-up возраста, DrawSVG-отпечаток, штамп), 2 фото «билдер в камере» (`public/media/booking/inmate-build.webp` цвет + `inmate-detail.webp` ч/б, Nano Banana Pro). **Единый фон** (один `ConcreteBg`, per-section grain/bars и border-t-разделители сняты), **единый курсор** (без scan-варианта), FileNav (#yard/#about живые), booking-табличка, прелоадер «lockdown», тумблер звука (`/audio/breakbeat.mp3`), адаптив + a11y. `impeccable` пройден. Секция **Services «Charges»** (обвинительный акт): `src/components/services/*` + `src/content/services.ts`, моушн `ChargesMotion` — **единый pin+snap на всех экранах** (один count на сцене, скролл сменяет; слэм штампа GUILTY: scale+rotate `back.out` + DrawSVG ink-bleed + микро-тряска; ScrambleText цифры, SplitText заголовка; индекс-рейл `Guilty ×N`/01–05/прогресс; финал-вердикт SENTENCE **без CTA**; reveal каждого пункта один раз). FileNav #services живой. `impeccable` audit→polish пройден. **OG/SEO (частично):** `metadataBase` + `openGraph`/`twitter` в `layout.tsx` + генерируемая og-картинка `src/app/opengraph-image.tsx` (+`twitter-image.tsx`, next/og, 1200×630, стиль «дело», без внешних ассетов). Мугшот hero: `border`→`ring` (+`h-auto`) — ушёл next/image aspect-варнинг/CLS. Секция **Work «Evidence»** (вещдоки): `src/components/work/*` + `src/content/evidence.ts`, моушн `EvidenceMotion` (**on-enter reveal без пина**, сиблинг `DossierMotion`); устройство-экспонат с каруселью живых скринов Dream Gold (`EVID-01`, тап/точки/авто, пауза по hover), бирка chain-of-custody со штрихкодом, 3 форензик-маркера фишек (ScrambleText номера), слэм-штамп ADMITTED на углу телефона + микро-тряска, полоса CHAIN OF CUSTODY с живой ссылкой `t.me/dreamgold_jewelry_bot/shop`, `EVID-02 · PENDING` (сайт DG). FileNav #work живой. `impeccable` audit→polish (≈19/20). Мелкий фикс заодно: хедер Charges прячется на экране вердикта. **Свежий прод-коммит `31ad07d`.**
- **СЛЕДУЮЩАЯ ЗАДАЧА — РЕАЛИЗОВАТЬ секцию VISITING HOURS (`#contact`).** Брейншторм ЗАКОНЧЕН, спека+план готовы → **выполнять ПО ПЛАНУ** `docs/superpowers/plans/2026-06-21-contact-visiting-hours.md` (исполнение **inline**, начиная с **Task 0** — ветка `feat/contact-visiting-hours` от свежего `main`). Концепт: финал **«Release» (Cell Door + свет)**, две стадии (on-enter прутья «садятся» → on-submit разъезжаются + дневной свет; форма-заявка 3 поля → Telegram, бэкенд **порт из archive** `src/lib/telegram.ts` + `api/contact/route.ts`; directory типографская; honeypot+валидация; env `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`). Форма↔моушн развязаны DOM-событием `vb:released`. **P1-CTA править НЕ надо** — href уже `#work`/`#contact` (оживут сами). **Дальше после контакта:** SEO `sitemap`/`robots` (OG готов); Soul ID при 3–5 фото. Конвейер: план→TDD→impeccable. **Новые секции — на feature-ветке от свежего `main`.** **Сайт EN-only — i18n отменён.**
- **Спеки:** hero — `docs/superpowers/specs/2026-06-20-hero-prison-portfolio-design.md`; about — `docs/superpowers/specs/2026-06-20-about-the-inmate-design.md`; services — `docs/superpowers/specs/2026-06-21-services-charges-design.md`; work/Evidence — `docs/superpowers/specs/2026-06-21-work-evidence-design.md`; contact/Visiting Hours — `docs/superpowers/specs/2026-06-21-contact-visiting-hours-design.md`.
- **Планы:** hero — `docs/superpowers/plans/2026-06-20-hero-prison.md`; about — `docs/superpowers/plans/2026-06-20-about-the-inmate.md` (реализован inline); services — `docs/superpowers/plans/2026-06-21-services-charges.md` (реализован inline); work/Evidence — `docs/superpowers/plans/2026-06-21-work-evidence.md` (реализован inline, в проде); **contact/Visiting Hours — `docs/superpowers/plans/2026-06-21-contact-visiting-hours.md` (ГОТОВ К ИСПОЛНЕНИЮ, начинать с Task 0)**.

### Evidence — РЕАЛИЗОВАНА (в проде)

Секция **work/«Evidence»** собрана и смержена в прод (форма **A** — один иммерсивный экспонат; направление **«Evidence Locker»**; on-enter reveal без пина; нейминг **`EVID-01`** для Dream Gold, мугшоту в hero оставлен его «Exhibit A»). Спека: `docs/superpowers/specs/2026-06-21-work-evidence-design.md`; план: `docs/superpowers/plans/2026-06-21-work-evidence.md`.

- **NB про jsdom-тесты:** reveal-моушн срабатывает на маунте (как About/Services) → `SplitText` дробит заголовок, `.from(autoAlpha:0)` прячет custody-строки. Тесты Evidence это учитывают (проверка по data-атрибуту/`querySelectorAll('a')`, не наивный `getByText`/`getByRole`).
- **Будущие exhibit'ы** (EVID-03+) добавляются тем же приёмом, когда появятся новые живые кейсы.

### Бэклог из полного разбора сайта (2026-06-21) — ПОСЛЕ Evidence

Полный аудит прода сделан. Не сделано (по решению владельца — позже):

- **P1 (в САМЫЙ КОНЕЦ, по явному решению владельца):** hero-CTA — «Open the case file ↗» → `#work` (секция теперь ЕСТЬ — можно нацелить) и «Make contact · visiting hours open» → `#contact` (появится с VISITING HOURS); FileNav `#work` уже живой, `#contact` оживёт после секции. Чинить в самом конце.
- **P3:** у секции About нет семантического `<h2>` (эйбров — стилизованный `<p>`); дата на booking-табличке hero в будущем (`06·26·2026`).
- **Подсказка (не критично):** About `inmate-build.webp` ловит next/image LCP-варнинг (можно добавить `loading="eager"`/priority, если будет в зоне правок).
- **Хорошо (не трогать):** концепт-цельность «Case File», моушн-крафт, типо-система, контраст AA, реального горизонтального скролла на мобиле нет.

## Стек

Next.js 16 (App Router) · React 19 · TS strict · **Tailwind v4** (токены в `src/app/globals.css` через `@theme`, без tailwind.config) · Vitest · Prettier/ESLint/Husky (lint-staged).

**Установлено:** `gsap` 3.15 + `@gsap/react` (useGSAP; в `src/lib/gsap.ts` зарегистрированы ScrollTrigger/SplitText/ScrambleText/**DrawSVG**; Flip бесплатен, но пока не используется), `lenis` (плавный скролл), `ogl` (WebGL-шейдер фона), `sharp` (devDep, оптимизация картинок). Шрифты через `next/font`: Anton (дисплей), JetBrains Mono (систем/моно), Oswald (лейблы), Saira Stencil One (штампы), Permanent Marker (рукописная табличка).

## Состояние сборки hero — заметки для продолжения

- **Структура:** `src/components/{hero,about,bg,motion,cursor,chrome}`, контент в `src/content/{hero,about}.ts`, GSAP-реестр `src/lib/gsap.ts`. Страница: `src/app/page.tsx` = Preloader + ConcreteBg + Cursor + FileNav + `<main>`(Hero + About) + AudioToggle (Hero отдаёт фрагмент, `<main>` в page оборачивает Hero+About).
- **Прелоадер (`chrome/Preloader.tsx`):** intake 0→100 → «дверь» уезжает вверх. Показ **раз за сессию** (`sessionStorage` `vb19-intake`); инлайн-скрипт в `<body>` ставит `html.intake-seen` до отрисовки (CSS прячет прелоадер — без вспышки на ревизите), поэтому на `<html>` стоит `suppressHydrationWarning`. Scroll-lock — через Lenis на `window.__lenis` (выставлен в `SmoothScroll`).
- **Тумблер звука (`chrome/AudioToggle.tsx`):** off по умолчанию, `preload="none"` (грузится по клику), graceful если файла нет, SVG-иконка volume-x/2 (Lucide-style, инлайн). Трек подключён: **`/audio/breakbeat.mp3`** (3.99 МБ, 256 kbps), volume 0.4, loop.
- **Мугшот (фото владельца):** `public/media/booking/mugshot.webp` (q90, 717КБ). Исходники в `assets/` (gitignored). Лицо — пока image-to-image (Higgsfield Nano Banana Pro); **апгрейд на Soul ID ждёт 3–5 фото лица владельца** — потом просто заменить файл.
- **Решение владельца:** `prefers-reduced-motion` НАМЕРЕННО не уважаем (движение всегда вкл). Прочую a11y держим.
- **Тесты:** в `src/test/setup.ts` есть полифилл `matchMedia` (jsdom + GSAP). Моушн в юнит-тестах не гоняем — проверяем в браузере.
- **Шейдер (OGL) и курсор:** только desktop; на тач/без-WebGL → статичный бетон (фолбэк).
- **FileNav:** плавающий чип сверху по центру; секции с ироничным неймингом (THE YARD/THE INMATE/CHARGES/EVIDENCE/VISITING HOURS); анимирована (gsap). Якоря `#yard`/`#about` живые; `#services/#work/#contact` оживут по мере добавления секций.
- **Фон (единый):** один `ConcreteBg` (fixed: радиальный градиент + OGL-шейдер + grain + bars) на весь сайт. Per-section `grain`/`bars` и border-t-разделители сняты — секции прозрачны над общим фоном. Курсор один и тот же везде.
- **Higgsfield CLI** установлен и авторизован — для генерации (Soul, звук). **Перед каждой генерацией показывать стоимость в кредитах и ждать «ок».**
- **Открытые вопросы:** только Soul-фото лица (нужно 3–5, сейчас 1). Звук-трек подключён ✓, `impeccable` (audit→polish→optimize→adapt) пройден ✓.
- **a11y (контраст) — закрыто:** все текстовые токены на bg проходят AA — bone 15.5:1, steel 6.5:1, orange 6.1:1, **dim `#827c70` 4.62:1** (был #6f6a60 3.56:1, поднят в polish). Появился токен `--color-orange-soft` (orange@12%) для hover/focus-подложек.
- **Windows-нюанс:** prettier переформатирует файлы на коммите → перечитывать перед Edit.

## Как запускать (Windows!)

- ⚠️ **cwd сбрасывается** после каждой команды → начинать команды с `Set-Location 'C:\Users\ювелир\Desktop\portfolio'`.
- Dev: `npm run dev` → http://localhost:3000. Build: `npm run build`. Tests: `npm test`. Types: `npm run typecheck`.
- Проверка в браузере — через preview-инструмент (`preview_start` и т.д.).

## Контент и история

- **Весь реальный контент владельца** (имя, роль, био EN/UK, манифест, услуги, контакты, соцсети, кейс Dream Gold) сохранён в **`docs/content-backup.md`** — брать оттуда при сборке, не печатать заново.
- **Скриншоты Dream Gold** — в `public/media/dream-gold/` (`shop/product/sizer/cart/extra.png`).
- **Старый сайт целиком** сохранён в git-ветке **`archive/luca-portfolio-2026-06-20`**.

## Правила

- **Не клонировать чужие сайты 1:1.** Вдохновение/уровень качества — да, но оригинальное и узнаваемо ЕГО.
- Новая фича/изменение поведения (ДО кода) → brainstorming → план, потом код.
- Дизайн-конвейер: `frontend-design` / `design-taste-frontend` / `ui-ux-pro-max` → `impeccable` перед «готово».
- «Готово» = чистый `npm run build` + проверено в браузере (375/768/1280).
- a11y: контраст ≥4.5:1, видимый focus, alt/aria (НО reduced-motion не уважаем — см. выше). Адаптив mobile-first.
- Иконки — только SVG-сеты (Lucide/Tabler для UI, Simple Icons для брендов). Эмодзи как иконки — нельзя.
- Секреты — только в `.env.local` (gitignored), в код/git не попадают.

## Git / деплой

- **`main` = живой прод (hero + About).** Прод-URL: **https://portfolio-vladyslav-s-projects9.vercel.app** (+ алиас `…-git-main-…`). GitHub: https://github.com/yuvelir2255/vladyslav-babii-portfolio (PUBLIC). Ветки `feat/hero-case-file` и `feat/about-the-inmate` (PR #1) смержены в `main`. Откат прошлого прода (hero-only) — Vercel promote `426f653`.
- Vercel: проект `portfolio` (team `vladyslav-s-projects9`). **Push любой ветки = preview-деплой. Push в `main` = ПРОД-деплой.** Деплой/push в `main` — только по явному «ок» владельца.
- **Новые секции — на feature-ветках от свежего `main`** (не прямо в main). Перед merge-в-main/прод-деплоем — сверять scope ветки с текущим продом и явно показывать удаляемое (память `deploy-scope-check-before-prod`); откат держать наготове.
- Conventional Commits, по-русски, осмысленными группами. Деструктивный git заблокирован глобальным хуком.
