// PoolLogic Partner Program — every number and offer line in one place.
//
// /partners, /partners/terms and /partners/kit all read from this file, so
// changing a number here changes it everywhere on the site. Plan prices come
// from pricingPlans.js (the same list /pricing uses).
//
// The offer (owner, 2026-10-22, for the active-customer pricing): a flat amount per
// referred company, paid once, set by its plan and size (active customers) in its
// first paid month. No percentages, no per-technician amounts, no free Core plan, no
// platform fee. (poollogic-web-app docs/affiliate-program.md still describes the
// older per-technician offer and needs updating to match.)
//
// Switches to flip when the work behind them ships:
//   perkLive       the audience offer: 10% off the first paid month with a partner's
//                  code. While false the pages call it "coming soon".
//   dashboardLive  the partner's private dashboard. While false the pages
//                  promise a monthly email of your numbers instead.
// And one to flip after the lawyer has reviewed the terms:
//   termsDraft     shows "Draft — pending legal review" on /partners/terms.

import { BRACKETS } from './pricingPlans.js';

export const PARTNER = {
  // ── Terms ────────────────────────────────────────────────────────────────
  termsVersion: '2026-10.2',
  termsUpdated: 'October 22, 2026',
  termsDraft: true,

  // ── Contact and apply ────────────────────────────────────────────────────
  email: 'partners@poollogic.app',
  // The apply form is a later phase; until then Apply goes to the contact form.
  applyHref: '/contact?topic=partner',

  // ── What the partner earns ───────────────────────────────────────────────
  // Flat amount per referred company, by plan, one per bracket in pricingPlans.js
  // (same order: 0–100, 101–250, 251–500, 501–1,000, 1,001–1,500, 1,501–2,500).
  // Set by the owner: about two months' price, in easy round numbers.
  payouts: {
    Insight: [200, 400, 750, 1250, 1750, 2750],
    Vision: [300, 650, 1200, 2000, 3000, 4500],
  },
  customAbove: '2,500', // companies with more active customers are priced individually: custom terms

  // ── Retention ────────────────────────────────────────────────────────────
  // A company's amount is taken back if it leaves, or its first payment is
  // refunded or charged back, before this day (counted from its first paid month).
  clawbackBeforeDay: 180,

  // ── Payouts ──────────────────────────────────────────────────────────────
  payout: {
    minimum: 50, // dollars owed before a payout is sent
    byDay: '20th', // paid monthly, by this day of the month
    methods: 'ACH or Zelle (PayPal on request)',
  },
  country: 'the United States', // US only at launch

  // ── Links and codes ──────────────────────────────────────────────────────
  linkDays: 90, // how long a click on a partner's link is remembered
  pageBase: 'poollogic.app/with/', // a partner's own page: poollogic.app/with/<handle>

  // ── What the partner's audience gets ────────────────────────────────────
  // Everyone gets the 30-day trial; a partner's code adds 10% off the first paid
  // month (on yearly billing, 10% of one month's price). ≈1% on top of the payout.
  perkLive: false,
  trial: { everyoneDays: 30 }, // everyone: everything included, no card
  perk: { percentOff: 10 },

  // ── Partner dashboard ────────────────────────────────────────────────────
  dashboardLive: false,
};

// ── Derived lines (so pages never restate a number by hand) ────────────────

// "$250", "$237.60" (cents only when there are any; rounding hides float noise).
export const usd = (value) => {
  const n = Math.round(value * 100) / 100;
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
};

// The rate table: one row per bracket — { customers, insight, vision } in dollars.
export const payoutRows = () =>
  BRACKETS.map(([customers], i) => ({ customers, insight: PARTNER.payouts.Insight[i], vision: PARTNER.payouts.Vision[i] }));

// Lowest amount on a plan ("from $200"), and the whole range ("$200–$4,450").
export const payoutFrom = (plan) => usd(Math.min(...PARTNER.payouts[plan]));
export const payoutRange = () => {
  const all = [...PARTNER.payouts.Insight, ...PARTNER.payouts.Vision];
  return `${usd(Math.min(...all))}–${usd(Math.max(...all))}`;
};

// What makes a company count as having left.
export const leftLine = () => 'it stops paying for its plan, cancels, or closes its PoolLogic account';

// The audience trial, in words.
export const perkLine = () => `${PARTNER.perk.percentOff}% off their first paid month`;
export const trialEveryone = () =>
  `${PARTNER.trial.everyoneDays} days free, everything included (routes, the tech app, unlimited technicians)`;
export const TRIAL_ENDS =
  'No credit card, so nothing is charged when it ends: to keep going, they choose a plan.';
