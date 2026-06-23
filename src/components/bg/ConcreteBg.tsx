import { ShaderBg } from './ShaderBg';
import { BgMood } from './BgMood';

export function ConcreteBg() {
  return (
    <div
      id="concrete-bg"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,var(--color-surface)_0%,var(--color-bg)_60%)]"
    >
      <ShaderBg />
      <div className="bg-dome" />
      <div className="mood-steel" />
      <div className="mood-warm" />
      <div className="mood-day" />
      <div className="grain bars absolute inset-0 z-[2]" />
      <div className="bg-vignette" />
      <BgMood />
    </div>
  );
}
