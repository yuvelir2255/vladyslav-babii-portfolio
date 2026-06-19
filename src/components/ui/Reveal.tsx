'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface RevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  /** Distance (px) the block rises from. */
  y?: number;
  delay?: number;
  duration?: number;
  /** Animate when scrolled into view (default), or once on mount when false. */
  scroll?: boolean;
  start?: string;
}

/**
 * Reveals a block (fade + rise) when scrolled into view. SSR-safe and skipped
 * under reduced-motion (content shown as-is).
 */
export default function Reveal({
  children,
  as,
  className,
  y = 28,
  delay = 0,
  duration = 0.9,
  scroll = true,
  start = 'top 85%',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Comp = (as ?? 'div') as React.ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from(el, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: 'power3.out',
        ...(scroll ? { scrollTrigger: { trigger: el, start } } : {}),
      });
    },
    { scope: ref },
  );

  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
