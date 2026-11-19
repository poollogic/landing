import React, { useRef } from 'react';
import DayTimeline, { F, useTimelineScroll } from '../DayTimeline.jsx';

// /recurring-billing's late invoices: what happens to the invoice above (Dana's, $145, Net 15) when it
// isn't paid, as the homepage's scroll-lit timeline (DayTimeline.jsx, day.css), dated instead of timed.
// Add an entry to LATE and it appears in order. This page's own sizes: billing-page.css (.bp-late).

const LATE = [
  {
    time: '2025-05-05', label: 'May 5', title: 'Invoice emailed to Dana',
    detail: <><F>$145.00</F>, due <F>May 20</F>. Sent in the 8:30 AM billing run.</>,
  },
  {
    time: '2025-05-20', label: 'May 20', title: 'The due date passes',
    detail: <>Net 15 is up and the invoice is still unpaid. Nothing for you to do.</>,
  },
  {
    time: '2025-05-21', label: 'May 21', title: 'First reminder emailed',
    detail: <>A friendly note with a link to pay, the day after the due date.</>,
  },
  {
    time: '2025-05-30', label: 'May 30', title: 'Late fee added',
    detail: <>Your 10-day grace period ends. <F>$25</F> goes on the invoice and a firmer reminder is sent. New balance <F>$170.00</F>.</>,
  },
  {
    time: '2025-06-19', label: 'Jun 19', title: 'Service paused', tag: 'Vision',
    detail: <><F>30 days</F> past due. Service stops until they pay, and paused months aren’t billed.</>,
  },
];

export default function LateInvoices() {
  const ref = useRef(null);
  const live = useTimelineScroll(ref);
  return (
    <section ref={ref} id="late-invoices" className={`dt-section bp-late${live ? ' is-live' : ''}`} aria-labelledby="bp-late-title">
      <div className="dt-glow" aria-hidden="true" />
      <div className="dt-inner">
        <p className="section-eyebrow dt-eyebrow">Late invoices</p>
        <h2 id="bp-late-title" className="dt-title">
          <span className="dt-title-line">When someone doesn’t pay,</span>{' '}
          <span className="dt-title-line">you don’t have to chase them.</span>
        </h2>
        <p className="dt-sub">
          Take the invoice above and leave it unpaid. Here’s everything Poolnautics does about it, on rules you
          set once.
        </p>
        <DayTimeline entries={LATE} />
        <p className="bp-late-close dt-reveal">Once they pay, it stops there.</p>
      </div>
    </section>
  );
}
