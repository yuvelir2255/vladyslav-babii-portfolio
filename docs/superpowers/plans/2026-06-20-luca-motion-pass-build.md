# Luca-моушн-пасс — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять portfolio до моушн-языка и айдентики aboutluca — FBM-дым вместо дюн (курсор раздвигает дым), вся типографика на IBM Plex Mono, чистый монохром — не трогая контент, структуру секций, i18n, форму→Telegram и SEO.

**Architecture:** Три независимых рычага, каждый — отдельный коммит. (1) Типографика: обе CSS-переменные шрифта (`--font-sans`/`--font-mono`) указывают на один `next/font` IBM Plex Mono → классы `font-sans`/`font-mono` по сайту резолвятся в один моно-шрифт, точечные правки только там, где вес 700 (его нет в наборе 300–600). (2) Палитра: удаляем 5 `--color-accent-*` токенов и заменяем все их использования на монохром (Tailwind v4 генерит `*-accent-*`-классы из токенов — после удаления их надо заменить ВЕЗДЕ, иначе стиль молча пропадёт). (3) Фон: `Field.tsx` переписывается с нуля — полноэкранный квад с фрагментным дымовым шейдером (FBM + domain-warp), курсор раздвигает/прореживает дым через униформы `uMouse/uMouseRadius/uMouseStrength/uMouseHole/uMouseWarp`.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TS strict · Tailwind v4 (`@theme` в `globals.css`) · GSAP/ScrollTrigger · Lenis · OGL (WebGL) · next-intl (EN/UK). Новые зависимости НЕ вводим.

**Природа проверки:** пасс чисто визуальный (шейдер/CSS/шрифт) — новых юнит-тестов нет. «Тест» каждой задачи = чистый `npm run build` + проверка в браузере/Playwright (как требует `«Готово» = доказано`). Регрессия: существующие **16/16** юнит-тестов (`motion`/`projects`/`telegram`/`i18n-parity`) должны остаться зелёными — этот пасс их логику не трогает.

**Windows-напоминание:** cwd сбрасывается после каждой команды → каждую команду начинать с `Set-Location 'C:\Users\ювелир\Desktop\portfolio';`. При смене `.env` сервер перезапускать (здесь `.env` не трогаем).

---

## File Structure

| Файл | Что делает / что меняем |
|---|---|
| `src/app/[locale]/layout.tsx` | Шрифты: `Archivo`+`Space_Mono` → один `IBM_Plex_Mono` (`--font-plex`, subsets latin+cyrillic, веса 300–600). `<html>` className. |
| `src/app/globals.css` | `@theme`: `--font-sans`/`--font-mono` → `var(--font-plex)`; удалить 5 `--color-accent-*`; нюанс `--color-bg` к нейтральному near-black; обновить `.legible`-гало под новый bg. |
| `src/components/ui/GlassCard.tsx` | Полная замена: убрать prop `accent`, всё на монохром (белые/серые glow/глиф/индекс/линия), `font-bold`→`font-semibold`. |
| `src/components/sections/WhatIDo.tsx` | `CARDS`: убрать поле `accent`; не передавать `accent` в `GlassCard`. |
| `src/components/sections/WorkDreamGold.tsx` | 3 правки: `text-accent-design`→`text-faint` (×2), `bg-accent-design`→`bg-dim` (маркер фишек). |
| `src/components/ui/CasePhones.tsx` | Золотой radial-gradient → нейтральный белый, низкая прозрачность. |
| `src/components/sections/Hero.tsx` | «available»-индикатор `bg-accent-auto`→`bg-fg` (ping + точка). |
| `src/components/sections/Contact.tsx` | Успех формы `text-accent-auto`→`text-fg`. |
| `src/components/sections/Manifesto.tsx` | BUILD/CRAFT дисплей `font-bold`→`font-semibold` (вес 700 не грузим). |
| `src/components/field/Field.tsx` | **Полный rewrite**: FBM-дымовой фрагмент-шейдер на полноэкранном квадрате; курсор раздвигает дым; uScroll/uVelocity; perf-капы; пауза при `visibilitychange`. |
| `src/components/providers/SmoothScroll.tsx` | Lenis: `duration: 1.1` → `lerp: 0.18` (почерк aboutluca). |
| `CLAUDE.md` | Финал: обновить статус «Luca-моушн-пасс выполнен». |

