# Services «Charges» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать секцию `#services` («Charges» — обвинительный акт): 5 пунктов-обвинений со слэмом штампа `GUILTY` и финалом `SENTENCE`, desktop pin+snap / mobile on-enter.

**Architecture:** Контент в `src/content/services.ts`. Презентационные компоненты (`CountCard`, `CaseRail`, `Verdict`) рендерят разметку с `data-*`-хуками и видны по умолчанию (фолбэк). Моушн-обёртка `ChargesMotion` (`useGSAP` + `gsap.matchMedia`) драйвит анимацию: общий one-shot `revealCount(card)` для обеих платформ; desktop — пин + snap (один пункт на сцене), mobile — on-enter по стопке. `<Services/>` монтируется в `page.tsx` после `<About/>`.

**Tech Stack:** Next.js 16 / React 19 / TS strict / Tailwind v4 (токены `var(--color-*)`) / GSAP (ScrollTrigger, SplitText, ScrambleText, DrawSVG — уже зарегистрированы в `src/lib/gsap.ts`) / Vitest + Testing Library.

**Спека:** `docs/superpowers/specs/2026-06-21-services-charges-design.md`. **Ветка:** `feat/services-charges` (уже создана, спек закоммичен).

**Команды:** один файл — `npx vitest run <path>`; всё — `npm test`; типы — `npm run typecheck`; сборка — `npm run build`; превью — `preview_start`.

**Заметка про моушн и тесты:** в jsdom `window.matchMedia(...).matches === false` для любого запроса (см. `src/test/setup.ts`), поэтому **обе ветки `mm.add(...)` в тестах не выполняются** — анимация не трогает DOM, контент виден как отрендерен. Тесты проверяют именно фолбэк-видимость. Сам моушн проверяется **в браузере** (Задача 8), юнит-тестов на него нет.

---

## Файловая структура

```
src/content/services.ts                      — Создать: данные counts + копи
src/content/services.test.ts                 — Создать: тест контента
src/components/services/CountCard.tsx        — Создать: один пункт (цифра/charge/gloss/штамп)
src/components/services/CountCard.test.tsx   — Создать
src/components/services/CaseRail.tsx         — Создать: индекс-рейл (desktop)
src/components/services/CaseRail.test.tsx    — Создать
src/components/services/Verdict.tsx          — Создать: финал SENTENCE
src/components/services/Verdict.test.tsx     — Создать
src/components/services/ChargesMotion.tsx    — Создать: useGSAP, matchMedia, revealCount
src/components/services/Services.tsx         — Создать: сборка секции
src/components/services/Services.test.tsx    — Создать
src/app/globals.css                          — Изменить: правило .is-active для рейла
src/app/page.tsx                             — Изменить: смонтировать <Services/> после <About/>
```

---

## Task 1: Контент секции (`services.ts`)

**Files:**
- Create: `src/content/services.ts`
- Test: `src/content/services.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
import { describe, it, expect } from 'vitest';
import { services } from './services';

describe('services content', () => {
  it('пять пунктов обвинения с номерами 01–05', () => {
    expect(services.counts).toHaveLength(5);
    expect(services.counts.map((c) => c.n)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
    ]);
  });
  it('у каждого пункта есть charge, gloss и plea «guilty»', () => {
    services.counts.forEach((c) => {
      expect(c.charge.length).toBeGreaterThan(3);
      expect(c.gloss.length).toBeGreaterThan(10);
      expect(c.plea).toMatch(/guilty/i);
    });
  });
  it('эйдброу, интро и вердикт заданы', () => {
    expect(services.eyebrow.toLowerCase()).toBe('charges');
    expect(services.intro.length).toBeGreaterThan(10);
    expect(services.verdict.headline).toMatch(/guilty/i);
    expect(services.verdict.sentence.length).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Запустить тест — должен упасть**

Run: `npx vitest run src/content/services.test.ts`
Expected: FAIL — `Cannot find module './services'`.

- [ ] **Step 3: Создать `src/content/services.ts`**

```ts
export const services = {
  eyebrow: 'Charges',
  intro: 'The people charge the defendant with:',
  counts: [
    {
      n: '01',
      charge: 'Unlawful web construction',
      gloss: 'Fast, distinctive sites — motion that earns attention.',
      plea: 'Guilty',
    },
    {
      n: '02',
      charge: 'Operating products inside Telegram',
      gloss: 'Full products that live inside the chat.',
      plea: 'Guilty',
    },
    {
      n: '03',
      charge: 'Deployment of autonomous AI',
      gloss: 'Tools that ship and take real orders.',
      plea: 'Guilty',
    },
    {
      n: '04',
      charge: 'Elimination of manual labour',
      gloss: 'Deletes the busywork — automation that runs itself.',
      plea: 'Guilty',
    },
    {
      n: '05',
      charge: 'Designing what he builds',
      gloss: 'End to end — from the first pixel to the bottom line.',
      plea: 'Guilty',
    },
  ],
  verdict: {
    eyebrow: 'The court finds the defendant',
    headline: 'Guilty on all five counts',
    sentenceLabel: 'Sentence',
    sentence: 'Sentenced to keep shipping products that take real orders.',
  },
} as const;
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `npx vitest run src/content/services.test.ts`
Expected: PASS (3 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/content/services.ts src/content/services.test.ts
git commit -m "feat(services): контент пунктов обвинения"
```

---

## Task 2: Карточка пункта (`CountCard.tsx`)

**Files:**
- Create: `src/components/services/CountCard.tsx`
- Test: `src/components/services/CountCard.test.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CountCard } from './CountCard';

