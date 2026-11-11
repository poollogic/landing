import React, { useId, useRef, useState } from 'react';
import useBrowserLayoutEffect from '../useBrowserLayoutEffect.js';
import { LABEL_FONT, M, ink, monotonePath, textW } from './PreviewChart.jsx';

// The hero dashboard's Cost per visit chart, as the app draws it: three monotone lines (All in the
// accent with a wash under it; Chlorine and Salt muted) from May to Sep, the month still running as
// a separate hollow dot past Sep with a pulsing ring, and each series named beside its dot. One
// 1px L for the axes, a $2–$6 scale. Inline SVG at the card's measured width, with the revenue
// chart's top and bottom margins (M) so their tops, baselines and month labels line up.

const LABEL_ROOM = 62; // right of the plot, for the series names
const NOW_STEP = 20 / 31; // the running month's dot: Oct 20 of 31 days past Sep
const LABEL_GAP = 10; // from the dot's edge to its name
const DOT_R = 4;

/**
 * `series`: [{ key, label, values (May–Sep), now, accent? }]; `months`: the x labels, the last one
 * the running month (it has no point on the lines).
 */
export default function CostChart({ months, ticks, min, max, axis, series, height = 150 }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '_');

  useBrowserLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const totalH = M.top + height + M.bottom;
  const left = Math.ceil(Math.max(...ticks.map((t) => textW(axis(t)))) + 8);
  const plotW = Math.max(0, width - left - LABEL_ROOM);
  const step = plotW / (months.length - 1);
  const x = (i) => i * step;
  const y = (v) => height - ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * height;
  const last = months.length - 2; // Sep: where the lines stop
  const nowX = x(last) + NOW_STEP * step;

  const drawn = series.map((s) => {
    const pts = s.values.map((v, i) => [x(i), y(v)]);
    return { ...s, pts, d: monotonePath(pts) };
  });
  const accent = drawn.find((s) => s.accent);
  const area = accent ? `${accent.d} L ${x(last).toFixed(1)} ${height} L 0 ${height} Z` : '';
  const muted = 'var(--muted-foreground)';

  return (
    <div ref={wrapRef} className="pl-chart" style={{ height: totalH }}>
      {width > 0 && (
        <svg width={width} height={totalH} aria-hidden="true" className="pl-cost-chart">
          {area && (
            <defs>
              <linearGradient id={`${uid}-area`} x1={0} y1={0} x2={0} y2={1}>
                <stop offset="0%" style={{ stopColor: 'var(--chart-accent)' }} stopOpacity={0.14} />
                <stop offset="100%" style={{ stopColor: 'var(--chart-accent)' }} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          <g transform={`translate(${left} ${M.top})`}>
            {area && <path d={area} style={{ fill: `url(#${uid}-area)` }} stroke="none" />}

            {drawn.map((s) => {
              const color = s.accent ? 'var(--chart-accent)' : muted;
              const ny = y(s.now);
              return (
                <g key={s.key} opacity={s.accent ? undefined : 0.6}>
                  <path d={s.d} fill="none" style={{ stroke: color }} strokeWidth={s.accent ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <circle className="pl-now-pulse" cx={nowX} cy={ny} r={DOT_R} fill="none" style={{ stroke: color }} strokeWidth={2} />
                  <circle cx={nowX} cy={ny} r={DOT_R} style={{ fill: 'var(--card)', stroke: color }} strokeWidth={2} />
                </g>
              );
            })}

            {drawn.map((s) => (
              <text
                key={s.key}
                x={nowX + DOT_R + 1 + LABEL_GAP}
                y={y(s.now)}
                dominantBaseline="middle"
                fontSize={12}
                fontWeight={s.accent ? 600 : 400}
                style={{ fill: s.accent ? 'var(--foreground)' : muted }}
              >
                {s.label}
              </text>
            ))}

            {/* The axes: one 1px L, left edge and baseline. */}
            <path d={`M 0.5 0 V ${height - 0.5} H ${plotW}`} fill="none" style={{ stroke: ink(18) }} strokeWidth={1} shapeRendering="crispEdges" />
          </g>

          {ticks.map((t) => (
            <text key={t} x={left - 8} y={M.top + y(t)} textAnchor="end" dominantBaseline="middle" fontSize={LABEL_FONT} style={{ fill: muted }}>
              {axis(t)}
            </text>
          ))}
          {months.map((m, i) => (
            <text
              key={m}
              x={left + x(i)}
              y={M.top + height + M.bottom - 8}
              textAnchor={i === 0 ? 'start' : 'middle'}
              fontSize={LABEL_FONT}
              style={{ fill: muted }}
            >
              {m}
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}