**Вне scope (осознанно, не трогаем):** контент/копирайт, порядок секций, next-intl EN/UK и тесты паритета, форма→Telegram (`lib/telegram.ts`, `api/contact`), SEO/sitemap/robots, контент-модель проектов, **OG-картинка `src/app/[locale]/opengraph-image.tsx`** (в ней сине-фиолетовое свечение — конфликтует с монохромом, но спека §F явно выводит SEO/OG из scope; правку OG — отдельным «ок» владельца позже). `HeroName.tsx` код НЕ меняем (он семплит вычисленный шрифт `<h1>` → новый Plex подхватится сам; только проверяем визуально, что моно-глифы не ломают перенос/overflow).

---

## Task 1: Типографика — IBM Plex Mono везде

**Files:**
- Modify: `src/app/[locale]/layout.tsx:9` (импорт), `:19-30` (объявления шрифтов), `:90` (className `<html>`)
- Modify: `src/app/globals.css:13-14` (`--font-sans`/`--font-mono`)
- Modify: `src/components/sections/Manifesto.tsx:22,37` (`font-bold`→`font-semibold`)

**Почему именно так:** обе переменные шрифта указываем на один Plex → все существующие классы `font-sans` и `font-mono` по сайту автоматически становятся моно, точечно трогать каждую секцию не нужно. Набор весов 300–600 (как в спеке §B, у Luca дисплей не тяжёлый); единственные `font-bold` (700) — две строки Manifesto (BUILD/CRAFT) — снижаем до 600, иначе браузер синтезирует фейк-болд. IBM Plex Mono на Google Fonts покрывает Cyrillic → UK-кириллица читается (проверим в браузере на шаге 4).

- [ ] **Step 1: Заменить импорт и объявления шрифтов в layout.tsx**

Заменить строку 9:
```tsx
import { Archivo, Space_Mono } from 'next/font/google';
```
на:
```tsx
import { IBM_Plex_Mono } from 'next/font/google';
```

Заменить блок строк 19–30:
```tsx
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});
```
на:
```tsx
const plex = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});
```

- [ ] **Step 2: Обновить className `<html>` в layout.tsx**

Заменить строку 90:
```tsx
    <html lang={locale} className={`${archivo.variable} ${spaceMono.variable}`}>
```
на:
```tsx
    <html lang={locale} className={plex.variable}>
```

- [ ] **Step 3: Перенаправить CSS-переменные шрифта в globals.css**

Заменить строки 13–14:
```css
  --font-sans: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-space-mono), ui-monospace, monospace;
```
на:
```css
  --font-sans: var(--font-plex), ui-monospace, monospace;
  --font-mono: var(--font-plex), ui-monospace, monospace;
```

- [ ] **Step 4: Снять вес 700 с мега-дисплея Manifesto**

В `src/components/sections/Manifesto.tsx` в строках 22 и 37 (две идентичные) заменить `font-bold` на `font-semibold`. Итоговый className (обе строки):
```tsx
          className="font-sans text-[clamp(4rem,19vw,15rem)] leading-[0.95] font-semibold tracking-[-0.04em]"
```

- [ ] **Step 5: Сборка и типы**

Run: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'; npm run build; npm run typecheck`
Expected: build без ошибок; `tsc` без ошибок. (Если ESLint ругнётся на неиспользуемые `archivo`/`spaceMono` — значит остался хвост, удалить.)

- [ ] **Step 6: Проверка в браузере EN+UK (один шрифт + кириллица + переносы)**

