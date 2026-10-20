import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createStaticHandler } from '../scripts/static-handler.mjs';
const source = process.cwd();
const mount = process.env.TEST_BASE_PATH || '';
const sitePath = (url) => `${mount}${url}`;
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'loredana-blog-export-'));
try {
  for (const name of ['app', 'components', 'lib', 'content', 'scripts', 'public', 'next.config.ts', 'next-env.d.ts', 'package.json', 'tsconfig.json']) fs.cpSync(path.join(source, name), path.join(temporary, name), { recursive: true });
  // APFS copy-on-write avoids duplicating dependency data on the local Mac.
  const clone = process.platform === 'darwin' ? spawnSync('cp', ['-cR', path.join(source, 'node_modules'), path.join(temporary, 'node_modules')], { encoding: 'utf8' }) : null;
  if (!clone || clone.status !== 0) fs.cpSync(path.join(source, 'node_modules'), path.join(temporary, 'node_modules'), { recursive: true });
  for (const locale of ['en', 'de']) {
    const slug = locale === 'en' ? 'export-verification' : 'export-pruefung';
    const raw = `---\nid: export-verification\nlocale: ${locale}\nslug: ${slug}\ntitle: Export verification fixture\ndescription: Temporary integration fixture, never part of working content.\ndate: '2026-10-21'\ntags: [Verification]\ndraft: false\n---\n## Verified content\n\nA temporary article with **formatted content**.\n\n- A list item\n\n\`\`\`ts\nconst safe = '<script>';\n\`\`\`\n`;
    fs.writeFileSync(path.join(temporary, 'content/posts', `export-check.${locale}.md`), raw);
    fs.writeFileSync(path.join(temporary, 'content/posts', `hidden-export-check.${locale}.md`), raw.replace('id: export-verification', 'id: hidden-export-verification').replace(`slug: ${slug}`, `slug: hidden-${slug}`).replace('title: Export verification fixture', 'title: DRAFT MUST NOT LEAK').replace("date: '2026-10-21'", "date: '2026-10-22'").replace('draft: false', 'draft: true'));
  }
  const build = spawnSync('npm', ['run', 'build'], { cwd: temporary, env: { ...process.env, NEXT_PUBLIC_BASE_PATH: mount, NEXT_PUBLIC_SITE_ORIGIN: mount ? 'https://yulomja.github.io' : '' }, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (build.status !== 0) throw new Error(`Isolated export failed:\n${build.stdout}\n${build.stderr}`);
  for (const [locale, slug, alternate] of [['en', 'export-verification', '/de/blog/export-pruefung/'], ['de', 'export-pruefung', '/en/blog/export-verification/']]) {
    const html = fs.readFileSync(path.join(temporary, 'out', locale, 'blog', slug, 'index.html'), 'utf8');
    assert.match(html, new RegExp(`<html lang="${locale}"`));
    if (mount) assert.ok(html.includes(`rel="canonical" href="https://yulomja.github.io${sitePath(`/${locale}/blog/${slug}/`)}"`), 'Production canonical must contain the mount exactly once.');
    assert.ok(html.includes(`<a href="${sitePath(alternate)}" class="locale-switch"`), 'Header switch must retain the translated article slug.');
    assert.ok(html.includes('Verified content') && html.includes('<strong>formatted content</strong>'));
    assert.match(html, /(?:&lt;|&#x3C;)script(?:>|&gt;)/i, 'Code must be escaped.');
    const index = fs.readFileSync(path.join(temporary, 'out', locale, 'blog', 'index.html'), 'utf8');
    assert.ok(index.includes(slug));
    assert.ok(!index.includes('getting-started-template'));
    const home = fs.readFileSync(path.join(temporary, 'out', locale, 'index.html'), 'utf8');
    const preview = home.match(/<section class="home-writing section-rule"[\s\S]*?<\/section>/)?.[0];
    assert.ok(preview, 'Home must include its latest published article.');
    assert.ok(preview.includes('Export verification fixture') && preview.includes(`href="${sitePath(`/${locale}/blog/${slug}/`)}"`), 'Home must select the newest published article and locale-specific slug.');
    assert.ok(!home.includes('DRAFT MUST NOT LEAK'), 'A newer draft must not appear on the home page.');
  }
  assert.ok(!fs.existsSync(path.join(temporary, 'out/en/blog/getting-started/index.html')));
  assert.ok(!fs.existsSync(path.join(temporary, 'out/de/blog/erster-beitrag/index.html')));
  const handler = createStaticHandler(path.join(temporary, 'out'));
  for (const [url, locale] of [['/de/missing/', 'de'], ['/en/missing/', 'en'], ['/fr/missing/', null]]) {
    let status = 0; let body = '';
    await handler({ url }, { writeHead(code) { status = code; }, end(value) { body = value.toString(); } });
    assert.equal(status, 404);
    if (locale) { assert.ok(body.includes(`<html lang="${locale}"`)); assert.ok(body.includes(`href="${sitePath(`/${locale}/`)}"`)); }
    else { assert.ok(body.includes('Seite nicht gefunden.')); assert.ok(body.includes(`href="${sitePath('/en/')}"`) && body.includes(`href="${sitePath('/de/')}"`)); }
  }
  // Resolve every exported root-relative link, image and runtime asset as a
  // static project site would, including Markdown links and language alternates.
  function audit(directory) {
    for (const name of fs.readdirSync(directory)) {
      const file = path.join(directory, name);
      if (fs.statSync(file).isDirectory()) { audit(file); continue; }
      if (file.endsWith('.css')) {
        const css = fs.readFileSync(file, 'utf8');
        for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
          const value = match[1].replace(/^['"]|['"]$/g, '');
          if (/^(data:|https?:|#)/.test(value)) continue;
          const relative = path.relative(path.join(temporary, 'out'), file).split(path.sep).join('/');
          const url = new URL(value, `https://example.invalid${sitePath(`/${relative}`)}`);
          assert.ok(!mount || url.pathname.startsWith(`${mount}/`), `Unprefixed CSS asset: ${value}`);
          assert.ok(fs.existsSync(path.join(temporary, 'out', url.pathname.slice(mount.length))), `Missing CSS font/image: ${value}`);
        }
        continue;
      }
      if (!file.endsWith('.html')) continue;
      const html = fs.readFileSync(file, 'utf8');
      for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
        const tag = html.slice(html.lastIndexOf('<', match.index), html.indexOf('>', match.index) + 1);
        if (/rel="(?:preconnect|dns-prefetch)"/.test(tag)) continue; // Origin hints are not mounted resources.
        const url = match[1];
        if (!url.startsWith('/') || url.startsWith('//')) continue;
        assert.ok(!mount || url.startsWith(`${mount}/`), `Unprefixed URL in ${file}: ${url}; ${html.slice(Math.max(0, match.index - 70), match.index + 140)}`);
        const pathname = new URL(url, 'https://example.invalid').pathname;
        let target = path.join(temporary, 'out', pathname.slice(mount.length));
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
        assert.ok(fs.existsSync(target), `Broken exported URL in ${file}: ${url}`);
      }
    }
  }
  audit(path.join(temporary, 'out'));
  for (const locale of ['en', 'de']) {
    const cv = fs.readFileSync(path.join(temporary, 'out', locale, 'cv/index.html'), 'utf8');
    assert.ok(cv.includes(`href="${sitePath(`/cv/loredana-piazza-${locale}.pdf`)}"`));
    assert.doesNotMatch(cv, /<img[^>]+loredana-piazza\.jpg/, 'Online CV must not contain the hero portrait.');
    const home = fs.readFileSync(path.join(temporary, 'out', locale, 'index.html'), 'utf8');
    assert.ok(home.includes(`src="${sitePath('/images/loredana-piazza.jpg')}"`), 'Home portrait must remain.');
  }
  const fallback = fs.readFileSync(path.join(temporary, 'out/404.html'), 'utf8');
  assert.ok(fallback.includes('Seite nicht gefunden.') && fallback.includes(`href="${sitePath('/en/')}"`) && fallback.includes(`href="${sitePath('/de/')}"`), 'Pages fallback must provide bilingual recovery links.');
  console.log(`Mount ${mount || '/'}: all exported links, images, PDFs and runtime assets resolve.`);
  console.log('Isolated export passed: paired articles, translated slugs, initial HTML, escaped code, listings, dynamic latest-post previews, draft exclusion and localized HTTP404 recovery.');
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
