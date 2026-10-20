import { notFound } from 'next/navigation';
import { copy } from '@/lib/copy';
import { isLocale, localePath } from '@/lib/locales';
import { ArrowIcon } from '@/components/icons';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `404 · ${copy[locale].notFoundTitle} · Loredana Piazza`, description: copy[locale].notFoundText, robots: { index: false, follow: true } };
}
export default async function ErrorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];
  return <main id="main" className="wrap listing-page"><header className="page-heading"><h1>{t.notFoundTitle}</h1><p>{t.notFoundText}</p></header><a className="button" href={localePath(locale)}>{t.returnHome}<ArrowIcon /></a></main>;
}
