import { getTranslations } from 'next-intl/server';
import SplitReveal from '@/components/ui/SplitReveal';

/**
 * Closing signature line — a centered statement that bridges the manifesto/about
 * into the work. Word-by-word reveal over the field (spec §5.5).
 */
export default async function Signature() {
  const t = await getTranslations('Signature');

  return (
    <section
      id="signature"
      className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6 text-center"
    >
      <SplitReveal
        as="h2"
        text={t('line')}
        total={0.7}
        className="font-sans text-[clamp(2.5rem,9vw,7rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
      />
    </section>
  );
}
