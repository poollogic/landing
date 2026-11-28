import React from 'react';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import App, { ROUTE_META } from './app.jsx';
import { structuredData as aiIntegrationsData } from './pages/ai-integrations.jsx';
import { structuredData as claudeData } from './pages/claude.jsx';
import { structuredData as pricingData } from './pages/pricing.jsx';
import { structuredData as workflowData } from './pages/workflow.jsx';
import { structuredData as billingData } from './pages/billing.jsx';
import { structuredData as routeSoftwareData } from './pages/route-software.jsx';
import { structuredData as mileageData } from './pages/mileage-tracking.jsx';
import { structuredData as fleetData } from './pages/fleet-management.jsx';
import { structuredData as priceData } from './pages/price-increases.jsx';
import { structuredData as guideRaisePricesData } from './pages/guide-raise-prices.jsx';
import { structuredData as guideStartBusinessData } from './pages/guide-start-business.jsx';
import { structuredData as guideChooseSoftwareData } from './pages/guide-choose-software.jsx';
import { structuredData as guideChemicalsData } from './pages/guide-chemicals.jsx';
import { structuredData as guideStabilizerData } from './pages/guide-stabilizer.jsx';
import { structuredData as guidesData } from './pages/guides.jsx';
import { structuredData as switchSoftwareData } from './pages/switch-software.jsx';
import { structuredData as techAppData, appBanner } from './pages/tech-app.jsx';
import { homeFirstPaintScript } from './landing/firstPaint.js';
import { FAQS } from './landing/FaqSection.jsx';
import { QUESTIONS, questionAnswerText } from './landing/QuestionsSection.jsx';

// The homepage's one FAQPage: "Before you choose" (#questions) first, in page order, then the FAQ at the foot.
const homeFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ...QUESTIONS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: questionAnswerText(f) } })),
    ...FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  ],
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
  '/claude': { meta: ROUTE_META.claude, jsonLd: claudeData },
  '/pricing': { meta: ROUTE_META.pricing, jsonLd: pricingData },
  '/workflow': { meta: ROUTE_META.workflow, jsonLd: workflowData },
  '/pool-service-billing': { meta: ROUTE_META.billing, jsonLd: billingData },
  '/pool-route-software': { meta: ROUTE_META.routeSoftware, jsonLd: routeSoftwareData },
  '/pool-service-mileage-tracking': { meta: ROUTE_META.mileage, jsonLd: mileageData },
  '/pool-service-fleet-management': { meta: ROUTE_META.fleet, jsonLd: fleetData },
  '/pool-service-price-increases': { meta: ROUTE_META.priceIncreases, jsonLd: priceData },
  // The Article's image is its share image (ROUTE_META's ogImage).
  '/guides/how-to-raise-prices': {
    meta: ROUTE_META.guideRaisePrices,
    jsonLd: guideRaisePricesData.map((d) => (d['@type'] === 'Article' ? { ...d, image: `https://getpoolnautics.com${ROUTE_META.guideRaisePrices.ogImage}` } : d)),
  },
  '/guides/how-to-start-a-pool-cleaning-business': {
    meta: ROUTE_META.guideStartBusiness,
    jsonLd: guideStartBusinessData.map((d) => (d['@type'] === 'Article' ? { ...d, image: `https://getpoolnautics.com${ROUTE_META.guideStartBusiness.ogImage}` } : d)),
  },
  '/guides/how-to-choose-pool-service-software': {
    meta: ROUTE_META.guideChooseSoftware,
    jsonLd: guideChooseSoftwareData.map((d) => (d['@type'] === 'Article' ? { ...d, image: `https://getpoolnautics.com${ROUTE_META.guideChooseSoftware.ogImage}` } : d)),
  },
  '/guides/how-to-find-out-if-a-pool-tech-is-stealing-chemicals': {
    meta: ROUTE_META.guideChemicals,
    jsonLd: guideChemicalsData.map((d) => (d['@type'] === 'Article' ? { ...d, image: `https://getpoolnautics.com${ROUTE_META.guideChemicals.ogImage}` } : d)),
  },
  '/guides/pool-stabilizer-cyanuric-acid': {
    meta: ROUTE_META.guideStabilizer,
    jsonLd: guideStabilizerData.map((d) => (d['@type'] === 'Article' ? { ...d, image: `https://getpoolnautics.com${ROUTE_META.guideStabilizer.ogImage}` } : d)),
  },
  '/guides': { meta: ROUTE_META.guides, jsonLd: guidesData },
  '/switch-pool-service-software': { meta: ROUTE_META.switchSoftware, jsonLd: switchSoftwareData },
  // The rest of the indexable pages: their own <head> and text in the served HTML, not the empty page
  // (whose head was the homepage's, canonical included, until JavaScript ran).
  '/contact': { meta: ROUTE_META.contact },
  '/tech-app': { meta: ROUTE_META.techApp, jsonLd: techAppData, headTags: [appBanner] },
  '/partners': { meta: ROUTE_META.partners },
  '/partners/kit': { meta: ROUTE_META.partnerKit },
  '/partners/terms': { meta: ROUTE_META.partnerTerms },
  '/terms': { meta: ROUTE_META.terms },
  '/privacy': { meta: ROUTE_META.privacy },
  '/technician-terms': { meta: ROUTE_META.technicianTerms },
  '/delete-account': { meta: ROUTE_META.deleteAccount },
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
