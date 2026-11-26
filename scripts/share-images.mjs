#!/usr/bin/env node
/* Share images: draws every entry in shareImages.js to public/og/<file>.png, 1200 × 630, from one template.
   npm run og                  every image
   npm run og -- pricing home  just these (shareImages.js keys)
   The template is the share-image reference's (poolnautics-share-images-v3.html, Nov 25, 2026): its CSS
   below is that file's, unchanged, with the site's Satoshi files (public/fonts/) and the Poolnautics
   wordmark (components/brandName.js, the dark-background colours, 44px tall) where it had placeholders.
   The two older images (/og/pool-service-price-increases.png, /og/how-to-raise-prices.png) were drawn
   from the same background, logo and type by hand; they aren't redrawn here.
   Each image is drawn in headless Chrome (CHROME_PATH, or the usual install locations) at 1× and stops
   the run, writing nothing for it, if a font didn't load or any text runs outside its box, the card or
   the image. Needs Node 22+ (global WebSocket). The PNGs are committed: the deploy doesn't run this. */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'node:net';
import { pathToFileURL } from 'node:url';
import { SHARE_IMAGES } from '../shareImages.js';
import { NAME, NAME_PATH, TM_PATH, COLORS } from '../components/brandName.js';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'public/og');
export const WIDTH = 1200;
export const HEIGHT = 630;

const font = (file, weight) => `@font-face{font-family:Satoshi;src:url('${pathToFileURL(join(ROOT, 'public/fonts', file)).href}') format('woff2');font-weight:${weight};font-style:normal;font-display:block}`;

// The reference's CSS, as it is (its page styles, .cap and body padding, left out).
export const CSS = `${font('Satoshi-Regular.woff2', 400)}
${font('Satoshi-Medium.woff2', 500)}
${font('Satoshi-Bold.woff2', 700)}
html,body{margin:0;background:#08090c}
.og{-webkit-font-smoothing:antialiased}
.og{position:relative;width:1200px;height:630px;overflow:hidden;box-sizing:border-box;color:#fff;font-family:Satoshi,ui-sans-serif,system-ui,sans-serif;background:radial-gradient(900px 560px at 80% 34%,rgba(46,133,255,.30),rgba(46,133,255,0) 70%),#08090c}
.og *{box-sizing:border-box}
.og-logo{position:absolute;left:76px;top:60px;height:44px;display:flex;align-items:center;font-size:40px;font-weight:500;letter-spacing:-.02em;color:#fff}
.og-copy{position:absolute;left:76px;top:0;bottom:0;width:540px;display:flex;flex-direction:column;justify-content:center;padding-top:44px}
.og-h{margin:0;font-size:66px;line-height:1.08;font-weight:700;letter-spacing:-.03em;text-wrap:balance;color:#fff}
.og.is-long .og-h{font-size:54px;line-height:1.1}
.og-s{margin:26px 0 0;font-size:30px;line-height:1.42;font-weight:400;color:#a5b1c2;text-wrap:balance}
.og.is-text .og-copy{width:960px}
.og.is-text .og-h{font-size:84px;line-height:1.05}
.og.is-text .og-s{font-size:32px}
.og-label{margin:0 0 24px;font-size:22px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8}
.og-card{position:absolute;right:76px;top:50%;transform:translateY(-44%);width:468px;padding:38px 42px 36px;border-radius:28px;background:#fff;box-shadow:0 40px 90px rgba(0,0,0,.5);color:#0e1117;font-variant-numeric:tabular-nums}
.og-card span{display:block}
.og-k{margin-bottom:8px;font-size:24px;font-weight:600;color:#56657f}
.og-n{margin:6px 0 12px;font-size:66px;line-height:1.05;font-weight:700;letter-spacing:-.03em;white-space:nowrap}
.og-n.is-mid{font-size:54px}
.og-sub{font-size:25px;line-height:1.38;font-weight:500;color:#56657f}
.og-card .og-f{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:24px;padding-top:22px;border-top:2px solid #e3e8f0;font-size:22px;font-weight:600;white-space:nowrap}
.og-card .og-row{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 0;border-top:2px solid #edf1f6;font-size:28px;line-height:1.25;font-weight:500}
.og-card > .og-row:first-child,.og-k + .og-row{border-top:0}
.og-row small{display:block;margin-top:3px;font-size:21px;font-weight:500;color:#56657f}
.og-row b{font-weight:700;white-space:nowrap}
.og-card .og-l{display:flex;align-items:center;gap:16px;min-width:0}
.og-chip,.og-tick{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:11px;font-style:normal}
.og-chip{background:#eef1f5;font-size:19px;font-weight:700;color:#0e1117}
.og-tick{background:rgba(16,185,129,.12);color:#10b981}
.og-tick svg{display:block;width:20px;height:20px}
.og-card .og-pill{display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(16,185,129,.12);font-size:21px;font-weight:700;color:#0c855d;white-space:nowrap}
.og-bar{height:12px;margin-top:20px;border-radius:6px;background:#e9edf3;overflow:hidden}
.og-bar i{display:block;height:100%;border-radius:6px;background:#2e85ff}
.og-bar.is-green i{background:#10b981}
.og-btn{margin-top:24px;padding:14px 0;border-radius:14px;background:#0e1117;text-align:center;font-size:23px;font-weight:600;color:#fff}
.og-who{margin:0 6px 8px;font-size:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#56657f}
.og-who.is-r{text-align:right}
.og-bub{width:fit-content;max-width:100%;padding:16px 20px;border-radius:22px;font-size:26px;line-height:1.35;font-weight:500}
.og-bub.is-you{margin:0 0 20px auto;border-bottom-right-radius:8px;background:#0e1117;color:#fff}
.og-bub.is-ai{border-bottom-left-radius:8px;background:#f1f4f8;color:#0e1117}`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The wordmark, 44px tall (about 238px wide), in the dark-background file's colours.
export const LOGO = `<svg viewBox="${NAME.x} ${NAME.y} ${NAME.w} ${NAME.h}" width="${(NAME.w * 44 / NAME.h).toFixed(2)}" height="44" aria-hidden="true" style="display:block"><path d="${NAME_PATH}" fill="${COLORS.dark.name}"/><path d="${TM_PATH}" fill="${COLORS.dark.tm}"/></svg>`;
const TICK = '<i class="og-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>';

