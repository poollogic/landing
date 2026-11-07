import React from 'react';
import { Bell, Link2, Tag, Webhook, Workflow } from 'lucide-react';
import { LEAD_ROUTES } from '../../aiFacts.js';

// Where leads come from → the company's lead link → what Poolnautics does with each one. The lead
// itself is MOCK data. Styles: ai.css (.ai-leads*).

const OUTCOMES = [
  [Tag, 'A request with a Lead badge and its source'],
  [Bell, 'The office bell rings'],
  [Workflow, 'Your automations start'],
  [Webhook, 'Your webhooks fire'],
];

export default function LeadFlow() {
  return (
    <div className="ai-leads">
      <div className="ai-leads-col">
        <p className="ai-leads-label">Where leads come from</p>
        <ul className="ai-leads-sources">
          {LEAD_ROUTES.map(([from, how]) => (
            <li key={from}><b>{from}</b><span>{how}</span></li>
          ))}
        </ul>
      </div>

      <div className="ai-leads-link" aria-hidden="true">
        <span className="ai-leads-wire" />
        <span className="ai-leads-hub"><Link2 size={20} strokeWidth={1.75} /></span>
        <span className="ai-leads-hub-label">Your lead link</span>
        <span className="ai-leads-wire" />
      </div>

      <div className="ai-leads-col">
        <p className="ai-leads-label">What happens next</p>
        <div className="ai-lead-card" role="group" aria-label="Example: a new lead in Poolnautics">
          <div className="ai-lead-card-top">
            <span className="ai-lead-badge">Lead</span>
            <span className="ai-lead-source">Source: Facebook</span>
          </div>
          <b>Nacho Varga</b>
          <p>“Pool turned green. Looking for weekly service.”</p>
        </div>
        <ul className="ai-leads-outcomes">
          {OUTCOMES.map(([Icon, text]) => (
            <li key={text}><Icon size={16} strokeWidth={1.75} aria-hidden="true" />{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
