import { describe, it, expect } from 'vitest';
import { staggerFor } from './motion';

describe('staggerFor', () => {
  it('returns 0 when there is nothing to stagger (0 or 1 item)', () => {
    expect(staggerFor(0)).toBe(0);
    expect(staggerFor(1)).toBe(0);
  });

  it('spreads items evenly across the total span when within bounds', () => {
    // 4 items -> 3 gaps; total 0.6 / 3 = 0.2 per gap (inside [min,max])
    expect(staggerFor(4, { total: 0.6, min: 0.04, max: 0.3 })).toBeCloseTo(0.2);
  });

  it('clamps up to the max per-item stagger for few items', () => {
    // 2 items -> 1 gap; total 1 / 1 = 1, clamped to max 0.12
    expect(staggerFor(2, { total: 1, min: 0.04, max: 0.12 })).toBe(0.12);
  });

  it('clamps down to the min per-item stagger for many items', () => {
    // 50 items -> tiny gap, clamped up to min 0.04
    expect(staggerFor(50, { total: 0.6, min: 0.04, max: 0.12 })).toBe(0.04);
  });
});
