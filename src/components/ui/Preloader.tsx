'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Cinematic intro: two hairlines grow from the centre under "LOADING", then
 * the whole curtain fades to reveal the page. Plays once on mount; collapses
 * instantly under reduced-motion.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hide = () => {
        if (root.current) root.current.style.display = 'none';
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(root.current, { autoAlpha: 0, onComplete: hide });
        return;
      }
      gsap
        .timeline()
        .fromTo(
          '.pl-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
        )
        .to('.pl-text', { opacity: 0, duration: 0.3 }, '-=0.05')
        .to(
          root.current,
          {
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: hide,
          },
          '-=0.1',
        );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="bg-bg fixed inset-0 z-[200] grid place-items-center"
    >
      <div className="flex items-center gap-4">
        <span className="pl-line bg-fg/40 h-px w-24 origin-right" />
        <span className="pl-text text-faint font-mono text-[11px] tracking-[0.4em] uppercase">
          Loading
        </span>
        <span className="pl-line bg-fg/40 h-px w-24 origin-left" />
      </div>
    </div>
  );
}
