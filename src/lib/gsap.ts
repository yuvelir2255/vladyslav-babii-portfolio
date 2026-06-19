import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once. Guarded for SSR (client components still render on the server).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: 'power3.out' });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
