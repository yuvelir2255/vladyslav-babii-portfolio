'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '@/lib/gsap';

export function HeroNameMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const h1 = ref.current?.querySelector<HTMLElement>('[data-hero-name]');
      if (!h1) return;

      // имя по словам (для SR) — собираем до сплита, восстанавливаем aria-label после
      const label = Array.from(h1.children)
        .map((c) => c.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');

      // буквы «штампуются» на входе; aria:'none' — SR читает h1 по aria-label, не по буквам
      const split = new SplitText(h1, { type: 'chars', aria: 'none' });
      if (label) h1.setAttribute('aria-label', label);
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
        ease: 'power3.out',
      });

      // глитч-джиттер на наведении
      const onEnter = () =>
        gsap.to(h1, {
          keyframes: { skewX: [0, -8, 6, -4, 0], x: [0, -3, 3, -1, 0] },
          duration: 0.3,
          ease: 'none',
        });
      h1.addEventListener('mouseenter', onEnter);

      return () => {
        h1.removeEventListener('mouseenter', onEnter);
        split.revert();
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
