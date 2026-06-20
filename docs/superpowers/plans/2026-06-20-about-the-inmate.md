# About «The Inmate» — Implementation Plan

> **СТАТУС (2026-06-21): РЕАЛИЗОВАНО** на ветке `feat/about-the-inmate` (PR #1, preview). По фидбэку владельца после сборки: pin/scrub-сцена ЗАМЕНЕНА на плавный on-enter reveal (без пиннинга), фото — 2 новых кадра «билдер в камере» (не дубль hero), фон сделан единым на весь сайт. План ниже отражает первоначальную сборку (Task 1–9); последующие правки см. в `CLAUDE.md` и истории git.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать секцию `#about` («The Inmate») — рассекречиваемое досье с pin/scrub-сценой по концепту «Case File».

**Architecture:** Контент в `src/content/about.ts`. Статичная доступная вёрстка — `About.tsx` (+ презентационные `RedactedField`, `Fingerprint`). Весь моушн изолирован в клиентском `DossierMotion.tsx` (useGSAP, scope) по образцу `ManifestMotion`. Секция монтируется в `page.tsx` внутри перенесённого туда `<main>`.

**Tech Stack:** Next.js 16 · React 19 · TS strict · Tailwind v4 · GSAP (ScrollTrigger pin/scrub, Timeline, SplitText, ScrambleText, DrawSVG) · Lenis (глобально). Vitest + Testing Library.

> **Конвенции репо:** Windows/PowerShell — команды начинать с `Set-Location 'C:\Users\ювелир\Desktop\portfolio'`. Коммиты — Conventional Commits по-русски, в сообщение добавлять трейлер `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Husky/lint-staged на коммите гоняет только prettier (тесты/типы — вручную). Prettier может переформатировать файл на коммите — перечитывать перед следующим Edit.
>
> **TDD-граница (решение проекта):** моушн (GSAP/scrub) в юнит-тестах НЕ гоняем — проверяем в браузере. TDD применяем к контенту и к рендеру/доступности компонентов.
>
> **Сознательное отклонение от спеки:** `Flip` из §5 спеки НЕ используем — «открытие папки» делаем через `rotateX` (проще, того же эффекта достаточно, YAGNI). Регистрируем только реально нужный `DrawSVGPlugin`.

---

## Структура файлов

- Create: `src/content/about.ts` — контент/копи дела (факты, 2 строки под грифом, disposition, статус, стек).
- Create: `src/content/about.test.ts` — тест контента.
- Create: `src/components/about/RedactedField.tsx` — кнопка-гриф, toggle рассекречивания (императивно, без useState).
- Create: `src/components/about/RedactedField.test.tsx` — тест доступности/toggle.
- Create: `src/components/about/Fingerprint.tsx` — инлайн-SVG отпечаток (линии под DrawSVG).
- Create: `src/components/about/Fingerprint.test.tsx` — тест рендера линий.
- Create: `src/components/about/About.tsx` — вёрстка секции `#about`.
- Create: `src/components/about/About.test.tsx` — тест рендера фактов/мугшота/грифов.
- Create: `src/components/about/DossierMotion.tsx` — pin/scrub мастер-таймлайн (моушн).
- Modify: `src/lib/gsap.ts` — зарегистрировать `DrawSVGPlugin`.
- Create: `src/lib/gsap.test.ts` — тест экспорта плагинов.
- Modify: `src/components/hero/Hero.tsx` — убрать обёртку `<main>`.
- Modify: `src/app/page.tsx` — перенести `<main>`, смонтировать `<About />`.
- Modify: `src/app/globals.css` — стили рассекречивания, штампа Declassified, scan-курсора.
- Modify: `src/components/cursor/Cursor.tsx` — scan-вариант курсора над `[data-cursor="scan"]`.

---

## Task 1: Зарегистрировать DrawSVGPlugin в gsap-реестре

**Files:**
- Modify: `src/lib/gsap.ts`
- Test: `src/lib/gsap.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect } from 'vitest';
import { DrawSVGPlugin, ScrambleTextPlugin } from './gsap';

describe('gsap registry', () => {
  it('экспортирует DrawSVG и ScrambleText плагины', () => {
    expect(DrawSVGPlugin).toBeTruthy();
    expect(ScrambleTextPlugin).toBeTruthy();
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/lib/gsap.test.ts`
Expected: FAIL — `DrawSVGPlugin` не экспортируется из `./gsap`.

- [ ] **Step 3: Добавить регистрацию плагина**

Заменить содержимое `src/lib/gsap.ts` на:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin };
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/lib/gsap.test.ts`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/lib/gsap.ts src/lib/gsap.test.ts
git commit -m "feat(gsap): зарегистрировать DrawSVGPlugin"
```

