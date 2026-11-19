import React, { useEffect, useRef, useState } from 'react';

// /billing's hero picture: 28 billing days, each with a dot per customer billed that day, and "today"
// walking through them, one day every 1.6s, looping from the 28th back to the 1st (from the 4th on
// load). Days before today are billed (green), today is blue, the rest are still to come. The line
// under it says what that morning's billing run did. Day 1 is a Monday; no 29th to 31st.
// Pauses while it's off screen or the tab is hidden; with reduced motion it holds still on the 14th.
// Pre-rendered: the first render is the 4th on the server and in the browser alike; the effect takes
// it from there. Styles: billing-page.css (.bc-*). All of it is an example, not real data.

// Customers billed on each day, the 1st to the 28th.
const DOTS = [2, 1, 3, 0, 1, 2, 1, 4, 2, 1, 3, 0, 2, 3, 1, 2, 0, 3, 1, 2, 1, 4, 1, 0, 2, 3, 1, 2];
const DAYS = DOTS.length;
const START_DAY = 4;
const STILL_DAY = 14; // reduced motion
const STEP_MS = 1600;
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
  const [today, setToday] = useState(START_DAY);

  useEffect(() => {
    const el = ref.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    let inView = false;
    const stop = () => { window.clearInterval(timer); timer = 0; };
    const sync = () => {
      if (still.matches) { stop(); setToday(STILL_DAY); return; }
      if (inView && !document.hidden) {
        if (!timer) timer = window.setInterval(() => setToday((d) => (d % DAYS) + 1), STEP_MS);
      } else stop();
    };
    const io = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    if (io && el) io.observe(el); else inView = true;
    document.addEventListener('visibilitychange', sync);
    still.addEventListener('change', sync);
    sync();
    return () => {
      stop();
      io?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      still.removeEventListener('change', sync);
    };
  }, []);

  return (
    <figure
      ref={ref}
      className="bc-panel"
      aria-label="Example billing calendar: each customer is invoiced on their own billing day, every morning."
    >
      <div className="bc-head">
        <span className="bc-title">Automatic billing</span>
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
                <span className="bc-num">{day}</span>
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
