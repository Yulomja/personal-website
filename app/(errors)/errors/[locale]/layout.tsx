import '@fontsource-variable/dm-sans';
import '../../../globals.css';
import { withBasePath } from '@/lib/paths';
import { notFound } from 'next/navigation';
import { HeaderView } from '@/components/header-view';
import { Footer } from '@/components/footer';
import { isLocale, locales, otherLocale } from '@/lib/locales';
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function ErrorLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const pathname = `/errors/${locale}`;
  return <html lang={locale}><body><HeaderView locale={locale} pathname={pathname} alternatePaths={{ [pathname]: { [otherLocale(locale)]: withBasePath(`/errors/${otherLocale(locale)}/`) } }} /><div className="page-content">{children}</div><Footer locale={locale} /></body></html>;
}
