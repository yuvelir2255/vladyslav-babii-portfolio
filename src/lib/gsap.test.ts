import { describe, it, expect } from 'vitest';
import { DrawSVGPlugin, ScrambleTextPlugin } from './gsap';

describe('gsap registry', () => {
  it('экспортирует DrawSVG и ScrambleText плагины', () => {
    expect(DrawSVGPlugin).toBeTruthy();
    expect(ScrambleTextPlugin).toBeTruthy();
  });
});
