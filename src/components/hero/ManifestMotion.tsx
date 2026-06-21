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
      const build = (end: string, scrub: number) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'center center',
            end,
            pin: true,
            scrub,
          },
        });
        tl.from(split.words, {
          opacity: 0.2,
          ease: 'none',
          stagger: 0.5,
          duration: 0.6,
        });
      };

      const mm = gsap.matchMedia();
      // десктоп: пин покороче + текст быстрее догоняет скролл (scrub 0.6 = отзывчивее)
      mm.add('(min-width: 1024px)', () => build('+=250%', 0.6));
      // мобайл/планшет: короче (тач уже даёт плавный «тяжёлый» скролл)
      mm.add('(max-width: 1023px)', () => build('+=130%', 0.6));

      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
