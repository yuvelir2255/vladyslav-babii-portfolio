import { hero } from '@/content/hero';
import { ManifestMotion } from './ManifestMotion';

export function HeroScreen2() {
  return (
    <section className="relative flex min-h-[82svh] items-center">
      <ManifestMotion>
        <div className="relative z-[2] max-w-[1000px] px-14 max-md:px-6">
          <p className="mb-6 text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
            <span aria-hidden="true" className="mr-2">
              ●
            </span>
            On the record / statement 01
          </p>
          <p
            data-manifest
            className="m-0 font-[family-name:var(--font-display)] text-[clamp(30px,4.4vw,58px)] leading-[1.18] uppercase"
          >
            {hero.manifest.map((seg, i) => (
              <span
                key={i}
                className={
                  'o' in seg && seg.o ? 'text-[var(--color-orange)]' : undefined
                }
              >
                {seg.t}
              </span>
            ))}
          </p>
        </div>
      </ManifestMotion>
    </section>
  );
}
