# Impeccable audit — план фиксов (трекинг)

> Источник: полный аудит сайта (impeccable `audit`) 2026-06-22. Ветка `feat/impeccable-audit-fixes` от свежего `main`.
> Базовый Audit Health Score: **14/20** (A11y 3 · Perf 3 · Responsive 2 · Theming 3 · Anti-patterns 3). Цель — 18–20.
> Конвейер: точечно, чистый build + браузер 375/768/1280 после каждого блока, коммит группами. Деплой в `main` — только по «ок» владельца.

## P1 — критично (до «релиза»)

- [x] **P1-1 · Горизонтальный скролл на мобайле (~53px)** — ✅ ИСПРАВЛЕНО (`html{overflow-x:clip}`, `globals.css`). Проверено: 375 `canScrollX=0`, слэмы (DECLASSIFIED opacity→1) и пины (манифест + Services-лента) целы, консоль/build/тесты чисто.
  Слэм-штампы `.stamp-declassified` (About) и `.stamp-admitted` (Evidence) в начальном GSAP-состоянии (`opacity:0` + `scale~1.8` + rotate, `position:absolute` с правым офсетом, вне обрезающего контейнера) раздувают документ до 428px. На 768/1280 бага нет.
  Фикс: глобальная страховка `html { overflow-x: clip }` (clip не создаёт скролл-контейнер, не ломает pin/sticky, не трогает overflow-y). Проверить: 375 overflow=0, пины (Services) работают, слэмы видны, консоль чистая.
  Категория: Responsive. → поднимает Responsive 2→4.

- [x] **P1-2 · Форма без инлайн-валидации/индикаторов** — ✅ ИСПРАВЛЕНО.
  Валидация вынесена в чистый `src/lib/contact-validation.ts` (изоляция: клиент не тащит Telegram-send; `telegram.ts` реэкспортит). `VisitForm` теперь: пер-полевая клиентская валидация (та же `validateContact`, что на сервере), `aria-invalid` + `aria-describedby` + `role="alert"` на пер-полевых ошибках, `*`-индикатор «обязательно» (вне `<label>`, чтобы не пачкать accessible-name), фокус на первое невалидное, `aria-busy` при отправке, success → `role="status"`. Копи ошибок в `content/contact.ts` (`form.errors`). TDD: +3 теста (пустой/битый сабмит без fetch, очистка ошибки на вводе). Проверено: 74/74 тестов, build/typecheck чисто, живой eval (3 ошибки + фокус vf-name).

- [x] **P1-3 · FileNav не подсвечивает текущую секцию** — ✅ ИСПРАВЛЕНО.
  IntersectionObserver (центр-бэнд `rootMargin -45%`) → активный пункт получает `aria-current="true"` + подсветка (bg-orange-soft, оранжевый код, `●`). jsdom-guard на IO. TDD: тест с мок-IO (пересечение work → aria-current на Evidence). NB: IO в preview-окружении (headless) колбэки не шлёт — проверено юнит-тестом, не браузером.

- [x] **P1-4 · Hero-screen2 — безымянная секция без заголовка** — ✅ ИСПРАВЛЕНО.
  Манифест `<p data-manifest>` → `<h2 data-manifest>` (визуально идентично, закрывает дыру в outline; паттерн как Services/Evidence — заявление = h2). Иерархия h1(имя)→h2(манифест)→h2(секции) без пропусков.

## P2 — следующий проход

- [x] **P2-perf · `/impeccable optimize`** — ✅ ИСПРАВЛЕНО.
  - `will-change: transform` снят с базовых `.ev-frame > img` и `[data-ev-zoom]`, перенесён внутрь `:hover` — не держим ~6 композитных слоёв в покое (память/GPU).
  - Шейдер (`ShaderBg.tsx`): `visibilitychange` → останавливает RAF при скрытой вкладке, возобновляет при возврате (cleanup снимает listener).
  - Прелоадер (`Preloader.tsx`): бар `width:%` → `transform: scaleX()` + `origin-left` (композитится, без layout-thrash). Счётчик-число остаётся на `setState` — это намеренно живой каунтер (60/с на 2.6с, разово за сессию, на статичном экране).
  - (Отложено как opt) bloom blur max / box-shadow-ховеры — заметного джанка не выявлено, трогать не стал.
  Проверено: 75/75 тестов, build/typecheck чисто, канвас рендерится, CSS компилируется.

- [x] **P2-theme · токены + align-fix** (выбран консервативный объём — владелец) — ✅ ИСПРАВЛЕНО.
  - `--color-on-orange (#160d06)` + `--color-surface (#2a2620)` в `@theme` → заменены все usages (HeroScreen1, VisitForm, .evtag / ConcreteBg-градиент, CaseRail). Значения 1:1.
  - scrim: все `rgba(16,15,13,A)` (×9: globals.css штампы, FileNav, ExhibitDevice, AudioToggle, VisitForm) → `color-mix(in srgb, var(--color-bg) A%, transparent)`. Убрана дупликация bg сырым rgb; **значения 1:1** (проверено вычисленным стилем: `srgb(16,15,13)/0.72`).
  - **align-fix:** Services `max-w-[1200px]` → `1100px` (шапка Charges выровнена с About/Evidence/Contact).
  - **СОЗНАТЕЛЬНО НЕ делал** (по решению владельца — feel-тюнинг не трогаем): унификация flex-пропорций колонок, размеров штампов (18/20/22), ритма py-28→py-24.
  - **Отложено в бэклог** (pure-maintainability, value-preserving, churny): шкала бордер-радиусов в токены; z-index в CSS-переменные (сейчас числовые `z-50/60/70/100` + локальные — без магии 9999, читаемо).
  Проверено: build/typecheck/75 тестов чисто, вычисленные цвета идентичны (0 визуальных изменений).

## P3 — полировка (`/impeccable polish`)

- [ ] `text-wrap: balance` на заголовках (Verdict/CountCard/Contact), `pretty` на прозе.
- [ ] Трейлинг-пробел `about.ts:21`.
- [ ] Копирайт: «At large» vs «Held at Warsaw» (решение владельца); BrE `labour`→`labor`; тон count 05; `break-words` на email в ошибке.
- [ ] Точки карусели различимы не только цветом (размер/обводка активной).
- [ ] About `inmate-build.webp` → `priority` (LCP при заходе с якоря).

## Замечено по ходу (добавить в P3/бэклог)

- [ ] Console `[error]`: «Encountered a script tag while rendering React component» — inline `<script>` в `layout.tsx` (intake-detection через `dangerouslySetInnerHTML`). Пред-существующее, на прод не влияет (SSR-скрипт исполняется до гидрации), но шумит в консоли preview. Рассмотреть `next/script` strategy=beforeInteractive или вынести в отдельный механизм.

## Систeмное (фон)

- «Система на 80%» — много раскладочных констант магией → закрывает P2-extract.
- Повтор скелета секций (эйбрау→заголовок→проза ×4) — сломать ритм в одной секции (Charges уже отличается).

## Прогресс

| Блок | Статус | Коммит |
| --- | --- | --- |
| P1-1 | ✅ готово | feat-ветка |
| P1-2 | ✅ готово | feat-ветка |
| P1-3 | ✅ готово | feat-ветка |
| P1-4 | ✅ готово | feat-ветка |
| P2-perf | ✅ готово | feat-ветка |
| P2-theme | ✅ готово (consv) | feat-ветка |
| P3 | ⬜ | — |
