/**
 * Canonical absolute origin of the site, used for metadata, OG images,
 * sitemap and robots. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is live.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the stable Vercel production domain
 *      (correct on Vercel even before a custom domain is attached).
 *   3. localhost — local dev fallback.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();

/** Absolute URL for a locale's home page, e.g. https://site/uk */
export function localeUrl(locale: string): string {
  return `${siteUrl}/${locale}`;
}
