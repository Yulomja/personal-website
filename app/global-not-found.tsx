import '@fontsource-variable/dm-sans';
import './globals.css';
import { localePath } from '@/lib/locales';
import { copy } from '@/lib/copy';
import { Footer } from '@/components/footer';
export const metadata = { title: '404 · Page not found / Seite nicht gefunden · Loredana Piazza', robots: { index: false, follow: true } };
export default function GlobalNotFound() {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content / <span lang="de">Zum Inhalt springen</span></a><header className="site-header wrap"><a href={localePath('en')} className="wordmark">Loredana Piazza<span aria-hidden="true">.</span></a></header><div className="page-content"><main id="main" className="wrap listing-page"><header className="page-heading"><h1><span lang="en">Page not found.</span><br /><span lang="de">Seite nicht gefunden.</span></h1></header><section lang="en" className="error-recovery"><p>{copy.en.notFoundText}</p><a className="text-link" href={localePath('en')}>{copy.en.returnHome}</a></section><section lang="de" className="error-recovery"><p>{copy.de.notFoundText}</p><a className="text-link" href={localePath('de')}>{copy.de.returnHome}</a></section></main></div><Footer locale="en" /></body></html>;
}
