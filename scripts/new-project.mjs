#!/usr/bin/env node
// Scaffolds a new src/content/projects/<slug>.md entry.
// Usage: npm run new:project -- "Project Title" "https://github.com/you/repo"

import fs from 'node:fs';
import path from 'node:path';

const [title, link] = process.argv.slice(2);

if (!title) {
  console.error('Usage: npm run new:project -- "Project Title" [link]');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const dir = path.join(process.cwd(), 'src/content/projects');
const filePath = path.join(dir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Already exists: ${filePath}`);
  process.exit(1);
}

const frontmatter = [
  '---',
  `title: ${title}`,
  'description: ""',
  ...(link ? [`link: ${link}`] : []),
  '---',
  '',
  'Write the full project write-up here in Markdown.',
  '',
].join('\n');

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, frontmatter);

console.log(`Created ${path.relative(process.cwd(), filePath)}`);
console.log('Fill in "description" (shown on the /projects card) and write the full body below the frontmatter.');
