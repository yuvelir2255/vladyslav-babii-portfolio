import { evidence } from '@/content/evidence';

export function EvidenceMarkers() {
  return (
    <ol className="mt-8 flex flex-col gap-5">
      {evidence.exhibit.markers.map((m) => (
        <li data-marker key={m.n} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="relative mt-1 inline-flex h-7 w-7 flex-none items-center justify-center"
          >
            <svg viewBox="0 0 28 28" className="absolute inset-0 h-7 w-7">
              <path d="M2 22 L14 4 L26 22 Z" fill="var(--color-orange)" />
            </svg>
            <span
              data-marker-num
              className="relative font-[family-name:var(--font-mono)] text-[11px] font-bold text-[var(--color-bg)]"
            >
              {m.n}
            </span>
          </span>
          <span className="flex flex-col">
            <span
              data-marker-label
              className="text-[15px] tracking-[0.01em] text-[var(--color-bone)]"
            >
              {m.title}
            </span>
            <span className="mt-0.5 text-[12px] tracking-[0.04em] text-[var(--color-dim)]">
              {m.note}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
