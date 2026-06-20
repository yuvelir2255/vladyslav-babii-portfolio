'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap';

export function ManifestMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const p = root?.querySelector<HTMLElement>('[data-manifest]');
      const section = root?.closest('section');
      if (!p || !section) return;

      // дробим на слова; цвет (bone/orange) сохраняется — приглушаем через opacity
      const split = new SplitText(p, { type: 'words' });

      // секция «застывает» по центру, текст слово-за-словом загорается по скроллу
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'center center',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
        },
      });
      tl.from(split.words, {
        opacity: 0.2,
        ease: 'none',
        stagger: 0.35,
        duration: 0.6,
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
