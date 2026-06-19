'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom cursor: a trailing ring + instant dot, magnetic on interactive
 * elements. Driven by rAF + refs (never React state) so it stays smooth.
 * Fine-pointer only (hidden on touch). Honors reduced-motion (no trail).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (reduce) {
        ring.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${targetScale})`;
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      targetScale = el?.closest(
        'a, button, [data-cursor], input, textarea, label',
      )
        ? 1.9
        : 1;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (targetScale - scale) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="border-fg/40 pointer-events-none fixed top-0 left-0 z-[100] h-8 w-8 rounded-full border mix-blend-difference"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="bg-fg pointer-events-none fixed top-0 left-0 z-[100] h-1 w-1 rounded-full mix-blend-difference"
      />
    </>
  );
}
