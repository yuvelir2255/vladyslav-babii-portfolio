export const services = {
  eyebrow: 'Charges',
  intro: 'The people charge the defendant with:',
  counts: [
    {
      n: '01',
      charge: 'Unlawful web construction',
      gloss: "Handcrafted sites with animation that doesn't let go.",
      plea: 'Guilty',
    },
    {
      n: '02',
      charge: 'Operating products inside Telegram',
      gloss:
        'Full e-commerce Mini Apps built to live and take orders inside Telegram.',
      plea: 'Guilty',
    },
    {
      n: '03',
      charge: 'Deployment of autonomous AI',
      gloss:
        'AI pipelines wired into real products. Fail-closed — no response means nothing gets published.',
      plea: 'Guilty',
    },
    {
      n: '04',
      charge: 'Elimination of manual labor',
      gloss: 'Deletes the busywork — automation that runs itself.',
      plea: 'Guilty',
    },
    {
      n: '05',
      charge: 'Designing what he builds',
      gloss: 'Full ownership — design, code, and deploy. No handoffs. No gaps.',
      plea: 'Guilty',
    },
  ],
  verdict: {
    eyebrow: 'The court finds the defendant',
    headline: 'Guilty on all five counts',
    sentenceLabel: 'Sentence',
    sentence:
      'Sentenced to keep shipping. No parole until the product is live.',
  },
} as const;
