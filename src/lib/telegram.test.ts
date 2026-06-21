import { describe, it, expect } from 'vitest';
import { validateContact, isSpam, buildTelegramMessage } from './telegram';

describe('validateContact', () => {
  it('требует name/email/project', () => {
    const { ok, errors } = validateContact({});
    expect(ok).toBe(false);
    expect(errors).toEqual({
      name: 'required',
      email: 'required',
      project: 'required',
    });
  });
  it('ловит битый email', () => {
    const { ok, errors } = validateContact({
      name: 'A',
      email: 'bad',
      project: 'x',
    });
    expect(ok).toBe(false);
    expect(errors.email).toBe('invalid');
  });
  it('пропускает валидный вход', () => {
    const { ok } = validateContact({
      name: 'A',
      email: 'a@b.co',
      project: 'x',
    });
    expect(ok).toBe(true);
  });
});

describe('isSpam (honeypot)', () => {
  it('true когда honeypot заполнен', () => {
    expect(isSpam({ company: 'bot' })).toBe(true);
  });
  it('false когда honeypot пуст', () => {
    expect(isSpam({ name: 'A' })).toBe(false);
  });
});

describe('buildTelegramMessage', () => {
  it('включает имя, email и текст проекта', () => {
    const msg = buildTelegramMessage({
      name: 'Ann',
      email: 'a@b.co',
      project: 'Build X',
    });
    expect(msg).toContain('Ann');
    expect(msg).toContain('a@b.co');
    expect(msg).toContain('Build X');
  });
});
