import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { localeUrl } from '@/lib/site';

/** One entry per locale, cross-linked via hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, localeUrl(locale)]),
  );

  return routing.locales.map((locale) => ({
    url: localeUrl(locale),
    changeFrequency: 'monthly',
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
