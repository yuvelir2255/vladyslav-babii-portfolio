'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { staggerFor } from '@/lib/motion';

interface SplitRevealProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  /** Animate when scrolled into view (default), or once on mount when false. */
  scroll?: boolean;
  /** ScrollTrigger start position (scroll mode only). */
  start?: string;
  /** Delay before the reveal, in seconds. */
  delay?: number;
  /** Total span the word stagger should fill, in seconds. */
  total?: number;
}

/**
 * Reveals text word by word: each word rises from behind a masked line and
 * fades in, staggered. SSR-safe (plain text without JS) and skipped under
 * reduced-motion, where the text is simply shown.
 */
export default function SplitReveal({
  text,
  as,
  className,
  scroll = true,
  start = 'top 82%',
  delay = 0,
  total = 0.6,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Comp = (as ?? 'p') as React.ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const split = new SplitText(el, {
        type: 'lines,words',
        linesClass: 'split-line',
        wordsClass: 'split-word',
      });

      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay,
        stagger: staggerFor(split.words.length, { total }),
        ...(scroll ? { scrollTrigger: { trigger: el, start } } : {}),
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Comp ref={ref} className={className}>
      {text}
    </Comp>
  );
}
