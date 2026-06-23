// «Дверь камеры» (вертикальные прутья) убрана по просьбе владельца.
// Остаётся тёплый дневной «bloom», который расцветает при удачной отправке
// формы (событие vb:released, см. ReleaseMotion) — метафора «выход на свет».
export function ReleaseGlow() {
  return (
    <div
      data-release-fx
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        data-daylight
        className="absolute inset-0 opacity-0"
        style={{
          background:
            'radial-gradient(120% 85% at 50% 72%, rgba(247,212,138,0.5) 0%, rgba(216,162,74,0.22) 42%, transparent 72%)',
        }}
      />
    </div>
  );
}
