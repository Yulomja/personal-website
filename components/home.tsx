import { withBasePath } from '@/lib/paths';
import { copy, email, linkedIn } from '@/lib/copy';
import { localePath, formatDate, type Locale } from '@/lib/locales';
import { ArrowIcon } from './icons';
import { publishedEntries } from '@/lib/content';
import { NotablyScreenshot } from './notably-screenshot';
export function Home({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const latestPost = publishedEntries('posts', locale)[0];
  return <main id="main" className="wrap home">
    <section className="hero">
      <div className="hero-top"><h1>Loredana<br />Piazza<span className="accent">.</span></h1><div className="hero-location"><span>{t.role}</span><span>{t.location}</span></div></div>
      <img className="hero-portrait" src={withBasePath('/images/loredana-piazza.jpg')} alt="Loredana Piazza" width={3868} height={5802} loading="eager" fetchPriority="high" />
      <p className="hero-intro">{t.intro}</p>
      <div className="actions"><a className="button" href={localePath(locale, 'cv')}>{t.viewCv}<ArrowIcon /></a><a className="text-link" href={localePath(locale, 'projects')}>{t.viewProjects}<ArrowIcon /></a></div>
    </section>
    <section className="home-work section-rule" aria-labelledby="work-heading"><h2 id="work-heading">{t.currentWork}</h2><div className="home-work-content"><div className="entry-heading"><h3>{t.employer}</h3><p className="meta">{t.since}</p></div><p className="role-line">{t.role} · {t.workLocation}</p><p>{t.currentSummary}</p><a className="text-link" href={localePath(locale, 'cv')}>{t.experienceLink}<ArrowIcon /></a></div></section>
    <section className="home-project section-rule" aria-labelledby="project-heading"><div><h2 id="project-heading">{t.selectedProject}</h2><p className="status">{t.developing}</p></div><div><h3 className="project-name">notably.</h3><p>{t.projectSummary}</p><NotablyScreenshot locale={locale} /><a className="text-link" href={localePath(locale, 'projects/notably')}>{t.exploreProject}<ArrowIcon /></a></div></section>
    {latestPost && <section className="home-writing section-rule" aria-labelledby="writing-heading"><h2 id="writing-heading">{t.latestWriting}</h2><div><time className="meta" dateTime={latestPost.date}>{formatDate(latestPost.date, locale)}</time><h3><a href={localePath(locale, `blog/${latestPost.slug}`)}>{latestPost.title}</a></h3><p>{latestPost.description}</p><a className="text-link" href={localePath(locale, `blog/${latestPost.slug}`)}>{t.readPost}<ArrowIcon /></a></div></section>}
    <section className="home-interests section-rule"><h2>{t.outside}</h2><p>{t.interests}</p></section>
    <section className="contact-panel"><h2>{t.contactHeading}</h2><p>{t.contactText}</p><div className="actions"><a className="text-link" href={`mailto:${email}`}>{t.emailAction}<ArrowIcon diagonal /></a><a className="text-link" href={linkedIn}>{t.linkedInAction}<ArrowIcon diagonal /></a></div></section>
  </main>;
}
