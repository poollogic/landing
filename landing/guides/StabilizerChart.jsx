import React, { useEffect, useRef } from 'react';

// /guides/pool-stabilizer-cyanuric-acid's hero panel (guide.css .hx): chlorine left after an hour of strong
// sun (y) against stabilizer from 0 to 120 ppm (x), with a cursor the visitor drags (an invisible range input
// over the chart) and readouts that follow it. The owner's brief of 2026-11-28 (stabilizer-guide-ide-prompt.md)
// gave its markup, CSS and script; this is that script as a component. One change: the chart's SVG is built
// here from the same code and pre-rendered, cursor at 40 ppm, so the page shows the whole chart before any
// script runs (the brief's script drew it in the browser). The readouts are in the markup too (40, 98%,
// Ideal and its sentence).
//
// The five published points (NSW Health, "Stabiliser (cyanurate) use in outdoor swimming pools", checked
// 2026-11-28): 65% of the chlorine left at 0 mg/L, about 12%, 5%, 3% and 2% lost at 10, 20, 30 and 40. The
// curve 98.3 - 33.3 * exp(-ppm / 8.2) passes within 1% of each and stays at about 98% above 40.

const W = 400, T = 14, B = 124; // chart box inside the 400 x 150 viewBox
const X = (v) => (v / 120) * W; // ppm -> x
const F = (v) => 98.3 - 33.3 * Math.exp(-v / 8.2); // % chlorine left after 1 hour
const Y = (f) => B - ((f - 60) / 40) * (B - T); // 60%..100% -> y
const START = 40;

const curTransform = (v) => `translateX(${X(v)}px)`;
const dotTransform = (v) => `translate(${X(v)}px,${Y(F(v))}px)`;

function chartSvg() {
  let d = '';
  for (let v = 0; v <= 120; v++) d += (v ? ' L' : 'M') + X(v).toFixed(1) + ' ' + Y(F(v)).toFixed(1);
  const pts = [[0, 65], [10, 88], [20, 95], [30, 97], [40, 98]]; // published points
  const top = T - 8, h = B - T + 8;
  return '<defs><linearGradient id="hxPa" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#5aa2ff" stop-opacity=".24"/><stop offset="1" stop-color="#5aa2ff" stop-opacity="0"/>' +
    '</linearGradient></defs>' +
    [100, 80].map((p) => '<line class="hx-grid" x1="0" x2="400" y1="' + Y(p) + '" y2="' + Y(p) + '"/>' +
      '<text class="hx-ylbl" x="396" y="' + (Y(p) - 5) + '" text-anchor="end">' + p + '%</text>').join('') +
    '<rect class="hx-hi" x="' + X(100) + '" y="' + top + '" width="' + (W - X(100)) + '" height="' + h + '"/>' +
    '<rect class="hx-okband" x="' + X(30) + '" y="' + top + '" width="' + (X(40) - X(30)) + '" height="' + h + '"/>' +
    '<rect class="hx-band" x="' + X(40) + '" y="' + top + '" width="' + (X(50) - X(40)) + '" height="' + h + '" rx="3"/>' +
    [30, 40, 50].map((p) => '<line class="hx-bandline"' + (p === 30 ? ' style="opacity:.5"' : '') + ' x1="' + X(p) + '" x2="' + X(p) + '" y1="' + top + '" y2="' + B + '"/>').join('') +
    '<text class="hx-ideal" x="' + X(45) + '" y="' + (T - 13) + '" text-anchor="middle">IDEAL</text>' +
    '<text class="hx-oklbl" x="' + X(35) + '" y="' + (T - 13) + '" text-anchor="middle">OK</text>' +
    '<path class="hx-pa" d="' + d + ' L' + W + ' ' + B + ' L0 ' + B + ' Z"/>' +
    '<path class="hx-p" d="' + d + '"/>' +
    pts.map((p) => '<circle class="hx-pt" cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="2.2"/>').join('') +
    '<line class="hx-base" x1="0" x2="400" y1="' + B + '" y2="' + B + '"/>' +
    [0, 30, 40, 50, 100].map((t) => '<line class="hx-tick" x1="' + X(t) + '" x2="' + X(t) + '" y1="' + B + '" y2="' + (B + 5) + '"/>' +
      '<text class="hx-lbl" x="' + X(t) + '" y="' + (B + 22) + '" text-anchor="' + (t === 0 ? 'start' : 'middle') + '">' + t + '</text>').join('') +
    '<g class="hx-move" data-hx-cur style="transform:' + curTransform(START) + '"><line class="hx-cur" x1="0" x2="0" y1="' + top + '" y2="' + B + '"/>' +
      '<circle class="hx-knob" cx="0" cy="' + B + '" r="7.5"/></g>' +
    '<circle class="hx-dp hx-move" data-hx-dot cx="0" cy="0" r="4" style="transform:' + dotTransform(START) + '"/>';
}
const SVG = { __html: chartSvg() };

