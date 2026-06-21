import { services } from '@/content/services';
import { CountCard } from './CountCard';
import { CaseRail } from './CaseRail';
import { Verdict } from './Verdict';
import { ChargesMotion } from './ChargesMotion';

export function Services() {
  return (
    <section id="services" className="relative min-h-screen px-14 max-md:px-6">
      <ChargesMotion>
        <div className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col justify-center py-20">
          <header data-charges-header className="mb-10 max-md:mb-6">
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

          <div className="relative h-[58vh] min-h-[440px]">
            <ol data-charges-list>
              {services.counts.map((c) => (
                <CountCard key={c.n} count={c} total={services.counts.length} />
              ))}
            </ol>
            <Verdict />
            <CaseRail />
          </div>
        </div>
      </ChargesMotion>
    </section>
  );
}