---

## Task 2: Контент секции — src/content/about.ts

**Files:**
- Create: `src/content/about.ts`
- Test: `src/content/about.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect } from 'vitest';
import { about } from './about';

describe('about content', () => {
  it('содержит ключевые факты дела', () => {
    const values = about.facts.map((f) => f.v);
    expect(values).toContain('Vladyslav Babii');
    expect(about.facts.find((f) => /age/i.test(f.k))?.v).toBe('19');
    expect(about.facts.some((f) => /kharkiv/i.test(f.v))).toBe(true);
    expect(about.facts.some((f) => /warsaw/i.test(f.v))).toBe(true);
  });
  it('две строки под грифом', () => {
    expect(about.redacted).toHaveLength(2);
    expect(about.redacted.map((r) => r.k.toLowerCase())).toEqual([
      'prior record',
      'charges / m.o.',
    ]);
    about.redacted.forEach((r) => expect(r.v.length).toBeGreaterThan(10));
  });
  it('стек и статус заданы', () => {
    expect(about.tools).toContain('GSAP');
    expect(about.status).toMatch(/large/i);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/content/about.test.ts`
Expected: FAIL — модуль `./about` не найден.

- [ ] **Step 3: Создать контент**

`src/content/about.ts`:

```ts
export const about = {
  label: 'On the record / Subject file',
  facts: [
    { k: 'Inmate №', v: 'VB-19' },
    { k: 'Name', v: 'Vladyslav Babii' },
    { k: 'Age', v: '19' },
    { k: 'Origin', v: 'Kharkiv, UA' },
    { k: 'Held at', v: 'Warsaw, PL' },
  ],
  redacted: [
    {
      k: 'Prior record',
      v: "Ran my own projects before writing a line of code — shipped, didn't just plan.",
    },
    {
      k: 'Charges / M.O.',
      v: 'Designs, builds and ships real products — not demos. A real business takes orders through what he made.',
    },
  ],
  disposition:
    'Reads a build like an owner: from the first pixel to the bottom line. Whatever he starts, he finishes.',
  status: 'At large',
  tools: [
    'React',
    'TypeScript',
    'Next.js',
    'GSAP',
    'WebGL',
    'Supabase',
    'OpenAI',
    'Telegram',
  ],
} as const;
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/content/about.test.ts`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/content/about.ts src/content/about.test.ts
git commit -m "feat(about): контент секции The Inmate"
```

---

## Task 3: RedactedField — кнопка-гриф с рассекречиванием

Состояние раскрытия храним императивно в DOM (`data-open` + `aria-expanded`), без `useState` — чтобы и клик, и моушн (Task 7) могли менять одно и то же без конфликта ре-рендера. Значение всегда в DOM (для скринридера), визуально закрыто полосой.

**Files:**
- Create: `src/components/about/RedactedField.tsx`
- Test: `src/components/about/RedactedField.test.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RedactedField } from './RedactedField';

