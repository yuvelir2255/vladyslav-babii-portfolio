import { describe, it, expect } from 'vitest';
import { about } from './about';

describe('about content', () => {
  it('содержит ключевые факты дела', () => {
    const values = about.facts.map((f) => f.v);
    expect(values).toContain('Vladyslav Babii');
    expect(about.facts.find((f) => /age/i.test(f.k))?.v).toBe('19');
    expect(about.facts.some((f) => /kharkiv/i.test(f.v))).toBe(true);
    expect(about.facts.some((f) => /warsaw/i.test(f.v))).toBe(true);
  });
  it('две строки под грифом', () => {
    expect(about.redacted).toHaveLength(2);
    expect(about.redacted.map((r) => r.k.toLowerCase())).toEqual([
      'prior record',
      'charges / m.o.',
    ]);
    about.redacted.forEach((r) => expect(r.v.length).toBeGreaterThan(10));
  });
  it('стек и статус заданы', () => {
    expect(about.tools).toContain('GSAP');
    expect(about.status).toMatch(/large/i);
  });
});