Run: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'; npm run dev` (порт 3000), затем preview/Playwright на `/en` и `/uk`, ширины 375 / 768 / 1280.
Expected:
- Весь текст — IBM Plex Mono (моно-ритм, одинаковые ширины глифов в заголовках и лейблах).
- `/uk`: кириллица отрисована Plex'ом (не системным фолбэком), без «тофу».
- Hero-имя «Vladyslav Babii», Manifesto «BUILD»/«CRAFT», лиды — без горизонтального overflow и кривых переносов на 375 (моно-глифы шире — это главный риск шага). Если BUILD/CRAFT упираются в края на 375 — уменьшить верхнюю границу clamp в Manifesto (напр. `15rem`→`13rem`) и переснять.
- HeroName-частицы по-прежнему собирают имя (Plex подхватился из computed-стиля `<h1>`).

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css src/components/sections/Manifesto.tsx
git commit -m "refactor(type): ре-тайпсет всего сайта на IBM Plex Mono (sans+mono, кириллица для UK)"
```

---

## Task 2: Палитра — чистый монохром

**Files:**
- Modify: `src/app/globals.css:4` (`--color-bg`), `:8-12` (удалить 5 accent-токенов), `:43` (`.legible` под новый bg)
- Modify (full replace): `src/components/ui/GlassCard.tsx`
- Modify: `src/components/sections/WhatIDo.tsx:8-14` (`CARDS`), `:100-107` (проп `accent`)
- Modify: `src/components/sections/WorkDreamGold.tsx:25,52,90`
- Modify: `src/components/ui/CasePhones.tsx:70-73`
- Modify: `src/components/sections/Hero.tsx:21-22`
- Modify: `src/components/sections/Contact.tsx:164`

**Почему именно так:** Tailwind v4 генерит утилиты `text-accent-*`/`bg-accent-*` из `@theme`-токенов. Удалить токены → эти классы перестают существовать и стиль **молча пропадёт** (без ошибки сборки). Поэтому каждое использование заменяем на монохром в этом же коммите. `--color-bg` сдвигаем `#0a0b0d`→`#0d0d0d`: убираем лёгкий синий подтон (b>r) → нейтральный near-black, ближе к Luca и честнее к «чистому монохрому»; `.legible`-гало завязано на цвет фона — обновляем синхронно. «available»-точка (зелёная) и успех формы (зелёный) — семантика, но спека §D требует чистый монохром (как у Luca) → белый.

- [ ] **Step 1: globals.css — bg, удалить акценты, обновить .legible**

Заменить строку 4:
```css
  --color-bg: #0a0b0d;
```
на:
```css
  --color-bg: #0d0d0d;
```

Удалить строки 8–12 целиком:
```css
  --color-accent-web: #4a6cff;
  --color-accent-tg: #2aabee;
  --color-accent-ai: #8b5cf6;
  --color-accent-auto: #10b981;
  --color-accent-design: #f59e0b;
```

Заменить строку 43 (`.legible` text-shadow, цвет = старый bg) :
```css
  text-shadow: 0 1px 14px rgba(10, 11, 13, 0.7);
```
на:
```css
  text-shadow: 0 1px 14px rgba(13, 13, 13, 0.7);
```

- [ ] **Step 2: GlassCard.tsx — полная замена на монохром**

Заменить весь файл `src/components/ui/GlassCard.tsx` на:
```tsx
/**
 * Glassy service card (monochrome): frosted glass over the smoke field, a soft
 * white glow and a large faint white glyph that come alive on hover, plus index,
 * title, subtitle and a white underline that grows on hover. Presentational —
 * the scroll sequence is driven by the parent (WhatIDo).
 */
interface GlassCardProps {
  index: string;
  title: string;
  subtitle: string;
  /** Large background glyph (usually the title's first letter). */
  glyph: string;
}

export default function GlassCard({
  index,
  title,
  subtitle,
  glyph,
}: GlassCardProps) {
  return (
    <article className="group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md transition-transform duration-500 will-change-transform hover:-translate-y-1 md:p-10">
      {/* hover glow (monochrome) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow:
            'inset 0 0 90px -50px rgba(255,255,255,0.55), 0 0 70px -30px rgba(255,255,255,0.4)',
        }}
      />
      {/* big faint white glyph */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -bottom-10 font-sans text-[9rem] leading-none font-semibold text-white opacity-[0.06] transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-[0.14]"
      >
        {glyph}
      </span>
      <span className="text-faint relative font-mono text-[11px] tracking-[0.3em]">
        {index}
      </span>
      <h3 className="relative mt-6 font-sans text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h3>
      <p className="text-dim relative mt-3 max-w-sm font-sans text-base leading-relaxed">
        {subtitle}
      </p>
      <span
        aria-hidden
        className="relative mt-7 block h-px w-10 bg-white/70 transition-all duration-500 group-hover:w-24"
      />
    </article>
  );
}
```

- [ ] **Step 3: WhatIDo.tsx — убрать accent из CARDS и из пропсов**

