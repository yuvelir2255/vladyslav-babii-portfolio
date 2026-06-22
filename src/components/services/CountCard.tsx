import { services } from '@/content/services';

type Count = (typeof services.counts)[number];

// Карта-обвинение «charge sheet»: стальная карта с кроп-марками, chain-of-custody
// штрих-кодом, гигантским номером, заголовком/глоссом и слэм-штампом GUILTY.
export function CountCard({
  count,
  total,
}: {
  count: { n: string; charge: string; gloss: string; plea: string };
  total: number;
}) {
  const totalPad = String(total).padStart(2, '0');
  return (
    <li
      data-count
      className="charge-card group/card relative flex flex-none flex-col"
    >
      <span aria-hidden="true" className="charge-corner charge-corner--tl" />
      <span aria-hidden="true" className="charge-corner charge-corner--tr" />
      <span aria-hidden="true" className="charge-corner charge-corner--bl" />
      <span aria-hidden="true" className="charge-corner charge-corner--br" />

      {/* chain-of-custody — верхняя кромка */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-7 py-3.5 max-md:px-5 max-md:py-3">
        <svg aria-hidden="true" viewBox="0 0 60 12" className="h-3 w-[60px]">
          <g fill="var(--color-steel)">
            <rect x="0" y="0" width="2" height="12" />
            <rect x="4" y="0" width="1" height="12" />
            <rect x="7" y="0" width="3" height="12" />
            <rect x="12" y="0" width="1" height="12" />
            <rect x="15" y="0" width="2" height="12" />
            <rect x="19" y="0" width="1" height="12" />
            <rect x="22" y="0" width="3" height="12" />
            <rect x="27" y="0" width="1" height="12" />
            <rect x="31" y="0" width="2" height="12" />
            <rect x="35" y="0" width="1" height="12" />
            <rect x="38" y="0" width="3" height="12" />
            <rect x="43" y="0" width="1" height="12" />
            <rect x="46" y="0" width="2" height="12" />
            <rect x="50" y="0" width="1" height="12" />
            <rect x="53" y="0" width="3" height="12" />
            <rect x="58" y="0" width="1" height="12" />
          </g>
        </svg>
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-dim)] uppercase">
          Count {count.n} / {totalPad} · Case VB-19
        </span>
      </div>

      {/* тело */}
      <div className="flex flex-1 items-start gap-7 px-7 pt-8 max-md:flex-col max-md:gap-2 max-md:px-5 max-md:pt-6">
        <span
          data-count-num
          aria-hidden="true"
          className="font-[family-name:var(--font-display)] text-[clamp(72px,9vw,140px)] leading-[0.82] text-[var(--color-orange)]"
        >
          {count.n}
        </span>
        <div className="pt-1.5 max-md:pt-0">
          <span className="mb-2 block text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
            Count
          </span>
          <h3
            data-count-charge
            className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(26px,3.2vw,42px)] leading-[1.02] tracking-[0.01em] text-[var(--color-bone)] uppercase"
          >
            {count.charge}
          </h3>
          <p
            data-count-gloss
            className="mt-4 max-w-[40ch] text-[14px] leading-[1.6] text-[var(--color-steel)] max-md:mt-3"
          >
            {count.gloss}
          </p>
        </div>
      </div>

      {/* подвал дела: штамп GUILTY (в потоке — не перекрывает текст) */}
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--color-line)] px-7 py-4 max-md:px-5 max-md:py-3">
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-dim)] uppercase">
          Plea entered
        </span>
        <span
          data-count-stamp
          aria-hidden="true"
          className="inline-flex items-center justify-center"
        >
          <svg
            viewBox="0 0 168 56"
            className="h-[44px] w-[132px]"
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
          <span className="absolute font-[family-name:var(--font-stencil)] text-[19px] tracking-[0.08em] text-[var(--color-orange)] uppercase">
            {count.plea}
          </span>
        </span>
      </div>

      <span aria-hidden="true" className="charge-scan" />
    </li>
  );
}

export type { Count };
