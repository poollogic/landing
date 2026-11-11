import React, { useEffect, useId, useRef, useState } from 'react';
import useBrowserLayoutEffect from '../useBrowserLayoutEffect.js';
import { LABEL_FONT, M, TIP_GAP, TipCard, ink, monotonePath, textW } from './PreviewChart.jsx';

// The hero dashboard's line charts (revenue and cost per visit), as the app draws them: monotone
// lines over the finished months (the accent series glowing, with a wash under it where `area`; the
// rest grey context lines), a dotted lead-in from each line's end to the month still running, shown
// as a hollow ring with a pulse, and one 1px L for the axes. Inline SVG at the card's measured
// width, with the shared top and bottom margins (M) so the two charts' ticks, baselines and month
// labels line up. With `tooltip`, hover snaps to a month and shows the app's tooltip card.

const NOW_STEP = 20 / 31; // the running month's dot: Oct 20 of 31 days past Sep
const DOT_R = 4;
const RING_EDGE = DOT_R + 1; // the ring's outer edge (its 2px stroke is centred on the radius)
const LEAD_START = 4; // the dotted lead-in starts this far past the line's end...
const LEAD_GAP = 3; // ...and stops this far short of the ring's edge

/**
 * `months`: the x labels, the last the running month (no point on the lines). `series`: [{ key,
 * values (the finished months), now, accent? }]. `area`: the wash under the accent line (and a
 * fainter one under its lead-in). `accentWidth`: the accent line's stroke. `labelRoom`: px right of
 * the plot; `leftGutter`, px left of it for the tick labels. `tooltip(i)`: the card for month i (the
 * last is the running month).
 */
