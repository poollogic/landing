import React, { useEffect, useId, useRef, useState } from 'react';
import useBrowserLayoutEffect from '../useBrowserLayoutEffect.js';
import { LABEL_FONT, M, TIP_GAP, TipCard, ink, monotonePath, textW } from './PreviewChart.jsx';

// The hero dashboard's line charts (revenue and cost per visit), as the app draws them: monotone
// lines over the finished months (the accent series with a wash under it, the rest muted), the month
// still running as a separate hollow dot past the last one with a pulsing ring, series named beside
// their dots when they have a label, and one 1px L for the axes. Inline SVG at the card's measured
// width, with the shared top and bottom margins (M) so the two charts' ticks, baselines and month
// labels line up. With `tooltip`, hover snaps to a month and shows the app's tooltip card.

const NOW_STEP = 20 / 31; // the running month's dot: Oct 20 of 31 days past Sep
const LABEL_GAP = 10; // from a dot's edge to its name
const DOT_R = 4;

/**
 * `months`: the x labels, the last the running month (no point on the lines). `series`: [{ key,
 * label?, values (the finished months), now, accent? }]. `labelRoom`: px right of the plot, for the
 * series names; `leftGutter`, px left of it for the tick labels. `tooltip(i)`: the card for month i (the last is the running month).
 */
export default function LineChart({ months, ticks, min, max, axis, series, height = 150, leftGutter, labelRoom = 62, tooltip }) {
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
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
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
    if (!tooltip) return;
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

  const drawn = series.map((s) => {
    const pts = s.values.map((v, i) => [x(i), y(v)]);
    return { ...s, color: s.accent ? 'var(--chart-accent)' : 'var(--muted-foreground)', d: monotonePath(pts) };
  });
  const accent = drawn.find((s) => s.accent);
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
                <stop offset="0%" style={{ stopColor: 'var(--chart-accent)' }} stopOpacity={0.14} />
                <stop offset="100%" style={{ stopColor: 'var(--chart-accent)' }} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          <g transform={`translate(${left} ${M.top})`}>
            {area && <path d={area} style={{ fill: `url(#${uid}-area)` }} stroke="none" />}

            {hover != null && (
              <line className="pl-guide is-solid" x1={xAt(hover)} x2={xAt(hover)} y1={0} y2={height} shapeRendering="crispEdges" />
            )}

            {drawn.map((s) => {
              const ny = y(s.now);
              return (
                <g key={s.key} opacity={s.accent ? undefined : 0.6}>
                  <path d={s.d} fill="none" style={{ stroke: s.color }} strokeWidth={s.accent ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <circle className="pl-now-pulse" cx={nowX} cy={ny} r={DOT_R} fill="none" style={{ stroke: s.color }} strokeWidth={2} />
                  <circle cx={nowX} cy={ny} r={DOT_R} style={{ fill: 'var(--card)', stroke: s.color }} strokeWidth={2} />
                </g>
              );
            })}

            {/* Hover rings: every series at the hovered finished month. */}
            {hover != null && hover <= last && drawn.map((s) => (
              <circle key={`ring-${s.key}`} cx={x(hover)} cy={y(s.values[hover])} r={DOT_R} style={{ fill: 'var(--card)', stroke: s.color }} strokeWidth={2} />
            ))}

            {drawn.filter((s) => s.label).map((s) => (
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
      {tooltip && <TipCard tip={tip} left={tipLeft} visible={hover != null} cardRef={cardRef} />}
    </div>
  );
}
