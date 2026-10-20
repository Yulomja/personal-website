import { notFound } from 'next/navigation';
import { Home } from '@/components/home';
import { copy } from '@/lib/copy';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale, 'Loredana Piazza', copy[locale].description);
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Home locale={locale} />;
}
