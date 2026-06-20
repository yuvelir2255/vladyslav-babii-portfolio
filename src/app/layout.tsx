import type { Metadata } from 'next';
import {
  Anton,
  JetBrains_Mono,
  Oswald,
  Saira_Stencil_One,
} from 'next/font/google';
import './globals.css';

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
      className={`${anton.variable} ${jetbrains.variable} ${oswald.variable} ${sairaStencil.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
