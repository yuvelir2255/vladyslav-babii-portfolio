# Background Tune (A) + Per-Section Mood (C) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать фон видимым (дотюн A) и связать его настроение со скроллом по секциям (C: клетка→свет), не трогая контент/моушн секций.

**Architecture:** Чистая карта `moodForSection()` (тестируемая) задаёт 5 CSS-переменных на `#concrete-bg`. Клиент `BgMood` вешает `ScrollTrigger` на каждую секцию и пишет эти переменные при входе; CSS-transition блендит. `ConcreteBg` получает мод-слои/vignette/dome поверх шейдера (чтобы работали и на desktop, где opaque-canvas шейдера перекрывает базовый градиент, и на мобайле). Шейдер дотюнен константами (ярче бетон + прожектор).

**Tech Stack:** Next.js 16 / React 19 / TS strict / Tailwind v4 + raw CSS (globals.css) / GSAP ScrollTrigger / OGL (GLSL) / Vitest.

---

## Файлы

- Create: `src/components/bg/bgMood.ts` — карта `SECTION_MOODS` + `moodForSection(id)` + `BG_SECTION_IDS`.
- Create: `src/components/bg/bgMood.test.ts` — тесты карты моодов.
- Create: `src/components/bg/BgMood.tsx` — клиент-контроллер (ScrollTrigger → CSS-vars).
- Modify: `src/components/bg/ConcreteBg.tsx` — id, мод-слои, dome, vignette, рендер `<BgMood/>`.
- Create: `src/components/bg/ConcreteBg.test.tsx` — присутствие слоёв + aria-hidden.
- Modify: `src/app/globals.css` — дефолт-переменные `#concrete-bg`, `.mood-*`, `.bg-dome`, `.bg-vignette`, перекрас `.bars::after`.
- Modify: `src/components/bg/ShaderBg.tsx` — диапазон бетон-шума + прожектор (2 строки GLSL).

NB Windows: prettier правит staged-файлы на коммите — **перечитывать файл перед следующим Edit**.
NB dev-кэш: новые CSS-правила Turbopack в dev не подхватывает — `Remove-Item .next` + рестарт перед браузерной проверкой.

---

### Task 1: Карта моодов `bgMood.ts` (чистая логика)

**Files:**
- Create: `src/components/bg/bgMood.ts`
- Test: `src/components/bg/bgMood.test.ts`

- [ ] **Step 1: Написать падающий тест**

Create `src/components/bg/bgMood.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { moodForSection, BG_SECTION_IDS } from './bgMood';

describe('moodForSection', () => {
  it('about — темнее (vig и прутья плотнее)', () => {
    expect(moodForSection('about')['--vig']).toBe('0.6');
    expect(moodForSection('about')['--bar-opacity']).toBe('0.6');
  });
  it('services — тёплый оранж-свелл', () => {
    expect(moodForSection('services')['--m-warm']).toBe('1');
  });
  it('contact — дневной свет', () => {
    expect(moodForSection('contact')['--m-day']).toBe('1');
  });
  it('неизвестный id → дефолт (yard)', () => {
    expect(moodForSection('zzz')).toEqual(moodForSection('yard'));
  });
  it('каждый мод содержит все 5 ключей', () => {
    BG_SECTION_IDS.forEach((id) => {
      expect(Object.keys(moodForSection(id)).sort()).toEqual(
        ['--bar-opacity', '--m-day', '--m-steel', '--m-warm', '--vig'].sort(),
      );
    });
  });
});
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `npm test -- src/components/bg/bgMood.test.ts`
Expected: FAIL — модуль `./bgMood` не найден.

- [ ] **Step 3: Реализация**

Create `src/components/bg/bgMood.ts`:

```ts
export type BgMood = Record<
  '--m-steel' | '--m-warm' | '--m-day' | '--bar-opacity' | '--vig',
  string
>;

export const BG_SECTION_IDS = [
  'yard',
  'about',
  'services',
  'work',
  'contact',
] as const;

