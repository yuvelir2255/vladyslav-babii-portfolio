'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';

export function EvidenceMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');

      // Скраб-ревил: прогресс привязан к положению элемента в скролле.
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

      const device = root.querySelector('[data-device]');

      // «пакет» улик — прорисовывается по скроллу
      if (root.querySelector('[data-bag-draw]')) {
        gsap.from('[data-bag-draw]', {
          drawSVG: '0%',
          ease: 'none',
          scrollTrigger: {
            trigger: device ?? root,
            start: 'top 88%',
            end: 'top 52%',
            scrub: 0.8,
          },
        });
      }

      // устройство-экспонат
      if (device)
        reveal(
          device,
          { autoAlpha: 0, y: 44, rotate: -6, transformOrigin: 'center' },
          'top 88%',
          'top 54%',
        );

      // заголовок по словам
      let titleSplit: SplitText | null = null;
      const title = root.querySelector<HTMLElement>('[data-exhibit-title]');
      if (title) {
        titleSplit = new SplitText(title, { type: 'words' });
        gsap.from(titleSplit.words, {
          autoAlpha: 0,
          y: 20,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: title,
            start: 'top 86%',
            end: 'top 58%',
            scrub: 0.6,
          },
        });
      }

      // маркеры фишек — каждый по своему положению
      root.querySelectorAll('[data-marker]').forEach((m) =>
        reveal(m, {
          autoAlpha: 0,
          y: 26,
          scale: 0.92,
          transformOrigin: 'left center',
        }),
      );

      // скрэмбл номеров маркеров — разовый щелчок при доскролле (скрабить нельзя)
      const firstMarker = root.querySelector('[data-marker]');
      if (firstMarker) {
        let scrambled = false;
        ScrollTrigger.create({
          trigger: firstMarker,
          start: 'top 78%',
          onEnter: () => {
            if (scrambled) return;
            scrambled = true;
            root
              .querySelectorAll<HTMLElement>('[data-marker-num]')
              .forEach((el, idx) => {
                const txt = el.textContent || '';
                gsap.to(el, {
                  duration: 0.4,
                  delay: idx * 0.1,
                  scrambleText: { text: txt, chars: '0123456789' },
                });
              });
          },
        });
      }

      // текстовые блоки колонки EVID-01 (код-строка, summary, теги) — чтобы
      // карточка появлялась связно, как заголовок над ними, а не статикой
      root
        .querySelectorAll('[data-ev-reveal]')
        .forEach((el) => reveal(el, { autoAlpha: 0, y: 18 }));

      // факты
      root
        .querySelectorAll('[data-fact]')
        .forEach((f) => reveal(f, { autoAlpha: 0, y: 14 }));

      // штамп ADMITTED + микро-тряска — разовый щелчок при доскролле.
      // На мобайле смягчаем штамп (мягкий ease без отскока) и отключаем
      // тряску секции — на телефоне резкий слэм + сдвиг всей секции дёргает.
      const admitted = root.querySelector('[data-admitted]');
      if (admitted) {
        const soft = window.matchMedia('(max-width: 767px)').matches;
        gsap.from('[data-admitted]', {
          autoAlpha: 0,
          scale: soft ? 1.25 : 1.8,
          rotate: soft ? -12 : -20,
          transformOrigin: 'center',
          duration: soft ? 0.7 : 0.5,
          ease: soft ? 'power3.out' : 'back.out(1.7)',
          scrollTrigger: {
            trigger: admitted,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        });
        if (section && !soft) {
          ScrollTrigger.create({
            trigger: admitted,
            start: 'top 84%',
            onEnter: () =>
              gsap.fromTo(
                section,
                { x: -4 },
                { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.45)' },
              ),
          });
        }
      }

      // chain of custody — построчно по скроллу
      root
        .querySelectorAll('[data-custody-row]')
        .forEach((r) => reveal(r, { autoAlpha: 0, y: 16 }));

      return () => titleSplit?.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
