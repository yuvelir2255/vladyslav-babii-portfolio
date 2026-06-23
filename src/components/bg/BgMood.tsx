'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { BG_SECTION_IDS, moodForSection } from './moods';

export function BgMood() {
  useEffect(() => {
    const bg = document.getElementById('concrete-bg');
    if (!bg) return;

    const apply = (id: string) => {
      const mood = moodForSection(id);
      for (const [k, v] of Object.entries(mood)) bg.style.setProperty(k, v);
    };

    // только существующие секции (в тестах их нет → триггеры не создаются)
    const triggers = BG_SECTION_IDS.flatMap((id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => apply(id),
        onEnterBack: () => apply(id),
      });
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
