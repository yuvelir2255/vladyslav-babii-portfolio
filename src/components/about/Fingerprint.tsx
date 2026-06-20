export function Fingerprint({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g stroke="var(--color-orange)" strokeWidth="1.4" strokeLinecap="round">
        <path data-fp d="M50 16 C 78 16 92 40 88 64 C 84 88 64 104 48 102" />
        <path data-fp d="M50 26 C 72 26 84 46 80 66 C 76 86 60 96 49 94" />
        <path data-fp d="M50 36 C 66 36 76 50 73 66 C 70 82 58 88 50 86" />
        <path data-fp d="M50 46 C 61 46 68 54 66 66 C 64 78 57 82 51 80" />
        <path data-fp d="M50 56 C 57 56 61 61 60 67 C 59 74 55 76 51 74" />
        <path data-fp d="M44 62 C 46 58 53 58 55 63" />
      </g>
    </svg>
  );
}
