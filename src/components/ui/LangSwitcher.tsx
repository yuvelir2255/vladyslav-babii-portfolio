'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const LOCALES = ['en', 'uk'] as const;

/**
 * EN / UK toggle. Keeps the current path and swaps the locale segment.
 */
export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Language"
      className="-my-2 flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase"
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={l}
            aria-current={l === locale ? 'true' : undefined}
            className={`inline-flex py-2 ${
              l === locale
                ? 'text-fg'
                : 'text-faint hover:text-dim transition-colors'
            }`}
          >
            {l}
          </Link>
          {i === 0 && (
            <span aria-hidden className="text-faint">
              /
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
