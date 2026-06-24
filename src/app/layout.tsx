import type { Metadata, Viewport } from 'next';
import {
  Anton,
  JetBrains_Mono,
  Oswald,
  Permanent_Marker,
  Saira_Stencil_One,
} from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/motion/SmoothScroll';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const sairaStencil = Saira_Stencil_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-saira-stencil',
});
const marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker',
});

const SITE_DESCRIPTION =
  'Building Telegram Mini Apps, websites and AI integrations — shipped to production and taking real orders.';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000',
  ),
  title: 'Vladyslav Babii — Case File',
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    title: 'Developer Portfolio',
    description: SITE_DESCRIPTION,
    siteName: 'Vladyslav Babii',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Portfolio',
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  // тёмная адресная строка/UI на мобайле (вместо серой) — цельно с фоном
  themeColor: '#100f0d',
  width: 'device-width',
  initialScale: 1,
  // контент/фон заходят под safe-area (notch/home-indicator) — без серой кромки
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${jetbrains.variable} ${oswald.variable} ${sairaStencil.variable} ${marker.variable}`}
    >
      <body>
        {/* до отрисовки: если intake пройден в этой сессии — прячем прелоадер (без кадра-вспышки) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('vb19-intake')==='1')document.documentElement.classList.add('intake-seen')}catch(e){}",
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