export default function LineChart({ months, ticks, min, max, axis, series, height = 150, leftGutter, labelRoom = 12, area: withArea = true, accentWidth = 2, tooltip }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const cardRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState(null);
  const lastHover = useRef(null);
  const [cardW, setCardW] = useState(200);
  const [room, setRoom] = useState(null);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, '_');

  useBrowserLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    // The observer reports the width once layout is done (its first call is right away), so the
    // chart never makes the browser lay the page out early.
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A tap keeps its tooltip up after the finger lifts; tapping anywhere else clears it.
  const showing = hover != null;
  useEffect(() => {
    if (!showing) return undefined;
    const away = (e) => { if (!svgRef.current?.contains(e.target)) setHover(null); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [showing]);

  if (hover != null) lastHover.current = hover;
  const shown = lastHover.current;
  const tip = tooltip && shown != null ? tooltip(shown) : null;

  // The tooltip's width, and how far right it may reach: its chart card's right edge, and never
  // closer than 10px to the dashboard panel's (which clips), in the chart's own pixels.
  useBrowserLayoutEffect(() => {
    if (!tooltip || shown == null) return; // measured only once someone points at the chart
    if (cardRef.current) setCardW(cardRef.current.offsetWidth);
    const wrap = wrapRef.current;
    const panel = wrap?.closest('.pl-panel');
    if (!wrap || !panel || !wrap.offsetWidth) return;
    const card = wrap.closest('.pl-trend, .pl-card');
    const right = Math.min(panel.getBoundingClientRect().right - 10, card ? card.getBoundingClientRect().right : Infinity);
    const r = wrap.getBoundingClientRect();
    setRoom((right - r.left) / (r.width / wrap.offsetWidth || 1));
  }, [shown, width]);

  const totalH = M.top + height + M.bottom;
  const left = leftGutter ?? Math.ceil(Math.max(...ticks.map((t) => textW(axis(t)))) + 8);
  const plotW = Math.max(0, width - left - labelRoom);
  const step = plotW / (months.length - 1);
  const x = (i) => i * step;
  const y = (v) => height - ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * height;
  const last = months.length - 2; // the last finished month: where the lines stop
  const nowX = x(last) + NOW_STEP * step;
  const xAt = (i) => (i > last ? nowX : x(i)); // a month's point: the running one is its dot

  const f1 = (n) => n.toFixed(1);
  const drawn = series.map((s) => {
    const pts = s.values.map((v, i) => [x(i), y(v)]);
    // The dotted lead-in: from just past the line's end to just short of the ring.
    const [x0, y0] = pts[pts.length - 1];
    const x1 = nowX;
    const y1 = y(s.now);
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const ux = (x1 - x0) / len;
    const uy = (y1 - y0) / len;
    const from = LEAD_START;
    const to = len - RING_EDGE - LEAD_GAP;
    const lead = to > from ? `M ${f1(x0 + ux * from)} ${f1(y0 + uy * from)} L ${f1(x0 + ux * to)} ${f1(y0 + uy * to)}` : '';
    return {
      ...s,
      color: s.accent ? 'var(--chart-accent)' : 'var(--chart-context)',
      width: s.accent ? accentWidth : 1.5,
      d: monotonePath(pts),
      lead,
      leadArea: `M ${f1(x0)} ${f1(y0)} L ${f1(x1)} ${f1(y1)} L ${f1(x1)} ${height} L ${f1(x0)} ${height} Z`,
    };
  });
  const accent = withArea ? drawn.find((s) => s.accent) : null;
  const area = accent ? `${accent.d} L ${x(last).toFixed(1)} ${height} L 0 ${height} Z` : '';
  const muted = 'var(--muted-foreground)';

  // Hover: the nearest month (the running month at its dot).
  const indexAt = (clientX) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const local = (clientX - r.left) / (r.width / width || 1) - left;
    let best = 0;
    for (let i = 1; i <= last + 1; i++) if (Math.abs(xAt(i) - local) < Math.abs(xAt(best) - local)) best = i;
    return best;
  };
  const anchor = shown != null ? left + xAt(shown) : 0;
  const limit = room ?? width - 4;
  const tipLeft = anchor + TIP_GAP + cardW > limit ? Math.max(0, anchor - TIP_GAP - cardW) : anchor + TIP_GAP;

  return (
    <div ref={wrapRef} className="pl-chart" style={{ height: totalH }}>
      {width > 0 && (
        <svg
          ref={svgRef}
          width={width}
          height={totalH}
          aria-hidden="true"
          className="pl-line-chart"
          onPointerDown={tooltip ? (e) => setHover(indexAt(e.clientX)) : undefined}
          onPointerMove={tooltip ? (e) => setHover(indexAt(e.clientX)) : undefined}
          onPointerLeave={tooltip ? (e) => { if (e.pointerType === 'mouse') setHover(null); } : undefined}
        >
          {area && (
            <defs>
              <linearGradient id={`${uid}-area`} x1={0} y1={0} x2={0} y2={1}>
                <stop offset="0%" style={{ stopColor: 'var(--chart-accent)' }} stopOpacity={0.2} />
                <stop offset="100%" style={{ stopColor: 'var(--chart-accent)' }} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          <g transform={`translate(${left} ${M.top})`}>
            {area && <path d={area} style={{ fill: `url(#${uid}-area)` }} stroke="none" />}
            {accent && <path d={accent.leadArea} style={{ fill: 'var(--chart-accent)' }} fillOpacity={0.06} stroke="none" />}

            {hover != null && (
              <line className="pl-guide is-solid" x1={xAt(hover)} x2={xAt(hover)} y1={0} y2={height} shapeRendering="crispEdges" />
            )}

            {/* Grey context lines first, so the accent line and its glow sit on top. */}
            {[...drawn].sort((a, b) => Number(!!a.accent) - Number(!!b.accent)).map((s) => {
              const ny = y(s.now);
              return (
                <g key={s.key}>
                  <path className={s.accent ? 'pl-line-accent' : undefined} d={s.d} fill="none" style={{ stroke: s.color }} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" />
                  {s.lead && <path d={s.lead} fill="none" style={{ stroke: s.color }} strokeWidth={s.width} strokeDasharray="1 5" strokeLinecap="round" opacity={0.85} />}
                  <circle className="pl-now-pulse" cx={nowX} cy={ny} r={DOT_R} fill="none" style={{ stroke: s.color }} strokeWidth={2} />
                  <circle cx={nowX} cy={ny} r={DOT_R} style={{ fill: 'var(--card)', stroke: s.color }} strokeWidth={2} />
                </g>
              );
            })}

            {/* Hover rings: every series at the hovered finished month. */}
            {hover != null && hover <= last && drawn.map((s) => (
              <circle key={`ring-${s.key}`} cx={x(hover)} cy={y(s.values[hover])} r={DOT_R} style={{ fill: 'var(--card)', stroke: s.color }} strokeWidth={2} />
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
      {tooltip && <TipCard tip={tip} left={tipLeft} visible={hover != null} cardRef={cardRef} />}
    </div>
  );
}
