# Photo «Forensic Inspect» hover — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Единая ховер-сигнатура «улику достали на осмотр» (zoom + зарево рамки + кроп-марки + скан-линия + лифт тега) на все 4 фото сайта, «жирная» версия.

**Architecture:** Чистый CSS — набор утилит-классов в `globals.css` под `@media (hover:hover) and (pointer:fine)`, навешиваются на минимальные обёртки вокруг каждого фото. Без GSAP/JS (как `RollText`/штампы). Анимируем только `transform`/`opacity`/`box-shadow`/`border-color`/`filter`.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (токены в `globals.css`), `next/image`.

> **Замечание по верификации (важно):** мотон в проекте НЕ покрывается юнит-тестами (политика: «проверяем в браузере»). Поэтому это не классический TDD. Гейт «готово» = чистый `npm run build` + `npm test` зелёный (регрессия DOM-тестов) + живой прогон в браузере 1280/768/375. Существующие `alt`/`aria-*`/`data-*`/`priority`/`sizes`/размеры — сохраняем дословно.

---

## File Structure

- **Modify** `src/app/globals.css` — добавить блок утилит forensic-inspect (Task 1).
- **Modify** `src/components/hero/BookingPhoto.tsx` — обёртка `.ev-frame` вокруг мугшота + кроп-марки + скан + тег-маркер (Task 2).
- **Modify** `src/components/about/About.tsx` — `.ev-frame` на оба фото (build цвет + detail ч/б) (Task 3).
- **Modify** `src/components/work/ExhibitDevice.tsx` — `.ev-device`/`.ev-phone`/`[data-ev-zoom]`/`.ev-scan`/тег/пакет (Task 4).
- **Verify** — build + test + браузер (Task 5).

---

## Task 1: CSS-утилиты forensic-inspect

**Files:**
- Modify: `src/app/globals.css` (добавить В КОНЕЦ файла, после блока `pending-*`)

- [ ] **Step 1: Дописать блок утилит в конец `globals.css`**

```css

/* ── Forensic-inspect: ховер «улику достали на осмотр» (только desktop + мышь) ── */
@media (hover: hover) and (pointer: fine) {
  /* рамка-обёртка фото: clip + зарево рамки */
  .ev-frame {
    position: relative;
    overflow: hidden;
    transition:
      border-color 0.5s ease,
      box-shadow 0.5s ease;
  }
  .ev-frame > img {
    transition:
      transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1),
      filter 0.55s ease;
    will-change: transform;
  }
  .ev-frame:hover {
    border-color: var(--color-orange);
    box-shadow:
      0 0 0 1px var(--color-orange),
      0 18px 50px -12px color-mix(in srgb, var(--color-orange) 45%, transparent);
  }
  .ev-frame:hover > img {
    transform: scale(1.08);
  }
  /* мягче для мелкого фото (About profile) */
  .ev-frame--soft:hover > img {
    transform: scale(1.05);
  }
  /* убрать лёгкую десатурацию на ховере (About build) — «доводка в резкость» */
  .ev-frame:hover > img[data-ev-desat] {
    filter: grayscale(0);
  }

  /* угловые кроп-марки (визиры): защёлкиваются внутрь + ярчают */
  .ev-corner {
    position: absolute;
    z-index: 3;
    width: 14px;
    height: 14px;
    border-color: var(--color-steel);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.45s ease,
      border-color 0.45s ease,
      transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .ev-corner--tl {
    top: 8px;
    left: 8px;
    border-top: 2px solid;
    border-left: 2px solid;
    transform: translate(-6px, -6px);
  }
  .ev-corner--tr {
    top: 8px;
    right: 8px;
    border-top: 2px solid;
    border-right: 2px solid;
    transform: translate(6px, -6px);
  }
  .ev-corner--bl {
    bottom: 8px;
    left: 8px;
    border-bottom: 2px solid;
    border-left: 2px solid;
    transform: translate(-6px, 6px);
  }
  .ev-corner--br {
    bottom: 8px;
    right: 8px;
    border-bottom: 2px solid;
    border-right: 2px solid;
    transform: translate(6px, 6px);
  }
  .ev-frame:hover .ev-corner {
    opacity: 0.9;
    border-color: var(--color-orange);
    transform: translate(0, 0);
  }

  /* скан-линия: один проход сверху→вниз на каждый ховер */
  .ev-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 38%;
    z-index: 2;
    pointer-events: none;
    opacity: 0;
    background: linear-gradient(
      to bottom,
      transparent,
      color-mix(in srgb, var(--color-orange) 22%, transparent) 60%,
      var(--color-orange) 92%,
      transparent
    );
    mix-blend-mode: screen;
  }
  .ev-frame:hover .ev-scan,
  .ev-device:hover .ev-scan {
    animation: ev-scan-sweep 0.85s cubic-bezier(0.4, 0, 0.4, 1) 1;
  }
  @keyframes ev-scan-sweep {
    0% {
      opacity: 0;
      transform: translateY(-110%);
    }
    12% {
      opacity: 1;
    }
    88% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(330%);
    }
  }

  /* лифт/ярчание evidence-тега */
  .ev-frame [data-ev-tag],
  .ev-device [data-ev-tag] {
    transition:
      transform 0.4s ease,
      filter 0.4s ease;
  }
  /* теги hero/about (.evtag имеет базовый rotate(-3deg) — сохраняем при лифте) */
  .ev-frame:hover .evtag {
    transform: translateY(-4px) rotate(-3deg);
    filter: brightness(1.12);
  }
  /* тег Work (EVID-код): только ярче, без transform — чтобы не сбить центрирование чипа */
  .ev-device:hover [data-ev-tag] {
    filter: brightness(1.3);
  }

  /* Work: устройство-улика — зарево рамки телефона + ярче «пакет улик» */
  .ev-phone {
    transition:
      border-color 0.5s ease,
      box-shadow 0.5s ease;
  }
  .ev-device:hover .ev-phone {
    border-color: var(--color-orange);
    box-shadow:
      0 0 0 1px var(--color-orange),
      0 30px 60px -24px color-mix(in srgb, var(--color-orange) 50%, transparent);
  }
  [data-ev-zoom] {
    transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1);
    will-change: transform;
  }
  .ev-device:hover [data-ev-zoom] {
    transform: scale(1.06);
  }
  .ev-device [data-bag-draw] {
    transition:
      stroke 0.5s ease,
      stroke-opacity 0.5s ease;
  }
  .ev-device:hover [data-bag-draw] {
    stroke: var(--color-orange);
    stroke-opacity: 0.7;
  }
}
```

