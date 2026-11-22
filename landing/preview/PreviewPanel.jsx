import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import PreviewChart from './PreviewChart.jsx';
import LineChart from './LineChart.jsx';
import Segmented from './Segmented.jsx';
import {
  BILLING_BANNER, COST, DASHBOARD_TITLE, KPI_TILES, RANGES, REVENUE, ROUTES, SANITIZER_OPTIONS, TODAY,
  costRange, moneyAxis, moneyAxisCents, revenueAt, revenueRange,
} from './data.js';
import useLiveDate from './liveDate.js';

// The dashboard's main panel (poollogic-web-app: Dashboard.tsx, ui/PagePanel, ui/SummaryTiles,
// dashboard/DesktopTrends, dashboard/DesktopRouteProgress): the title and date, the billing banner
// where a page asks for it (#collections), the stat cards, the Trends row and today's routes. Shared
// by the hero and #collections (DashboardPreview.jsx). Live: the Trends row's 6M / 12M / 24M switch,
// the Cost per visit pool dropdown and the charts' hover; the rest is a picture.

const usd = (v) => `$${Math.round(v).toLocaleString('en-US')}`;
const usdCents = (v) => `$${v.toFixed(2)}`;
const costAxis = (v) => (Number.isInteger(v) ? `$${v}` : `$${v.toFixed(1)}`);

/** Revenue hover: recurring + repairs & extras, which always add up to the month's total. `i` is the
    month in the whole history (data.js revenueAt). */
function revenueTip(i) {
  const m = revenueAt(i);
  return {
    title: m.title,
    sub: m.running ? 'Month to date · Oct 1–20' : null,
    rows: [
      { key: 'rec', label: 'Recurring', value: usd(m.recurring), swatch: 'var(--muted-foreground)' },
      { key: 'extra', label: 'Repairs & extras', value: usd(m.total - m.recurring), swatch: 'var(--muted-foreground)' },
      { key: 'total', label: 'Total invoiced', value: usd(m.total), swatch: 'var(--chart-accent)', kind: 'line', rule: true },
    ],
  };
}

/** The phone's revenue hover (bars and a line over twelve months, PreviewCharts). */
const REVENUE_FIRST_12 = revenueRange(12).first;
function revenueTip12(i) {
  const tip = revenueTip(REVENUE_FIRST_12 + i);
  const [rec, extra, total] = tip.rows;
  return { ...tip, rows: [{ ...rec, swatch: 'var(--foreground)' }, extra, { ...total, kind: 'bar' }] };
}

/** Cost per visit hover: the month (the running one "so far"), the team average with the accent
    line's marker, then each technician, highest first. */
function costTipFor(data) {
  return (i) => {
    const running = i === data.titles.length - 1;
    const at = (s) => (running ? s.now : s.values[i]);
    const team = data.series.find((s) => s.accent);
    const techs = data.series.filter((s) => !s.accent).sort((a, b) => at(b) - at(a));
    return {
      title: running ? `${data.titles[i]} · so far` : data.titles[i],
      rows: [
        { key: team.key, label: team.label, value: usdCents(at(team)), swatch: 'var(--chart-accent)', kind: 'line' },
        ...techs.map((s) => ({ key: s.key, label: s.label, value: usdCents(at(s)), swatch: 'var(--chart-context)', kind: 'line' })),
      ],
    };
  };
}

/** The phone's cost per visit hover: each tech, highest first, then the team average. */
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

/**
 * ui/FilterChip.tsx: the pool type for Cost per visit. With `onChange` it's live: a press opens the
 * menu, picking a type changes the chart, and the keyboard works as a listbox's (arrows, Home / End,
 * Enter or Space to pick, Escape or Tab to close). Without it (the phone's card) its options only
 * highlight and the choice stays on All.
 */
