# Portfolio — правила проекта и статус

> Проектный CLAUDE.md (приоритетнее глобального ~/.claude/CLAUDE.md). Отвечать по-русски.

## Что это

Персональный сайт-портфолио **Vladyslav Babii** (разработчик: Telegram Mini Apps, сайты, AI-продукты). Аудитория — обычные люди познакомиться с автором; внизу — мягкая заявка для агентств/предпринимателей.

Концепт — **«Case File»** (тюрьма/дело: тёмный бетон + сталь + prison-orange; метафора «неудержимый билдер, сбегающий из клетки демок»). Сайт **EN-only** (i18n отменён владельцем).

## Статус

**ПРОД (`main`) = полный нарратив сайта ЗАВЕРШЁН:** hero → About «The Inmate» → Services «Charges» → Work «Evidence» → Contact «Visiting Hours». Прод-URL: **https://portfolio-vladyslav-s-projects9.vercel.app**.

- **Опционально на будущее:** Soul ID лица при 3–5 фото (заменить `public/media/booking/mugshot.webp`). **SEO-перенос (sitemap/robots) ОТМЕНЁН владельцем — не делать.**
- Любые правки — на feature-ветке от свежего `main`, конвейер **план → TDD → impeccable** (см. «Правила»).

## Стек

Next.js 16 (App Router, RSC, route handlers) · React 19 · TS strict · **Tailwind v4** (токены в `src/app/globals.css` через `@theme`, без tailwind.config) · Vitest + @testing-library/react · Prettier/ESLint/Husky (lint-staged).

**Библиотеки:** `gsap` 3.15 + `@gsap/react` (useGSAP). GSAP-реестр `src/lib/gsap.ts` — зарегистрированы **ScrollTrigger / SplitText / ScrambleText / DrawSVG** (Flip бесплатен, не используется). `lenis` (плавный скролл), `ogl` (WebGL-шейдер фона), `sharp` (devDep, оптимизация картинок). Шрифты через `next/font`: **Anton** (дисплей), **JetBrains Mono** (моно/систем), **Oswald** (лейблы), **Saira Stencil One** (штампы), **Permanent Marker** (рукописная табличка).

## Структура и карта секций

`src/app/page.tsx` = `Preloader` + `ConcreteBg` + `Cursor` + `FileNav` + `<main>`(Hero → About → Services → Evidence → Contact) + `AudioToggle`.

Каждая секция: папка `src/components/<секция>/*` + контент `src/content/<секция>.ts` + свой моушн-компонент. Все якоря FileNav живые.

