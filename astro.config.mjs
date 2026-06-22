import { defineConfig } from 'astro/config';

// Change BASE to '/repo-name' when deploying to username.github.io/repo-name
const BASE = '/';

export default defineConfig({
  site: 'https://celestiq.github.io',
  base: BASE,
  output: 'static',
});
