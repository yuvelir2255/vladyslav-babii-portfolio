'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function DossierMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      // Скраб-ревил: прогресс появления привязан к положению элемента в скролле
      // (листаешь — проявляется; быстрее скроллишь — быстрее; вверх — отматывает).
      const reveal = (
        el: Element,
        vars: gsap.TweenVars,
        start = 'top 92%',
        end = 'top 62%',
      ) =>
        gsap.from(el, {
          ...vars,
          ease: 'none',
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
        });

      // мугшот + заголовок
      const mug = root.querySelector('[data-mugshot]');
      if (mug) reveal(mug, { autoAlpha: 0, y: 46 });
      const label = root.querySelector('[data-about-label]');
      if (label) reveal(label, { autoAlpha: 0, y: 22 });

      // поля досье — каждое по своему положению (естественный «стаггер» по скроллу)
      root
        .querySelectorAll('[data-dossier-field]')
        .forEach((f) => reveal(f, { autoAlpha: 0, y: 28 }));

      // нижние плитки (профиль + биометрия)
      const tiles = root.querySelector('[data-lower-tiles]');
      if (tiles) reveal(tiles, { autoAlpha: 0, y: 32 });

      // возраст 0 → 19 — разовый отсчёт при доскролле (one-shot, не scrub:
      // иначе при медленном скролле залипает на промежуточном «AGE 3»);
      // реверс при возврате — как штамп DECLASSIFIED ниже.
      const ageEl = root.querySelector<HTMLElement>('[data-age]');
      if (ageEl) {
        const counter = { v: 0 };
        const setAge = () =>
          (ageEl.textContent = String(Math.round(counter.v)));
        setAge();
        gsap.to(counter, {
          v: 19,
          snap: { v: 1 },
          duration: 1.1,
          ease: 'power1.out',
          onUpdate: setAge,
          scrollTrigger: {
            trigger: ageEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // отпечаток (Biometrics) — рисуется по скроллу, теперь его реально видно
      const fp = root.querySelector('[data-fp]');
      if (fp) {
        gsap.from('[data-fp]', {
          drawSVG: '0%',
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: tiles ?? fp,
            start: 'top 84%',
            end: 'bottom 64%',
            scrub: 0.8,
          },
        });
      }

      // грифы рассекречиваются по клику (см. RedactedField) — авто-открытие убрано,
      // иначе фишку никто не замечает.

      // штамп DECLASSIFIED — разовый слэм, когда доскроллил (реверс при возврате).
      // На мобайле смягчаем: меньше оверштут/наклон, мягкий ease без отскока —
      // на телефоне резкий «слэм» читается дёрганым (desktop-концепт сохранён).
      const stamp = root.querySelector('[data-stamp]');
      if (stamp) {
        const soft = window.matchMedia('(max-width: 767px)').matches;
        gsap.from('[data-stamp]', {
          autoAlpha: 0,
          scale: soft ? 1.25 : 1.8,
          rotate: soft ? -12 : -24,
          duration: soft ? 0.7 : 0.5,
          ease: soft ? 'power3.out' : 'back.out(1.7)',
          scrollTrigger: {
            trigger: stamp,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