| Секция | Папка / контент | Моушн | Суть |
| --- | --- | --- | --- |
| hero (`#yard`) | `components/hero` · `content/hero.ts` | манифест: pin + слово-за-словом подсветка по скроллу | 2 экрана; booking-табличка; мугшот; CTA `#work`/`#contact` |
| About (`#about`) | `components/about` · `content/about.ts` | `DossierMotion` — **scroll-scrub** (ревил привязан к скроллу, per-element, без пина) | досье; **грифы рассекречиваются по клику** (закрыты по умолчанию, намёк `▸ declassify`, scramble-ревил внутри `RedactedField`; авто-declassify по скроллу убран); count-up возраста; DrawSVG-отпечаток; Disposition/Tools — bone; 2 фото «билдер в камере» (`inmate-build.webp` цвет + `inmate-detail.webp` ч/б) |
| Services (`#services`) | `components/services` · `content/services.ts` | `ChargesMotion` — **горизонтальная лента карт** в пине: scrub двигает трек влево, карты 01→05 появляются одна за другой **без снапов**; активная в фокусе (scale/opacity), соседние приглушены; `build(perCard,finalPct,withBlur)` | обвинительный акт; карты **«charge sheet»** (`CountCard`: стальная рамка + кроп-марки, chain-of-custody штрих-код, гигантский номер, **слэм-штамп GUILTY в футере** `PLEA ENTERED · GUILTY` — не поверх текста, скан-грейн); очень мягкий ревил при каждой активации (`revealCount`, replay-safe `fromTo`: номер — fade+подъём **без скрамбла**, тексты `sine.out 1.2s` + SplitText заголовка, мягкий стаггер); нижний рейл `Guilty ×N · 01–05 · Sentence` (`CaseRail`); **финал 05→вердикт — bloom** (лента scale-down+blur+fade → `Verdict` собирается per-line маской `SplitText{mask}` + glow, готов к ~92% — почти у конца пина, без мёртвого хвоста перед Evidence; reversible, blur только desktop); без CTA |
| Work (`#work`) | `components/work` · `content/evidence.ts` | `EvidenceMotion` — **scroll-scrub** (как `DossierMotion`) | один экспонат-вещдок Dream Gold (`EVID-01`): **ручная карусель скринов — стрелки ◀▶ + точки, без автоплея** (`ExhibitDevice`), бирка chain-of-custody, 3 форензик-маркера, слэм-штамп ADMITTED; **живые ссылки `Open exhibit`/`Web demo` в колонке EVID-01** (`ExhibitLinks`: бот + `dreamgold-jewelry.vercel.app`); **EVID-02 → крупная pending-карта** (`PendingExhibit`: пунктир-рамка, штамп PENDING, скан-луч, пульс-точка — «слот ожидает интейка», маркетинговый сайт DG ещё делается); `ChainOfCustody` удалён (разнесён) |
| Contact (`#contact`) | `components/contact` · `content/contact.ts` | `ReleaseMotion` — стадия 1 **scroll-scrub** + стадия 2 по событию `vb:released`; **подпись-финал — one-shot** (см. ниже) | «Release» (Cell Door + свет): прутья садятся → на отправке разъезжаются (`xPercent ±110`) + дневной свет (feathered-шафт + blur); форма 3 поля → Telegram; типографская directory; **авторская подпись-финал `AuthorSignature` — рукописное имя «Vladyslav Babii» (Permanent Marker `--font-marker`, наклон -2°, оранжевый DrawSVG-росчерк, caption «Signed…»), супер-плавное появление: feathered-маска (CSS-var `--reveal`) + blur→sharp (desktop) + подъём, разовый `expo.out` по входу (`toggleActions: play none none reverse`); строка-таглайн «Ready when it matters.» убрана** |

**Бэкенд формы:** `src/lib/telegram.ts` (validate / honeypot=`company` / buildMessage / send) + `src/app/api/contact/route.ts` (honeypot → in-memory rate-limit → валидация → отправка). Env `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` — только `.env.local` (+ пустой `.env.example`), на Vercel в Production+Preview. Живую доставку владелец проверяет сам на проде.

**SEO/OG (готово):** `metadataBase` + `openGraph`/`twitter` в `layout.tsx` + генерируемая og-картинка `src/app/opengraph-image.tsx` (+`twitter-image.tsx`, next/og, 1200×630, без внешних ассетов). Sitemap/robots — отменены (см. «Статус»).

## Ключевые решения и NB

