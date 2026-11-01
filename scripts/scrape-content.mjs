import * as cheerio from 'cheerio';
import { mkdir, writeFile } from 'node:fs/promises';

const modern = [
  ['hvad-er-koebeafhaengighed', 'Grundviden', 'Hvad er købeafhængighed?', 'Købeafhængighed er mere end dårlige vaner. Det er et psykologisk mønster, der driver adfærden — og som viljestyrke alene sjældent kan stoppe.', '10 min.'],
  ['7-tegn-koebeafhaengighed', 'Selvtest', '7 tegn på købeafhængighed', 'Genkender du disse mønstre? Her er syv tegn, der kan hjælpe dig med at vurdere, om dit forbrug er gået fra vane til afhængighed.', '8 min.'],
  ['forskel-shopping-koebeafhaengighed', 'Forståelse', 'Hvad er forskellen på shopping og købeafhængighed?', 'Alle shopper. Men hvornår krydser man grænsen? En klar gennemgang af forskellen — og hvor grænsen går.', '9 min.'],
  ['hjernen-naar-du-shopper', 'Psykologi', 'Hvad sker der i hjernen, når du shopper?', 'Dopamin, belønning og impulskontrol — en forklaring på, hvad der sker i hjernen, og hvorfor viljestyrke sjældent er nok.', '9 min.'],
  ['overspisning-koebeafhaengighed', 'Hverdagsafhængighed', 'Overspisning og købeafhængighed — er det det samme?', 'De ser forskellige ud, men deler den samme psykologiske motor. Forstår du forbindelsen, er du halvvejs til at forstå, hvordan du kan ændre det.', '9 min.'],
  ['koebeafhaengighed-og-parforhold', 'Parforhold', 'Når købeafhængighed ødelægger tilliden i parforholdet', 'Skjult forbrug skader parforholdet — uanset om kontoen er i plus eller minus. Her er to meget forskellige oplevelser af den samme krise.', '10 min.']
];

const legacySlugs = [
  '40524-hvad-der-sker-i-din-hjerne-paa-black',
  '40704-din-hjerne-snyder-dig-til-at-bruge-for',
  '40706-er-du-endt-i-en-ond-cirkel-af-daarlig',
  '40708-mangler-du-viljestyrke',
  '40710-alle-de-andre-koeber-jo-meget-mere',
  '40711-gaar-dine-indkoeb-ud-over-dit-forhold',
  '40712-er-du-allergladest-naar-du-koeber-nyt',
  '40713-gaar-oekonomien-ud-over-din-nattesoevn',
  '40714-kender-du-de-4-faser-af-et-indkoeb-som',
  '40715-er-du-en-stress-shopper',
  '40716-nogle-former-for-egenomsorg-er-dyrere',
  '40717-hvem-tager-ansvar-for-penge-hjemme-hos',
  '40718-ja-du-kan-vaere-fysisk-afhaengig-af-at',
  '40719-koeber-du-for-meget',
  '40726-hvad-loeber-du-fra',
  '40728-hvordan-har-selvvaerdet-det',
  '40730-men-hvem-bliver-dog-afhaengig-af-at',
  '40731-jeg-har-ikke-noget-problem-jeg-koeber',
  '40732-naar-du-overtaler-dig-selv-til-at-koebe'
];

async function load(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; content migration)' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return cheerio.load(await response.text());
}

function cleanHtml($, root) {
  root.find('script, style, noscript, form, input, button').remove();
  root.find('*').each((_, element) => {
    const node = $(element);
    for (const name of Object.keys(element.attribs || {})) {
      if (name.startsWith('on') || ['class', 'id', 'style', 'data-simplero-section-id'].includes(name)) node.removeAttr(name);
    }
    const href = node.attr('href');
    if (href?.startsWith('mailto:kontakt@koebeafhaengig.dk')) node.attr('href', 'mailto:psykolog@dittemunchandersen.dk');
  });
  return (root.html() || '')
    .replaceAll('kontakt@koebeafhaengig.dk', 'psykolog@dittemunchandersen.dk')
    .replace('Mit forløb tilbyder begge dele: et selvstændigt forløb såvel som pakker med samtaler og løbende sparring.', 'Onlineforløbet er et selvstudie, og individuelle samtaler kan tilkøbes efter behov.');
}

const modernData = [];
for (const [slug, category, fallbackTitle, excerpt, readingTime] of modern) {
  const $ = await load(`https://www.koebeafhaengig.dk/bloggen/${slug}`);
  const scope = $('.script_section').last();
  const heading = scope.find('.article-header h1, .post-hero h1, h1').first().text().trim() || fallbackTitle;
  const article = scope.find('article').first().length ? scope.find('article').first() : scope.find('.article-body').first();
  modernData.push({ slug, category, title: heading, excerpt, readingTime, content: cleanHtml($, article) });
  console.log('modern', slug);
}

const legacyData = [];
for (const slug of legacySlugs) {
  const $ = await load(`https://www.koebeafhaengig.dk/blog/${slug}`);
  const title = $('.blog-post__title').first().text().trim() || $('title').first().text().trim();
  const body = $('.blog-post__body').first();
  const image = $('.blog-post__asset img').first().attr('src') || '';
  const date = $('.blog-post__date').first().text().replace(/\s+/g, ' ').trim();
  const readingTime = $('.blog-post__reading_time').first().text().replace(/\s+/g, ' ').trim();
  const text = body.text().replace(/\s+/g, ' ').trim();
  legacyData.push({ slug, title, image, date, readingTime, excerpt: text.slice(0, 190) + (text.length > 190 ? '…' : ''), content: cleanHtml($, body) });
  console.log('legacy', slug);
}

await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/articles.json', import.meta.url), JSON.stringify({ modern: modernData, legacy: legacyData }, null, 2));
