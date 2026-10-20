import { notFound } from 'next/navigation';
import { copy } from '@/lib/copy';
import { isLocale, localePath } from '@/lib/locales';
import { publishedEntries } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { ArrowIcon } from '@/components/icons';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return pageMetadata(locale, copy[locale].projectsTitle, copy[locale].projectsDescription, 'projects');
}
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = copy[locale];
  return <main id="main" className="wrap listing-page"><header className="page-heading"><h1>{t.projectsTitle}</h1><p>{t.projectsDescription}</p></header><div className="project-list">{publishedEntries('projects', locale).map((project) => <article className="project-row" key={project.id}><div><h2><a href={localePath(locale, `projects/${project.slug}`)}>{project.title}</a></h2><span className="status">{t.developing}</span></div><div><p>{project.description}</p><a className="text-link" href={localePath(locale, `projects/${project.slug}`)}>{t.projectDetails}<ArrowIcon /></a></div></article>)}</div></main>;
}
