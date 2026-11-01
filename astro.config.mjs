import { defineConfig } from 'astro/config';

const githubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: githubPages ? 'https://dittema1235.github.io' : 'https://www.koebeafhaengig.dk',
  base: githubPages ? '/koebeafhaengig' : '/',
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'never'
});
