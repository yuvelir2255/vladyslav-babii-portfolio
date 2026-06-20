'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // нет на тач-устройствах
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = dot.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3' });
    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', move);

    // магнитные элементы (CTA)
    const mags = Array.from(
      document.querySelectorAll<HTMLElement>('[data-magnetic]'),
    );
    const cleaners = mags.map((m) => {
      const onMove = (e: MouseEvent) => {
        const r = m.getBoundingClientRect();
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.3,
          y: (e.clientY - (r.top + r.height / 2)) * 0.3,
          duration: 0.4,
        });
      };
      const onLeave = () =>
        gsap.to(m, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,0.4)' });
      m.addEventListener('mousemove', onMove);
      m.addEventListener('mouseleave', onLeave);
      return () => {
        m.removeEventListener('mousemove', onMove);
        m.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => {
      window.removeEventListener('mousemove', move);
      cleaners.forEach((c) => c());
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] -mt-5 -ml-5 h-10 w-10 rounded-full mix-blend-screen"
      style={{
        background:
          'radial-gradient(circle, color-mix(in srgb, var(--color-orange) 55%, transparent), transparent 70%)',
      }}
    />
  );
}
