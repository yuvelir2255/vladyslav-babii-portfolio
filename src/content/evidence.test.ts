import { describe, it, expect } from 'vitest';
import { evidence } from './evidence';

describe('evidence content', () => {
  it('эйдброу и интро на месте', () => {
    expect(evidence.eyebrow).toBe('Evidence');
    expect(evidence.intro).toMatch(/submit the following evidence/i);
  });
  it('экспонат EVID-01 = Dream Gold, 3 маркера, 4 скрина', () => {
    expect(evidence.exhibit.code).toBe('EVID-01');
    expect(evidence.exhibit.title).toMatch(/Dream Gold/);
    expect(evidence.exhibit.markers).toHaveLength(3);
    expect(evidence.exhibit.shots).toHaveLength(4);
  });
  it('все скрины имеют src и непустой alt', () => {
    for (const s of evidence.exhibit.shots) {
      expect(s.src).toMatch(/^\/media\/dream-gold\/.+\.png$/);
      expect(s.alt.length).toBeGreaterThan(3);
    }
  });
  it('ссылки — абсолютные https', () => {
    for (const l of evidence.exhibit.links) {
      expect(l.href).toMatch(/^https:\/\//);
      expect(l.label.length).toBeGreaterThan(0);
    }
  });
  it('EVID-02 — pending-сайт', () => {
    expect(evidence.pending.code).toBe('EVID-02');
    expect(evidence.pending.status).toMatch(/pending/i);
  });
});
