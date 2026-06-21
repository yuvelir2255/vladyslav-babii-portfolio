import { evidence } from '@/content/evidence';
import { ExhibitDevice } from './ExhibitDevice';
import { EvidenceMarkers } from './EvidenceMarkers';
import { ChainOfCustody } from './ChainOfCustody';
import { EvidenceMotion } from './EvidenceMotion';

export function Evidence() {
  const { eyebrow, intro, exhibit } = evidence;
  return (
    <section
      id="work"
      className="relative px-14 py-24 max-md:px-6 max-md:py-16"
    >
      <EvidenceMotion>
        <div className="relative mx-auto w-full max-w-[1100px]">
          <header className="mb-12 max-md:mb-8">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {eyebrow}
            </p>
            <h2 className="mt-4 max-w-[24ch] text-[clamp(20px,3vw,32px)] leading-[1.15] text-[var(--color-steel)]">
              {intro}
            </h2>
          </header>

          <div className="flex items-start gap-12 max-lg:flex-col max-lg:items-center max-lg:gap-10">
            <div className="flex-[0.9] max-lg:w-full">
              <ExhibitDevice />
            </div>

            <div className="flex-[1.1] max-lg:w-full">
              <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[var(--color-dim)] uppercase">
                {exhibit.code} · {exhibit.status}
              </p>
              <h3
                data-exhibit-title
                className="mt-3 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] leading-[1.04] tracking-[0.01em] text-[var(--color-bone)] uppercase"
              >
                {exhibit.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-[var(--color-steel)]">
                {exhibit.summary}
              </p>

              <EvidenceMarkers />

              <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
                {exhibit.facts.map((f) => (
                  <li
                    data-fact
                    key={f}
                    className="inline-flex items-center rounded-full border border-[var(--color-line)] px-3 py-1 text-[11px] tracking-[0.08em] text-[var(--color-steel)] uppercase"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[12px] tracking-[0.04em] text-[var(--color-dim)]">
                {exhibit.tags.join(' · ')}
              </p>
            </div>
          </div>

          <ChainOfCustody />
        </div>
      </EvidenceMotion>
    </section>
  );
}
