# Poolnautics marketing site

Formerly PoolLogic. From launch the site is getpoolnautics.com, and poollogic.app (apex and www) 301s to it, keeping the path and query. The app still lives at app.poollogic.app (and the customer portal at portal.poollogic.app), so links and mockup address bars that point there stay as they are until the app moves.

React 18 + Vite 5 + Tailwind 3, deployed to Cloudflare Pages by `.github/workflows/deploy.yml` on every push to `main`. The homepage (`/`) is `pages/landing.jsx` with its sections in `landing/`.

## Pre-rendering

Three routes are pre-rendered: the homepage (`pages/landing.jsx`, `landing/`), `/ai-integrations` (`pages/ai-integrations.jsx`, `landing/ai/`, numbers in `aiFacts.js`) and `/pricing` (`pages/pricing.jsx`, prices in `pricingPlans.js`). `npm run build` also renders them on the server (`entry-server.jsx`, then `scripts/prerender.mjs`): the homepage to `dist/index.html`, the others to `dist/ai-integrations.html` and `dist/pricing.html`. Each has its own `<head>` (title, description, canonical, Open Graph, JSON-LD, stylesheets) and its full markup in `#root`, which is marked with its route (`data-prerendered`). `main.jsx` hydrates that markup only on the page it was made for.

- **Serving.** Cloudflare Pages serves `/`, `/ai-integrations` and `/pricing` from those files (200; `/index.html`, the trailing-slash and `.html` URLs 308 to them).
- **Structured data.** The product, its plans' prices and its feature lists are one SoftwareApplication (`#software`) in `index.html`, on every page; keep it in step with `pricingPlans.js` and the plan lists in `pages/pricing.jsx`. `public/llms.txt` sums up the product and plans for AI tools: update it with them too.
  - The pages rendered in the browser (`/pricing`, `/contact`, `/terms` …) get `dist/app-shell.html`, the empty page. It's Vite's `index.html` as built, saved before the homepage replaces it.
  - `public/_redirects` sends each of them there with its own `/x /app-shell 200` rule. Cloudflare applies these rules before real files, so never add a `/*` rule: it would capture every file and the homepage.
  - An address with no rule and no file gets Cloudflare's default, `index.html`: the homepage, which is also what the app shows there. A route added to `app.jsx` needs its rule, and `npm run check:seo` fails without it.
  - `vite preview` follows the same rules (`vite.config.js`).
- **Same render everywhere.** A pre-rendered page must render the same on the server as on first render in the browser: no `window`, `document` or device checks while rendering.
  - For a part drawn per device, render it once `useHydrated()` is true (`landing/useHydrated.js`), or use `useSyncExternalStore` with a server snapshot.
  - Use `useBrowserLayoutEffect` instead of `useLayoutEffect`.
  - Put a `<style>`'s CSS in `dangerouslySetInnerHTML`, never as a child: the server escapes `>` and `&`, and the browser's text then doesn't match.
  - A mismatch makes React throw the markup away and redraw. Test in a production build: there's no warning in development, because `npm run dev` doesn't pre-render.
- **Before the scripts run.** The homepage's first script (`landing/firstPaint.js`, inlined by the build) adds `pv-pending` to `<html>`, so the first paint matches what the scripts will draw (hero.css, "Before the scripts run").
  - The sections below the hero load their code late (`pages/landing.jsx`), but their markup and stylesheets are in the page from the start.
- **Adding a route.** To pre-render another route, add it to `PRERENDERED` in `entry-server.jsx` and to `ROUTE_PAGES` in `vite.config.js`, remove its `_redirects` rule, and add it to `ROUTES` in the check.

## SEO guardrails

These apply to the homepage hero for now: `<section class="hero">`, including the dashboard preview inside it (`landing/Hero.jsx`, `landing/hero.css`, `landing/useHeroScrollFx.js`, `landing/preview/`), and to `/ai-integrations` (its hero, and the whole page's text in the served HTML). `scripts/seo-check.mjs` enforces them (`npm run check:seo` after `npm run build`), and the deploy workflow runs it before deploying, so a broken rule stops the deploy.

1. **Crawlable text.** Search crawlers must be able to read the hero's `<h1>` and copy without waiting on animation.
   - Keep the headline and copy as real text in the DOM, never in images, canvas or SVG paths. Animate it with opacity and transforms only. Never mount it late, or after a scroll or timer.
   - The `<title>` and meta description in `index.html` must stay meaningful.
   - The homepage, `/ai-integrations` and `/pricing` are pre-rendered. The check fails if any of their served HTML lacks any of these:
     - the `<h1>`
     - any `<h2>` the browser shows
     - its canonical URL
     - its JSON-LD
     - its route mark
   - The check also fails if the empty page gains content, or if a route in `app.jsx` has no `_redirects` rule.

2. **Asset weight.** The laptop, phone and dashboard mockups are built in HTML, CSS and SVG, and they stay that way.
   - Use no PNG, JPEG or GIF in hero code.
   - Any image or video added must be WebP or AVIF (or SVG, MP4 or WebM) and use `loading="lazy"`, unless it is in the first screen, where it uses `fetchPriority="high"`.
   - An image file the hero imports must be 150 KB or smaller.

3. **Layout shift.** Once first rendered, nothing in the hero may move or resize.
   - Give every image, video, mockup and animated container a fixed width and height (or aspect ratio) before its scripts or fonts load.
   - Animate with `transform` and `opacity`, never with properties that change layout (`height`, `top`, `margin`, …).
   - Keep the metric-matched font fallbacks (`landing/landing.css`) in place.
   - The check compares the layout boxes of each hero's eyebrow, headline, copy, button, fine print (the homepage's checkmarks row) and mockup at first render with their boxes after load, allowing ±2px. It also scrolls through the hero and keeps Google's layout-shift score for it under 0.01, on desktop and phone.

To widen the guardrails to more of the site, extend `SOURCE` and `ROUTES` at the top of `scripts/seo-check.mjs`, and update this section.

## Deploys

Don't put a long or `immutable` Cache-Control on `/assets/*` in `public/_headers`. Cloudflare's fallback answers missing asset URLs with `index.html` (now the pre-rendered homepage), and a long cache pins that HTML under a JS URL, which took the site down once. After a push, load the live homepage and `/pricing` in a fresh browser and check for module errors.
