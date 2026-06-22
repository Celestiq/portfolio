import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const theme = yaml.load(readFileSync(join(root, 'theme.yaml'), 'utf-8'));

const lines = [
  '/* AUTO-GENERATED — do not edit by hand. Edit theme.yaml and re-run the build. */',
  ':root {',
  `  --font-serif: ${theme.fonts.serif};`,
  `  --font-sans: ${theme.fonts.sans};`,
  `  --font-mono: ${theme.fonts.mono};`,
  `  --color-bg: ${theme.colors.background};`,
  `  --color-text: ${theme.colors.text_primary};`,
  `  --color-text-secondary: ${theme.colors.text_secondary};`,
  `  --color-accent: ${theme.colors.accent};`,
  `  --color-border: ${theme.colors.border};`,
  `  --max-width: ${theme.layout.max_width};`,
  `  --section-spacing: ${theme.layout.section_spacing};`,
  `  --radius-thumbnail: ${theme.radius.thumbnail};`,
  '}',
];

mkdirSync(join(root, 'src/styles'), { recursive: true });
mkdirSync(join(root, 'src/data'), { recursive: true });

writeFileSync(join(root, 'src/styles/theme.css'), lines.join('\n') + '\n');
console.log('✓ Generated src/styles/theme.css');

const siteData = { title: theme.site.title, description: theme.site.description };
writeFileSync(join(root, 'src/data/site.json'), JSON.stringify(siteData, null, 2) + '\n');
console.log('✓ Generated src/data/site.json');
