import React from 'react';
import SectionHeader from '../SectionHeader.jsx';
import { ComingSoon } from './PaymentAutomation.jsx';

// /pool-service-billing's plans: what billing comes with on Insight and Vision, as a real table (the
// feature is each row's header). Keep it in step with /pricing's "Compare plans" (pages/pricing.jsx).
// Styles: billing-page.css (.bp-plans).

const PLANS = ['Insight', 'Vision'];
const ROWS = [
  ['Recurring invoices and autopay', true, true],
  ['Each customer’s own billing day and payment terms', true, true],
  ['Card fees passed on to customers, where state law allows', true, true],
  ['Late fees applied automatically', true, true],
  ['Automatic overdue reminders', true, true],
  ['Chemicals on invoices', true, true],
  // Not live yet: "Soon" in each plan's column, and the Coming soon pill after the name.
  // QuickBooks: flip to available when Intuit approves production keys (true, true)
  ['QuickBooks Online sync', 'soon', 'soon'],
  ['Automatic pause for customers who don’t pay', false, true],
  ['Invoices emailed from your own domain', false, true],
  ['Invoicing when a job’s done', false, true],
];

const Included = ({ plan }) => (
  <svg className="bp-plans-check" width="18" height="18" viewBox="0 0 24 24" role="img" aria-label={`Included in ${plan}`}>
    <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NotIncluded = ({ plan }) => <span className="bp-plans-dash" role="img" aria-label={`Not included in ${plan}`} />;

export default function PlansTable() {
  return (
    <section id="plans" className="bp-plans" aria-labelledby="bp-plans-title">
      <div className="container">
        <SectionHeader
          id="bp-plans-title"
          className="bp-plans-head"
          eyebrow="Plans"
          title="Automated pool billing software is in every plan."
          subtitle="No add-on and no per-invoice fee. We never take a cut of your customers’ payments."
        />
        <table className="bp-plans-table">
          <caption className="sr-only">Billing features on each plan</caption>
          <colgroup>
            <col />
            <col className="bp-plans-col" />
            <col className="bp-plans-col" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {PLANS.map((p) => <th key={p} scope="col">{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([feature, ...on]) => (
              <tr key={feature}>
                <th scope="row">{feature}{on.includes('soon') && <>{' '}<ComingSoon /></>}</th>
                {on.map((yes, i) => (
                  <td key={PLANS[i]}>
                    {yes === 'soon' ? <span className="bp-plans-soon">Soon</span> : yes ? <Included plan={PLANS[i]} /> : <NotIncluded plan={PLANS[i]} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="bp-plans-more"><a href="/pricing">See full pricing</a></p>
      </div>
    </section>
  );
}
