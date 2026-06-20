# Портфолио Vladyslav Babii — план реализации

> **Для агентов-исполнителей:** РЕКОМЕНДУЕМЫЙ СУБ-СКИЛЛ — `superpowers:subagent-driven-development` (или `superpowers:executing-plans`). Шаги помечены чекбоксами `- [ ]`.
> Спека: [`docs/superpowers/specs/2026-06-19-portfolio-design.md`](../specs/2026-06-19-portfolio-design.md). При расхождении — спека главнее, синхронизировать.

**Goal:** Собрать с нуля кинематографичный двуязычный (EN/UK) портфолио-сайт уровня aboutluca: WebGL-поле частиц, GSAP-скролл-хореография, секции hero → манифест → карточки → кейс Dream Gold → контакт-форма в Telegram.

**Architecture:** Next.js (App Router) + TypeScript strict + Tailwind. Постоянный WebGL-фон (OGL) под контентом; скролл (Lenis) драйвит GSAP ScrollTrigger-хореографию. Контент проектов — типизированный TS + MDX. Контакт-форма → serverless → Telegram. i18n — next-intl с тестом паритета.

**Tech Stack:** Next.js · React · TypeScript · Tailwind · GSAP (ScrollTrigger, SplitText) · Lenis · OGL (WebGL) · next-intl · next/og · Vitest · Vercel. Графика — Higgsfield.

**Расположение:** новый репозиторий `portfolio` (имя финализуется), новый Vercel-проект. Свой домен — в самом конце. Старый `about-me-website` живёт до переключения.

**Принцип качества:** визуальные секции делаются дизайн-конвейером (`frontend-design` → `design-taste-frontend` → `ui-ux-pro-max`, вычитка `impeccable`) и проверяются в браузере (скриншоты, `webapp-testing`/preview). «Готово» = чистый `npm run build` + проверено в браузере на 375/768/1280 (скилл `verification-before-completion`).

---

## Карта файлов (что создаём)

```
portfolio/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx          # шрифты, провайдеры (Lenis, i18n), Cursor, Grain, Preloader
│  │  │  ├─ page.tsx            # композиция секций
│  │  │  └─ opengraph-image.tsx # OG (next/og)
│  │  ├─ api/contact/route.ts   # форма → Telegram
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  ├─ components/
│  │  ├─ field/                 # WebGL: Field.tsx, scene/*, shaders/*
│  │  ├─ providers/SmoothScroll.tsx
│  │  ├─ ui/                    # Cursor, Grain, Preloader, LangSwitcher, Reveal, SplitReveal,
│  │  │                         # Marquee, MagneticButton, GlassCard, TiltCard
│  │  └─ sections/             # Hero, Manifesto, About, WhatIDo, Signature, WorkDreamGold,
│  │                            # NextProjects, Contact, Footer
│  ├─ content/projects/*.ts(x)  # типизированный контент проектов (+ MDX тела кейсов)
│  ├─ i18n/                     # routing.ts, request.ts, navigation.ts
│  ├─ lib/                      # gsap.ts (регистрация), motion.ts (хелперы), telegram.ts, utils.ts
│  └─ messages/                 # en.json, uk.json
├─ public/media/                # фото Dream Gold, hero-арт, текстуры (Higgsfield)
├─ tests/                       # vitest: i18n-parity, contact, content, utils
├─ tailwind.config.ts · next.config.ts · vitest.config.ts · .prettierrc · eslint.config.mjs
└─ .husky/ · .lintstagedrc · .env.example · README.md
```

---

## Фаза 0 — Каркас проекта и инфраструктура

### Task 0.1: Скаффолд Next.js
**Files:** создаётся проект `portfolio/`
- [ ] **Шаг 1.** В `C:\Users\ювелир\Desktop` выполнить:
```bash
npx create-next-app@latest portfolio --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
- [ ] **Шаг 2.** Проверка: `cd portfolio && npm run dev` → открыть `http://localhost:3000`, увидеть стартовую страницу. `Ctrl+C`.
- [ ] **Шаг 3.** Проверка сборки: `npm run build` → Expected: успешная сборка без ошибок.

