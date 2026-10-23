import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Every route shares one index.html, and each page is a lazy chunk, so the
// browser would only find a page's code after the main script has run. This
// adds a small inline script to <head> that, for the current path, starts
// downloading that page's JS, CSS and fonts right away, in parallel with
// the main script. Hashed file names come from the build itself.
// Every link is crossorigin, as Vite's own module and stylesheet links are,
// so the browser reuses these downloads. Fonts start once the main script
// has run (DOMContentLoaded), so they don't share the connection with it; the
// text renders in a metric-matched fallback until they arrive (landing.css).
const ROUTE_PAGES = { '/': 'pages/landing.jsx', '/pricing': 'pages/pricing.jsx', '/reserve': 'pages/reserve.jsx' };
const MARKETING_FONTS = ['/fonts/Satoshi-Regular.woff2', '/fonts/Satoshi-Medium.woff2', '/fonts/Satoshi-Bold.woff2'];
const SITE_FONTS = ['/fonts/Geist.woff2']; // the rest of the site

function routePreloads() {
  return {
    name: 'route-preloads',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        const chunks = Object.values(bundle).filter((c) => c.type === 'chunk');
        const entry = chunks.find((c) => c.isEntry);
        const depsOf = (page) => {
          const js = [];
          const css = [];
          const seen = new Set();
          const walk = (c) => {
            if (!c || c === entry || seen.has(c.fileName)) return;
            seen.add(c.fileName);
            js.push(`/${c.fileName}`);
            for (const f of c.viteMetadata?.importedCss ?? []) css.push(`/${f}`);
            for (const f of c.imports) walk(bundle[f]);
          };
          // Match on contents: a page chunk that others import from has no facade module.
          walk(chunks.find((c) => (c.moduleIds ?? Object.keys(c.modules)).some((id) => id.endsWith(page))));
          return { js, css, font: MARKETING_FONTS };
        };
        const routes = { '*': { js: [], css: [], font: SITE_FONTS } };
        for (const [path, page] of Object.entries(ROUTE_PAGES)) routes[path] = depsOf(page);
        const script = `(function(){var R=${JSON.stringify(routes)};var p=location.pathname.replace(/\\/+$/,'')||'/';var r=R[p]||R['*'],h=document.head;
function l(rel,href,as,low){var e=document.createElement('link');e.rel=rel;e.href=href;if(as)e.as=as;if(as==='font')e.type='font/woff2';e.crossOrigin='';if(low)e.fetchPriority='low';h.appendChild(e);}
r.css.forEach(function(f){l('preload',f,'style');});r.js.forEach(function(f){l('modulepreload',f);});var fonts=function(){r.font.forEach(function(f){l('preload',f,'font',1);});};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fonts):fonts();})();`;
        // Right after the viewport meta, ahead of the inline styles and the main script.
        return html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n<script>${script}</script>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), routePreloads()],
  build: {
    // ".r2" in every built file name: new URLs for all JS and CSS, so nothing
    // cached under an old name (see public/_headers) can be served for them.
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].r2.js',
        chunkFileNames: 'assets/[name]-[hash].r2.js',
        assetFileNames: 'assets/[name]-[hash].r2[extname]',
      },
    },
    target: 'es2020',
    cssMinify: true,
    chunkSizeWarningLimit: 600,
  },
});
