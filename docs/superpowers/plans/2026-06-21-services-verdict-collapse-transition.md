# Services — плавный переход 05 → VERDICT (Collapse) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить резкий дискретный кроссфейд count 05 → вердикт на плавный, привязанный к скроллу «Collapse» (композиция обвинения схлопывается к центру и собирается в приговор).

**Architecture:** Внутри уже существующего `pin + snap` в `ChargesMotion.tsx` финальный сегмент (между snap-точкой count 05 и концом пина) переводим из разового `show(verdict)` в **непрерывный рендер по sub-прогрессу** в `onUpdate`. Пункты 01→05 остаются дискретной декой. В `Verdict.tsx` добавляем glow-слой и `data`-хуки для моушна. Заголовок вердикта раскрывается per-line маской (`SplitText {type:'lines', mask:'lines'}`), айбров — разовый `ScrambleText`.

**Tech Stack:** Next.js 16 / React 19 / TS strict, GSAP 3.15 (ScrollTrigger / SplitText / ScrambleTextPlugin — уже в `src/lib/gsap.ts`), Tailwind v4, Vitest + @testing-library/react. Без новых зависимостей.

> **Соглашение проекта (приоритет над дефолтным TDD скилла):** моушн юнит-тестами НЕ покрываем — верификация перехода в браузере (preview 375/768/1280) + чистый build/typecheck + зелёные существующие тесты. TDD применяем только к DOM-хукам вердикта (Task 1).

> **Ветка:** работаем в уже существующей `feat/scroll-feel-tuning` (там же лежит спека и предыдущий тюнинг скролла). Перед стартом: `Set-Location 'C:\Users\ювелир\Desktop\portfolio'`.

---

## Файловая структура

```
src/components/services/Verdict.tsx        — Modify: +glow-слой, +data-хуки (glow/eyebrow/headline), +isolate
src/components/services/Verdict.test.tsx   — Modify: +тест наличия хуков перехода
src/components/services/ChargesMotion.tsx  — Modify: финальный сегмент → заскрабленный collapse
```

Контент (`services.ts`), `CountCard.tsx`, `CaseRail.tsx`, `Services.tsx` — НЕ меняем.

---

## Task 1: Verdict.tsx — glow-слой и DOM-хуки перехода

**Files:**
- Modify: `src/components/services/Verdict.tsx`
- Test: `src/components/services/Verdict.test.tsx`

- [ ] **Step 1: Дописать падающий тест в `Verdict.test.tsx`**

Добавить третий `it` внутрь `describe('Verdict', …)` (после существующих двух):

```tsx
  it('рендерит glow-слой и data-хуки для перехода', () => {
    const { container } = render(<Verdict />);
    expect(container.querySelector('[data-verdict-glow]')).not.toBeNull();
    expect(container.querySelector('[data-verdict-eyebrow]')).not.toBeNull();
    expect(container.querySelector('[data-verdict-headline]')).not.toBeNull();
  });
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `npm test -- src/components/services/Verdict.test.tsx`
Expected: FAIL — `expected null not to be null` (хуков ещё нет).

- [ ] **Step 3: Обновить `Verdict.tsx` (полный файл)**

```tsx
import { services } from '@/content/services';

export function Verdict() {
  const v = services.verdict;
  return (
    <div data-verdict className="isolate mt-24 text-center max-md:mt-16">
      <div
        data-verdict-glow
        aria-hidden="true"
        className="pointer-events-none absolute top-[42%] left-1/2 -z-10 h-[42vh] w-[60vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--color-orange) 24%, transparent), transparent)',
        }}
      />
      <p
        data-verdict-eyebrow
        className="text-[12px] tracking-[0.2em] text-[var(--color-steel)] uppercase"
      >
        {v.eyebrow}
      </p>
      <h3
        data-verdict-headline
        className="mt-4 font-[family-name:var(--font-display)] text-[clamp(44px,9vw,120px)] leading-[0.9] text-[var(--color-orange)] uppercase"
      >
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

Заметки: `isolate` на корне + `-z-10` на glow держат свечение позади текста, не залезая под общий фон. Glow `opacity-0` по умолчанию (моушн поднимет). `aria-hidden` — декоративный слой.

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `npm test -- src/components/services/Verdict.test.tsx`
Expected: PASS (3 теста).

- [ ] **Step 5: Коммит**

```bash
git add src/components/services/Verdict.tsx src/components/services/Verdict.test.tsx
git commit -m "feat(services): glow-слой и data-хуки вердикта под переход Collapse"
```

