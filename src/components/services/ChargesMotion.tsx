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

      const track = root.querySelector<HTMLElement>('[data-charges-track]');
      const viewport = root.querySelector<HTMLElement>('[data-track-viewport]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-count]', root);
      if (!track || !viewport || !cards.length) return;

      const railItems = gsap.utils.toArray<HTMLElement>(
        '[data-rail-item]',
        root,
      );
      const tally = root.querySelector<HTMLElement>('[data-rail-tally]');
      const railCount = root.querySelector<HTMLElement>('[data-rail-count]');
      const progress = root.querySelector<HTMLElement>('[data-rail-progress]');
      const rail = root.querySelector<HTMLElement>('[data-rail]');
      const header = root.querySelector<HTMLElement>('[data-charges-header]');
      const verdict = root.querySelector<HTMLElement>('[data-verdict]');
      const glow = root.querySelector<HTMLElement>('[data-verdict-glow]');
      const eyebrow = root.querySelector<HTMLElement>('[data-verdict-eyebrow]');
      const headline = root.querySelector<HTMLElement>(
        '[data-verdict-headline]',
      );

      const numText = new Map<HTMLElement, string>();
      cards.forEach((c) => {
        const n = c.querySelector<HTMLElement>('[data-count-num]');
        if (n) numText.set(c, n.textContent || '');
      });
      const pad = (n: number) => String(n).padStart(2, '0');
      const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
      const easeIO = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // повторно-безопасный слэм пункта (играет при КАЖДОЙ активации, вниз/вверх)
      const revealCount = (card: HTMLElement, words: Element[]) => {
        const num = card.querySelector<HTMLElement>('[data-count-num]');
        const gloss = card.querySelector<HTMLElement>('[data-count-gloss]');
        const stamp = card.querySelector<HTMLElement>('[data-count-stamp]');
        const stampDraw = card.querySelector<SVGElement>('[data-stamp-draw]');
        const original = numText.get(card) ?? num?.textContent ?? '';

        gsap.killTweensOf(
          [num, gloss, stamp, stampDraw, ...words].filter(Boolean) as Element[],
        );
        if (num) {
          num.textContent = original;
          gsap.set(num, { autoAlpha: 1 });
        }
        if (words.length) gsap.set(words, { autoAlpha: 1, y: 0 });
        if (gloss) gsap.set(gloss, { autoAlpha: 1, y: 0 });
        if (stampDraw) gsap.set(stampDraw, { drawSVG: '100%' });
        if (stamp) gsap.set(stamp, { autoAlpha: 1, scale: 1, rotate: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (num) {
          tl.fromTo(num, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0);
          tl.to(
            num,
            {
              duration: 0.5,
              scrambleText: { text: original, chars: '0123456789' },
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

      const build = (perCard: number, finalPct: number, withBlur: boolean) => {
        const N = cards.length;
        const lastIdx = N - 1;

        const splits = cards.map((c) => {
          const charge = c.querySelector<HTMLElement>('[data-count-charge]');
          return charge ? new SplitText(charge, { type: 'words' }) : null;
        });
        const vSplit = headline
          ? new SplitText(headline, { type: 'lines', mask: 'lines' })
          : null;
        const vLines = vSplit?.lines ?? [];

        // вердикт — оверлей (центрирование в самом Verdict), скрыт до финала
        if (verdict) gsap.set(verdict, { autoAlpha: 0 });
        gsap.set(vLines, { yPercent: 100 });
        if (glow) gsap.set(glow, { autoAlpha: 0 });

        // раскладка трека (измеряется + переизмеряется на resize)
        let step = 0;
        let startX = 0;
        const measure = () => {
          const cardW = cards[0].offsetWidth;
          const styles = getComputedStyle(track);
          const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
          step = cardW + gap;
          startX = (viewport.clientWidth - cardW) / 2; // x, центрирующий card[0]
        };

        // фокус: активная карта крупнее/ярче, соседние мельче/тусклее
        const focus = (f: number) => {
          cards.forEach((c, j) => {
            const d = Math.abs(j - f);
            gsap.set(c, {
              transformOrigin: 'center',
              scale: 1 - 0.08 * Math.min(d, 1),
              autoAlpha: 1 - 0.6 * Math.min(d, 1.5),
            });
          });
        };

        let current = -1;
        let inFinal = false;
        let eyebrowDone = false;

        const totalPct = (N - 1) * perCard + finalPct;
        const horizFrac = ((N - 1) * perCard) / totalPct;

        const showActive = (active: number) => {
          if (active === current) return;
          current = active;
          revealCount(cards[active], splits[active]?.words ?? []);
          setRail(active);
        };

        const collapseReset = () => {
          gsap.set(track, { scale: 1, autoAlpha: 1, filter: 'blur(0px)' });
          if (rail) gsap.set(rail, { autoAlpha: 1, y: 0 });
          if (header) gsap.set(header, { autoAlpha: 1, y: 0 });
          if (verdict) gsap.set(verdict, { autoAlpha: 0 });
          if (glow) gsap.set(glow, { autoAlpha: 0 });
          gsap.set(vLines, { yPercent: 100 });
        };

        const enterFinal = () => {
          if (inFinal) return;
          inFinal = true;
          focus(lastIdx);
          showActive(lastIdx);
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

        // bloom вердикта: лента отъезжает+блюрится, хедлайн собирается построчно
        const collapseRender = (raw: number) => {
          const p = clamp01(raw);
          const out = clamp01(p / 0.45);
          const sc = 1 - 0.18 * easeIO(clamp01(p / 0.7));
          gsap.set(track, {
            transformOrigin: '50% 50%',
            scale: sc,
            autoAlpha: 1 - out,
            filter: withBlur
              ? `blur(${(8 * clamp01(p / 0.7)).toFixed(2)}px)`
              : 'blur(0px)',
          });
          if (rail)
            gsap.set(rail, {
              y: 22 * easeIO(clamp01(p / 0.45)),
              autoAlpha: 1 - clamp01(p / 0.4),
            });
          if (header)
            gsap.set(header, {
              y: -24 * easeIO(clamp01(p / 0.45)),
              autoAlpha: 1 - clamp01(p / 0.4),
            });
          const vp = clamp01((p - 0.28) / 0.5);
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
          end: `+=${totalPct}%`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: measure,
          onUpdate: (self) => {
            const prog = self.progress;
            if (prog <= horizFrac) {
              if (inFinal) exitFinal();
              const f = horizFrac > 0 ? (prog / horizFrac) * lastIdx : 0;
              gsap.set(track, { x: startX - f * step });
              focus(f);
              showActive(Math.round(f));
            } else {
              gsap.set(track, { x: startX - lastIdx * step });
              enterFinal();
              collapseRender((prog - horizFrac) / (1 - horizFrac));
            }
          },
        });

        measure();
        gsap.set(track, { x: startX });
        focus(0);
        showActive(0);

        return () => {
          st.kill();
          splits.forEach((s) => s?.revert());
          vSplit?.revert();
        };
      };

      const mm = gsap.matchMedia();
      // desktop: длиннее ход + blur на финале
      mm.add('(min-width: 1024px)', () => build(55, 85, true));
      // mobile/планшет: короче, без blur
      mm.add('(max-width: 1023px)', () => build(46, 64, false));

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
