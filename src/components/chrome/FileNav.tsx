'use client';

import { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { code: '00', label: 'The Yard', href: '#yard' },
  { code: '01', label: 'The Inmate', href: '#about' },
  { code: '02', label: 'Charges', href: '#services' },
  { code: '03', label: 'Evidence', href: '#work' },
  { code: '04', label: 'Visiting Hours', href: '#contact' },
];

export function FileNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
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
    <div ref={ref} className="fixed top-3 left-1/2 z-50 -translate-x-1/2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close directory' : 'Open directory'}
        className="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-[rgba(16,15,13,0.72)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] text-[var(--color-bone)] uppercase backdrop-blur transition-colors hover:border-[var(--color-orange)]"
      >
        <span className="text-[var(--color-orange)]">●</span>
        <span>VB-19</span>
        <span className="text-[var(--color-dim)]">{open ? '×' : '•••'}</span>
      </button>

      {open && (
        <nav className="grain absolute top-[calc(100%+8px)] left-1/2 w-[230px] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[rgba(16,15,13,0.92)] p-2 backdrop-blur">
          <p className="px-3 py-2 text-[10px] tracking-[0.2em] text-[var(--color-dim)] uppercase">
            Cell-block directory
          </p>
          {SECTIONS.map((s) => (
            <a
              key={s.code}
              href={s.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] tracking-[0.06em] text-[var(--color-steel)] uppercase transition-colors hover:bg-[rgba(255,90,30,0.12)] hover:text-[var(--color-bone)]"
            >
              <span className="text-[11px] text-[var(--color-dim)] group-hover:text-[var(--color-orange)]">
                {s.code}
              </span>
              <span>{s.label}</span>
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
