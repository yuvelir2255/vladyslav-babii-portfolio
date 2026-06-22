export const about = {
  label: 'The Inmate',
  facts: [
    { k: 'Inmate №', v: 'VB-19' },
    { k: 'Name', v: 'Vladyslav Babii' },
    { k: 'Age', v: '19' },
    { k: 'Origin', v: 'Kharkiv, UA' },
    { k: 'Held at', v: 'Warsaw, PL' },
  ],
  redacted: [
    {
      k: 'Prior record',
      v: 'Ran real businesses before writing a single line of code. Learned to ship by shipping.',
    },
    {
      k: 'Charges / M.O.',
      v: 'Designs, builds, and ships — not demos. A live jewelry business runs on the Mini App he built.',
    },
  ],
  disposition:
    'Treats every build like his own product: from the first pixel to final deploy.',
  status: 'At large',
  tools: [
    'React',
    'TypeScript',
    'Next.js',
    'Vite',
    'GSAP',
    'WebGL',
    'Supabase',
    'OpenAI',
    'Telegram Bot API',
  ],
} as const;
