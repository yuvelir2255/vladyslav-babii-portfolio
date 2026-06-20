# Hero «Case File» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать первый срез портфолио — фундамент (токены/шрифты/контент) + двухэкранный hero «Case File» (прелоадер-lockdown → экран 1: имя+мугшот+табличка → экран 2: манифест-декод) со всем согласованным моушном.

**Architecture:** Next 16 App Router + React 19 + TS strict + Tailwind v4 (токены в `@theme`). Детерминированные части (контент, разметка компонентов, a11y-атрибуты) пишем через TDD на Vitest+RTL. Визуал/моушн (OGL-шейдер, GSAP, курсор, прелоадер) — реальный стартовый код + цикл браузер-верификации (preview-инструмент, 375/768/1280, 60fps); финальные значения темпа/силы эффектов докручиваем в браузере, это шаг верификации, а не плейсхолдер. Компоненты мелкие и сфокусированные (один файл — одна ответственность).

**Tech Stack:** GSAP 3.13+ (ScrollTrigger/SplitText/ScrambleText/DrawSVG/Flip — все бесплатны), `@gsap/react` (useGSAP), Lenis (плавный скролл), OGL (WebGL-шейдер), next/font, next/image, sharp (оптимизация ассета).

**Спека:** `docs/superpowers/specs/2026-06-20-hero-prison-portfolio-design.md`

> **Важно (решение владельца):** `prefers-reduced-motion` НЕ уважаем — анимация всегда включена. Прочая a11y (контраст, focus-visible, alt/aria) сохраняется.

---

## File Structure

```
src/
  app/
    layout.tsx            # next/font, CSS-vars, lang, metadata, SmoothScroll
    globals.css           # @theme токены, база, grain, keyframes
    page.tsx              # Preloader + ConcreteBg + Hero + AudioToggle
  content/
    hero.ts               # типизированный контент hero (строки)
  components/
    hero/
      Hero.tsx            # оркестр: Screen1 + Screen2
      HeroScreen1.tsx     # тикер + левый блок + BookingPhoto
      HeroScreen2.tsx     # манифест (ScrambleText-декод)
      Ticker.tsx          # бегущая строка (marquee)
      BookingPhoto.tsx    # мугшот + EXHIBIT A + штамп + Placard
      Placard.tsx         # letterboard-текст в DOM
    bg/
      ConcreteBg.tsx      # grain + прутья (CSS) + монтирует ShaderBg
      ShaderBg.tsx        # OGL-шейдер (client), фолбэк без WebGL
    motion/
      SmoothScroll.tsx    # Lenis-провайдер (client)
    cursor/
      Cursor.tsx          # курсор-прожектор + магнитные CTA (client)
    chrome/
      Preloader.tsx       # lockdown intake 0→100 (client)
      AudioToggle.tsx     # тумблер звука, off по умолчанию (client)
  lib/
    gsap.ts               # регистрация плагинов GSAP (один раз)
public/
  media/booking/mugshot.webp   # оптимизированный мугшот (из assets/generated)
  audio/ambient.mp3            # CC0 тюремный эмбиент (добавляется отдельно)
```

Тесты колоцируем рядом: `Component.test.tsx`. Vitest подхватывает `**/*.test.tsx`.

---

## Task 1: Установка зависимостей

**Files:** `package.json` (modify)

- [ ] **Step 1: Установить пакеты**

Run:
```bash
npm i gsap @gsap/react lenis ogl
npm i -D sharp
```

- [ ] **Step 2: Проверить, что проект собирается**

Run: `npm run build`
Expected: успешная сборка (текущая заглушка `page.tsx` собирается без ошибок).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: зависимости hero (gsap, @gsap/react, lenis, ogl, sharp)"
```

---

## Task 2: Дизайн-токены и globals.css

**Files:** Modify `src/app/globals.css`

- [ ] **Step 1: Записать токены и базу**

```css
@import 'tailwindcss';

@theme {
  --color-bg: #100f0d;
  --color-bone: #ece7da;
  --color-steel: #9c968a;
  --color-dim: #6f6a60;
  --color-orange: #ff5a1e;
  --color-line: rgba(236, 231, 218, 0.12);

  --font-display: var(--font-anton), 'Arial Narrow', sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
  --font-label: var(--font-oswald), 'Arial Narrow', sans-serif;
  --font-stencil: var(--font-saira-stencil), var(--font-oswald), sans-serif;
}

html {
  color-scheme: dark;
  background: var(--color-bg);
}

body {
  background: var(--color-bg);
  color: var(--color-bone);
  font-family: var(--font-mono);
  -webkit-font-smoothing: antialiased;
}

