import React from 'react';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import App, { ROUTE_META } from './app.jsx';
import { structuredData as aiIntegrationsData } from './pages/ai-integrations.jsx';

// Pre-rendering: the build renders these routes to real HTML (scripts/prerender.mjs), so search
// engines and AI crawlers that don't run JavaScript still get the whole page. The browser then
// hydrates it (main.jsx). Every other route still ships an empty #root and renders in the browser.
// To pre-render another route: add it here with its ROUTE_META entry and any JSON-LD for <head>.
// Its components must render the same on the server as on first render in the browser: no
// window or document while rendering (effects are fine).
export const PRERENDERED = {
  '/ai-integrations': { meta: ROUTE_META.aiIntegrations, jsonLd: aiIntegrationsData },
};

/** The route's markup for #root, once every lazy part has loaded (the same tree main.jsx hydrates). */
export function render(path) {
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, done) { html += chunk; done(); },
      final(done) { resolve(html); done(); },
    });
    const stream = renderToPipeableStream(
      <React.StrictMode>
        <App path={path} />
      </React.StrictMode>,
      {
        onAllReady() { stream.pipe(sink); },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
