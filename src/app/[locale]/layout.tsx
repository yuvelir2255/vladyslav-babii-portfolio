import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Archivo, Space_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Cursor from '@/components/ui/Cursor';
import Grain from '@/components/ui/Grain';
import Preloader from '@/components/ui/Preloader';
import '../globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vladyslav Babii',
  description: 'Developer — Telegram Mini Apps, websites and AI products.',
};

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
    <html lang={locale} className={`${archivo.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased">
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
