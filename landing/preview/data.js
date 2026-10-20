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
  { key: 'invoiced', label: 'Invoiced, month to date', dot: 'var(--chart-accent)', value: '$18,240' },
  { key: 'recurring', label: 'Recurring revenue', dot: 'var(--foreground)', value: '$16,930', unit: '/mo' },
  { key: 'active', label: 'Active customers', dot: 'var(--muted-foreground)', value: '126', unit: '· 2 paused' },
  { key: 'per-customer', label: 'Average per customer', dot: 'var(--muted-foreground)', value: '$134.37', unit: '/mo' },
];

/** dashboard/format.ts moneyAxis / moneyAxisCents. */
export const moneyAxis = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${Math.round(v)}`);
export const moneyAxisCents = (v) => `$${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(2)}`;

/** Revenue, Nov 2025 – Oct 2026 (12M). Oct is the month still running. */
export const REVENUE = {
  // xLabelIndices at this width: January carries the year, then every other month to the end.
  labels: [null, null, { text: '2026', year: true }, null, null, 'Apr', null, 'Jun', null, 'Aug', null, 'Oct'],
  ticks: [0, 10000, 20000, 30000],
  top: 30000,
  bars: [null, null, null, null, 3200, 6800, 11400, 14900, 17600, 19800, 21400, 16200],
  recurring: [4100, 4000, 4300, 4600, 9800, 12400, 14200, 15100, 15800, 16400, 16900, 17300],
};

/** Chemical cost per visit, May – Oct 2026 (6M), top four techs plus the team average. */
export const COST = {
  labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  ticks: [0, 2, 4, 6, 8],
  top: 8,
  team: [4.3, 4.9, 5.2, 5.0, 4.4, 4.0],
  // Ranked by this month's cost, as rankChemTechs does; the one 25%+ over the
  // team average takes the chart accent, the rest the context greys.
  techs: [
    { key: 'tyler', color: 'var(--chart-accent)', values: [4.1, 4.8, 5.3, 5.6, 5.4, 5.0] },
    { key: 'marco', color: 'color-mix(in srgb, var(--neutral-ink-2) 50%, var(--neutral-ink-3))', values: [3.8, 4.3, 4.5, 4.2, 4.1, 3.6] },
    { key: 'aaliyah', color: 'color-mix(in srgb, var(--neutral-ink-3) 50%, var(--neutral-ink-4))', values: [null, null, null, 5.2, 3.6, 3.4] },
    { key: 'jake', color: 'var(--neutral-ink-4)', values: [5.0, 5.6, 5.9, null, null, null] },
  ],
};

export const SANITIZER_OPTIONS = ['All', 'Liquid chlorine', 'Salt', 'Bromine'];

/**
 * Live route progress (dashboard/LiveRouteProgress.tsx, liveRoute.ts): two
 * technicians this afternoon: Aaliyah finished, Marco halfway. Stops before
 * `done` are completed, the next is in progress (the ring), the rest
 * upcoming; a finished route rings its last stop. Each route lays out its
 * own stops across the full track width (PreviewPanel LiveRoutes).
 */
export const ROUTES = {
  techs: [
    { name: 'Aaliyah Grant', done: 11, total: 11 },
    { name: 'Marco Diaz', done: 9, total: 18 },
  ],
};
