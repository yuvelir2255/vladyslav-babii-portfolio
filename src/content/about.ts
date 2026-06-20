export const about = {
  label: 'On the record / Subject file',
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
      v: "Ran my own projects before writing a line of code — shipped, didn't just plan.",
    },
    {
      k: 'Charges / M.O.',
      v: 'Designs, builds and ships real products — not demos. A real business takes orders through what he made.',
    },
  ],
  disposition:
    'Reads a build like an owner: from the first pixel to the bottom line. Whatever he starts, he finishes.',
  status: 'At large',
  tools: [
    'React',
    'TypeScript',
    'Next.js',
    'GSAP',
    'WebGL',
    'Supabase',
    'OpenAI',
    'Telegram',
  ],
} as const;
