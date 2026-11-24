import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';

// /ai-and-automations' hero, right column: "Approved quote to paid invoice", five cards on a rail.
// People's steps (the customer, the technician) are full-width cards; the automatic steps are inset
// cards, each joined to the rail on the right by a curved branch with a dot where it meets the card.
// Built at 440px; the hero shows it at 93% (ai.css, "Light hero").
//
// The lines are one SVG behind the cards (the dots one above them), drawn from the cards' measured positions (in the stack's
// own CSS px, so it's right at any zoom) and redrawn whenever the stack resizes. The grey rail and
// both branches are one path, so they share their coordinates exactly and nothing doubles where they
// meet; the blue progress is drawn over it on the same coordinates.
//
// Playback: 600ms after the block is on screen, each step runs (900ms), is done, 220ms later the blue
// rail grows on to the next step, and 400ms after that the next step runs. Once, then it holds the
// finished state; if it's scrolled away and back after that, it plays one more time, then holds for
// good (scrolled away mid-play, it jumps to the end). Reduced motion: the finished state, at once.
// The server renders every step waiting (the cards solid, their contents at 50%); the text is in the
// HTML either way. role="img" with the whole sequence as its label.

const STEPS = [
  { who: 'Customer', time: '9:02 AM', title: 'Approves the quote', detail: 'DE filter clean, $185.00, approved online' },
  { auto: true, who: 'Automatic', time: '9:02 AM', title: 'Work order lands in the tech’s app' },
  { who: 'Technician', time: '2:14 PM', title: 'Marks the job complete', detail: 'Finished in the mobile app, with photos' },
  { auto: true, who: 'Automatic', time: '2:15 PM', title: 'Invoice goes to the customer' },
  { who: 'Customer', time: '2:31 PM', title: 'Pays the invoice', paid: { amount: '$185.00', tag: 'Paid by card' } },
];
const LAST = STEPS.length - 1;
const GAP_AFTER = 1; // the "5 hours later" gap comes after this step (between cards 2 and 3)

const LABEL = 'Example automation: the customer approves a quote, the work order lands in the technician’s app automatically, the technician marks the job complete, the invoice goes to the customer automatically, and the customer pays';

const T = { start: 600, run: 900, pause: 220, toNext: 400 };
const RAIL_IN = 23; // the rail, in from the block's right edge
const CURVE = 14; // a branch leaves the rail this far above its card's centre, and curves with this radius

const WAITING = { step: -1, status: 'done', rail: -1 }; // nothing started
const FINISHED = { step: LAST, status: 'done', rail: LAST };

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** The lines' geometry, in the stack's own CSS px, from where the cards are. */
function measure(stack) {
  const box = stack.getBoundingClientRect();
  if (!box.width || !stack.offsetWidth) return null;
  const k = box.width / stack.offsetWidth; // the zoom between layout px and screen px
  const cards = [...stack.querySelectorAll('[data-step]')].map((el) => {
    const r = el.getBoundingClientRect();
    return { top: (r.top - box.top) / k, bottom: (r.bottom - box.top) / k, right: (r.right - box.left) / k };
  });
  if (cards.length !== STEPS.length) return null;
  const w = stack.offsetWidth;
  const h = box.height / k;
  const x = w - RAIL_IN;
  const top = cards[0].bottom;
  const bottom = cards[LAST].top;
  const branches = {};
  STEPS.forEach((s, i) => {
    if (!s.auto) return;
    const cy = (cards[i].top + cards[i].bottom) / 2;
    branches[i] = { cy, end: cards[i].right, d: `M${x} ${cy - CURVE}Q${x} ${cy} ${x - CURVE} ${cy}H${cards[i].right}` };
  });
  // How far down the blue rail reaches for each step: to an automatic step's branch, to the middle of
  // a person's card (behind it), and to the last card's top.
  const stops = STEPS.map((s, i) => {
    if (i === 0) return top;
    if (i === LAST) return bottom;
    return s.auto ? branches[i].cy - CURVE : (cards[i].top + cards[i].bottom) / 2;
  });
  const rail = `M${x} ${top}V${bottom}`;
  const grey = rail + Object.values(branches).map((b) => b.d).join('');
  return { w, h, x, top, bottom, branches, stops, rail, grey, gapY: (cards[GAP_AFTER].bottom + cards[GAP_AFTER + 1].top) / 2 };
}