const count = {
  n: '02',
  charge: 'Operating products inside Telegram',
  gloss: 'Full products that live inside the chat.',
  plea: 'Guilty',
} as const;

describe('CountCard', () => {
  it('рендерит номер, обвинение и пояснение', () => {
    render(
      <ul>
        <CountCard count={count} total={5} />
      </ul>,
    );
    expect(screen.getByText('Operating products inside Telegram')).toBeInTheDocument();
    expect(screen.getByText(/Full products that live/)).toBeInTheDocument();
    expect(screen.getAllByText('02').length).toBeGreaterThan(0);
  });
  it('заголовок обвинения — это heading', () => {
    const { container } = render(
      <ul>
        <CountCard count={count} total={5} />
      </ul>,
    );
    expect(container.querySelector('h3')?.textContent).toMatch(/Operating products/);
  });
});
```

- [ ] **Step 2: Запустить — упадёт**

Run: `npx vitest run src/components/services/CountCard.test.tsx`
Expected: FAIL — `Cannot find module './CountCard'`.

- [ ] **Step 3: Создать `src/components/services/CountCard.tsx`**

```tsx
import { services } from '@/content/services';

type Count = (typeof services.counts)[number];

export function CountCard({
  count,
  total,
}: {
  count: { n: string; charge: string; gloss: string; plea: string };
  total: number;
}) {
  return (
    <li
      data-count
      className="relative flex flex-col justify-center max-lg:min-h-[78vh]"
    >
      <span className="mb-3 inline-flex items-center gap-3 text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
        <span aria-hidden="true">Count</span>
        <span className="lg:hidden text-[var(--color-orange)]">
          {count.n} / {String(total).padStart(2, '0')}
        </span>
      </span>

      <div className="flex items-start gap-6 max-md:flex-col max-md:gap-3">
        <span
          data-count-num
          aria-hidden="true"
          className="font-[family-name:var(--font-display)] text-[clamp(64px,12vw,150px)] leading-[0.85] text-[var(--color-orange)]"
        >
          {count.n}
        </span>

        <div className="pt-2">
          <h3
            data-count-charge
            className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(28px,4vw,46px)] leading-[1.02] tracking-[0.01em] text-[var(--color-bone)] uppercase"
          >
            {count.charge}
          </h3>
          <p
            data-count-gloss
            className="mt-4 max-w-[42ch] text-[14px] leading-[1.6] text-[var(--color-steel)]"
          >
            {count.gloss}
          </p>
        </div>
      </div>

      <span
        data-count-stamp
        aria-hidden="true"
        className="relative mt-6 inline-flex w-fit items-center justify-center"
      >
        <svg
          viewBox="0 0 168 56"
          className="h-[52px] w-[156px]"
          fill="none"
          aria-hidden="true"
        >
          <rect
            data-stamp-draw
            x="3"
            y="3"
            width="162"
            height="50"
            rx="6"
            stroke="var(--color-orange)"
            strokeWidth="3"
          />
        </svg>
        <span className="absolute font-[family-name:var(--font-stencil)] text-[22px] tracking-[0.08em] text-[var(--color-orange)] uppercase">
          {count.plea}
        </span>
      </span>
    </li>
  );
}

export type { Count };
```

- [ ] **Step 4: Запустить — пройдёт**

Run: `npx vitest run src/components/services/CountCard.test.tsx`
Expected: PASS (2 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/services/CountCard.tsx src/components/services/CountCard.test.tsx
git commit -m "feat(services): карточка пункта обвинения со штампом"
```

