'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP } from '@/lib/gsap';
import GlassCard from '@/components/ui/GlassCard';

const CARDS = [
  { key: 'web', accent: 'var(--color-accent-web)' },
  { key: 'tg', accent: 'var(--color-accent-tg)' },
  { key: 'ai', accent: 'var(--color-accent-ai)' },
  { key: 'auto', accent: 'var(--color-accent-auto)' },
  { key: 'design', accent: 'var(--color-accent-design)' },
] as const;

/**
 * "What I do" cards. Default (SSR / no-JS): a clean vertical list of glass
 * cards. With JS the list becomes a pinned, centered stack where cards zoom in
 * one after another as you scroll — the current fades out as the next arrives
 * (Luca-style). GSAP reverts the inline layout on cleanup.
 */
export default function WhatIDo() {
  const t = useTranslations('WhatIDo');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = cardsRef.current;
      if (!wrap) return;

      const cards = gsap.utils.toArray<HTMLElement>(wrap.children);
      if (cards.length < 2) return;

      // vertical list -> centered stack
      gsap.set(wrap, { position: 'relative', height: '60vh' });
      gsap.set(cards, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: '100%',
      });
      gsap.set(cards, { autoAlpha: 0, scale: 0.86, filter: 'blur(6px)' });
      gsap.set(cards[0], { autoAlpha: 1, scale: 1, filter: 'blur(0px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 90}%`,
          pin: true,
          scrub: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(cards[i - 1], {
          autoAlpha: 0,
          scale: 1.08,
          filter: 'blur(6px)',
          ease: 'power2.in',
          duration: 0.5,
        }).fromTo(
          card,
          { autoAlpha: 0, scale: 0.86, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 0.5,
          },
          '<0.15',
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="what-i-do"
      className="relative z-10 flex min-h-[100dvh] flex-col justify-center gap-10 px-6 py-24 md:px-12"
    >
      <h2 className="text-faint font-mono text-[11px] tracking-[0.3em] uppercase">
        {t('label')}
      </h2>
      <div
        ref={cardsRef}
        className="mx-auto flex w-full max-w-xl flex-col gap-6"
      >
        {CARDS.map((c, i) => {
          const title = t(`cards.${c.key}.title`);
          return (
            <GlassCard
              key={c.key}
              index={String(i + 1).padStart(2, '0')}
              title={title}
              subtitle={t(`cards.${c.key}.subtitle`)}
              accent={c.accent}
              glyph={title.charAt(0)}
            />
          );
        })}
      </div>
    </section>
  );
}
