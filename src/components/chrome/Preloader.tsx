'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import type Lenis from 'lenis';

// «дело» заключённого, проявляется по мере intake
const LOG = [
  '> scanning biometrics…',
  '> matching record… MATCH',
  '> charge: shipping real products',
  '> clearance… GRANTED · welcome in',
];

const SESSION_KEY = 'vb19-intake';

export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // уже проходили intake в этой сессии — сразу hero, без анимации
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      seen = false;
    }
    // на ревизите прелоадер уже скрыт CSS (.intake-seen) до первой отрисовки —
    // просто не запускаем intake/scroll-lock (без setState в эффекте)
    if (seen) return;

    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // контент за прелоадером недоступен с клавиатуры/SR, пока идёт intake
    const content = document.getElementById('app-content');
    if (content) content.inert = true;

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: 100,
      duration: 2.6,
      ease: 'power1.inOut',
      onUpdate: () => setPct(Math.round(obj.v)),
      onComplete: () => {
        gsap.to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          delay: 0.3,
          onComplete: () => {
            try {
              sessionStorage.setItem(SESSION_KEY, '1');
            } catch {
              /* приватный режим — просто покажем intake снова в след. раз */
            }
            if (content) content.inert = false;
            lenis?.start();
            setDone(true);
          },
        });
      },
    });

    return () => {
      tween.kill();
      if (content) content.inert = false;
      lenis?.start(); // страховка: не оставить скролл заблокированным
    };
  }, []);

  if (done) return null;

  const shown = Math.floor((pct / 100) * LOG.length);

  return (
    <div
      ref={root}
      className="preloader grain fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]"
      role="status"
      aria-label="Processing intake, please wait"
    >
      <div
        className="bars pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative z-[2] w-[min(620px,86%)]" aria-hidden="true">
        <p className="mb-5 text-[12px] tracking-[0.32em] text-[var(--color-orange)] uppercase">
          Processing inmate
        </p>
        <div className="font-[family-name:var(--font-display)] text-[clamp(96px,16vw,168px)] leading-[0.9] tabular-nums">
          {String(pct).padStart(3, '0')}
          <span className="align-top text-[0.28em] text-[var(--color-steel)]">
            %
          </span>
        </div>
        <div className="my-6 h-3 overflow-hidden rounded-sm border border-[var(--color-line)]">
          <div
            className="h-full bg-[var(--color-orange)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[12px] leading-[1.85] text-[var(--color-steel)]">
          {LOG.map((l, i) => (
            <div
              key={l}
              className="transition-opacity duration-300"
              style={{ opacity: i < shown ? 1 : 0.15 }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
