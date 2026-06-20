'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap';

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

      // disposition: построчный reveal через SplitText (идиома манифеста hero)
      const dispoEl = root.querySelector<HTMLElement>('[data-disposition]');
      const dispoSplit = dispoEl
        ? new SplitText(dispoEl, { type: 'lines', mask: 'lines' })
        : null;

      // рассекречивание: синхронизировать DOM-состояние грифа + декод текста
      const declassify = () => {
        root.querySelectorAll<HTMLElement>('[data-redacted]').forEach((b) => {
          b.dataset.open = 'true';
          b.setAttribute('aria-expanded', 'true');
        });
        root
          .querySelectorAll<HTMLElement>('[data-redacted-value]')
          .forEach((el) => {
            gsap.to(el, {
              duration: 0.7,
              scrambleText: {
                text: el.textContent ?? '',
                chars: 'upperAndLowerCase',
                revealDelay: 0.15,
              },
            });
          });
      };

      const mm = gsap.matchMedia();

      // DESKTOP — pin + scrub
      mm.add('(min-width: 768px) and (pointer: fine)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
          },
        });
        tl.from('[data-folder]', {
          autoAlpha: 0,
          rotateX: -10,
          transformOrigin: 'top center',
          duration: 0.4,
        });
        tl.from(
          '[data-mugshot]',
          { autoAlpha: 0, y: -36, duration: 0.4 },
          '<0.1',
        );
        tl.from(
          '[data-dossier-field]',
          { autoAlpha: 0, y: 22, stagger: 0.06, duration: 0.4 },
          '<',
        );
        if (ageEl) {
          tl.to(
            counter,
            { v: 19, snap: { v: 1 }, duration: 0.4, onUpdate: setAge },
            '<',
          );
        }
        if (dispoSplit) {
          tl.from(
            dispoSplit.lines,
            { yPercent: 110, opacity: 0, stagger: 0.08, duration: 0.4 },
            '<',
          );
        }
        tl.from(
          '[data-fp]',
          { drawSVG: '0%', stagger: 0.04, duration: 0.5 },
          '>-0.1',
        );
        tl.to(
          '[data-redaction-bar]',
          { scaleX: 0, transformOrigin: 'right', stagger: 0.1, duration: 0.4 },
          '>-0.05',
        );
        tl.call(declassify);
        tl.from(
          '[data-stamp]',
          {
            autoAlpha: 0,
            scale: 2,
            rotate: -28,
            duration: 0.3,
            ease: 'back.out(2)',
          },
          '>-0.1',
        );
      });

      // MOBILE / TOUCH — простой reveal один раз
      mm.add('(max-width: 767px), (pointer: coarse)', () => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.from('[data-dossier-field]', {
              autoAlpha: 0,
              y: 22,
              stagger: 0.06,
              duration: 0.5,
            });
            if (dispoSplit) {
              gsap.from(dispoSplit.lines, {
                yPercent: 110,
                opacity: 0,
                stagger: 0.08,
                duration: 0.5,
              });
            }
            gsap.from('[data-fp]', {
              drawSVG: '0%',
              stagger: 0.04,
              duration: 0.6,
            });
            if (ageEl) {
              gsap.to(counter, {
                v: 19,
                snap: { v: 1 },
                duration: 0.8,
                onUpdate: setAge,
              });
            }
            gsap.to('[data-redaction-bar]', {
              scaleX: 0,
              transformOrigin: 'right',
              stagger: 0.12,
              duration: 0.5,
              onComplete: declassify,
            });
            gsap.from('[data-stamp]', {
              autoAlpha: 0,
              scale: 1.6,
              duration: 0.4,
              delay: 0.4,
            });
          },
        });
      });

      return () => {
        mm.revert();
        dispoSplit?.revert();
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
