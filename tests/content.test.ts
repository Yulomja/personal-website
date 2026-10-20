import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEntries, translatedEntryPath, markdownHtml, publishedEntries, readEntries } from '../lib/content';
import { localePath, otherLocale, formatDate } from '../lib/locales';
function source(locale = 'en', overrides: Record<string, unknown> = {}) {
  const data = { id: 'a-post', locale, slug: locale === 'en' ? 'a-post' : 'ein-beitrag', title: 'A title', description: 'A description', date: '2026-10-20', tags: ['Software'], draft: false, ...overrides };
  return { source: `test.${locale}.md`, raw: `---\n${Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n## A heading\n\nA paragraph.` };
}
test('paired translations can have different slugs and resolve by stable id', () => {
  const entries = validateEntries([source(), source('de')]);
  assert.equal(translatedEntryPath(entries, entries[0], 'de', 'blog'), '/de/blog/ein-beitrag/');
  assert.equal(translatedEntryPath(entries, entries[1], 'en', 'blog'), '/en/blog/a-post/');
});
test('missing translation fails with a meaningful message', () => {
  assert.throws(() => validateEntries([source()]), /missing de translation.*a-post/);
});
test('invalid calendar dates fail including rollover dates', () => {
  for (const date of ['2025-02-29', '2026-13-01', '20-10-2026']) assert.throws(() => validateEntries([source('en', { date }), source('de')]), /real calendar date/);
});
test('duplicate ids and duplicate localized slugs fail', () => {
  assert.throws(() => validateEntries([source(), source('en', { slug: 'another' }), source('de')]), /duplicate id/);
  assert.throws(() => validateEntries([source(), source('en', { id: 'another' }), source('de')]), /duplicate slug/);
});
test('translations must be published together', () => {
  assert.throws(() => validateEntries([source(), source('de', { draft: true })]), /matching draft status/);
});
test('drafts never enter public listings or route data', () => {
  for (const kind of ['posts', 'projects'] as const) {
    const published = publishedEntries(kind);
    assert.ok(published.every((entry) => !entry.draft));
    for (const draft of readEntries(kind).filter((entry) => entry.draft)) assert.ok(!published.some((entry) => entry.id === draft.id && entry.locale === draft.locale));
  }
});
test('Markdown supports rich text and blocks dangerous HTML and URLs', async () => {
  const html = await markdownHtml('## Heading\n\n- list\n\n```ts\nconst x = 1;\n```\n\n![Alt](/image.png)\n\n[Safe](https://example.com) [Bad](javascript:alert%281%29)\n\n<script>alert(1)</script>');
  assert.match(html, /<h2>Heading<\/h2>/); assert.match(html, /<ul>/); assert.match(html, /<pre><code/); assert.match(html, /alt="Alt"/);
  assert.doesNotMatch(html, /<script|href="javascript:/);
});
test('locale path helpers normalize slashes and dates are localized', () => {
  assert.equal(localePath('en'), '/en/'); assert.equal(localePath('de', '/cv/'), '/de/cv/'); assert.equal(otherLocale('en'), 'de');
  assert.match(formatDate('2026-10-20', 'de'), /Oktober/); assert.match(formatDate('2026-10-20', 'en'), /October/);
});
