# koebeafhaengig.dk

Hjemmeside for psykolog Ditte Munch Andersen om købeafhængighed — genopbygget i [Astro](https://astro.build) som et fuldstændig statisk site.

## Teknologi

- **Astro 5** med statisk output (`output: 'static'`)
- **TypeScript** + `@astrojs/check` ved build
- **cheerio** — bruges kun af migreringsscriptet
- Ingen JS-frameworks, ingen server, ingen database

## Kom i gang

```bash
npm ci          # installér afhængigheder
npm run dev     # udviklingsserver på http://localhost:4321
npm run build   # astro check + build til ./dist
npm run preview # forhåndsvisning af det byggede site
```

## Struktur

```
src/
├── layouts/Layout.astro      # fælles layout, metadata og navigation
├── styles/global.css         # globalt design og responsiv styling
├── data/articles.json        # 25 blogartikler (moderne + legacy)
└── pages/
    ├── index.astro                    # forside med Basis-pakken (3.499 kr.)
    ├── individuelle-samtaler.astro    # om individuelle samtaler
    ├── individuelt-forloeb.astro      # 301-redirect → /individuelle-samtaler
    ├── bloggen/                       # moderne blog (oversigt + [slug])
    ├── blog/                          # ældre blogarkiv, artikler og kategori-redirect
    ├── om-ditte.astro
    ├── kontakt.astro
    ├── handelsbetingelser.astro
    ├── privatlivspolitik.astro
    └── sitemap.xml.js
```

## Indhold og konventioner

- Tilbuddet viser **kun Basis-pakken**; individuelle samtaler oplyses som tilkøb.
- Kontaktmail: `psykolog@dittemunchandersen.dk`
- Gamle ruter (blog, kategorier, individuelt forløb) bevares som redirects, så eksisterende links ikke går tabt.
- Blogindhold ligger i `src/data/articles.json` og deles mellem de moderne (`/bloggen/...`) og legacy (`/blog/...`) ruter.
- `scripts/scrape-content.mjs` er migreringsscriptet, der scrapede det oprindelige site og omskrev kontaktmail og tilbudstekst. Det skal normalt ikke køres igen.

## Deploy

Sitets er statisk og kan hostes hvor som helst:

- Byg med `npm run build` → upload `dist/`.
- Sitemap genereres automatisk på `/sitemap.xml` (`site: https://www.koebeafhaengig.dk`).
- `public/robots.txt` følger med i bygget.
