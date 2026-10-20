import { readEntries } from '../lib/content';
for (const kind of ['projects', 'posts'] as const) {
  const entries = readEntries(kind);
  console.log(`${kind}: validated ${entries.length} translations (${entries.filter((entry) => !entry.draft).length} published).`);
}
