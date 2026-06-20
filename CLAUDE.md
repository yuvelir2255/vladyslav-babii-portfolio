# Portfolio — правила проекта и статус

> Проектный CLAUDE.md (приоритетнее глобального ~/.claude/CLAUDE.md). Отвечать по-русски.

## Что это

Персональный сайт-портфолио **Vladyslav Babii** (разработчик: Telegram Mini Apps, сайты, AI-продукты). Аудитория — обычные люди познакомиться с автором; внизу — мягкая заявка для агентств/предпринимателей.

**Статус (2026-06-20): hero собран, фаза 4 завершена.** Направление утверждено — концепт **«Case File» (тюрьма/дело: тёмный бетон + сталь + prison-orange, метафора «неудержимый билдер, сбегающий из клетки демок»)**. Сборка идёт в ветке **`feat/hero-case-file`** (в `main` НЕ смержено).

- **Сделано:** фундамент (токены/шрифты), статичный hero (2 экрана), весь моушн (Lenis / SplitText-имя / ScrambleText-декод манифеста / курсор-прожектор / OGL-шейдер бетона), плавающая навигация **FileNav**, рукописная booking-табличка на мугшоте, **прелоадер «lockdown» (раз за сессию, без кадра-вспышки), тумблер звука (off по умолчанию), адаптив 375/768/1280 + a11y-проход (focus-visible, тач-цели ≥44px)**.
- **Осталось — перед merge в `main`:** `impeccable`-вычитка, апгрейд лица на **Soul ID**, добавить звук-трек (CC0). Потом merge в `main` + деплой (по «ок»). Звук-трек кладётся в `/audio/ambient.mp3` (см. `public/audio/README.md`).
- **Спека:** `docs/superpowers/specs/2026-06-20-hero-prison-portfolio-design.md`
- **План (со статусом задач):** `docs/superpowers/plans/2026-06-20-hero-prison.md` — **фаза 4 = Task 16 (прелоадер), 17 (звук), 18 (адаптив/a11y)**.

## Стек

Next.js 16 (App Router) · React 19 · TS strict · **Tailwind v4** (токены в `src/app/globals.css` через `@theme`, без tailwind.config) · Vitest · Prettier/ESLint/Husky (lint-staged).

**Установлено под hero:** `gsap` 3.15 + `@gsap/react` (useGSAP; плагины ScrollTrigger/SplitText/ScrambleText/DrawSVG/Flip — бесплатны, регистрируются в `src/lib/gsap.ts`), `lenis` (плавный скролл), `ogl` (WebGL-шейдер фона), `sharp` (devDep, оптимизация картинок). Шрифты через `next/font`: Anton (дисплей), JetBrains Mono (систем/моно), Oswald (лейблы), Saira Stencil One (штампы), Permanent Marker (рукописная табличка).

## Состояние сборки hero — заметки для продолжения

- **Структура:** `src/components/{hero,bg,motion,cursor,chrome}`, контент в `src/content/hero.ts`, GSAP-реестр `src/lib/gsap.ts`. Страница: `src/app/page.tsx` (Preloader + ConcreteBg + Cursor + FileNav + Hero + AudioToggle).
- **Прелоадер (`chrome/Preloader.tsx`):** intake 0→100 → «дверь» уезжает вверх. Показ **раз за сессию** (`sessionStorage` `vb19-intake`); инлайн-скрипт в `<body>` ставит `html.intake-seen` до отрисовки (CSS прячет прелоадер — без вспышки на ревизите), поэтому на `<html>` стоит `suppressHydrationWarning`. Scroll-lock — через Lenis на `window.__lenis` (выставлен в `SmoothScroll`).
- **Тумблер звука (`chrome/AudioToggle.tsx`):** off по умолчанию, graceful при отсутствии файла; ждёт `/audio/ambient.mp3` (трек добавить отдельно, код менять не нужно).
- **Мугшот (фото владельца):** `public/media/booking/mugshot.webp` (q90, 717КБ). Исходники в `assets/` (gitignored). Лицо — пока image-to-image (Higgsfield Nano Banana Pro); **апгрейд на Soul ID ждёт 3–5 фото лица владельца** — потом просто заменить файл.
- **Решение владельца:** `prefers-reduced-motion` НАМЕРЕННО не уважаем (движение всегда вкл). Прочую a11y держим.
- **Тесты:** в `src/test/setup.ts` есть полифилл `matchMedia` (jsdom + GSAP). Моушн в юнит-тестах не гоняем — проверяем в браузере.
- **Шейдер (OGL) и курсор:** только desktop; на тач/без-WebGL → статичный бетон (фолбэк).
- **FileNav:** плавающий чип сверху по центру; секции с ироничным неймингом (THE YARD/THE INMATE/CHARGES/EVIDENCE/VISITING HOURS); анимирована (gsap). Якоря `#about/#services/#work/#contact` оживут по мере добавления секций.
- **Higgsfield CLI** установлен и авторизован — для генерации (Soul, звук). **Перед каждой генерацией показывать стоимость в кредитах и ждать «ок».**
- **Открытые вопросы:** Soul-фото лица; royalty-free/CC0 тюремный эмбиент для тумблера звука; вычитка `impeccable` перед merge.
- **a11y-заметка (контраст):** bone/steel/orange на bg дают ≥6:1. Токен **`--color-dim` (#6f6a60) = 3.56:1** — ниже 4.5 для мелкого текста (используется в «scroll to escape», подписях CTA, лейблах FileNav). Намеренно приглушён; при желании поднять до ~#827c70 (≈4.6:1). Решение за владельцем.
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

- Рабочая ветка сейчас: **`feat/hero-case-file`** (запушена на GitHub как бэкап + Vercel preview; `main` чистый). GitHub-репо: https://github.com/yuvelir2255/vladyslav-babii-portfolio (PUBLIC).
- Vercel: проект `portfolio`. **Push ветки = preview-деплой. Push в `main` = ПРОД-деплой.** Деплой/push в `main` — только по явному «ок» владельца.
- Conventional Commits, по-русски, осмысленными группами. Деструктивный git заблокирован глобальным хуком.
