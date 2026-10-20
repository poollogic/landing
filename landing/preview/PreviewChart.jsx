import React, { useId, useLayoutEffect, useRef, useState } from 'react';

// Static copy of the app's TrendChart (poollogic-web-app src/components/ui/
// TrendChart.tsx): same margins, bar geometry, hatch, dashed last segment,
// hollow end ring, dashed baseline with its wash, and 11px axis labels. No
// hover, tooltips or entrance animation — this is a picture.

const M = { top: 14, bottom: 26 };
const LABEL_FONT = 11;
const RING_R = 4;
const BAR_RADIUS = 4;
// Tick labels are a handful of characters at 11px; ~6.2px each.
const textW = (s) => s.length * 6.2;
const ink = (pct) => `color-mix(in srgb, var(--foreground) ${pct}%, transparent)`;

function barPath(x0, w, top, bottom) {
  const r = Math.max(0, Math.min(BAR_RADIUS, w / 2, bottom - top));
  const x1 = x0 + w;
  return `M ${x0} ${bottom} V ${top + r} A ${r} ${r} 0 0 1 ${x0 + r} ${top} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${top + r} V ${bottom} Z`;
}

const lastIndex = (values) => values.reduce((m, v, i) => (v != null ? i : m), -1);

function paths(values, x, y, partialLast) {
  const n = values.length;
  const lastIdx = lastIndex(values);
  const dashFrom = partialLast && lastIdx === n - 1 && lastIdx > 0 && values[lastIdx - 1] != null ? lastIdx - 1 : -1;
  const solid = [];
  let open = false;
  for (let i = 0; i < n; i++) {
    if (dashFrom >= 0 && i > dashFrom) break;
    const v = values[i];
    if (v == null) { open = false; continue; }
    solid.push(`${open ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`);
    open = true;
  }
  const dashed = dashFrom >= 0
    ? `M ${x(dashFrom).toFixed(1)} ${y(values[dashFrom]).toFixed(1)} L ${x(lastIdx).toFixed(1)} ${y(values[lastIdx]).toFixed(1)}`
    : '';
  return { solid: solid.join(' '), dashed, lastIdx };
}

