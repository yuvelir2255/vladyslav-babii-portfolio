import { services } from '@/content/services';

type Count = (typeof services.counts)[number];

export function CountCard({
  count,
  total,
}: {
  count: { n: string; charge: string; gloss: string; plea: string };
  total: number;
}) {
  return (
    <li
      data-count
      className="relative flex flex-col justify-center max-lg:min-h-[78vh]"
    >
      <span className="mb-3 inline-flex items-center gap-3 text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
        <span aria-hidden="true">Count</span>
        <span className="text-[var(--color-orange)] lg:hidden">
          {count.n} / {String(total).padStart(2, '0')}
        </span>
      </span>

      <div className="flex items-start gap-6 max-md:flex-col max-md:gap-3">
        <span
          data-count-num
          aria-hidden="true"
          className="font-[family-name:var(--font-display)] text-[clamp(64px,12vw,150px)] leading-[0.85] text-[var(--color-orange)]"
        >
          {count.n}
        </span>

        <div className="pt-2">
          <h3
            data-count-charge
            className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(28px,4vw,46px)] leading-[1.02] tracking-[0.01em] text-[var(--color-bone)] uppercase"
          >
            {count.charge}
          </h3>
          <p
            data-count-gloss
            className="mt-4 max-w-[42ch] text-[14px] leading-[1.6] text-[var(--color-steel)]"
          >
            {count.gloss}
          </p>
        </div>
      </div>

      <span
        data-count-stamp
        aria-hidden="true"
        className="relative mt-6 inline-flex w-fit items-center justify-center"
      >
        <svg
          viewBox="0 0 168 56"
          className="h-[52px] w-[156px]"
          fill="none"
          aria-hidden="true"
        >
          <rect
            data-stamp-draw
            x="3"
            y="3"
            width="162"
            height="50"
            rx="6"
            stroke="var(--color-orange)"
            strokeWidth="3"
          />
        </svg>
        <span className="absolute font-[family-name:var(--font-stencil)] text-[22px] tracking-[0.08em] text-[var(--color-orange)] uppercase">
          {count.plea}
        </span>
      </span>
    </li>
  );
}

export type { Count };
