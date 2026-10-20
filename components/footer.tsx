import { copy, email, linkedIn } from '@/lib/copy';
import type { Locale } from '@/lib/locales';
import { ArrowIcon } from './icons';
export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <footer className="site-footer wrap"><div><a href={`mailto:${email}`}>{email}</a><span className="footer-location">{t.location}</span></div><a href={linkedIn} className="text-link">LinkedIn <ArrowIcon diagonal /></a></footer>;
}
