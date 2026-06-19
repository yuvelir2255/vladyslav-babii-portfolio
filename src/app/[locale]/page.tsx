import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Hero');

  return (
    <main className="grid min-h-dvh place-items-center">
      <div className="text-center">
        <h1 className="font-sans text-5xl font-bold tracking-tight">
          {t('name')}
        </h1>
        <p className="text-faint mt-3 font-mono text-sm tracking-widest uppercase">
          {t('tagline')}
        </p>
      </div>
    </main>
  );
}
