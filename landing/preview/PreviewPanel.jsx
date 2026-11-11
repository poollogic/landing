import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import PreviewChart from './PreviewChart.jsx';
import LineChart from './LineChart.jsx';
import Segmented from './Segmented.jsx';
import useHydrated from '../useHydrated.js';
import { COST, COST_POOLS, GREETING, KPI_TILES, REVENUE, REVENUE_6M, ROUTES, SANITIZER_OPTIONS, TODAY, greetingAt, moneyAxis, moneyAxisCents } from './data.js';

// The dashboard's main panel (poollogic-web-app: Dashboard.tsx, ui/PagePanel,
// ui/SummaryTiles, dashboard/RevenueTrendCard, dashboard/ChemCostPerVisitCard):
// greeting, KPI row and the two Trends cards. Only the Sanitizer dropdown is
// live, and it is look-only: the selection stays on All.

const usd = (v) => `$${Math.round(v).toLocaleString('en-US')}`;
const usdCents = (v) => `$${v.toFixed(2)}`;

/** Revenue hover: recurring + repairs & extras, which always add up to the month's total. */
function revenueTip(i) {
  const total = REVENUE.bars[i];
  const recurring = REVENUE.recurring[i];
  const current = i === REVENUE.bars.length - 1;
  return {
    title: REVENUE.months[i],
    sub: current ? 'Month to date · Oct 1–20' : null,
    rows: [
      { key: 'rec', label: 'Recurring', value: usd(recurring), swatch: 'var(--foreground)' },
      { key: 'extra', label: 'Repairs & extras', value: usd(total - recurring), swatch: 'var(--muted-foreground)' },
      { key: 'total', label: 'Total invoiced', value: usd(total), swatch: 'var(--chart-accent)', kind: 'bar', rule: true },
    ],
  };
}

/** The hero's revenue hover (six months, the line chart): the month's total and what made it up. */
function revenueTip6(i) {
  const tip = revenueTip(REVENUE_6M.first + i);
  const [rec, extra, total] = tip.rows;
  return {
    ...tip,
    rows: [
      { ...rec, swatch: 'var(--muted-foreground)' },
      extra,
      { ...total, kind: 'line' },
    ],
  };
}

/** The hero's cost per visit hover: the month (October "so far"), the team average with the accent
    line's marker, then each technician, highest first. */
function costTip6(i) {
  const running = i === COST_POOLS.months.length - 1;
  const at = (s) => (running ? s.now : s.values[i]);
  const team = COST_POOLS.series.find((s) => s.accent);
  const techs = COST_POOLS.series.filter((s) => !s.accent).sort((a, b) => at(b) - at(a));
  return {
    title: running ? `${COST_POOLS.monthNames[i]} · so far` : COST_POOLS.monthNames[i],
    rows: [
      { key: team.key, label: team.label, value: usdCents(at(team)), swatch: 'var(--chart-accent)', kind: 'line' },
      ...techs.map((s) => ({ key: s.key, label: s.label, value: usdCents(at(s)), swatch: 'var(--chart-context)', kind: 'line' })),
    ],
  };
}

/** Cost per visit hover: each tech, highest first, then the team average. */
function costTip(i) {
  const techs = COST.techs
    .filter((t) => t.values[i] != null)
    .sort((a, b) => b.values[i] - a.values[i])
    .map((t) => ({ key: t.key, label: t.name, value: usdCents(t.values[i]), swatch: t.color }));
  return {
    title: COST.months[i],
    rows: [...techs, { key: 'team', label: 'Team average', value: usdCents(COST.team[i]), swatch: 'var(--series-baseline)', kind: 'dash', gap: true }],
  };
}

