import React from 'react';
import { F, TimelineSection } from '../DayTimeline.jsx';

// /pool-service-billing's late invoices: every email and notice that follows when the invoice above
// (Dana's, $145, Net 15, due May 20) isn't paid, as the homepage's scroll-lit timeline
// (DayTimeline.jsx, day.css), dated instead of timed, each entry tagged with who hears about it. Add an
// entry to LATE and it appears in order. This page's own type: billing-page.css (.bp-late).

const EMAIL = { text: 'Email to customer', kind: 'email' };

const LATE = [
  {
    time: '2025-05-05', label: 'May 5', title: 'Invoice emailed',
    detail: <><F>$145.00</F>, due <F>May 20</F>. Sent in the 8:30 AM billing run.</>,
    audience: EMAIL,
  },
  {
    time: '2025-05-21', label: 'May 21', title: 'Friendly reminder',
    detail: <>A link to pay, plus a heads-up that a late fee will be added on <F>May 30</F> unless it’s paid.</>,
    audience: EMAIL,
  },
  {
    time: '2025-05-30', label: 'May 30', title: 'Late fee added',
    detail: <><F>$25</F> goes on the invoice. The firmer email says “Action required: Invoice is 10 days overdue” and shows the new total of <F>$170.00</F>.</>,
    audience: EMAIL,
  },
  {
    time: '2025-06-05', label: 'Jun 5', title: 'June’s invoice goes out as usual',
    detail: <><F>$145.00</F>, due <F>Jun 20</F>. Billing doesn’t stall because one invoice is late.</>,
    audience: EMAIL,
  },
  {
    time: '2025-06-16', label: 'Jun 16', title: 'Pause warning', tag: 'Vision',
    detail: <>Everything past due, late fees included, the date service pauses (<F>Thursday, June 19</F>) and a Pay button.</>,
    audience: EMAIL,
  },
  {
    time: '2025-06-19', label: 'Jun 19', title: 'Service paused', tag: 'Vision',
    detail: <><F>30 days</F> past due. No extra email, because the warning already gave the date. July’s invoice won’t go out while they’re paused.</>,
    audience: { text: 'No email', kind: 'other' },
  },
  {
    label: 'They pay', title: 'One payment clears everything',
    detail: <>The Pay button settles every overdue invoice at once. You’re told the next morning, and service resumes when you say so.</>,
    audience: { text: 'You’re notified', kind: 'other' },
  },
];

export default function LateInvoices() {
  return (
    <TimelineSection
      id="late-invoices"
      headingId="bp-late-title"
      className="bp-late"
      eyebrow="Late invoices"
      title={['When someone doesn’t pay,', 'you don’t have to chase them.']}
      sub="Take the invoice above and leave it unpaid. Here’s every email and notice that follows, on rules you set once."
      entries={LATE}
    >
      <p className="bp-late-close dt-reveal">Five emails before a pause. At least five days apart, never two on the same day.</p>
    </TimelineSection>
  );
}
