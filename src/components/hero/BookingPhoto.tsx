import Image from 'next/image';
import { Placard } from './Placard';

export function BookingPhoto() {
  return (
    <div className="[container-type:inline-size] relative w-[clamp(300px,38vw,480px)]">
      <span data-ev-tag className="evtag">
        EXHIBIT A
      </span>
      <span className="stamp">At Large</span>
      <div className="ev-frame rounded-[10px] border border-[var(--color-line)] shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
        <Image
          src="/media/booking/mugshot.webp"
          alt="Booking photo of Vladyslav Babii"
          width={480}
          height={642}
          sizes="(max-width: 790px) 300px, (max-width: 1264px) 38vw, 480px"
          priority
          className="block h-auto w-full"
        />
        <span aria-hidden="true" className="ev-scan" />
        <span aria-hidden="true" className="ev-corner ev-corner--tl" />
        <span aria-hidden="true" className="ev-corner ev-corner--tr" />
        <span aria-hidden="true" className="ev-corner ev-corner--bl" />
        <span aria-hidden="true" className="ev-corner ev-corner--br" />
      </div>
      <Placard />
    </div>
  );
}
