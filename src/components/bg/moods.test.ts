import { describe, it, expect } from 'vitest';
import { moodForSection, BG_SECTION_IDS } from './moods';

describe('moodForSection', () => {
  it('about — холодная сталь, прутья плотнее', () => {
    expect(moodForSection('about')['--m-steel']).toBe('1');
    expect(moodForSection('about')['--vig']).toBe('0.55');
    expect(moodForSection('about')['--bar-opacity']).toBe('0.6');
  });
  it('services — тоже холодная сталь (не тёплый)', () => {
    expect(moodForSection('services')['--m-steel']).toBe('1');
    expect(moodForSection('services')['--m-warm']).toBe('0');
  });
  it('contact — дневной свет + прутья растворяются', () => {
    expect(moodForSection('contact')['--m-day']).toBe('1');
    expect(moodForSection('contact')['--m-steel']).toBe('0');
    expect(moodForSection('contact')['--bar-opacity']).toBe('0');
  });
  it('неизвестный id → дефолт (yard)', () => {
    expect(moodForSection('zzz')).toEqual(moodForSection('yard'));
  });
  it('каждый мод содержит все 5 ключей', () => {
    BG_SECTION_IDS.forEach((id) => {
      expect(Object.keys(moodForSection(id)).sort()).toEqual(
        ['--bar-opacity', '--m-day', '--m-steel', '--m-warm', '--vig'].sort(),
      );
    });
  });
});
