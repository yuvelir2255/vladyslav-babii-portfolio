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
- ⚠️ **У владельца в Windows включён `prefers-reduced-motion: reduce`** (анимации в системе выключены) → все анимации сайта корректно самоотключаются (поле — статичный кадр, курсор — системный, прелоадер мгновенный, без плавного скролла). Чтобы увидеть ПОЛНУЮ кинематику: включить «Эффекты анимации» в Windows (Параметры → Спец. возможности → Визуальные эффекты) и обновить, либо эмулировать `prefers-reduced-motion: no-preference` в DevTools.

## Правила

- Дизайн-конвейер: `frontend-design` / `design-taste-frontend` / `ui-ux-pro-max` → `impeccable` перед «готово». «Готово» = чистый `npm run build` + проверено в браузере (375/768/1280).
- a11y: уважать `prefers-reduced-motion` (спокойная статичная версия), контраст ≥4.5:1, видимый focus.
- Осознанные переопределения design-taste по просьбе владельца: **кастомный кометный курсор** + **«scroll to explore»** (скилл их не любит — но владелец явно захотел aboutluca-стиль).
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
- 🔄 **Фаза 2** — WebGL-поле (`src/components/field/Field.tsx`): ✅ дюны из частиц с глубиной/горизонтом. ОСТАЛОСЬ: ⭐ звёздное небо, 🖱️ реакция частиц на курсор, 🎬 скролл-камера (uScroll уже есть в шейдере), ✦ слова BUILD/CRAFT «вылепленные» из частиц (фолбэк — DOM-текст).
- ⏭️ Далее: **Фаза 3** герой (имя, EN/UK-переключатель, соц-ссылки, «scroll to explore», манифест BUILD→CRAFT) → **4** карточки → **5** подпись + кейс Dream Gold + контент-модель → **6** контакт-форма→Telegram → **7** i18n (полный перенос копирайта + тест паритета) → **8** SEO/OG + графика (Higgsfield) → **9** полировка (impeccable/a11y/перф) → **10** деплой.

## Git / деплой

Локальный git, ветка **`master`** (переименовать в `main` при подключении GitHub). GitHub-репо ещё НЕ создан (по желанию владельца — для бэкапа). Vercel — позже. Старый `about-me-website` (статика, задеплоен на Vercel с автодеплоем) живёт до переключения; не трогать.
