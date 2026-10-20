import fs from 'node:fs/promises';
import path from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };
export function createStaticHandler(directory) {
  const root = path.resolve(directory);
  return async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
      let file = path.resolve(root, `.${pathname}`);
      if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
      try {
        const stat = await fs.stat(file);
        if (stat.isDirectory()) file = path.join(file, 'index.html');
        const body = await fs.readFile(file);
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }); res.end(body);
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
        const locale = pathname === '/de' || pathname.startsWith('/de/') ? 'de' : pathname === '/en' || pathname.startsWith('/en/') ? 'en' : null;
        const errorFile = locale ? path.join(root, 'errors', locale, 'index.html') : path.join(root, '404.html');
        try { res.end(await fs.readFile(errorFile)); } catch { res.end('Page not found / Seite nicht gefunden'); }
      }
    } catch { res.writeHead(400); res.end('Invalid request'); }
  };
}
