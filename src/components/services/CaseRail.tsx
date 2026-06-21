import { services } from '@/content/services';

export function CaseRail() {
  const counts = services.counts;
  const total = String(counts.length).padStart(2, '0');
  return (
    <aside
      data-rail
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      <span
        data-rail-tally
        className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em] text-[var(--color-orange)]"
      >
        Guilty ×0
      </span>
      <ol className="flex flex-col items-end gap-2">
        {counts.map((c, i) => (
          <li
            key={c.n}
            data-rail-item={i}
            className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-dim)] transition-colors"
          >
            {c.n}
          </li>
        ))}
      </ol>
      <span className="mt-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--color-dim)] uppercase">
        Sentence
      </span>
      <div className="mt-2 h-[3px] w-[120px] bg-[#2a2620]">
        <div
          data-rail-progress
          className="h-full w-full origin-left scale-x-[0.2] bg-[var(--color-orange)]"
        />
      </div>
      <span
        data-rail-count
        className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] text-[var(--color-dim)]"
      >
        01 / {total}
      </span>
    </aside>
  );
}
