import { describe, it, expect } from 'vitest';
import { hero } from './hero';

describe('hero content', () => {
  it('содержит имя и роль', () => {
    expect(hero.name).toEqual(['Vladyslav', 'Babii']);
    expect(hero.role).toContain('Telegram Mini Apps');
  });
  it('booking-табличка заполнена данными о владельце', () => {
    expect(hero.placard.dept).toMatch(/shipping/i);
    expect(hero.placard.number).toBe('VB-19');
    expect(hero.placard.name).toBe('V. Babii');
    expect(hero.placard.crime).toBe('shipping products');
  });
  it('есть пункты тикера и две CTA', () => {
    expect(hero.ticker.length).toBeGreaterThanOrEqual(4);
    expect(hero.cta).toHaveLength(2);
  });
});