Заменить блок строк 8–14:
```tsx
const CARDS = [
  { key: 'web', accent: 'var(--color-accent-web)' },
  { key: 'tg', accent: 'var(--color-accent-tg)' },
  { key: 'ai', accent: 'var(--color-accent-ai)' },
  { key: 'auto', accent: 'var(--color-accent-auto)' },
  { key: 'design', accent: 'var(--color-accent-design)' },
] as const;
```
на:
```tsx
const CARDS = [
  { key: 'web' },
  { key: 'tg' },
  { key: 'ai' },
  { key: 'auto' },
  { key: 'design' },
] as const;
```

Заменить блок строк 100–107 (рендер `GlassCard`):
```tsx
            <GlassCard
              key={c.key}
              index={String(i + 1).padStart(2, '0')}
              title={title}
              subtitle={t(`cards.${c.key}.subtitle`)}
              accent={c.accent}
              glyph={title.charAt(0)}
            />
```
на:
```tsx
            <GlassCard
              key={c.key}
              index={String(i + 1).padStart(2, '0')}
              title={title}
              subtitle={t(`cards.${c.key}.subtitle`)}
              glyph={title.charAt(0)}
            />
```

- [ ] **Step 4: WorkDreamGold.tsx — де-акцент эйбрау/маркеров/coming-soon**

Строка 25 — заменить `text-accent-design` на `text-faint`:
```tsx
        className="text-faint font-mono text-[11px] tracking-[0.3em] uppercase"
```
Строка 52 — заменить `bg-accent-design` на `bg-dim`:
```tsx
                  className="bg-dim h-1.5 w-1.5 shrink-0 rounded-full"
```
Строка 90 — заменить `text-accent-design` на `text-faint`:
```tsx
          <span className="text-faint font-mono text-[11px] tracking-[0.3em] uppercase">
```

- [ ] **Step 5: CasePhones.tsx — золотое свечение → нейтральное белое**

Заменить блок строк 70–73 (`style={{ background: ... }}`):
```tsx
        style={{
          background:
            'radial-gradient(60% 55% at 62% 48%, rgba(245,158,11,0.18), rgba(245,158,11,0.06) 45%, transparent 72%)',
        }}
```
на:
```tsx
        style={{
          background:
            'radial-gradient(60% 55% at 62% 48%, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 45%, transparent 72%)',
        }}
```

- [ ] **Step 6: Hero.tsx — «available» индикатор в белый**

Заменить строки 21–22:
```tsx
            <span className="bg-accent-auto absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" />
            <span className="bg-accent-auto relative inline-flex h-1.5 w-1.5 rounded-full" />
```
на:
```tsx
            <span className="bg-fg absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" />
            <span className="bg-fg relative inline-flex h-1.5 w-1.5 rounded-full" />
```

- [ ] **Step 7: Contact.tsx — успех формы в белый**

Заменить строку 164 (`text-accent-auto`):
```tsx
              <p role="status" className="text-accent-auto text-sm">
```
на:
```tsx
              <p role="status" className="text-fg text-sm">
```

- [ ] **Step 8: Греп — нигде не осталось акцентов/золота/синего**

Поиском по `src` (Grep-тул или `Select-String`) проверить отсутствие совпадений:
- `accent-` → 0 совпадений (включая `var(--color-accent`, `text-accent`, `bg-accent`).
- `245,158,11` и `f59e0b` (золото) → 0.
- `4a6cff|2aabee|8b5cf6|10b981` (синий/голубой/фиолет/изумруд hex) → 0 в `src` (OG-картинка вне scope — её не считаем; если совпадёт только `opengraph-image.tsx` — это ожидаемо и допустимо).

Expected: чисто (кроме осознанно-исключённой OG-картинки).

- [ ] **Step 9: Сборка + регрессия тестов**

Run: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'; npm run build; npm run typecheck; npm test`
Expected: build/types чисто; `npm test` — **16/16 PASS** (логику не трогали).

- [ ] **Step 10: Проверка в браузере (монохром)**

Dev на 1280/768/375, `/en` и `/uk`: на сайте только чёрный/белый/серый; карточки What I do (статика + hover-свечение), кейс Dream Gold (эйбрау/маркеры/телефоны), Hero-точка, успех формы — без цветных пятен. Контраст текста читаем.
Expected: визуально чистый монохром, без «потерянных» (бесцветных) элементов.

