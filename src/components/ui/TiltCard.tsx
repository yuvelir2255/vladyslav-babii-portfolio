'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * 3D tilt-on-pointer wrapper for the case screenshots. Smoothly rotates toward
 * the cursor and eases back on leave (quickTo). Runs for everyone.
 */
export default function TiltCard({
  children,
  className,
  max = 14,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;

      gsap.set(el, { transformPerspective: 800, transformOrigin: 'center' });
      const rotY = gsap.quickTo(el, 'rotationY', {
        duration: 0.6,
        ease: 'power3.out',
      });
      const rotX = gsap.quickTo(el, 'rotationX', {
        duration: 0.6,
        ease: 'power3.out',
      });

      const onMove = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotY(px * max);
        rotX(-py * max);
      });
      const onLeave = contextSafe(() => {
        rotY(0);
        rotX(0);
      });

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
