'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function ManifestMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const p = ref.current?.querySelector<HTMLElement>('[data-manifest]');
      if (!p) return;

      // декодим каждый сегмент отдельно — оранжевые ключи сохраняют цвет
      const spans = gsap.utils.toArray<HTMLElement>(p.children);
      const originals = spans.map((s) => s.textContent ?? '');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: p, start: 'top 78%', once: true },
      });
      spans.forEach((s, i) => {
        tl.to(
          s,
          {
            duration: 0.9,
            scrambleText: {
              text: originals[i],
              chars: 'upperCase',
              speed: 0.6,
            },
            // ScrambleText тримит пробелы на стыках — возвращаем точный оригинал
            onComplete: () => {
              s.textContent = originals[i];
            },
          },
          i * 0.12,
        );
      });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