### Task 0.2: Зависимости
- [ ] **Шаг 1.** Анимации/3D/i18n:
```bash
npm i gsap @gsap/react lenis ogl next-intl
```
- [ ] **Шаг 2.** Dev-инструменты:
```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom prettier prettier-plugin-tailwindcss husky lint-staged @mdx-js/react @next/mdx
```
- [ ] **Шаг 3.** Проверка: `npm ls gsap lenis ogl next-intl` без ошибок версий.

### Task 0.3: Тулинг (Prettier/Husky/lint-staged/Vitest) — как в проектах Влада
- [ ] **Шаг 1.** Скилл **`setup-pre-commit`** (husky + lint-staged + Prettier(+ESLint)). `.prettierrc`: одинарные кавычки, `endOfLine: auto`; `*.md` в `.prettierignore`.
- [ ] **Шаг 2.** `vitest.config.ts` (jsdom, alias `@`), скрипт `"test": "vitest run"` в package.json.
- [ ] **Шаг 3.** Проверка: `npm test` (0 тестов — ок), `npx prettier -c .` проходит.

### Task 0.4: База — шрифты, токены, layout
- [ ] **Шаг 1.** Шрифты через `next/font` (display-гротеск + Space Mono); CSS-переменные.
- [ ] **Шаг 2.** Tailwind-токены палитры из спеки §6 (bg `#0a0b0d`, fg `#f4f4f2`, акценты карточек), типошкала, контейнеры.
- [ ] **Шаг 3.** `globals.css`: reset, базовый фон/цвет, `prefers-reduced-motion` хук-класс.
- [ ] **Шаг 4.** Проверка: `npm run build` ок; на `/` виден тёмный фон и шрифты.

### Task 0.5: Git + GitHub + Vercel (каркас в проде)
- [ ] **Шаг 1.** `git init -b main`; `.gitignore` (Next дефолт + `.env*`, `.vercel`, `.superpowers/`).
- [ ] **Шаг 2.** `gh repo create yuvelir2255/portfolio --private --source=. --remote=origin --push`.
- [ ] **Шаг 3.** `vercel deploy --yes` (preview), проверить сборку на Vercel; затем подключить Git (Settings → Git, см. memory deploy-setup — кросс-аккаунт) для автодеплоя.
- [ ] **Шаг 4.** Коммит: `chore: scaffold next.js portfolio + tooling`.

---

## Фаза 1 — Дизайн-система и примитивы

### Task 1.1: Дизайн-направление (конвейер)
- [ ] **Шаг 1.** Скиллы `frontend-design` + `design-taste-frontend` + `ui-ux-pro-max`: зафиксировать палитру (тёмная база + приглушённые акценты), пары шрифтов, типошкалу, ритм отступов, моушн-тайминги (easing, длительности). Записать как токены в Tailwind/CSS-переменные.
- [ ] **Шаг 2.** Проверка: мини-страница `/_styleguide` (только dev) со шкалой типов, цветов, кнопок — скриншот в браузере, ок по вкусу.

### Task 1.2: Плавный скролл (Lenis) + GSAP реестр
**Files:** `src/components/providers/SmoothScroll.tsx`, `src/lib/gsap.ts`
- [ ] **Шаг 1.** `lib/gsap.ts`: один раз `gsap.registerPlugin(ScrollTrigger, useGSAP)`; экспорт настроенного `gsap`, дефолтные ease. (SplitText — плагин GSAP, ныне бесплатный.)
- [ ] **Шаг 2.** `SmoothScroll.tsx`: Lenis + связка с `ScrollTrigger.update` через `gsap.ticker`; уважать `prefers-reduced-motion` (выключать smooth).
- [ ] **Шаг 3.** Подключить провайдер в `[locale]/layout.tsx`.
- [ ] **Шаг 4.** Проверка: длинная заглушка-страница скроллится плавно; reduced-motion — обычный скролл.

