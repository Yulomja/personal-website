import { notFound } from 'next/navigation';
import { copy } from '@/lib/copy';
import { isLocale, localePath, otherLocale, formatDate } from '@/lib/locales';
import { publishedEntries, translatedEntryPath, markdownHtml } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
export const dynamicParams = false;
export function generateStaticParams() { return publishedEntries('posts').map(({ locale, slug }) => ({ locale, slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; if (!isLocale(locale)) notFound();
  const entries = publishedEntries('posts'); const entry = entries.find((entry) => entry.locale === locale && entry.slug === slug); if (!entry) notFound();
  const translated = entries.find((candidate) => candidate.id === entry.id && candidate.locale === otherLocale(locale))!;
  return pageMetadata(locale, entry.title, entry.description, `blog/${slug}`, `blog/${translated.slug}`);
}
export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; if (!isLocale(locale)) notFound();
  const entries = publishedEntries('posts'); const entry = entries.find((entry) => entry.locale === locale && entry.slug === slug); if (!entry) notFound();
  const html = await markdownHtml(entry.body); const t = copy[locale];
  return <main id="main" className="wrap article-page"><a className="back-link" href={localePath(locale, 'blog')}>{t.backBlog}</a><header className="page-heading"><h1>{entry.title}</h1><p>{entry.description}</p><p className="meta">{t.published} <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time></p><ul className="tags" aria-label={locale === 'en' ? 'Topics' : 'Themen'}>{entry.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></header><article className="prose" dangerouslySetInnerHTML={{ __html: html }} /><a className="translation-link" href={translatedEntryPath(entries, entry, otherLocale(locale), 'blog')} lang={otherLocale(locale)}>{t.otherName}</a></main>;
}
