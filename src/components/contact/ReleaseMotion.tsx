'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function ReleaseMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');
      if (!section) return;

      // СТАДИЯ 2 — освобождение (по событию vb:released из VisitForm)
      const release = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
        tl.to('[data-bars-left]', { xPercent: -110, duration: 0.9 }, 0);
        tl.to('[data-bars-right]', { xPercent: 110, duration: 0.9 }, 0);
        tl.to('[data-lockplate]', { autoAlpha: 0, duration: 0.3 }, 0);
        tl.to('[data-daylight]', { opacity: 0.55, duration: 1.1 }, 0.1);
      };
      window.addEventListener('vb:released', release);

      // СТАДИЯ 1 — on-enter (прутья садятся, контент проявляется).
      // Реплей: без `once` — onEnter на каждый вход СВЕРХУ ВНИЗ; прошлый таймлайн
      // убиваем (стадия 2/release event — отдельно, её не трогаем).
      let revealTl: gsap.core.Timeline | null = null;
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => {
          revealTl?.kill();
          const tl = (revealTl = gsap.timeline({
            defaults: { ease: 'power3.out' },
          }));
          tl.from(
            ['[data-bars-left]', '[data-bars-right]'],
            { y: -28, autoAlpha: 0, duration: 0.8 },
            0,
          );
          tl.from(
            '[data-lockplate]',
            { autoAlpha: 0, y: -10, duration: 0.5 },
            0.2,
          );
          tl.from(
            '[data-contact-reveal]',
            { autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.7 },
            0.25,
          );
        },
      });

      return () => {
        window.removeEventListener('vb:released', release);
        revealTl?.kill();
        st.kill();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
