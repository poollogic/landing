import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import DelayControl from './DelayControl.jsx';

// An automation as a timeline: trigger → (wait) → actions, the way the builder lays it out, in the
// light card of #automations (Automations.jsx passes the examples and which one is picked). A step
// with `wait` shows the delay control instead of a title. The company, customers and messages are MOCK
// data. Styles: ai.css (.ai-flow*); the card's outline and shadow are the light assistant window's
// (--ai-light-card-shadow).
// All four timelines are in the card, stacked in one cell, the others hidden (out of sight, of the
// keyboard and of screen readers), so the card is always the tallest one's height and never jumps.
// The picked one is keyed by its example, so a new one fades in. Each step but the last draws the line
// down to the next step's icon: grey, and blue once the step it leads to is reached.
// Play-through: the first time the card is 35% on screen, and every time an example is picked, the
// steps start faded and light up one after another, STEP_MS apart, then hold. Opacity and colour
// only, so nothing moves. The server (and the first render) shows every step lit, so the
// pre-rendered page and reduced motion show the finished state; the steps fade only once this runs.

const FIRST_MS = 250; // from the trigger to the first step
const STEP_MS = 650; // between steps
const ALL = Number.MAX_SAFE_INTEGER; // every step lit

function Steps({ example, delay, onDelay, hidden, lit }) {
  const n = example.steps.length;
  return (
    <ol
      className={`ai-flow-steps${hidden ? ' is-ghost' : ' ai-flow-swap'}`}
      aria-hidden={hidden || undefined}
    >
      {example.steps.map(({ kind, icon: Icon, title, detail, message, wait }, i) => (
        <li
          key={kind + (title || 'wait')}
          className={`ai-flow-step${wait ? ' is-wait' : ''}${i < lit ? '' : ' is-dim'}${i < n - 1 && i + 1 < lit ? ' is-through' : ''}`}
        >
          <span className="ai-flow-node" aria-hidden="true">{wait ? <Clock size={13} strokeWidth={2} /> : <Icon size={15} strokeWidth={2} />}</span>
          <div className="ai-flow-body">
            <span className="ai-flow-kind">{kind}</span>
            {wait ? <DelayControl value={delay} onChange={onDelay} /> : <span className="ai-flow-title">{title}</span>}
            {detail && <span className="ai-flow-detail">{detail}</span>}
            {message && (
              <span className="ai-flow-msg">
                <span>{message}</span>
                <span className="ai-flow-msg-status">Delivered<span aria-hidden="true"> ✓</span></span>
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AutomationFlow({ examples, picked, delays, onDelay }) {
  const example = examples[picked];
  const ref = useRef(null);
  const [lit, setLit] = useState(ALL);
  const timers = useRef([]);
  const playRef = useRef(null);
  const pickedRef = useRef(picked);

  // The first time it's on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    playRef.current = (n) => {
      clear();
      setLit(0);
      for (let k = 1; k <= n; k++) timers.current.push(setTimeout(() => setLit(k === n ? ALL : k), FIRST_MS + STEP_MS * (k - 1)));
    };
    let seen = false;
    if (el.getBoundingClientRect().top > window.innerHeight) setLit(0); // below the fold: faded until it plays
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || seen) return;
      seen = true;
      io.disconnect();
      playRef.current(examples[pickedRef.current].steps.length);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clear(); playRef.current = null; };
  }, [examples]);

  // And every time an example is picked.
  useEffect(() => {
    if (pickedRef.current === picked) return;
    pickedRef.current = picked;
    playRef.current?.(examples[picked].steps.length);
  }, [picked, examples]);

  return (
    <figure ref={ref} className="ai-flow" aria-label={`Example automation: ${example.name}`}>
      <figcaption className="ai-flow-head">
        <span>
          <span className="ai-flow-label">Built into Poolnautics</span>
          <b key={example.key} className="ai-flow-swap">{example.name}</b>
        </span>
        <span className="ai-switch-row">
          On
          <span className="ai-switch is-on" aria-hidden="true"><i /></span>
        </span>
      </figcaption>
      <div className="ai-flow-stack">
        {examples.map((e, i) => (
          <Steps
            key={i === picked ? e.key : `ghost-${e.key}`}
            example={e}
            hidden={i !== picked}
            lit={i === picked ? lit : ALL}
            delay={delays[e.key]}
            onDelay={i === picked ? (d) => onDelay(e.key, d) : () => {}}
          />
        ))}
      </div>
    </figure>
  );
}
