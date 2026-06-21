const barGrad =
  'repeating-linear-gradient(90deg, transparent 0 30px, rgba(0,0,0,0.55) 30px 36px, rgba(120,116,108,0.25) 36px 38px)';

export function Bars() {
  return (
    <div
      data-bars
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* дневной свет за прутьями — мягкий центральный шафт (feathered + blur),
          читается как луч, а не панель; скрыт до релиза */}
      <div
        data-daylight
        className="absolute inset-y-0 left-1/2 w-[56%] -translate-x-1/2 opacity-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(216,162,74,0.55) 28%, rgba(247,212,138,0.92) 50%, rgba(216,162,74,0.55) 72%, transparent 100%)',
          filter: 'blur(10px)',
        }}
      />
      {/* левая половина решётки */}
      <div
        data-bars-left
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ backgroundImage: barGrad }}
      />
      {/* правая половина решётки */}
      <div
        data-bars-right
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ backgroundImage: barGrad }}
      />
      {/* плашка-замок */}
      <div
        data-lockplate
        className="absolute top-5 left-1/2 -translate-x-1/2 rounded-[3px] border border-[var(--color-line)] bg-[rgba(16,15,13,0.9)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-orange)] uppercase"
      >
        ● Visiting Hours
      </div>
    </div>
  );
}
