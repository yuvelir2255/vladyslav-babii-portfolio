import { contact } from '@/content/contact';
import { Bars } from './Bars';
import { VisitForm } from './VisitForm';
import { ContactChannels } from './ContactChannels';
import { ReleaseMotion } from './ReleaseMotion';

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-14 py-28 max-md:px-6 max-md:py-20"
    >
      <ReleaseMotion>
        <Bars />
        <div className="relative z-10 mx-auto w-full max-w-[1100px]">
          <header data-contact-reveal className="mb-12 max-md:mb-8">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-orange)] uppercase">
              <span aria-hidden="true" className="mr-2">
                ●
              </span>
              {contact.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[20ch] font-[family-name:var(--font-display)] text-[clamp(32px,6vw,72px)] leading-[1.02] tracking-[0.01em] text-[var(--color-bone)] uppercase">
              {contact.heading}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--color-steel)]">
              {contact.sub}
            </p>
          </header>

          <div className="flex gap-14 max-lg:flex-col max-lg:gap-10">
            <div data-contact-reveal className="flex-[1.1] max-lg:w-full">
              <VisitForm />
            </div>
            <div data-contact-reveal className="flex-[0.9] max-lg:w-full">
              <ContactChannels />
            </div>
          </div>

          <p
            data-contact-reveal
            className="mt-16 text-[13px] tracking-[0.2em] text-[var(--color-dim)] uppercase max-md:mt-12"
          >
            {contact.signature}
          </p>
        </div>
      </ReleaseMotion>
    </section>
  );
}
