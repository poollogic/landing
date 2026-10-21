// Fixture data for the landing dashboard preview. FICTIONAL — never a real
// account, customer or figure. Mirrors the shapes the app's dashboard reads
// (poollogic-web-app: src/components/Dashboard.tsx, dashboard/exampleData.ts).

export const IDENTITY = {
  company: 'Bayside Pool Co.',
  name: 'Alex Rivera',
  firstName: 'Alex',
  email: 'alex@baysidepool.co',
};

/** Frozen, so the preview never changes with the visitor's clock. */
export const GREETING = `Good afternoon, ${IDENTITY.firstName}`;
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

export const SANITIZER_OPTIONS = ['All', 'Liquid chlorine', 'Salt', 'Bromine'];

/**
 * Live route progress (dashboard/LiveRouteProgress.tsx, liveRoute.ts): two
 * technicians this afternoon: Justin finished, Hugh on his last few stops. Stops before
 * `done` are completed, the next is in progress (the ring), the rest
 * upcoming; a finished route rings its last stop. Each route lays out its
 * own stops across the full track width (PreviewPanel LiveRoutes).
 */
export const ROUTES = {
  techs: [
    { name: 'Justin Braswell', done: 17, total: 17 },
    { name: 'Hugh Janus', done: 14, total: 18 },
  ],
};
