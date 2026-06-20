import { ConcreteBg } from '@/components/bg/ConcreteBg';
import { Cursor } from '@/components/cursor/Cursor';
import { FileNav } from '@/components/chrome/FileNav';
import { Preloader } from '@/components/chrome/Preloader';
import { AudioToggle } from '@/components/chrome/AudioToggle';
import { Hero } from '@/components/hero/Hero';
import { About } from '@/components/about/About';

export default function Home() {
  return (
    <>
      <Preloader />
      {/* во время intake прелоадер делает этот контейнер inert (см. Preloader.tsx) */}
      <div id="app-content">
        <ConcreteBg />
        <Cursor />
        <FileNav />
        <main>
          <Hero />
          <About />
        </main>
        <AudioToggle />
      </div>
    </>
  );
}
