import { getTranslations } from 'next-intl/server';
import SocialLinks from '@/components/ui/SocialLinks';

export default async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="relative z-10 flex flex-col items-center gap-5 px-6 py-12 text-center md:flex-row md:justify-between md:px-12 md:text-left">
      <p className="text-faint font-mono text-[11px] tracking-[0.2em]">
        {t('rights')}
      </p>
      <SocialLinks />
    </footer>
  );
}
