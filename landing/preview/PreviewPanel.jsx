import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import PreviewChart from './PreviewChart.jsx';
import { COST, GREETING, KPI_TILES, REVENUE, ROUTES, SANITIZER_OPTIONS, TODAY, moneyAxis, moneyAxisCents } from './data.js';

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

/** ui/SegmentedControl.tsx, drawn at rest. */
function Segmented({ options, value }) {
  return (
    <div className="pl-seg" aria-hidden="true">
      {options.map((o, i) => {
        const prev = options[i - 1];
        const divider = i > 0 && o !== value && prev !== value;
        return (
          <React.Fragment key={o}>
            {i > 0 && <span className="pl-seg-divider" style={{ opacity: divider ? 1 : 0 }} />}
            <span className={`pl-seg-item${o === value ? ' is-active' : ''}`}>{o}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/** ui/FilterChip.tsx "Sanitizer": opens and closes; its options only highlight. */
function SanitizerDropdown() {
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
        Sanitizer
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
 * dashboard/LiveRouteProgress.tsx, at rest: no hover tips, no draw-in. Every
 * track spans the same width whatever its stop count: each route lays out its
 * own N stops between a 2.5% inset at either end. The ring is the stop in
 * progress, or a finished route's last stop.
 */
const ROUTE_INSET = 2.5;

function LiveRoutes() {
  return (
    <div className="pl-routes" aria-hidden="true">
      <div className="pl-card-head"><span className="pl-card-title">Live route progress</span></div>
      <div className="pl-routes-body">
        {ROUTES.techs.map((t) => {
          const n = t.total;
          const span = 100 - 2 * ROUTE_INSET;
          const step = span / (n - 1);
          const pos = (i) => ROUTE_INSET + i * step;
          const ring = Math.min(t.done, n - 1);
          const finished = t.done >= n;
          return (
            <div key={t.name} className="pl-route-row">
              <span className="pl-route-name">{t.name}</span>
              <div className="pl-route-track">
                {Array.from({ length: n - 1 }, (_, i) => (
                  <span
                    key={`s${i}`}
                    className="pl-route-seg"
                    style={{
                      left: `${pos(i)}%`,
                      width: i < ring ? `calc(${step}% + 1px)` : `${step}%`,
                      background: i < ring ? 'var(--chart-accent)' : 'var(--neutral-fill-hover)',
                    }}
                  />
                ))}
                {Array.from({ length: n }, (_, i) =>
                  i === ring ? null : (
                    <span
                      key={`t${i}`}
                      className="pl-route-tick"
                      style={{ left: `${pos(i)}%`, background: i <= ring ? 'var(--chart-accent)' : 'var(--route-stop-upcoming)' }}
                    />
                  ),
                )}
                <span className="pl-route-ring" style={{ left: `${pos(ring)}%` }} />
              </div>
              {finished ? (
                <span className="pl-route-count is-done">
                  <span className="pl-route-done-check">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4.2 3.2 5.8 6.5 2.3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t.done}/{n}
                </span>
              ) : (
                <span className="pl-route-count">{t.done}/{n}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PreviewPanel() {
  return (
    <div className="pl-panel">
      <div className="pl-header" aria-hidden="true">
        <div className="pl-title">{GREETING}</div>
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

      <LiveRoutes />
    </div>
  );
}