- [ ] **Step 2: Прогнать build (CSS компилируется)**

Run: `npm run build`
Expected: успех, без ошибок CSS/Tailwind.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(photo): CSS-утилиты forensic-inspect ховера"
```

---

## Task 2: Hero — мугшот в `.ev-frame`

**Files:**
- Modify: `src/components/hero/BookingPhoto.tsx`

**NB:** `evtag`/`stamp`/`Placard` спозиционированы с отрицательными офсетами ВНЕ изображения → они должны остаться вне `.ev-frame` (иначе `overflow:hidden` их обрежет). Поэтому `.ev-frame` оборачивает ТОЛЬКО `<Image>`; рамка/тень/скругление переезжают с картинки на обёртку.

- [ ] **Step 1: Заменить содержимое `BookingPhoto.tsx`**

```tsx
import Image from 'next/image';
import { Placard } from './Placard';

export function BookingPhoto() {
  return (
    <div className="relative w-[clamp(300px,38vw,480px)]">
      <span data-ev-tag className="evtag">
        EXHIBIT A
      </span>
      <span className="stamp">At Large</span>
      <div className="ev-frame rounded-[10px] border border-[var(--color-line)] shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
        <Image
          src="/media/booking/mugshot.webp"
          alt="Booking photo of Vladyslav Babii"
          width={480}
          height={642}
          sizes="(max-width: 790px) 300px, (max-width: 1264px) 38vw, 480px"
          priority
          className="block h-auto w-full"
        />
        <span aria-hidden="true" className="ev-scan" />
        <span aria-hidden="true" className="ev-corner ev-corner--tl" />
        <span aria-hidden="true" className="ev-corner ev-corner--tr" />
        <span aria-hidden="true" className="ev-corner ev-corner--bl" />
        <span aria-hidden="true" className="ev-corner ev-corner--br" />
      </div>
      <Placard />
    </div>
  );
}
```

- [ ] **Step 2: Build + tests (без регрессий)**

Run: `npm run build && npm test`
Expected: build чистый; тесты зелёные.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/BookingPhoto.tsx
git commit -m "feat(hero): forensic-inspect ховер на мугшот"
```

---

## Task 3: About — оба фото в `.ev-frame`

**Files:**
- Modify: `src/components/about/About.tsx` (блок левой колонки, строки ~19–51)

**NB:** `inmate-build` имеет `evtag` с отрицательным офсетом → оборачиваем только `<Image>` в `.ev-frame`. `inmate-detail` уже лежит в `overflow-hidden`-обёртке без выносных тегов → класс `ev-frame ev-frame--soft` навешиваем на существующую обёртку. На build-фото десатурацию `grayscale-[0.15]` переносим на img + маркер `data-ev-desat` (снимается на ховере). Detail остаётся ч/б (без маркера).

