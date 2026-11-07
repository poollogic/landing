import React from 'react';
import { Bell, Clock, MessageSquare, UserPlus } from 'lucide-react';

// An automation as a timeline: trigger → wait → action → wait → action, the way the builder
// lays it out. The company, customer and message are MOCK data. Styles: ai.css (.ai-flow*).

const STEPS = [
  { kind: 'When', icon: UserPlus, title: 'A new lead comes in', detail: 'From your lead link, a form or an ad' },
  { kind: 'Wait', icon: Clock, title: '90 seconds', wait: true },
  {
    kind: 'Then',
    icon: MessageSquare,
    title: 'Text from your business number',
    message: 'Hi Nacho, thanks for reaching out to Bayside Pool Co. When’s a good time for a quick call about your pool?',
  },
  { kind: 'Wait', icon: Clock, title: '1 day', wait: true },
  { kind: 'Then', icon: Bell, title: 'Notify the office in Poolnautics', detail: 'A reminder to call them' },
];

export default function AutomationFlow() {
  return (
    <figure className="ai-flow" aria-label="Example automation: following up a new lead">
      <figcaption className="ai-flow-head">
        <span>
          <b>New lead follow-up</b>
          <span>Automation · 2 actions</span>
        </span>
        <span className="ai-switch-row">
          On
          <span className="ai-switch is-on" aria-hidden="true"><i /></span>
        </span>
      </figcaption>
      <ol className="ai-flow-steps">
        {STEPS.map(({ kind, icon: Icon, title, detail, message, wait }) => (
          <li key={kind + title} className={`ai-flow-step${wait ? ' is-wait' : ''}`}>
            <span className="ai-flow-node" aria-hidden="true"><Icon size={wait ? 13 : 15} strokeWidth={2} /></span>
            <span className="ai-flow-body">
              <span className="ai-flow-kind">{kind}</span>
              <span className="ai-flow-title">{title}</span>
              {detail && <span className="ai-flow-detail">{detail}</span>}
              {message && <span className="ai-flow-msg">{message}</span>}
            </span>
          </li>
        ))}
      </ol>
      <div className="ai-flow-foot">
        <span>Sending hours: 8 AM – 7 PM</span>
        <span>STOP replies honored</span>
        <span>Not twice</span>
      </div>
    </figure>
  );
}
