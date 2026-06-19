/**
 * "Scroll to explore" cue: a dot travelling down a hairline (motion only).
 */
export default function ScrollCue({ label }: { label: string }) {
  return (
    <div className="text-faint flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase">
      <span>{label}</span>
      <span
        aria-hidden
        className="bg-fg/15 relative block h-8 w-px overflow-hidden"
      >
        <span className="scroll-cue-dot bg-fg/70 absolute top-0 left-0 block h-3 w-px" />
      </span>
    </div>
  );
}
