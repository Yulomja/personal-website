import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
test('project-site paths prefix once while preserving external and anchor URLs', () => {
  const result = execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { withBasePath, stripBasePath } from './lib/paths.ts';
    import { localePath } from './lib/locales.ts';
    import { markdownHtml } from './lib/content.ts';
    assert.equal(localePath('de', 'blog/beitrag'), '/personal-website/de/blog/beitrag/');
    assert.equal(withBasePath('/images/photo.jpg'), '/personal-website/images/photo.jpg');
    assert.equal(withBasePath('/personal-website/cv/cv.pdf'), '/personal-website/cv/cv.pdf');
    assert.equal(withBasePath('/personal-website#main'), '/personal-website#main');
    assert.equal(stripBasePath('/personal-website/de/cv/'), '/de/cv/');
    assert.equal(stripBasePath('/de/cv/'), '/de/cv/');
    for (const url of ['#section', 'https://example.com', 'mailto:test@example.com', '//example.com/image.jpg']) assert.equal(withBasePath(url), url);
    const html = await markdownHtml('[Internal](/de/cv/) [Already prefixed](/personal-website/en/) [Anchor](#section) [External](https://example.com) ![Image](/images/photo.jpg) [Unsafe](javascript:alert%281%29)');
    assert.ok(html.includes('href="/personal-website/de/cv/"'));
    assert.ok(html.includes('href="/personal-website/en/"'));
    assert.ok(html.includes('src="/personal-website/images/photo.jpg"'));
    assert.ok(html.includes('href="#section"') && html.includes('href="https://example.com"'));
    assert.ok(!html.includes('/personal-website/personal-website/') && !html.includes('href="javascript:'));
    console.log('mounted paths and safe Markdown passed');
  `], { cwd: process.cwd(), env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '/personal-website' }, encoding: 'utf8' });
  assert.match(result, /passed/);
});
