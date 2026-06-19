'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Dir = 'left' | 'right';

const FROM: Record<Dir, string> = {
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
};

/**
 * Big display word that "stamps in" with a clip-path wipe (+ a small scale/rise)
 * as it scrolls into view — a bolder entrance than the word-rise reveals, used
 * for the BUILD / CRAFT movements. `from` mirrors the wipe direction so the two
 * read as a pair. SSR-safe: fully visible without JS.
 */
export default function ClipReveal({
  text,
  as,
  className,
  from = 'left',
  start = 'top 82%',
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  from?: Dir;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const Comp = (as ?? 'h2') as React.ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { clipPath: FROM[from], scale: 0.94, opacity: 0.35 },
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Comp
      ref={ref}
      className={className}
      style={{ willChange: 'clip-path, transform' }}
    >
      {text}
    </Comp>
  );
}
