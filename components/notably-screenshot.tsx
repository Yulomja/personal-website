import { withBasePath } from '@/lib/paths';
import { copy } from '@/lib/copy';
import type { Locale } from '@/lib/locales';
export function NotablyScreenshot({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <figure className="product-screenshot"><a href={withBasePath('/images/notably-analysis.jpg')} aria-label={t.viewScreenshot}><img src={withBasePath('/images/notably-analysis.jpg')} alt={t.screenshotAlt} width={2720} height={1800} loading="lazy" /></a><figcaption>{t.screenshotCaption} <a href={withBasePath('/images/notably-analysis.jpg')}>{t.viewScreenshot}</a></figcaption></figure>;
}
