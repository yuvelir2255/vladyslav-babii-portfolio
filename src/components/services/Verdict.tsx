import { services } from '@/content/services';

export function Verdict() {
  const v = services.verdict;
  return (
    <div data-verdict className="mt-24 text-center max-md:mt-16">
      <p className="text-[12px] tracking-[0.2em] text-[var(--color-steel)] uppercase">
        {v.eyebrow}
      </p>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(44px,9vw,120px)] leading-[0.9] text-[var(--color-orange)] uppercase">
        {v.headline}
      </h3>
      <p className="mt-6 text-[11px] tracking-[0.3em] text-[var(--color-dim)] uppercase">
        — {v.sentenceLabel} —
      </p>
      <p className="mx-auto mt-3 max-w-[36ch] text-[clamp(16px,2.2vw,22px)] leading-[1.4] text-[var(--color-bone)]">
        {v.sentence}
      </p>
    </div>
  );
}
