// Base-præfiks til preview-hosts, hvor sitet ligger i en undermappe
// (fx GitHub Pages: dittema1235.github.io/koebeafhaengig/).
// I produktion (www.koebeafhaengig.dk) bygges uden base, og alle
// links bliver uforandret absolute fra roden.
const raw = import.meta.env.BASE_URL ?? '/';
export const base = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** Byg et site-absolute link, fx u('/bloggen') → '/koebeafhaengig/bloggen' i preview. */
export function u(path: string): string {
  return `${base}${path}`;
}
