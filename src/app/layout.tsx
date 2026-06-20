import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vladyslav Babii',
  description: 'Portfolio — work in progress.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
