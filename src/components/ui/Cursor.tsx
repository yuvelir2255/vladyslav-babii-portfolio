'use client';

import { useEffect, useRef } from 'react';

/**
 * Comet cursor (aboutluca-style): a bright glowing orb at the pointer trailing a
 * soft white tail that fades like a shooting star. Drawn on an additive 2D canvas
 * (no React state). Fine-pointer only. Runs regardless of prefers-reduced-motion
 * (project decision: full motion for everyone, like aboutluca).
 */
export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

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
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = w / 2;
    let my = h / 2;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      visible = true;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // grow / form a ring over interactive elements (affordance + delight)
    const INTERACTIVE = 'a, button, input, textarea, label, [data-cursor]';
    let hoverTarget = 0;
    let grow = 0;
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.(INTERACTIVE)) hoverTarget = 1;
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const rel = e.relatedTarget as Element | null;
      if (t?.closest?.(INTERACTIVE) && !rel?.closest?.(INTERACTIVE)) {
        hoverTarget = 0;
      }
    };
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });

    // glowing orb at (cx, cy); `g0` (0..1) swells the halo and forms a ring
    // when hovering interactive elements
    const drawHead = (cx: number, cy: number, g0: number) => {
      ctx.globalCompositeOperation = 'lighter';
      const r = 16 + g0 * 18;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(255, 255, 255, ${0.6 + g0 * 0.15})`);
      g.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 - g0 * 0.45})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
      ctx.fill();

      if (g0 > 0.01) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${g0 * 0.5})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, 12 + g0 * 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // comet: fade the previous frame a little, redraw the orb at the pointer;
    // the fade leaves a soft tail behind as the pointer moves
    const draw = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, w, h);
      grow += (hoverTarget - grow) * 0.15;
      if (visible) drawHead(mx, my, grow);
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
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
