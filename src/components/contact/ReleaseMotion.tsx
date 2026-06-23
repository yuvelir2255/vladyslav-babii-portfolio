'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function ReleaseMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      // ОТПРАВКА ФОРМЫ — вспышка дневного света (по событию vb:released из
      // VisitForm). «Дверь камеры» убрана; остаётся тёплый bloom — «выход на свет».
      const release = () => {
        gsap.to('[data-daylight]', {
          opacity: 1,
          duration: 1.1,
          ease: 'power2.out',
        });
      };
      window.addEventListener('vb:released', release);

      // скраб-ревил контента секции по скроллу
      const reveal = (
        el: Element,
        vars: gsap.TweenVars,
        start = 'top 90%',
        end = 'top 60%',
      ) =>
        gsap.from(el, {
          ...vars,
          ease: 'none',
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
        });

      root
        .querySelectorAll('[data-contact-reveal]')
        .forEach((el) => reveal(el, { autoAlpha: 0, y: 24 }));

      // АВТОРСКАЯ ПОДПИСЬ (финал) — супер-плавный self-playing one-shot.
      // Подпись стоит у самого низа: пока имя в зоне, остаётся ~390px скролла —
      // scrub вышел бы коротким/быстрым. Поэтому гладкость не привязываем к
      // остатку скролла, а проигрываем по входу красивым easing'ом (reversible).
      // Имя «пишется» feathered-маской (--reveal) + blur→sharp (desktop) + подъём;
      // затем DrawSVG-росчерк и подкаптион.
      const signBlock = root.querySelector('[data-sign]');
      const signName = root.querySelector<HTMLElement>('[data-sign-name]');
      const underlinePath = root.querySelector('[data-sign-underline] path');
      const signCap = root.querySelector('[data-sign-cap]');
      if (signBlock && signName) {
        const desktop = window.matchMedia('(min-width: 768px)').matches;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: signBlock,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
        tl.fromTo(
          signName,
          {
            autoAlpha: 0,
            y: 26,
            '--reveal': 0,
            ...(desktop ? { filter: 'blur(14px)' } : {}),
          },
          {
            autoAlpha: 1,
            y: 0,
            '--reveal': 1,
            ...(desktop ? { filter: 'blur(0px)' } : {}),
            duration: 1.6,
            ease: 'expo.out',
          },
          0,
        );
        if (underlinePath)
          tl.from(
            underlinePath,
            { drawSVG: '0%', duration: 0.7, ease: 'power2.out' },
            0.7,
          );
        // подкаптион — мягко последним
        if (signCap)
          tl.fromTo(
            signCap,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            1.05,
          );
      }

      return () => window.removeEventListener('vb:released', release);
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
