import { hero } from '@/content/hero';

export function HeroScreen2() {
  return (
    <section className="grain relative flex min-h-[82svh] items-center border-t border-[var(--color-line)]">
      <div className="relative z-[2] max-w-[1000px] px-14 max-md:px-6">
        <p className="mb-6 border-l-[3px] border-[var(--color-orange)] pl-3 text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
          On the record / statement 01
        </p>
        <p
          data-manifest
          className="m-0 font-[family-name:var(--font-display)] text-[clamp(30px,4.4vw,58px)] leading-[1.18] uppercase"
        >
          {hero.manifest.map((seg, i) => (
            <span
              key={i}
              className={seg.o ? 'text-[var(--color-orange)]' : undefined}
            >
              {seg.t}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
