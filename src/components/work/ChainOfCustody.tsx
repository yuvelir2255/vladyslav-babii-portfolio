import { evidence } from '@/content/evidence';

export function ChainOfCustody() {
  const { exhibit, pending } = evidence;
  return (
    <div className="mt-14 border-t border-[var(--color-line)] pt-6 max-md:mt-10">
      <p className="mb-4 text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
        Chain of custody
      </p>
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {exhibit.links.map((l) => (
          <li data-custody-row key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 text-[14px] tracking-[0.02em] text-[var(--color-bone)] underline-offset-4 transition-colors hover:text-[var(--color-orange)] hover:underline focus-visible:text-[var(--color-orange)] focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
            >
              {l.label}
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
        <li
          data-custody-row
          className="inline-flex min-h-[44px] items-center gap-2 text-[13px] text-[var(--color-steel)]"
        >
          <span className="inline-flex items-center rounded border border-[var(--color-line)] px-2 py-[2px] text-[10px] tracking-[0.12em] text-[var(--color-dim)] uppercase">
            {pending.code} · {pending.status}
          </span>
          <span>{pending.title}</span>
        </li>
      </ul>
    </div>
  );
}
