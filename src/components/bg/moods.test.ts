import { describe, it, expect } from 'vitest';
import { moodForSection, BG_SECTION_IDS } from './moods';

describe('moodForSection', () => {
  it('about — темнее (vig и прутья плотнее)', () => {
    expect(moodForSection('about')['--vig']).toBe('0.6');
    expect(moodForSection('about')['--bar-opacity']).toBe('0.7');
  });
  it('services — тёплый оранж-свелл', () => {
    expect(moodForSection('services')['--m-warm']).toBe('1');
  });
  it('contact — дневной свет', () => {
    expect(moodForSection('contact')['--m-day']).toBe('1');
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
