import { describe, it, expect } from 'vitest';
import { projects } from './index';
import { validateProject } from './types';

describe('project content', () => {
  it('includes at least the two Dream Gold projects', () => {
    expect(projects.length).toBeGreaterThanOrEqual(2);
  });

  it('every project passes schema validation', () => {
    for (const p of projects) {
      expect(validateProject(p), `invalid: ${p.slug}`).toBe(true);
    }
  });

  it('has non-empty EN and UK copy for every project', () => {
    for (const p of projects) {
      expect(p.copy.en.title.length, p.slug).toBeGreaterThan(0);
      expect(p.copy.uk.title.length, p.slug).toBeGreaterThan(0);
      expect(p.copy.en.summary.length, p.slug).toBeGreaterThan(0);
      expect(p.copy.uk.summary.length, p.slug).toBeGreaterThan(0);
    }
  });

  it('marks the mini app live and the website coming-soon', () => {
    const app = projects.find((p) => p.slug === 'dream-gold-app');
    const site = projects.find((p) => p.slug === 'dream-gold-site');
    expect(app?.status).toBe('live');
    expect(site?.status).toBe('coming-soon');
  });
});
