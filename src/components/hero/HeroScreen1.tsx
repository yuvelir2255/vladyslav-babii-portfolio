import { hero } from '@/content/hero';
import { Ticker } from './Ticker';
import { BookingPhoto } from './BookingPhoto';
import { HeroNameMotion } from './HeroNameMotion';
import { RollText } from '@/components/ui/RollText';

export function HeroScreen1() {
  return (
    <section id="yard" className="relative flex min-h-[100svh] flex-col pt-16">
      <Ticker />
      <div className="relative z-[2] flex flex-1 items-center gap-12 px-14 py-8 max-lg:flex-col max-lg:gap-8 max-lg:px-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2 hidden -translate-y-1/2 rotate-180 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--color-dim)] uppercase [writing-mode:vertical-rl] lg:block"
        >
          {hero.sideLabel}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 left-2 hidden h-4 w-4 border-t-2 border-l-2 border-[var(--color-orange)] lg:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 right-2 hidden h-4 w-4 border-t-2 border-r-2 border-[var(--color-orange)] lg:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-2 hidden h-4 w-4 border-b-2 border-l-2 border-[var(--color-orange)] lg:block"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 bottom-2 hidden h-4 w-4 border-r-2 border-b-2 border-[var(--color-orange)] lg:block"
        />
        <HeroNameMotion className="flex-[1.1]">
          <p className="text-[12px] tracking-[0.1em] text-[var(--color-orange)] uppercase">
            {hero.meta}
          </p>
          <h1
            data-hero-name
            aria-label={hero.name.join(' ')}
            className="my-[1.1rem] font-[family-name:var(--font-display)] text-[clamp(58px,7.6vw,104px)] leading-[1.04] tracking-[0.015em] uppercase"
          >
            {hero.name.map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </h1>
          <p className="text-[13px] leading-[1.7] font-semibold tracking-[0.06em] uppercase">
            {hero.role}
          </p>
          <dl className="mt-7 hidden gap-x-8 gap-y-1 border-t border-[var(--color-line)] pt-4 lg:flex">
            {hero.rapSheet.map((row, i) => (
              <div key={row.label} className={i === 2 ? 'hidden xl:block' : ''}>
                <dt className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--color-dim)] uppercase">
                  {row.label}
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[var(--color-bone)] uppercase">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={hero.cta[0].href}
              data-magnetic
              className="group rounded bg-[var(--color-orange)] px-[1.4rem] py-[0.9rem] text-[12px] font-bold tracking-[0.05em] text-[var(--color-on-orange)] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-bone)]"
            >
              <RollText>
                {hero.cta[0].label}
                <span aria-hidden="true">↗</span>
              </RollText>
            </a>
            <a
              href={hero.cta[1].href}
              data-magnetic
              className="group rounded border border-[var(--color-line)] px-[1.4rem] py-[0.9rem] text-[12px] font-medium tracking-[0.05em] uppercase hover:border-[var(--color-orange)] focus-visible:border-[var(--color-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-orange)]"
            >
              <RollText>
                {hero.cta[1].label}
                <span className="text-[var(--color-dim)]">
                  · {hero.cta[1].sub}
                </span>
              </RollText>
            </a>
          </div>
        </HeroNameMotion>
        <div className="flex flex-1 justify-center">
          <BookingPhoto />
        </div>
      </div>
      <p className="relative z-[2] pb-5 text-center text-[11px] tracking-[0.2em] text-[var(--color-dim)] uppercase">
        scroll to <b className="text-[var(--color-orange)]">escape</b> ↓
      </p>
    </section>
  );
}
