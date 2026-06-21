# Work «Evidence Locker» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать секцию `#work` «Evidence Locker» — один иммерсивный вещдок (Dream Gold = EVID-01) с телефоном-экспонатом, каруселью живых скринов, форензик-маркерами фишек, on-enter таймлайном и полосой chain-of-custody.

**Architecture:** Серверный каркас `Evidence.tsx` собирает хедер + сцену (устройство слева, маркеры/факты справа) + chain-of-custody и оборачивает всё в клиентский `EvidenceMotion` (on-enter GSAP-таймлайн, паттерн `DossierMotion` — без пиннинга). Карусель скринов живёт в клиентском `ExhibitDevice` на собственном React-state (авто-смена + тап + точки), независимо от GSAP. Контент — в `src/content/evidence.ts`. Весь контент всегда в DOM (фолбэк-видимость): если ScrollTrigger не сработал, секция читается как статичный блок.

**Tech Stack:** Next.js 16 (App Router, RSC) · React 19 · TS strict · Tailwind v4 (токены в `globals.css`) · GSAP (ScrollTrigger / SplitText / ScrambleText / DrawSVG, уже в `src/lib/gsap.ts`) · `next/image` · Vitest + @testing-library/react.

**Спека:** `docs/superpowers/specs/2026-06-21-work-evidence-design.md`.

---

## Заметки для исполнителя (важно)

- **Windows / cwd:** перед каждой командой делать `Set-Location 'C:\Users\ювелир\Desktop\portfolio'` (cwd сбрасывается между командами).
- **Prettier на коммите:** husky + lint-staged переформатируют staged-файлы. После любого `git commit` **перечитывать файл перед следующим Edit** (форматирование могло изменить переносы).
- **Токены (`globals.css`):** `--color-bg #100f0d`, `--color-bone #ece7da`, `--color-steel #9c968a`, `--color-dim #827c70`, `--color-orange #ff5a1e`, `--color-orange-soft`, `--color-line rgba(236,231,218,.12)`. Шрифты: `--font-display` (Anton), `--font-mono` (JetBrains), `--font-label` (Oswald), `--font-stencil` (Saira Stencil).
- **Классы Tailwind v4** пишем как в проекте: `text-[var(--color-orange)]`, `font-[family-name:var(--font-display)]`, `tracking-[0.2em]`, `uppercase`, `max-md:`/`max-lg:`.
- **FileNav трогать НЕ нужно** — `Evidence → #work` (код 03) уже есть в `src/components/chrome/FileNav.tsx`. Якорь оживёт сам, как только в DOM появится `<section id="work">`.
- **Скрины** уже лежат: `public/media/dream-gold/{shop,product,sizer,cart}.png` (~1290×2422, аспект ≈ 0.533 → `aspect-[1290/2422]`).
- **Тесты:** одиночный файл — `npx vitest run <path>`; всё — `npm test`; типы — `npm run typecheck`; билд — `npm run build`.
- **Reduced-motion** в проекте намеренно НЕ уважаем (решение владельца) — отдельных media-веток не добавляем.
- **Коммиты:** Conventional Commits по-русски; каждый коммит заканчивать строкой `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

## Task 0: Ветка от свежего main

**Files:** —

- [ ] **Step 1: Убедиться, что на main чисто и спека/план закоммичены**

Run: `git status`
Expected: рабочее дерево чистое (или только этот план/спека). Ветка `main`.

- [ ] **Step 2: Создать feature-ветку**

Run: `git checkout -b feat/work-evidence`
Expected: `Switched to a new branch 'feat/work-evidence'`

- [ ] **Step 3: Baseline-проверка**

Run: `npm run typecheck`
Expected: без ошибок (зелёный baseline до изменений).

---

## Task 1: Контент секции — `src/content/evidence.ts`

**Files:**
- Create: `src/content/evidence.ts`
- Test: `src/content/evidence.test.ts`

- [ ] **Step 1: Написать падающий тест**

Create `src/content/evidence.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { evidence } from './evidence';

