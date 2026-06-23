'use client';

import Image from 'next/image';
import { useState } from 'react';
import { evidence } from '@/content/evidence';

export function ExhibitDevice() {
  const { code, shots } = evidence.exhibit;
  const len = shots.length;
  const [i, setI] = useState(0);

  const prev = () => setI((p) => (p - 1 + len) % len);
  const next = () => setI((p) => (p + 1) % len);

  const arrowCls =
    'inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[var(--color-steel)] transition-colors hover:text-[var(--color-orange)] focus-visible:text-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[var(--color-orange)]';

  return (
    <div className="relative mx-auto w-[min(280px,72vw)]">
      <div data-device className="ev-device relative">
        {/* пакет для улик */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -inset-[7%] h-[114%] w-[114%]"
        >
          <rect
            data-bag-draw
            x="2"
            y="2"
            width="96"
            height="96"
            rx="3"
            fill="none"
            stroke="var(--color-steel)"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </svg>

        {/* бирка chain-of-custody */}
        <div className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 -rotate-3 items-center gap-2 rounded-[3px] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-bg)_90%,transparent)] px-2.5 py-1">
          <svg aria-hidden="true" viewBox="0 0 30 12" className="h-3 w-[30px]">
            <g fill="var(--color-steel)">
              <rect x="0" y="0" width="2" height="12" />
              <rect x="4" y="0" width="1" height="12" />
              <rect x="7" y="0" width="3" height="12" />
              <rect x="12" y="0" width="1" height="12" />
              <rect x="15" y="0" width="2" height="12" />
              <rect x="19" y="0" width="1" height="12" />
              <rect x="22" y="0" width="3" height="12" />
              <rect x="27" y="0" width="1" height="12" />
            </g>
          </svg>
          <span
            data-ev-tag
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-orange)] uppercase"
          >
            {code}
          </span>
        </div>

        {/* телефон */}
        <div className="ev-phone relative rounded-[30px] border border-[var(--color-line)] bg-[#1a1815] p-[8px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[1290/2422] overflow-hidden rounded-[22px] bg-[#0d0c0a]">
            <div data-ev-zoom className="absolute inset-0">
              {shots.map((s, idx) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="280px"
                  priority={idx === 0}
                  className={`object-cover transition-opacity duration-700 ${
                    idx === i ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* скан-линия forensic-inspect */}
            <span aria-hidden="true" className="ev-scan" />

            {/* подпись текущего кадра */}
            <span className="absolute bottom-2 left-2 z-10 rounded-[3px] bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-bone)] uppercase">
              {shots[i].label}
            </span>
          </div>
        </div>

        {/* штамп ADMITTED — слэмнут на нижний угол телефона */}
        <span data-admitted aria-hidden="true" className="stamp-admitted">
          Admitted
        </span>
      </div>

      {/* ручное управление: стрелки ◀ ▶ + точки-индикаторы (без автоплея) */}
      <div className="mt-4 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous screenshot"
          className={arrowCls}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {shots.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.label}`}
            aria-current={idx === i ? 'true' : undefined}
            onClick={() => setI(idx)}
            className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[var(--color-orange)]"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                idx === i
                  ? 'w-4 bg-[var(--color-orange)]'
                  : 'w-2 bg-[var(--color-line)]'
              }`}
            />
          </button>
        ))}

        <button
          type="button"
          onClick={next}
          aria-label="Next screenshot"
          className={arrowCls}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
