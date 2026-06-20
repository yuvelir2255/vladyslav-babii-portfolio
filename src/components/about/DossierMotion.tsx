'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function DossierMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const section = root.closest('section');
      if (!section) return;

      const ageEl = root.querySelector<HTMLElement>('[data-age]');
      const counter = { v: 0 };
      const setAge = () => {
        if (ageEl) ageEl.textContent = String(Math.round(counter.v));
      };

      // оригиналы грифов фиксируем один раз (защита от ре-энтрантности scramble)
      const redactedEls = Array.from(
        root.querySelectorAll<HTMLElement>('[data-redacted-value]'),
      );
      const originals = redactedEls.map((el) => el.textContent ?? '');
      let declassified = false;
      const declassify = () => {
        if (declassified) return;
        declassified = true;
        root.querySelectorAll<HTMLElement>('[data-redacted]').forEach((b) => {
          b.dataset.open = 'true';
          b.setAttribute('aria-expanded', 'true');
        });
        redactedEls.forEach((el, i) => {
          gsap.to(el, {
            duration: 0.7,
            scrambleText: {
              text: originals[i],
              chars: 'upperAndLowerCase',
              revealDelay: 0.15,
            },
          });
        });
      };

      // Видимый дефолт: прячем-и-проявляем (.from) ТОЛЬКО когда триггер сработал.
      // Если ScrollTrigger не отработает (SSR/headless/тесты) — контент остаётся
      // виден из разметки, секция не «уезжает» в пустоту.
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          // ВЕРХ — мугшот + лейбл + поля одновременно (фото и текст вместе),
          // порядок сверху вниз за счёт stagger полей
          tl.from('[data-mugshot]', { autoAlpha: 0, y: 46, duration: 1.1 }, 0);
          tl.from(
            '[data-about-label]',
            { autoAlpha: 0, y: 22, duration: 0.8 },
            0,
          );
          tl.from(
            '[data-dossier-field]',
            { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.1 },
            0.05,
          );

          // возраст 0 → 19
          if (ageEl) {
            counter.v = 0;
            setAge();
            tl.to(
              counter,
              { v: 19, snap: { v: 1 }, duration: 1, onUpdate: setAge },
              0.15,
            );
          }

          // НИЗ — плитки профиль/биометрия + самоотрисовка отпечатка
          tl.from(
            '[data-lower-tiles]',
            { autoAlpha: 0, y: 32, duration: 0.9 },
            0.3,
          );
          tl.from(
            '[data-fp]',
            { drawSVG: '0%', stagger: 0.05, duration: 0.7 },
            0.3,
          );

          // рассекречивание — когда поля уже на месте
          tl.add(declassify, 1.15);

          // штамп — финальный акцент
          tl.from(
            '[data-stamp]',
            {
              autoAlpha: 0,
              scale: 1.8,
              rotate: -24,
              duration: 0.5,
              ease: 'back.out(1.7)',
            },
            1.3,
          );
        },
      });

      return () => st.kill();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
