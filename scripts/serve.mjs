import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createStaticHandler } from './static-handler.mjs';
const root = path.resolve('out');
const port = Number(process.env.PORT || 3000);
try { await fs.access(path.join(root, 'index.html')); } catch { console.error('No static build found. Run npm run build first.'); process.exit(1); }
http.createServer(createStaticHandler(root)).listen(port, '127.0.0.1', () => console.log(`Local static preview: http://localhost:${port}`));
