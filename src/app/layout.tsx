import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Vladyslav Babii — Case File',
  description:
    'I build products people use — Telegram Mini Apps, websites and AI tools that ship and take real orders.',
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