/** ui/FilterChip.tsx "Sanitizer" / "All pools": opens and closes; its options only highlight. */
function SanitizerDropdown({ label = 'Sanitizer' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="pl-chip-wrap pl-live">
      <button
        type="button"
        className="pl-chip"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown size={12} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <div id={id} role="listbox" aria-label="Sanitizer (preview)" className="pl-listbox" data-state={open ? 'open' : 'closed'}>
        {SANITIZER_OPTIONS.map((o) => (
          <div key={o} role="option" aria-selected={o === 'All'} aria-disabled={o === 'All' ? undefined : true} className="pl-option">
            <span>{o}</span>
            {o === 'All' && <Check size={14} strokeWidth={1.75} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Today's routes (dashboard/DesktopRouteProgress.tsx): per technician, name and status line, a bar
 * with one segment per stop, and stops done / total with the percent.
 */
function LiveRoutes() {
  return (
    <ul className="pl-routes" aria-hidden="true">
      {ROUTES.techs.map((t) => {
        const finished = t.done >= t.total;
        return (
          <li key={t.name} className="pl-route-row">
            <span className="pl-route-who">
              <span className="pl-route-name">{t.name}</span>
              <span className={`pl-route-status${finished ? ' is-done' : ''}`}>{finished ? `✓ ${t.status}` : t.status}</span>
            </span>
            <span className="pl-route-bar">
              {Array.from({ length: t.total }, (_, i) => (
                <span key={i} className={`pl-route-seg${i < t.done ? ' is-done' : ''}`} />
              ))}
            </span>
            <span className="pl-route-count">
              <b>{t.done}</b>
              <span className="pl-route-total">/ {t.total}</span>
              <span className="pl-route-pct">{Math.round((t.done / t.total) * 100)}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// Inline (lucide's drawings), so these add no shared icon module, and no request, to the page.
const Chevron = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);
const ArrowDownRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 7 10 10" /><path d="M17 7v10H7" /></svg>
);

/** dashboard/DesktopTrends.tsx ChartHeader: a 32px label row, a 30px figure row, 32px to the chart. */
function TrendHeader({ label, control, figure, aside }) {
  return (
    <div className="pl-trend-head">
      <div className="pl-trend-label-row">
        <span className="pl-trend-label">{label}</span>
        {control}
      </div>
      <p className="pl-trend-figure">
        <span className="pl-trend-value">{figure}</span>
        <span className="pl-trend-aside">{aside}</span>
      </p>
    </div>
  );
}

/**
 * The hero's Trends row, as the app's (dashboard/DesktopTrends.tsx): Invoiced and Cost per visit
 * side by side in equal halves, on the page with no card, one 6M / 12M / 24M switch in the row's
 * corner for both, each with its label, its figure, and a 220px line chart over six months.
 */
function HeroCharts() {
  const allNow = COST_POOLS.series.find((x) => x.accent);
  const change = ((allNow.now - allNow.values[allNow.values.length - 1]) / allNow.values[allNow.values.length - 1]) * 100;
  return (
    <div className="pl-charts pl-charts-hero">
      <div className="pl-trends-range" aria-hidden="true">
        <Segmented options={['6M', '12M', '24M']} value="6M" />
      </div>

      <div className="pl-trend" aria-hidden="true">
        <TrendHeader
          label={<>Invoiced <Chevron /></>}
          figure={usd(REVENUE_6M.series[0].now)}
          aside="so far in Oct"
        />
        <LineChart
          months={REVENUE_6M.months}
          ticks={REVENUE_6M.ticks}
          min={REVENUE_6M.min}
          max={REVENUE_6M.max}
          axis={moneyAxis}
          series={REVENUE_6M.series}
          leftGutter={40}
          labelRoom={12}
          tooltip={revenueTip6}
          height={220}
        />
      </div>

      <div className="pl-trend">
        <TrendHeader
          label="Cost per visit"
          control={<SanitizerDropdown label="All pools" />}
          figure={usdCents(allNow.now)}
          aside={(
            <>
              <span className="pl-trend-good"><ArrowDownRight />{Math.abs(change).toFixed(1)}%</span>
              {' '}vs Sep
            </>
          )}
        />
        <div aria-hidden="true">
          <LineChart
            months={COST_POOLS.months}
            ticks={COST_POOLS.ticks}
            min={COST_POOLS.min}
            max={COST_POOLS.max}
            axis={(v) => `$${Math.round(v)}`}
            series={COST_POOLS.series}
            leftGutter={40}
            area={false}
            accentWidth={2.25}
            tooltip={costTip6}
            height={220}
          />
        </div>
      </div>
    </div>
  );
}

/** The two Trends cards as they were, for the Collections section's phone (RevenueMobileStory.jsx). */
export function PreviewCharts() {
  return (
    <div className="pl-charts">
      <div className="pl-card" aria-hidden="true">
        <div className="pl-card-head">
          <Segmented options={['Revenue', 'Customers']} value="Revenue" />
          <Segmented options={['6M', '12M', '24M']} value="12M" />
        </div>
        <div className="pl-card-body">
          <PreviewChart
            labels={REVENUE.labels}
            ticks={REVENUE.ticks}
            top={REVENUE.top}
            axis={moneyAxis}
            bars={{ color: 'var(--chart-accent)', values: REVENUE.bars }}
            lines={[{ key: 'recurring', color: 'var(--foreground)', values: REVENUE.recurring, smooth: true }]}
            tooltip={revenueTip}
          />
        </div>
      </div>

      <div className="pl-card">
        <div className="pl-card-head">
          <div className="pl-card-title-row">
            <span className="pl-card-title" aria-hidden="true">Cost per visit</span>
            <SanitizerDropdown />
          </div>
          <Segmented options={['6M', '12M']} value="6M" />
        </div>
        <div className="pl-card-body" aria-hidden="true">
          <PreviewChart
            labels={COST.labels}
            ticks={COST.ticks}
            top={COST.top}
            axis={moneyAxisCents}
            lines={COST.techs}
            baseline={COST.team}
            baselineArea
            tooltip={costTip}
          />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPanel() {
  // The visitor's time of day, once in the browser (the pre-rendered page says afternoon).
  const hydrated = useHydrated();
  const greeting = hydrated ? greetingAt(new Date().getHours()) : GREETING;
  return (
    <div className="pl-panel">
      <div className="pl-header" aria-hidden="true">
        <div className="pl-title">{greeting}</div>
        <div className="pl-subtitle">{TODAY}</div>
      </div>

      <div className="pl-kpis" aria-hidden="true">
        <div className="pl-kpi-grid">
          {KPI_TILES.map((t) => (
            <div key={t.key} className="pl-kpi">
              <span className="pl-kpi-label">
                <span className="pl-kpi-dot" style={{ background: t.dot }} />
                <span>{t.label}</span>
              </span>
              <span className="pl-kpi-value">
                {t.value}
                {t.unit && <span className="pl-kpi-unit">{t.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <HeroCharts />

      <LiveRoutes />
    </div>
  );
}
