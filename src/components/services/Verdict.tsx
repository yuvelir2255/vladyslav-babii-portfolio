import { services } from '@/content/services';

export function Verdict() {
  const v = services.verdict;
  return (
    <div
      data-verdict
      className="absolute inset-0 isolate flex flex-col items-center justify-center px-6 text-center"
    >
      <div
        data-verdict-glow
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[44vh] w-[60vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--color-orange) 24%, transparent), transparent)',
        }}
      />
      <p
        data-verdict-eyebrow
        className="text-[12px] tracking-[0.2em] text-[var(--color-steel)] uppercase"
      >
        {v.eyebrow}
      </p>
      <h3
        data-verdict-headline
        className="mt-3 font-[family-name:var(--font-display)] text-[clamp(44px,9vw,120px)] leading-[1.02] text-[var(--color-orange)] uppercase"
      >
        {v.headline}
      </h3>
      <p className="mt-5 text-[11px] tracking-[0.3em] text-[var(--color-dim)] uppercase">
        — {v.sentenceLabel} —
      </p>
      <p className="mx-auto mt-2 max-w-[36ch] text-[clamp(16px,2.2vw,22px)] leading-[1.4] text-[var(--color-bone)]">
        {v.sentence}
      </p>
    </div>
  );
}
