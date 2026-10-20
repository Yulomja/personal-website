import '@fontsource-variable/dm-sans';
import '../globals.css';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { isLocale, locales } from '@/lib/locales';
import { publishedEntries, translatedEntryPath } from '@/lib/content';
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const alternatePaths: Record<string, Record<string, string>> = {};
  for (const [kind, section] of [['posts', 'blog'], ['projects', 'projects']] as const) {
    const entries = publishedEntries(kind);
    for (const entry of entries.filter((entry) => entry.locale === locale)) alternatePaths[`/${locale}/${section}/${entry.slug}`] = Object.fromEntries(locales.map((target) => [target, translatedEntryPath(entries, entry, target, section)]));
  }
  return <html lang={locale}><body><Header locale={locale} alternatePaths={alternatePaths} /><div className="page-content">{children}</div><Footer locale={locale} /></body></html>;
}