function state(v) {
  if (v < 30) return ['#f4b740', 'Too low', 'More chlorine is lost to the sun than needs to be.'];
  if (v < 40) return ['#9ad7b8', 'Acceptable', 'This works. A little more gives you a bigger cushion between visits.'];
  if (v <= 50) return ['#34d399', 'Ideal', 'Nearly all the chlorine survives the sun. This is the target.'];
  if (v <= 100) return (v >= 60 && v <= 80)
    ? ['#e8c468', 'Normal for salt pools', 'No more sun protection than at 40, and chlorine works more slowly. Salt pools run here on purpose.']
    : ['#e8c468', 'Running high', 'No more sun protection than at 40, and chlorine works more slowly.'];
  return ['#ff5c7a', 'Too high', 'No extra protection, and the chlorine is too slow to keep up.'];
}

export default function StabilizerChart() {
  const ref = useRef(null);

  useEffect(() => {
    const hx = ref.current;
    if (!hx) return undefined;
    const rng = hx.querySelector('.hx-range');
    const ppm = hx.querySelector('[data-hx-ppm]');
    const keep = hx.querySelector('[data-hx-keep]');
    const status = hx.querySelector('[data-hx-status]');
    const say = hx.querySelector('[data-hx-say]');
    const cur = hx.querySelector('[data-hx-cur]');
    const dot = hx.querySelector('[data-hx-dot]');
    let shown = START, raf = 0, timer = 0;

    const paint = (v) => { ppm.textContent = v; keep.textContent = Math.round(F(v)) + '%'; };
    const tween = (to) => {
      cancelAnimationFrame(raf);
      const from = shown, t0 = performance.now();
      const step = (t) => {
        const k = Math.min((t - t0) / 700, 1);
        shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        paint(shown);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      step(t0);
    };
    const set = (v, instant) => {
      rng.value = v;
      const s = state(v);
      hx.style.setProperty('--acc', s[0]);
      status.textContent = s[1];
      say.textContent = s[2];
      cur.style.transform = curTransform(v);
      dot.style.transform = dotTransform(v);
      if (instant) { cancelAnimationFrame(raf); shown = v; paint(v); } else tween(v);
    };

    // Plays through the levels by itself until the visitor touches it.
    let auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seq = [40, 0, 10, 30, 40, 70, 112];
    let i = 0;
    const stop = () => { if (!auto) return; auto = false; clearInterval(timer); hx.classList.add('is-drag'); };
    const onInput = () => { stop(); set(+rng.value, true); };
    const starts = ['pointerdown', 'keydown', 'touchstart'];
    starts.forEach((ev) => rng.addEventListener(ev, stop, { passive: true }));
    rng.addEventListener('input', onInput);
    set(START, true);
    if (auto) timer = setInterval(() => { i = (i + 1) % seq.length; set(seq[i]); }, 3400);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
      starts.forEach((ev) => rng.removeEventListener(ev, stop));
      rng.removeEventListener('input', onInput);
    };
  }, []);

  const [, label, sentence] = state(START);
  return (
    <div className="hx" data-hx ref={ref}>
      <div className="hx-top">
        <span className="hx-k">Stabilizer · CYA</span>
        <span className="hx-status"><i /><span data-hx-status>{label}</span></span>
      </div>
      <div className="hx-stats">
        <div className="hx-num"><b data-hx-ppm>{START}</b><span>ppm</span></div>
        <div className="hx-keep"><b data-hx-keep>{Math.round(F(START))}%</b><span>of chlorine left after an hour of strong sun</span></div>
      </div>
      <p className="hx-say" data-hx-say>{sentence}</p>
      <div className="hx-plot">
        <input type="range" className="hx-range" min="0" max="120" step="1" defaultValue={START} aria-label="Stabilizer level in ppm" />
        <svg viewBox="0 0 400 150" aria-hidden="true" data-hx-svg dangerouslySetInnerHTML={SVG} />
      </div>
      <div className="hx-legend">
        <span><i />Chlorine left after 1 hour of strong sun</span>
        <em>Data: NSW Health</em>
      </div>
    </div>
  );
}
