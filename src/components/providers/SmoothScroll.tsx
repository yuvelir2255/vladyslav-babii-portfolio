'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Smooth scroll (Lenis) wired into the GSAP ticker so ScrollTrigger stays in
 * sync. Scroll velocity also drives a very subtle skew on the content for a
 * "weighty" premium feel (eases back to flat when scrolling stops). Runs for
 * everyone (project decision: full motion like aboutluca).
 *
 * The content is wrapped in a transformed element, so pinned sections must use
 * `pinType: 'transform'` (a position:fixed pin would be relative to this
 * transform, not the viewport).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    const skewTo = wrapRef.current
      ? gsap.quickTo(wrapRef.current, 'skewY', {
          duration: 0.5,
          ease: 'power3.out',
        })
      : null;

    lenis.on('scroll', (e: { velocity: number }) => {
      ScrollTrigger.update();
      if (skewTo) skewTo(gsap.utils.clamp(-1, 1, e.velocity * 0.018));
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