const end = (p) => (p.b ? `<b>${esc(p.b)}</b>` : p.pill ? `<span class="og-pill">${esc(p.pill)}</span>` : '');
function row({ icon, text, small, ...rest }) {
  const words = `<span>${esc(text)}${small ? `<small>${esc(small)}</small>` : ''}</span>`;
  const lead = icon === 'tick' ? TICK : icon != null ? `<i class="og-chip">${esc(icon)}</i>` : '';
  return `<div class="og-row">${lead ? `<span class="og-l">${lead}${words}</span>` : words}${end(rest)}</div>`;
}
const footSide = (s) => (typeof s === 'string' ? `<span>${esc(s)}</span>` : end(s));
function part(p) {
  if ('k' in p) return `<span class="og-k">${esc(p.k)}</span>`;
  if ('row' in p) return row(p.row);
  if ('n' in p) return `<span class="og-n${p.mid ? ' is-mid' : ''}">${esc(p.n)}</span>`;
  if ('sub' in p) return `<span class="og-sub">${esc(p.sub)}</span>`;
  if ('bar' in p) return `<span class="og-bar${p.green ? ' is-green' : ''}"><i style="width:${p.bar}%"></i></span>`;
  if ('foot' in p) return `<span class="og-f">${p.foot.map(footSide).join('')}</span>`;
  if ('btn' in p) return `<span class="og-btn">${esc(p.btn)}</span>`;
  if ('who' in p) return `<span class="og-who${p.right ? ' is-r' : ''}">${esc(p.who)}</span>`;
  if ('bubble' in p) return `<span class="og-bub is-${p.from}">${esc(p.bubble)}</span>`;
  throw new Error(`share-images: unknown card part ${JSON.stringify(p)}`);
}

/** One image's markup: the reference's .og block. */
export function imageHtml(img) {
  const cls = ['og', img.label ? 'is-text' : '', img.long ? 'is-long' : ''].filter(Boolean).join(' ');
  const copy = `${img.label ? `<p class="og-label">${esc(img.label)}</p>` : ''}<p class="og-h">${esc(img.headline)}</p>${img.sub ? `<p class="og-s">${esc(img.sub)}</p>` : ''}`;
  const card = img.card ? `<div class="og-card">${img.card.map(part).join('')}</div>` : '';
  return `<div class="${cls}" data-file="${esc(img.file)}"><div class="og-logo">${LOGO}</div><div class="og-copy">${copy}</div>${card}</div>`;
}

const page = (body) => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;

