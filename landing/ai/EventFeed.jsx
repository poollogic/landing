import React from 'react';
import { RotateCw } from 'lucide-react';

// A webhook delivery log, live-looking: the newest event on top (the one whose payload the JSON
// panel beside it shows, so it keeps that sample's names), then earlier deliveries, one of them on
// a retry. The other names (the homepage's Better Call Saul cast), amounts and times are MOCK
// data; the event names and the retry count (7 attempts) are the app's.

const ROWS = [
  ['visit.completed', 'Jane Smith · Mike Ross', 'Just now', '200'],
  ['payment.received', 'Kim Wexler · $385.00', '6 min ago', '200'],
  ['lead.created', 'New lead · Source: Facebook', '14 min ago', '200'],
  ['estimate.approved', 'Howard Hamlin · Pump swap', '31 min ago', 'retry'],
  ['filter.replaced', 'Chuck McGill · Cartridge', '48 min ago', '200'],
  ['service.resumed', 'Mike Ehrmantraut', '1 hr ago', '200'],
  ['request.status_changed', 'Green-to-clean · Scheduled', '1 hr ago', '200'],
  ['customer.created', 'Nacho Varga', '2 hr ago', '200'],
];

export default function EventFeed() {
  return (
    <figure className="ai-feed" aria-label="Example: the webhook delivery log">
      <figcaption className="ai-feed-head">
        <span className="ai-feed-title">Webhook deliveries</span>
        <span className="ai-feed-live"><span className="ai-live-dot is-pulsing" aria-hidden="true" />Live</span>
      </figcaption>
      <ul>
        {ROWS.map(([event, detail, when, status], i) => (
          <li key={event} className={`ai-feed-row${i === 0 ? ' is-selected' : ''}`}>
            <span className="ai-feed-main">
              <code>{event}</code>
              <span>{detail}</span>
            </span>
            <span className="ai-feed-meta">
              {status === 'retry' ? (
                <span className="ai-feed-status is-retry"><RotateCw size={11} strokeWidth={2.4} aria-hidden="true" />Retry 2 of 7</span>
              ) : (
                <span className="ai-feed-status">{status}</span>
              )}
              <span className="ai-feed-when">{when}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
