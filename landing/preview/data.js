// Fixture data for the landing dashboard preview. FICTIONAL — never a real
// account, customer or figure. Mirrors the shapes the app's dashboard reads
// (poollogic-web-app: src/components/Dashboard.tsx, dashboard/exampleData.ts).

export const IDENTITY = {
  company: 'Bayside Pool Co.',
  name: 'Alex Rivera',
  firstName: 'Alex',
  email: 'alex@baysidepool.co',
};

/** The greeting follows the visitor's clock (PreviewPanel); the date stays fixed. Afternoon is the
    one the pre-rendered page carries, until the browser takes over. */
export const greetingAt = (hour) =>
  `Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}, ${IDENTITY.firstName}`;
export const GREETING = greetingAt(12);
export const TODAY = 'Tuesday, October 20, 2026';

export const KPI_TILES = [
  { key: 'invoiced', label: 'Invoiced, month to date', dot: 'var(--chart-accent)', value: '$52,720' },
  { key: 'recurring', label: 'Recurring revenue', dot: 'var(--foreground)', value: '$48,930', unit: '/mo' },
  { key: 'active', label: 'Active customers', dot: 'var(--muted-foreground)', value: '302', unit: '· 4 paused' },
  { key: 'per-customer', label: 'Average per customer', dot: 'var(--muted-foreground)', value: '$162.02', unit: '/mo' },
];

/** dashboard/format.ts moneyAxis / moneyAxisCents. */
export const moneyAxis = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${Math.round(v)}`);
export const moneyAxisCents = (v) => `$${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(2)}`;

/** Revenue, Nov 2025 – Oct 2026 (12M). Oct is the month still running. */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Full month titles, from a first month (0-based) and year, for n months. */
const monthTitles = (first, year, n) =>
  Array.from({ length: n }, (_, i) => `${MONTH_NAMES[(first + i) % 12]} ${year + Math.floor((first + i) / 12)}`);

/** Revenue, Nov 2025 – Oct 2026 (12M). Oct is the month still running (to Oct 20). */
export const REVENUE = {
  // xLabelIndices at this width: January carries the year, then every other month to the end.
  labels: [null, null, { text: '2026', year: true }, null, null, 'Apr', null, 'Jun', null, 'Aug', null, 'Oct'],
  months: monthTitles(10, 2025, 12),
  ticks: [0, 30000, 60000, 90000],
  top: 90000,
  // Total invoiced per month (bars) and recurring revenue (the line).
  bars: [35120, 34160, 42430, 37370, 40060, 44050, 48010, 52220, 50430, 56010, 54070, 52720],
  recurring: [32310, 32830, 33290, 34310, 35810, 37800, 40060, 42170, 44130, 45780, 47370, 48930],
};

/** Chemical cost per visit, May – Oct 2026 (6M), top four techs plus the team average. */
export const COST = {
  labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  months: monthTitles(4, 2026, 6),
  ticks: [0, 2, 4, 6, 8],
  top: 8,
  team: [4.3, 4.9, 5.2, 5.0, 4.4, 4.0],
  // Ranked by this month's cost, as rankChemTechs does; the one 25%+ over the
  // team average takes the chart accent, the rest the context greys.
  techs: [
    { key: 'aaliyah', name: 'Aaliyah Grant', color: 'var(--chart-accent)', values: [4.1, 4.8, 5.3, 5.6, 5.4, 5.0] },
    { key: 'devon', name: 'Devon Price', color: 'color-mix(in srgb, var(--neutral-ink-2) 50%, var(--neutral-ink-3))', values: [3.8, 4.3, 4.5, 4.2, 4.1, 3.6] },
    // One tech all six months (it used to be drawn as two lines with a gap).
    { key: 'marco', name: 'Marco Diaz', color: 'color-mix(in srgb, var(--neutral-ink-3) 50%, var(--neutral-ink-4))', values: [5.0, 5.6, 5.9, 5.2, 3.6, 3.4] },
  ],
};

/** The hero's charts (PreviewPanel HeroCharts): revenue on a $60k scale, and cost per visit by pool
    type, as the app now draws it. The Collections section's phone keeps REVENUE and COST above. */
export const REVENUE_HERO = { ...REVENUE, ticks: [0, 20000, 40000, 60000], top: 60000 };

/** Cost per visit by pool type, May – Sep 2026, and the month still running (Oct, to the 20th). */
export const COST_POOLS = {
  months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  ticks: [2, 3, 4, 5, 6],
  min: 2,
  max: 6,
  series: [
    { key: 'chlorine', label: 'Chlorine', values: [5.70, 5.66, 5.52, 5.28, 5.10], now: 4.85 },
    { key: 'all', label: 'All', values: [5.00, 4.86, 4.80, 4.58, 4.40], now: 4.12, accent: true },
    { key: 'salt', label: 'Salt', values: [3.60, 3.32, 3.36, 3.02, 2.80], now: 2.60 },
  ],
};

export const SANITIZER_OPTIONS = ['All', 'Liquid chlorine', 'Salt', 'Bromine'];

/**
 * Today's routes (dashboard/DesktopRouteProgress.tsx): two technicians this afternoon, Justin
 * finished and Gabriel on his last few stops. The status line is the app's (liveRoute.ts
 * routeStatusLine): "Route complete", or the address of the stop he's on.
 */
export const ROUTES = {
  techs: [
    { name: 'Justin Braswell', done: 17, total: 17, status: 'Route complete' },
    { name: 'Gabriel Montoya', done: 14, total: 18, status: 'Next: 214 Marina Way' },
  ],
};

/**
 * The toasts over the dashboard's corner (PreviewToast.jsx), in order. Titles are the app's wording:
 * the billing run's bell (routes/hono/_billingRunBell.ts), payment, late fee, repair and extra-work
 * toasts (RecordPaymentPage, BillingInvoicing, ScheduleDiagnosticPage), and Fleet's oil change bell
 * (_fleetSchedule.ts oilWords, which rings within 500 mi of the change). Only the bells carry a
 * second line in the app, so only they have a detail here.
 */
export const TOASTS = [
  { title: '163 invoices sent', meta: '$26,409', detail: 'Recurring billing run · just now' },
  { title: '$1,240.00 charged. 3 invoices are paid.' },
  { title: 'Late fees applied to 6 invoices' },
  { title: 'Invoice emailed. It goes to Marcus when it’s paid' },
  { title: "3 charges added to Sarah Lopez's next invoice" },
  { title: 'Oil change coming up', detail: 'Michael’s Ford F-150 is at 70,612 mi; its oil change is due at 71,000 mi.' },
];