- [ ] **Step 11: Commit**

```bash
git add src/app/globals.css src/components/ui/GlassCard.tsx src/components/sections/WhatIDo.tsx src/components/sections/WorkDreamGold.tsx src/components/ui/CasePhones.tsx src/components/sections/Hero.tsx src/components/sections/Contact.tsx
git commit -m "style(color): чистый монохром — убрать 5 accent-токенов, де-акцент карточек/кейса/индикаторов"
```

---

## Task 3: Фон — FBM-дым на OGL (rewrite Field.tsx)

**Files:**
- Modify (full replace): `src/components/field/Field.tsx`

**Почему именно так:** заменяем particle-сцену (дюны+звёзды) на полноэкранный квад с фрагментным дымовым шейдером — дешевле particle-системы Luca, тот же эффект «клубящегося дыма, который курсор расступает». FBM (домен-варп: `q`→`r`→`f`) даёт органичную структуру; курсор раздвигает дым (радиальный сдвиг домена) и прореживает плотность («дырка») через одобренные униформы `uMouse/uMouseRadius/uMouseStrength/uMouseHole/uMouseWarp`. Перф: фрагментный шейдер тяжёлый → `dpr` низкий (десктоп 1.0 / мобайл 0.75, дым мягкий — низкое разрешение незаметно), октавы 4/2, пауза при скрытой вкладке. Курсор и Field оба слушают общий `window.pointermove` (одни координаты) → комета и дым синхронны без связки/нового стора.

> **Перф-ручки для шага проверки:** если десктоп < 60fps или мобайл 375 заметно дёргается — крутить вниз `uOctaves` (4→3) и/или `dpr` (1.0→0.8). Это первый кандидат на тюнинг.

> **IntersectionObserver:** в спеке упомянут, но канвас `fixed inset-0` всегда пересекает вьюпорт → обсервер бесполезен (YAGNI). Реальную экономию даёт пауза по `visibilitychange` (скрытая вкладка) — её и оставляем. Это осознанное отступление от буквы спеки.

- [ ] **Step 1: Полная замена Field.tsx**

Заменить весь файл `src/components/field/Field.tsx` на:
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Geometry, Program, Mesh } from 'ogl';

/**
 * FBM smoke field (the site's signature backdrop, aboutluca-style): a fullscreen
 * quad runs a domain-warped fractal-noise fragment shader, drifting like slow
 * smoke over near-black. The cursor parts the smoke — it shoves the noise domain
 * radially away and thins density into a soft "hole" with a faint rim — via the
 * uMouse* uniforms. uScroll drifts/fades the smoke down the page; scroll velocity
 * adds a touch of turbulence. Fixed, behind all content.
 *
 * Pauses when the tab is hidden. Monochrome (no color tints). Runs regardless of
 * prefers-reduced-motion (project decision: full motion for everyone, like
 * aboutluca). Fallback without WebGL/JS: the static near-black body background.
 */

