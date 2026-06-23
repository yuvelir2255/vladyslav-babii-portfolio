# Hero Desktop Dossier Layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заполнить «пустой» desktop-hero тремя статичными досье-слоями (рап-шит, вертикальный лейбл, кроп-марки), не трогая мобайл и моушн.

**Architecture:** Контент в `hero.ts` (`sideLabel` + `rapSheet`). В `HeroScreen1.tsx` — рап-шит между ролью и CTA внутри `HeroNameMotion`; вертикальный лейбл и 4 кроп-марки как абсолютные декор-дети внутреннего контент-`<div>` (он уже `relative`). Все три слоя — `lg`-gated (`hidden lg:block/flex`), поэтому мобайл идентичен текущему. Слои статичные — ни анимаций, ни новых ассетов.

**Tech Stack:** Next.js 16 / React 19 / TS strict / Tailwind v4 (arbitrary inline) / Vitest + @testing-library/react.

---

## Файлы

- Modify: `src/content/hero.ts` — добавить `sideLabel` (string) и `rapSheet` (массив `{label,value}`).
- Modify: `src/content/hero.test.ts` — тест на новые поля.
- Modify: `src/components/hero/HeroScreen1.tsx` — рап-шит + вертикальный лейбл + кроп-марки.
- Modify: `src/components/hero/HeroScreen1.test.tsx` — тест на рендер новых элементов.

NB Windows: prettier переформатирует staged-файлы на коммите — **перечитывать файл перед следующим Edit**.

---

### Task 1: Контент-модель — `sideLabel` + `rapSheet`

**Files:**
- Modify: `src/content/hero.ts`
- Test: `src/content/hero.test.ts`

- [ ] **Step 1: Написать падающий тест**

В `src/content/hero.test.ts` добавить внутрь `describe('hero content', …)`:

```ts
it('содержит вертикальный лейбл и рап-шит из 3 полей', () => {
  expect(hero.sideLabel).toMatch(/confidential/i);
  expect(hero.rapSheet).toHaveLength(3);
  hero.rapSheet.forEach((row) => {
    expect(row.label.length).toBeGreaterThan(0);
    expect(row.value.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npm test -- src/content/hero.test.ts`
Expected: FAIL — `hero.sideLabel` is undefined / `hero.rapSheet` is undefined.

- [ ] **Step 3: Минимальная реализация**

В `src/content/hero.ts` добавить два поля внутрь объекта `hero` (перед закрывающей `} as const;`), после `manifest`:

```ts
  sideLabel: 'Confidential · Do not distribute',
  rapSheet: [
    { label: 'Disposition', value: 'Unrepentant' },
    { label: 'M.O.', value: 'Builds, ships, escapes' },
    { label: 'Threat level', value: 'High' },
  ],
```

(Регистр в UI задаётся `uppercase`; в данных храним человекочитаемо.)

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npm test -- src/content/hero.test.ts`
Expected: PASS (3 теста в файле зелёные).

- [ ] **Step 5: Коммит**

```bash
git add src/content/hero.ts src/content/hero.test.ts
git commit -m "feat(hero): контент досье-слоя — sideLabel + rapSheet"
```

---

### Task 2: Рап-шит в левой колонке (desktop-only)

**Files:**
- Modify: `src/components/hero/HeroScreen1.tsx`
- Test: `src/components/hero/HeroScreen1.test.tsx`

- [ ] **Step 1: Написать падающий тест**

В `src/components/hero/HeroScreen1.test.tsx` добавить внутрь `describe('HeroScreen1', …)`:

```ts
it('рендерит значения рап-шита', () => {
  render(<HeroScreen1 />);
  expect(screen.getByText(/unrepentant/i)).toBeInTheDocument();
  expect(screen.getByText(/builds, ships, escapes/i)).toBeInTheDocument();
  expect(screen.getByText(/threat level/i)).toBeInTheDocument();
});
```

(CSS `uppercase` не меняет `textContent`, поэтому регэксп по человекочитаемому тексту работает.)

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npm test -- src/components/hero/HeroScreen1.test.tsx`
Expected: FAIL — текст "unrepentant" не найден.

- [ ] **Step 3: Реализация — вставить рап-шит между ролью и CTA**

В `src/components/hero/HeroScreen1.tsx`, внутри `<HeroNameMotion>`, между блоком роли (`<p>…{hero.role}…</p>`) и блоком CTA (`<div className="mt-9 flex flex-wrap …">`), вставить:

```tsx
<dl className="mt-7 hidden gap-x-8 gap-y-1 border-t border-[var(--color-line)] pt-4 lg:flex">
  {hero.rapSheet.map((row, i) => (
    <div key={row.label} className={i === 2 ? 'hidden xl:block' : 'block'}>
      <dt className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--color-dim)] uppercase">
        {row.label}
      </dt>
      <dd className="mt-1 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[var(--color-bone)] uppercase">
        {row.value}
      </dd>
    </div>
  ))}
</dl>
```

