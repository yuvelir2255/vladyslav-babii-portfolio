/**
 * Glassy service card (monochrome): frosted glass over the smoke field, a soft
 * white glow and a large faint white glyph that come alive on hover, plus index,
 * title, subtitle and a white underline that grows on hover. Presentational —
 * the scroll sequence is driven by the parent (WhatIDo).
 */
interface GlassCardProps {
  index: string;
  title: string;
  subtitle: string;
  /** Large background glyph (usually the title's first letter). */
  glyph: string;
}

export default function GlassCard({
  index,
  title,
  subtitle,
  glyph,
}: GlassCardProps) {
  return (
    <article className="group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md transition-transform duration-500 will-change-transform hover:-translate-y-1 md:p-10">
      {/* hover glow (monochrome) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow:
            'inset 0 0 90px -50px rgba(255,255,255,0.55), 0 0 70px -30px rgba(255,255,255,0.4)',
        }}
      />
      {/* big faint white glyph */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -bottom-10 font-sans text-[9rem] leading-none font-semibold text-white opacity-[0.06] transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-[0.14]"
      >
        {glyph}
      </span>
      <span className="text-faint relative font-mono text-[11px] tracking-[0.3em]">
        {index}
      </span>
      <h3 className="relative mt-6 font-sans text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h3>
      <p className="text-dim relative mt-3 max-w-sm font-sans text-base leading-relaxed">
        {subtitle}
      </p>
      <span
        aria-hidden
        className="relative mt-7 block h-px w-10 bg-white/70 transition-all duration-500 group-hover:w-24"
      />
    </article>
  );
}
