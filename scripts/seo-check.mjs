#!/usr/bin/env node
/* SEO guardrails for the homepage hero (see CLAUDE.md → "Homepage hero SEO guardrails"). For now only the
   hero and the dashboard preview inside it (<section class="hero"> on /) are held to these rules: their code
   and their behaviour in the browser. Widen SOURCE / HERO when more of the site should be covered.
   Run after `npm run build`:  npm run check:seo
   Exits 1 if a rule is broken, so CI stops before deploying.

   1. Crawlable text   – the served HTML must carry a title and description; once pre-rendering lands
                         (STRICT_STATIC_TEXT = true) it must also carry the hero's <h1> and copy. In a real
                         browser the hero must show a non-empty <h1> quickly.
   2. Asset weight     – no PNG/JPEG/GIF in the hero code; <img>/<video> must be WebP/AVIF/SVG, lazy-loaded
                         unless marked high priority, and sized; no imported image over the budget.
   3. Layout shift     – load / in headless Chrome (desktop + phone):
                         a) the hero's key elements (headline, copy, button, dashboard preview) must sit in the
                            same layout position and size once fonts and lazy parts have loaded as at first
                            render (±2px). Measured on layout boxes, so transform-based animation is fine.
                         b) scroll through the hero; Google's CLS metric for anything inside it must stay
                            under the budget. (Chrome doesn't report every shift, which is why (a) exists.)
                         Page errors fail too.

   Needs Node 22+ (global WebSocket) and Chrome (CHROME_PATH, or the usual install locations). */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

/* ---------- Settings ---------- */
const STRICT_STATIC_TEXT = false; // flip to true once the build pre-renders page HTML (see CLAUDE.md)
const ROUTES = ['/']; // the homepage
const HERO = 'section.hero'; // the hero, including the dashboard preview
const SOURCE = ['landing/Hero.jsx', 'landing/hero.css', 'landing/useHeroScrollFx.js', 'landing/preview']; // the hero's own code
const IMAGE_BUDGET_KB = 150; // any image file imported by the hero code
// Hero elements that must not move or resize after first render (the dashboard preview is .mockup-holder)
const STABLE = ['.hero-eyebrow', '.hero-title', '.hero-sub', '.hero-cta', '.hero-fine', '.mockup-holder'].map((c) => `${'section.hero'} ${c}`);
const STABLE_TOLERANCE_PX = 2;
const CLS_BUDGET = 0.01; // we hold the new pages at zero; Google's "good" line is 0.1
const H1_BUDGET_MS = 4000; // a rendered, non-empty <h1> must exist by then (headless, no throttling)
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  { name: 'phone', width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
];

const failures = [];
const warnings = [];
const fail = (rule, msg) => failures.push(`[${rule}] ${msg}`);
const warn = (rule, msg) => warnings.push(`[${rule}] ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 1 + 2: static checks ---------- */
function filesUnder(p) {
  const abs = join(ROOT, p);
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return [abs];
  return readdirSync(abs, { recursive: true }).map((f) => join(abs, f)).filter((f) => statSync(f).isFile());
}

function checkSource() {
  const RASTER = /\.(png|jpe?g|gif|bmp|tiff?)\b/i;
  for (const file of SOURCE.flatMap(filesUnder).filter((f) => /\.(jsx?|tsx?|css|html)$/.test(f))) {
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (RASTER.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line)) fail('asset weight', `${rel}:${i + 1} references a PNG/JPEG/GIF – export it as WebP or AVIF (or build it in SVG/CSS)`);
    });
    // Each <img …> / <video …> tag: sized, lazy unless explicitly high priority
    const src = lines.join('\n');
    for (const m of src.matchAll(/<(img|video)\b[^>]*?\/?>/gs)) {
      const tag = m[0], line = src.slice(0, m.index).split('\n').length;
      const where = `${rel}:${line} <${m[1]}>`;
      if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) fail('layout shift', `${where} needs width and height so the browser reserves its space`);
      const priority = /fetch[pP]riority=["{]?["']?high/.test(tag);
      if (!priority && !/loading=["{]?["']?lazy/.test(tag)) fail('asset weight', `${where} needs loading="lazy" (or fetchPriority="high" if it is in the first screen)`);
      const srcAttr = tag.match(/\bsrc=["{]["'`]?([^"'`}\s]+)/);
      if (srcAttr && !/\.(webp|avif|svg|mp4|webm)\b/i.test(srcAttr[1]) && !/^\{?[a-zA-Z_$]/.test(srcAttr[1])) fail('asset weight', `${where} uses ${srcAttr[1]} – use WebP/AVIF/SVG`);
    }
  }
}