### Task 1.3: Кастомный курсор, grain, прелоадер
**Files:** `ui/Cursor.tsx`, `ui/Grain.tsx`, `ui/Preloader.tsx`
- [ ] **Шаг 1.** `Cursor`: перекрестие/точка, follow на rAF, магнитные/hover-состояния; скрыт на touch.
- [ ] **Шаг 2.** `Grain`: лёгкий film-grain оверлей (CSS/SVG noise), `pointer-events:none`.
- [ ] **Шаг 3.** `Preloader`: «LOADING» + растущая линия; уходит по событию готовности (таймаут-фолбэк, чтобы не блокировать LCP). «enter» — опционально (флаг, по умолчанию off).
- [ ] **Шаг 4.** Проверка в браузере: курсор/grain/прелоадер выглядят как в спеке; на мобиле курсор отключён.
- [ ] **Commit:** `feat: design system, smooth scroll, cursor, grain, preloader`.

---

## Фаза 2 — WebGL-поле частиц (сигнатура) ⭐

### Task 2.1: Каркас сцены OGL
**Files:** `components/field/Field.tsx`, `field/scene/renderer.ts`, `field/shaders/*.glsl(.ts)`
- [ ] **Шаг 1.** `Field.tsx`: `<canvas>` на весь вьюпорт (`position:fixed; inset:0; z-index:0`), инициализация OGL `Renderer/Camera/Transform`, resize-обсёрвер, dpr cap = 2, render-loop на rAF, пауза вне видимости (IntersectionObserver / `document.hidden`).
- [ ] **Шаг 2.** Проверка: пустая сцена рендерится (чёрный фон), без утечек (cleanup на unmount).

### Task 2.2: Дюны из частиц (heightfield points)
- [ ] **Шаг 1.** Геометрия: сетка точек (например 200×200), позиции в вершинном шейдере смещаются по **шумовой высоте** (Perlin/Simplex в GLSL) → «дюны»; точечный рендер с мягким bloom/glow (аддитивный blend, круглая точка во фрагментном шейдере).
- [ ] **Шаг 2.** Анимация: время `uTime` гонит лёгкое движение дюн; плотность/яркость точек настраиваемы.
- [ ] **Шаг 3.** Производительность: число точек масштабируется по ширине/перфу; на мобиле меньше.
- [ ] **Шаг 4.** Проверка в браузере: видны светящиеся дюны, ~60fps на десктопе (DevTools Performance).

### Task 2.3: Звёздное небо + падающие звёзды
- [ ] **Шаг 1.** Слой звёзд (статичные точки с мерцанием в шейдере).
- [ ] **Шаг 2.** Падающие звёзды: периодические «метеоры» (стрик со шлейфом), рандом по индексу/времени (без `Math.random` в SSR — клиентский rAF).
- [ ] **Шаг 3.** Проверка: звёзды мерцают, иногда летит метеор (как в кадрах референса).

### Task 2.4: Реакция на курсор + скролл-камера
- [ ] **Шаг 1.** Курсор: uniform `uMouse`, частицы рядом слегка отталкиваются/ярчают.
- [ ] **Шаг 2.** Скролл: прогресс (от Lenis/ScrollTrigger) → uniform `uScroll`, двигает камеру вперёд и «растит» дюны (как у Luca «scroll = камера»).
- [ ] **Шаг 3.** Reduced-motion: статичное поле, без камеры/метеоров.
- [ ] **Шаг 4.** Проверка: при скролле сцена летит вперёд; курсор реагирует.

### Task 2.5: Слова, «вылепленные» из частиц (VISION-эффект)
- [ ] **Шаг 1.** Рендер слова в offscreen-canvas → сэмпл пикселей → целевые позиции точек; интерполяция частиц к форме буквы по прогрессу секции (как «VISION» встаёт из дюн).
- [ ] **Шаг 2.** Управление: какие слова и когда — из секции-манифеста (Фаза 3) через общий стор/контекст поля.
- [ ] **Шаг 3.** Проверка: слово BUILD/CRAFT собирается из частиц и плавно рассыпается.
- [ ] **Commit:** `feat(field): webgl particle dunes, stars, cursor+scroll, word morph`.