- **Единый фон:** один `ConcreteBg` (fixed: радиальный градиент + OGL-шейдер + grain + bars) на весь сайт; секции прозрачны над ним (per-section grain/bars и border-t-разделители сняты). **Единый курсор** везде (`cursor/Cursor.tsx`): один круг 16px, **приклеен к острию** (`gsap.quickSetter`, без сглаживания/шлейфа), магнитность CTA (`data-magnetic`); на desktop **системный курсор скрыт** (`html.cursor-custom { cursor:none }`, класс ставит JS при инициализации — на тач не трогается).
- **Шейдер (OGL) и курсор — только desktop;** на тач/без-WebGL → статичный бетон (фолбэк).
- **Прелоадер (`chrome/Preloader.tsx`):** intake 0→100 → «дверь» уезжает вверх. Показ **раз за сессию** (`sessionStorage` `vb19-intake`); инлайн-скрипт в `<body>` ставит `html.intake-seen` до отрисовки (без вспышки на ревизите) → на `<html>` стоит `suppressHydrationWarning`. Scroll-lock через Lenis (`window.__lenis`, выставлен в `SmoothScroll`).
- **Навигация по якорям (`SmoothScroll.tsx`):** делегированный click-handler на `a[href^="#"]` → **мгновенный телепорт** (`lenis.scrollTo(target,{immediate:true})`, без прокрутки через весь сайт) + **плавное появление секции целиком** (CSS-transition `opacity 0→1` за 0.55с — намеренно CSS, а не gsap: gsap-тикер связан с Lenis и после телепорта проскочил бы твин). per-element scrub при телепорте уже в конечном состоянии (по-словная хореография не переигрывается — это fade блока). Уважает модификаторы/среднюю кнопку, синхронит hash через `replaceState`. Покрывает FileNav + hero-CTA.
- **Тюнинг скролла «на ощущение»:** Lenis `lerp 0.09` (чуть больше глайда). Пины: hero `+=170%` (scrub `0.6`, манифест короче под новый текст ~17 слов), Services — горизонтальная лента, `build(perCard,finalPct,withBlur)`: desktop `55/60/true`, mobile `46/50/false`, scrub `0.5`, **без снапов** (финал укорочен 85→60 / 64→50 — вердикт собирается к ~92%, без залипания перед Evidence). Тюнятся в `ManifestMotion.tsx` / `ChargesMotion.tsx` / `SmoothScroll.tsx`.
- **Ревил-модель секций = scroll-scrub (`DossierMotion`/`EvidenceMotion`/`ReleaseMotion`):** появление каждого элемента привязано к его положению в скролле (`gsap.from(el,{…, scrollTrigger:{trigger:el, start:'top ~90%', end:'top ~60%', scrub:0.6}})`) — листаешь, проявляется; быстрее скроллишь, быстрее; **вверх отматывает** (природа scrub). DrawSVG (отпечаток, «пакет») и count-up — тоже scrub. Короткие акценты, которые скрабить нельзя (scramble грифов/номеров, слэмы штампов GUILTY/ADMITTED/DECLASSIFIED) — разовым `onEnter`/`toggleActions` при доскролле. Тюнинг «на ощущение»: `scrub` (сглаживание), `start`/`end` (ширина банды). Hero-манифест (pin, слово-за-словом) и Services (pin, **горизонтальная лента карт + bloom вердикта**) — отдельные pin-моушны, не из scroll-scrub-семейства.
- **Тумблер звука (`chrome/AudioToggle.tsx`):** off по умолчанию, `preload="none"`, graceful если файла нет. Трек **`/audio/breakbeat.mp3`** (256 kbps), **volume 0.01** (очень тихий фон), loop; плавный fade-in с 0 при включении и fade-out при выключении (gsap-твин громкости).
- **Hover-roll кнопок/ссылок (`ui/RollText.tsx` + `.roll*` в globals.css):** при `:hover`/`:focus-visible` родителя с классом `group` видимый текст уезжает вверх, снизу выкатывается дубль (`aria-hidden`, чтобы accessible-name не двоился). Навешан на hero-CTA, Work-ссылки (`ExhibitLinks`), Contact directory (`ContactChannels`). Чистый CSS, без JS.
- **`prefers-reduced-motion` НАМЕРЕННО не уважаем** (решение владельца — движение всегда вкл). Прочую a11y держим.
- **a11y-контраст (закрыто):** все токены на bg проходят AA — bone 15.5:1, steel 6.5:1, orange 6.1:1, **dim `#827c70` 4.62:1**. Есть `--color-orange-soft` (orange@12%) для hover/focus-подложек.
- **Мугшот:** `public/media/booking/mugshot.webp` (исходники в `assets/`, gitignored). Лицо — пока image-to-image (Higgsfield Nano Banana Pro); апгрейд на **Soul ID ждёт 3–5 фото** — потом просто заменить файл.
- **Higgsfield CLI** установлен и авторизован (Soul, звук). **Перед каждой генерацией показывать стоимость в кредитах и ждать «ок».**

### Тесты (NB)

- `npm test` зелёный (контент/lib/route/компоненты под тестами). Моушн в юнит-тестах не гоняем — проверяем в браузере.
- **jsdom + reveal-моушн:** reveal срабатывает на маунте (About/Services/Work/Contact) → `SplitText` дробит заголовки, `.from(autoAlpha:0)` прячет элементы. Тесты ищут по DOM/`data`-атрибутам (`querySelector`/`getByLabelText`/`querySelectorAll('a')`), **не** наивный `getByText`/`getByRole`.
- `src/test/setup.ts`: полифилл `matchMedia` обёрнут в `typeof window` (route-тесты идут в node-env через `@vitest-environment node`).
- **Windows:** prettier переформатирует staged-файлы на коммите → **перечитывать файл перед следующим Edit**.

