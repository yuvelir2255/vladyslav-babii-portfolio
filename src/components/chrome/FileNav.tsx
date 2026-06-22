'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

const SECTIONS = [
  { code: '00', label: 'The Yard', href: '#yard' },
  { code: '01', label: 'The Inmate', href: '#about' },
  { code: '02', label: 'Charges', href: '#services' },
  { code: '03', label: 'Evidence', href: '#work' },
  { code: '04', label: 'Visiting Hours', href: '#contact' },
];

export function FileNav() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#yard');
  const root = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

  // таймлайн раскрытия строим один раз
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const rows = panel.querySelectorAll('[data-row]');
      gsap.set(panel, {
        autoAlpha: 0,
        y: -10,
        scale: 0.97,
        transformOrigin: 'top center',
      });
      tlRef.current = gsap
        .timeline({ paused: true })
        .to(panel, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.34,
          ease: 'power3.out',
        })
        .from(
          rows,
          {
            autoAlpha: 0,
            y: 10,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out',
          },
          '-=0.2',
        );
    },
    { scope: root },
  );

  // плавное открытие/закрытие по состоянию
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open]);

  // scroll-spy: активная секция = та, что пересекает центр вьюпорта.
  // Тонкий центр-бэнд через rootMargin; работает и в пинах (секция держится
  // в центре весь пин). jsdom не знает IntersectionObserver — guard.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = SECTIONS.map((s) =>
      document.getElementById(s.href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActiveHref(`#${hit.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Esc + клик-вне закрывают
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, []);

  return (
    <div ref={root} className="fixed top-3 left-1/2 z-50 -translate-x-1/2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close directory' : 'Open directory'}
        className="flex min-h-[44px] items-center gap-3 rounded-full border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] text-[var(--color-bone)] uppercase backdrop-blur transition-colors hover:border-[var(--color-orange)] focus-visible:border-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
      >
        <span className="text-[var(--color-orange)]">●</span>
        <span>VB-19</span>
        <span className="relative inline-flex h-3 w-4 items-center justify-center text-[var(--color-dim)]">
          <span
            className={`absolute leading-none transition-all duration-300 ${
              open ? 'scale-50 rotate-90 opacity-0' : 'opacity-100'
            }`}
          >
            •••
          </span>
          <span
            className={`absolute text-[15px] leading-none transition-all duration-300 ${
              open ? 'opacity-100' : 'scale-50 -rotate-90 opacity-0'
            }`}
          >
            ×
          </span>
        </span>
      </button>

      <nav
        ref={panelRef}
        aria-hidden={!open}
        className="grain invisible absolute top-[calc(100%+8px)] left-1/2 w-[230px] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] p-2 backdrop-blur"
      >
        <p className="px-3 py-2 text-[10px] tracking-[0.2em] text-[var(--color-dim)] uppercase">
          Cell-block directory
        </p>
        {SECTIONS.map((s) => {
          const isActive = activeHref === s.href;
          return (
            <a
              key={s.code}
              data-row
              href={s.href}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={`group flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] tracking-[0.06em] uppercase transition-colors hover:bg-[var(--color-orange-soft)] hover:text-[var(--color-bone)] focus-visible:bg-[var(--color-orange-soft)] focus-visible:text-[var(--color-bone)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-orange)] ${
                isActive
                  ? 'bg-[var(--color-orange-soft)] text-[var(--color-bone)]'
                  : 'text-[var(--color-steel)]'
              }`}
            >
              <span
                className={`text-[11px] group-hover:text-[var(--color-orange)] ${
                  isActive
                    ? 'text-[var(--color-orange)]'
                    : 'text-[var(--color-dim)]'
                }`}
              >
                {s.code}
              </span>
              <span>{s.label}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="ml-auto text-[var(--color-orange)]"
                >
                  ●
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