> ⚠️ Самая сложная фаза. Если OGL-морфинг слов окажется дорогим — фолбэк: слово рендерится DOM-текстом поверх поля с свечением (как в текущем сайте), частицы — только фон. Решение принять по перфу, зафиксировать в спеке.

---

## Фаза 3 — Секции героя и манифеста (моушн)

### Task 3.1: Примитивы reveal
**Files:** `ui/Reveal.tsx`, `ui/SplitReveal.tsx`, `lib/motion.ts`
- [ ] **Шаг 1.** `SplitReveal`: разбивка на слова (GSAP SplitText), появление/исчезновение **по словам** (stagger), завязка на ScrollTrigger. Безопасный фолбэк: видимо без JS.
- [ ] **Шаг 2.** Тест (Vitest): `motion.ts` хелпер таймингов (чистая функция) — unit-тест значений.
- [ ] **Шаг 3.** Проверка в браузере: текст проявляется/исчезает по словам плавно.

### Task 3.2: Hero (минимал)
**Files:** `sections/Hero.tsx`
- [ ] **Шаг 1.** Раскладка: слева «Vladyslav Babii», справа `LangSwitcher`, центр «scroll to explore», снизу соц-ссылки. Поле — на фоне. Дизайн-конвейер.
- [ ] **Шаг 2.** Проверка: 375/768/1280, контраст, focus-visible; скриншоты.

### Task 3.3: Манифест BUILD → CRAFT
**Files:** `sections/Manifesto.tsx`
- [ ] **Шаг 1.** Беты: слово (из поля, Task 2.5) + текст манифеста (SplitReveal). BUILD — копирайт из спеки §5.2; CRAFT — слова стека stagger-появлением.
- [ ] **Шаг 2.** Проверка в браузере: ритм/тайминги как у референса; reduced-motion ок.
- [ ] **Commit:** `feat(sections): hero + manifesto with word-by-word motion`.

### Task 3.4: About
**Files:** `sections/About.tsx`
- [ ] **Шаг 1.** Копирайт из спеки §5.3; reveal по абзацам; дизайн-конвейер.
- [ ] **Шаг 2.** Проверка: адаптив/контраст; скриншоты.

---

## Фаза 4 — Карточки «What I do»

### Task 4.1: GlassCard (стеклянная цветная карточка)
**Files:** `ui/GlassCard.tsx`
- [ ] **Шаг 1.** Стеклянная карточка со свечением (цвет-проп), крупный типографик-глиф названия + подпись (спека §5.4). Hover → динамика (глиф/блик/tilt). Дизайн-конвейер.
- [ ] **Шаг 2.** Проверка: 5 цветов читаемы на тёмном; hover плавный; a11y (focus).

### Task 4.2: Секвенция карточек (появление с приближением)
**Files:** `sections/WhatIDo.tsx`
- [ ] **Шаг 1.** ScrollTrigger-таймлайн: карточки появляются **одна за другой с zoom-in**, текущая плавно исчезает, приходит следующая (как в кадрах референса). Контент — 5 услуг.
- [ ] **Шаг 2.** Reduced-motion: простой список карточек без zoom.
- [ ] **Шаг 3.** Проверка в браузере: секвенция плавная, hover работает.
- [ ] **Commit:** `feat(sections): what-i-do glass cards sequence`.

---

## Фаза 5 — Подпись + кейс Dream Gold

