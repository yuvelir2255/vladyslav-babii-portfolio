import { getTranslations } from 'next-intl/server';
import SplitReveal from '@/components/ui/SplitReveal';
import HeroName from '@/components/ui/HeroName';
import LangSwitcher from '@/components/ui/LangSwitcher';
import SocialLinks from '@/components/ui/SocialLinks';
import ScrollCue from '@/components/ui/ScrollCue';

/**
 * Full-screen hero over the particle field: availability + language switch on
 * top, big name + role in the centre, social links + scroll cue at the bottom.
 * The name/role reveal word by word once the preloader curtain lifts (~1.35s).
 */
export default async function Hero() {
  const t = await getTranslations('Hero');

  return (
    <section className="legible relative z-10 flex min-h-[100dvh] flex-col justify-between px-6 py-7 md:px-12 md:py-10">
      <div className="flex items-start justify-between gap-4">
        <p className="text-dim flex items-center gap-2.5 font-mono text-[11px] tracking-[0.22em] uppercase">
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="bg-fg absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" />
            <span className="bg-fg relative inline-flex h-1.5 w-1.5 rounded-full" />
          </span>
          {t('available')}
        </p>
        <LangSwitcher />
      </div>

      <div className="max-w-4xl">
        <HeroName
          text={t('name')}
          delay={1.5}
          className="font-sans text-[clamp(2.75rem,11vw,8rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
        />
        <SplitReveal
          as="p"
          text={t('role')}
          scroll={false}
          delay={2.7}
          total={0.5}
          className="text-dim mt-5 max-w-xl font-mono text-sm leading-relaxed tracking-wide md:text-base"
        />
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SocialLinks />
        <ScrollCue label={t('scroll')} />
      </div>
    </section>
  );
}