---

## Task 3: Индекс-рейл (`CaseRail.tsx`) + правило `.is-active`

**Files:**
- Create: `src/components/services/CaseRail.tsx`
- Test: `src/components/services/CaseRail.test.tsx`
- Modify: `src/app/globals.css` (добавить правило подсветки активного пункта рейла)

- [ ] **Step 1: Написать падающий тест**

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CaseRail } from './CaseRail';

describe('CaseRail', () => {
  it('рендерит 5 пунктов индекса, счётчик и прогресс', () => {
    const { container } = render(<CaseRail />);
    expect(container.querySelectorAll('[data-rail-item]')).toHaveLength(5);
    expect(container.querySelector('[data-rail-tally]')?.textContent).toMatch(
      /guilty/i,
    );
    expect(container.querySelector('[data-rail-progress]')).not.toBeNull();
    expect(container.querySelector('[data-rail-count]')?.textContent).toMatch(
      /01 \/ 05/,
    );
  });
  it('рейл скрыт от скринридера (декоративный индекс)', () => {
    const { container } = render(<CaseRail />);
    expect(container.querySelector('[data-rail]')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });
});
```

- [ ] **Step 2: Запустить — упадёт**

Run: `npx vitest run src/components/services/CaseRail.test.tsx`
Expected: FAIL — `Cannot find module './CaseRail'`.

- [ ] **Step 3: Создать `src/components/services/CaseRail.tsx`**

```tsx
import { services } from '@/content/services';

export function CaseRail() {
  const counts = services.counts;
  const total = String(counts.length).padStart(2, '0');
  return (
    <aside
      data-rail
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      <span
        data-rail-tally
        className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em] text-[var(--color-orange)]"
      >
        Guilty ×0
      </span>
      <ol className="flex flex-col items-end gap-2">
        {counts.map((c, i) => (
          <li
            key={c.n}
            data-rail-item={i}
            className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-dim)] transition-colors"
          >
            {c.n}
          </li>
        ))}
      </ol>
      <span className="mt-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--color-dim)] uppercase">
        Sentence
      </span>
      <div className="mt-2 h-[3px] w-[120px] bg-[#2a2620]">
        <div
          data-rail-progress
          className="h-full w-full origin-left scale-x-[0.2] bg-[var(--color-orange)]"
        />
      </div>
      <span
        data-rail-count
        className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] text-[var(--color-dim)]"
      >
        01 / {total}
      </span>
    </aside>
  );
}
```

- [ ] **Step 4: Добавить правило в `src/app/globals.css`**

В конец файла (после блока `.stamp-declassified`):

```css
/* активный пункт индекс-рейла секции Charges */
[data-rail-item].is-active {
  color: var(--color-orange);
}
```

- [ ] **Step 5: Запустить — пройдёт**

Run: `npx vitest run src/components/services/CaseRail.test.tsx`
Expected: PASS (2 теста).

- [ ] **Step 6: Коммит**

```bash
git add src/components/services/CaseRail.tsx src/components/services/CaseRail.test.tsx src/app/globals.css
git commit -m "feat(services): индекс-рейл дела (01–05, счётчик, прогресс)"
```

---

## Task 4: Финал-вердикт (`Verdict.tsx`)

**Files:**
- Create: `src/components/services/Verdict.tsx`
- Test: `src/components/services/Verdict.test.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Verdict } from './Verdict';

describe('Verdict', () => {
  it('рендерит вердикт и строку приговора', () => {
    render(<Verdict />);
    expect(screen.getByText(/Guilty on all five counts/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentenced to keep shipping/i)).toBeInTheDocument();
  });
  it('хедлайн вердикта — это heading', () => {
    const { container } = render(<Verdict />);
    expect(container.querySelector('h2,h3')?.textContent).toMatch(/Guilty on all/i);
  });
});
```

- [ ] **Step 2: Запустить — упадёт**

Run: `npx vitest run src/components/services/Verdict.test.tsx`
Expected: FAIL — `Cannot find module './Verdict'`.

- [ ] **Step 3: Создать `src/components/services/Verdict.tsx`**

```tsx
import { services } from '@/content/services';

