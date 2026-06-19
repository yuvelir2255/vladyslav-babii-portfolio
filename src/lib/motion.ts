/**
 * Pure motion-timing helpers (framework-agnostic, unit-tested).
 */

export interface StaggerOptions {
  /** Desired total span the staggered items should fill, in seconds. */
  total?: number;
  /** Minimum per-item stagger, in seconds. */
  min?: number;
  /** Maximum per-item stagger, in seconds. */
  max?: number;
}

/**
 * Per-item stagger (seconds) for revealing `count` items together.
 *
 * Spreads them across `total` seconds, then clamps so long sequences don't drag
 * and short ones don't flash. Returns 0 when there's nothing to stagger.
 */
export function staggerFor(count: number, opts: StaggerOptions = {}): number {
  const { total = 0.6, min = 0.04, max = 0.12 } = opts;
  if (count <= 1) return 0;
  const per = total / (count - 1);
  return Math.min(max, Math.max(min, per));
}
