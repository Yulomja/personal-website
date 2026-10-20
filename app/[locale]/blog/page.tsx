import { notFound } from 'next/navigation';
import { copy } from '@/lib/copy';
import { isLocale, localePath, formatDate } from '@/lib/locales';
import { publishedEntries } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { ArrowIcon } from '@/components/icons';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return pageMetadata(locale, copy[locale].nav.blog, copy[locale].blogDescription, 'blog');
}
export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = copy[locale]; const posts = publishedEntries('posts', locale);
  return <main id="main" className="wrap listing-page"><header className="page-heading"><h1>{t.blogTitle}</h1><p>{t.blogDescription}</p></header>{posts.length ? <div className="post-list">{posts.map((post) => <article key={post.id}><time className="meta" dateTime={post.date}>{formatDate(post.date, locale)}</time><h2><a href={localePath(locale, `blog/${post.slug}`)}>{post.title}</a></h2><p>{post.description}</p></article>)}</div> : <section className="empty-state"><span className="empty-mark" aria-hidden="true"></span><h2>{t.emptyTitle}</h2><p>{t.emptyText}</p><a className="text-link" href={localePath(locale, 'projects')}>{t.emptyAction}<ArrowIcon /></a></section>}</main>;
}
