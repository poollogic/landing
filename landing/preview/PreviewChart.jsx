import React, { useId, useLayoutEffect, useRef, useState } from 'react';

// Copy of the app's TrendChart (poollogic-web-app src/components/ui/
// TrendChart.tsx): same margins, bar geometry, hatch, dashed last segment,
// hollow end ring, dashed baseline with its wash, and 11px axis labels. The
// one live part is hover: it snaps to a month and shows the app-style
// tooltip card. `smooth` lines are drawn as a monotone cubic (no overshoot).

const M = { top: 14, bottom: 26 };
const LABEL_FONT = 11;
const RING_R = 4;
const BAR_RADIUS = 4;
const TIP_GAP = 14;
// Tick labels are a handful of characters at 11px; ~6.2px each.
const textW = (s) => s.length * 6.2;
const ink = (pct) => `color-mix(in srgb, var(--foreground) ${pct}%, transparent)`;

function barPath(x0, w, top, bottom) {
  const r = Math.max(0, Math.min(BAR_RADIUS, w / 2, bottom - top));
  const x1 = x0 + w;
  return `M ${x0} ${bottom} V ${top + r} A ${r} ${r} 0 0 1 ${x0 + r} ${top} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${top + r} V ${bottom} Z`;
}

const lastIndex = (values) => values.reduce((m, v, i) => (v != null ? i : m), -1);
const f = (n) => n.toFixed(1);

/** Monotone cubic tangents (as d3's curveMonotoneX) for one run of points. */
function monotoneTangents(pts) {
  const n = pts.length;
  const t = new Array(n).fill(0);
  if (n < 2) return t;
  const sign = (v) => (v < 0 ? -1 : 1);
  const slope = (a, b) => (b[1] - a[1]) / (b[0] - a[0]);
  for (let i = 1; i < n - 1; i++) {
    const [p0, p1, p2] = [pts[i - 1], pts[i], pts[i + 1]];
    const h0 = p1[0] - p0[0];
    const h1 = p2[0] - p1[0];
    const s0 = slope(p0, p1);
    const s1 = slope(p1, p2);
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);
    t[i] = (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }
  const end = (a, b, tb) => {
    const s = slope(a, b);
    return (3 * s - tb) / 2;
  };
  t[0] = end(pts[0], pts[1], t[1]);
  t[n - 1] = end(pts[n - 2], pts[n - 1], t[n - 2]);
  return t;
}

/** The line's solid path and its dashed last segment (the month still running). */
function paths(values, x, y, partialLast, smooth) {
  const n = values.length;
  const pts = values.map((v, i) => (v == null ? null : [x(i), y(v)]));
  const tan = new Array(n).fill(0);
  if (smooth) {
    // Tangents per run of consecutive points.
    let start = -1;
    for (let i = 0; i <= n; i++) {
      if (i < n && pts[i]) { if (start < 0) start = i; continue; }
      if (start >= 0) {
        const run = pts.slice(start, i);
        monotoneTangents(run).forEach((v, k) => { tan[start + k] = v; });
        start = -1;
      }
    }
  }
  const seg = (i) => {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (!smooth) return ` L ${f(x1)} ${f(y1)}`;
    const h = (x1 - x0) / 3;
    return ` C ${f(x0 + h)} ${f(y0 + h * tan[i])} ${f(x1 - h)} ${f(y1 - h * tan[i + 1])} ${f(x1)} ${f(y1)}`;
  };
  const lastIdx = lastIndex(values);
  const dashFrom = partialLast && lastIdx === n - 1 && lastIdx > 0 && pts[lastIdx - 1] ? lastIdx - 1 : -1;

  let solid = '';
  let open = false;
  for (let i = 0; i < n; i++) {
    if (!pts[i]) { open = false; continue; }
    if (!open) { solid += `${solid ? ' ' : ''}M ${f(pts[i][0])} ${f(pts[i][1])}`; open = true; }
    const stop = dashFrom >= 0 && i >= dashFrom;
    if (!stop && i + 1 < n && pts[i + 1]) solid += seg(i);
  }
  const dashed = dashFrom >= 0 ? `M ${f(pts[dashFrom][0])} ${f(pts[dashFrom][1])}${seg(dashFrom)}` : '';
  return { solid, dashed, lastIdx };
}

