import data from '../data/articles.json';

export const prerender = true;
export function GET() {
  const base = 'https://www.koebeafhaengig.dk';
  const routes = ['/', '/bloggen', '/blog', '/kontakt', '/om-ditte', '/individuelle-samtaler', '/privatlivspolitik', '/handelsbetingelser', ...data.modern.map(p => `/bloggen/${p.slug}`), ...data.legacy.map(p => `/blog/${p.slug}`), '/blog/categories/131178'];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${base}${route}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