### Task 5.1: Контент-модель проектов
**Files:** `content/projects/types.ts`, `content/projects/dream-gold-app.ts`, `content/projects/dream-gold-site.ts`, `tests/content.test.ts`
- [ ] **Шаг 1.** Тест (Vitest): каждый проект валиден по схеме (обязательные поля: slug, title, role, summary, tags, media, links, status, locale-копирайт EN/UK).
- [ ] **Шаг 2.** Запустить — FAIL (нет типов/данных).
- [ ] **Шаг 3.** Реализовать `types.ts` (TS-типы) + данные проектов (mini-app = `live`, dream-gold-site = `coming-soon`).
- [ ] **Шаг 4.** Тест — PASS.

### Task 5.2: Подпись «Ready when it matters.» + переход
**Files:** `sections/Signature.tsx`
- [ ] **Шаг 1.** Крупная подпись, плавный переход (затемнение поля → «обычная» секция в том же стиле).
- [ ] **Шаг 2.** Проверка в браузере.

### Task 5.3: Кейс Dream Gold (Telegram Mini App)
**Files:** `sections/WorkDreamGold.tsx`, `ui/TiltCard.tsx`, `public/media/dream-gold/*`
- [ ] **Шаг 1.** Фото с телефона (предоставит Влад) — оптимизировать (`next/image`, sizes, lazy). При отсутствии части — генерация/доводка через **Higgsfield** (скилл `higgsfield-generate`).
- [ ] **Шаг 2.** Раскладка кейса (спека §5.6): лид, 3D-tilt скриншоты, фишки, ссылки (бот + демо). Дизайн-конвейер.
- [ ] **Шаг 3.** Проверка: адаптив, изображения без CLS, ссылки рабочие.

### Task 5.4: «Скоро» + слот будущих проектов
**Files:** `sections/NextProjects.tsx`
- [ ] **Шаг 1.** Карточка Dream Gold website `coming-soon` + плейсхолдер «More projects soon», данные из контент-модели (рост без правки секции).
- [ ] **Шаг 2.** Проверка.
- [ ] **Commit:** `feat(work): dream gold case + content model + coming soon`.

---

## Фаза 6 — Контакт-форма → Telegram

### Task 6.1: Серверный роут (TDD)
**Files:** `src/app/api/contact/route.ts`, `src/lib/telegram.ts`, `tests/contact.test.ts`
- [ ] **Шаг 1.** Тест: `buildTelegramMessage({name,email,project})` форматирует текст; валидация отклоняет пустые/невалидный email; honeypot → тихий 200.
- [ ] **Шаг 2.** Run → FAIL.
- [ ] **Шаг 3.** Реализовать `lib/telegram.ts` (`sendMessage` через Bot API, секреты из env) + `route.ts` (валидация, honeypot, rate-limit по IP, вызов sendMessage). Секреты только на сервере.
- [ ] **Шаг 4.** Run → PASS. `.env.example`: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

### Task 6.2: Секция Contact «Let's talk»
**Files:** `sections/Contact.tsx`, `sections/Footer.tsx`
- [ ] **Шаг 1.** Тёмная форма (Name/Email/Your project/Submit) по фото-референсу, состояния loading/success/error, a11y (лейблы, ошибки, focus). Соц-иконки (Telegram, LinkedIn, GitHub, Instagram) + строка контактов (`vladbabii31@gmail.com · @BabiiVladyslav · Warsaw, PL`).
- [ ] **Шаг 2.** Footer.
- [ ] **Шаг 3.** Проверка: отправка реально доходит в Telegram (тест с реальным токеном в dev); адаптив.
- [ ] **Commit:** `feat(contact): form -> telegram serverless`.

---

## Фаза 7 — i18n (EN/UK)

### Task 7.1: next-intl + переключатель
**Files:** `src/i18n/*`, `src/messages/en.json`, `src/messages/uk.json`, `ui/LangSwitcher.tsx`, middleware/proxy
- [ ] **Шаг 1.** Настроить next-intl (locale `en` дефолт, `uk`), маршрут `/[locale]`.
- [ ] **Шаг 2.** Перенести ВЕСЬ копирайт в `en.json`/`uk.json` (укр-перевод).
- [ ] **Шаг 3.** `LangSwitcher` в шапке.

