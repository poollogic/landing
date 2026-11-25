// /pool-service-price-increases's title, description and sharing: one place for app.jsx's ROUTE_META (the
// <head>, written at build time by scripts/prerender.mjs) and the page's WebPage JSON-LD
// (pages/price-increases.jsx). The share title differs from the page title on purpose. The share image is
// the page's own, not the site's /og-image.png: its path is in app.jsx's ROUTE_META (a PNG, which the
// hero code's SEO check doesn't allow in these folders), the file public/og/pool-service-price-increases.png
// (1200 × 630, from price-increases-share-image.html).
export const PRICE_TITLE = 'The Best Way to Raise Pool Service Prices | Poolnautics';
export const PRICE_DESCRIPTION = 'Raise your pool company’s prices with fewer phone calls and cancellations. Customers see the new price early and keep paying the old one until your date.';
export const PRICE_OG_TITLE = 'Customers see the new price and keep paying the old one';
export const PRICE_OG_IMAGE_ALT = 'The best way to raise your pool company’s prices. They see the new price. They keep paying the old one.';
