export const evidence = {
  eyebrow: 'Evidence',
  intro: 'The people submit the following evidence:',
  exhibit: {
    code: 'EVID-01',
    status: 'Admitted · Live',
    title: 'Dream Gold — Telegram Mini App',
    summary:
      'A production storefront living inside Telegram — used daily by a real jewelry atelier to take orders.',
    markers: [
      { n: '1', title: 'AI product cards', note: 'GPT-4o-mini vision' },
      { n: '2', title: 'On-screen ring sizer', note: 'px → mm' },
      { n: '3', title: 'HMAC-signed orders', note: 'Tamper-proof orders' },
    ],
    facts: ['Trilingual', 'Light + dark', '~77 KB'],
    tags: ['Telegram Mini App', 'React', 'TypeScript', 'OpenAI', 'Supabase'],
    shots: [
      {
        src: '/media/dream-gold/shop.png',
        alt: 'Dream Gold storefront inside Telegram',
        label: 'Shop',
      },
      {
        src: '/media/dream-gold/product.png',
        alt: 'Dream Gold product card',
        label: 'Product',
      },
      {
        src: '/media/dream-gold/sizer.png',
        alt: 'On-screen ring sizer measuring in millimetres',
        label: 'Sizer',
      },
      {
        src: '/media/dream-gold/cart.png',
        alt: 'Dream Gold cart and order',
        label: 'Cart',
      },
    ],
    links: [
      {
        label: 'Open exhibit',
        href: 'https://t.me/dreamgold_jewelry_bot/shop',
        kind: 'primary',
      },
      {
        label: 'Web demo',
        href: 'https://dreamgold-jewelry.vercel.app',
        kind: 'secondary',
      },
    ],
  },
  pending: {
    code: 'EVID-02',
    status: 'Coming soon',
    title: 'Dream Gold — Website',
    summary: 'A full marketing site for the atelier — in the works.',
  },
} as const;
