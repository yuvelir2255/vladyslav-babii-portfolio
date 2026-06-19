/**
 * Hero social links. Minimal text links (Luca-style), underline grows on hover.
 * Email + Telegram are live; GitHub/LinkedIn/Instagram await real URLs.
 */
const LINKS: { label: string; href: string }[] = [
  { label: 'Email', href: 'mailto:vladbabii31@gmail.com' },
  { label: 'Telegram', href: 'https://t.me/BabiiVladyslav' },
  { label: 'GitHub', href: 'https://github.com/yuvelir2255' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vladyslav-babii-886052385/',
  },
  { label: 'Instagram', href: 'https://www.instagram.com/babii.vladyslavv/' },
];

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.2em] uppercase">
      {LINKS.map((l) => {
        const external = l.href.startsWith('http');
        return (
          <li key={l.label}>
            <a
              href={l.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer noopener' : undefined}
              className="text-dim hover:text-fg group relative -my-2 inline-flex py-2 transition-colors"
            >
              {l.label}
              <span
                aria-hidden
                className="bg-fg absolute bottom-2 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
