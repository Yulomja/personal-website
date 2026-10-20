import { stripBasePath } from '@/lib/paths';
import { copy } from '@/lib/copy';
import { localePath, otherLocale, type Locale } from '@/lib/locales';
export function HeaderView({ locale, pathname, alternatePaths }: { locale: Locale; pathname: string; alternatePaths?: Record<string, Record<string, string>> }) {
  const t = copy[locale];
  const other = otherLocale(locale);
  const current = stripBasePath(pathname).replace(/\/$/, '') || '/';
  const relativePath = current.replace(/^\/(en|de)(\/|$)/, '').replace(/^\//, '');
  const alternate = alternatePaths?.[current]?.[other] ?? localePath(other, relativePath);
  const links = [['home', ''], ['cv', 'cv'], ['projects', 'projects'], ['blog', 'blog']] as const;
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header wrap">
      <a href={localePath(locale)} className="wordmark" aria-label="Loredana Piazza">Loredana Piazza<span aria-hidden="true">.</span></a>
      <nav aria-label={locale === 'en' ? 'Main navigation' : 'Hauptnavigation'}>
        {links.map(([key, path]) => {
          const active = path ? relativePath === path || relativePath.startsWith(`${path}/`) : relativePath === '';
          return <a key={key} href={localePath(locale, path)} aria-current={active ? 'page' : undefined}>{t.nav[key]}</a>;
        })}
      </nav>
      <a href={alternate} className="locale-switch" lang={other} hrefLang={other} aria-label={locale === 'en' ? 'Diese Seite auf Deutsch lesen' : 'Read this page in English'}>{other.toUpperCase()}</a>
    </header>
  </>;
}
