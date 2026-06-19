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
- ✅ **Фаза 5 (структура готова, ждём фото)** — подпись + кейс + контент-модель:
  - ✅ **Task 5.1** контент-модель **по TDD** (`content/projects/`): `types.ts` (Project/Locale/validateProject) + `dream-gold-app.ts` (live) + `dream-gold-site.ts` (coming-soon) + `index.ts`; `projects.test.ts` 4/4. Медиа-пути в модели уже прописаны: `/media/dream-gold/{shop,product,sizer}.png`.
  - ✅ **Task 5.2** Signature (`sections/Signature.tsx`): «Ready when it matters.» по центру, пословный reveal. Проверено.
  - ✅ **Task 5.3 (каркас)** кейс Dream Gold (`sections/WorkDreamGold.tsx` + `ui/TiltCard.tsx`): лид/фишки/ссылки/теги из модели, 3 телефона с 3D-наклоном (TiltCard) + «coming soon» сайт + слот «More projects». **СЕЙЧАС телефоны — плейсхолдеры; ждём фото владельца в `public/media/dream-gold/` (shop/product/sizer[/cart].png)** → заменить плейсхолдеры на `next/image` (src/width/height уже в модели). Higgsfield — если фото не хватит.
  - Порядок секций в `page.tsx`: Hero → Manifesto → About → WhatIDo → Signature → WorkDreamGold.
- ⏭️ **СЛЕДУЮЩИЙ ШАГ — Фаза 6**: контакт-форма «Let's talk» → serverless → Telegram (план §Фаза 6, TDD). Спека §5.7: крупно «Let's talk.» + подзаголовок, тёмная форма Name·Email·Project·Submit, соц-иконки, строка контактов.
- ⏭️ Далее: **7** i18n (тест паритета + полный перенос) → **8** SEO/OG + графика (Higgsfield) → **9** полировка (impeccable/a11y/перф) → **10** деплой.
- ℹ️ Запуск/проверка: dev-сервер иногда отваливается между сессиями — перезапустить `npm run dev` (порт 3000). Проверка в браузере — Claude_in_Chrome (**уточняет, какой браузер — выбирать Browser 1 Windows**) навигацией на localhost:3000; анимации теперь видны везде. Для точных кадров motion — Playwright.

## Git / деплой

Локальный git, ветка **`master`** (переименовать в `main` при подключении GitHub). GitHub-репо ещё НЕ создан (по желанию владельца — для бэкапа). Vercel — позже. Старый `about-me-website` (статика, задеплоен на Vercel с автодеплоем) живёт до переключения; не трогать.
