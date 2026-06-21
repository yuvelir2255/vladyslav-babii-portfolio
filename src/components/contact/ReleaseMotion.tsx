'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function ReleaseMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      // СТАДИЯ 2 — освобождение (по событию vb:released из VisitForm; не по скроллу)
      const release = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
        tl.to('[data-bars-left]', { xPercent: -110, duration: 0.9 }, 0);
        tl.to('[data-bars-right]', { xPercent: 110, duration: 0.9 }, 0);
        tl.to('[data-daylight]', { opacity: 0.55, duration: 1.1 }, 0.1);
      };
      window.addEventListener('vb:released', release);

      // СТАДИЯ 1 — скраб-ревил: прутья «садятся» и контент проявляется по скроллу
      const reveal = (
        el: Element,
        vars: gsap.TweenVars,
        start = 'top 90%',
        end = 'top 60%',
      ) =>
        gsap.from(el, {
          ...vars,
          ease: 'none',
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
        });

      root
        .querySelectorAll('[data-bars-left], [data-bars-right]')
        .forEach((b) =>
          reveal(b, { autoAlpha: 0, y: -28 }, 'top 96%', 'top 72%'),
        );

      root
        .querySelectorAll('[data-contact-reveal]')
        .forEach((el) => reveal(el, { autoAlpha: 0, y: 24 }));

      return () => window.removeEventListener('vb:released', release);
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
