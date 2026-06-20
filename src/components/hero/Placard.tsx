import { hero } from '@/content/hero';

export function Placard() {
  const p = hero.placard;
  return (
    <div className="placard" aria-hidden="true">
      <span className="agency">{p.agency}</span>
      <span className="region">{p.region}</span>
      <span className="row">
        <span className="date">{p.date}</span>
        <span className="num">{p.number}</span>
      </span>
    </div>
  );
}
