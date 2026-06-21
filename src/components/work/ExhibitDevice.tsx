'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { evidence } from '@/content/evidence';

export function ExhibitDevice() {
  const { code, shots } = evidence.exhibit;
  const len = shots.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % len), 2800);
    return () => clearInterval(id);
  }, [paused, len]);

  const next = () => setI((p) => (p + 1) % len);

  return (
    <div
      className="relative mx-auto w-[min(280px,72vw)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div data-device className="relative">
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
        <div className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 -rotate-3 items-center gap-2 rounded-[3px] border border-[var(--color-line)] bg-[rgba(16,15,13,0.9)] px-2.5 py-1">
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
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-orange)] uppercase">
            {code}
          </span>
        </div>

        {/* телефон */}
        <div className="relative rounded-[30px] border border-[var(--color-line)] bg-[#1a1815] p-[8px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[1290/2422] overflow-hidden rounded-[22px] bg-[#0d0c0a]">
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

            {/* подпись текущего кадра */}
            <span className="absolute bottom-2 left-2 z-10 rounded-[3px] bg-[rgba(16,15,13,0.7)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-bone)] uppercase">
              {shots[i].label}
            </span>

            {/* тап по экрану листает */}
            <button
              type="button"
              onClick={next}
              aria-label="Next screenshot"
              className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-orange)]"
            />
          </div>
        </div>

        {/* штамп ADMITTED — слэмнут на нижний угол телефона */}
        <span data-admitted aria-hidden="true" className="stamp-admitted">
          Admitted
        </span>
      </div>

      {/* точки-индикаторы */}
      <div className="mt-4 flex items-center justify-center gap-1">
        {shots.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.label}`}
            aria-current={idx === i ? 'true' : undefined}
            onClick={() => setI(idx)}
            className="inline-flex h-[44px] w-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[var(--color-orange)]"
          >
            <span
              className={`block h-2 w-2 rounded-full transition-colors ${
                idx === i
                  ? 'bg-[var(--color-orange)]'
                  : 'bg-[var(--color-line)]'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
