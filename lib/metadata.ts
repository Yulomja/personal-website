import type { Metadata } from 'next';
import { localePath, type Locale } from './locales';
export function pageMetadata(locale: Locale, title: string, description: string, path = '', alternatePath?: string): Metadata {
  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_ORIGIN ? new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN) : undefined,
    title: title === 'Loredana Piazza' ? title : `${title} · Loredana Piazza`,
    description,
    alternates: { ...(process.env.NEXT_PUBLIC_SITE_ORIGIN ? { canonical: localePath(locale, path) } : {}), languages: { en: localePath('en', locale === 'en' ? path : (alternatePath ?? path)), de: localePath('de', locale === 'de' ? path : (alternatePath ?? path)) } },
    openGraph: { title, description, type: 'website', locale: locale === 'en' ? 'en_GB' : 'de_CH', siteName: 'Loredana Piazza' },
    robots: { index: true, follow: true },
  };
}