/** The app's chart tooltip card. `tip` is { title, sub?, rows: [{ key, label, value, swatch, kind, rule?, gap? }] }. */
function TipCard({ tip, left, visible, cardRef }) {
  return (
    <div ref={cardRef} className={`pl-tip${visible ? ' is-on' : ''}`} style={{ left }} aria-hidden="true">
      {tip && (
        <>
          <div className="pl-tip-title">{tip.title}</div>
          {tip.sub && <div className="pl-tip-sub">{tip.sub}</div>}
          <div className="pl-tip-rows">
            {tip.rows.map((r) => (
              <div key={r.key} className={`pl-tip-row${r.rule ? ' is-rule' : ''}${r.gap ? ' is-gap' : ''}`}>
                <span className={`pl-tip-sw is-${r.kind || 'line'}`} style={{ background: r.swatch }} />
                <span className="pl-tip-label">{r.label}</span>
                <span className="pl-tip-value">{r.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PreviewChart({ labels, ticks, top, axis, bars, lines = [], baseline, baselineArea = false, height = 210, tooltip }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const cardRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState(null);
  const lastHover = useRef(null);
  const [cardW, setCardW] = useState(210);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '_');

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (hover != null) lastHover.current = hover;
  const shown = lastHover.current;
  const tip = tooltip && shown != null ? tooltip(shown) : null;

  useLayoutEffect(() => {
    if (cardRef.current) setCardW(cardRef.current.offsetWidth);
  }, [shown]);

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

  const indexAt = (clientX) => {
    const svg = svgRef.current;
    if (!svg || n === 0) return null;
    const local = clientX - svg.getBoundingClientRect().left - left;
    const i = hasBars ? Math.floor(local / band) : Math.round(local / (plotW / Math.max(1, n - 1)));
    return Math.min(n - 1, Math.max(0, i));
  };

  const areaPath = (() => {
    if (!baselineArea || !baseline) return '';
    const runs = [[]];
    baseline.forEach((v, i) => (v != null ? runs[runs.length - 1].push(i) : runs.push([])));
    return runs
      .filter((r) => r.length > 1)
      .map((r) => {
        const line = r.map((i) => `${f(x(i))} ${f(y(baseline[i]))}`);
        return `M ${line.join(' L ')} L ${f(x(r[r.length - 1]))} ${y(0)} L ${f(x(r[0]))} ${y(0)} Z`;
      })
      .join(' ');
  })();

  // The card sits left of the hovered month's line, flipping right when there's no room.
  const anchor = shown != null ? left + x(shown) : 0;
  const tipLeft = anchor - TIP_GAP - cardW < 4 ? anchor + TIP_GAP : anchor - TIP_GAP - cardW;

  const ringAt = (values, color, key) =>
    hover != null && values[hover] != null ? (
      <circle key={key} cx={x(hover)} cy={y(values[hover])} r={RING_R} style={{ fill: 'var(--card)', stroke: color }} strokeWidth={2} />
    ) : null;

  return (
    <div ref={wrapRef} className="pl-chart" style={{ height: totalH }}>
      {width > 0 && (
        <svg
          ref={svgRef}
          width={width}
          height={totalH}
          aria-hidden="true"
          onPointerMove={(e) => setHover(indexAt(e.clientX))}
          onPointerLeave={() => setHover(null)}
        >
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

            {/* Hover guides, behind the marks. */}
            {hover != null && hasBars && bars.values[hover] != null && (
              <line className="pl-guide" x1={x(hover)} x2={x(hover)} y1={0} y2={y(bars.values[hover])} strokeDasharray="3 3" shapeRendering="crispEdges" />
            )}
            {hover != null && !hasBars && (
              <line className="pl-guide is-solid" x1={x(hover)} x2={x(hover)} y1={0} y2={height} shapeRendering="crispEdges" />
            )}

            {hasBars && bars.values.map((v, i) => {
              if (v == null || v <= 0) return null;
              const partial = i === n - 1;
              return (
                <path
                  key={i}
                  className="pl-bar"
                  d={barPath(x(i) - barW / 2, barW, y(v), y(0))}
                  style={{
                    fill: partial ? `url(#${uid}-hatch)` : bars.color,
                    stroke: partial ? bars.color : 'none',
                    opacity: hover != null && hover !== i ? 0.45 : 1,
                  }}
                  strokeWidth={partial ? 1.5 : 0}
                />
              );
            })}

            {areaPath && <path d={areaPath} style={{ fill: `url(#${uid}-area)` }} stroke="none" />}

            {baseline && (() => {
              const { solid, dashed } = paths(baseline, x, y, true, false);
              return (
                <g style={{ stroke: 'var(--series-baseline)' }} fill="none" strokeWidth={1.5} strokeLinecap="round">
                  {solid && <path d={solid} strokeDasharray="5 4" />}
                  {dashed && <path d={dashed} strokeDasharray="5 4" />}
                </g>
              );
            })()}

            {lines.map((s) => {
              const { solid, dashed, lastIdx } = paths(s.values, x, y, true, s.smooth);
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

            {/* Hover rings: every line at the hovered month (and the baseline). */}
            {baseline && ringAt(baseline, 'var(--series-baseline)', 'ring-base')}
            {lines.map((s) => ringAt(s.values, s.color, `ring-${s.key}`))}
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
      {tooltip && <TipCard tip={tip} left={tipLeft} visible={hover != null} cardRef={cardRef} />}
    </div>
  );
}
