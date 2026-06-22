import { describe, it, expect } from 'vitest';
import { contact } from './contact';

describe('contact content', () => {
  it('эйдброу/заголовок/подпись на месте', () => {
    expect(contact.eyebrow).toMatch(/visiting hours/i);
    expect(contact.heading.length).toBeGreaterThan(0);
    expect(contact.author.name).toMatch(/Vladyslav Babii/);
  });
  it('форма: 3 поля + success/error копи', () => {
    expect(contact.form.name.label).toBe('Name');
    expect(contact.form.email.label).toBe('Email');
    expect(contact.form.project.label).toMatch(/project/i);
    expect(contact.form.success.length).toBeGreaterThan(0);
    expect(contact.form.error).toMatch(/vladbabii31@gmail\.com/);
  });
  it('directory: каналы с https/mailto href + локация', () => {
    expect(contact.channels.length).toBeGreaterThanOrEqual(5);
    for (const ch of contact.channels) {
      expect(ch.href).toMatch(/^(https:\/\/|mailto:)/);
      expect(ch.label.length).toBeGreaterThan(0);
    }
    expect(contact.location).toMatch(/Warsaw/);
  });
});
