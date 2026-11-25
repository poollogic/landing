// /pool-service-price-increases's example (pages/price-increases.jsx): Dana's $140 a month, raised $15 to
// $155 from March 1, credited back on every bill until then. The figures that follow from these are
// worked out here, so the hero, the before/after cards, the email and the billing panel line can't
// disagree. No Intl, so the server and the browser always write the same thing.
export const CURRENT = 140;
export const RAISE = 15;
export const NEW_PRICE = CURRENT + RAISE; // 155
export const QUARTER = 3; // a quarterly customer's bill is three months: $420 → $465, a $45 credit
export const START_SHORT = 'Mar 1, 2027';
export const START_LONG = 'March 1, 2027';
export const START_DAY = 'March 1';

/** 140 → "$140.00" */
export const usd = (n) => `$${n.toFixed(2)}`;