## Как запускать (Windows!)

- ⚠️ **cwd сбрасывается** после каждой команды → начинать с `Set-Location 'C:\Users\ювелир\Desktop\portfolio'`.
- Dev: `npm run dev` → http://localhost:3000 · Build: `npm run build` · Tests: `npm test` · Types: `npm run typecheck`.
- Проверка в браузере — через preview-инструмент (`preview_start` и т.д.).

## Правила

- **Не клонировать чужие сайты 1:1.** Вдохновение/уровень качества — да, но оригинальное и узнаваемо ЕГО.
- Новая фича/изменение поведения (ДО кода) → brainstorming → план, потом код.
- Дизайн-конвейер: `frontend-design` / `design-taste-frontend` / `ui-ux-pro-max` → `impeccable` перед «готово».
- «Готово» = чистый `npm run build` + проверено в браузере (375/768/1280).
- a11y: контраст ≥4.5:1, видимый focus, alt/aria (НО reduced-motion не уважаем — см. выше). Адаптив mobile-first.
- Иконки — только SVG-сеты (Lucide/Tabler для UI, Simple Icons для брендов). Эмодзи как иконки — нельзя.
- Секреты — только в `.env.local` (gitignored), в код/git не попадают.

## Git / деплой

- **`main` = живой прод (полный сайт).** GitHub: https://github.com/yuvelir2255/vladyslav-babii-portfolio (PUBLIC). Vercel: проект `portfolio` (team `vladyslav-s-projects9`).
- **Push любой ветки = preview-деплой. Push в `main` = ПРОД-деплой.** Деплой/push в `main` — только по явному «ок» владельца. Откат — Vercel promote предыдущего READY-деплоя.
- **Новые секции/правки — на feature-ветках от свежего `main`** (не прямо в main). Перед merge-в-main/прод-деплоем — сверять scope ветки с текущим продом и явно показывать удаляемое (память `deploy-scope-check-before-prod`); откат держать наготове.
- Conventional Commits, по-русски, осмысленными группами. Деструктивный git заблокирован глобальным хуком.

## Бэклог (мелочи, не критично)

- **Дата** на booking-табличке hero — `21 · 06 · 2026` (формат DD · MM · YYYY, `src/content/hero.ts` → `placard.date`).
- **Мугшот hero (`mugshot.webp`, `priority`)** роняет dev-only next/image aspect-варнинг из-за 0.75px суб-пиксельного округления (размеры уже выставлены под файл 480×642). В прод-сборке варнинга нет, CLS/искажений нет — оставлено как есть.
- **Опционально:** добавить `priority`/`loading="eager"` на About `inmate-build.webp` (LCP-кандидат), если будет в зоне правок.

> Закрыто в полировке (deploy `6191848`): About `<h2>` (был стилизованный `<p>`), `h-auto` на About-картинках (ушёл aspect-варнинг), тач-цель declassify 44px, плашка Contact ниже FileNav, плавная навигация по якорям, EVID-02 → Coming soon.

## Артефакты и история

- **Актуальный контент сайта — в `src/content/*.ts`** (источник правды; владелец переписал тексты 2026-06-22). `docs/content-backup.md` — устаревший снимок 2026-06-20 (только имя/соцсети/локация ещё валидны), копирайт оттуда НЕ брать.
- **Скриншоты Dream Gold** — `public/media/dream-gold/` (`shop/product/sizer/cart/extra.png`).
- **Спеки** (`docs/superpowers/specs/`): `2026-06-20-hero-prison-portfolio-design`, `2026-06-20-about-the-inmate-design`, `2026-06-21-services-charges-design`, `2026-06-21-work-evidence-design`, `2026-06-21-contact-visiting-hours-design`.
- **Планы** (`docs/superpowers/plans/`): hero, about, services, work-evidence, contact-visiting-hours — все реализованы.
- **Старый сайт «luca»** (прежний прод до hero-merge) цел в ветке **`archive/luca-portfolio-2026-06-20`** — **только история, больше к нему НЕ обращаемся** (форма собрана заново, SEO отменён, тащить оттуда нечего).