function checkImportedImages() {
  // Image files the hero code imports (import x from './y.webp' or new URL('./y.avif', …))
  for (const file of SOURCE.flatMap(filesUnder).filter((f) => /\.(jsx?|tsx?)$/.test(f))) {
    const rel = relative(ROOT, file);
    for (const m of readFileSync(file, 'utf8').matchAll(/['"](\.{1,2}\/[^'"]+\.(?:webp|avif|svg|png|jpe?g|gif))['"]/gi)) {
      const img = join(file, '..', m[1]);
      if (!existsSync(img)) continue;
      const kb = statSync(img).size / 1024;
      if (kb > IMAGE_BUDGET_KB) fail('asset weight', `${rel} imports ${relative(ROOT, img)} – ${kb.toFixed(0)} KB (budget ${IMAGE_BUDGET_KB} KB)`);
    }
  }
}

function checkServedHtml() {
  const file = join(DIST, 'index.html');
  if (!existsSync(file)) { fail('crawlable text', 'dist/index.html is missing – run `npm run build` first'); return; }
  const html = readFileSync(file, 'utf8');
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail('crawlable text', 'dist/index.html has no real <title>');
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail('crawlable text', 'dist/index.html has no meta description');
  const root = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
  const hasCopy = /<h1[\s>]/.test(html) && root && root[1].replace(/<[^>]+>/g, '').trim().length > 200;
  if (!hasCopy) {
    const msg = 'the HTML the server sends has no <h1> or page copy – text only appears after JavaScript runs (pre-rendering not set up yet)';
    STRICT_STATIC_TEXT ? fail('crawlable text', msg) : warn('crawlable text', msg);
  }
}

/* ---------- 1 + 3: real-browser checks ---------- */
function findChrome() {
  const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  return candidates.find((p) => p && existsSync(p));
}

async function waitFor(fn, ms, step = 100) {
  const end = Date.now() + ms;
  for (;;) {
    try { const v = await fn(); if (v) return v; } catch {}
    if (Date.now() > end) return null;
    await sleep(step);
  }
}

