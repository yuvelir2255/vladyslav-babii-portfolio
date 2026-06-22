'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    // прелоадер (и др.) могут останавливать/возобновлять скролл
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // синхронизация Lenis ↔ ScrollTrigger через тикер GSAP
    lenis.on('scroll', ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // навигация по якорям (FileNav, hero-CTA): не листаем плавно через весь
    // сайт, а мгновенно «телепортируем» на секцию и плавно проявляем её целиком
    // (opacity 0→1). Безопасно для пин-секций — opacity не ломает pin.
    const onAnchorClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      const hash = a?.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, immediate: true });
      // мягко проявим блок целиком через CSS-transition (по реальному времени —
      // не зависит от gsap-тикера, который после телепорта проскакивает твин).
      // per-element scrub уже в конечном состоянии, поэтому fade всей секции.
      target.style.transition = 'none';
      target.style.opacity = '0';
      void target.offsetWidth; // форс-рефлоу, чтобы transition сработал
      target.style.transition = 'opacity 0.55s ease';
      target.style.opacity = '1';
      const clear = () => {
        target.style.transition = '';
        target.removeEventListener('transitionend', clear);
      };
      target.addEventListener('transitionend', clear);
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
