/**
 * Fetches posts from Substack RSS and writes them to src/content/writings/ as .html files.
 * Run: node scripts/fetch-writings.mjs
 * Existing files are never overwritten.
 */

import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WRITINGS_DIR = join(__dirname, '..', 'src', 'content', 'writings');
const FEED_URL = 'https://aayushessence.substack.com/feed';

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[''""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function unCDATA(str) {
  const m = str.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return m ? m[1] : str;
}

// Extract the inner text of a tag, unwrapping CDATA if present.
function extractTag(xml, tag) {
  const escaped = tag.replace(':', '\\:');
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i');
  const m = xml.match(re);
  return m ? unCDATA(m[1].trim()) : null;
}

// Same but for CDATA-wrapped tags whose bodies may contain the end-tag literally.
// Relies on Substack always wrapping full content in <![CDATA[...]]>.
function extractCDATATag(xml, tag) {
  const escaped = tag.replace(':', '\\:');
  const re = new RegExp(`<${escaped}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escaped}>`, 'i');
  const m = xml.match(re);
  return m ? m[1] : null;
}

function toISODate(rfcDate) {
  const d = new Date(rfcDate);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
}

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(str) {
  if (!str) return str;
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (_, name) => NAMED_ENTITIES[name] ?? `&${name};`);
}

// ── HTML cleaning ──────────────────────────────────────────────────────────

function stripImages(html) {
  return html
    // Substack wraps images in <div class="captioned-image-container">
    .replace(/<div[^>]+captioned-image-container[^>]*>[\s\S]*?<\/div>/gi, '')
    // Any remaining <figure> blocks
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
    // <picture> blocks
    .replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '')
    // Stray <img> tags
    .replace(/<img[^>]*\/?>/gi, '')
    // SVG blocks
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    // Empty anchor wrappers left behind
    .replace(/<a[^>]*>\s*<\/a>/gi, '')
    // Empty paragraphs / divs
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/<div>\s*<\/div>/gi, '')
    .trim();
}

// ── RSS parsing ────────────────────────────────────────────────────────────

function parseItems(xml) {
  const items = [];
  // Split on <item> boundaries — safe here because full content is inside CDATA
  const blocks = xml.split('<item>').slice(1);

  for (const block of blocks) {
    const end = block.indexOf('</item>');
    const item = end !== -1 ? block.slice(0, end) : block;

    const title = extractTag(item, 'title');
    const pubDate = extractTag(item, 'pubDate');
    // <description> is the subtitle/excerpt on Substack
    const description = extractCDATATag(item, 'description') ?? extractTag(item, 'description');
    const content = extractCDATATag(item, 'content:encoded');

    if (!title || !content) continue;

    items.push({
      title: decodeEntities(title),
      date: pubDate ? toISODate(pubDate) : null,
      subtitle: description ? decodeEntities(description.replace(/<[^>]+>/g, '').trim()) : null,
      content,
    });
  }

  return items;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching ${FEED_URL} …`);
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const xml = await res.text();
  const items = parseItems(xml);
  console.log(`Found ${items.length} post(s).\n`);

  let written = 0;
  let skipped = 0;

  for (const item of items) {
    const slug = slugify(item.title);
    if (!slug) { console.warn(`  skip  (could not slugify: "${item.title}")`); continue; }

    const filename = `${slug}.html`;
    const filepath = join(WRITINGS_DIR, filename);

    if (existsSync(filepath)) {
      console.log(`  skip  ${filename}  (already exists)`);
      skipped++;
      continue;
    }

    const fm = ['---'];
    fm.push(`title: "${item.title.replace(/"/g, '\\"')}"`);
    if (item.date) fm.push(`date: ${item.date}`);
    if (item.subtitle) fm.push(`subtitle: "${item.subtitle.replace(/"/g, '\\"')}"`);
    fm.push('---');

    const body = stripImages(item.content);
    writeFileSync(filepath, fm.join('\n') + '\n' + body + '\n', 'utf-8');
    console.log(`  wrote ${filename}`);
    written++;
  }

  console.log(`\nDone — ${written} written, ${skipped} skipped.`);
}

main().catch(err => { console.error(err); process.exit(1); });
