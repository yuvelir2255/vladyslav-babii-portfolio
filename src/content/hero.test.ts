import { describe, it, expect } from 'vitest';
import { hero } from './hero';

describe('hero content', () => {
  it('содержит имя и роль', () => {
    expect(hero.name).toEqual(['Vladyslav', 'Babii']);
    expect(hero.role).toContain('Telegram Mini Apps');
  });
  it('табличка booking заполнена', () => {
    expect(hero.placard.agency).toBe('Department of Shipping');
    expect(hero.placard.region).toBe('Ukraine');
    expect(hero.placard.number).toBe('VB-19');
  });
  it('есть пункты тикера и две CTA', () => {
    expect(hero.ticker.length).toBeGreaterThanOrEqual(4);
    expect(hero.cta).toHaveLength(2);
  });
});
