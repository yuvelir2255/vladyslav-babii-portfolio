'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

/**
 * Closing signature ("Ready when it matters.") that *assembles* on scroll: each
 * character brightens from a dim baseline to full as the line travels through
 * the viewport (scrubbed). A deliberate punctuation beat, distinct from the
 * word-rise reveals elsewhere. SSR-safe: full, visible text without JS.
 */
export default function SignatureLine({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const split = new SplitText(el, {
        type: 'chars',
        charsClass: 'sig-char',
      });

      // Assemble as it enters; reach full brightness by the time the line sits
      // around the middle (its comfortable reading position), then hold.
      gsap.fromTo(
        split.chars,
        { opacity: 0.25 },
        {
          opacity: 1,
          ease: 'none',
          stagger: { each: 0.5 / Math.max(split.chars.length, 1) },
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 48%',
            scrub: true,
          },
        },
      );

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} className={className}>
      {text}
    </h2>
  );
}
