import { describe, it, expect } from 'vitest';
import { services } from './services';

describe('services content', () => {
  it('пять пунктов обвинения с номерами 01–05', () => {
    expect(services.counts).toHaveLength(5);
    expect(services.counts.map((c) => c.n)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
    ]);
  });
  it('у каждого пункта есть charge, gloss и plea «guilty»', () => {
    services.counts.forEach((c) => {
      expect(c.charge.length).toBeGreaterThan(3);
      expect(c.gloss.length).toBeGreaterThan(10);
      expect(c.plea).toMatch(/guilty/i);
    });
  });
  it('эйдброу, интро и вердикт заданы', () => {
    expect(services.eyebrow.toLowerCase()).toBe('charges');
    expect(services.intro.length).toBeGreaterThan(10);
    expect(services.verdict.headline).toMatch(/guilty/i);
    expect(services.verdict.sentence.length).toBeGreaterThan(10);
  });
});