export const SECTION_MOODS: Record<string, BgMood> = {
  yard: { '--m-steel': '1', '--m-warm': '0', '--m-day': '0', '--bar-opacity': '0.4', '--vig': '0.45' },
  about: { '--m-steel': '0.5', '--m-warm': '0', '--m-day': '0', '--bar-opacity': '0.6', '--vig': '0.6' },
  services: { '--m-steel': '0', '--m-warm': '1', '--m-day': '0', '--bar-opacity': '0.35', '--vig': '0.45' },
  work: { '--m-steel': '0.2', '--m-warm': '0', '--m-day': '0', '--bar-opacity': '0.4', '--vig': '0.45' },
  contact: { '--m-steel': '0', '--m-warm': '0.15', '--m-day': '1', '--bar-opacity': '0.25', '--vig': '0.3' },
};

export function moodForSection(id: string): BgMood {
  return SECTION_MOODS[id] ?? SECTION_MOODS.yard;
}
```

- [ ] **Step 4: Запустить — убедиться, что проходит**

Run: `npm test -- src/components/bg/bgMood.test.ts`
Expected: PASS (5 тестов).

- [ ] **Step 5: Коммит**

```bash
git add src/components/bg/bgMood.ts src/components/bg/bgMood.test.ts
git commit -m "feat(bg): карта посекционных моодов (чистая функция)"
```

---

### Task 2: Клиент-контроллер `BgMood.tsx`

**Files:**
- Create: `src/components/bg/BgMood.tsx`

(Юнит-тест не пишем: ScrollTrigger требует layout, в jsdom не воспроизводится. Логика
покрыта Task 1 + браузером Task 6; компонент рендерится в тесте ConcreteBg — Task 4 —
и не должен падать.)

- [ ] **Step 1: Реализация**

Create `src/components/bg/BgMood.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { BG_SECTION_IDS, moodForSection } from './bgMood';

