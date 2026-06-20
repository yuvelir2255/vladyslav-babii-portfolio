import { ConcreteBg } from '@/components/bg/ConcreteBg';
import { Cursor } from '@/components/cursor/Cursor';
import { FileNav } from '@/components/chrome/FileNav';
import { Hero } from '@/components/hero/Hero';

export default function Home() {
  return (
    <>
      <ConcreteBg />
      <Cursor />
      <FileNav />
      <Hero />
    </>
  );
}