> Windows-нюанс: lint-staged/prettier переформатирует staged-файлы на коммите. Если после коммита будешь снова править эти файлы — сперва перечитай их (Read).

---

## Task 2: ChargesMotion.tsx — финальный сегмент как заскрабленный Collapse

**Files:**
- Modify: `src/components/services/ChargesMotion.tsx`

Моушн — без юнит-тестов (правило проекта). Шаг реализации полностью переписывает файл, далее — статическая проверка (typecheck/build) и существующие тесты Services.

- [ ] **Step 1: Заменить содержимое `ChargesMotion.tsx` (полный файл)**

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
      const railItems = gsap.utils.toArray<HTMLElement>(
        '[data-rail-item]',
        root,
      );
      const tally = root.querySelector<HTMLElement>('[data-rail-tally]');
      const railCount = root.querySelector<HTMLElement>('[data-rail-count]');
      const progress = root.querySelector<HTMLElement>('[data-rail-progress]');
      const verdict = root.querySelector<HTMLElement>('[data-verdict]');
      const rail = root.querySelector<HTMLElement>('[data-rail]');
      const chargesHeader = root.querySelector<HTMLElement>(
        '[data-charges-header]',
      );
      const glow = root.querySelector<HTMLElement>('[data-verdict-glow]');
      const eyebrow = root.querySelector<HTMLElement>('[data-verdict-eyebrow]');
      const headline = root.querySelector<HTMLElement>(
        '[data-verdict-headline]',
      );
      const pad = (n: number) => String(n).padStart(2, '0');
      const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
      const easeIO = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // общий one-shot слэм одного пункта (без изменений)
      const revealCount = (card: HTMLElement, words: Element[]) => {
        const num = card.querySelector<HTMLElement>('[data-count-num]');
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
              scrambleText: {
                text: num.textContent || '',
                chars: '0123456789',
              },
            },
            0,
          );
        }
        if (words.length)
          tl.from(
            words,
            { autoAlpha: 0, y: 24, stagger: 0.06, duration: 0.5 },
            0.1,
          );
        if (gloss) tl.from(gloss, { autoAlpha: 0, y: 14, duration: 0.5 }, 0.25);
        if (stampDraw)
          tl.from(stampDraw, { drawSVG: '0%', duration: 0.4 }, 0.35);
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

      const setRail = (active: number) => {
        railItems.forEach((it, i) =>
          it.classList.toggle('is-active', i === active),
        );
        if (tally) tally.textContent = `Guilty ×${active + 1}`;
        if (railCount)
          railCount.textContent = `${pad(active + 1)} / ${pad(cards.length)}`;
        if (progress)
          gsap.to(progress, {
            scaleX: (active + 1) / cards.length,
            duration: 0.3,
            overwrite: true,
          });
      };

      // pin + snap для counts; финал 05→вердикт — непрерывный «collapse» по скроллу.
      // pct — длина пиннинга на шаг; withBlur — desktop (blur) vs mobile (без blur).
      const build = (pct: number, withBlur: boolean) => {
        gsap.set(cards, { position: 'absolute', inset: 0, autoAlpha: 0 });
        gsap.set(cards[0], { autoAlpha: 1 });

        const splits = cards.map((c) => {
          const charge = c.querySelector<HTMLElement>('[data-count-charge]');
          return charge ? new SplitText(charge, { type: 'words' }) : null;
        });

        // вердикт: per-line маска заголовка + стартовые скрытые состояния
        const vSplit = headline
          ? new SplitText(headline, { type: 'lines', mask: 'lines' })
          : null;
        const vLines = vSplit?.lines ?? [];
        if (verdict)
          gsap.set(verdict, { position: 'absolute', inset: 0, autoAlpha: 0 });
        gsap.set(vLines, { yPercent: 100 });
        if (glow) gsap.set(glow, { autoAlpha: 0 });
        if (rail) gsap.set(rail, { autoAlpha: 1 });

        const revealed = new Set<number>();
        let current = -1;
        const lastIdx = cards.length - 1; // count 05
        const total = cards.length + 1; // counts + verdict
        const segs = total - 1; // число сегментов прогресса
        let inFinal = false;
        let eyebrowDone = false;

        // дискретная дека для counts 0..lastIdx
        const show = (i: number) => {
          if (i === current) return;
          current = i;
          cards.forEach((c, idx) =>
            gsap.to(c, { autoAlpha: idx === i ? 1 : 0, duration: 0.25 }),
          );
          if (!revealed.has(i)) {
            revealed.add(i);
            revealCount(cards[i], splits[i]?.words ?? []);
          }
          setRail(i);
        };

        // сброс «collapse» к базе обвинения (при отмотке вверх из финала)
        const collapseReset = () => {
          gsap.set(cards[lastIdx], { scale: 1, filter: 'blur(0px)' });
          if (rail) gsap.set(rail, { x: 0, yPercent: -50, autoAlpha: 1 });
          if (chargesHeader) gsap.set(chargesHeader, { y: 0, autoAlpha: 1 });
          if (verdict) gsap.set(verdict, { autoAlpha: 0 });
          if (glow) gsap.set(glow, { autoAlpha: 0 });
          gsap.set(vLines, { yPercent: 100 });
        };

        // вход в финальный сегмент: count 05 — единственный активный, разовый scramble айброва
        const enterFinal = () => {
          if (inFinal) return;
          inFinal = true;
          current = lastIdx;
          gsap.killTweensOf(
            [cards[lastIdx], rail, chargesHeader, verdict, glow].filter(
              Boolean,
            ) as Element[],
          );
          cards.forEach((c, idx) =>
            gsap.set(c, { autoAlpha: idx === lastIdx ? 1 : 0 }),
          );
          if (!revealed.has(lastIdx)) {
            revealed.add(lastIdx);
            revealCount(cards[lastIdx], splits[lastIdx]?.words ?? []);
          }
          setRail(lastIdx);
          if (!eyebrowDone && eyebrow) {
            eyebrowDone = true;
            gsap.to(eyebrow, {
              duration: 0.5,
              scrambleText: {
                text: eyebrow.textContent || '',
                chars: 'upperCase',
              },
            });
          }
        };

        const exitFinal = () => {
          if (!inFinal) return;
          inFinal = false;
          eyebrowDone = false;
          collapseReset();
          current = -1;
        };

        // непрерывный рендер коллапса по sub-прогрессу p ∈ [0..1]
        const collapseRender = (raw: number) => {
          const p = clamp01(raw);
          const out = clamp01(p / 0.6); // окно ухода обвинения
          const sc = 1 - 0.16 * easeIO(clamp01(p / 0.9));
          gsap.set(cards[lastIdx], {
            transformOrigin: '50% 50%',
            scale: sc,
            autoAlpha: 1 - out,
            filter: withBlur
              ? `blur(${(6 * clamp01(p / 0.7)).toFixed(2)}px)`
              : 'blur(0px)',
          });
          if (rail)
            gsap.set(rail, {
              x: -34 * easeIO(clamp01(p / 0.6)),
              yPercent: -50,
              autoAlpha: 1 - clamp01(p / 0.5),
            });
          if (chargesHeader)
            gsap.set(chargesHeader, {
              y: -24 * easeIO(clamp01(p / 0.6)),
              autoAlpha: 1 - clamp01(p / 0.5),
            });
          const vp = clamp01((p - 0.4) / 0.6); // окно сборки вердикта
          const evp = easeIO(vp);
          if (verdict) gsap.set(verdict, { autoAlpha: vp });
          if (glow)
            gsap.set(glow, {
              transformOrigin: '50% 50%',
              autoAlpha: 0.5 * vp,
              scale: 0.6 + 0.4 * evp,
            });
          vLines.forEach((ln, i) => {
            const lp = clamp01((evp - i * 0.12) / 0.7);
            gsap.set(ln, { yPercent: 100 * (1 - lp) });
          });
        };

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${total * pct}%`,
          pin: true,
          scrub: true,
          snap: {
            snapTo: 1 / segs,
            duration: 0.3,
            ease: 'power1.inOut',
          },
          onUpdate: (self) => {
            const pos = self.progress * segs;
            if (pos <= lastIdx) {
              if (inFinal) exitFinal();
              show(Math.round(pos));
            } else {
              enterFinal();
              collapseRender(pos - lastIdx);
            }
          },
        });
        show(0);
        return () => {
          st.kill();
          splits.forEach((s) => s?.revert());
          vSplit?.revert();
        };
      };

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => build(72, true));
      mm.add('(max-width: 1023px)', () => build(52, false));

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
```

Ключевые отличия от текущего файла:
- `show()` обслуживает только counts (ветка вердикта удалена вместе с `revealVerdict`).
- Финальный сегмент: `enterFinal` / `exitFinal` / `collapseRender` + `collapseReset`.
- `build(pct, withBlur)` — blur только на desktop.
- Заголовок вердикта раскрывается per-line маской (`vSplit`), айбров — разовый scramble.

- [ ] **Step 2: Типы — прогнать typecheck**

Run: `npm run typecheck`
Expected: без ошибок.

- [ ] **Step 3: Существующие тесты — должны остаться зелёными**

Run: `npm test -- src/components/services`
Expected: PASS (Services / CountCard / Verdict / CaseRail — фолбэк-видимость и контент не затронуты).

- [ ] **Step 4: Коммит**

```bash
git add src/components/services/ChargesMotion.tsx
git commit -m "feat(services): плавный переход 05→вердикт — заскрабленный Collapse"
```

---

## Task 3: Верификация в браузере + тюнинг «на ощущение» + финал

**Files:** (тюнинг чисел при необходимости)
- Modify (по факту): `src/components/services/ChargesMotion.tsx` — `collapseRender`-коэффициенты / доля скролла

- [ ] **Step 1: Чистый билд**

Run: `npm run build`
Expected: `Compiled successfully`, без ошибок типов/линта.

- [ ] **Step 2: Поднять превью**

Запустить dev через preview-инструмент (`preview_start`, `npm run dev`, cwd `C:\Users\ювелир\Desktop\portfolio`). Консоль без ошибок (известный dev-варнинг `mugshot.webp` игнорируем).

- [ ] **Step 3: Проверить переход 05 → вердикт и ОБРАТНО вверх — на 1280 / 768 / 375**

Через `preview_resize` + скролл к Services. Глазами проверить:
- обвинение плавно схлопывается (scale + fade + blur на desktop, без blur на 375/768);
- заголовок `GUILTY ON ALL FIVE COUNTS` собирается per-line маской снизу;
- glow мягко всплывает и фиксируется (без пульсации);
- айбров `THE COURT FINDS THE DEFENDANT` скрэмблится один раз;
- отмотка вверх корректно возвращает count 05 (без залипшей полупрозрачности/обрезков);
- нет горизонтального скролла; 60fps (следить, что blur не роняет fps на desktop).

- [ ] **Step 4: Тюнинг (если нужно)**

Подкрутить «на ощущение» в `collapseRender` / `build`:
- скорость ухода обвинения — делитель `p / 0.6`;
- сила blur — `6 * …` (или убрать на desktop, если тяжело по fps);
- пик glow — `0.5 * vp`;
- «воздух» под финал — общий `pct` (72 / 52) или start/end.

После любой правки — повтор Step 1+3.

- [ ] **Step 5: Финальная проверка перед «готово»**

Run: `npm run build` → чисто
Run: `npm test` → весь набор зелёный
Run: `npm run typecheck` → без ошибок

- [ ] **Step 6: Коммит тюнинга (если был) + обновить статус-доки**

```bash
git add -A
git commit -m "polish(services): финальный тюнинг перехода Collapse (на ощущение)"
```

Обновить карту секций в `CLAUDE.md` (строка Services → отметить плавный переход 05→вердикт) и память `portfolio-next-build-sections.md`. Деплой/мерж в `main` — НЕ делать без явного «ок» владельца (правило проекта).

---

## Self-Review (выполнено при написании плана)

**Покрытие спеки:**
- §2 (механика scrub-финала) → Task 2 `onUpdate`/`collapseRender`. ✓
- §3 (хореография: scale/opacity/blur, рейл влево, хедер вверх, маска заголовка, glow, scramble) → Task 2. ✓
- §4 (desktop blur / mobile без blur) → `build(72,true)` / `build(52,false)`. ✓
- §5 (SplitText lines+mask, ScrambleText, без новых зависимостей) → Task 1+2. ✓
- §6 (файлы: Verdict glow + ChargesMotion) → Task 1+2. ✓
- §7 (a11y фолбэк-видимость, glow aria-hidden) → Task 1 (тест наличия) + контент в DOM. ✓
- §8 (build/typecheck/test/браузер) → Task 3. ✓
- glow без пульсации → `collapseRender` статичная `autoAlpha`. ✓

**Плейсхолдеры:** нет. **Согласованность имён:** `collapseRender` / `collapseReset` / `enterFinal` / `exitFinal`, `lastIdx` / `segs` / `total` — единообразны во всех шагах. ✓
