import React, { useRef } from 'react';
import { useBillingClock, useStill } from './billingClock.js';

// The statement section's belt (/recurring-billing): a row of month chips, "Jan 7" to "Dec 7", looping
// forever. The chip in the centre is the invoice just sent ("current"), the ones left of it were sent,
// the ones right of it are scheduled. Every second tick of the page's clock (billingClock.js: every
// 3.2s, in the same render as the hero calendar's step) the row ticks one chip to the left and rests.
// Only the chips around the centre are drawn: each one keeps its key as it moves, so it slides
// (billing-page.css .bp-belt-slot, by its data-off), a new one appears off the right end, and the one
// that leaves past the left end is dropped on the next step. With reduced motion it holds still.
// Decoration (the heading says it): aria-hidden.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const START = 2; // "Mar 7" in the centre at first
const SIDE = 4; // chips drawn right of the centre (and one more on the left, leaving): past the belt's ends

const Check = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2.2 5.3 4.2 7.2 7.9 3.1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MonthBelt() {
  const ref = useRef(null);
  const tick = useBillingClock(ref);
  const still = useStill();
  const at = START + (still ? 0 : Math.floor(tick / 2));
  const chips = [];
  for (let i = at - SIDE - 1; i <= at + SIDE; i += 1) chips.push(i);
  return (
    <div ref={ref} className="bp-belt" aria-hidden="true">
      {chips.map((i) => {
        const off = i - at;
        const state = off < 0 ? 'sent' : off === 0 ? 'current' : 'upcoming';
        return (
          <div key={i} className="bp-belt-slot" data-off={off}>
            <div className={`bp-chip is-${state}`}>
              <span className="bp-chip-date">{MONTHS[((i % 12) + 12) % 12]} 7</span>
              {state === 'upcoming'
                ? <span className="bp-chip-status">Scheduled</span>
                : <span className="bp-chip-status"><i className="bp-chip-check"><Check /></i>Sent</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