const vertex = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform float uScroll;       // 0..1 page scroll progress
  uniform float uVelocity;     // smoothed scroll speed (turbulence)
  uniform float uOctaves;      // fbm octaves (perf knob)
  uniform vec2  uMouse;        // [0,1], y up (smoothed JS-side)
  uniform float uMouseRadius;  // radius of influence
  uniform float uMouseStrength;// domain push strength (parting)
  uniform float uMouseHole;    // local density thinning (0..1)
  uniform float uMouseWarp;    // rim ripple strength

  // --- simplex noise 2D (Ashima / Stefan Gustavson) ---
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {        // hard cap; uOctaves breaks early
      if (float(i) >= uOctaves) break;
      v += a * snoise(p);
      p = p * 2.02 + 19.19;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 asp = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv  = vUv;
    vec2 p   = (uv - 0.5) * asp * 2.4;     // smoke scale

    float t = uTime * 0.05;
    p.y += uScroll * 0.9;                   // smoke drifts down the page

    // --- cursor parts the smoke: shove the domain radially away from cursor ---
    vec2 mo   = (uMouse - 0.5) * asp * 2.4;
    vec2 toM  = p - mo;
    float dist = length(toM);
    float infl = smoothstep(uMouseRadius, 0.0, dist); // 1 at cursor -> 0 at edge
    p += normalize(toM + 1e-4) * infl * uMouseStrength;

    // --- domain-warped fbm smoke (iq-style q -> r -> f) ---
    float turb = 1.0 + uVelocity * 0.5;
    vec2 q = vec2(fbm(p + vec2(0.0, t)),
                  fbm(p + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(p + q * 1.6 + vec2(1.7, 9.2) + t * 0.15),
                  fbm(p + q * 1.6 + vec2(8.3, 2.8) - t * 0.12));
    float f = fbm(p + r * turb);

    float density = smoothstep(-0.55, 0.85, f);

    // local thinning ("hole") + faint rim ripple under the cursor
    density *= 1.0 - infl * uMouseHole;
    density += infl * uMouseWarp * 0.10 * snoise(p * 3.0 + t);

    // grayscale smoke over near-black
    vec3 bg    = vec3(0.051);                  // ~#0d0d0d (matches --color-bg)
    vec3 smoke = vec3(0.40) + 0.30 * density;  // mid grays
    vec3 col   = mix(bg, smoke, clamp(density, 0.0, 1.0));

    // soft rim light around the parted hole
    float rim = 1.0 - smoothstep(0.0, 0.16, abs(dist - uMouseRadius * 0.55));
    col += infl * rim * 0.05;

    // vertical vignette + gentle fade as you descend the page
    float vig = smoothstep(1.2, 0.2, length((uv - 0.5) * vec2(1.0, 1.25)));
    col *= 0.55 + 0.45 * vig;
    col *= 1.0 - uScroll * 0.15;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fragment-heavy shader: keep the buffer small. Smoke is soft/low-frequency,
    // so a low dpr is imperceptible and keeps it smooth (more so on phones).
    const isSmall = window.innerWidth < 768;
    const dpr = isSmall ? 0.75 : 1.0;

    const renderer = new Renderer({ canvas, dpr, antialias: false, alpha: false });
    const gl = renderer.gl;

    // fullscreen triangle (covers clip space; uv 0..1 across the screen)
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uScroll: { value: 0 },
        uVelocity: { value: 0 },
        uOctaves: { value: isSmall ? 2.0 : 4.0 },
        uMouse: { value: [0.5, 0.5] },
        uMouseRadius: { value: 0.55 },
        uMouseStrength: { value: 0.0 }, // eased toward target each frame
        uMouseHole: { value: 0.55 },
        uMouseWarp: { value: 1.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    window.addEventListener('resize', resize);

    // --- mouse: smoothed position + hover boost over interactive elements ---
    let targetMX = 0.5;
    let targetMY = 0.5;
    let curMX = 0.5;
    let curMY = 0.5;
    const STRENGTH_BASE = 0.12;
    const STRENGTH_HOVER = 0.22;
    let strengthCur = 0;
    let hoverTarget = 0; // 0..1
    const INTERACTIVE = 'a, button, input, textarea, label, [data-cursor]';

    const onPointer = (e: PointerEvent) => {
      targetMX = e.clientX / window.innerWidth;
      targetMY = 1 - e.clientY / window.innerHeight; // gl_FragCoord origin = bottom-left
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.(INTERACTIVE)) hoverTarget = 1;
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const rel = e.relatedTarget as Element | null;
      if (t?.closest?.(INTERACTIVE) && !rel?.closest?.(INTERACTIVE)) hoverTarget = 0;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });

    // --- scroll: progress + velocity-driven turbulence ---
    let lastScrollY = window.scrollY;
    let targetVel = 0;
    let velCur = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      program.uniforms.uScroll.value = max > 0 ? y / max : 0;
      targetVel = Math.min(Math.abs(y - lastScrollY) / 60, 1);
      lastScrollY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    let running = true;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      program.uniforms.uTime.value = t;

      curMX += (targetMX - curMX) * 0.1;
      curMY += (targetMY - curMY) * 0.1;
      program.uniforms.uMouse.value = [curMX, curMY];

      const strengthTarget =
        STRENGTH_BASE + (STRENGTH_HOVER - STRENGTH_BASE) * hoverTarget;
      strengthCur += (strengthTarget - strengthCur) * 0.08;
      program.uniforms.uMouseStrength.value = strengthCur;

      velCur += (targetVel - velCur) * 0.08;
      targetVel *= 0.9;
      program.uniforms.uVelocity.value = velCur;

      renderer.render({ scene: mesh });
      if (running) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 block h-full w-full"
    />
  );
}
```

- [ ] **Step 2: Сборка + типы**

Run: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'; npm run build; npm run typecheck`
Expected: чисто. (Старые `Camera`/`Transform` импорты удалены — ESLint не должен ругаться на unused.)