// Run in the page: every font loaded, and nothing outside its box. Returns the problems found.
const CHECK = `(async () => {
  await Promise.all([...document.fonts].map((f) => f.load()));
  await document.fonts.ready;
  const problems = [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => 'font ' + f.weight + ' did not load');
  const og = document.querySelector('.og');
  const inside = (r, b, pad = 0.5) => r.left >= b.left - pad && r.top >= b.top - pad && r.right <= b.right + pad && r.bottom <= b.bottom + pad;
  const name = (el) => el.className ? el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.') : el.tagName.toLowerCase();
  const contentBox = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return { left: r.left + parseFloat(s.paddingLeft), right: r.right - parseFloat(s.paddingRight), top: r.top + parseFloat(s.paddingTop), bottom: r.bottom - parseFloat(s.paddingBottom) }; };
  const image = og.getBoundingClientRect();
  const card = og.querySelector('.og-card'); const copy = og.querySelector('.og-copy'); const logo = og.querySelector('.og-logo');
  // Every line of text, as drawn.
  const walker = document.createTreeWalker(og, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim()) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const host = n.parentElement;
    for (const r of range.getClientRects()) {
      const text = JSON.stringify(n.textContent.trim().slice(0, 40));
      if (!inside(r, image)) problems.push(text + ' runs outside the image');
      if (card && card.contains(host) && !inside(r, contentBox(card))) problems.push(text + ' runs outside the card');
      if (copy.contains(host) && !inside(r, copy.getBoundingClientRect())) problems.push(text + ' runs outside the headline column');
      if (copy.contains(host) && r.top < logo.getBoundingClientRect().bottom) problems.push(text + ' runs into the logo');
    }
  }
  // Boxes whose content is wider than they are (cut off, or spilling past their edge), or, where the box
  // hides what overflows it, taller. (A tight line-height lets letters reach past their line's box, so
  // height is only checked where that would cut them off; the text check above covers the image's edge.)
  for (const el of og.querySelectorAll('*')) {
    if (el.closest('svg')) continue;
    const s = getComputedStyle(el);
    if (s.display === 'inline') continue;
    if (el.scrollWidth > el.clientWidth + 1 || (s.overflow !== 'visible' && el.scrollHeight > el.clientHeight + 1)) problems.push(name(el) + ' overflows (' + el.scrollWidth + '×' + el.scrollHeight + ' in ' + el.clientWidth + '×' + el.clientHeight + ')');
  }
  if (card) {
    const c = card.getBoundingClientRect();
    if (!inside(c, image)) problems.push('the card runs outside the image');
    if (copy.getBoundingClientRect().right > c.left) problems.push('the headline column runs under the card');
    for (const el of card.querySelectorAll('*')) if (!el.closest('svg') && !inside(el.getBoundingClientRect(), contentBox(card))) problems.push(name(el) + ' runs outside the card');
  }
  return problems;
})()`;

function findChrome() {
  return [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser']
    .find((p) => p && existsSync(p));
}
const freePort = () => new Promise((r) => { const s = createServer().listen(0, () => { const { port } = s.address(); s.close(() => r(port)); }); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Headless Chrome with a tiny DevTools client: { send(method, params), close() }. */
export async function openChrome() {
  const chromePath = findChrome();
  if (!chromePath) throw new Error('share-images: Chrome not found – set CHROME_PATH');
  const port = await freePort();
  const profile = mkdtempSync(join(tmpdir(), 'share-images-'));
  const proc = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run',
    '--force-color-profile=srgb', '--allow-file-access-from-files', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
  const close = () => { try { proc.kill(); } catch {} try { rmSync(profile, { recursive: true, force: true }); } catch {} };
  let target;
  for (let i = 0; i < 75 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {}
    if (!target) await sleep(200);
  }
  if (!target) { close(); throw new Error('share-images: Chrome did not start'); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map(); const loads = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { r, j } = pending.get(m.id); pending.delete(m.id); m.error ? j(new Error(m.error.message)) : r(m.result); }
    if (m.method === 'Page.loadEventFired') loads.splice(0).forEach((r) => r());
  };
  const send = (method, params = {}) => new Promise((r, j) => { const n = ++id; pending.set(n, { r, j }); ws.send(JSON.stringify({ id: n, method, params })); });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
  return {
    send,
    async load(url) { const loaded = new Promise((r) => loads.push(r)); await send('Page.navigate', { url }); await loaded; },
    async evaluate(expression) {
      const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (exceptionDetails) throw new Error(`share-images: ${exceptionDetails.exception?.description || exceptionDetails.text}`);
      return result.value;
    },
    async png(clip = { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 }) {
      return Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true })).data, 'base64');
    },
    close() { try { ws.close(); } catch {} close(); },
  };
}

async function main() {
  const keys = process.argv.slice(2);
  const unknown = keys.filter((k) => !SHARE_IMAGES[k]);
  if (unknown.length) throw new Error(`share-images: no entry ${unknown.join(', ')} in shareImages.js`);
  const dir = mkdtempSync(join(tmpdir(), 'share-images-pages-'));
  const chrome = await openChrome();
  const failed = [];
  try {
    for (const key of keys.length ? keys : Object.keys(SHARE_IMAGES)) {
      const img = SHARE_IMAGES[key];
      const file = join(dir, `${img.file}.html`);
      writeFileSync(file, page(imageHtml(img)));
      await chrome.load(pathToFileURL(file).href);
      const problems = await chrome.evaluate(CHECK);
      if (problems.length) { failed.push(`${key} (${img.file}.png):\n    ${[...new Set(problems)].join('\n    ')}`); continue; }
      writeFileSync(join(OUT, `${img.file}.png`), await chrome.png());
      console.log(`drew public/og/${img.file}.png`);
    }
  } finally {
    chrome.close();
    rmSync(dir, { recursive: true, force: true });
  }
  if (failed.length) {
    console.log(`\nNot drawn, text would be clipped or a font is missing:\n  ${failed.join('\n  ')}`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
