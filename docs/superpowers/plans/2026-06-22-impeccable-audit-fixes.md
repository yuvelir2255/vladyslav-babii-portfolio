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

- [ ] **P1-3 · FileNav не подсвечивает текущую секцию** — `FileNav.tsx`.
  IntersectionObserver/ScrollTrigger → `aria-current="true"` + визуальная подсветка активного пункта (scroll-spy).

- [ ] **P1-4 · Hero-screen2 — безымянная секция без заголовка** — `HeroScreen2.tsx:6,15`.
  Дать `<section aria-label="…">` или сделать манифест `<h2>` (визуально без изменений).

## P2 — следующий проход

- [ ] **P2-perf · `/impeccable optimize`**
  - `will-change: transform` → внутрь `:hover` (`globals.css` `.ev-frame > img` :461, `[data-ev-zoom]` :600).
  - Шейдер: пауза RAF при `document.hidden` (`ShaderBg.tsx`).
  - Прелоадер: прогресс через `transform: scaleX` вместо `width`+setState (`Preloader.tsx:104`).
  - (Опц.) bloom blur — снизить max / промоут слоя под `filter`; box-shadow-ховеры — оценить джанк на слабом GPU.

- [ ] **P2-theme/symmetry · `/impeccable extract` → токены**
  - `--color-on-orange (#160d06 ×3)`, `--color-surface (#2a2620 ×2)`, scrim через `color-mix(--color-bg)` (вместо rgba ×8 / 7 альф).
  - Шкала бордер-радиусов (`3/6/8/10/14…` → `--r-sm/md/lg`).
  - z-index — карта слоёв/переменные (`--z-chrome/cursor/overlay`).
  - Унифицировать: flex-ratio колонок (3 разных), `max-w` Services 1200→1100, размеры штампов (18/20/22→единый), вертикальный ритм `py-24` vs `py-28`.

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
| P1-3 | ⬜ | — |
| P1-4 | ⬜ | — |
| P2-perf | ⬜ | — |
| P2-theme | ⬜ | — |
| P3 | ⬜ | — |