- [ ] **Step 1: Заменить блок левой колонки**

Найти блок:
```tsx
          <div className="flex flex-[0.8] flex-col gap-5 max-lg:w-full max-lg:max-w-[440px] max-lg:self-center">
            <div data-mugshot className="relative">
              <span className="evtag">№VB-19</span>
              <Image
                src="/media/booking/inmate-build.webp"
                alt="Vladyslav Babii building on a laptop inside a concrete cell, orange jumpsuit, code on the screens"
                width={960}
                height={1192}
                sizes="(max-width: 1024px) 80vw, 360px"
                className="block h-auto w-full rounded-[10px] border border-[var(--color-line)] grayscale-[0.15]"
              />
            </div>
            <div data-lower-tiles className="flex items-stretch gap-4">
              <div className="relative flex-1 overflow-hidden rounded-[8px] border border-[var(--color-line)]">
                <Image
                  src="/media/booking/inmate-detail.webp"
                  alt=""
                  aria-hidden="true"
                  width={640}
                  height={794}
                  sizes="180px"
                  className="block h-auto w-full grayscale"
                />
                <span className="absolute bottom-1 left-2 text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                  Profile
                </span>
              </div>
```

Заменить на:
```tsx
          <div className="flex flex-[0.8] flex-col gap-5 max-lg:w-full max-lg:max-w-[440px] max-lg:self-center">
            <div data-mugshot className="relative">
              <span data-ev-tag className="evtag">
                №VB-19
              </span>
              <div className="ev-frame rounded-[10px] border border-[var(--color-line)]">
                <Image
                  src="/media/booking/inmate-build.webp"
                  alt="Vladyslav Babii building on a laptop inside a concrete cell, orange jumpsuit, code on the screens"
                  width={960}
                  height={1192}
                  sizes="(max-width: 1024px) 80vw, 360px"
                  data-ev-desat
                  className="block h-auto w-full grayscale-[0.15]"
                />
                <span aria-hidden="true" className="ev-scan" />
                <span aria-hidden="true" className="ev-corner ev-corner--tl" />
                <span aria-hidden="true" className="ev-corner ev-corner--tr" />
                <span aria-hidden="true" className="ev-corner ev-corner--bl" />
                <span aria-hidden="true" className="ev-corner ev-corner--br" />
              </div>
            </div>
            <div data-lower-tiles className="flex items-stretch gap-4">
              <div className="ev-frame ev-frame--soft relative flex-1 overflow-hidden rounded-[8px] border border-[var(--color-line)]">
                <Image
                  src="/media/booking/inmate-detail.webp"
                  alt=""
                  aria-hidden="true"
                  width={640}
                  height={794}
                  sizes="180px"
                  className="block h-auto w-full grayscale"
                />
                <span className="absolute bottom-1 left-2 z-[3] text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                  Profile
                </span>
                <span aria-hidden="true" className="ev-scan" />
                <span aria-hidden="true" className="ev-corner ev-corner--tl" />
                <span aria-hidden="true" className="ev-corner ev-corner--tr" />
                <span aria-hidden="true" className="ev-corner ev-corner--bl" />
                <span aria-hidden="true" className="ev-corner ev-corner--br" />
              </div>
```

(«Biometrics»-плитка с `Fingerprint` НИЖЕ остаётся без изменений.)

- [ ] **Step 2: Build + tests**

Run: `npm run build && npm test`
Expected: build чистый; тесты зелёные. Если About-тест падает на структуре — поправить селектор теста под новую обёртку (img остаётся потомком `[data-mugshot]`), не ломая смысл.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/About.tsx
git commit -m "feat(about): forensic-inspect ховер на оба фото"
```

---

## Task 4: Work — устройство-улика

**Files:**
- Modify: `src/components/work/ExhibitDevice.tsx`

**NB:** зум применяем к ВНУТРЕННЕМУ слою `[data-ev-zoom]` (обёртка вокруг `shots.map`), а НЕ к `<Image>` напрямую — у кадров уже свой `transition-opacity` для кроссфейда, нельзя его перебивать CSS-шорткатом `transition`. Кроп-марки на телефон не вешаем (акцент на «пакете»).

- [ ] **Step 1: data-device → добавить класс `ev-device`**

Найти:
```tsx
      <div data-device className="relative">
```
Заменить на:
```tsx
      <div data-device className="ev-device relative">
```

- [ ] **Step 2: EVID-код → маркер `data-ev-tag`**

Найти:
```tsx
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-orange)] uppercase">
            {code}
          </span>
```
Заменить на:
```tsx
          <span
            data-ev-tag
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-orange)] uppercase"
          >
            {code}
          </span>
