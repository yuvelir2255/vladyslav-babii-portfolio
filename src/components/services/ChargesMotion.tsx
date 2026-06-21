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

      const setRail = (active: number) => {
        railItems.forEach((it, i) =>
          it.classList.toggle('is-active', i === active),
        );
        // «Guilty ×N» = число пунктов, дошедших до активного включительно
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

        // сплитим заголовки counts один раз на контекст
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

        // каждый пункт «слэмается» один раз (при первом достижении)
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
