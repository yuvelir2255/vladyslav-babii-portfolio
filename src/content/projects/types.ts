export type ProjectStatus = 'live' | 'coming-soon';

export type Locale = 'en' | 'uk';

export interface ProjectMedia {
  /** Public path, e.g. /media/dream-gold/shop.png */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface LocalizedCopy {
  title: string;
  summary: string;
  /** Feature bullets shown in the case. */
  features: string[];
}

export interface Project {
  slug: string;
  status: ProjectStatus;
  role: string;
  tags: string[];
  links: ProjectLink[];
  media: ProjectMedia[];
  copy: Record<Locale, LocalizedCopy>;
}

/**
 * Pure schema check for a project entry. Required: slug, role, status, tags,
 * links, media (each well-formed), and non-empty EN+UK title/summary. Media may
 * be empty (e.g. a coming-soon project with no screenshots yet).
 */
export function validateProject(p: Project): boolean {
  if (!p || typeof p !== 'object') return false;
  if (!p.slug || !p.role) return false;
  if (p.status !== 'live' && p.status !== 'coming-soon') return false;
  if (!Array.isArray(p.tags) || p.tags.length === 0) return false;
  if (!Array.isArray(p.links)) return false;
  if (!Array.isArray(p.media)) return false;

  for (const m of p.media) {
    if (!m.src || !m.alt || !m.width || !m.height) return false;
  }
  for (const l of p.links) {
    if (!l.label || !l.href) return false;
  }
  for (const loc of ['en', 'uk'] as const) {
    const c = p.copy?.[loc];
    if (!c || !c.title || !c.summary || !Array.isArray(c.features))
      return false;
  }
  return true;
}
