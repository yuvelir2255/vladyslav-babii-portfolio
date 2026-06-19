import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';

/**
 * About: a short, confident bio over the field (spec §5.3), revealed paragraph
 * by paragraph as it scrolls in. The lead line is the hook; the rest is dimmed
 * supporting copy. Static under reduced-motion.
 */
export default async function About() {
  const t = await getTranslations('About');

  return (
    <section
      id="about"
      className="legible relative z-10 flex min-h-[100dvh] flex-col justify-center px-6 py-24 md:px-12"
    >
      <div className="max-w-4xl">
        <Reveal
          as="h2"
          className="text-faint font-mono text-[11px] tracking-[0.3em] uppercase"
        >
          {t('label')}
        </Reveal>
        <Reveal
          as="p"
          delay={0.05}
          className="mt-8 font-sans text-3xl leading-tight font-medium tracking-tight md:text-5xl"
        >
          {t('p1')}
        </Reveal>
        <div className="mt-8 max-w-2xl space-y-5">
          <Reveal
            as="p"
            delay={0.12}
            className="text-dim font-sans text-lg leading-relaxed md:text-xl"
          >
            {t('p2')}
          </Reveal>
          <Reveal
            as="p"
            delay={0.18}
            className="text-dim font-sans text-lg leading-relaxed md:text-xl"
          >
            {t('p3')}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
