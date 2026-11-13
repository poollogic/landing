import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { ACCESS_LEVELS, MCP_TOOL_COUNT } from '../../aiFacts.js';

// #connect-ai's diagram: the three access levels (a radio group) on the left, the Poolnautics MCP
// hub in the middle with the tools available at the chosen level, and what the assistant can do
// on the right. Cards up to the chosen level are lit; the hub's switch turns AI access off (the
// count runs down to 0, everything greys out) and choosing a level turns it back on. Curved lines
// join each level to the hub and the hub to each capability card, drawn between their measured
// edges after layout (and again on resize); the server renders none, so nothing moves. Counts from
// aiFacts.js (ACCESS_LEVELS). Styles: ai.css ("AI assistant / MCP").

const ASK = [
  'Who owes us more than 30 days?',
  'Raise everyone with no increase in a year by $10.',
  'Send all three a reminder.',
];
// What each level adds, with the tools it adds (the first level's count is its own total).
const CAPS = [
  { title: 'Look things up', items: ['Customers, invoices and quotes', 'Receivables, revenue and visits'] },
  { title: 'Work the office queue', items: ['Assign requests, draft invoices', 'Change monthly prices for groups of customers, once you approve'] },
  { title: 'Email your customers', items: ['Send invoices and quotes'] },
];
const NEVER_ITEMS = ['Charge or refund a payment', 'Change a price without your approval'];
const TOTALS = ACCESS_LEVELS.map((_, i) => ACCESS_LEVELS.slice(0, i + 1).reduce((n, l) => n + l.tools, 0));
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// The hub's number counts to its new value over 350ms (at once with reduced motion).
function useCount(target) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target;
      setShown(target);
      return undefined;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 350);
      const value = Math.round(start + (target - start) * (1 - (1 - p) ** 3));
      from.current = value;
      setShown(value);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

const curve = (x1, y1, x2, y2) => {
  const dx = (x2 - x1) / 2;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
};

export default function McpDiagram() {
  const [level, setLevel] = useState(1); // Make changes
  const [on, setOn] = useState(true);
  const count = useCount(on ? TOTALS[level] : 0);

  // The lines: measured from the rows, the hub and the cards, relative to the diagram.
  const ref = useRef(null);
  const [lines, setLines] = useState(null);
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const measure = () => {
      const o = root.getBoundingClientRect();
      const box = (el) => {
        const b = el.getBoundingClientRect();
        return { l: b.left - o.left, r: b.right - o.left, y: b.top - o.top + b.height / 2 };
      };
      const hub = box(root.querySelector('.ai-mcp-hub'));
      const rows = [...root.querySelectorAll('.ai-mcp-level')].map(box);
      const cards = [...root.querySelectorAll('.ai-mcp-cap:not(.is-never)')].map(box);
      const next = {
        w: Math.round(o.width),
        h: Math.round(o.height),
        in: rows.map((r) => curve(r.r, r.y, hub.l, hub.y)),
        out: cards.map((c) => curve(hub.r, hub.y, c.l, c.y)),
      };
      setLines((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    // The columns too: a longer "Try asking" line moves the hub without resizing it.
    root.querySelectorAll('.ai-mcp-levels, .ai-mcp-mid, .ai-mcp-caps, .ai-mcp-level, .ai-mcp-hub, .ai-mcp-cap').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const choose = (i) => {
    setLevel(i);
    setOn(true);
  };

  return (
    <div ref={ref} className={`ai-mcp${on ? '' : ' is-off'}`}>
      {lines && (
        <svg className="ai-mcp-lines" width={lines.w} height={lines.h} viewBox={`0 0 ${lines.w} ${lines.h}`} aria-hidden="true">
          {lines.in.map((d, i) => <path key={`in${i}`} d={d} className={on && i === level ? 'is-lit' : undefined} />)}
          {lines.out.map((d, i) => <path key={`out${i}`} d={d} className={on && i <= level ? 'is-lit' : undefined} />)}
        </svg>
      )}

      <fieldset className="ai-mcp-levels">
        <legend className="ai-pick-label">Access level <span>Tap one to try it</span></legend>
        {ACCESS_LEVELS.map((l, i) => (
          <label key={l.key} className={`ai-mcp-level${on && i === level ? ' is-on' : ''}`}>
            <input type="radio" name="ai-mcp-level" className="sr-only" checked={i === level} onChange={() => choose(i)} onClick={() => choose(i)} />
            <span className="ai-radio" aria-hidden="true" />
            <span className="ai-mcp-level-text">
              <b>{l.name}</b>
              <span>{['Looks things up. Changes nothing.', 'Works the office queue.', 'Emails invoices and quotes.'][i]}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="ai-mcp-mid">
        <div className="ai-mcp-hub">
          <p className="ai-mcp-hub-label">Poolnautics MCP</p>
          <p className="ai-mcp-count" aria-live="polite">
            <span className="font-tnum">{count}</span>
            <span className="ai-mcp-of">of {MCP_TOOL_COUNT} tools</span>
          </p>
          <button type="button" role="switch" aria-checked={on} className="ai-mcp-switch" onClick={() => setOn((v) => !v)}>
            <span className={`ai-switch${on ? ' is-on' : ''}`} aria-hidden="true"><i /></span>
            {on ? 'AI access on' : 'AI access off'}
          </button>
        </div>
        <div className="ai-mcp-ask" aria-hidden={!on}>
          <p className="ai-pick-label">Try asking</p>
          <p key={level} className="ai-mcp-bubble">{ASK[level]}</p>
        </div>
      </div>

      <div className="ai-mcp-caps">
        <p className="ai-pick-label">What your assistant can do</p>
        {CAPS.map((c, i) => (
          <div key={c.title} className={`ai-mcp-cap${on && i <= level ? ' is-lit' : ''}`}>
            <p className="ai-mcp-cap-top">
              <b>{c.title}</b>
              <span>{i === 0 ? '' : '+'}{ACCESS_LEVELS[i].tools} tools</span>
            </p>
            <ul>
              {c.items.map((t) => <li key={t}><Check size={14} strokeWidth={2.4} aria-hidden="true" />{t}</li>)}
            </ul>
          </div>
        ))}
        <div className="ai-mcp-cap is-never">
          <p className="ai-mcp-cap-top">
            <b><Lock size={14} strokeWidth={2.2} aria-hidden="true" />Never, at any level</b>
            <span>0 tools</span>
          </p>
          <ul>
            {NEVER_ITEMS.map((t) => <li key={t}><span className="ai-mcp-dash" aria-hidden="true" />{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