describe('RedactedField', () => {
  it('значение в DOM, по умолчанию засекречено', () => {
    render(<RedactedField label="Prior record" value="secret intel" />);
    const btn = screen.getByRole('button', { name: /declassify prior record/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('secret intel')).toBeInTheDocument();
  });
  it('клик рассекречивает и засекречивает обратно', () => {
    render(<RedactedField label="Prior record" value="secret intel" />);
    const btn = screen.getByRole('button', { name: /declassify prior record/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(btn).toHaveAttribute('data-open', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/components/about/RedactedField.test.tsx`
Expected: FAIL — модуль `./RedactedField` не найден.

- [ ] **Step 3: Реализовать компонент**

`src/components/about/RedactedField.tsx`:

```tsx
'use client';

import { useRef } from 'react';

export function RedactedField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const open = el.dataset.open === 'true';
    el.dataset.open = String(!open);
    el.setAttribute('aria-expanded', String(!open));
  };

  return (
    <button
      ref={ref}
      type="button"
      data-redacted
      data-open="false"
      aria-expanded="false"
      aria-label={`Declassify ${label}`}
      onClick={toggle}
      className="block w-full text-left"
    >
      <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
        {label}
      </span>
      <span className="redacted-wrap mt-1 block">
        <span
          data-redacted-value
          className="block text-[13px] leading-[1.5] text-[var(--color-bone)]"
        >
          {value}
        </span>
        <span data-redaction-bar className="redaction-bar" aria-hidden="true" />
      </span>
    </button>
  );
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/components/about/RedactedField.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/components/about/RedactedField.tsx src/components/about/RedactedField.test.tsx
git commit -m "feat(about): RedactedField — рассекречивание по клику"
```

---

## Task 4: Fingerprint — SVG-отпечаток для DrawSVG

Презентационный инлайн-SVG: набор штрихованных дуг с `data-fp` (DrawSVG в Task 7 «нарисует» их). Арт провизорный — путь можно заменить позже (открытый вопрос спеки), но это валидный рабочий SVG.

**Files:**
- Create: `src/components/about/Fingerprint.tsx`
- Test: `src/components/about/Fingerprint.test.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Fingerprint } from './Fingerprint';

describe('Fingerprint', () => {
  it('рендерит svg с линиями для DrawSVG', () => {
    const { container } = render(<Fingerprint />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('[data-fp]').length).toBeGreaterThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/components/about/Fingerprint.test.tsx`
Expected: FAIL — модуль `./Fingerprint` не найден.

- [ ] **Step 3: Реализовать компонент**

`src/components/about/Fingerprint.tsx`:

```tsx
export function Fingerprint({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g
        stroke="var(--color-orange)"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path data-fp d="M50 16 C 78 16 92 40 88 64 C 84 88 64 104 48 102" />
        <path data-fp d="M50 26 C 72 26 84 46 80 66 C 76 86 60 96 49 94" />
        <path data-fp d="M50 36 C 66 36 76 50 73 66 C 70 82 58 88 50 86" />
        <path data-fp d="M50 46 C 61 46 68 54 66 66 C 64 78 57 82 51 80" />
        <path data-fp d="M50 56 C 57 56 61 61 60 67 C 59 74 55 76 51 74" />
        <path data-fp d="M44 62 C 46 58 53 58 55 63" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/components/about/Fingerprint.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/components/about/Fingerprint.tsx src/components/about/Fingerprint.test.tsx
git commit -m "feat(about): SVG-отпечаток для DrawSVG"
```

---

## Task 5: Вёрстка секции — About.tsx (статика, без моушна)

Data-хуки для Task 7: `data-folder` (вся карта), `data-mugshot`, `data-dossier-field` (каждый блок-строка), `data-age` (значение возраста), `data-disposition` (абзац характеристики), `data-stamp` (штамп). Грифы дают `data-redacted` / `data-redacted-value` / `data-redaction-bar` (из Task 3). Корень секции — `data-cursor="scan"` (для Task 8).

**Files:**
- Create: `src/components/about/About.tsx`
- Test: `src/components/about/About.test.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('рендерит факты дела и мугшот', () => {
    render(<About />);
    expect(screen.getByText('Vladyslav Babii')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText(/Kharkiv/)).toBeInTheDocument();
    expect(
      screen.getByAltText(/Booking photo of Vladyslav Babii/i),
    ).toBeInTheDocument();
  });
  it('две рассекречиваемые кнопки и стек', () => {
    render(<About />);
    expect(
      screen.getByRole('button', { name: /declassify prior record/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /declassify charges/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/GSAP/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/components/about/About.test.tsx`
Expected: FAIL — модуль `./About` не найден.

- [ ] **Step 3: Реализовать вёрстку**

`src/components/about/About.tsx`:

```tsx
import Image from 'next/image';
import { about } from '@/content/about';
import { RedactedField } from './RedactedField';
import { Fingerprint } from './Fingerprint';

export function About() {
  return (
    <section
      id="about"
      data-cursor="scan"
      className="grain relative flex min-h-[100svh] items-center border-t border-[var(--color-line)] px-14 py-20 max-md:px-6"
    >
      <div
        data-folder
        className="relative z-[2] mx-auto flex w-full max-w-[1100px] gap-12 max-lg:flex-col"
      >
        <div className="flex flex-[0.8] flex-col gap-5">
          <div data-mugshot className="relative">
            <span className="evtag">№VB-19</span>
            <Image
              src="/media/booking/mugshot.webp"
              alt="Booking photo of Vladyslav Babii"
              width={480}
              height={600}
              sizes="(max-width: 1024px) 80vw, 360px"
              className="block w-full rounded-[10px] border border-[var(--color-line)] grayscale-[0.15]"
            />
          </div>
          <div className="flex items-stretch gap-4">
            <div className="relative flex-1 overflow-hidden rounded-[8px] border border-[var(--color-line)]">
              <Image
                src="/media/booking/mugshot.webp"
                alt=""
                aria-hidden="true"
                width={240}
                height={300}
                sizes="180px"
                className="block w-full -scale-x-100 opacity-70 grayscale"
              />
              <span className="absolute bottom-1 left-2 text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                Profile
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[8px] border border-[var(--color-line)] p-3">
              <Fingerprint className="h-20 w-auto" />
              <span className="text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                Biometrics
              </span>
            </div>
          </div>
        </div>

        <div className="flex-[1.2]">
          <p className="mb-6 text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
            <span aria-hidden="true" className="mr-2">
              ●
            </span>
            {about.label}
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-sm:grid-cols-1">
            {about.facts.map((f) => {
              const isAge = /age/i.test(f.k);
              return (
                <div data-dossier-field key={f.k}>
                  <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                    {f.k}
                  </span>
                  <span
                    {...(isAge ? { 'data-age': true } : {})}
                    className={`mt-1 block text-[15px] ${
                      isAge
                        ? 'text-[var(--color-orange)]'
                        : 'text-[var(--color-bone)]'
                    }`}
                  >
                    {f.v}
                  </span>
                </div>
              );
            })}

            {about.redacted.map((r) => (
              <div
                data-dossier-field
                key={r.k}
                className="col-span-2 max-sm:col-span-1"
              >
                <RedactedField label={r.k} value={r.v} />
              </div>
            ))}
          </div>

          <div data-dossier-field className="mt-6">
            <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
              Disposition
            </span>
            <p
              data-disposition
              className="mt-1 max-w-[48ch] text-[15px] leading-[1.6] text-[var(--color-steel)]"
            >
              {about.disposition}
              <span className="ml-2 inline-block rounded border border-[var(--color-orange)] px-2 py-[2px] align-middle text-[10px] tracking-[0.08em] text-[var(--color-orange)] uppercase">
                {about.status}
              </span>
            </p>
          </div>

          <div data-dossier-field className="mt-6">
            <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
              Tools / known associates
            </span>
            <p className="mt-1 text-[12px] tracking-[0.04em] text-[var(--color-steel)]">
              {about.tools.join(' · ')}
            </p>
          </div>
        </div>

        <span data-stamp className="stamp-declassified" aria-hidden="true">
          Declassified
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Добавить стили в globals.css**

В конец `src/app/globals.css` добавить:

```css
/* досье: рассекречивание (redaction) */
.redacted-wrap {
  position: relative;
  display: inline-block;
  min-width: 60%;
}
.redaction-bar {
  position: absolute;
  inset: 0;
  transform-origin: right;
  background: repeating-linear-gradient(90deg, #000 0 10px, #0c0b0a 10px 12px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
[data-redacted][data-open='true'] .redaction-bar {
  opacity: 0;
  transform: scaleX(0);
  pointer-events: none;
}
[data-redacted]:focus-visible {
  outline: 2px solid var(--color-orange);
  outline-offset: 3px;
}

/* штамп Declassified в углу карты дела */
.stamp-declassified {
  position: absolute;
  right: 4%;
  bottom: 5%;
  z-index: 4;
  transform: rotate(-9deg);
  border: 3px solid var(--color-orange);
  color: var(--color-orange);
  border-radius: 6px;
  padding: 6px 16px;
  font: 22px var(--font-stencil);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(16, 15, 13, 0.5);
}

/* scan-вариант кастомного курсора над делом */
.cursor-dot.is-scan {
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  border: 1px solid color-mix(in srgb, var(--color-orange) 60%, transparent);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-orange) 18%, transparent),
    transparent 72%
  );
}
```

- [ ] **Step 5: Запустить тест — убедиться, что проходит**

Run: `npx vitest run src/components/about/About.test.tsx`
Expected: PASS.

- [ ] **Step 6: Коммит**

```bash
git add src/components/about/About.tsx src/components/about/About.test.tsx src/app/globals.css
git commit -m "feat(about): вёрстка секции The Inmate (досье)"
```

---

## Task 6: Монтаж секции — перенос <main> в page, оживление #about

**Files:**
- Modify: `src/components/hero/Hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Убрать <main> из Hero**

Заменить `src/components/hero/Hero.tsx` на:

```tsx
import { HeroScreen1 } from './HeroScreen1';
import { HeroScreen2 } from './HeroScreen2';

export function Hero() {
  return (
    <>
      <HeroScreen1 />
      <HeroScreen2 />
    </>
  );
}
```

- [ ] **Step 2: Смонтировать About внутри перенесённого <main>**

Заменить `src/app/page.tsx` на:

```tsx
import { ConcreteBg } from '@/components/bg/ConcreteBg';
import { Cursor } from '@/components/cursor/Cursor';
import { FileNav } from '@/components/chrome/FileNav';
import { Preloader } from '@/components/chrome/Preloader';
import { AudioToggle } from '@/components/chrome/AudioToggle';
import { Hero } from '@/components/hero/Hero';
import { About } from '@/components/about/About';

export default function Home() {
  return (
    <>
      <Preloader />
      {/* во время intake прелоадер делает этот контейнер inert (см. Preloader.tsx) */}
      <div id="app-content">
        <ConcreteBg />
        <Cursor />
        <FileNav />
        <main>
          <Hero />
          <About />
        </main>
        <AudioToggle />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Прогнать весь тест-сьют — ничего не сломалось**

Run: `npx vitest run`
Expected: PASS (все существующие + новые тесты зелёные).

- [ ] **Step 4: Тип-чек**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 5: Коммит**

```bash
git add src/components/hero/Hero.tsx src/app/page.tsx
git commit -m "feat(about): монтаж секции, перенос <main> в page"
```

---

## Task 7: DossierMotion — pin/scrub мастер-таймлайн

Моушн изолирован, как `ManifestMotion`. На desktop (`min-width:768px` и `pointer:fine`) — секция пиннится, мастер-таймлайн скрабится. На мобиле/тач — простой reveal один раз (без пиннинга). Селекторы-строки в `useGSAP({scope})` автоматически скоупятся к `ref`. В юнит-тестах `matchMedia` всегда `matches:false` → ни одна ветка не запускается (безопасно).

**Files:**
- Create: `src/components/about/DossierMotion.tsx`
- Modify: `src/components/about/About.tsx` (обернуть карту дела в `<DossierMotion>`)

- [ ] **Step 1: Создать компонент моушна**

`src/components/about/DossierMotion.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';

export function DossierMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');
      if (!section) return;

      const ageEl = root.querySelector<HTMLElement>('[data-age]');
      const counter = { v: 0 };
      const setAge = () => {
        if (ageEl) ageEl.textContent = String(Math.round(counter.v));
      };

      // disposition: построчный reveal через SplitText (идиома манифеста hero)
      const dispoEl = root.querySelector<HTMLElement>('[data-disposition]');
      const dispoSplit = dispoEl
        ? new SplitText(dispoEl, { type: 'lines', mask: 'lines' })
        : null;

      // рассекречивание: синхронизировать DOM-состояние грифа + декод текста
      const declassify = () => {
        root.querySelectorAll<HTMLElement>('[data-redacted]').forEach((b) => {
          b.dataset.open = 'true';
          b.setAttribute('aria-expanded', 'true');
        });
        root
          .querySelectorAll<HTMLElement>('[data-redacted-value]')
          .forEach((el) => {
            gsap.to(el, {
              duration: 0.7,
              scrambleText: {
                text: el.textContent ?? '',
                chars: 'upperAndLowerCase',
                revealDelay: 0.15,
              },
            });
          });
      };

      const mm = gsap.matchMedia();

      // DESKTOP — pin + scrub
      mm.add('(min-width: 768px) and (pointer: fine)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
          },
        });
        tl.from('[data-folder]', {
          autoAlpha: 0,
          rotateX: -10,
          transformOrigin: 'top center',
          duration: 0.4,
        });
        tl.from('[data-mugshot]', { autoAlpha: 0, y: -36, duration: 0.4 }, '<0.1');
        tl.from(
          '[data-dossier-field]',
          { autoAlpha: 0, y: 22, stagger: 0.06, duration: 0.4 },
          '<',
        );
        if (ageEl) {
          tl.to(
            counter,
            { v: 19, snap: { v: 1 }, duration: 0.4, onUpdate: setAge },
            '<',
          );
        }
        if (dispoSplit) {
          tl.from(
            dispoSplit.lines,
            { yPercent: 110, opacity: 0, stagger: 0.08, duration: 0.4 },
            '<',
          );
        }
        tl.from('[data-fp]', { drawSVG: '0%', stagger: 0.04, duration: 0.5 }, '>-0.1');
        tl.to(
          '[data-redaction-bar]',
          { scaleX: 0, transformOrigin: 'right', stagger: 0.1, duration: 0.4 },
          '>-0.05',
        );
        tl.call(declassify);
        tl.from(
          '[data-stamp]',
          {
            autoAlpha: 0,
            scale: 2,
            rotate: -28,
            duration: 0.3,
            ease: 'back.out(2)',
          },
          '>-0.1',
        );
      });

      // MOBILE / TOUCH — простой reveal один раз
      mm.add('(max-width: 767px), (pointer: coarse)', () => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.from('[data-dossier-field]', {
              autoAlpha: 0,
              y: 22,
              stagger: 0.06,
              duration: 0.5,
            });
            if (dispoSplit) {
              gsap.from(dispoSplit.lines, {
                yPercent: 110,
                opacity: 0,
                stagger: 0.08,
                duration: 0.5,
              });
            }
            gsap.from('[data-fp]', { drawSVG: '0%', stagger: 0.04, duration: 0.6 });
            if (ageEl) {
              gsap.to(counter, {
                v: 19,
                snap: { v: 1 },
                duration: 0.8,
                onUpdate: setAge,
              });
            }
            gsap.to('[data-redaction-bar]', {
              scaleX: 0,
              transformOrigin: 'right',
              stagger: 0.12,
              duration: 0.5,
              onComplete: declassify,
            });
            gsap.from('[data-stamp]', {
              autoAlpha: 0,
              scale: 1.6,
              duration: 0.4,
              delay: 0.4,
            });
          },
        });
      });

      return () => {
        mm.revert();
        dispoSplit?.revert();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
```

- [ ] **Step 2: Обернуть карту дела в DossierMotion**

В `src/components/about/About.tsx`:
1. Добавить импорт после строки импорта `Fingerprint`:

```tsx
import { DossierMotion } from './DossierMotion';
```

2. Обернуть существующий `<div data-folder …>…</div>` в `<DossierMotion>…</DossierMotion>` (открывающий тег — сразу после открытия `<section …>`, закрывающий — перед `</section>`):

```tsx
    <section
      id="about"
      data-cursor="scan"
      className="grain relative flex min-h-[100svh] items-center border-t border-[var(--color-line)] px-14 py-20 max-md:px-6"
    >
      <DossierMotion>
        <div
          data-folder
          className="relative z-[2] mx-auto flex w-full max-w-[1100px] gap-12 max-lg:flex-col"
        >
          {/* ...без изменений... */}
        </div>
      </DossierMotion>
    </section>
```

- [ ] **Step 3: Прогнать весь тест-сьют — рендер не сломан моушном**

Run: `npx vitest run`
Expected: PASS (About-тесты зелёные; matchMedia=false → таймлайны не создаются).

- [ ] **Step 4: Тип-чек**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 5: Коммит**

```bash
git add src/components/about/DossierMotion.tsx src/components/about/About.tsx
git commit -m "feat(about): pin/scrub-моушн досье (DossierMotion)"
```

---

## Task 8: Scan-вариант кастомного курсора над делом

Расширяем общий `Cursor`: над `[data-cursor="scan"]` точка превращается в «лупу/скан» (класс `.is-scan`, стили уже в globals из Task 5). Класс `cursor-dot` нужен как якорь для `.is-scan`.

**Files:**
- Modify: `src/components/cursor/Cursor.tsx`

- [ ] **Step 1: Добавить scan-листенеры и класс-якорь**

В `src/components/cursor/Cursor.tsx`:

1. В блоке после настройки магнитных элементов (перед `return () => {`), добавить:

```tsx
    // scan-зоны (досье): курсор становится «лупой»
    const scans = Array.from(
      document.querySelectorAll<HTMLElement>('[data-cursor="scan"]'),
    );
    const scanCleaners = scans.map((s) => {
      const enter = () => el.classList.add('is-scan');
      const leave = () => el.classList.remove('is-scan');
      s.addEventListener('mouseenter', enter);
      s.addEventListener('mouseleave', leave);
      return () => {
        s.removeEventListener('mouseenter', enter);
        s.removeEventListener('mouseleave', leave);
      };
    });
```

2. В функции очистки добавить вызов `scanCleaners`:

```tsx
    return () => {
      window.removeEventListener('mousemove', move);
      cleaners.forEach((c) => c());
      scanCleaners.forEach((c) => c());
    };
```

3. В JSX добавить класс `cursor-dot` к `className` точки (в начало списка классов):

```tsx
      className="cursor-dot pointer-events-none fixed top-0 left-0 z-[60] -mt-5 -ml-5 h-10 w-10 rounded-full mix-blend-screen"
```

- [ ] **Step 2: Тип-чек**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Прогнать тесты — ничего не сломалось**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 4: Коммит**

```bash
git add src/components/cursor/Cursor.tsx
git commit -m "feat(cursor): scan-вариант курсора над делом"
```

---

## Task 9: Верификация (build + браузер + impeccable)

Не пишет код — доказывает «готово» по правилам проекта. Применить скилл **verification-before-completion**.

- [ ] **Step 1: Полный прогон тестов и типов**

Run: `npx vitest run` → все зелёные.
Run: `npm run typecheck` → без ошибок.

- [ ] **Step 2: Чистый прод-билд**

Run: `npm run build`
Expected: успешная сборка без ошибок/ворнингов по About.

- [ ] **Step 3: Проверка в браузере (preview-инструмент)**

Запустить dev (`preview_start`), проверить на 1280 / 768 / 375:
- Desktop (1280): секция пиннится, по скроллу проходит сцена 01→06 (папка → мугшот → поля + счёт возраста 0→19 → отпечаток рисуется → грифы дешифруются → штамп Declassified), курсор над делом — «лупа». 60fps без рывков.
- После анпина: клик/таб по грифу скрывает/раскрывает строку (replay). Фокус с клавиатуры виден, Enter/Space срабатывают.
- 768/375: без пиннинга — секция проявляется при входе; грифы рассекречиваются тапом; нет горизонтального скролла; тач-цели ≥44px.
- Навигация FileNav: клик `01 THE INMATE` плавно скроллит к `#about`.
- Консоль (`preview_console_logs`) без ошибок.

Снять скрин (`preview_screenshot`) для подтверждения.

- [ ] **Step 4: impeccable audit → polish**

Прогнать скилл `impeccable` (audit → polish) по секции; устранить найденное (контраст ≥4.5:1, выравнивание, ритм, состояния фокуса).

- [ ] **Step 5: Финальный коммит правок (если были)**

```bash
git add -A
git commit -m "polish(about): правки по impeccable + проверке в браузере"
```

> **Деплой в прод НЕ делаем в рамках плана.** Секцию собираем на feature-ветке от свежего `main`; merge/прод-деплой — отдельно, по явному «ок» владельца, со сверкой scope (память `deploy-scope-check-before-prod`).

---

## Покрытие спеки (само-ревью)

- §2 раскладка (мугшот/профиль/отпечаток/поля/2 грифа/disposition+AT LARGE/tools/штамп) → Task 2,4,5 ✓
- §3 pin/scrub 6 шагов → Task 7 ✓; клик-рассекречивание после анпина → Task 3 ✓
- §4 контент/копи (точные EN-строки) → Task 2 ✓
- §5 стек: ScrollTrigger pin/scrub ✓, Timeline ✓, SplitText (построчный reveal disposition) ✓, ScrambleText (декод грифов) ✓, DrawSVG (отпечаток) ✓, Lenis (глобально) ✓, курсор-вариант → Task 8 ✓. `Flip` намеренно опущен (rotateX вместо переворота — проще, того же эффекта достаточно).
- §6 адаптив: matchMedia desktop/mobile, стек колонок, тап-рассекречивание → Task 5,7 ✓
- §7 a11y: гриф = `<button>`+aria, значение в DOM, focus-visible, alt мугшота → Task 3,5 ✓
- §8 файлы → совпадают со списком выше ✓
