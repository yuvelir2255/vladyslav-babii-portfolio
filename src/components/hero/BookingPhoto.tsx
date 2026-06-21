import Image from 'next/image';
import { Placard } from './Placard';

export function BookingPhoto() {
  return (
    <div className="relative w-[clamp(300px,38vw,480px)]">
      <span className="evtag">EXHIBIT A</span>
      <span className="stamp">At Large</span>
      <Image
        src="/media/booking/mugshot.webp"
        alt="Booking photo of Vladyslav Babii"
        width={480}
        height={642}
        sizes="(max-width: 790px) 300px, (max-width: 1264px) 38vw, 480px"
        priority
        className="block h-auto w-full rounded-[10px] shadow-[0_30px_70px_rgba(0,0,0,0.55)] ring-1 ring-[var(--color-line)] ring-inset"
      />
      <Placard />
    </div>
  );
}
