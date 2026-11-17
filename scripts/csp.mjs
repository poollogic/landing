// The site's Content-Security-Policy, written into dist/_headers as the build's last step (package.json
// "build"), after the pre-rendered pages exist. Browsers then run only this site's own scripts, the
// exact inline scripts the build wrote (each allowed by its sha256, read from the built HTML, so a
// rebuild can't drift from its policy), Cloudflare's Turnstile and Web Analytics; and they send data
// only to this site, its Supabase project, the app's sign-in (the review popup) and those two. An
// injected script, or one added to the site later without updating ALLOW below, is blocked.
//
// Origins come from the build's env where the build uses them (VITE_SUPABASE_URL,
// VITE_REVIEWS_SIGNIN_URL), so a preview build allows its own and nothing else.
//
// CSP_MODE=report-only sends it as Content-Security-Policy-Report-Only: browsers report what it would
// block (in the console) and block nothing, the way to try it on the live site before enforcing it.
// Unset: enforced. `vite preview` sends the same header (vite.config.js), so the SEO check, which fails
// on any console error, also fails on anything this policy blocks before a deploy.
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = new URL('../dist/', import.meta.url).pathname;
const MARKER = '# Content-Security-Policy (scripts/csp.mjs)';

const ALLOW = {
  turnstile: 'https://challenges.cloudflare.com', // landing/Turnstile.jsx: the forms and the review popup
  analytics: 'https://static.cloudflareinsights.com', // Cloudflare Web Analytics, added by Cloudflare at the edge
  analyticsBeacon: 'https://cloudflareinsights.com',
  app: 'https://app.poolnautics.app', // the review popup's sign-in (landing/reviews/config.js)
};

const origin = (url) => { try { return url ? new URL(url).origin : null; } catch { return null; } };

const htmlFiles = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return name === 'assets' ? [] : htmlFiles(path);
  return name.endsWith('.html') ? [path] : [];
});

const sha = (text) => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;
const unescapeAttr = (v) => v.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// Inline scripts the browser runs: no src, and JavaScript (not JSON-LD or other data blocks).
export function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, body] = m;
    if (/\bsrc\s*=/.test(attrs)) continue;
    const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    if (type && type !== 'module' && type !== 'text/javascript' && type !== 'application/javascript') continue;
    if (!body) continue;
    hashes.add(sha(body));
  }
  return hashes;
}

// Inline event handlers the build writes, e.g. the pre-rendered pages' late stylesheets,
// onload="this.media='all'" (scripts/prerender.mjs). Allowed by hash with 'unsafe-hashes': only that
// exact code, never any other handler.
export function inlineHandlerHashes(html) {
  const hashes = new Set();
  for (const m of html.matchAll(/<[a-z][^>]*>/gi)) {
    for (const a of m[0].matchAll(/\son[a-z]+\s*=\s*("([^"]*)"|'([^']*)')/gi)) hashes.add(sha(unescapeAttr(a[2] ?? a[3])));
  }
  return hashes;
}

export function buildPolicy({ hashes, handlers = new Set(), supabase, signin }) {
  const connect = new Set(["'self'", supabase, origin(signin) ?? ALLOW.app, ALLOW.turnstile, ALLOW.analyticsBeacon].filter(Boolean));
  const handlerPart = handlers.size ? `'unsafe-hashes' ${[...handlers].sort().join(' ')}` : '';
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].sort().join(' ')} ${handlerPart} ${ALLOW.turnstile} ${ALLOW.analytics}`.replace(/\s+/g, ' '),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${[...connect].join(' ')}`,
    `frame-src ${ALLOW.turnstile}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function main() {
  // Reviews on with no database address would write a policy that blocks the popup's every call.
  if (process.env.VITE_REVIEWS === '1' && !origin(process.env.VITE_SUPABASE_URL)) {
    throw new Error('csp.mjs: VITE_REVIEWS=1 needs VITE_SUPABASE_URL in the same build, or the policy blocks the reviews.');
  }
  const files = htmlFiles(DIST);
  if (!files.length) throw new Error('csp.mjs: no HTML in dist/. Run it after the build.');
  const hashes = new Set();
  const handlers = new Set();
  for (const f of files) {
    const html = readFileSync(f, 'utf8');
    for (const h of inlineScriptHashes(html)) hashes.add(h);
    for (const h of inlineHandlerHashes(html)) handlers.add(h);
  }
  const policy = buildPolicy({
    hashes,
    handlers,
    supabase: origin(process.env.VITE_SUPABASE_URL),
    signin: process.env.VITE_REVIEWS_SIGNIN_URL,
  });
  const headersPath = join(DIST, '_headers');
  const current = existsSync(headersPath) ? readFileSync(headersPath, 'utf8') : '';
  const kept = current.includes(MARKER) ? current.slice(0, current.indexOf(MARKER)).trimEnd() : current.trimEnd();
  const header = process.env.CSP_MODE === 'report-only' ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  writeFileSync(headersPath, `${kept}\n\n${MARKER}\n/*\n  ${header}: ${policy}\n`);
  console.log(`csp.mjs: ${files.length} pages, ${hashes.size} inline script(s) and ${handlers.size} inline handler(s) allowed by hash; ${header} written to dist/_headers.`);
}

// Run as a script (not imported by its tests). pathToFileURL: a path with a space or other character
// a URL escapes would otherwise never match, and the build would ship with no policy, silently.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
