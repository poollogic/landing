// /guides/how-to-raise-prices's title, description and sharing: one place for app.jsx's ROUTE_META (the
// <head>, written at build time by scripts/prerender.mjs) and the page's Article JSON-LD
// (pages/guide-raise-prices.jsx). The share title differs from the page title on purpose; og:type is
// article. The share image's path is in app.jsx (a PNG, which the hero code's SEO check doesn't allow in
// these folders): public/og/how-to-raise-prices.png, 1200 × 630, from price-guide-share-image.html.
export const GUIDE_TITLE = 'How to Raise Prices Without Losing Customers | Poolnautics';
export const GUIDE_DESCRIPTION = 'A step-by-step guide for service businesses. Includes a break-even calculator, a price increase letter to copy and the vanishing discount.';
export const GUIDE_OG_TITLE = 'The math, the letter and the vanishing discount';
export const GUIDE_OG_IMAGE_ALT = 'How to raise prices without losing customers. A free guide for service businesses. You could lose 9 customers and still bring in what you do today: 100 customers, $140 → $155 a month.';
// The guide's h1 and the paragraph under it: on the page, and on its card on /guides (pages/guides.jsx).
export const GUIDE_H1 = 'How to Raise Prices Without Losing Customers';
export const GUIDE_LEDE = 'A step-by-step plan for pool, lawn, pest and cleaning companies: how much to raise, who goes first, what to say, and how to take the sting out with a discount that fades away.';
