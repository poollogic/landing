import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import PreviewChart from './PreviewChart.jsx';
import { COST, GREETING, KPI_TILES, REVENUE, ROUTES, SANITIZER_OPTIONS, TODAY, moneyAxis, moneyAxisCents } from './data.js';

// The dashboard's main panel (poollogic-web-app: Dashboard.tsx, ui/PagePanel,
// ui/SummaryTiles, dashboard/RevenueTrendCard, dashboard/ChemCostPerVisitCard):
// greeting, KPI row and the two Trends cards. Only the Sanitizer dropdown is
// live, and it is look-only: the selection stays on All.

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

/** dashboard/LiveRouteProgress.tsx, at rest: no hover tips, no draw-in. */
function LiveRoutes() {
  const x = (i) => ((i + 0.5) / ROUTES.cells) * 100;
  return (
    <div className="pl-routes" aria-hidden="true">
      <div className="pl-card-head"><span className="pl-card-title">Live route progress</span></div>
      <div className="pl-routes-body">
        {ROUTES.techs.map((t) => {
          const finished = t.done >= t.total;
          const status = (i) => (i < t.done ? 'completed' : i === t.done ? 'in_progress' : 'upcoming');
          const stops = Array.from({ length: t.total }, (_, i) => ({
            x: x(i),
            status: status(i),
            // liveRoute.ts: the stop in progress, or a finished route's last stop, is the ring.
            ring: status(i) === 'in_progress' || (finished && i === t.total - 1),
          }));
          return (
            <div key={t.name} className="pl-route-row">
              <span className="pl-route-name">{t.name}</span>
              <div className="pl-route-track">
                {stops.slice(1).map((s, i) => {
                  const filled = s.status !== 'upcoming';
                  return (
                    <span
                      key={i}
                      className="pl-route-seg"
                      style={{
                        left: `${stops[i].x}%`,
                        width: filled ? `calc(${s.x - stops[i].x}% + 1px)` : `${s.x - stops[i].x}%`,
                        background: filled ? 'var(--chart-accent)' : 'var(--neutral-fill-hover)',
                      }}
                    />
                  );
                })}
                {stops.map((s, i) =>
                  s.ring ? (
                    <span key={i} className="pl-route-ring" style={{ left: `${s.x}%` }} />
                  ) : (
                    <span
                      key={i}
                      className="pl-route-tick"
                      style={{ left: `${s.x}%`, background: s.status === 'completed' ? 'var(--chart-accent)' : 'var(--route-stop-upcoming)' }}
                    />
                  ),
                )}
              </div>
              {finished ? (
                <span className="pl-route-count is-done">
                  <span className="pl-route-done-check">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4.2 3.2 5.8 6.5 2.3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t.done}/{t.total}
                </span>
              ) : (
                <span className="pl-route-count">{t.done}/{t.total}</span>
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
              lines={[{ key: 'recurring', color: 'var(--foreground)', values: REVENUE.recurring }]}
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
            />
          </div>
        </div>
      </div>

      <LiveRoutes />
    </div>
  );
}
