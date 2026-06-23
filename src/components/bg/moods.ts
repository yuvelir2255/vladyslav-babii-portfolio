export type BgMood = Record<
  '--m-steel' | '--m-warm' | '--m-day' | '--bar-opacity' | '--vig',
  string
>;

export const BG_SECTION_IDS = [
  'yard',
  'about',
  'services',
  'work',
  'contact',
] as const;

export const SECTION_MOODS: Record<string, BgMood> = {
  yard: {
    '--m-steel': '1',
    '--m-warm': '0',
    '--m-day': '0',
    '--bar-opacity': '0.55',
    '--vig': '0.45',
  },
  about: {
    '--m-steel': '1',
    '--m-warm': '0',
    '--m-day': '0',
    '--bar-opacity': '0.6',
    '--vig': '0.55',
  },
  services: {
    '--m-steel': '1',
    '--m-warm': '0',
    '--m-day': '0',
    '--bar-opacity': '0.55',
    '--vig': '0.45',
  },
  work: {
    '--m-steel': '1',
    '--m-warm': '0',
    '--m-day': '0',
    '--bar-opacity': '0.55',
    '--vig': '0.45',
  },
  contact: {
    '--m-steel': '0',
    '--m-warm': '0',
    '--m-day': '1',
    '--bar-opacity': '0',
    '--vig': '0.3',
  },
};

export function moodForSection(id: string): BgMood {
  return SECTION_MOODS[id] ?? SECTION_MOODS.yard;
}
