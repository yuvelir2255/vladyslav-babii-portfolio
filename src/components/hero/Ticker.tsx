import { hero } from '@/content/hero';

export function Ticker() {
  // собираем строку целиком в выражении, чтобы '//' не читался как JSX-комментарий
  const segment = `●  ${hero.ticker.join('  //  ')}  //  `;
  // повторяем сегмент, чтобы одна «половина» была заведомо шире любого экрана —
  // тогда петля translateX(-50%) бесшовная, без пустых промежутков на широких ПК.
  // длительность 88s держит прежнюю скорость (~55px/с) при большей ширине.
  const half = segment.repeat(4);
  return (
    <div
      className="relative z-[2] overflow-hidden border-b border-[var(--color-line)] py-[0.7rem] text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-steel)] uppercase"
      aria-hidden="true"
    >
      <span className="inline-block animate-[ticker-slide_88s_linear_infinite]">
        <span>{half}</span>
        <span>{half}</span>
      </span>
    </div>
  );
}
