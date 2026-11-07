import React from 'react';
import { Check } from 'lucide-react';

// "Ask first": a price change the AI proposed, waiting on its review page in Poolnautics, drawn the
// way the app draws it (the status banner, the totals, the rule in words, the assistant's reason
// as quoted text, every customer's price now and new, Approve and Decline). One customer is left
// out, so the totals are for the 211 still ticked. Names (the homepage's Better Call Saul cast),
// prices and totals are MOCK data; the wording and the flow are the app's. Styles: ai.css (.ai-pp*).

const ROWS = [
  ['Kim Wexler', '$145.00', '$155.00', true],
  ['Howard Hamlin', '$160.00', '$170.00', false],
  ['Chuck McGill', '$120.00', '$130.00', true],
  ['Mike Ehrmantraut', '$135.00', '$145.00', true],
];

const TILES = [
  ['Customers included', '211', 'of 212 proposed'],
  ['Monthly now', '$30,580'],
  ['Monthly after', '$32,690'],
  ['Change a month', '+$2,110', '+6.9%'],
];

export default function PriceProposal() {
  return (
    <figure className="ai-pp" aria-label="Example: a price change the AI proposed, waiting for an admin to approve it in Poolnautics">
      <div className="ai-pp-bar">
        <span className="ai-pp-title">Price change</span>
        <span className="ai-pp-chip"><span className="ai-pp-dot" aria-hidden="true" />Waiting for approval</span>
      </div>

      <div className="ai-pp-body">
        <p className="ai-pp-banner">
          <b>Waiting for an owner or admin</b>
          <span>Decide by Nov 7 · Proposed by Office laptop (AI assistant)</span>
        </p>

        <dl className="ai-pp-tiles">
          {TILES.map(([label, value, sub]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <span className="font-tnum">{value}</span>
                {sub && <small>{sub}</small>}
              </dd>
            </div>
          ))}
        </dl>

        <p className="ai-pp-rule">Every active customer with no increase in 12 months: raised $10.00 a month.</p>
        <blockquote className="ai-pp-reason">
          <span>Its reason, in its words</span>
          Chemical costs are up, and these customers haven’t had an increase in 12 months.
        </blockquote>

        <table className="ai-pp-table">
          <caption className="sr-only">Customers in the proposal, with their price now and their new price</caption>
          <thead>
            <tr><th scope="col"><span className="sr-only">Included</span></th><th scope="col">Customer</th><th scope="col">Now</th><th scope="col">New</th></tr>
          </thead>
          <tbody>
            {ROWS.map(([name, now, next, on]) => (
              <tr key={name} className={on ? undefined : 'is-out'}>
                <td>
                  <span className={`ai-pp-check${on ? ' is-on' : ''}`} aria-hidden="true">{on && <Check size={11} strokeWidth={3} />}</span>
                  <span className="sr-only">{on ? 'Included' : 'Left out'}</span>
                </td>
                <th scope="row">{name}</th>
                <td className="font-tnum">{now}</td>
                <td className="font-tnum">{next}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ai-pp-more">and 208 more · Untick anyone to leave them out</p>

        <div className="ai-pp-actions" aria-hidden="true">
          <span className="ai-pp-approve">Approve 211 price changes</span>
          <span className="ai-pp-decline">Decline</span>
        </div>
      </div>
    </figure>
  );
}
