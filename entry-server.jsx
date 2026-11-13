import React from 'react';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import App, { ROUTE_META } from './app.jsx';
import { structuredData as aiIntegrationsData } from './pages/ai-integrations.jsx';
import { structuredData as pricingData } from './pages/pricing.jsx';
import { structuredData as workflowData } from './pages/workflow.jsx';
import { homeFirstPaintScript } from './landing/firstPaint.js';
import { FAQS } from './landing/FaqSection.jsx';

const homeFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

// Pre-rendering: the build renders these routes to real HTML (scripts/prerender.mjs), so search
// engines and AI crawlers that don't run JavaScript still get the whole page. The browser then
// hydrates it (main.jsx). Every other route still ships an empty #root and renders in the browser.
// To pre-render another route: add it here with its ROUTE_META entry, any JSON-LD for <head> and
// any script that must run before the page paints (headScript). Its components must render the same
// on the server as on first render in the browser: no window or document while rendering (effects
// are fine). The homepage goes in dist/index.html itself; the other addresses get an empty page.
export const PRERENDERED = {
  '/': { meta: ROUTE_META.home, headScript: homeFirstPaintScript, jsonLd: [homeFaq] }, // Organization, WebSite, software: index.html
  '/ai-and-automations': { meta: ROUTE_META.aiIntegrations, jsonLd: aiIntegrationsData },
  '/pricing': { meta: ROUTE_META.pricing, jsonLd: pricingData },
  '/workflow': { meta: ROUTE_META.workflow, jsonLd: workflowData },
  // The rest of the indexable pages: their own <head> and text in the served HTML, not the empty page
  // (whose head was the homepage's, canonical included, until JavaScript ran).
  '/contact': { meta: ROUTE_META.contact },
  '/tech-app': { meta: ROUTE_META.techApp },
  '/partners': { meta: ROUTE_META.partners },
  '/partners/kit': { meta: ROUTE_META.partnerKit },
  '/partners/terms': { meta: ROUTE_META.partnerTerms },
  '/terms': { meta: ROUTE_META.terms },
  '/privacy': { meta: ROUTE_META.privacy },
  '/technician-terms': { meta: ROUTE_META.technicianTerms },
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