async function browserChecks() {
  if (typeof WebSocket === 'undefined') { fail('setup', `Node ${process.version} has no global WebSocket – use Node 22+`); return; }
  const chromePath = findChrome();
  if (!chromePath) { fail('setup', 'Chrome not found – set CHROME_PATH'); return; }

  const PORT = 4317, DEBUG = 9333;
  const server = spawn(join(ROOT, 'node_modules/.bin/vite'), ['preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  const profile = mkdtempSync(join(tmpdir(), 'seo-check-'));
  const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run',
    ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
  const cleanup = () => { try { chrome.kill(); } catch {} try { server.kill(); } catch {} try { rmSync(profile, { recursive: true, force: true }); } catch {} };

  try {
    if (!(await waitFor(async () => (await fetch(`http://localhost:${PORT}/`)).ok, 20000, 250))) { fail('setup', 'vite preview did not start'); return; }
    const target = await waitFor(async () => (await (await fetch(`http://127.0.0.1:${DEBUG}/json/list`)).json()).find((t) => t.type === 'page'), 15000, 200);
    if (!target) { fail('setup', 'Chrome did not start'); return; }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const pending = new Map(); const errors = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
      if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description?.split('\n')[0] || m.params.exceptionDetails.text);
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url || '')) errors.push(m.params.entry.text);
    };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
    await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
    // Observe layout shifts from the very first paint
    await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__seo = { cls: 0, shifts: [], t0: performance.now() };
      const inScope = (e) => (e.sources || []).some((s) => { const n = s.node && (s.node.nodeType === 1 ? s.node : s.node.parentElement); return n && n.closest('${HERO}'); });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput && inScope(e)) { window.__seo.cls += e.value;
        window.__seo.shifts.push((e.sources || []).map((s) => s.node ? (s.node.id ? '#' + s.node.id : (s.node.className || s.node.nodeName).toString().slice(0, 50)) : '?').join(', ') + ' (' + e.value.toFixed(4) + ')'); } })
        .observe({ type: 'layout-shift', buffered: true });` });

    for (const route of ROUTES) {
      for (const vp of VIEWPORTS) {
        const label = `${route} @ ${vp.name}`;
        errors.length = 0;
        await send('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: vp.deviceScaleFactor, mobile: vp.mobile });
        await send('Page.navigate', { url: `http://localhost:${PORT}${route}` });
        const t0 = Date.now();
        // Rule 1 (rendered): a visible, non-empty <h1>
        const h1 = await waitFor(() => ev(`(() => { const h = document.querySelector('h1'); return h && h.textContent.trim().length > 10 && h.getBoundingClientRect().height > 0 ? h.textContent.trim() : null; })()`), H1_BUDGET_MS);
        if (!h1) fail('crawlable text', `${label}: no visible <h1> within ${H1_BUDGET_MS / 1000}s`);
        const h1Ms = Date.now() - t0;
        // Rule 3a: layout boxes (offset chain, so transforms are ignored) at first render vs. after loading
        const boxes = `(() => { const out = {}; for (const sel of ${JSON.stringify(STABLE)}) { const el = document.querySelector(sel); if (!el) { out[sel] = null; continue; }
          let x = 0, y = 0; for (let n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; } out[sel] = [x, y, el.offsetWidth, el.offsetHeight]; } return out; })()`;
        const first = await ev(boxes);
        await ev('document.fonts.ready.then(() => true)');
        await sleep(2500);
        const settled = await ev(boxes);
        let moved = 0;
        for (const sel of STABLE) {
          const a = first?.[sel], b = settled?.[sel], name = sel.replace('section.hero ', '');
          if (!a || !b) { fail('layout shift', `${label}: ${name} ${a ? 'disappeared' : 'was not there at first render'}`); moved++; continue; }
          const d = a.map((v, i) => b[i] - v);
          if (d.some((v) => Math.abs(v) > STABLE_TOLERANCE_PX)) { moved++; fail('layout shift', `${label}: ${name} moved/resized after first render (x ${d[0]}, y ${d[1]}, w ${d[2]}, h ${d[3]} px) – reserve its space up front`); }
        }
        // Scroll through the hero in steps until it has left the screen
        if (!(await ev(`!!document.querySelector('${HERO}')`))) fail('setup', `${label}: ${HERO} not found`);
        for (let k = 0; k < 40; k++) {
          const done = await ev(`(() => { const h = document.querySelector('${HERO}'); if (!h || h.getBoundingClientRect().bottom <= 0) return true; scrollTo({ top: scrollY + innerHeight * 0.5, behavior: 'instant' }); return false; })()`);
          if (done) break;
          await sleep(250);
        }
        await sleep(1200);
        const r = await ev('({ cls: window.__seo.cls, shifts: window.__seo.shifts.slice(0, 5) })');
        const cls = +(r?.cls ?? 0).toFixed(4);
        if (cls > CLS_BUDGET) fail('layout shift', `${label}: hero CLS ${cls} (budget ${CLS_BUDGET}) – shifted: ${r.shifts.join(' | ')}`);
        if (errors.length) fail('errors', `${label}: ${[...new Set(errors)].slice(0, 3).join(' | ')}`);
        console.log(`  ${cls <= CLS_BUDGET && h1 && !moved ? '✓' : '✗'} ${label.padEnd(20)} hero CLS ${cls.toFixed(4)}   ${moved ? moved + ' element(s) moved' : 'nothing moved'}   h1 in ${h1 ? h1Ms + 'ms' : '—'}${h1 ? `  “${h1.slice(0, 48)}${h1.length > 48 ? '…' : ''}”` : ''}`);
      }
    }
    ws.close();
  } finally {
    cleanup();
  }
}

/* ---------- Run ---------- */
console.log('Homepage hero SEO guardrails');
checkSource();
checkImportedImages();
checkServedHtml();
await browserChecks();
for (const w of warnings) console.log(`  ⚠ ${w}`);
if (failures.length) {
  console.log(`\n${failures.length} problem${failures.length > 1 ? 's' : ''}:`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nAll homepage hero SEO guardrails pass${warnings.length ? ` (${warnings.length} warning${warnings.length > 1 ? 's' : ''})` : ''}.`);