(3-е поле `hidden xl:block` — на узком `lg` ~1024–1100px не поджимает фото.)

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npm test -- src/components/hero/HeroScreen1.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/components/hero/HeroScreen1.tsx src/components/hero/HeroScreen1.test.tsx
git commit -m "feat(hero): рап-шит в левой колонке (desktop-only)"
```

---

### Task 3: Вертикальный лейбл + кроп-марки (desktop-decor)

**Files:**
- Modify: `src/components/hero/HeroScreen1.tsx`
- Test: `src/components/hero/HeroScreen1.test.tsx`

- [ ] **Step 1: Написать падающий тест**

В `src/components/hero/HeroScreen1.test.tsx` добавить:

```ts
it('рендерит вертикальный лейбл-декор', () => {
  render(<HeroScreen1 />);
  expect(screen.getByText(/do not distribute/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npm test -- src/components/hero/HeroScreen1.test.tsx`
Expected: FAIL — текст "do not distribute" не найден.

- [ ] **Step 3: Реализация — добавить декор в контент-`<div>`**

В `src/components/hero/HeroScreen1.tsx`, внутри контент-контейнера (тот, что
`<div className="relative z-[2] flex flex-1 items-center gap-12 px-14 py-8 max-lg:flex-col max-lg:gap-8 max-lg:px-6">`),
первыми детьми (до `<HeroNameMotion>`) вставить вертикальный лейбл и 4 кроп-марки:

```tsx
<span
  aria-hidden="true"
  className="pointer-events-none absolute top-1/2 left-2 hidden -translate-y-1/2 rotate-180 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--color-dim)] uppercase [writing-mode:vertical-rl] lg:block"
>
  {hero.sideLabel}
</span>
<span aria-hidden="true" className="pointer-events-none absolute top-2 left-2 hidden h-4 w-4 border-t-2 border-l-2 border-[var(--color-orange)] lg:block" />
<span aria-hidden="true" className="pointer-events-none absolute top-2 right-2 hidden h-4 w-4 border-t-2 border-r-2 border-[var(--color-orange)] lg:block" />
<span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-2 hidden h-4 w-4 border-b-2 border-l-2 border-[var(--color-orange)] lg:block" />
<span aria-hidden="true" className="pointer-events-none absolute right-2 bottom-2 hidden h-4 w-4 border-r-2 border-b-2 border-[var(--color-orange)] lg:block" />
```

(Контейнер уже `relative` → абсолютные дети позиционируются по его углам, между
тикером и scroll-строкой. Декор `aria-hidden`, `pointer-events-none`, `lg`-only.)

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npm test -- src/components/hero/HeroScreen1.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/components/hero/HeroScreen1.tsx src/components/hero/HeroScreen1.test.tsx
git commit -m "feat(hero): вертикальный лейбл + кроп-марки (desktop-decor)"
```

---

### Task 4: Полная проверка + браузер (375/768/1280/1440)

**Files:** none (verification only)

- [ ] **Step 1: Типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 2: Все тесты**

Run: `npm test`
Expected: всё зелёное (75 прежних + 2 новых = 77).

- [ ] **Step 3: Прод-сборка**

Run: `npm run build`
Expected: чистый build, без ошибок.

- [ ] **Step 4: Браузер — desktop**

NB dev-кэш: новые Tailwind-arbitrary классы Turbopack в dev может не подхватить —
при отсутствии стилей сделать `Remove-Item .next` + рестарт `npm run dev`.

Через preview-инструмент (`preview_start`, `preview_resize` 1280 и 1440,
`preview_screenshot`):
- кроп-марки видны в 4 углах контент-области;
- вертикальный лейбл `CONFIDENTIAL · DO NOT DISTRIBUTE` у левого края;
- рап-шит под ролью; на 1440 — 3 поля, на ~1100 (`lg`) — 2 поля, фото не поджато;
- горизонтального скролла нет (`preview_eval` проверка `document.documentElement.scrollWidth <= clientWidth`).

- [ ] **Step 5: Браузер — mobile (регресс)**

`preview_resize` 375 и 768, `preview_screenshot`:
- новых слоёв НЕТ (всё `lg`-gated) → hero идентичен текущему;
- без горизонтального скролла.

- [ ] **Step 6: Финальный отчёт**

Приложить скрины ПК (1280/1440) + мобайл (375), подтвердить чистые build/test/typecheck.
Прод (`main`) НЕ трогаем — только по явному «ок» владельца (feature-ветка → preview-деплой).

---

## Self-Review

**Spec coverage:**
- Слой 1 кроп-марки → Task 3 ✅
- Слой 2 вертикальный лейбл → Task 3 ✅
- Слой 3 рап-шит (флавор-копирайт) → Task 2 ✅
- Контент-модель `sideLabel`+`rapSheet` → Task 1 ✅
- desktop-only (`lg+`) → классы `hidden lg:*` во всех задачах ✅
- узкий-desktop прячет 3-е поле → Task 2 (`hidden xl:block`) ✅
- a11y (`aria-hidden` декор, рап-шит читаемый) → Task 3 (aria-hidden), Task 2 (dl/dt/dd) ✅
- тесты + build + typecheck + браузер 375/768/1280/1440 → Task 4 ✅
- мобайл не меняется → `lg`-gating + Task 4 Step 5 регресс ✅

**Placeholder scan:** плейсхолдеров нет — весь код приведён.

**Type consistency:** `hero.sideLabel: string`, `hero.rapSheet: {label,value}[]` определены в Task 1 и используются ровно так в Task 2/3.
