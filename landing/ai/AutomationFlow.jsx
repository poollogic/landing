import React from 'react';
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
// down to the next step's icon, fading from blue as it goes, so the line always ends at the last icon.

const fade = (i, n) => `rgba(46, 133, 255, ${(1 - (0.75 * i) / Math.max(1, n - 1)).toFixed(3)})`;

function Steps({ example, delay, onDelay, hidden }) {
  const n = example.steps.length;
  return (
    <ol
      className={`ai-flow-steps${hidden ? ' is-ghost' : ' ai-flow-swap'}`}
      aria-hidden={hidden || undefined}
    >
      {example.steps.map(({ kind, icon: Icon, title, detail, message, wait }, i) => (
        <li
          key={kind + (title || 'wait')}
          className={`ai-flow-step${wait ? ' is-wait' : ''}`}
          style={i < n - 1 ? { '--seg-from': fade(i, n), '--seg-to': fade(i + 1, n) } : undefined}
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
  return (
    <figure className="ai-flow" aria-label={`Example automation: ${example.name}`}>
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
            delay={delays[e.key]}
            onDelay={i === picked ? (d) => onDelay(e.key, d) : () => {}}
          />
        ))}
      </div>
    </figure>
  );
}
