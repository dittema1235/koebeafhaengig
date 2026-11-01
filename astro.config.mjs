import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.koebeafhaengig.dk',
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'never'
});