export function Verdict() {
  const v = services.verdict;
  return (
    <div data-verdict className="mt-24 text-center max-md:mt-16">
      <p className="text-[12px] tracking-[0.2em] text-[var(--color-steel)] uppercase">
        {v.eyebrow}
      </p>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(44px,9vw,120px)] leading-[0.9] text-[var(--color-orange)] uppercase">
        {v.headline}
      </h3>
      <p className="mt-6 text-[11px] tracking-[0.3em] text-[var(--color-dim)] uppercase">
        — {v.sentenceLabel} —
      </p>
      <p className="mx-auto mt-3 max-w-[36ch] text-[clamp(16px,2.2vw,22px)] leading-[1.4] text-[var(--color-bone)]">
        {v.sentence}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Запустить — пройдёт**

Run: `npx vitest run src/components/services/Verdict.test.tsx`
Expected: PASS (2 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/services/Verdict.tsx src/components/services/Verdict.test.tsx
git commit -m "feat(services): финал-вердикт SENTENCE"
```

---

## Task 5: Моушн-обёртка (`ChargesMotion.tsx`)

> Юнит-теста нет (в jsdom matchMedia=false → no-op). Корректность — в браузере (Задача 8). Код ниже — рабочая первая версия; тайминги/амплитуды тюнингуются в браузере (см. открытые вопросы спека).

**Files:**
- Create: `src/components/services/ChargesMotion.tsx`

- [ ] **Step 1: Создать `src/components/services/ChargesMotion.tsx`**

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';

export function ChargesMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>('[data-count]', root);
      if (!cards.length) return;
      const railItems = gsap.utils.toArray<HTMLElement>('[data-rail-item]', root);
      const tally = root.querySelector<HTMLElement>('[data-rail-tally]');
      const railCount = root.querySelector<HTMLElement>('[data-rail-count]');
      const progress = root.querySelector<HTMLElement>('[data-rail-progress]');
      const verdict = root.querySelector<HTMLElement>('[data-verdict]');
      const pad = (n: number) => String(n).padStart(2, '0');

      // общий one-shot слэм одного пункта (desktop и mobile)
      const revealCount = (card: HTMLElement) => {
        const num = card.querySelector<HTMLElement>('[data-count-num]');
        const charge = card.querySelector<HTMLElement>('[data-count-charge]');
        const gloss = card.querySelector<HTMLElement>('[data-count-gloss]');
        const stamp = card.querySelector<HTMLElement>('[data-count-stamp]');
        const stampDraw = card.querySelector<SVGElement>('[data-stamp-draw]');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (num) {
          tl.fromTo(num, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0);
          tl.to(
            num,
            {
              duration: 0.5,
              scrambleText: { text: num.textContent || '', chars: '0123456789' },
            },
            0,
          );
        }
        if (charge) {
          const sp = new SplitText(charge, { type: 'words' });
          tl.from(
            sp.words,
            { autoAlpha: 0, y: 24, stagger: 0.06, duration: 0.5 },
            0.1,
          );
        }
        if (gloss) tl.from(gloss, { autoAlpha: 0, y: 14, duration: 0.5 }, 0.25);
        if (stampDraw) tl.from(stampDraw, { drawSVG: '0%', duration: 0.4 }, 0.35);
        if (stamp)
          tl.from(
            stamp,
            {
              autoAlpha: 0,
              scale: 1.8,
              rotate: -16,
              transformOrigin: 'center',
              duration: 0.45,
              ease: 'back.out(1.7)',
            },
            0.35,
          );
        // микро-тряска сцены на удар штампа
        tl.add(
          () =>
            gsap.fromTo(
              section,
              { x: -4 },
              { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.45)' },
            ),
          0.4,
        );
        return tl;
      };

      const setRail = (active: number, stamped: number) => {
        railItems.forEach((it, i) =>
          it.classList.toggle('is-active', i === active),
        );
        if (tally) tally.textContent = `Guilty ×${stamped}`;
        if (railCount)
          railCount.textContent = `${pad(active + 1)} / ${pad(cards.length)}`;
        if (progress)
          gsap.to(progress, {
            scaleX: (active + 1) / cards.length,
            duration: 0.3,
            overwrite: true,
          });
      };

      const revealVerdict = () => {
        if (!verdict) return;
        gsap.fromTo(
          verdict.children,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
        );
      };

      const mm = gsap.matchMedia();

      // DESKTOP: пин + snap, один пункт на сцене
      mm.add('(min-width: 1024px)', () => {
        const stamped = new Set<number>();
        gsap.set(cards, { position: 'absolute', inset: 0, autoAlpha: 0 });
        gsap.set(cards[0], { autoAlpha: 1 });
        if (verdict) gsap.set(verdict, { autoAlpha: 0 });

        let current = -1;
        const total = cards.length + 1; // counts + verdict
        const show = (i: number) => {
          if (i === current) return;
          current = i;
          const isVerdict = i >= cards.length;
          cards.forEach((c, idx) =>
            gsap.to(c, { autoAlpha: idx === i ? 1 : 0, duration: 0.25 }),
          );
          if (verdict)
            gsap.to(verdict, { autoAlpha: isVerdict ? 1 : 0, duration: 0.25 });
          if (isVerdict) {
            revealVerdict();
            return;
          }
          stamped.add(i);
          revealCount(cards[i]);
          setRail(i, stamped.size);
        };

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${total * 90}%`,
          pin: true,
          scrub: true,
          snap: { snapTo: 1 / (total - 1), duration: 0.3, ease: 'power1.inOut' },
          onUpdate: (self) => show(Math.round(self.progress * (total - 1))),
        });
        show(0);
        return () => st.kill();
      });

      // MOBILE/планшет: без пина, on-enter по стопке
      mm.add('(max-width: 1023px)', () => {
        const stamped = new Set<number>();
        const triggers = cards.map((card, i) =>
          ScrollTrigger.create({
            trigger: card,
            start: 'top 72%',
            once: true,
            onEnter: () => {
              stamped.add(i);
              revealCount(card);
              setRail(i, stamped.size);
            },
          }),
        );
        if (verdict) {
          triggers.push(
            ScrollTrigger.create({
              trigger: verdict,
              start: 'top 78%',
              once: true,
              onEnter: revealVerdict,
            }),
          );
        }
        return () => triggers.forEach((t) => t.kill());
      });

      return () => mm.revert();
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
git add src/components/services/ChargesMotion.tsx
git commit -m "feat(services): моушн Charges (pin+snap desktop / on-enter mobile)"
```

---

## Task 6: Сборка секции (`Services.tsx`)

**Files:**
- Create: `src/components/services/Services.tsx`
- Test: `src/components/services/Services.test.tsx`

- [ ] **Step 1: Написать падающий тест** (проверяем фолбэк-видимость: в jsdom моушн не запускается)

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Services } from './Services';

describe('Services', () => {
  it('секция #services с заголовком-интро', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#services')).not.toBeNull();
    expect(
      screen.getByText(/The people charge the defendant with/i),
    ).toBeInTheDocument();
  });
  it('рендерит все 5 обвинений и финал-вердикт (фолбэк)', () => {
    const { container } = render(<Services />);
    expect(container.querySelectorAll('[data-count]')).toHaveLength(5);
    expect(screen.getByText('Unlawful web construction')).toBeInTheDocument();
    expect(screen.getByText('Designing what he builds')).toBeInTheDocument();
    expect(screen.getByText(/Guilty on all five counts/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — упадёт**

Run: `npx vitest run src/components/services/Services.test.tsx`
Expected: FAIL — `Cannot find module './Services'`.

- [ ] **Step 3: Создать `src/components/services/Services.tsx`**

```tsx
import { services } from '@/content/services';
import { CountCard } from './CountCard';
import { CaseRail } from './CaseRail';
import { Verdict } from './Verdict';
import { ChargesMotion } from './ChargesMotion';

