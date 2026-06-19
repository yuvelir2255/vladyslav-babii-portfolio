import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import { dreamGoldApp, dreamGoldSite } from '@/content/projects';
import type { Locale } from '@/content/projects/types';

/**
 * Flagship case — Dream Gold Telegram Mini App (spec §5.6): lead + highlights +
 * links on the left, tiltable phone screenshots on the right (placeholders until
 * the photos land in /public/media/dream-gold/), then a coming-soon slot for the
 * Dream Gold website and a "more projects" placeholder.
 */
export default async function WorkDreamGold() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('Work');
  const app = dreamGoldApp;
  const appCopy = app.copy[locale];
  const siteCopy = dreamGoldSite.copy[locale];

  return (
    <section id="work" className="relative z-10 px-6 py-28 md:px-12">
      <Reveal
        as="p"
        className="text-faint font-mono text-[11px] tracking-[0.3em] uppercase"
      >
        {t('label')}
      </Reveal>

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        {/* copy */}
        <div className="max-w-xl">
          <Reveal
            as="h2"
            className="font-sans text-4xl font-semibold tracking-tight md:text-5xl"
          >
            {appCopy.title}
          </Reveal>
          <Reveal
            as="p"
            delay={0.08}
            className="text-dim mt-5 text-lg leading-relaxed"
          >
            {appCopy.summary}
          </Reveal>

          <Reveal as="ul" delay={0.14} className="mt-8 space-y-2.5">
            {appCopy.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <span
                  aria-hidden
                  className="bg-accent-tg h-1.5 w-1.5 shrink-0 rounded-full"
                />
                <span className="text-dim">{f}</span>
              </li>
            ))}
          </Reveal>

          <Reveal as="div" delay={0.2} className="mt-9 flex flex-wrap gap-3">
            {app.links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className={
                  i === 0
                    ? 'bg-fg text-bg rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5'
                    : 'text-dim hover:text-fg rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors'
                }
              >
                {l.label}
              </a>
            ))}
          </Reveal>

          <p className="text-faint mt-7 font-mono text-[11px] tracking-[0.2em]">
            {app.tags.join(' · ')}
          </p>
        </div>

        {/* phone screenshots */}
        <div className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-4 lg:mx-0 lg:justify-end lg:overflow-visible lg:px-0">
          {app.media.map((m) => (
            <TiltCard key={m.src} className="shrink-0">
              <div className="relative aspect-[9/19] w-[clamp(140px,40vw,180px)] overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04]">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(max-width: 1024px) 40vw, 180px"
                  className="object-cover"
                />
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* coming-soon site + more-projects slot */}
      <div className="mt-24 grid gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <span className="text-accent-design font-mono text-[11px] tracking-[0.3em] uppercase">
            {t('comingSoon')}
          </span>
          <h3 className="mt-4 font-sans text-2xl font-semibold tracking-tight">
            {siteCopy.title}
          </h3>
          <p className="text-dim mt-2 text-sm leading-relaxed">
            {siteCopy.summary}
          </p>
        </div>
        <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-faint max-w-xs font-mono text-xs tracking-[0.15em]">
            {t('moreSoon')}
          </p>
        </div>
      </div>
    </section>
  );
}
