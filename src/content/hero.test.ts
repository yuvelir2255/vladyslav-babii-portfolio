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
    expect(hero.placard.name).toBe('Vladyslav Babii');
    expect(hero.placard.date).toMatch(/2026/);
  });
  it('есть пункты тикера и две CTA', () => {
    expect(hero.ticker.length).toBeGreaterThanOrEqual(4);
    expect(hero.cta).toHaveLength(2);
  });
  it('содержит вертикальный лейбл и рап-шит из 3 полей', () => {
    expect(hero.sideLabel).toMatch(/confidential/i);
    expect(hero.rapSheet).toHaveLength(3);
    hero.rapSheet.forEach((row) => {
      expect(row.label.length).toBeGreaterThan(0);
      expect(row.value.length).toBeGreaterThan(0);
    });
  });
});
