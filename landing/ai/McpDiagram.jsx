import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { ACCESS_LEVELS } from '../../aiFacts.js';

// #connect-ai's diagram: the three access levels (a radio group) on the left, the Poolnautics MCP
// hub in the middle naming the chosen level, and what the assistant can do on the right. No tool
// counts (they go stale). Cards up to the chosen level are lit; the hub's switch turns AI access off
// (everything greys out) and choosing a level turns it back on. From 900px the
// two column labels share a row and the columns start level under it (the labels are grid items of
// their own, so the hub needs no spacer). Curved lines join each level to the hub and the hub to
// each capability card, drawn between their measured edges after layout, again on resize and
// whenever the level or the switch changes; the server renders none, so nothing moves. Under the
// diagram, one line on what no level can do. Level names from aiFacts.js (ACCESS_LEVELS). Styles:
// ai.css ("AI assistant / MCP").

const ASK = [
  'Who owes us more than 30 days?',
  'Raise everyone with no increase in a year by $10.',
  'Send all three a reminder.',
];
// What each level adds.
const CAPS = [
  { title: 'Look things up', items: ['Customers, invoices and quotes', 'Receivables, revenue and visits'] },
  { title: 'Work the office queue', items: ['Assign requests, draft invoices', 'Change monthly prices for groups of customers, once you approve'] },
  { title: 'Email your customers', items: ['Send invoices and quotes'] },
];
const NEVER_ITEMS = ['Charge a card', 'Refund a payment', 'Change a price without your approval'];
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const curve = (x1, y1, x2, y2) => {
  const dx = (x2 - x1) / 2;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
};

export default function McpDiagram() {
  const [level, setLevel] = useState(1); // Make changes
  const [on, setOn] = useState(true);

  // The lines: measured from the rows, the hub and the cards, relative to the diagram.
  const ref = useRef(null);
  const measureRef = useRef(null);
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
      const cards = [...root.querySelectorAll('.ai-mcp-cap')].map(box);
      const next = {
        w: Math.round(o.width),
        h: Math.round(o.height),
        in: rows.map((r) => curve(r.r, r.y, hub.l, hub.y)),
        out: cards.map((c) => curve(hub.r, hub.y, c.l, c.y)),
      };
      setLines((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measureRef.current = measure;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    // The columns too: a longer "Try asking" line moves the hub without resizing it.
    root.querySelectorAll('.ai-mcp-levels, .ai-mcp-mid, .ai-mcp-caps, .ai-mcp-level, .ai-mcp-hub, .ai-mcp-cap').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  // And after each change of level or switch, once the cards have taken their new state.
  useIsoLayoutEffect(() => { measureRef.current?.(); }, [level, on]);

  const choose = (i) => {
    setLevel(i);
    setOn(true);
  };

  return (
    <>
    <div ref={ref} className={`ai-mcp${on ? '' : ' is-off'}`}>
      {lines && (
        <svg className="ai-mcp-lines" width={lines.w} height={lines.h} viewBox={`0 0 ${lines.w} ${lines.h}`} aria-hidden="true">
          {lines.in.map((d, i) => <path key={`in${i}`} d={d} className={on && i === level ? 'is-lit' : undefined} />)}
          {lines.out.map((d, i) => <path key={`out${i}`} d={d} className={on && i <= level ? 'is-lit' : undefined} />)}
        </svg>
      )}

      <p id="ai-mcp-levels-label" className="ai-pick-label ai-mcp-label-levels">Access level <span>Tap one to try it</span></p>
      <div className="ai-mcp-levels" role="radiogroup" aria-labelledby="ai-mcp-levels-label">
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
      </div>

      <div className="ai-mcp-mid">
        <div className="ai-mcp-hub">
          <p className="ai-mcp-hub-label">Poolnautics MCP</p>
          <p className="ai-mcp-level-now" aria-live="polite">
            <span className="ai-mcp-level-cap">Access level</span>
            <span key={level} className="ai-mcp-level-name">{ACCESS_LEVELS[level].name}</span>
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

      <p className="ai-pick-label ai-mcp-label-caps">What your assistant can do</p>
      <div className="ai-mcp-caps">
        {CAPS.map((c, i) => (
          <div key={c.title} className={`ai-mcp-cap${on && i <= level ? ' is-lit' : ''}`}>
            <p className="ai-mcp-cap-top">
              <b>{c.title}</b>
            </p>
            <ul>
              {c.items.map((t) => <li key={t}><Check size={14} strokeWidth={2.4} aria-hidden="true" />{t}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="ai-mcp-never-row">
      <p className="ai-mcp-never">
        <b><Lock size={15} strokeWidth={2.2} aria-hidden="true" />Never, at any level</b>
        <span className="ai-mcp-never-items">
          {NEVER_ITEMS.map((t) => <span key={t}>{t}</span>)}
        </span>
      </p>
    </div>
    </>
  );
}
