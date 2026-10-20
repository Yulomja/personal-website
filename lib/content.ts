import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type { Root, RootContent } from 'hast';
import { withBasePath } from './paths';
import { locales, type Locale, localePath } from './locales';

export type ContentKind = 'projects' | 'posts';
export type Entry = {
  id: string; locale: Locale; slug: string; title: string; description: string;
  date: string; tags: string[]; draft: boolean; body: string; source: string;
};
export type Source = { source: string; raw: string };
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
function requiredString(data: Record<string, unknown>, field: string, source: string): string {
  const value = data[field];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${source}: ${field} must be a non-empty string.`);
  return value;
}
export function validateEntries(sources: Source[]): Entry[] {
  const entries: Entry[] = sources.map(({ source, raw }) => {
    const { data, content } = matter(raw);
    const id = requiredString(data, 'id', source);
    const slug = requiredString(data, 'slug', source);
    const locale = requiredString(data, 'locale', source);
    const title = requiredString(data, 'title', source);
    const description = requiredString(data, 'description', source);
    const date = requiredString(data, 'date', source);
    if (!locales.includes(locale as Locale)) throw new Error(`${source}: locale must be en or de.`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${source}: slug must contain lowercase letters, numbers and single hyphens.`);
    if (!datePattern.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00Z`)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error(`${source}: date must be a real calendar date in quoted YYYY-MM-DD format.`);
    if (typeof data.draft !== 'boolean') throw new Error(`${source}: draft must be true or false.`);
    if (!Array.isArray(data.tags) || !data.tags.every((tag: unknown) => typeof tag === 'string' && tag.trim())) throw new Error(`${source}: tags must be an array of non-empty strings.`);
    if (!content.trim()) throw new Error(`${source}: Markdown body must not be empty.`);
    return { id, locale: locale as Locale, slug, title, description, date, tags: data.tags, draft: data.draft, body: content, source };
  });
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const entry of entries) {
    const idKey = `${entry.locale}:${entry.id}`;
    const slugKey = `${entry.locale}:${entry.slug}`;
    if (ids.has(idKey)) throw new Error(`${entry.source}: duplicate id "${entry.id}" for ${entry.locale}.`);
    if (slugs.has(slugKey)) throw new Error(`${entry.source}: duplicate slug "${entry.slug}" for ${entry.locale}.`);
    ids.add(idKey); slugs.add(slugKey);
  }
  for (const entry of entries) {
    for (const locale of locales) {
      const translation = entries.find((candidate) => candidate.id === entry.id && candidate.locale === locale);
      if (!translation) throw new Error(`${entry.source}: missing ${locale} translation for id "${entry.id}".`);
      if (translation.draft !== entry.draft) throw new Error(`${entry.source}: translations of "${entry.id}" must have matching draft status.`);
    }
  }
  return entries;
}
export function readEntries(kind: ContentKind): Entry[] {
  const directory = path.join(process.cwd(), 'content', kind);
  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.md')).sort();
  return validateEntries(files.map((file) => ({ source: `content/${kind}/${file}`, raw: fs.readFileSync(path.join(directory, file), 'utf8') })));
}
export function publishedEntries(kind: ContentKind, locale?: Locale): Entry[] {
  return readEntries(kind).filter((entry) => !entry.draft && (!locale || locale === entry.locale)).sort((a, b) => b.date.localeCompare(a.date));
}
export function translatedEntryPath(entries: Entry[], entry: Entry, locale: Locale, section: 'blog' | 'projects'): string {
  const translation = entries.find((candidate) => candidate.id === entry.id && candidate.locale === locale && !candidate.draft);
  if (!translation) throw new Error(`Missing published ${locale} translation for "${entry.id}".`);
  return localePath(locale, `${section}/${translation.slug}`);
}
function prefixInternalUrls() {
  return (tree: Root) => {
    function visit(node: Root | RootContent) {
      if (node.type === 'element') for (const attribute of ['href', 'src']) {
        const value = node.properties[attribute];
        if (typeof value === 'string') node.properties[attribute] = withBasePath(value);
      }
      if ('children' in node) node.children.forEach(visit);
    }
    visit(tree);
  };
}
export async function markdownHtml(body: string): Promise<string> {
  const result = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize).use(prefixInternalUrls).use(rehypeStringify).process(body);
  return String(result);
}
