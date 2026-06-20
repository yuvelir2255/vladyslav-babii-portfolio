import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { IBM_Plex_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { siteUrl, localeUrl } from '@/lib/site';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Cursor from '@/components/ui/Cursor';
import Grain from '@/components/ui/Grain';
import Preloader from '@/components/ui/Preloader';
import Field from '@/components/field/Field';
import '../globals.css';

const plex = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: 'Vladyslav Babii',
    authors: [{ name: 'Vladyslav Babii' }],
    alternates: {
      canonical: localeUrl(locale),
      languages: {
        en: localeUrl('en'),
        uk: localeUrl('uk'),
        'x-default': localeUrl('en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Vladyslav Babii',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      url: localeUrl(locale),
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={plex.variable}>
      <body className="font-sans antialiased">
        <Field />
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>{children}</SmoothScroll>
        </NextIntlClientProvider>
        <Grain />
        <Cursor />
        <Preloader />
      </body>
    </html>
  );
}
