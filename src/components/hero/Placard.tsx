import { hero } from '@/content/hero';

export function Placard() {
  const p = hero.placard;
  return (
    <div className="placard" aria-hidden="true">
      <span className="ph">{p.dept}</span>
      <span className="prow">
        <span className="pl">№</span>
        <span className="pv">{p.number}</span>
      </span>
      <span className="prow">
        <span className="pl">Name</span>
        <span className="pv">{p.name}</span>
      </span>
      <span className="prow">
        <span className="pl">Date</span>
        <span className="pv">{p.date}</span>
      </span>
      <span className="prow">
        <span className="pl">Crime</span>
        <span className="pv">{p.crime}</span>
      </span>
    </div>
  );
}
