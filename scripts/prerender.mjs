#!/usr/bin/env node
/* Pre-render (the last step of `npm run build`): writes each route in entry-server.jsx's PRERENDERED
   to dist/<route>.html, built from dist/index.html with the route's own <head> (title, description,
   canonical, Open Graph, JSON-LD and its stylesheets, so it paints styled before any script runs) and
   its markup inside #root. Cloudflare Pages answers /ai-integrations with dist/ai-integrations.html
   (200, no redirect); vite preview does the same. Then removes the server bundle (.prerender/). */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const SSR = join(ROOT, '.prerender');
const ORIGIN = 'https://getpoolnautics.com';

const entry = readdirSync(join(SSR, 'assets')).find((f) => /^entry-server-.*\.js$/.test(f));
if (!entry) throw new Error('prerender: no server bundle in .prerender/assets – run `vite build --ssr entry-server.jsx --outDir .prerender` first');
const { render, PRERENDERED } = await import(pathToFileURL(join(SSR, 'assets', entry)).href);

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
// Each route's stylesheets, from the table the preload script in <head> already carries (vite.config.js).
const routeTable = JSON.parse(template.match(/var R=(\{.*?\});var p=/)[1]);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// JSON inside <script>: no "</script>" can close it early.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function setTag(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender: index.html has no ${what}`);
  return html.replace(pattern, replacement);
}

for (const [route, { meta, jsonLd: data = [] }] of Object.entries(PRERENDERED)) {
  const url = ORIGIN + meta.path;
  const title = meta.ogTitle || meta.title;
  const description = meta.ogDescription || meta.description;
  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`, '<title>');
  html = setTag(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(meta.description)}">`, 'meta description');
  html = setTag(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical link');
  html = setTag(html, /<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${meta.robots || 'index,follow,max-image-preview:large'}">`, 'robots meta');
  html = setTag(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`, 'og:title');
  html = setTag(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`, 'og:description');
  html = setTag(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url');
  html = setTag(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`, 'twitter:title');
  html = setTag(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(description)}">`, 'twitter:description');

  const css = (routeTable[route]?.css ?? []).map((href) => `<link rel="stylesheet" crossorigin href="${href}">`);
  if (!css.length) throw new Error(`prerender: no stylesheets for ${route} – add it to ROUTE_PAGES in vite.config.js`);
  html = setTag(html, /<\/head>/, `${[...css, ...data.map(jsonLd)].join('\n')}\n</head>`, '</head>');

  const markup = await render(route);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${markup}</div>`, 'empty #root');

  const file = join(DIST, `${route.replace(/^\/|\/$/g, '')}.html`);
  writeFileSync(file, html);
  console.log(`prerendered ${route} → dist/${file.slice(DIST.length + 1)} (${(html.length / 1024).toFixed(0)} KB)`);
}

if (existsSync(SSR)) rmSync(SSR, { recursive: true, force: true });
