'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import TiltCard from './TiltCard';

interface Media {
  src: string;
  alt: string;
}

// per-phone scroll drift (yPercent at the scroll extremes) — different rates
// give the cluster depth as it moves past.
const RATES = [11, -7, 9];

/**
 * Case screenshots, presented with depth: each phone fades+scales in on enter,
 * then drifts vertically on scroll at its own rate (parallax), over a soft gold
 * glow (the jewelry brand's warmth). 3D tilt on hover is preserved per phone.
 */
export default function CasePhones({ media }: { media: Media[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const phones = Array.from(
        root.querySelectorAll<HTMLElement>('[data-phone]'),
      );
      if (!phones.length) return;

      gsap.from(phones, {
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 82%' },
      });

      phones.forEach((p, i) => {
        const rate = RATES[i % RATES.length];
        gsap.fromTo(
          p,
          { yPercent: -rate },
          {
            yPercent: rate,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative min-w-0">
      {/* jewelry warmth behind the cluster */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 62% 48%, rgba(245,158,11,0.18), rgba(245,158,11,0.06) 45%, transparent 72%)',
        }}
      />
      <div className="flex gap-5 overflow-x-auto pb-4 lg:justify-end lg:overflow-visible">
        {media.map((m) => (
          <div
            key={m.src}
            data-phone
            className="shrink-0 will-change-transform"
          >
            <TiltCard>
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
          </div>
        ))}
      </div>
    </div>
  );
}
