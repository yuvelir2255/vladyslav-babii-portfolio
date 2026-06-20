import { hero } from '@/content/hero';
import { Ticker } from './Ticker';
import { BookingPhoto } from './BookingPhoto';

export function HeroScreen1() {
  return (
    <section className="grain bars relative flex min-h-[100svh] flex-col">
      <Ticker />
      <div className="relative z-[2] flex flex-1 items-center gap-12 px-14 py-8 max-md:flex-col max-md:gap-8 max-md:px-6">
        <div className="flex-[1.1]">
          <p className="text-[12px] tracking-[0.1em] text-[var(--color-orange)] uppercase">
            {hero.meta}
          </p>
          <h1
            data-hero-name
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
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={hero.cta[0].href}
              data-magnetic
              className="rounded bg-[var(--color-orange)] px-[1.4rem] py-[0.9rem] text-[12px] font-bold tracking-[0.05em] text-[#160d06] uppercase"
            >
              {hero.cta[0].label} ↗
            </a>
            <a
              href={hero.cta[1].href}
              data-magnetic
              className="rounded border border-[var(--color-line)] px-[1.4rem] py-[0.9rem] text-[12px] font-medium tracking-[0.05em] uppercase"
            >
              {hero.cta[1].label}{' '}
              <span className="text-[var(--color-dim)]">
                · {hero.cta[1].sub}
              </span>
            </a>
          </div>
        </div>
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
