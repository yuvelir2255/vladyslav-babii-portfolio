'use client';

import { useRef } from 'react';

export function RedactedField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const open = el.dataset.open === 'true';
    el.dataset.open = String(!open);
    el.setAttribute('aria-expanded', String(!open));
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
      className="block w-full text-left"
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
      </span>
    </button>
  );
}
