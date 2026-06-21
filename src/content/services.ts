export const services = {
  eyebrow: 'Charges',
  intro: 'The people charge the defendant with:',
  counts: [
    {
      n: '01',
      charge: 'Unlawful web construction',
      gloss: 'Fast, distinctive sites — motion that earns attention.',
      plea: 'Guilty',
    },
    {
      n: '02',
      charge: 'Operating products inside Telegram',
      gloss: 'Full products that live inside the chat.',
      plea: 'Guilty',
    },
    {
      n: '03',
      charge: 'Deployment of autonomous AI',
      gloss: 'Tools that ship and take real orders.',
      plea: 'Guilty',
    },
    {
      n: '04',
      charge: 'Elimination of manual labour',
      gloss: 'Deletes the busywork — automation that runs itself.',
      plea: 'Guilty',
    },
    {
      n: '05',
      charge: 'Designing what he builds',
      gloss: 'End to end — from the first pixel to the bottom line.',
      plea: 'Guilty',
    },
  ],
  verdict: {
    eyebrow: 'The court finds the defendant',
    headline: 'Guilty on all five counts',
    sentenceLabel: 'Sentence',
    sentence: 'Sentenced to keep shipping products that take real orders.',
  },
} as const;
