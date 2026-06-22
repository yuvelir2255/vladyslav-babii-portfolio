import { contact } from '@/content/contact';
import { RollText } from '@/components/ui/RollText';

export function ContactChannels() {
  return (
    <div data-channels className="flex flex-col gap-3">
      <p className="mb-1 text-[11px] tracking-[0.25em] text-[var(--color-dim)] uppercase">
        Directory
      </p>
      <ul className="flex flex-col gap-2">
        {contact.channels.map((ch) => (
          <li key={ch.label} className="flex items-baseline gap-3">
            <span className="w-[78px] flex-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-dim)] uppercase">
              {ch.label}
            </span>
            <a
              href={ch.href}
              aria-label={`${ch.label}: ${ch.value}`}
              {...(ch.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="group inline-flex min-h-[44px] items-center text-[14px] tracking-[0.01em] text-[var(--color-bone)] transition-colors hover:text-[var(--color-orange)] focus-visible:text-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
            >
              <RollText>
                {ch.value}
                {ch.external && <span aria-hidden="true">↗</span>}
              </RollText>
            </a>
          </li>
        ))}
        <li className="flex items-baseline gap-3">
          <span className="w-[78px] flex-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-dim)] uppercase">
            Held at
          </span>
          <span className="text-[14px] text-[var(--color-steel)]">
            {contact.location}
          </span>
        </li>
      </ul>
    </div>
  );
}
