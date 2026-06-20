import { ConcreteBg } from '@/components/bg/ConcreteBg';
import { Cursor } from '@/components/cursor/Cursor';
import { FileNav } from '@/components/chrome/FileNav';
import { Preloader } from '@/components/chrome/Preloader';
import { Hero } from '@/components/hero/Hero';

export default function Home() {
  return (
    <>
      <Preloader />
      <ConcreteBg />
      <Cursor />
      <FileNav />
      <Hero />
    </>
  );
}
