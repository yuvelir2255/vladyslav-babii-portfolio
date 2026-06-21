import { services } from '@/content/services';
import { CountCard } from './CountCard';
import { CaseRail } from './CaseRail';
import { Verdict } from './Verdict';
import { ChargesMotion } from './ChargesMotion';

export function Services() {
  return (
    <section
      id="services"
      className="relative px-14 py-24 max-md:px-6 max-md:py-16 lg:min-h-screen lg:py-0"
    >
      <ChargesMotion>
        <div className="mx-auto flex w-full max-w-[1100px] flex-col lg:min-h-screen lg:justify-center">
          <header data-charges-header className="mb-12 max-md:mb-8">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {services.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[20ch] text-[clamp(20px,3vw,32px)] leading-[1.15] text-[var(--color-steel)]">
              {services.intro}
            </h2>
          </header>

          <div className="relative lg:h-[60vh]">
            <ol data-charges-list className="lg:contents">
              {services.counts.map((c) => (
                <CountCard key={c.n} count={c} total={services.counts.length} />
              ))}
            </ol>
            <CaseRail />
          </div>

          <Verdict />
        </div>
      </ChargesMotion>
    </section>
  );
}