export function Services() {
  return (
    <section
      id="services"
      className="relative px-14 py-24 max-md:px-6 max-md:py-16 lg:min-h-screen lg:py-0"
    >
      <ChargesMotion>
        <div className="mx-auto flex w-full max-w-[1100px] flex-col lg:min-h-screen lg:justify-center">
          <header data-charges-header className="mb-12 max-md:mb-8">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {services.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[20ch] text-[clamp(20px,3vw,32px)] leading-[1.15] text-[var(--color-steel)]">
              {services.intro}
            </h2>
          </header>

          <div className="relative lg:h-[60vh]">
            <ol data-charges-list className="lg:contents">
              {services.counts.map((c) => (
                <CountCard key={c.n} count={c} total={services.counts.length} />
              ))}
            </ol>
            <CaseRail />
          </div>

          <Verdict />
        </div>
      </ChargesMotion>
    </section>
  );
}
```

- [ ] **Step 4: Запустить — пройдёт**

Run: `npx vitest run src/components/services/Services.test.tsx`
Expected: PASS (2 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/services/Services.tsx src/components/services/Services.test.tsx
git commit -m "feat(services): сборка секции Charges"
```

---

## Task 7: Монтаж в страницу (`page.tsx`)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Подключить и смонтировать `<Services/>` после `<About/>`**

В `src/app/page.tsx` добавить импорт рядом с остальными:

```tsx
import { Services } from '@/components/services/Services';
```

И в `<main>` поставить `<Services/>` сразу после `<About/>`:

```tsx
        <main>
          <Hero />
          <About />
          <Services />
        </main>
```

- [ ] **Step 2: Прогнать весь набор тестов + типы**

Run: `npm test`
Expected: все тесты зелёные (включая новые).

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Коммит**

```bash
git add src/app/page.tsx
git commit -m "feat(services): монтаж секции Charges в страницу (#services оживает)"
```

---

## Task 8: Проверка в браузере + сборка + impeccable

> Доказательная проверка («готово» = доказано). Моушн руками не у пользователя — проверяем сами через preview.

- [ ] **Step 1: Чистая сборка**

Run: `npm run build`
Expected: успешная сборка без ошибок и без новых ворнингов.

- [ ] **Step 2: Запустить превью**

`preview_start` → дождаться URL дев-сервера.

- [ ] **Step 3: Desktop (1280)** — `preview_resize` 1280; проскроллить к `#services`; убедиться:
  - секция пиннится, пункты сменяются 01→05 со слэмом штампа `GUILTY`;
  - рейл справа: активный пункт оранжевый, `Guilty ×N` растёт, прогресс и `0i / 05` обновляются;
  - финал `SENTENCE` появляется, секция анпинится;
  - `preview_console_logs` — без ошибок; `preview_screenshot` (пруф).

- [ ] **Step 4: Tablet (768) и Mobile (375)** — `preview_resize` 768, затем 375:
  - пиннинга НЕТ; пункты идут стопкой, слэм штампа на въезде каждого;
  - на карточке виден номер `0i / 05`; нет горизонтального скролла;
  - `preview_screenshot` обоих (пруф).

- [ ] **Step 5: Тюнинг (если нужно)** — по наблюдению поправить в `ChargesMotion.tsx` тайминги/длину пина (`end`)/`snap.duration`/амплитуду тряски; повторить Step 3–4. Цель: 60fps, без «залипания».

- [ ] **Step 6: impeccable** — запустить скилл `impeccable` (`audit` → `polish`) по секции; внести правки; повторить сборку и браузер-проверку.

- [ ] **Step 7: Финальный коммит тюнинга/полиша (если были правки)**

```bash
git add -A
git commit -m "polish(services): тайминги моушна и вычитка impeccable"
```

- [ ] **Step 8: Готовность к мержу** — НЕ мержить/деплоить без явного «ок» владельца. Сверить scope ветки с текущим продом (память `deploy-scope-check-before-prod`), показать владельцу что добавляется (`#services`), держать откат наготове. Предложить PR `feat/services-charges` → `main`.

---

## Self-review (сверка плана со спекой)

- **Концепт «обвинение» / 5 counts / GUILTY / SENTENCE** → Task 1 (контент), 2 (карточка+штамп), 4 (вердикт). ✓
- **B1 «один на сцене» (desktop)** → Task 5 desktop-ветка (`show(i)` + абсолютная стопка). ✓
- **M2 mobile (без пина, on-enter, matchMedia)** → Task 5 mobile-ветка. ✓
- **Единый `revealCount(card)`** → Task 5. ✓
- **Слэм: scale+rotate back.out + DrawSVG ink-bleed + микро-тряска, без звука** → Task 5 `revealCount`; штамп-SVG в Task 2. ✓
- **Рейл: индекс 01–05 + Guilty ×N + прогресс + SENTENCE** → Task 3 + `setRail`/`.is-active`. ✓
- **Финал без CTA** → Task 4 (кнопок нет). ✓
- **Монтаж после About, #services оживает** → Task 7; FileNav `#services` уже существует. ✓
- **A11y/фолбэк/адаптив/тесты** → презентационные тесты (фолбэк-видимость), Task 8 (375/768/1280, console). ✓
- **Вне скоупа: контакты/SEO/Soul/SFX** → не входят ни в одну задачу. ✓

Плейсхолдеров нет; имена `data-*`-хуков консистентны между Task 2/3/4 (рендер) и Task 5 (запросы): `data-count`, `data-count-num`, `data-count-charge`, `data-count-gloss`, `data-count-stamp`, `data-stamp-draw`, `data-rail-item`, `data-rail-tally`, `data-rail-count`, `data-rail-progress`, `data-verdict`.