export function BgMood() {
  useEffect(() => {
    const bg = document.getElementById('concrete-bg');
    if (!bg) return;

    const apply = (id: string) => {
      const mood = moodForSection(id);
      for (const [k, v] of Object.entries(mood)) bg.style.setProperty(k, v);
    };

    // только существующие секции (в тестах их нет → триггеры не создаются)
    const triggers = BG_SECTION_IDS.flatMap((id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => apply(id),
        onEnterBack: () => apply(id),
      });
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Коммит**

```bash
git add src/components/bg/BgMood.tsx
git commit -m "feat(bg): scroll-контроллер моодов (ScrollTrigger → CSS-vars)"
```

---

### Task 3: CSS — дотюн (A) + мод-слои (C) в `globals.css`

**Files:**
- Modify: `src/app/globals.css`

(CSS — браузерная проверка Task 6, юнит-теста нет.)

- [ ] **Step 1: Перекрасить прутья (A) — сделать видимыми + завязать на переменную**

Найти правило `.bars::after` (сейчас `opacity: 0.4;` и
`background: repeating-linear-gradient(90deg, transparent 0 78px, rgba(0,0,0,0.4) 78px 82px);`).
Заменить `opacity` и `background`, добавить transition:

```css
.bars::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: var(--bar-opacity, 0.4);
  transition: opacity 0.8s ease;
  background: repeating-linear-gradient(
    90deg,
    transparent 0 76px,
    rgba(236, 231, 218, 0.05) 76px 77px,
    rgba(0, 0, 0, 0.4) 77px 81px,
    rgba(236, 231, 218, 0.03) 81px 82px
  );
```

(Остальные свойства правила — `-webkit-mask`/`mask` и закрывающую `}` — НЕ трогать.)

- [ ] **Step 2: Добавить переменные и слои (A+C)**

В конец `src/app/globals.css` добавить блок:

```css
/* ── фон: дотюн (A) + посекционные мооды (C) ── */
#concrete-bg {
  --m-steel: 1;
  --m-warm: 0;
  --m-day: 0;
  --bar-opacity: 0.4;
  --vig: 0.45;
}
.bg-dome,
.mood-steel,
.mood-warm,
.mood-day,
.bg-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-dome {
  z-index: 1;
  background: radial-gradient(
    95% 70% at 50% -8%,
    color-mix(in srgb, var(--color-surface) 60%, transparent),
    transparent 60%
  );
}
.mood-steel,
.mood-warm,
.mood-day {
  z-index: 1;
  transition: opacity 0.8s ease;
}
.mood-steel {
  background: radial-gradient(100% 70% at 50% -10%, rgba(150, 175, 200, 0.06), transparent 60%);
  opacity: var(--m-steel);
}
.mood-warm {
  background: radial-gradient(80% 60% at 50% 25%, rgba(255, 90, 30, 0.07), transparent 70%);
  opacity: var(--m-warm);
}
.mood-day {
  background: radial-gradient(120% 80% at 50% 120%, rgba(255, 196, 130, 0.1), transparent 70%);
  opacity: var(--m-day);
}
.bg-vignette {
  z-index: 3;
  box-shadow: inset 0 0 140px 40px
    color-mix(in srgb, #000 calc(var(--vig) * 100%), transparent);
  transition: box-shadow 0.8s ease;
}
```

- [ ] **Step 3: Сборка проходит (CSS валиден)**

Run: `npm run build`
Expected: чистый build без ошибок.

- [ ] **Step 4: Коммит**

```bash
git add src/app/globals.css
git commit -m "feat(bg): CSS дотюна и мод-слоёв (прутья видимы, steel/warm/day, vignette)"
```

---

### Task 4: `ConcreteBg.tsx` — слои + рендер контроллера

**Files:**
- Modify: `src/components/bg/ConcreteBg.tsx`
- Test: `src/components/bg/ConcreteBg.test.tsx`

- [ ] **Step 1: Написать падающий тест**

Create `src/components/bg/ConcreteBg.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConcreteBg } from './ConcreteBg';

describe('ConcreteBg', () => {
  it('рендерит фон #concrete-bg (aria-hidden) с мод-слоями и vignette', () => {
    const { container } = render(<ConcreteBg />);
    const bg = container.querySelector('#concrete-bg');
    expect(bg).toBeTruthy();
    expect(bg?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.mood-steel')).toBeTruthy();
    expect(container.querySelector('.mood-warm')).toBeTruthy();
    expect(container.querySelector('.mood-day')).toBeTruthy();
    expect(container.querySelector('.bg-vignette')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `npm test -- src/components/bg/ConcreteBg.test.tsx`
Expected: FAIL — `#concrete-bg` (нет id) / `.mood-steel` не найдены.

- [ ] **Step 3: Реализация**

Replace `src/components/bg/ConcreteBg.tsx` целиком:

```tsx
import { ShaderBg } from './ShaderBg';
import { BgMood } from './BgMood';

export function ConcreteBg() {
  return (
    <div
      id="concrete-bg"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,var(--color-surface)_0%,var(--color-bg)_60%)]"
    >
      <ShaderBg />
      <div className="bg-dome" />
      <div className="mood-steel" />
      <div className="mood-warm" />
      <div className="mood-day" />
      <div className="grain bars absolute inset-0 z-[2]" />
      <div className="bg-vignette" />
      <BgMood />
    </div>
  );
}
```

- [ ] **Step 4: Запустить — убедиться, что проходит**

Run: `npm test -- src/components/bg/ConcreteBg.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/components/bg/ConcreteBg.tsx src/components/bg/ConcreteBg.test.tsx
git commit -m "feat(bg): слои мудов/dome/vignette + контроллер в ConcreteBg"
```

---

### Task 5: Шейдер — ярче бетон + прожектор (A, desktop)

**Files:**
- Modify: `src/components/bg/ShaderBg.tsx`

(GLSL — браузерная проверка Task 6.)

- [ ] **Step 1: Расширить диапазон бетон-шума**

В `src/components/bg/ShaderBg.tsx` заменить строку:

```
    vec3 base = mix(vec3(0.063, 0.059, 0.051), vec3(0.16, 0.15, 0.13), c);
```

на:

```
    vec3 base = mix(vec3(0.072, 0.067, 0.058), vec3(0.20, 0.185, 0.16), c);
```

- [ ] **Step 2: Поднять прожектор у курсора**

Заменить строку:

```
    base += vec3(1.0, 0.35, 0.12) * smoothstep(0.5, 0.0, d) * 0.22;
```

на:

```
    base += vec3(1.0, 0.35, 0.12) * smoothstep(0.5, 0.0, d) * 0.30;
```

- [ ] **Step 3: Типы/сборка**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 4: Коммит**

```bash
git add src/components/bg/ShaderBg.tsx
git commit -m "feat(bg): ярче бетон-шум и прожектор у курсора (desktop)"
```

---

### Task 6: Полная проверка + браузер

**Files:** none (verification only)

- [ ] **Step 1: Типы + все тесты + сборка**

Run: `npm run typecheck`
Expected: без ошибок.

Run: `npm test`
Expected: всё зелёное (78 прежних + новые: bgMood ×5, ConcreteBg ×1 → 84).

Run: `npm run build`
Expected: чистый build.

- [ ] **Step 2: Очистить dev-кэш (новые CSS-правила) и поднять preview**

Run: `Remove-Item -Recurse -Force .next` (через PowerShell-инструмент) затем `preview_start`.

- [ ] **Step 3: Браузер — desktop, проход по секциям**

`preview_resize` 1280; снять прелоадер (`preview_eval` sessionStorage `vb19-intake`=1 + reload).
Через `preview_eval` проверить переменные на `#concrete-bg` после скролла к каждой секции
(`document.querySelector('#about').scrollIntoView(); ... getComputedStyle(document.getElementById('concrete-bg')).getPropertyValue('--vig')`):
- у `#about` `--vig`→`0.6`, `--bar-opacity`→`0.6`; у `#services` `--m-warm`→`1`; у `#contact` `--m-day`→`1`.
`preview_screenshot` на hero / services / contact — мооды видны (сталь→оранж→дневной свет),
прутья ВИДНЫ, vignette собирает кадр. `preview_console_logs` level error — пусто.

- [ ] **Step 4: Браузер — mobile (без шейдера)**

`preview_resize` 375. Проверить, что мооды/прутья работают и без шейдера (база-градиент +
слои), текст читаем, без H-скролла (`document.documentElement` — `canScrollX` false).
`preview_screenshot`.

- [ ] **Step 5: Финальный отчёт**

Скрины desktop (hero/services/contact) + mobile; подтвердить чистые build/test/typecheck.
Прод НЕ трогаем — только по «ок» владельца.

---

## Self-Review

**Spec coverage:**
- A: прутья видимыми → Task 3 Step 1 ✅
- A: шейдер ярче (диапазон + прожектор) → Task 5 ✅
- A: vignette → Task 3 Step 2 (`.bg-vignette`) + Task 4 ✅
- A: dome-glow → Task 3 Step 2 (`.bg-dome`) + Task 4 ✅
- C: 3 мод-слоя с opacity-var → Task 3 Step 2 + Task 4 ✅
- C: карта секция→мооды → Task 1 ✅
- C: scroll-контроллер пишет на `#concrete-bg` → Task 2 ✅
- Слои поверх шейдера (desktop/мобайл паритет) → Task 4 порядок DOM + z-index (shader auto < dome/mood z1 < grain/bars z2 < vignette z3) ✅
- a11y aria-hidden → Task 4 тест ✅
- тесты + build + typecheck + браузер 375/1280 → Task 6 ✅

**Placeholder scan:** плейсхолдеров нет — весь код/значения приведены.

**Type consistency:** `BgMood` (тип) ключи = `--m-steel/--m-warm/--m-day/--bar-opacity/--vig`; те же 5 ключей в `SECTION_MOODS`, тесте Task 1, CSS Task 3, контроллере Task 2. `BG_SECTION_IDS` (Task 1) = id секций (`yard/about/services/work/contact`, подтверждены grep) и используются в Task 2. `moodForSection` сигнатура едина.
