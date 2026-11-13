import React from 'react';
import { Clock } from 'lucide-react';
import DelayControl from './DelayControl.jsx';

// An automation as a timeline: trigger → (wait) → actions, the way the builder lays it out, in the
// light card of #automations (Automations.jsx passes the example shown). A step with `wait` shows
// the delay control instead of a title. The company, customers and messages are MOCK data.
// Styles: ai.css (.ai-flow*). The steps are keyed by the example, so a new one fades in.

export default function AutomationFlow({ example, delay, onDelay }) {
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
      <ol key={example.key} className="ai-flow-steps ai-flow-swap">
        {example.steps.map(({ kind, icon: Icon, title, detail, message, wait }) => (
          <li key={kind + (title || 'wait')} className={`ai-flow-step${wait ? ' is-wait' : ''}`}>
            <span className="ai-flow-node" aria-hidden="true">{wait ? <Clock size={13} strokeWidth={2} /> : <Icon size={15} strokeWidth={2} />}</span>
            <div className="ai-flow-body">
              <span className="ai-flow-kind">{kind}</span>
              {wait ? <DelayControl value={delay} onChange={onDelay} /> : <span className="ai-flow-title">{title}</span>}
              {detail && <span className="ai-flow-detail">{detail}</span>}
              {message && <span className="ai-flow-msg">{message}</span>}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
