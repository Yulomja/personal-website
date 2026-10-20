import { withBasePath } from '@/lib/paths';
import { notFound } from 'next/navigation';
import { copy, publicationTitle, publicationUrl } from '@/lib/copy';
import { isLocale, localePath } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';
import { ArrowIcon, DownloadIcon } from '@/components/icons';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return pageMetadata(locale, copy[locale].nav.cv, copy[locale].cvDescription, 'cv');
}
export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = copy[locale];
  return <main id="main" className="wrap document-page">
    <header className="page-heading cv-heading"><div className="cv-title-copy"><h1>{t.cvTitle}</h1><p>{t.cvDescription}</p></div><a className="button button-small" href={withBasePath(`/cv/loredana-piazza-${locale}.pdf`)} download><DownloadIcon />{t.download}</a></header>
    <section className="cv-section"><h2>{t.profileHeading}</h2><div><p>{t.profile}</p><p>{t.secondProfile}</p></div></section>
    <section className="cv-section"><h2>{t.experience}</h2><div className="timeline">{t.experienceItems.map((item) => <article className="timeline-entry" key={item.title}><p className="meta">{item.date}</p><h3>{item.title}</h3><p className="organisation">{item.organisation}</p><p>{item.text}</p></article>)}</div></section>
    <section className="cv-section"><h2>{t.personalProject}</h2><div><h3>notably.</h3><span className="status">{t.developing}</span><p>{t.projectSummary}</p><a className="text-link" href={localePath(locale, 'projects/notably')}>{t.exploreProject}<ArrowIcon /></a></div></section>
    <section className="cv-section"><h2>{t.education}</h2><div className="timeline">{t.educationItems.map((item) => <article className="timeline-entry" key={item.title}><p className="meta">{item.date}</p><h3>{item.title}</h3><p className="organisation">{item.organisation}</p>{item.text && <p>{item.text}</p>}</article>)}</div></section>
    <section className="cv-section"><h2>{t.skillsHeading}</h2><dl className="skills-list">{t.skillItems.map((item) => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}<div><dt>{t.languages}</dt><dd>{t.languageText}</dd></div></dl></section>
    <section className="cv-section"><h2>{t.certification}</h2><div><h3>Professional Scrum Product Owner I (PSPO I)</h3><p className="meta">{t.certificationDate}</p></div></section>
    <section className="cv-section"><h2>{t.publication}</h2><div><h3 className="publication-title">{publicationTitle}</h3><p className="meta">{t.publicationText}</p><a className="text-link" href={publicationUrl}>{t.publicationLink}<ArrowIcon diagonal /></a></div></section>
    <section className="cv-section"><h2>{t.interestsHeading}</h2><p>{t.interests}</p></section>
  </main>;
}
