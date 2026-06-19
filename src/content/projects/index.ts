import type { Project } from './types';
import { dreamGoldApp } from './dream-gold-app';
import { dreamGoldSite } from './dream-gold-site';

/** All portfolio projects, in display order. New projects land here. */
export const projects: Project[] = [dreamGoldApp, dreamGoldSite];

export { dreamGoldApp, dreamGoldSite };
export type { Project };
