import { hero } from '@/content/hero';

export function Ticker() {
  // собираем строку целиком в выражении, чтобы '//' не читался как JSX-комментарий
  const segment = `●  ${hero.ticker.join('  //  ')}  //  `;
  return (
    <div
      className="relative z-[2] overflow-hidden border-b border-[var(--color-line)] py-[0.7rem] text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-steel)] uppercase"
      aria-hidden="true"
    >
      <span className="inline-block animate-[ticker-slide_22s_linear_infinite]">
        <span className="px-2">{segment}</span>
        <span className="px-2">{segment}</span>
      </span>
    </div>
  );
}
