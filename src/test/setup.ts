import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom не реализует matchMedia — нужно для GSAP/ScrollTrigger и наших guard'ов
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
