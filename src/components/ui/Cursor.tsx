'use client';

import { useEffect, useRef } from 'react';

/**
 * Comet cursor (aboutluca-style): a bright head at the pointer trailing a soft
 * white glow that fades like a shooting star. Drawn on an additive 2D canvas
 * (no React state). Fine-pointer only; under reduced-motion the native cursor
 * is kept (no trail, no hiding).
 */
export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    document.documentElement.classList.add('has-custom-cursor');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onMove);

    const draw = () => {
      x += (mx - x) * 0.16;
      y += (my - y) * 0.16;

      // fade the previous trail a little (keeps the canvas transparent)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);

      // additive glow head (trails as it lags behind the pointer)
      ctx.globalCompositeOperation = 'lighter';
      const r = 9;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      g.addColorStop(0.35, 'rgba(255, 255, 255, 0.3)');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // crisp bright core at the actual pointer (the comet head)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