```

- [ ] **Step 3: телефон → класс `ev-phone`; экран → обёртка `[data-ev-zoom]` + `.ev-scan`**

Найти:
```tsx
        {/* телефон */}
        <div className="relative rounded-[30px] border border-[var(--color-line)] bg-[#1a1815] p-[8px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[1290/2422] overflow-hidden rounded-[22px] bg-[#0d0c0a]">
            {shots.map((s, idx) => (
              <Image
                key={s.src}
                src={s.src}
                alt={s.alt}
                fill
                sizes="280px"
                priority={idx === 0}
                className={`object-cover transition-opacity duration-700 ${
                  idx === i ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {/* подпись текущего кадра */}
            <span className="absolute bottom-2 left-2 z-10 rounded-[3px] bg-[rgba(16,15,13,0.7)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-bone)] uppercase">
              {shots[i].label}
            </span>
          </div>
        </div>
```
Заменить на:
```tsx
        {/* телефон */}
        <div className="ev-phone relative rounded-[30px] border border-[var(--color-line)] bg-[#1a1815] p-[8px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[1290/2422] overflow-hidden rounded-[22px] bg-[#0d0c0a]">
            <div data-ev-zoom className="absolute inset-0">
              {shots.map((s, idx) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="280px"
                  priority={idx === 0}
                  className={`object-cover transition-opacity duration-700 ${
                    idx === i ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* скан-линия forensic-inspect */}
            <span aria-hidden="true" className="ev-scan" />

            {/* подпись текущего кадра */}
            <span className="absolute bottom-2 left-2 z-10 rounded-[3px] bg-[rgba(16,15,13,0.7)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-bone)] uppercase">
              {shots[i].label}
            </span>
          </div>
        </div>
```

- [ ] **Step 4: Build + tests**

Run: `npm run build && npm test`
Expected: build чистый; тесты зелёные (карусель: стрелки/точки кликабельны, кроссфейд кадров целый).

- [ ] **Step 5: Commit**

```bash
git add src/components/work/ExhibitDevice.tsx
git commit -m "feat(work): forensic-inspect ховер на устройство-улику"
```

---

## Task 5: Финальная верификация в браузере

**Files:** —

- [ ] **Step 1: Поднять dev-сервер**

`preview_start` (или убедиться, что запущен). Затем `preview_eval: window.location.reload()` при необходимости.

- [ ] **Step 2: Проверить ховер по всем 4 фото на 1280**

`preview_resize` 1280 → навести курсор (`preview_eval` диспатч `mouseenter`/hover или `preview_click` рядом) на: hero-мугшот, About build, About profile, Work-телефон. Снять `preview_screenshot` каждого hover-состояния. Убедиться: zoom внутри рамки (clip), оранжевое зарево, кроп-марки внутрь, один проход скан-линии, лифт/ярчание тега. На Work — кроссфейд кадров и кликабельность стрелок/точек целы. Консоль без ошибок (`preview_console_logs`).

- [ ] **Step 3: 768 и 375 — покой**

`preview_resize` 768, затем 375. Убедиться: фото в состоянии покоя, без горизонтального скролла, ничего не обрезано/не съехало (теги/штамп/Placard на месте).

- [ ] **Step 4: Финальный build**

Run: `npm run build`
Expected: чистый.

- [ ] **Step 5: Отдать владельцу скрины/гиф + спросить про деплой**

Показать hover-скрины. Деплой в `main` — ТОЛЬКО по явному «ок» владельца (сверить scope ветки с продом). Откат — Vercel promote предыдущего READY.

---

## Self-Review (выполнено при написании)

- **Покрытие спека:** zoom ✓(T1+T2-4), зарево рамки ✓(T1), кроп-марки ✓(T1, hero/about), скан-линия ✓(T1, все 4), лифт тега ✓(T1), desktop+hover-only ✓(media-query), Work внутренний зум без слома кроссфейда ✓(T4 `data-ev-zoom`), пакет/тег Work ✓(T4), About build десатурация→резкость ✓(`data-ev-desat`), detail остаётся ч/б ✓(без маркера), сохранение alt/aria/data/priority/sizes ✓.
- **Плейсхолдеры:** нет — весь CSS/JSX дан целиком.
- **Консистентность имён:** `.ev-frame`/`.ev-frame--soft`/`.ev-corner(--tl/tr/bl/br)`/`.ev-scan`/`.ev-device`/`.ev-phone`/`[data-ev-zoom]`/`[data-ev-tag]`/`[data-ev-desat]` — совпадают между Task 1 (CSS) и Task 2–4 (разметка).
- **Вне рамок:** 3D-tilt, spotlight, колоризация ч/б — не включены (по спеку).