export default function PreviewChart({ labels, ticks, top, axis, bars, lines = [], baseline, baselineArea = false, height = 210 }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '_');

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = labels.length;
  const hasBars = !!bars;
  const totalH = M.top + height + M.bottom;
  const lastLabel = labels[n - 1];
  const lastLabelW = lastLabel ? textW(typeof lastLabel === 'string' ? lastLabel : lastLabel.text) : 0;

  // fitTrendMargins: left fits the widest tick; right fits the last label / end ring.
  const left = Math.ceil(Math.max(...ticks.map((t) => textW(axis(t)))) + 8);
  let right = 0;
  if (width) {
    const guess = Math.max(0, width - left);
    const band0 = hasBars ? guess / n : 0;
    right = hasBars ? Math.max(0, lastLabelW / 2 - band0 / 2, RING_R + 1 - band0 / 2) : Math.max(lastLabelW / 2, RING_R + 1);
    right = Math.ceil(right);
  }
  const plotW = Math.max(0, width - left - right);
  const band = n > 0 ? plotW / n : plotW;
  const x = (i) => (hasBars ? band * (i + 0.5) : n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v) => height - (Math.min(top, Math.max(0, v)) / top) * height;
  const barW = Math.min(34, Math.max(4, band * 0.58));

  const areaPath = (() => {
    if (!baselineArea || !baseline) return '';
    const runs = [[]];
    baseline.forEach((v, i) => (v != null ? runs[runs.length - 1].push(i) : runs.push([])));
    return runs
      .filter((r) => r.length > 1)
      .map((r) => {
        const line = r.map((i) => `${x(i).toFixed(1)} ${y(baseline[i]).toFixed(1)}`);
        return `M ${line.join(' L ')} L ${x(r[r.length - 1]).toFixed(1)} ${y(0)} L ${x(r[0]).toFixed(1)} ${y(0)} Z`;
      })
      .join(' ');
  })();

  return (
    <div ref={wrapRef} className="pl-chart" style={{ height: totalH }}>
      {width > 0 && (
        <svg width={width} height={totalH} aria-hidden="true">
          <defs>
            {hasBars && (
              <pattern id={`${uid}-hatch`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={6} height={6} style={{ fill: bars.color }} fillOpacity={0.16} />
                <rect width={2} height={6} style={{ fill: bars.color }} fillOpacity={0.6} />
              </pattern>
            )}
            {areaPath && (
              <linearGradient id={`${uid}-area`} x1={0} y1={0} x2={0} y2={1}>
                <stop offset="0%" style={{ stopColor: 'var(--series-baseline-fill)' }} stopOpacity={0.1} />
                <stop offset="100%" style={{ stopColor: 'var(--series-baseline-fill)' }} stopOpacity={0.01} />
              </linearGradient>
            )}
          </defs>

          <g transform={`translate(${left} ${M.top})`}>
            {/* No gridlines: just the zero line. */}
            <line x1={0} x2={plotW} y1={y(0)} y2={y(0)} style={{ stroke: ink(18) }} strokeWidth={1} shapeRendering="crispEdges" />

            {hasBars && bars.values.map((v, i) => {
              if (v == null || v <= 0) return null;
              const partial = i === n - 1;
              return (
                <path
                  key={i}
                  d={barPath(x(i) - barW / 2, barW, y(v), y(0))}
                  style={{ fill: partial ? `url(#${uid}-hatch)` : bars.color, stroke: partial ? bars.color : 'none' }}
                  strokeWidth={partial ? 1.5 : 0}
                />
              );
            })}

            {areaPath && <path d={areaPath} style={{ fill: `url(#${uid}-area)` }} stroke="none" />}

            {baseline && (() => {
              const { solid, dashed } = paths(baseline, x, y, true);
              return (
                <g style={{ stroke: 'var(--series-baseline)' }} fill="none" strokeWidth={1.5} strokeLinecap="round">
                  {solid && <path d={solid} strokeDasharray="5 4" />}
                  {dashed && <path d={dashed} strokeDasharray="5 4" />}
                </g>
              );
            })()}

            {lines.map((s) => {
              const { solid, dashed, lastIdx } = paths(s.values, x, y, true);
              const end = lastIdx >= 0 ? [x(lastIdx), y(s.values[lastIdx])] : null;
              const stale = lastIdx !== n - 1;
              return (
                <g key={s.key}>
                  {hasBars && (
                    <g style={{ stroke: 'var(--card)' }} fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
                      {solid && <path d={solid} />}
                      {dashed && <path d={dashed} />}
                    </g>
                  )}
                  <g style={{ stroke: s.color }} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {solid && <path d={solid} />}
                    {dashed && <path d={dashed} strokeDasharray="4 4" />}
                  </g>
                  {end && stale && <circle cx={end[0]} cy={end[1]} r={2.5} style={{ fill: s.color }} />}
                  {end && !stale && (
                    <>
                      <circle className="pl-pulse" cx={end[0]} cy={end[1]} r={RING_R} fill="none" style={{ stroke: s.color }} strokeWidth={2} />
                      <circle cx={end[0]} cy={end[1]} r={RING_R} style={{ fill: 'var(--card)', stroke: s.color }} strokeWidth={2} />
                    </>
                  )}
                </g>
              );
            })}
          </g>

          {ticks.map((t) => (
            <text
              key={t}
              x={left - 8}
              y={M.top + y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={LABEL_FONT}
              style={{ fill: 'var(--muted-foreground)' }}
            >
              {axis(t)}
            </text>
          ))}
          {labels.map((l, i) => {
            if (!l) return null;
            const year = typeof l === 'object' && l.year;
            return (
              <text
                key={i}
                x={left + x(i)}
                y={M.top + height + M.bottom - 8}
                textAnchor="middle"
                fontSize={LABEL_FONT}
                fontWeight={year ? 600 : undefined}
                style={{ fill: year ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              >
                {typeof l === 'string' ? l : l.text}
              </text>
            );
          })}
        </svg>
      )}
    </div>
  );
}
