import { evidence } from '@/content/evidence';
import { RollText } from '@/components/ui/RollText';

// Ссылки живого экспоната EVID-01 (TG-апп + веб-демо) — рядом с экспонатом.
export function ExhibitLinks() {
  const { links } = evidence.exhibit;
  return (
    <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
      {links.map((l) => (
        <li data-custody-row key={l.href}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[44px] items-center text-[14px] tracking-[0.02em] text-[var(--color-bone)] transition-colors hover:text-[var(--color-orange)] focus-visible:text-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
          >
            <RollText>
              {l.label}
              <span aria-hidden="true">↗</span>
            </RollText>
          </a>
        </li>
      ))}
    </ul>
  );
}
