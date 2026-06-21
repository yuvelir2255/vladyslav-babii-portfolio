export const hero = {
  meta: 'CASE FILE №VB-19 · KHARKIV → WARSAW · AT LARGE',
  name: ['Vladyslav', 'Babii'] as const,
  role: 'Telegram Mini Apps · Websites · AI Products',
  placard: {
    dept: 'Dept. of Shipping',
    number: 'VB-19',
    name: 'Vladyslav Babii',
    date: '21 · 06 · 2026',
  },
  ticker: [
    'INTAKE TERMINAL — BLOCK VB',
    'STATUS: AT LARGE',
    'CHARGE: SHIPPING REAL PRODUCTS',
    'NOW SHIPPING FROM WARSAW',
    'VISITING HOURS: ALWAYS OPEN',
  ],
  cta: [
    { label: 'Open the case file', sub: '', href: '#work' },
    { label: 'Make contact', sub: 'visiting hours open', href: '#contact' },
  ],
  manifest: [
    { t: "I don't write demos. I build products that " },
    { t: 'escape the lab', o: true },
    { t: ' and take ' },
    { t: 'real orders', o: true },
    { t: '. Whatever I start — I ' },
    { t: 'break out', o: true },
    { t: ' with it finished.' },
  ],
} as const;
