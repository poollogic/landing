# Poolnautics marketing site

Formerly PoolLogic. From launch the site is getpoolnautics.com, and poollogic.app (apex and www) 301s to it, keeping the path and query. The app still lives at app.poollogic.app (and the customer portal at portal.poollogic.app), so links and mockup address bars that point there stay as they are until the app moves.

React 18 + Vite 5 + Tailwind 3, deployed to Cloudflare Pages by `.github/workflows/deploy.yml` on every push to `main`. The homepage (`/`) is `pages/landing.jsx` with its sections in `landing/`.

## Pre-rendering

`/ai-integrations` (`pages/ai-integrations.jsx`, `landing/ai/`, numbers in `aiFacts.js`) is pre-rendered: `npm run build` also renders it on the server (`entry-server.jsx`, then `scripts/prerender.mjs`) to `dist/ai-integrations.html`, with its own `<head>` (title, description, canonical, Open Graph, JSON-LD, stylesheets) and its full markup in `#root`, and `main.jsx` hydrates it. Cloudflare Pages serves that file at `/ai-integrations` (200; the trailing-slash and `.html` URLs 308 to it). Every other route still ships an empty `#root`. A pre-rendered page must render the same on the server as on first render in the browser: no `window` or `document` while rendering. To pre-render another route, add it to `PRERENDERED` in `entry-server.jsx` and to `ROUTE_PAGES` in `vite.config.js`.

## SEO guardrails

These apply to the homepage hero for now: `<section class="hero">`, including the dashboard preview inside it (`landing/Hero.jsx`, `landing/hero.css`, `landing/useHeroScrollFx.js`, `landing/preview/`), and to `/ai-integrations` (its hero, and the whole page's text in the served HTML). `scripts/seo-check.mjs` enforces them (`npm run check:seo` after `npm run build`), and the deploy workflow runs it before deploying, so a broken rule stops the deploy.

1. **Crawlable text.** Search crawlers must be able to read the hero's `<h1>` and copy without waiting on animation.
   - Keep the headline and copy as real text in the DOM, never in images, canvas or SVG paths. Animate it with opacity and transforms only. Never mount it late, or after a scroll or timer.
   - The `<title>` and meta description in `index.html` must stay meaningful.
   - `/ai-integrations` is pre-rendered, and the check fails if its served HTML lacks the `<h1>`, any `<h2>` the browser shows, its canonical URL or its JSON-LD.
   - Known gap: the homepage isn't pre-rendered yet, so the HTML the server sends has an empty `#root` and the text appears only after JavaScript runs. The check reports this as a warning. When it's pre-rendered, set `STRICT_STATIC_TEXT = true` in the check so it becomes a failure.

2. **Asset weight.** The laptop, phone and dashboard mockups are built in HTML, CSS and SVG, and they stay that way.
   - Use no PNG, JPEG or GIF in hero code.
   - Any image or video added must be WebP or AVIF (or SVG, MP4 or WebM) and use `loading="lazy"`, unless it is in the first screen, where it uses `fetchPriority="high"`.
   - An image file the hero imports must be 150 KB or smaller.

3. **Layout shift.** Once first rendered, nothing in the hero may move or resize.
   - Give every image, video, mockup and animated container a fixed width and height (or aspect ratio) before its scripts or fonts load.
   - Animate with `transform` and `opacity`, never with properties that change layout (`height`, `top`, `margin`, …).
   - Keep the metric-matched font fallbacks (`landing/landing.css`) in place.
   - The check compares the layout boxes of each hero's eyebrow, headline, copy, button, fine print and mockup at first render with their boxes after load, allowing ±2px. It also scrolls through the hero and keeps Google's layout-shift score for it under 0.01, on desktop and phone.

To widen the guardrails to more of the site, extend `SOURCE` and `ROUTES` at the top of `scripts/seo-check.mjs`, and update this section.

## Deploys

Don't put a long or `immutable` Cache-Control on `/assets/*` in `public/_headers`. The SPA fallback in `_redirects` answers missing asset URLs with `index.html`, and a long cache pins that HTML under a JS URL, which took the site down once. After a push, load the live homepage and `/pricing` in a fresh browser and check for module errors.