export default function QuoteToPaid() {
  const rootRef = useRef(null);
  const stackRef = useRef(null);
  const [geo, setGeo] = useState(null);
  const [play, setPlay] = useState(WAITING);

  // Draw the lines, and redraw them whenever the stack changes size (the window, the zoom, fonts).
  useIsoLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;
    const update = () => setGeo(measure(stack));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stack);
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  // Playback: once when it first comes on screen, once more after it's been scrolled away and back.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPlay(FINISHED); return undefined; }
    let plays = 0;
    let playing = false;
    let away = false; // scrolled away since the last play finished
    let timers = [];
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const run = () => {
      plays += 1;
      playing = true;
      away = false;
      setPlay(WAITING);
      let t = T.start;
      STEPS.forEach((_, i) => {
        at(t, () => setPlay((p) => ({ ...p, step: i, status: 'running', rail: Math.max(p.rail, i) })));
        at(t + T.run, () => setPlay((p) => ({ ...p, step: i, status: 'done' })));
        if (i < LAST) at(t + T.run + T.pause, () => setPlay((p) => ({ ...p, rail: i + 1 })));
        t += T.run + T.pause + T.toNext;
      });
      at(t - T.pause - T.toNext, () => { playing = false; });
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (plays === 0 || (plays === 1 && away && !playing)) run();
      } else if (plays > 0) {
        if (playing) { clear(); playing = false; setPlay(FINISHED); }
        away = true;
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, []);

  const stateOf = (i) => {
    if (i < play.step) return 'done';
    if (i === play.step) return play.status;
    return 'waiting';
  };
  const lit = (i) => stateOf(i) !== 'waiting';
  const railTo = geo && play.rail >= 0 ? geo.stops[play.rail] : null;
  const railLen = geo ? geo.bottom - geo.top : 0;
  const railShown = railTo == null ? 0 : railTo - geo.top;

  return (
    <div ref={rootRef} className="ai-q2p" role="img" aria-label={LABEL}>
      <div ref={stackRef} className="ai-q2p-stack">
        {geo && (
          <svg className="ai-q2p-lines" viewBox={`0 0 ${geo.w} ${geo.h}`} width={geo.w} height={geo.h} preserveAspectRatio="none" aria-hidden="true">
            <path d={geo.grey} className="ai-q2p-line" />
            <path
              d={geo.rail}
              className="ai-q2p-line is-blue ai-q2p-progress"
              style={{ strokeDasharray: `${railLen} ${railLen + 4}`, strokeDashoffset: railLen - railShown, opacity: railShown > 0 ? 1 : 0 }}
            />
            {Object.entries(geo.branches).map(([i, b]) => (
              <path key={i} d={b.d} className={`ai-q2p-line is-blue ai-q2p-branch${lit(Number(i)) ? ' is-lit' : ''}`} />
            ))}
          </svg>
        )}
        {/* The dots, over the cards' edges (the lines run behind the cards). 9px across, with the stroke. */}
        {geo && (
          <svg className="ai-q2p-dots" viewBox={`0 0 ${geo.w} ${geo.h}`} width={geo.w} height={geo.h} preserveAspectRatio="none" aria-hidden="true">
            {Object.entries(geo.branches).map(([i, b]) => (
              <circle key={i} cx={b.end} cy={b.cy} r={3.625} className={`ai-q2p-dot is-${stateOf(Number(i))}`} />
            ))}
          </svg>
        )}
        {STEPS.map((s, i) => (
          <React.Fragment key={s.title}>
            <div data-step={i} className={`ai-q2p-card${s.auto ? ' is-auto' : ''}${s.paid ? ' is-paid' : ''} is-${stateOf(i)}`}>
              <div className="ai-q2p-body">
                <p className="ai-q2p-top">
                  <span className="ai-q2p-who">{s.auto && <Zap size={11} strokeWidth={2.4} aria-hidden="true" />}{s.who}</span>
                  <span className="ai-q2p-time">{s.time}</span>
                </p>
                <p className="ai-q2p-title">{s.title}</p>
                {s.detail && <p className="ai-q2p-detail">{s.detail}</p>}
                {s.paid && (
                  <p className="ai-q2p-paid">
                    <span className="ai-q2p-amount">{s.paid.amount}</span>
                    <span className="ai-q2p-tag">{s.paid.tag}</span>
                  </p>
                )}
              </div>
            </div>
            {/* On the rail, in the middle of the gap; placed once the cards are measured (absolute, so
                nothing moves when it appears). */}
            {i === GAP_AFTER && (
              <span className="ai-q2p-later" style={geo ? { top: geo.gapY, right: RAIL_IN } : { visibility: 'hidden' }}>5 hours later</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
