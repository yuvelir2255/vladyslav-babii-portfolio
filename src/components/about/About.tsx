import Image from 'next/image';
import { about } from '@/content/about';
import { RedactedField } from './RedactedField';
import { Fingerprint } from './Fingerprint';
import { DossierMotion } from './DossierMotion';

export function About() {
  return (
    <section
      id="about"
      className="relative px-14 py-24 max-md:px-6 max-md:py-16"
    >
      <DossierMotion>
        <div
          data-folder
          className="relative z-[2] mx-auto flex w-full max-w-[1100px] gap-12 max-lg:flex-col"
        >
          <div className="flex flex-[0.8] flex-col gap-5 max-lg:w-full max-lg:max-w-[440px] max-lg:self-center">
            <div data-mugshot className="relative">
              <span className="evtag">№VB-19</span>
              <Image
                src="/media/booking/inmate-build.webp"
                alt="Vladyslav Babii building on a laptop inside a concrete cell, orange jumpsuit, code on the screens"
                width={960}
                height={1192}
                sizes="(max-width: 1024px) 80vw, 360px"
                className="block h-auto w-full rounded-[10px] border border-[var(--color-line)] grayscale-[0.15]"
              />
            </div>
            <div data-lower-tiles className="flex items-stretch gap-4">
              <div className="relative flex-1 overflow-hidden rounded-[8px] border border-[var(--color-line)]">
                <Image
                  src="/media/booking/inmate-detail.webp"
                  alt=""
                  aria-hidden="true"
                  width={640}
                  height={794}
                  sizes="180px"
                  className="block h-auto w-full grayscale"
                />
                <span className="absolute bottom-1 left-2 text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                  Profile
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[8px] border border-[var(--color-line)] p-3">
                <Fingerprint className="h-20 w-auto" />
                <span className="text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                  Biometrics
                </span>
              </div>
            </div>
          </div>

          <div className="flex-[1.2]">
            <h2
              data-about-label
              className="mb-6 text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase"
            >
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {about.label}
            </h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-sm:grid-cols-1">
              {about.facts.map((f) => {
                const isAge = /age/i.test(f.k);
                return (
                  <div data-dossier-field key={f.k}>
                    <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                      {f.k}
                    </span>
                    <span
                      {...(isAge ? { 'data-age': true } : {})}
                      className={`mt-1 block text-[15px] ${
                        isAge
                          ? 'text-[var(--color-orange)]'
                          : 'text-[var(--color-bone)]'
                      }`}
                    >
                      {f.v}
                    </span>
                  </div>
                );
              })}

              {about.redacted.map((r) => (
                <div
                  data-dossier-field
                  key={r.k}
                  className="col-span-2 max-sm:col-span-1"
                >
                  <RedactedField label={r.k} value={r.v} />
                </div>
              ))}
            </div>

            <div data-dossier-field className="mt-6">
              <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                Disposition
              </span>
              <p
                data-disposition
                className="mt-1 max-w-[48ch] text-[15px] leading-[1.6] text-[var(--color-bone)]"
              >
                {about.disposition}
                <span className="ml-2 inline-block rounded border border-[var(--color-orange)] px-2 py-[2px] align-middle text-[10px] tracking-[0.08em] text-[var(--color-orange)] uppercase">
                  {about.status}
                </span>
              </p>
            </div>

            <div data-dossier-field className="mt-6">
              <span className="block text-[9px] tracking-[0.13em] text-[var(--color-dim)] uppercase">
                Tools / known associates
              </span>
              <p className="mt-1 text-[12px] tracking-[0.04em] text-[var(--color-bone)]">
                {about.tools.join(' · ')}
              </p>
            </div>
          </div>

          <span data-stamp className="stamp-declassified" aria-hidden="true">
            Declassified
          </span>
        </div>
      </DossierMotion>
    </section>
  );
}
