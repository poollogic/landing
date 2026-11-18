// Fixture data for the landing dashboard preview. FICTIONAL — never a real
// account, customer or figure. Mirrors the shapes the app's dashboard reads
// (poollogic-web-app: src/components/Dashboard.tsx, dashboard/exampleData.ts).

export const IDENTITY = {
  company: 'Bayside Pool Co.',
  name: 'Alex Rivera',
  firstName: 'Alex',
  email: 'alex@baysidepool.co',
};

/** The dashboard's title and date: one date wherever the preview appears, the chart captions'
    ("so far in Oct", "vs Sep"). */
export const DASHBOARD_TITLE = 'Today’s dashboard';
export const TODAY = 'Tuesday, October 20, 2026';

/** The stat cards (ui/SummaryTiles.tsx). `dot`: the dot's colour role (preview.css .pl-kpi-dot--*). */
export const KPI_TILES = [
  { key: 'invoiced', label: 'Invoiced, month to date', dot: 'accent', value: '$52,720' },
  { key: 'recurring', label: 'Recurring revenue', dot: 'ink', value: '$48,930', unit: '/mo' },
  { key: 'active', label: 'Active customers', dot: 'muted', value: '302', unit: '· 4 paused' },
  { key: 'per-customer', label: 'Average per customer', dot: 'muted', value: '$162.02', unit: '/mo' },
];

/**
 * The billing banner over the stat cards (dashboard attention banner), shown only where a page asks
 * for it (#collections). Billing problems carry the red dot: 1 + 2 + 1 = 4; the estimates are the
 * "other items": 6 in all.
 */
export const BILLING_BANNER = {
  problems: 4,
  other: 2,
  fix: 'Fix 1 payment',
  rows: [
    { key: 'failed', label: 'Payment failed', hint: 'card retried, customer emailed', count: 1, billing: true },
    { key: 'past-due', label: 'Invoices past due', hint: 'reminders emailed', count: 2, billing: true },
    { key: 'mail', label: 'Invoice to mail', count: 1, billing: true },
    { key: 'estimates', label: 'Estimates awaiting approval', count: 2 },
  ],
};