describe('evidence content', () => {
  it('эйдброу и интро на месте', () => {
    expect(evidence.eyebrow).toBe('Evidence');
    expect(evidence.intro).toMatch(/submit the following evidence/i);
  });
  it('экспонат EVID-01 = Dream Gold, 3 маркера, 4 скрина', () => {
    expect(evidence.exhibit.code).toBe('EVID-01');
    expect(evidence.exhibit.title).toMatch(/Dream Gold/);
    expect(evidence.exhibit.markers).toHaveLength(3);
    expect(evidence.exhibit.shots).toHaveLength(4);
  });
  it('все скрины имеют src и непустой alt', () => {
    for (const s of evidence.exhibit.shots) {
      expect(s.src).toMatch(/^\/media\/dream-gold\/.+\.png$/);
      expect(s.alt.length).toBeGreaterThan(3);
    }
  });
  it('ссылки — абсолютные https', () => {
    for (const l of evidence.exhibit.links) {
      expect(l.href).toMatch(/^https:\/\//);
      expect(l.label.length).toBeGreaterThan(0);
    }
  });
  it('EVID-02 — pending-сайт', () => {
    expect(evidence.pending.code).toBe('EVID-02');
    expect(evidence.pending.status).toMatch(/pending/i);
  });
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npx vitest run src/content/evidence.test.ts`
Expected: FAIL — `Cannot find module './evidence'`.

- [ ] **Step 3: Создать контент**

Create `src/content/evidence.ts`:

```ts
export const evidence = {
  eyebrow: 'Evidence',
  intro: 'The people submit the following evidence:',
  exhibit: {
    code: 'EVID-01',
    status: 'Admitted · Live',
    title: 'Dream Gold — Telegram Mini App',
    summary:
      'A production storefront living inside Telegram — used daily by a real jewelry atelier to take orders.',
    markers: [
      { n: '1', title: 'AI product cards', note: 'GPT-4o-mini vision' },
      { n: '2', title: 'On-screen ring sizer', note: 'px → mm' },
      {
        n: '3',
        title: 'HMAC-signed orders',
        note: 'Trilingual · light + dark · ~77 KB',
      },
    ],
    facts: ['Live', 'Telegram Mini App', '~77 KB', '×3 lang'],
    tags: ['Telegram Mini App', 'React', 'TypeScript', 'OpenAI', 'Supabase'],
    shots: [
      {
        src: '/media/dream-gold/shop.png',
        alt: 'Dream Gold storefront inside Telegram',
        label: 'Shop',
      },
      {
        src: '/media/dream-gold/product.png',
        alt: 'Dream Gold product card',
        label: 'Product',
      },
      {
        src: '/media/dream-gold/sizer.png',
        alt: 'On-screen ring sizer measuring in millimetres',
        label: 'Sizer',
      },
      {
        src: '/media/dream-gold/cart.png',
        alt: 'Dream Gold cart and order',
        label: 'Cart',
      },
    ],
    links: [
      {
        label: 'Open exhibit',
        href: 'https://t.me/dreamgold_jewelry_bot/shop',
        kind: 'primary',
      },
      {
        label: 'Web demo',
        href: 'https://dreamgold-jewelry.vercel.app',
        kind: 'secondary',
      },
    ],
  },
  pending: {
    code: 'EVID-02',
    status: 'Pending',
    title: 'Dream Gold — Website',
    summary: 'A full marketing site for the atelier — in the works.',
  },
} as const;
```

- [ ] **Step 4: Запустить тест — убедиться, что зелёный**

Run: `npx vitest run src/content/evidence.test.ts`
Expected: PASS (5 тестов).

- [ ] **Step 5: Коммит**

```bash
git add src/content/evidence.ts src/content/evidence.test.ts
git commit -m "feat(work): контент evidence.ts (Dream Gold = EVID-01)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Маркеры-улики — `EvidenceMarkers.tsx`

**Files:**
- Create: `src/components/work/EvidenceMarkers.tsx`
- Test: `src/components/work/EvidenceMarkers.test.tsx`

- [ ] **Step 1: Написать падающий тест**

Create `src/components/work/EvidenceMarkers.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EvidenceMarkers } from './EvidenceMarkers';

describe('EvidenceMarkers', () => {
  it('рендерит список из 3 маркеров с заголовком и заметкой', () => {
    const { container } = render(<EvidenceMarkers />);
    expect(container.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('AI product cards')).toBeInTheDocument();
    expect(screen.getByText(/GPT-4o-mini vision/)).toBeInTheDocument();
    expect(screen.getByText('On-screen ring sizer')).toBeInTheDocument();
    expect(screen.getByText('HMAC-signed orders')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `npx vitest run src/components/work/EvidenceMarkers.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/components/work/EvidenceMarkers.tsx`:

```tsx
import { evidence } from '@/content/evidence';

export function EvidenceMarkers() {
  return (
    <ol className="mt-8 flex flex-col gap-5">
      {evidence.exhibit.markers.map((m) => (
        <li
          data-marker
          key={m.n}
          className="flex items-start gap-4"
        >
          <span
            aria-hidden="true"
            className="relative mt-1 inline-flex h-7 w-7 flex-none items-center justify-center"
          >
            <svg viewBox="0 0 28 28" className="absolute inset-0 h-7 w-7">
              <path d="M2 22 L14 4 L26 22 Z" fill="var(--color-orange)" />
            </svg>
            <span
              data-marker-num
              className="relative font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--color-bg)]"
            >
              {m.n}
            </span>
          </span>
          <span className="flex flex-col">
            <span
              data-marker-label
              className="text-[15px] tracking-[0.01em] text-[var(--color-bone)]"
            >
              {m.title}
            </span>
            <span className="mt-0.5 text-[12px] tracking-[0.04em] text-[var(--color-dim)]">
              {m.note}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/work/EvidenceMarkers.test.tsx`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add src/components/work/EvidenceMarkers.tsx src/components/work/EvidenceMarkers.test.tsx
git commit -m "feat(work): форензик-маркеры фишек (EvidenceMarkers)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Полоса chain-of-custody — `ChainOfCustody.tsx`

**Files:**
- Create: `src/components/work/ChainOfCustody.tsx`
- Test: `src/components/work/ChainOfCustody.test.tsx`

- [ ] **Step 1: Написать падающий тест**

Create `src/components/work/ChainOfCustody.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChainOfCustody } from './ChainOfCustody';

describe('ChainOfCustody', () => {
  it('даёт живые внешние ссылки на экспонат и веб-демо', () => {
    render(<ChainOfCustody />);
    const open = screen.getByRole('link', { name: /open exhibit/i });
    expect(open).toHaveAttribute(
      'href',
      'https://t.me/dreamgold_jewelry_bot/shop',
    );
    expect(open).toHaveAttribute('target', '_blank');
    expect(open).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(screen.getByRole('link', { name: /web demo/i })).toHaveAttribute(
      'href',
      'https://dreamgold-jewelry.vercel.app',
    );
  });
  it('показывает EVID-02 как pending', () => {
    render(<ChainOfCustody />);
    expect(screen.getByText(/EVID-02/)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/components/work/ChainOfCustody.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/components/work/ChainOfCustody.tsx`:

```tsx
import { evidence } from '@/content/evidence';

export function ChainOfCustody() {
  const { exhibit, pending } = evidence;
  return (
    <div className="mt-14 border-t border-[var(--color-line)] pt-6 max-md:mt-10">
      <p className="mb-4 text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
        Chain of custody
      </p>
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {exhibit.links.map((l) => (
          <li data-custody-row key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 text-[14px] tracking-[0.02em] text-[var(--color-bone)] underline-offset-4 transition-colors hover:text-[var(--color-orange)] hover:underline focus-visible:text-[var(--color-orange)] focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
            >
              {l.label}
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
        <li
          data-custody-row
          className="inline-flex min-h-[44px] items-center gap-2 text-[13px] text-[var(--color-steel)]"
        >
          <span className="inline-flex items-center rounded border border-[var(--color-line)] px-2 py-[2px] text-[10px] tracking-[0.12em] text-[var(--color-dim)] uppercase">
            {pending.code} · {pending.status}
          </span>
          <span>{pending.title}</span>
        </li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/work/ChainOfCustody.test.tsx`
Expected: PASS (2 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/work/ChainOfCustody.tsx src/components/work/ChainOfCustody.test.tsx
git commit -m "feat(work): полоса chain-of-custody (живые ссылки + EVID-02 pending)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Стиль штампа `ADMITTED` — `globals.css`

**Files:**
- Modify: `src/app/globals.css` (добавить класс в конец)

- [ ] **Step 1: Добавить класс штампа**

В конец `src/app/globals.css` (после блока `[data-rail-item].is-active { ... }`) добавить:

```css
/* штамп ADMITTED в секции Evidence (мирроринг .stamp-declassified) */
.stamp-admitted {
  position: absolute;
  right: 2%;
  bottom: -2%;
  z-index: 4;
  transform: rotate(-9deg);
  border: 3px solid var(--color-orange);
  color: var(--color-orange);
  border-radius: 6px;
  padding: 5px 14px;
  font: 20px var(--font-stencil);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(16, 15, 13, 0.5);
}
```

- [ ] **Step 2: Проверка типов/сборки не нужна для CSS — коммит**

```bash
git add src/app/globals.css
git commit -m "style(work): класс .stamp-admitted для штампа Evidence
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Устройство-экспонат + карусель — `ExhibitDevice.tsx`

**Files:**
- Create: `src/components/work/ExhibitDevice.tsx`
- Test: `src/components/work/ExhibitDevice.test.tsx`

- [ ] **Step 1: Написать падающий тест (статический фолбэк)**

Create `src/components/work/ExhibitDevice.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExhibitDevice } from './ExhibitDevice';

describe('ExhibitDevice', () => {
  it('рендерит все 4 скрина с alt и метку EVID-01', () => {
    render(<ExhibitDevice />);
    expect(
      screen.getByAltText('Dream Gold storefront inside Telegram'),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Dream Gold product card')).toBeInTheDocument();
    expect(
      screen.getByAltText('On-screen ring sizer measuring in millimetres'),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Dream Gold cart and order')).toBeInTheDocument();
    expect(screen.getByText('EVID-01')).toBeInTheDocument();
  });
  it('даёт фокусируемые кнопки-точки для каждого скрина', () => {
    render(<ExhibitDevice />);
    expect(
      screen.getByRole('button', { name: /show shop/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /show cart/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/components/work/ExhibitDevice.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/components/work/ExhibitDevice.tsx`:

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { evidence } from '@/content/evidence';

export function ExhibitDevice() {
  const { code, shots } = evidence.exhibit;
  const len = shots.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % len), 2800);
    return () => clearInterval(id);
  }, [paused, len]);

  const next = () => setI((p) => (p + 1) % len);

  return (
    <div
      className="relative mx-auto w-[min(280px,72vw)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div data-device className="relative">
        {/* пакет для улик */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -inset-[7%] h-[114%] w-[114%]"
        >
          <rect
            data-bag-draw
            x="2"
            y="2"
            width="96"
            height="96"
            rx="3"
            fill="none"
            stroke="var(--color-steel)"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </svg>

        {/* бирка chain-of-custody */}
        <div className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 -rotate-3 items-center gap-2 rounded-[3px] border border-[var(--color-line)] bg-[rgba(16,15,13,0.9)] px-2.5 py-1">
          <svg aria-hidden="true" viewBox="0 0 30 12" className="h-3 w-[30px]">
            <g fill="var(--color-steel)">
              <rect x="0" y="0" width="2" height="12" />
              <rect x="4" y="0" width="1" height="12" />
              <rect x="7" y="0" width="3" height="12" />
              <rect x="12" y="0" width="1" height="12" />
              <rect x="15" y="0" width="2" height="12" />
              <rect x="19" y="0" width="1" height="12" />
              <rect x="22" y="0" width="3" height="12" />
              <rect x="27" y="0" width="1" height="12" />
            </g>
          </svg>
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-orange)] uppercase">
            {code}
          </span>
        </div>

        {/* телефон */}
        <div className="relative rounded-[30px] border border-[var(--color-line)] bg-[#1a1815] p-[8px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative overflow-hidden rounded-[22px] aspect-[1290/2422] bg-[#0d0c0a]">
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

            {/* «измерительная» линейка (DrawSVG) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <line
                data-ruler
                x1="6"
                y1="50"
                x2="94"
                y2="50"
                stroke="var(--color-orange)"
                strokeWidth="0.5"
                strokeOpacity="0.5"
              />
            </svg>

            {/* подпись текущего кадра */}
            <span className="absolute bottom-2 left-2 z-10 rounded-[3px] bg-[rgba(16,15,13,0.7)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-bone)] uppercase">
              {shots[i].label}
            </span>

            {/* тап по экрану листает */}
            <button
              type="button"
              onClick={next}
              aria-label="Next screenshot"
              className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-orange)]"
            />
          </div>
        </div>
      </div>

      {/* точки-индикаторы */}
      <div className="mt-4 flex items-center justify-center gap-1">
        {shots.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.label}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className="inline-flex h-[44px] w-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[var(--color-orange)]"
          >
            <span
              className={`block h-2 w-2 rounded-full transition-colors ${
                idx === i
                  ? 'bg-[var(--color-orange)]'
                  : 'bg-[var(--color-line)]'
              }`}
            />
          </button>
        ))}
      </div>

      {/* штамп ADMITTED */}
      <span data-admitted aria-hidden="true" className="stamp-admitted">
        Admitted
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/work/ExhibitDevice.test.tsx`
Expected: PASS (2 теста). Допустимы предупреждения next/image в jsdom — это норм (как в About.test).

- [ ] **Step 5: Коммит**

```bash
git add src/components/work/ExhibitDevice.tsx src/components/work/ExhibitDevice.test.tsx
git commit -m "feat(work): устройство-экспонат + карусель живых скринов (ExhibitDevice)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: On-enter моушн — `EvidenceMotion.tsx`

**Files:**
- Create: `src/components/work/EvidenceMotion.tsx`

> Моушн в юнит-тестах не гоняем (паттерн проекта) — проверяется в браузере (Task 9). Контент остаётся виден без анимации (фолбэк): таймлайн только прячет-и-проявляет через `.from()` в `onEnter`.

- [ ] **Step 1: Реализация**

Create `src/components/work/EvidenceMotion.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';

export function EvidenceMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');
      if (!section) return;

      let titleSplit: SplitText | null = null;

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          // 1. «пакет» прорисовывается
          tl.from('[data-bag-draw]', { drawSVG: '0%', duration: 0.7 }, 0);

          // 2. устройство поднимается и доворачивается к камере
          tl.from(
            '[data-device]',
            {
              autoAlpha: 0,
              y: 44,
              rotate: -6,
              transformOrigin: 'center',
              duration: 0.9,
            },
            0.1,
          );

          // 3. заголовок экспоната по словам
          const title = root.querySelector<HTMLElement>('[data-exhibit-title]');
          if (title) {
            titleSplit = new SplitText(title, { type: 'words' });
            tl.from(
              titleSplit.words,
              { autoAlpha: 0, y: 20, stagger: 0.05, duration: 0.6 },
              0.35,
            );
          }

          // 4. маркеры падают по очереди + скрэмбл номеров
          tl.from(
            '[data-marker]',
            {
              autoAlpha: 0,
              y: 26,
              scale: 0.9,
              transformOrigin: 'left center',
              stagger: 0.12,
              duration: 0.5,
              ease: 'back.out(1.7)',
            },
            0.5,
          );
          root
            .querySelectorAll<HTMLElement>('[data-marker-num]')
            .forEach((el, idx) => {
              const txt = el.textContent || '';
              tl.to(
                el,
                {
                  duration: 0.4,
                  scrambleText: { text: txt, chars: '0123456789' },
                },
                0.55 + idx * 0.12,
              );
            });

          // 5. факты + «измерительная» линейка
          tl.from(
            '[data-fact]',
            { autoAlpha: 0, y: 14, stagger: 0.05, duration: 0.4 },
            0.75,
          );
          tl.from('[data-ruler]', { drawSVG: '0%', duration: 0.6 }, 0.85);

          // 6. слэм-штамп ADMITTED + микро-тряска сцены
          tl.from(
            '[data-admitted]',
            {
              autoAlpha: 0,
              scale: 1.8,
              rotate: -20,
              transformOrigin: 'center',
              duration: 0.5,
              ease: 'back.out(1.7)',
            },
            1.05,
          );
          tl.add(
            () =>
              gsap.fromTo(
                section,
                { x: -4 },
                { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.45)' },
              ),
            1.1,
          );

          // 7. chain of custody проявляется
          tl.from(
            '[data-custody-row]',
            { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.5 },
            1.15,
          );
        },
      });

      return () => {
        st.kill();
        titleSplit?.revert();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
```

- [ ] **Step 2: Проверить типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Коммит**

```bash
git add src/components/work/EvidenceMotion.tsx
git commit -m "feat(work): on-enter таймлайн EvidenceMotion (пакет→девайс→маркеры→слэм→custody)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Каркас секции — `Evidence.tsx`

**Files:**
- Create: `src/components/work/Evidence.tsx`
- Test: `src/components/work/Evidence.test.tsx`

- [ ] **Step 1: Написать падающий тест (фолбэк-видимость + семантика)**

Create `src/components/work/Evidence.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Evidence } from './Evidence';

describe('Evidence', () => {
  it('секция имеет id=work и семантический h2-интро', () => {
    const { container } = render(<Evidence />);
    expect(container.querySelector('section#work')).toBeInTheDocument();
    const h2 = container.querySelector('h2');
    expect(h2?.textContent).toMatch(/submit the following evidence/i);
  });
  it('показывает заголовок экспоната и summary (фолбэк без анимации)', () => {
    render(<Evidence />);
    expect(
      screen.getByText('Dream Gold — Telegram Mini App'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/used daily by a real jewelry atelier/i),
    ).toBeInTheDocument();
  });
  it('содержит живую ссылку на экспонат', () => {
    render(<Evidence />);
    expect(screen.getByRole('link', { name: /open exhibit/i })).toHaveAttribute(
      'href',
      'https://t.me/dreamgold_jewelry_bot/shop',
    );
  });
});
```

- [ ] **Step 2: Запустить — падает**

Run: `npx vitest run src/components/work/Evidence.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

Create `src/components/work/Evidence.tsx`:

```tsx
import { evidence } from '@/content/evidence';
import { ExhibitDevice } from './ExhibitDevice';
import { EvidenceMarkers } from './EvidenceMarkers';
import { ChainOfCustody } from './ChainOfCustody';
import { EvidenceMotion } from './EvidenceMotion';

export function Evidence() {
  const { eyebrow, intro, exhibit } = evidence;
  return (
    <section id="work" className="relative px-14 py-24 max-md:px-6 max-md:py-16">
      <EvidenceMotion>
        <div className="relative mx-auto w-full max-w-[1100px]">
          <header className="mb-12 max-md:mb-8">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {eyebrow}
            </p>
            <h2 className="mt-4 max-w-[24ch] text-[clamp(20px,3vw,32px)] leading-[1.15] text-[var(--color-steel)]">
              {intro}
            </h2>
          </header>

          <div className="flex items-start gap-12 max-lg:flex-col max-lg:items-center max-lg:gap-10">
            <div className="flex-[0.9] max-lg:w-full">
              <ExhibitDevice />
            </div>

            <div className="flex-[1.1] max-lg:w-full">
              <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[var(--color-dim)] uppercase">
                {exhibit.code} · {exhibit.status}
              </p>
              <h3
                data-exhibit-title
                className="mt-3 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] leading-[1.04] tracking-[0.01em] text-[var(--color-bone)] uppercase"
              >
                {exhibit.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-[var(--color-steel)]">
                {exhibit.summary}
              </p>

              <EvidenceMarkers />

              <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
                {exhibit.facts.map((f) => (
                  <li
                    data-fact
                    key={f}
                    className="inline-flex items-center rounded-full border border-[var(--color-line)] px-3 py-1 text-[11px] tracking-[0.08em] text-[var(--color-steel)] uppercase"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[12px] tracking-[0.04em] text-[var(--color-dim)]">
                {exhibit.tags.join(' · ')}
              </p>
            </div>
          </div>

          <ChainOfCustody />
        </div>
      </EvidenceMotion>
    </section>
  );
}
```

- [ ] **Step 4: Запустить — зелёный**

Run: `npx vitest run src/components/work/Evidence.test.tsx`
Expected: PASS (3 теста).

- [ ] **Step 5: Прогнать весь набор тестов**

Run: `npm test`
Expected: все зелёные (новые work-тесты + существующие hero/about/services).

- [ ] **Step 6: Коммит**

```bash
git add src/components/work/Evidence.tsx src/components/work/Evidence.test.tsx
git commit -m "feat(work): каркас секции Evidence (хедер + сцена + custody)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Монтаж в страницу + сборка

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Подключить секцию после Services**

В `src/app/page.tsx` добавить импорт рядом с остальными:

```tsx
import { Evidence } from '@/components/work/Evidence';
```

И в `<main>` после `<Services />`:

```tsx
        <main>
          <Hero />
          <About />
          <Services />
          <Evidence />
        </main>
```

- [ ] **Step 2: Типы**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Прод-сборка**

Run: `npm run build`
Expected: чистый build без ошибок и без новых next/image-варнингов (если на `shop.png` появится LCP-варнинг — он ожидаем, кадр уже `priority`).

- [ ] **Step 4: Коммит**

```bash
git add src/app/page.tsx
git commit -m "feat(work): монтаж секции Evidence в page.tsx (после Services)
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Проверка в браузере + impeccable

**Files:** — (правки по итогам — точечно в уже созданных файлах)

- [ ] **Step 1: Запустить dev и проверить секцию**

Через preview-инструмент: `preview_start` (`npm run dev`), доскроллить до `#work`.
Проверить:
- on-enter таймлайн играет один раз (пакет→девайс→маркеры со скрэмблом номеров→линейка→слэм ADMITTED + микро-тряска→custody);
- карусель скринов авто-листает ~2.8s, тап по экрану листает, точки переключают, hover/focus ставит на паузу;
- `console`/`network` без ошибок; скрины грузятся.

- [ ] **Step 2: Брейкпоинты**

`preview_resize` 1280 / 768 / 375. Проверить:
- нет горизонтального скролла;
- на `max-lg` сцена в одну колонку (устройство по центру, маркеры/факты под ним), custody переносится без обрезки;
- тач-цели (точки, тап-экран, ссылки) ≥44px;
- контраст текста на бетоне читаемый (bone/steel/orange/dim — токены уже AA).

- [ ] **Step 3: Скриншоты-доказательства**

`preview_screenshot` на 1280 и 375 — приложить владельцу.

- [ ] **Step 4: impeccable audit → polish**

Запустить скилл `impeccable` (`audit` → `polish`) по секции Evidence: вычитка иерархии, ритма, выравниваний, моушн-таймингов. Точечные правки — в созданных файлах. После правок повторить `npm test` + `npm run build`.

- [ ] **Step 5: Финальный коммит правок (если были)**

```bash
git add -A
git commit -m "polish(work): impeccable — вычитка секции Evidence
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Завершение ветки

После Task 9 — секция готова на ветке `feat/work-evidence`. Дальше по решению владельца:
- merge в `main` / прод-деплой — **только по явному «ок»** (сверить scope ветки с продом, память `deploy-scope-check-before-prod`; держать откат);
- обновить `CLAUDE.md` (статус: Evidence в проде) и память `portfolio-next-build-sections`;
- следующий срез — VISITING HOURS (#contact) + контакт-форма (портировать из `archive/luca-portfolio-2026-06-20`), затем SEO sitemap/robots.

## Покрытие спеки → задачами (self-review)

- §1 форма A / Evidence Locker / EVID-01 — Task 1 (контент) + Task 7 (каркас).
- §2 раскладка desktop (хедер h2, сцена, custody) — Task 7.
- §3 хореография on-enter (пакет→девайс→маркеры/скрэмбл→линейка→слэм+тряска→custody) — Task 6.
- §3 карусель (авто + тап + точки + пауза) — Task 5.
- §4 мобайл (одна колонка, ≥44px, без гор. скролла) — Task 7 (классы) + Task 9 (проверка).
- §5 контент/копи — Task 1.
- §6 GSAP-стек — Task 6 (плагины уже в `src/lib/gsap.ts`).
- §7 файлы/компоненты — Tasks 1,2,3,5,6,7,8.
- §8 a11y (h2, списки, alt, aria-label, живые ссылки, focus-visible) — Tasks 2,3,5,7.
- §9 тесты — Tasks 1,2,3,5,7.
- §10 открытые вопросы (SVG пакета/линейки, тайминги, тряска, LCP) — Task 5 + Task 9 (финал в браузере).