- [ ] **Step 3: Проверка в браузере — дым + раздвигание курсором + перф**

Dev на 1280, затем 375. Playwright с `reduced_motion="no-preference"` (снять кадры дрейфа) и/или живой Chrome (Browser 1 Windows).
Expected:
- Дым клубится/дрейфует (домен-варп виден — органичная структура, не статичная зернь), монохром (серые градации на near-black).
- Курсор видимо **раздвигает** дым и оставляет прорежённую «дырку» со слабым свечением по краю; движется синхронно с кометой.
- Над ссылками/кнопками раздвигание чуть сильнее (наведись на CTA формы).
- При скролле дым медленно сдвигается/гаснет вниз; быстрый скролл слегка добавляет турбулентности.
- **0 ошибок/варнингов в консоли** (особенно компиляция шейдера — `Program` бросит в консоль при ошибке GLSL).
- Нет горизонтального скролла на 375/1280.
- Перф: на 1280 плавно (≈60fps), на 375 без явных просадок. Если дёргается — снизить `uOctaves` (4→3) и/или `dpr` (1.0→0.8), переснять.

- [ ] **Step 4: Читаемость текста над дымом**

В браузере пройти все секции: текст не тонет в дыму (гало `.legible` на корнях секций уже стоит). Если где-то контраст просел из-за яркого клуба — НЕ затемнять дым глобально (это подпись), а проверить, что секция несёт `.legible`; при необходимости приглушить общую яркость дыма (`vec3 smoke = vec3(0.40)...` → `0.34`) — точечный тюнинг на этом шаге.
Expected: весь копирайт читаем поверх дыма на 375/768/1280.

- [ ] **Step 5: Commit**

```bash
git add src/components/field/Field.tsx
git commit -m "feat(field): FBM-дым на OGL — курсор раздвигает/прореживает дым (замена дюн и звёзд)"
```

---

## Task 4: Моушн-почерк — Lenis lerp под aboutluca

**Files:**
- Modify: `src/components/providers/SmoothScroll.tsx:25`

**Почему именно так:** спека §E — довести ощущение скролла к Luca (`lerp ≈ .18–.2`). Lenis поддерживает либо `duration`, либо `lerp`; переключаемся на `lerp` (линейная интерполяция кадра, как у Luca). Velocity-skew и `pinType:'transform'` у WhatIDo сохраняем (их не трогаем — пиннинг завязан на трансформ-обёртку).

- [ ] **Step 1: Переключить Lenis на lerp**

Заменить строку 25:
```tsx
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
```
на:
```tsx
    const lenis = new Lenis({ lerp: 0.18, smoothWheel: true });
```

- [ ] **Step 2: Сборка**

Run: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'; npm run build`
Expected: чисто.

- [ ] **Step 3: Проверка скролла в браузере**

Dev на 1280: скролл ощущается плавно-«увесисто» как у Luca; velocity-skew жив (лёгкий наклон контента на быстром скролле); pinned-секция WhatIDo (секвенция карточек) работает, overflow нет.
Expected: единый почерк скролла; фирменные ревилы (ClipReveal BUILD/CRAFT, SignatureLine, HeroName, секвенция WhatIDo) живы.

- [ ] **Step 4: Commit**

```bash
git add src/components/providers/SmoothScroll.tsx
git commit -m "refactor(motion): Lenis lerp .18 — почерк скролла под aboutluca"
```

---

## Task 5: Финальная вычитка и закрытие пасса

**Files:**
- Modify: `CLAUDE.md` (блок статуса)

**Почему именно так:** проектное правило `«Готово» = доказано` + дизайн-конвейер требует `impeccable audit → polish` и проверки 375/768/1280 перед финалом; статус в `CLAUDE.md` обновляем по ходу.

- [ ] **Step 1: Полный прогон проверок**

Run: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'; npm run build; npm run typecheck; npm test`
Expected: build/types чисто; `npm test` — **16/16 PASS**.

