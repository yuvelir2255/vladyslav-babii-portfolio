import { ShaderBg } from './ShaderBg';

export function ConcreteBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,var(--color-surface)_0%,var(--color-bg)_60%)]"
    >
      <ShaderBg />
      <div className="grain bars absolute inset-0" />
    </div>
  );
}