/* зерно бетона (overlay) */
.grain::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.07;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* едва заметные «прутья» */
.bars::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4;
  background: repeating-linear-gradient(90deg, transparent 0 78px, rgba(0, 0, 0, 0.4) 78px 82px);
  -webkit-mask: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent);
  mask: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent);
}

@keyframes ticker-slide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  /* намеренно пусто: движение не отключаем (решение владельца) */
}
```

- [ ] **Step 2: Проверить сборку**

Run: `npm run build`
Expected: успешно (Tailwind v4 парсит `@theme`).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(style): дизайн-токены case-file + grain/bars/keyframes"
```

---

## Task 3: Шрифты (next/font), layout и метадата

**Files:** Modify `src/app/layout.tsx`

- [ ] **Step 1: Подключить шрифты и CSS-vars**

```tsx
import type { Metadata } from 'next';
import { Anton, JetBrains_Mono, Oswald, Saira_Stencil_One } from 'next/font/google';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const sairaStencil = Saira_Stencil_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-saira-stencil',
});

export const metadata: Metadata = {
  title: 'Vladyslav Babii — Case File',
  description:
    'I build products people use — Telegram Mini Apps, websites and AI tools that ship and take real orders.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${jetbrains.variable} ${oswald.variable} ${sairaStencil.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Проверить сборку**

Run: `npm run build`
Expected: успешно, шрифты резолвятся.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(font): next/font (Anton, JetBrains Mono, Oswald, Saira Stencil)"
```

---

## Task 4: Контент hero (TDD)

**Files:** Create `src/content/hero.ts`, `src/content/hero.test.ts`

- [ ] **Step 1: Написать падающий тест**

```ts
// src/content/hero.test.ts
import { describe, it, expect } from 'vitest';
import { hero } from './hero';

describe('hero content', () => {
  it('содержит имя и роль', () => {
    expect(hero.name).toEqual(['Vladyslav', 'Babii']);
    expect(hero.role).toContain('Telegram Mini Apps');
  });
  it('табличка booking заполнена', () => {
    expect(hero.placard.agency).toBe('Department of Shipping');
    expect(hero.placard.region).toBe('Ukraine');
    expect(hero.placard.number).toBe('VB-19');
  });
  it('есть пункты тикера и две CTA', () => {
    expect(hero.ticker.length).toBeGreaterThanOrEqual(4);
    expect(hero.cta).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Запустить — упадёт**

Run: `npm test -- src/content/hero.test.ts`
Expected: FAIL (`hero` не найден).

- [ ] **Step 3: Реализация**

```ts
// src/content/hero.ts
export const hero = {
  meta: 'CASE FILE №VB-19 · KHARKIV → WARSAW · AT LARGE',
  name: ['Vladyslav', 'Babii'] as const,
  role: 'Telegram Mini Apps · Websites · AI Products',
  placard: {
    agency: 'Department of Shipping',
    region: 'Ukraine',
    date: '06·20·2026',
    number: 'VB-19',
  },
  ticker: [
    'INTAKE TERMINAL — BLOCK VB',
    'STATUS: AT LARGE',
    'CHARGE: SHIPPING REAL PRODUCTS',
    'NOW SHIPPING FROM WARSAW',
    'VISITING HOURS: ALWAYS OPEN',
  ],
  cta: [
    { label: 'Open the case file', sub: '', href: '#work' },
    { label: 'Make contact', sub: 'visiting hours open', href: '#contact' },
  ],
  manifest: [
    { t: "I don't write demos. I build products that " },
    { t: 'escape the lab', o: true },
    { t: ' and take ' },
    { t: 'real orders', o: true },
    { t: '. Whatever I start — I ' },
    { t: 'break out', o: true },
    { t: ' with it finished.' },
  ],
} as const;
```

- [ ] **Step 4: Запустить — пройдёт**

Run: `npm test -- src/content/hero.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/hero.ts src/content/hero.test.ts
git commit -m "feat(hero): типизированный контент + тест"
```

---

## Task 5: Placard (TDD)

**Files:** Create `src/components/hero/Placard.tsx`, `Placard.test.tsx`

- [ ] **Step 1: Падающий тест**

```tsx
// src/components/hero/Placard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Placard } from './Placard';