- [ ] **Step 2: Playwright-моушн на трёх ширинах**

Снять кадры (`reduced_motion="no-preference"`) на 375 / 768 / 1280, `/en` и `/uk`:
- дрейф дыма + раздвигание курсором,
- типографика (один Plex, кириллица на `/uk`),
- монохром (нет цветных пятен),
- ревилы + секвенция WhatIDo,
- отсутствие горизонтального overflow.
Expected: всё подтверждено кадрами; скрипты `.verify/*.py` после — удалить.

- [ ] **Step 3: impeccable audit → polish**

Прогнать скилл `impeccable` (`audit`, затем `polish` по P1/P2). Особое внимание: контраст текста над дымом ≥ 4.5:1 (AA), видимый `:focus-visible`, отсутствие AI-slop (дым+комета — distinctive). Пофиксить найденное.
Expected: контраст AA проходит; критичных замечаний нет.

- [ ] **Step 4: Обновить статус в CLAUDE.md**

В `CLAUDE.md` (раздел «Дизайн — пост-деплой моушн-пасс» / «Текущий статус») добавить строку, что «Luca-моушн-пасс» выполнен: FBM-дым (курсор раздвигает) заменил дюны/звёзды, ре-тайпсет на IBM Plex Mono (latin+cyrillic), чистый монохром (5 accent-токенов удалены), Lenis lerp .18; reduced-motion по-прежнему отключён. Указать, что OG-картинка осознанно оставлена цветной (вне scope SEO/OG).

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: зафиксировать выполнение Luca-моушн-пасса (дым/Plex Mono/монохром)"
```

- [ ] **Step 6: Деплой (по «ок» владельца)**

Push в `main` триггерит прод-деплой Vercel (автодеплой подключён). **Перед push — спросить владельца** (правило: действия наружу — с подтверждения). После деплоя — проверить live-рендер (дым/курсор/типографика/монохром) скрином.

---

## Self-Review (проверка плана против спеки)

**Покрытие спеки:**
- §A Фон FBM-дым (uMouse/Radius/Strength/Hole/Warp, uScroll, perf-капы, пауза, фолбэк) → **Task 3** ✓. IntersectionObserver осознанно опущен (fixed-канвас всегда в вьюпорте) — задокументировано.
- §B Типографика IBM Plex Mono (обе перем., веса, latin+cyrillic, удалить Archivo/Space_Mono, трекинг-капс лейблы уже есть) → **Task 1** ✓. Трекинг-капс эйбрау уже в коде (`tracking-[0.3em] uppercase`) — не трогаем.
- §C Курсор ⇄ дым (общий источник мыши, усиление над интерактивом) → **Task 3** (Field сам слушает pointermove/over/out; комета синхронна) ✓.
- §D Монохром (удалить 5 токенов, де-акцент GlassCard/WhatIDo/WorkDreamGold/CasePhones, grep) → **Task 2** ✓ (+ Hero/Contact семантические зелёные → белый).
- §E Моушн-язык (Lenis lerp .18, skew/pinType сохранить, ревилы-подписи живы, reduced-motion не гейтим) → **Task 4** ✓.
- §F Вне scope → соблюдено; OG-картинка явно исключена и помечена.
- §6 Проверки (build/typecheck/test 16/16, браузер 375/768/1280, Playwright, impeccable, контраст AA) → **Task 5** ✓.

**Плейсхолдеры:** нет — весь код приведён целиком (полные файлы для GlassCard и Field, точные строки для остального).

**Согласованность типов:** `GlassCardProps` теряет `accent` в Task 2 Step 2 ровно тогда же, когда WhatIDo перестаёт его передавать (Step 3) — одной задачей/коммитом, рассинхрона нет. Униформы шейдера (`uMouse*`) объявлены в GLSL и инициализированы в JS с теми же именами.

**Риск-заметки для исполнителя:** (1) моно-глифы шире — главный риск переносов/overflow на 375 (Hero-имя, BUILD/CRAFT) → проверка Task 1 Step 6, фолбэк — снизить clamp. (2) Дымовой фрагмент тяжёлый → перф-ручки `uOctaves`/`dpr` (Task 3 Step 3). (3) Удаление accent-токенов ломает стиль молча → grep-гейт (Task 2 Step 8).
