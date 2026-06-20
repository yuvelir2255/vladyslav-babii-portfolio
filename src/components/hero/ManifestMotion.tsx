'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap';

export function ManifestMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const p = ref.current?.querySelector<HTMLElement>('[data-manifest]');
      if (!p) return;

      // строки выезжают снизу из-под маски — плавный premium reveal
      const split = new SplitText(p, { type: 'lines', mask: 'lines' });
      // видимый дефолт: reveal прячет-и-показывает только когда триггер реально
      // сработал — если ScrollTrigger не отработает, текст не останется скрытым
      gsap.set(split.lines, { yPercent: 0, opacity: 1 });
      const st = ScrollTrigger.create({
        trigger: p,
        start: 'top 80%',
        once: true,
        onEnter: () =>
          gsap.from(split.lines, {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            onComplete: () => split.revert(), // вернуть естественный поток (адаптив)
          }),
      });

      return () => {
        st.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
