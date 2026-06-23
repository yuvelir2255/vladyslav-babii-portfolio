export const contact = {
  eyebrow: 'Visiting Hours',
  heading: 'Visiting hours are open.',
  sub: 'Got an idea, a product, or a process that should run itself? Tell me about it — I reply fast and start faster.',
  form: {
    name: { label: 'Name', placeholder: 'Your name' },
    email: { label: 'Email', placeholder: 'you@email.com' },
    project: { label: 'Your project', placeholder: 'What should I build?' },
    submit: 'Send message',
    sending: 'Sending…',
    success: "Released — your message is on its way. I'll reply soon.",
    error: 'Something went wrong. Email me directly: vladbabii31@gmail.com',
    errors: {
      name: 'Please enter your name.',
      emailRequired: 'Please enter your email.',
      emailInvalid: 'Please enter a valid email address.',
      project: 'Tell me what you want built.',
    },
  },
  channels: [
    {
      label: 'Email',
      value: 'vladbabii31@gmail.com',
      href: 'mailto:vladbabii31@gmail.com',
      external: false,
    },
    {
      label: 'Telegram',
      value: '@BabiiVladyslav',
      href: 'https://t.me/BabiiVladyslav',
      external: true,
    },
    {
      label: 'GitHub',
      value: 'yuvelir2255',
      href: 'https://github.com/yuvelir2255',
      external: true,
    },
    {
      label: 'LinkedIn',
      value: 'Vladyslav Babii',
      href: 'https://www.linkedin.com/in/vladyslav-babii-886052385/',
      external: true,
    },
    {
      label: 'Instagram',
      value: 'babii.vladyslavv',
      href: 'https://www.instagram.com/babii.vladyslavv/',
      external: true,
    },
  ],
  location: 'Warsaw, PL',
  author: {
    name: 'Vladyslav Babii',
    // дата с неразрывными пробелами ( ) — чтобы «21 · 06 · 2026» не
    // разрывалось переносом строки на узком мобайле (была «… · 21» / «· 06 …»)
    caption: 'Signed · release authorized · 21 · 06 · 2026',
  },
} as const;
