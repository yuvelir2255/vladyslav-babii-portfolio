import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import About from '@/components/sections/About';
import WhatIDo from '@/components/sections/WhatIDo';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative">
      <Hero />
      <Manifesto />
      <About />
      <WhatIDo />
    </main>
  );
}