### Task 7.2: Тест паритета ключей
**Files:** `tests/i18n-parity.test.ts`
- [ ] **Шаг 1.** Тест: множества ключей `en` и `uk` идентичны; FAIL при пропуске. Run → PASS.
- [ ] **Commit:** `feat(i18n): en/uk via next-intl + parity test`.

---

## Фаза 8 — SEO/OG + графика (Higgsfield)

### Task 8.1: SEO/OG
**Files:** `app/[locale]/layout.tsx` (metadata), `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`
- [ ] **Шаг 1.** Локализованный `generateMetadata` (title/description), canonical + hreflang (en/uk/x-default), один `<h1>`.
- [ ] **Шаг 2.** OG-картинки `next/og` (кириллица-safe шрифты), `sitemap.ts`, `robots.ts`.
- [ ] **Шаг 3.** Проверка: `/sitemap.xml`, `/robots.txt`, OG превью (debugger).

### Task 8.2: Графика через Higgsfield
- [ ] **Шаг 1.** Скилл `higgsfield-generate`: при необходимости — hero-арт/текстуры/доводка скринов Dream Gold, OG-фон. Сложить в `public/media/`.
- [ ] **Шаг 2.** Проверка: вес/формат (webp/avif), без CLS.
- [ ] **Commit:** `feat: seo, og images, generated assets`.

---

## Фаза 9 — Полировка и QA

### Task 9.1: Вычитка дизайна
- [ ] **Шаг 1.** Скилл **`impeccable`** (`audit` → `polish`) по всем секциям; при необходимости `accessibility-review`.
- [ ] **Шаг 2.** Чек адаптива 375/768/1280: нет горизонтального скролла, тач-цели ≥44px, контраст ≥4.5:1, focus-visible, `prefers-reduced-motion`.

### Task 9.2: Перформанс
- [ ] **Шаг 1.** WebGL: число частиц по перфу, пауза вне вьюпорта, дегрейд reduced-motion; LCP/CLS ок; тяжёлое — `dynamic import`.
- [ ] **Шаг 2.** Lighthouse (mobile) — зафиксировать метрики, исправить регрессы.
- [ ] **Шаг 3.** `npm run build` чисто, `npm test` зелёный (скилл `verification-before-completion`).
- [ ] **Commit:** `chore: polish, a11y, performance pass`.

---

## Фаза 10 — Деплой

### Task 10.1: Прод
- [ ] **Шаг 1.** Env в Vercel (`TELEGRAM_*`), `vercel --prod` (или push при подключённом Git).
- [ ] **Шаг 2.** Проверка прод-URL: HTTP 200, форма доходит в Telegram, обе локали, OG.
- [ ] **Шаг 3.** Обновить memory (`deploy-setup`/новый проект): URL, репо, проект.
- [ ] **Шаг 4 (позже, по готовности и одобрению Влада):** свой домен + переключение со старого `about-me-website`.

---

## Self-review (покрытие спеки)

- §5.0 прелоадер → 1.3 · §5.1 hero → 3.2 · §5.2 манифест → 2.5+3.3 · §5.3 about → 3.4 · §5.4 карточки → 4.1–4.2 · §5.5 подпись/переход → 5.2 · §5.6 Dream Gold/coming-soon → 5.1+5.3+5.4 · §5.7 контакт→Telegram → 6.1–6.2 · §5.8 footer → 6.2 · §6 дизайн-система → 0.4+1.1 · §7 моушн → 1.2+2.4+3.1 · §8 контент-модель/форма → 5.1+6.1 · §9 i18n → 7 · §10 перф/a11y → 9 · §11 SEO → 8.1.
- Плейсхолдеров-«TODO» нет; визуальные задачи имеют критерии приёмки + дизайн-скилл + браузер-проверку (осознанное решение метода, см. шапку).
- Открытый риск: морфинг слов в WebGL (Task 2.5) — есть фолбэк.
