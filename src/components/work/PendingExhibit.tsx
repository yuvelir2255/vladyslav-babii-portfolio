import { evidence } from '@/content/evidence';

// EVID-02 — «слот под улику, ещё не приобщённую»: пунктирная рамка, штамп
// PENDING (рифма с ADMITTED на EVID-01), скан-луч и пульсирующий статус.
export function PendingExhibit() {
  const { pending } = evidence;
  return (
    <div className="mt-14 border-t border-[var(--color-line)] pt-10 max-md:mt-10 max-md:pt-8">
      <div
        data-custody-row
        className="pending-slot group relative overflow-hidden rounded-xl border border-dashed border-[color-mix(in_srgb,var(--color-steel)_36%,transparent)] px-9 py-10 transition-colors hover:border-[var(--color-steel)] max-md:px-5 max-md:py-7"
      >
        <span aria-hidden="true" className="pending-scan" />
        <span
          aria-hidden="true"
          className="pending-corner pending-corner--tl"
        />
        <span
          aria-hidden="true"
          className="pending-corner pending-corner--tr"
        />
        <span
          aria-hidden="true"
          className="pending-corner pending-corner--bl"
        />
        <span
          aria-hidden="true"
          className="pending-corner pending-corner--br"
        />

        <div className="relative flex items-center justify-between gap-8 max-sm:flex-col max-sm:items-start max-sm:gap-5">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] text-[var(--color-steel)] uppercase">
              Next exhibit
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(28px,3.6vw,44px)] leading-[1.04] tracking-[0.01em] text-[var(--color-bone)] uppercase">
              {pending.title}
            </h3>
            <p className="mt-3 inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.16em] text-[var(--color-dim)] uppercase">
              <span className="pending-dot" aria-hidden="true" />
              {pending.code} · {pending.status}
            </p>
          </div>

          <span aria-hidden="true" className="stamp-pending">
            Pending
          </span>
        </div>
      </div>
    </div>
  );
}
