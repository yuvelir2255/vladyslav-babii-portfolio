import type { Project } from './types';

/** Flagship: the live Dream Gold Telegram Mini App (spec §5.6). */
export const dreamGoldApp: Project = {
  slug: 'dream-gold-app',
  status: 'live',
  role: 'Design & build · solo',
  tags: ['Telegram Mini App', 'React', 'TypeScript', 'OpenAI', 'Supabase'],
  links: [
    {
      label: 'Open in Telegram',
      labelKey: 'openApp',
      href: 'https://t.me/dreamgold_jewelry_bot/shop',
    },
    {
      label: 'Web demo',
      labelKey: 'webDemo',
      href: 'https://dreamgold-jewelry.vercel.app',
    },
  ],
  media: [
    {
      src: '/media/dream-gold/shop.png',
      alt: 'Dream Gold storefront — jewelry catalog',
      width: 390,
      height: 844,
    },
    {
      src: '/media/dream-gold/product.png',
      alt: 'AI-generated product card',
      width: 390,
      height: 844,
    },
    {
      src: '/media/dream-gold/sizer.png',
      alt: 'On-screen ring sizer (px to mm)',
      width: 390,
      height: 844,
    },
  ],
  copy: {
    en: {
      title: 'Dream Gold — Telegram Mini App',
      summary:
        'A production storefront living inside Telegram — used daily by a real jewelry atelier to take orders.',
      features: [
        'AI product cards (GPT-4o-mini vision)',
        'On-screen ring sizer (px → mm)',
        'HMAC-verified orders',
        'Trilingual · light & dark',
        '~77 KB bundle',
      ],
    },
    uk: {
      title: 'Dream Gold — Telegram Mini App',
      summary:
        'Робочий магазин усередині Telegram — реальна ювелірна майстерня щодня приймає через нього замовлення.',
      features: [
        'AI-картки товарів (GPT-4o-mini vision)',
        'Екранний розмір кільця (px → мм)',
        'Замовлення з HMAC-підписом',
        'Три мови · світла й темна тема',
        'Бандл ~77 КБ',
      ],
    },
  },
};
