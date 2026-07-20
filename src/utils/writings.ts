import { getCollection } from 'astro:content';
import { generateExcerpt } from './excerpt';
import { decodeHtmlEntities } from './decodeEntities';

export interface WritingMeta {
  slug: string;
  type: 'md' | 'html';
  title: string;
  subtitle?: string;
  date: Date;
  image?: string;
  excerpt: string;
  body?: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) data[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return { data, content: match[2] };
}

async function loadHtmlWritings(): Promise<WritingMeta[]> {
  const modules = import.meta.glob<string>('../content/writings/*.html', {
    query: '?raw',
    import: 'default',
  });

  return Promise.all(
    Object.entries(modules).map(async ([path, load]) => {
      const raw = await load();
      const { data, content } = parseFrontmatter(raw);
      const slug = path.replace(/.*\/([^/]+)\.html$/, '$1');
      return {
        slug,
        type: 'html' as const,
        title: decodeHtmlEntities(data.title ?? slug),
        subtitle: data.subtitle ? decodeHtmlEntities(data.subtitle) : undefined,
        date: new Date(data.date ?? Date.now()),
        image: data.image,
        excerpt: data.excerpt ? decodeHtmlEntities(data.excerpt) : generateExcerpt(content, 'html'),
        body: content,
      };
    })
  );
}

export async function getAllWritings(): Promise<WritingMeta[]> {
  const mdEntries = await getCollection('writings');
  const htmlWritings = await loadHtmlWritings();

  const mdWritings: WritingMeta[] = mdEntries.map(e => ({
    slug: e.slug,
    type: 'md' as const,
    title: decodeHtmlEntities(e.data.title),
    subtitle: e.data.subtitle ? decodeHtmlEntities(e.data.subtitle) : undefined,
    date: e.data.date,
    image: e.data.image,
    excerpt: e.data.excerpt ? decodeHtmlEntities(e.data.excerpt) : generateExcerpt(e.body ?? '', 'md'),
  }));

  return [...mdWritings, ...htmlWritings].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

export { loadHtmlWritings as getHtmlWritings };
