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
      const pad = (n: number) => String(n).padStart(2, '0');

      // общий one-shot слэм одного пункта
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
        // (надёжно при быстром скролле/фликах, без учёта пропущенных кадров)
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

      const revealVerdict = () => {
        if (!verdict) return;
        gsap.fromTo(
          verdict.children,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power3.out',
          },
        );
      };

      // единое поведение для всех экранов: пин + snap, один пункт на сцене.
      // pct — длина пиннинга на шаг (desktop длиннее: мышь крутит быстро).
      const build = (pct: number) => {
        gsap.set(cards, { position: 'absolute', inset: 0, autoAlpha: 0 });
        gsap.set(cards[0], { autoAlpha: 1 });
        if (verdict)
          gsap.set(verdict, { position: 'absolute', inset: 0, autoAlpha: 0 });
        if (rail) gsap.set(rail, { autoAlpha: 1 });

        // сплитим заголовки один раз на контекст (не на каждую активацию)
        const splits = cards.map((c) => {
          const charge = c.querySelector<HTMLElement>('[data-count-charge]');
          return charge ? new SplitText(charge, { type: 'words' }) : null;
        });
        // каждый пункт «слэмается» один раз (при первом достижении).
        // повторная активация .from() захватывала бы промежуточное значение
        // как конечное → залипание полупрозрачности.
        const revealed = new Set<number>();

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
          // на вердикте убираем индекс-рейл и хедер секции — приговор занимает сцену чисто
          if (rail)
            gsap.to(rail, { autoAlpha: isVerdict ? 0 : 1, duration: 0.25 });
          if (chargesHeader)
            gsap.to(chargesHeader, {
              autoAlpha: isVerdict ? 0 : 1,
              duration: 0.3,
            });
          if (isVerdict) {
            revealVerdict();
            return;
          }
          if (!revealed.has(i)) {
            revealed.add(i);
            revealCount(cards[i], splits[i]?.words ?? []);
          }
          setRail(i);
        };

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${total * pct}%`,
          pin: true,
          scrub: true,
          snap: {
            snapTo: 1 / (total - 1),
            duration: 0.3,
            ease: 'power1.inOut',
          },
          onUpdate: (self) => show(Math.round(self.progress * (total - 1))),
        });
        show(0);
        return () => {
          st.kill();
          splits.forEach((s) => s?.revert());
        };
      };

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => build(90));
      mm.add('(max-width: 1023px)', () => build(64));

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
