import { services } from '@/content/services';
import { CountCard } from './CountCard';
import { CaseRail } from './CaseRail';
import { Verdict } from './Verdict';
import { ChargesMotion } from './ChargesMotion';

export function Services() {
  return (
    <section
      id="services"
      className="relative min-h-screen overflow-hidden px-14 max-md:px-6"
    >
      <ChargesMotion>
        <div
          data-charges-stage
          className="relative mx-auto flex min-h-screen w-full max-w-[1200px] flex-col justify-center py-20"
        >
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

          {/* горизонтальная лента карточек (двигается по скроллу) */}
          <div data-track-viewport className="relative">
            <ol
              data-charges-track
              className="flex items-stretch gap-8 will-change-transform max-md:gap-5"
            >
              {services.counts.map((c) => (
                <CountCard key={c.n} count={c} total={services.counts.length} />
              ))}
            </ol>
          </div>

          <Verdict />
          <CaseRail />
        </div>
      </ChargesMotion>
    </section>
  );
}
