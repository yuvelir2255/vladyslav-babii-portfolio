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

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const setX = gsap.quickSetter(el, 'x', 'px');
    const setY = gsap.quickSetter(el, 'y', 'px');

    let visible = false;
    const move = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
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

  return <div ref={dot} aria-hidden="true" className="cursor-core" />;
}
