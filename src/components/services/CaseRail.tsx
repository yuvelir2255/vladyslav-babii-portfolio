import { services } from '@/content/services';

export function CaseRail() {
  const counts = services.counts;
  const total = String(counts.length).padStart(2, '0');
  return (
    <aside
      data-rail
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[7vh] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 max-md:bottom-[5vh] max-md:gap-2"
    >
      <div className="flex items-center gap-5 max-md:gap-3">
        <span
          data-rail-tally
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em] text-[var(--color-orange)]"
        >
          Guilty ×0
        </span>
        <ol className="flex items-center gap-3 max-md:gap-2">
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
        <span
          data-rail-count
          className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] text-[var(--color-dim)]"
        >
          01 / {total}
        </span>
      </div>
      <div className="h-[3px] w-[280px] bg-[#2a2620] max-md:w-[180px]">
        <div
          data-rail-progress
          className="h-full w-full origin-left scale-x-[0.2] bg-[var(--color-orange)]"
        />
      </div>
    </aside>
  );
}