/** dashboard/format.ts moneyAxis / moneyAxisCents. */
export const moneyAxis = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${Math.round(v)}`);
export const moneyAxisCents = (v) => `$${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(2)}`;

/** Revenue, Nov 2025 – Oct 2026 (12M). Oct is the month still running. */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Full month titles, from a first month (0-based) and year, for n months. */
const monthTitles = (first, year, n) =>
  Array.from({ length: n }, (_, i) => `${MONTH_NAMES[(first + i) % 12]} ${year + Math.floor((first + i) / 12)}`);

/** Revenue, Nov 2024 – Oct 2026 (24 months; Oct 2026 is the month still running, to Oct 20): total
    invoiced per month, and recurring revenue. */
const REVENUE_HISTORY = {
  months: monthTitles(10, 2024, 24),
  bars: [
    27840, 26910, 31220, 29480, 31650, 34120, 37260, 40380, 39110, 42870, 41530, 38940,
    35120, 34160, 42430, 37370, 40060, 44050, 48010, 52220, 50430, 56010, 54070, 52720,
  ],
  recurring: [
    24310, 24690, 25120, 25640, 26300, 27150, 28020, 28960, 29780, 30540, 31260, 31870,
    32310, 32830, 33290, 34310, 35810, 37800, 40060, 42170, 44130, 45780, 47370, 48930,
  ],
};

/** Revenue, Nov 2025 – Oct 2026 (12M), as the phone's Trends card draws it (bars and a line). */
export const REVENUE = {
  // xLabelIndices at this width: January carries the year, then every other month to the end.
  labels: [null, null, { text: '2026', year: true }, null, null, 'Apr', null, 'Jun', null, 'Aug', null, 'Oct'],
  months: REVENUE_HISTORY.months.slice(-12),
  ticks: [0, 30000, 60000, 90000],
  top: 90000,
  bars: REVENUE_HISTORY.bars.slice(-12),
  recurring: REVENUE_HISTORY.recurring.slice(-12),
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

/* ---------- The dashboard's Trends row (PreviewPanel HeroCharts) ----------
   Two line charts over the range the 6M / 12M / 24M switch picks: total invoiced, and chemical cost
   per visit for the pool type the dropdown picks (the team average and two of its technicians, from
   the route rows, either side of it). The last month is the one still running. */

export const RANGES = { '6M': 6, '12M': 12, '24M': 24 };

const abbr = (title) => title.slice(0, 3);
/** The x labels for n months: all six, every other of twelve, every fourth of 24, always the last. */
const labelsFor = (months) => {
  const every = months.length > 12 ? 4 : months.length > 6 ? 2 : 1;
  return months.map((m, i) => ((months.length - 1 - i) % every === 0 ? abbr(m) : null));
};
/** A round top for the axis and its ticks: steps of 1, 2 or 2.5 (cost), or 20k (revenue). */
const ticksTo = (max, step) => Array.from({ length: Math.round(max / step) + 1 }, (_, i) => +(i * step).toFixed(2));

/** Total invoiced over the last n months: the finished months as the line, the running one its dot. */
export function revenueRange(n) {
  const first = REVENUE_HISTORY.bars.length - n;
  const titles = REVENUE_HISTORY.months.slice(first);
  return {
    first,
    titles,
    months: titles.map(abbr),
    labels: labelsFor(titles),
    ticks: ticksTo(60000, 20000),
    min: 0,
    max: 60000,
    series: [{ key: 'invoiced', values: REVENUE_HISTORY.bars.slice(first, -1), now: REVENUE_HISTORY.bars[REVENUE_HISTORY.bars.length - 1], accent: true }],
  };
}

/** A month's revenue: the total, and the recurring part of it. */
export const revenueAt = (i) => ({
  title: REVENUE_HISTORY.months[i],
  total: REVENUE_HISTORY.bars[i],
  recurring: REVENUE_HISTORY.recurring[i],
  running: i === REVENUE_HISTORY.bars.length - 1,
});

export const SANITIZER_OPTIONS = ['All', 'Liquid chlorine', 'Salt', 'Bromine'];

/** Cost per visit, all pools, Nov 2024 – Oct 2026: the team average falling as the dosing tightens
    (the last six are the hero's May – Oct), and each technician's distance from it. */
const COST_TEAM = [
  6.10, 5.95, 5.90, 5.86, 5.92, 6.05, 6.20, 6.32, 6.38, 6.20, 5.96, 5.72,
  5.55, 5.40, 5.31, 5.22, 5.18, 5.10, 5.00, 4.86, 4.80, 4.58, 4.40, 4.12,
];
const COST_TECHS = [
  { key: 'justin', label: 'Justin Braswell', offsets: [0.62, 0.68, 0.75, 0.66, 0.71, 0.64, 0.69, 0.77, 0.72, 0.66, 0.70, 0.74, 0.68, 0.63, 0.71, 0.76, 0.67, 0.72, 0.70, 0.80, 0.72, 0.70, 0.70, 0.73] },
  { key: 'gabriel', label: 'Gabriel Montoya', offsets: [-1.18, -1.25, -1.31, -1.22, -1.36, -1.29, -1.41, -1.34, -1.27, -1.45, -1.38, -1.30, -1.42, -1.36, -1.48, -1.40, -1.51, -1.44, -1.40, -1.54, -1.44, -1.56, -1.60, -1.52] },
];
/** Each pool type against all pools: salt cells make their own chlorine; bromine costs the most. */
const POOL_FACTOR = { All: 1, 'Liquid chlorine': 1.14, Salt: 0.58, Bromine: 1.42 };
const cents = (v) => Math.round(v * 100) / 100;

/** Cost per visit for a pool type over the last n months. */
export function costRange(pool, n) {
  const f = POOL_FACTOR[pool] ?? 1;
  const first = COST_TEAM.length - n;
  const titles = REVENUE_HISTORY.months.slice(first);
  const line = (vals) => {
    const all = vals.slice(first).map((v) => cents(v * f));
    return { values: all.slice(0, -1), now: all[all.length - 1] };
  };
  const team = { key: 'team', label: 'Team average', accent: true, ...line(COST_TEAM) };
  const techs = COST_TECHS.map((t) => ({ key: t.key, label: t.label, ...line(COST_TEAM.map((v, i) => v + t.offsets[i])) }));
  const series = [techs[0], team, techs[1]];
  const top = Math.max(...series.flatMap((s) => [...s.values, s.now]));
  const step = top > 8 ? 2.5 : top > 4 ? 2 : 1;
  const max = Math.ceil(top / step) * step;
  return {
    titles,
    months: titles.map(abbr),
    labels: labelsFor(titles),
    ticks: ticksTo(max, step),
    min: 0,
    max,
    series,
  };
}

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
  { title: 'Oil change coming up', detail: 'Michael’s Nissan Frontier is at 70,612 mi; its oil change is due at 71,000 mi.' },
];
