import { describe, it, expect } from 'vitest';
import { validateContact, isSpam, buildTelegramMessage } from './telegram';

describe('validateContact', () => {
  it('accepts a complete, valid input', () => {
    const r = validateContact({
      name: 'Vlad',
      email: 'a@b.com',
      project: 'Build me an app',
    });
    expect(r.ok).toBe(true);
  });

  it('rejects missing fields', () => {
    const r = validateContact({ name: '  ', email: '', project: '' });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeDefined();
    expect(r.errors.email).toBeDefined();
    expect(r.errors.project).toBeDefined();
  });

  it('rejects an invalid email', () => {
    const r = validateContact({
      name: 'V',
      email: 'not-an-email',
      project: 'x',
    });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeDefined();
  });
});

describe('isSpam (honeypot)', () => {
  it('flags a filled honeypot field', () => {
    expect(
      isSpam({ name: 'V', email: 'a@b.com', project: 'x', company: 'bot' }),
    ).toBe(true);
  });

  it('passes an empty honeypot', () => {
    expect(isSpam({ name: 'V', email: 'a@b.com', project: 'x' })).toBe(false);
  });
});

describe('buildTelegramMessage', () => {
  it('includes name, email and project text', () => {
    const msg = buildTelegramMessage({
      name: 'Vlad',
      email: 'a@b.com',
      project: 'Build me an app',
    });
    expect(msg).toContain('Vlad');
    expect(msg).toContain('a@b.com');
    expect(msg).toContain('Build me an app');
  });
});
