import { getTranslations } from 'next-intl/server';
import SplitReveal from '@/components/ui/SplitReveal';
import ClipReveal from '@/components/ui/ClipReveal';

/**
 * Manifesto in two movements over the field:
 *  - BUILD: a giant word rising from the dunes + the manifesto, word by word.
 *  - CRAFT: a giant word + the tech stack, revealed token by token.
 * BUILD / CRAFT stay in English in both locales — they're the signature
 * wordmarks (Luca-style), while the body copy is localized.
 */
export default async function Manifesto() {
  const t = await getTranslations('Manifesto');

  return (
    <section id="manifesto" className="legible relative z-10">
      <div className="flex min-h-[100dvh] flex-col justify-center gap-8 px-6 md:px-12">
        <ClipReveal
          as="h2"
          from="left"
          text={t('buildWord')}
          className="font-sans text-[clamp(4rem,19vw,15rem)] leading-[0.95] font-semibold tracking-[-0.04em]"
        />
        <SplitReveal
          as="p"
          text={t('buildText')}
          total={1.1}
          className="text-dim max-w-2xl font-sans text-2xl leading-snug tracking-tight md:text-4xl"
        />
      </div>

      <div className="flex min-h-[100dvh] flex-col justify-center gap-10 px-6 md:px-12">
        <ClipReveal
          as="h2"
          from="right"
          text={t('craftWord')}
          className="font-sans text-[clamp(4rem,19vw,15rem)] leading-[0.95] font-semibold tracking-[-0.04em]"
        />
        <SplitReveal
          as="p"
          text={t('craftStack')}
          total={1.4}
          className="text-dim max-w-3xl font-mono text-base leading-loose tracking-wide md:text-2xl"
        />
      </div>
    </section>
  );
}