function PoolDropdown({ value = 'All', onChange, label }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const live = typeof onChange === 'function';
  const shown = label ?? (value === 'All' ? 'All pools' : value);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Opening puts the keyboard on the chosen type.
  useEffect(() => {
    if (!open || !live) return;
    setActive(Math.max(0, SANITIZER_OPTIONS.indexOf(value)));
    listRef.current?.focus();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (refocus) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const pick = (i) => {
    onChange(SANITIZER_OPTIONS[i]);
    close(true);
  };
  const onButtonKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (live && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); }
  };
  const onListKey = (e) => {
    const last = SANITIZER_OPTIONS.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(last, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(last); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'Tab') close(false);
  };

  return (
    <div ref={wrapRef} className="pl-chip-wrap pl-live">
      <button
        ref={buttonRef}
        type="button"
        className="pl-chip"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={live ? `Pool type: ${shown}` : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKey}
      >
        {shown}
        <ChevronDown size={12} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <div
        ref={listRef}
        id={id}
        role="listbox"
        tabIndex={live ? -1 : undefined}
        aria-label={live ? 'Pool type' : 'Sanitizer (preview)'}
        aria-activedescendant={live && open ? `${id}-${active}` : undefined}
        className="pl-listbox"
        data-state={open ? 'open' : 'closed'}
        onKeyDown={live ? onListKey : undefined}
      >
        {SANITIZER_OPTIONS.map((o, i) => {
          const chosen = o === value;
          return (
            <div
              key={o}
              id={`${id}-${i}`}
              role="option"
              aria-selected={chosen}
              aria-disabled={live || chosen ? undefined : true}
              className={`pl-option${live && open && i === active ? ' is-active' : ''}`}
              onMouseEnter={live ? () => setActive(i) : undefined}
              onClick={live ? () => pick(i) : undefined}
            >
              <span>{o}</span>
              {chosen && <Check size={14} strokeWidth={1.75} aria-hidden="true" />}
            </div>
          );
        })}
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
                // --i: its place in the bar, for the desktop hero's entrance stagger (hero.css).
                <span key={i} className={`pl-route-seg${i < t.done ? ' is-done' : ''}`} style={{ '--i': i }} />
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
const ChevronDownIcon = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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
 * The Trends row, as the app's (dashboard/DesktopTrends.tsx): Invoiced and Cost per visit side by
 * side in equal halves, on the page with no card, one 6M / 12M / 24M switch in the row's corner for
 * both, each with its label, its figure, and a 220px line chart. The switch and the pool dropdown
 * are live; each preview keeps its own choice.
 */
function HeroCharts() {
  const [range, setRange] = useState('6M');
  const [pool, setPool] = useState('All');
  const months = RANGES[range];
  const revenue = revenueRange(months);
  const cost = costRange(pool, months);
  const team = cost.series.find((x) => x.accent);
  const prev = team.values[team.values.length - 1];
  const change = ((team.now - prev) / prev) * 100;
  return (
    <div className="pl-charts pl-charts-hero">
      <div className="pl-trends-range">
        <Segmented options={Object.keys(RANGES)} value={range} onChange={setRange} label="Chart range" />
      </div>

      <div className="pl-trend" aria-hidden="true">
        <TrendHeader
          label={<>Invoiced <Chevron /></>}
          figure={usd(revenue.series[0].now)}
          aside="so far in Oct"
        />
        <LineChart
          months={revenue.months}
          labels={revenue.labels}
          ticks={revenue.ticks}
          min={revenue.min}
          max={revenue.max}
          axis={moneyAxis}
          series={revenue.series}
          leftGutter={40}
          labelRoom={12}
          tooltip={(i) => revenueTip(revenue.first + i)}
          height={220}
        />
      </div>

      <div className="pl-trend">
        <TrendHeader
          label={<span aria-hidden="true">Cost per visit</span>}
          control={<PoolDropdown value={pool} onChange={setPool} />}
          figure={<span aria-hidden="true">{usdCents(team.now)}</span>}
          aside={(
            <span aria-hidden="true">
              <span className="pl-trend-good"><ArrowDownRight />{Math.abs(change).toFixed(1)}%</span>
              {' '}vs Sep
            </span>
          )}
        />
        <div aria-hidden="true">
          <LineChart
            months={cost.months}
            labels={cost.labels}
            ticks={cost.ticks}
            min={cost.min}
            max={cost.max}
            axis={costAxis}
            series={cost.series}
            leftGutter={40}
            area={false}
            accentWidth={2.25}
            tooltip={costTipFor(cost)}
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
            tooltip={revenueTip12}
          />
        </div>
      </div>

      <div className="pl-card">
        <div className="pl-card-head">
          <div className="pl-card-title-row">
            <span className="pl-card-title" aria-hidden="true">Cost per visit</span>
            <PoolDropdown label="Sanitizer" />
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

/**
 * The billing banner (the dashboard's attention banner): the count of billing problems and other
 * open items, Review all and Fix, and when `open`, the list under a divider. Opening animates its
 * height and pushes what's below it down. A picture: #collections opens it as you scroll to it.
 */
function BillingBanner({ open }) {
  const b = BILLING_BANNER;
  return (
    <div className={`pl-alert${open ? ' is-open' : ''}`} aria-hidden="true">
      <div className="pl-alert-top">
        <span className="pl-alert-mark">!</span>
        <p className="pl-alert-text"><b>{b.problems} billing problems</b> · {b.other} other items open</p>
        <span className="pl-alert-btn">Review all {b.problems + b.other}<ChevronDownIcon className="pl-alert-chev" /></span>
        <span className="pl-alert-btn is-fix">{b.fix}<ArrowRightIcon /></span>
      </div>
      <div className="pl-alert-more">
        <div className="pl-alert-clip">
          <ul className="pl-alert-rows">
            {b.rows.map((r) => (
              <li key={r.key} className="pl-alert-row">
                <span className={`pl-alert-dot${r.billing ? ' is-billing' : ''}`} />
                <span className="pl-alert-label">
                  {r.label}
                  {r.hint && <span className="pl-alert-hint"> · {r.hint}</span>}
                </span>
                <span className="pl-alert-count">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * `banner`: show the billing banner between the header and the stat cards; `banner.open`, its list.
 * Off in the hero.
 * `liveDate`: the subtitle is today's date on the visitor's clock (liveDate.js), not the demo's TODAY.
 * Until the page runs (the pre-rendered page, while React takes it over) TODAY holds its line, unseen.
 */
export default function PreviewPanel({ banner, liveDate = false }) {
  const today = useLiveDate();
  const date = liveDate ? today?.long : TODAY;
  return (
    <div className="pl-panel">
      <div className="pl-header" aria-hidden="true">
        <div className="pl-title">{DASHBOARD_TITLE}</div>
        <div className="pl-subtitle" style={date ? undefined : { visibility: 'hidden' }}>{date ?? TODAY}</div>
      </div>

      {banner && <BillingBanner open={!!banner.open} />}

      <div className="pl-kpis" aria-hidden="true">
        <div className="pl-kpi-grid">
          {KPI_TILES.map((t) => (
            <div key={t.key} className="pl-kpi">
              <span className="pl-kpi-label">
                <span className={`pl-kpi-dot pl-kpi-dot--${t.dot}`} />
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