describe('Placard', () => {
  it('рендерит данные booking-таблички', () => {
    render(<Placard />);
    expect(screen.getByText('Department of Shipping')).toBeInTheDocument();
    expect(screen.getByText('Ukraine')).toBeInTheDocument();
    expect(screen.getByText('VB-19')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — упадёт**

Run: `npm test -- src/components/hero/Placard.test.tsx`
Expected: FAIL

- [ ] **Step 3: Реализация**

```tsx
// src/components/hero/Placard.tsx
import { hero } from '@/content/hero';

export function Placard() {
  const p = hero.placard;
  return (
    <div className="placard" aria-hidden="true">
      <span className="agency">{p.agency}</span>
      <span className="region">{p.region}</span>
      <span className="row">
        <span className="date">{p.date}</span>
        <span className="num">{p.number}</span>
      </span>
    </div>
  );
}
```

Стили `.placard*` добавить в `globals.css` (позиционирование поверх доски — Task 6 правит проценты в браузере):

```css
.placard {
  position: absolute;
  left: 27.5%;
  top: 70.5%;
  width: 45%;
  height: 15.5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1px;
  text-transform: uppercase;
}
.placard .agency { font: 700 clamp(8px, 1.1vw, 11px) / 1.15 var(--font-label); letter-spacing: 0.12em; color: #f2efe7; text-shadow: 0 1px 0 rgba(0,0,0,0.6); }
.placard .region { font: 600 clamp(7px, 0.95vw, 9px) / 1.1 var(--font-label); letter-spacing: 0.22em; color: #cbc6ba; }
.placard .row { display: flex; align-items: baseline; gap: 14px; margin-top: 2px; }
.placard .date { font: 600 clamp(7px, 0.95vw, 9px) var(--font-mono); letter-spacing: 0.06em; color: #d9d4c7; }
.placard .num { font: 700 clamp(11px, 1.5vw, 14px) var(--font-label); letter-spacing: 0.1em; color: #fff; text-shadow: 0 1px 0 rgba(0,0,0,0.6); }
```

- [ ] **Step 4: Тест проходит**

Run: `npm test -- src/components/hero/Placard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/Placard.tsx src/components/hero/Placard.test.tsx src/app/globals.css
git commit -m "feat(hero): Placard (booking-табличка в DOM)"
```

---

## Task 6: Оптимизировать мугшот + BookingPhoto (TDD)

**Files:** Create `public/media/booking/mugshot.webp`, `src/components/hero/BookingPhoto.tsx`, `BookingPhoto.test.tsx`

- [ ] **Step 1: Сгенерировать веб-ассет из исходного мугшота**

Run:
```bash
mkdir -p public/media/booking
node -e "require('sharp')('assets/generated/hero-mugshot-v2.png').resize({height:1400}).webp({quality:82}).toFile('public/media/booking/mugshot.webp').then(()=>console.log('ok'))"
```
Expected: `ok`, файл ~150–350 KB.

- [ ] **Step 2: Падающий тест**

```tsx
// src/components/hero/BookingPhoto.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookingPhoto } from './BookingPhoto';

describe('BookingPhoto', () => {
  it('рендерит мугшот с alt, теги и табличку', () => {
    render(<BookingPhoto />);
    expect(screen.getByAltText(/booking photo/i)).toBeInTheDocument();
    expect(screen.getByText('EXHIBIT A')).toBeInTheDocument();
    expect(screen.getByText(/at large/i)).toBeInTheDocument();
    expect(screen.getByText('Department of Shipping')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Запустить — упадёт**

Run: `npm test -- src/components/hero/BookingPhoto.test.tsx`
Expected: FAIL

- [ ] **Step 4: Реализация**

```tsx
// src/components/hero/BookingPhoto.tsx
import Image from 'next/image';
import { Placard } from './Placard';

export function BookingPhoto() {
  return (
    <div className="relative w-[clamp(300px,38vw,480px)]">
      <span className="evtag">EXHIBIT A</span>
      <span className="stamp">At Large</span>
      <Image
        src="/media/booking/mugshot.webp"
        alt="Booking photo of Vladyslav Babii"
        width={480}
        height={640}
        priority
        className="block w-full rounded-[10px] border border-[var(--color-line)] shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
      />
      <Placard />
    </div>
  );
}
```

`.evtag` / `.stamp` в `globals.css`:

```css
.evtag { position: absolute; left: -12px; top: -12px; z-index: 3; background: var(--color-orange); color: #160d06; font: 700 10px var(--font-mono); letter-spacing: 0.06em; padding: 5px 9px; border-radius: 3px; transform: rotate(-3deg); }
.stamp { position: absolute; right: -18px; top: 6%; z-index: 3; transform: rotate(-13deg); border: 3px solid var(--color-orange); color: var(--color-orange); border-radius: 6px; padding: 4px 13px; font: 18px var(--font-stencil); letter-spacing: 0.04em; text-transform: uppercase; background: rgba(16,15,13,0.55); }
```

- [ ] **Step 5: Тест проходит**

Run: `npm test -- src/components/hero/BookingPhoto.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add public/media/booking/mugshot.webp src/components/hero/BookingPhoto.tsx src/components/hero/BookingPhoto.test.tsx src/app/globals.css
git commit -m "feat(hero): BookingPhoto + оптимизированный мугшот (webp)"
```

---

## Task 7: Ticker (TDD)

**Files:** Create `src/components/hero/Ticker.tsx`, `Ticker.test.tsx`

- [ ] **Step 1: Падающий тест**

```tsx
// src/components/hero/Ticker.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Ticker } from './Ticker';

describe('Ticker', () => {
  it('рендерит пункты (дублируются для бесшовности)', () => {
    render(<Ticker />);
    expect(screen.getAllByText(/STATUS: AT LARGE/i).length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Запустить — упадёт** · Run: `npm test -- src/components/hero/Ticker.test.tsx` · Expected: FAIL

- [ ] **Step 3: Реализация**

```tsx
// src/components/hero/Ticker.tsx
import { hero } from '@/content/hero';

export function Ticker() {
  const line = hero.ticker.join('  //  ');
  return (
    <div
      className="relative z-[2] overflow-hidden whitespace-nowrap border-b border-[var(--color-line)] py-[0.7rem] text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-steel)]"
      aria-hidden="true"
    >
      <span className="inline-block animate-[ticker-slide_22s_linear_infinite]">
        <span className="px-2">● {line} //&nbsp;&nbsp;</span>
        <span className="px-2">● {line} //&nbsp;&nbsp;</span>
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Тест проходит** · Run: `npm test -- src/components/hero/Ticker.test.tsx` · Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/Ticker.tsx src/components/hero/Ticker.test.tsx
git commit -m "feat(hero): Ticker (PA-бегущая строка)"
```

---

## Task 8: HeroScreen1 (TDD)

**Files:** Create `src/components/hero/HeroScreen1.tsx`, `HeroScreen1.test.tsx`

- [ ] **Step 1: Падающий тест**

```tsx
// src/components/hero/HeroScreen1.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroScreen1 } from './HeroScreen1';

describe('HeroScreen1', () => {
  it('рендерит имя, роль, мету и две CTA', () => {
    render(<HeroScreen1 />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vladyslav');
    expect(screen.getByText(/Telegram Mini Apps/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open the case file/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /make contact/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — упадёт** · Run: `npm test -- src/components/hero/HeroScreen1.test.tsx` · Expected: FAIL

- [ ] **Step 3: Реализация**

```tsx
// src/components/hero/HeroScreen1.tsx
import { hero } from '@/content/hero';
import { Ticker } from './Ticker';
import { BookingPhoto } from './BookingPhoto';

export function HeroScreen1() {
  return (
    <section className="grain bars relative flex min-h-[100svh] flex-col">
      <Ticker />
      <div className="relative z-[2] flex flex-1 items-center gap-12 px-14 py-8 max-md:flex-col max-md:gap-8 max-md:px-6">
        <div className="flex-[1.1]">
          <p className="text-[12px] uppercase tracking-[0.1em] text-[var(--color-orange)]">
            {hero.meta}
          </p>
          <h1
            data-hero-name
            className="my-[1.1rem] font-[family-name:var(--font-display)] text-[clamp(58px,7.6vw,104px)] uppercase leading-[1.04] tracking-[0.015em]"
          >
            {hero.name.map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </h1>
          <p className="text-[13px] font-semibold uppercase leading-[1.7] tracking-[0.06em]">
            {hero.role}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={hero.cta[0].href}
              data-magnetic
              className="rounded bg-[var(--color-orange)] px-[1.4rem] py-[0.9rem] text-[12px] font-bold uppercase tracking-[0.05em] text-[#160d06]"
            >
              {hero.cta[0].label} ↗
            </a>
            <a
              href={hero.cta[1].href}
              data-magnetic
              className="rounded border border-[var(--color-line)] px-[1.4rem] py-[0.9rem] text-[12px] font-medium uppercase tracking-[0.05em]"
            >
              {hero.cta[1].label} <span className="text-[var(--color-dim)]">· {hero.cta[1].sub}</span>
            </a>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <BookingPhoto />
        </div>
      </div>
      <p className="relative z-[2] pb-5 text-center text-[11px] uppercase tracking-[0.2em] text-[var(--color-dim)]">
        scroll to <b className="text-[var(--color-orange)]">escape</b> ↓
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Тест проходит** · Run: `npm test -- src/components/hero/HeroScreen1.test.tsx` · Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/HeroScreen1.tsx src/components/hero/HeroScreen1.test.tsx
git commit -m "feat(hero): экран 1 (имя, роль, CTA, мугшот)"
```

---

## Task 9: HeroScreen2 — манифест (TDD)

**Files:** Create `src/components/hero/HeroScreen2.tsx`, `HeroScreen2.test.tsx`

- [ ] **Step 1: Падающий тест**

```tsx
// src/components/hero/HeroScreen2.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroScreen2 } from './HeroScreen2';

describe('HeroScreen2', () => {
  it('рендерит манифест и лейбл', () => {
    render(<HeroScreen2 />);
    expect(screen.getByText(/on the record/i)).toBeInTheDocument();
    expect(screen.getByText(/I don't write demos/i)).toBeInTheDocument();
    expect(screen.getByText(/break out/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить — упадёт** · Run: `npm test -- src/components/hero/HeroScreen2.test.tsx` · Expected: FAIL

- [ ] **Step 3: Реализация**

```tsx
// src/components/hero/HeroScreen2.tsx
import { hero } from '@/content/hero';

export function HeroScreen2() {
  return (
    <section className="grain relative flex min-h-[82svh] items-center border-t border-[var(--color-line)]">
      <div className="relative z-[2] max-w-[1000px] px-14 max-md:px-6">
        <p className="mb-6 border-l-[3px] border-[var(--color-orange)] pl-3 text-[12px] uppercase tracking-[0.2em] text-[var(--color-orange)]">
          On the record / statement 01
        </p>
        <p
          data-manifest
          className="m-0 font-[family-name:var(--font-display)] text-[clamp(30px,4.4vw,58px)] uppercase leading-[1.18]"
        >
          {hero.manifest.map((seg, i) => (
            <span key={i} className={seg.o ? 'text-[var(--color-orange)]' : undefined}>
              {seg.t}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Тест проходит** · Run: `npm test -- src/components/hero/HeroScreen2.test.tsx` · Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/HeroScreen2.tsx src/components/hero/HeroScreen2.test.tsx
git commit -m "feat(hero): экран 2 (манифест)"
```

---

## Task 10: ConcreteBg + Hero + сборка страницы (browser verify)

**Files:** Create `src/components/bg/ConcreteBg.tsx`, `src/components/hero/Hero.tsx`; Modify `src/app/page.tsx`

- [ ] **Step 1: ConcreteBg (статичный слой)**

```tsx
// src/components/bg/ConcreteBg.tsx
export function ConcreteBg() {
  return (
    <div
      aria-hidden="true"
      className="grain bars pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,#2a2620_0%,var(--color-bg)_60%)]"
    />
  );
}
```

- [ ] **Step 2: Hero (оркестр)**

```tsx
// src/components/hero/Hero.tsx
import { HeroScreen1 } from './HeroScreen1';
import { HeroScreen2 } from './HeroScreen2';

export function Hero() {
  return (
    <main>
      <HeroScreen1 />
      <HeroScreen2 />
    </main>
  );
}
```

- [ ] **Step 3: page.tsx**

```tsx
// src/app/page.tsx
import { ConcreteBg } from '@/components/bg/ConcreteBg';
import { Hero } from '@/components/hero/Hero';

export default function Home() {
  return (
    <>
      <ConcreteBg />
      <Hero />
    </>
  );
}
```

- [ ] **Step 4: Браузер-верификация**

Run: `preview_start` (или `npm run dev`) → открыть, `preview_screenshot` на 1280, `preview_resize` 768 и 375.
Expected: статичный двухэкранный hero — имя слева, мугшот с табличкой справа, тикер бежит, манифест ниже; нет горизонтального скролла; на мобилке колонки в стек.

- [ ] **Step 5: Полная проверка и commit**

Run: `npm run typecheck && npm test && npm run build`
Expected: всё зелёное.

```bash
git add src/components/bg/ConcreteBg.tsx src/components/hero/Hero.tsx src/app/page.tsx
git commit -m "feat(hero): статичная сборка двухэкранного hero + ConcreteBg"
```

---

## Task 11: Lenis (плавный скролл)

**Files:** Create `src/components/motion/SmoothScroll.tsx`; Modify `src/app/layout.tsx`

- [ ] **Step 1: Провайдер Lenis**

```tsx
// src/components/motion/SmoothScroll.tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 2: Обернуть в layout** — в `body` обернуть `{children}` в `<SmoothScroll>`:

```tsx
import { SmoothScroll } from '@/components/motion/SmoothScroll';
// ...
<body>
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

- [ ] **Step 3: Браузер-верификация** — скролл стал плавно-инерционным, без рывков. (`preview` + прокрутка.)

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/SmoothScroll.tsx src/app/layout.tsx
git commit -m "feat(motion): Lenis smooth scroll"
```

---

## Task 12: GSAP-регистрация + анимация имени (SplitText + глитч)

**Files:** Create `src/lib/gsap.ts`; Modify `src/components/hero/HeroScreen1.tsx` (добавить client-обёртку анимации)

- [ ] **Step 1: Регистрация плагинов**

```ts
// src/lib/gsap.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
}
export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin };
```

- [ ] **Step 2: Анимация имени** — создать `src/components/hero/HeroNameMotion.tsx` (client), оборачивающий заголовок:

```tsx
// src/components/hero/HeroNameMotion.tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '@/lib/gsap';

export function HeroNameMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const h1 = ref.current!.querySelector('[data-hero-name]') as HTMLElement;
      const split = new SplitText(h1, { type: 'chars' });
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
        ease: 'power3.out',
      });
      // глитч на hover
      const onEnter = () => gsap.to(h1, { skewX: 6, duration: 0.08, yoyo: true, repeat: 3, ease: 'rough({ strength: 2, points: 20 })' });
      h1.addEventListener('mouseenter', onEnter);
      return () => h1.removeEventListener('mouseenter', onEnter);
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
```

Обернуть левый блок `HeroScreen1` в `<HeroNameMotion>`. (Сам `HeroScreen1` остаётся серверным; импортирует client-компонент.)

- [ ] **Step 3: Браузер-верификация** — буквы имени «въезжают» со stagger; при наведении — короткий глитч. Докрутить силу/темп в браузере.

- [ ] **Step 4: Commit**

```bash
git add src/lib/gsap.ts src/components/hero/HeroNameMotion.tsx src/components/hero/HeroScreen1.tsx
git commit -m "feat(motion): SplitText-вход имени + глитч на hover"
```

---

## Task 13: ScrambleText — декод манифеста по скроллу

**Files:** Create `src/components/hero/ManifestMotion.tsx`; Modify `HeroScreen2.tsx`

- [ ] **Step 1: Декод по входу в вьюпорт**

```tsx
// src/components/hero/ManifestMotion.tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function ManifestMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!.querySelector('[data-manifest]') as HTMLElement;
      const full = el.textContent ?? '';
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        once: true,
        onEnter: () =>
          gsap.to(el, {
            duration: 1.6,
            scrambleText: { text: full, chars: 'upperCase', speed: 0.5 },
          }),
      });
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
```

Обернуть содержимое `HeroScreen2` в `<ManifestMotion>`. (Примечание: scrambleText сбросит inline-цвета спанов — на верификации решаем: либо декодим по сегментам, либо красим ключевые слова через повторную разметку после декода. Финальный приём выбираем в браузере.)

- [ ] **Step 2: Браузер-верификация** — при доскролле манифест «расшифровывается»; оранжевые ключи на месте.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/ManifestMotion.tsx src/components/hero/HeroScreen2.tsx
git commit -m "feat(motion): ScrambleText-декод манифеста по скроллу"
```

---

## Task 14: Кастомный курсор-прожектор + магнитные CTA

**Files:** Create `src/components/cursor/Cursor.tsx`; Modify `src/app/page.tsx`

- [ ] **Step 1: Курсор**

```tsx
// src/components/cursor/Cursor.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // нет на тач
    const el = dot.current!;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3' });
    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', move);
    // магнитные элементы
    const mags = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const cleaners = mags.map((m) => {
      const onMove = (e: MouseEvent) => {
        const r = m.getBoundingClientRect();
        gsap.to(m, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.4 });
      };
      const onLeave = () => gsap.to(m, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,0.4)' });
      m.addEventListener('mousemove', onMove);
      m.addEventListener('mouseleave', onLeave);
      return () => {
        m.removeEventListener('mousemove', onMove);
        m.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => {
      window.removeEventListener('mousemove', move);
      cleaners.forEach((c) => c());
    };
  }, []);
  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] -ml-5 -mt-5 h-10 w-10 rounded-full mix-blend-screen"
      style={{ background: 'radial-gradient(circle, rgba(255,90,30,0.55), transparent 70%)' }}
    />
  );
}
```

- [ ] **Step 2: Подключить в page.tsx** — добавить `<Cursor />`. Скрыть системный курсор по желанию (`body { cursor: none }` только при `pointer: fine`).

- [ ] **Step 3: Браузер-верификация** — мягкий прожектор следует за мышью; кнопки магнитятся. На тач — курсора нет, всё кликается.

- [ ] **Step 4: Commit**

```bash
git add src/components/cursor/Cursor.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat(cursor): курсор-прожектор + магнитные CTA"
```

---

## Task 15: OGL-шейдер бетона (фон, с фолбэком)

**Files:** Create `src/components/bg/ShaderBg.tsx`; Modify `src/components/bg/ConcreteBg.tsx`

- [ ] **Step 1: Шейдер (FBM-бетон + луч + сканлайны, реакция на курсор)**

```tsx
// src/components/bg/ShaderBg.tsx
'use client';
import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';

const frag = `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.;a*=.5;}return v;}
void main(){
  vec2 uv=vUv; vec2 p=uv*vec2(uRes.x/uRes.y,1.);
  float c=fbm(p*3.+uTime*0.02);
  vec3 base=mix(vec3(0.063,0.059,0.051),vec3(0.16,0.15,0.13),c);
  float d=distance(uv,uMouse);
  float light=smoothstep(0.5,0.0,d)*0.25;            // прожектор у курсора
  base+=vec3(1.0,0.35,0.12)*light;
  float scan=sin(uv.y*uRes.y*1.2+uTime*2.0)*0.015;   // сканлайны
  base+=scan;
  gl_FragColor=vec4(base,1.0);
}`;

const vert = `attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,0,1);}`;

export function ShaderBg() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current!;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: false, dpr: Math.min(2, window.devicePixelRatio) });
    } catch {
      return; // нет WebGL — оставляем статичный фон ConcreteBg
    }
    const gl = renderer.gl;
    host.appendChild(gl.canvas);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    const onMouse = (e: MouseEvent) => {
      program.uniforms.uMouse.value = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    resize();
    let raf = 0;
    const loop = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      gl.canvas.remove();
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10" />;
}
```

- [ ] **Step 2: Подключить в ConcreteBg с динамическим импортом (только клиент, не блокирует)**

```tsx
// src/components/bg/ConcreteBg.tsx
import dynamic from 'next/dynamic';
const ShaderBg = dynamic(() => import('./ShaderBg').then((m) => m.ShaderBg), { ssr: false });

export function ConcreteBg() {
  return (
    <div
      aria-hidden="true"
      className="grain bars pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,#2a2620_0%,var(--color-bg)_60%)]"
    >
      <ShaderBg />
    </div>
  );
}
```

- [ ] **Step 3: Браузер-верификация + перф** — бетон «дышит», у курсора тёплый прожектор, лёгкие сканлайны; FPS ≈60 (DevTools/preview). На мобилке при слабом GPU — оставить только статичный фон (проверить, что фолбэк не роняет страницу).

- [ ] **Step 4: Commit**

```bash
git add src/components/bg/ShaderBg.tsx src/components/bg/ConcreteBg.tsx
git commit -m "feat(bg): OGL-шейдер бетона (Tier A) с фолбэком"
```

---

## Task 16: Прелоадер «lockdown»

**Files:** Create `src/components/chrome/Preloader.tsx`; Modify `src/app/page.tsx`

- [ ] **Step 1: Компонент прелоадера** (счётчик 0→100, лог «дела», на 100% «дверь» уезжает вверх, размонтируется)

```tsx
// src/components/chrome/Preloader.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

const LOG = [
  '> scanning biometrics…',
  '> matching record… MATCH',
  '> charge: shipping real products',
  '> clearance… GRANTED · welcome in',
];

export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100,
      duration: 2.6,
      ease: 'power1.inOut',
      onUpdate: () => setPct(Math.round(obj.v)),
      onComplete: () => {
        gsap.to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          delay: 0.3,
          onComplete: () => setDone(true),
        });
      },
    });
  }, []);

  if (done) return null;
  const shown = Math.floor((pct / 100) * LOG.length);
  return (
    <div
      ref={root}
      className="grain fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]"
      role="status"
      aria-label="Loading"
    >
      <div className="relative z-[2] w-[min(620px,86%)]">
        <p className="text-[12px] uppercase tracking-[0.32em] text-[var(--color-orange)]">
          Processing inmate
        </p>
        <div className="font-[family-name:var(--font-display)] text-[clamp(96px,16vw,168px)] leading-[0.86]">
          {String(pct).padStart(3, '0')}
          <span className="align-top text-[0.28em] text-[var(--color-steel)]">%</span>
        </div>
        <div className="my-6 h-3 overflow-hidden rounded-sm border border-[var(--color-line)]">
          <div
            className="h-full bg-[var(--color-orange)] transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[12px] leading-[1.85] text-[var(--color-steel)]">
          {LOG.map((l, i) => (
            <div key={i} style={{ opacity: i < shown ? 1 : 0.15 }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Подключить в page.tsx** (поверх всего): `<Preloader />` первым.

- [ ] **Step 3: Браузер-верификация** — при загрузке идёт intake 0→100 с логом, затем «дверь» уезжает и открывает hero. Перезагрузить пару раз.

- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/Preloader.tsx src/app/page.tsx
git commit -m "feat(chrome): прелоадер lockdown (intake 0→100 → дверь открывает hero)"
```

---

## Task 17: Тумблер звука (опц., off по умолчанию)

**Files:** Create `src/components/chrome/AudioToggle.tsx`; Add `public/audio/ambient.mp3` (CC0 трек — добавляется отдельно); Modify `src/app/page.tsx`

> Трек подбираем отдельно (royalty-free/CC0 тюремный эмбиент). Компонент работает с любым файлом по пути `/audio/ambient.mp3`.

- [ ] **Step 1: Компонент**

```tsx
// src/components/chrome/AudioToggle.tsx
'use client';
import { useRef, useState } from 'react';

export function AudioToggle() {
  const a = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const toggle = () => {
    const el = a.current!;
    if (on) {
      el.pause();
    } else {
      el.volume = 0.4;
      void el.play();
    }
    setOn(!on);
  };
  return (
    <>
      <audio ref={a} src="/audio/ambient.mp3" loop preload="none" />
      <button
        onClick={toggle}
        aria-label={on ? 'Mute ambience' : 'Play ambience'}
        aria-pressed={on}
        className="fixed bottom-5 right-5 z-[70] rounded-full border border-[var(--color-line)] bg-[rgba(16,15,13,0.6)] px-3 py-3 text-[11px] uppercase tracking-[0.1em] text-[var(--color-steel)] backdrop-blur"
      >
        {on ? '♪ on' : '♪ off'}
      </button>
    </>
  );
}
```

- [ ] **Step 2: Подключить в page.tsx**: `<AudioToggle />`.

- [ ] **Step 3: Браузер-верификация** — по умолчанию тихо; клик включает луп; повторный клик — пауза; `aria-pressed` меняется.

- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/AudioToggle.tsx src/app/page.tsx
git commit -m "feat(chrome): тумблер фонового звука (off по умолчанию)"
```

---

## Task 18: Финальный проход — адаптив, a11y, build/test

**Files:** точечные правки по результатам проверки

- [ ] **Step 1: Адаптив 375 / 768 / 1280** — `preview_resize` на три ширины: нет горизонтального скролла, мугшот и имя читаются, тач-цели ≥44px, тикер не ломает строку. Поправить классы где нужно.

- [ ] **Step 2: a11y** — `:focus-visible` виден на CTA/тумблере; контраст основного текста ≥4.5:1; `alt` у мугшота; `aria-label` у иконок-кнопок; навигация Tab проходит по ссылкам/кнопке. (reduced-motion НЕ трогаем — по решению.)

- [ ] **Step 3: Полная проверка**

Run: `npm run typecheck && npm test && npm run build`
Expected: типы чистые, тесты зелёные, прод-сборка успешна.

- [ ] **Step 4: Браузер-доказательство** — `preview_screenshot` на 1280/768/375; убедиться, что прелоадер→hero→манифест работают, шейдер/курсор/тикер живые.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish(hero): адаптив 375/768/1280 + a11y-проход"
```

---

## Self-Review (покрытие спеки)

- §2 токены/шрифты → Task 2,3 ✓ · движение reduced-motion off → Task 2 (пустой media), везде ✓
- §3 стек: GSAP+плагины Task 12,13 ✓ · Lenis Task 11 ✓ · OGL Task 15 ✓ · курсор Task 14 ✓ · звук Task 17 ✓ · Matter.js/View Transitions/шейдеры-на-картинках → §6 спеки (вне среза) ✓
- §4.0 прелоадер → Task 16 ✓ · §4.1 экран 1 (тикер/имя/роль/CTA/мугшот/табличка) → Task 5–8,10,12 ✓ · §4.2 экран 2 манифест-декод → Task 9,13 ✓ · §4.3 адаптив → Task 18 ✓ · §4.4 a11y → Task 18 ✓
- §5 копи → Task 4 (контент-модуль) ✓
- §7 открытые: Soul-лицо (мугшот v2 как плейсхолдер, замена файла позже), конкретный звук-трек (Task 17 — файл отдельно), тонкая подгонка таблички (Task 5/6 — проценты в браузере) — все отмечены как шаги верификации, не плейсхолдеры.

**Открытый момент для исполнения:** в Task 13 точный приём сохранения оранжевых ключей при ScrambleText выбираем в браузере (декод по сегментам vs повторная покраска) — это решение верификации, заложено явно.
