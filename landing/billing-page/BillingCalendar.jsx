import React, { useRef } from 'react';
import { useBillingClock, useStill } from './billingClock.js';
import { DOTS } from './billingDemo.js';

// /recurring-billing's hero picture: 28 billing days, each with a dot per customer billed that day, and
// "today" walking through them, a day a tick of the page's clock (billingClock.js, every 1.6s, shared
// with the month belt under the hero), looping from the 28th back to the 1st (from the 4th on load).
// Days before today are billed (green), today is blue, the rest are still to come. The line under it
// says what that morning's billing run did. Day 1 is a Monday; no 29th to 31st. The clock stops while
// it's off screen or the tab is hidden; with reduced motion it holds still on the 14th. Pre-rendered:
// the first render is the 4th on the server and in the browser alike. Styles: billing-page.css (.bc-*).
// All of it is an example, not real data.

// Customers billed on each day, the 1st to the 28th (billingDemo.js: the same month as the totals
// further down the page).
const DAYS = DOTS.length;
const START_DAY = 4;
const STILL_DAY = 14; // reduced motion
const KEY_DAYS = new Set([1, 7, 14, 21, 28]); // the only numbers shown below desktop
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ordinal = (n) => {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  return `${n}${(!teen && { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10]) || 'th'}`;
};

/** "Fri the 5th, 8:30 AM billing run: 1 invoice sent. Autopay cards charged." */
export function statusLine(day) {
  const weekday = (day - 1) % 7;
  const run = weekday >= 5 ? '10:30 AM weekend billing run' : '8:30 AM billing run';
  const n = DOTS[day - 1];
  const result = n ? `${n} ${n === 1 ? 'invoice' : 'invoices'} sent. Autopay cards charged.` : 'no invoices due today.';
  return `${WEEKDAYS[weekday]} the ${ordinal(day)}, ${run}: ${result}`;
}

export default function BillingCalendar() {
  const ref = useRef(null);
  const tick = useBillingClock(ref);
  const today = useStill() ? STILL_DAY : ((START_DAY - 1 + tick) % DAYS) + 1;

  return (
    <figure
      ref={ref}
      className="bc-panel"
      data-nosnippet=""
      aria-label="Example billing calendar: each customer is invoiced on their own billing day, every morning."
    >
      <div className="bc-head">
        <span className="bc-title">Invoices sent automatically</span>
        <span className="bc-legend"><i aria-hidden="true" />Each dot is a customer on their own billing day</span>
      </div>
      <div className="bc-days" aria-hidden="true">
        <div className="bc-grid">
          {DOTS.map((n, i) => {
            const day = i + 1;
            const state = day === today ? ' is-today' : day < today ? ' is-past' : '';
            return (
              <div key={day} className={`bc-day${state}`}>
                <span className="bc-stack">
                  {Array.from({ length: n }, (_, j) => <i key={j} />)}
                </span>
                <span className={`bc-num${KEY_DAYS.has(day) ? ' is-key' : ''}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="bc-status" aria-hidden="true">
        <span className="ai-live-dot is-pulsing" />
        <span className="bc-status-text">{statusLine(today)}</span>
      </p>
    </figure>
  );
}
