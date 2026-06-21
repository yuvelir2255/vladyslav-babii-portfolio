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

          // 5. факты
          tl.from(
            '[data-fact]',
            { autoAlpha: 0, y: 14, stagger: 0.05, duration: 0.4 },
            0.75,
          );

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
