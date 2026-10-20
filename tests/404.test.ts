import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createStaticHandler } from '../scripts/static-handler.mjs';
import { copy } from '../lib/copy';
test('static missing URLs keep HTTP 404 and select localized recovery documents', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-404-test-'));
  try {
    for (const locale of ['en', 'de'] as const) {
      fs.mkdirSync(path.join(root, 'errors', locale), { recursive: true });
      fs.writeFileSync(path.join(root, 'errors', locale, 'index.html'), `<html lang="${locale}"><body><h1>${copy[locale].notFoundTitle}</h1><a href="/${locale}/">${copy[locale].returnHome}</a></body></html>`);
    }
    fs.writeFileSync(path.join(root, '404.html'), '<html lang="en"><body><p>Page not found</p><p lang="de">Seite nicht gefunden</p><a href="/en/">English</a><a href="/de/">Deutsch</a></body></html>');
    const handler = createStaticHandler(root);
    for (const [url, locale] of [['/de/missing/', 'de'], ['/en/missing/', 'en'], ['/de/blog/unknown/', 'de']] as const) {
      let status = 0; let body = '';
      await handler({ url }, { writeHead(code: number) { status = code; }, end(value: Buffer | string) { body = value.toString(); } });
      assert.equal(status, 404); assert.ok(body.includes(`<html lang="${locale}">`)); assert.ok(body.includes(copy[locale].notFoundTitle)); assert.ok(body.includes(`href="/${locale}/"`));
    }
    let status = 0; let body = '';
    await handler({ url: '/fr/missing/' }, { writeHead(code: number) { status = code; }, end(value: Buffer | string) { body = value.toString(); } });
    assert.equal(status, 404); assert.ok(body.includes('lang="de"')); assert.ok(body.includes('href="/en/"') && body.includes('href="/de/"'));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
