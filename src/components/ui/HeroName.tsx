'use client';

import { useRef } from 'react';
import { useGSAP } from '@/lib/gsap';

/**
 * Hero wordmark that *assembles from particles*. The name is sampled from the
 * real <h1> (its computed font) into target points; particles fly in from a
 * scattered cloud and settle into the letters, then dissolve as the crisp <h1>
 * fades in (hand-off → readable, accessible final state).
 *
 * The <h1> stays in the DOM for SEO/a11y (single h1) and is fully visible
 * without JS. The particle canvas is decorative (aria-hidden) and the loop runs
 * only during the ~2s entrance, then stops — no ongoing cost.
 */

const ASSEMBLE = 1.15; // seconds for the cloud to settle into the name
const HOLD = 0.15; // brief beat fully formed before the hand-off
const MAX_PARTICLES = 4200;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface Particle {
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  d: number; // per-particle stagger (0..1)
  s: number; // sprite size (px)
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let y = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, 0, y);
      line = words[i];
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, 0, y);
}

function makeSprite(): HTMLCanvasElement {
  const s = document.createElement('canvas');
  s.width = s.height = 14;
  const c = s.getContext('2d')!;
  const g = c.createRadialGradient(7, 7, 0, 7, 7, 7);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, 14, 14);
  return s;
}

export default function HeroName({
  text,
  className,
  delay = 1.5,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const h1 = h1Ref.current;
      const canvas = canvasRef.current;
      if (!wrap || !h1 || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let raf = 0;
      let disposed = false;
      let startTime = 0;
      let particles: Particle[] = [];
      const sprite = makeSprite();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const showText = () => {
        h1.style.opacity = '1';
      };
      const hideText = () => {
        h1.style.opacity = '0';
      };

      const build = () => {
        const rect = h1.getBoundingClientRect();
        const w = Math.ceil(rect.width);
        const h = Math.ceil(rect.height);
        if (w < 2 || h < 2) return false;

        const cs = getComputedStyle(h1);
        const fontSize = parseFloat(cs.fontSize);
        const lineH = parseFloat(cs.lineHeight) || fontSize * 1.05;

        // size the visible canvas to the <h1> box (CSS px, dpr-scaled buffer)
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // render the name to an offscreen buffer and sample its pixels
        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        const octx = off.getContext('2d');
        if (!octx) return false;
        octx.clearRect(0, 0, w, h);
        octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        try {
          // letter-spacing match (newer browsers); harmless if unsupported
          (octx as unknown as { letterSpacing: string }).letterSpacing =
            cs.letterSpacing;
        } catch {
          /* noop */
        }
        octx.textBaseline = 'top';
        octx.fillStyle = '#fff';
        wrapText(octx, text, w, lineH);

        const data = octx.getImageData(0, 0, w, h).data;
        let step = Math.max(3, Math.round(fontSize / 26));
        const targets: { x: number; y: number }[] = [];
        const sample = (st: number) => {
          targets.length = 0;
          for (let y = 0; y < h; y += st) {
            for (let x = 0; x < w; x += st) {
              if (data[(y * w + x) * 4 + 3] > 128) targets.push({ x, y });
            }
          }
        };
        sample(step);
        while (targets.length > MAX_PARTICLES) {
          step += 1;
          sample(step);
        }
        if (targets.length === 0) return false;

        const spreadX = w * 0.55;
        const spreadY = h * 1.25;
        particles = targets.map((t) => ({
          tx: t.x,
          ty: t.y,
          ox: t.x + (Math.random() * 2 - 1) * spreadX,
          oy: t.y + (Math.random() * 2 - 1) * spreadY + h * 0.4,
          d: Math.random() * 0.35,
          s: 4 + Math.random() * 3,
        }));
        return true;
      };

      const draw = (now: number) => {
        if (disposed) return;
        if (!startTime) startTime = now;
        const elapsed = (now - startTime) / 1000;
        const prog = clamp01(elapsed / ASSEMBLE);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        for (const p of particles) {
          const pe = easeOutCubic(clamp01((prog * 1.35 - p.d) / (1.35 - p.d)));
          const x = p.ox + (p.tx - p.ox) * pe;
          const y = p.oy + (p.ty - p.oy) * pe;
          ctx.globalAlpha = 0.12 + pe * 0.78;
          ctx.drawImage(sprite, x - p.s / 2, y - p.s / 2, p.s, p.s);
        }
        ctx.globalAlpha = 1;

        if (elapsed < ASSEMBLE + HOLD) {
          raf = requestAnimationFrame(draw);
        } else {
          handOff();
        }
      };

      const handOff = () => {
        // crisp text fades in; the assembled particles fade out beneath it
        showText();
        h1.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 450,
          easing: 'ease-out',
          fill: 'forwards',
        });
        canvas.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 450,
          easing: 'ease-out',
          fill: 'forwards',
        });
      };

      const run = async () => {
        // wait for the real font so sampled glyphs match the DOM <h1>
        if (document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch {
            /* noop */
          }
        }
        if (disposed) return;
        hideText();
        canvas.style.opacity = '1';
        if (!build()) {
          showText();
          return;
        }
        startTime = 0;
        raf = requestAnimationFrame(draw);
      };

      const timer = window.setTimeout(run, delay * 1000);

      return () => {
        disposed = true;
        window.clearTimeout(timer);
        cancelAnimationFrame(raf);
      };
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="relative">
      <h1 ref={h1Ref} className={className}>
        {text}
      </h1>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0"
      />
    </div>
  );
}
