'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Reveals direct children one after another (rise + fade + slight scale) as the
 * group scrolls into view — choreographed entrance for lists/galleries. Only
 * transforms + opacity, so it composes cleanly with per-child effects (e.g. the
 * 3D tilt on the case screenshots). SSR-safe: children visible without JS.
 */
export default function StaggerReveal({
  children,
  className,
  y = 44,
  stagger = 0.12,
  start = 'top 82%',
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || el.children.length === 0) return;

      gsap.from(el.children, {
        opacity: 0,
        y,
        scale: 0.95,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
