'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';

export function RedactedField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const revealedOnce = useRef(false);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const open = el.dataset.open === 'true';
    el.dataset.open = String(!open);
    el.setAttribute('aria-expanded', String(!open));

    // первый раз раскрыли — «рассекречивание» с разовым scramble
    if (!open && !revealedOnce.current) {
      revealedOnce.current = true;
      const valueEl = el.querySelector<HTMLElement>('[data-redacted-value]');
      if (valueEl) {
        try {
          gsap.to(valueEl, {
            duration: 0.7,
            scrambleText: {
              text: value,
              chars: 'upperAndLowerCase',
              revealDelay: 0.15,
            },
          });
        } catch {
          // моушн — прогрессивное улучшение; текст уже в DOM
        }
      }
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      data-redacted
      data-open="false"
      aria-expanded="false"
      aria-label={`Declassify ${label}`}
      onClick={toggle}
      className="flex min-h-[44px] w-full cursor-pointer flex-col justify-center text-left"
    >
      <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
        {label}
      </span>
      <span className="redacted-wrap mt-1 block">
        <span
          data-redacted-value
          className="block text-[13px] leading-[1.5] text-[var(--color-bone)]"
        >
          {value}
        </span>
        <span data-redaction-bar className="redaction-bar" aria-hidden="true" />
        <span className="redaction-hint" aria-hidden="true">
          <span aria-hidden="true">▸</span> declassify
        </span>
      </span>
    </button>
  );
}
