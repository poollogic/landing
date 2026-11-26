import React, { memo, useEffect, useRef } from 'react';

// /pool-service-billing's hero picture: a billing screen for one example month at Bayside Pool Co. The
// stat cards, the invoices-sent bar, a dot calendar (a dot per customer on their own billing day, the 1st
// to the 28th, "today" the 19th) and its legend, and this morning's run, with the payout card (drawn as
// a toast) over its bottom-right corner. The figures agree: 302 customers, 202 billed through the 19th
// (194 emailed + 8 mailed), 191 of them paid on autopay (95%), 202 of 302 sent (66.9% of the bar: green
// for days 1 to 18, its blue end today's). Styles: billing-page.css (.bc-panel, .bh-*). All of it is an example, not real data, and no
// month or date is named. Its figures are this file's own.
//
// The markup is the finished picture: it's what the pre-rendered page shows, with JavaScript off, and
// with reduced motion. With motion allowed, the script below puts it back to its start (every dot
// slate, the numbers at 0, the bar empty, the list and the payout card hidden) and plays it once, the
// first time about 35% of the panel is on screen: the days fill in order, the numbers count up with
// them, today lights up, the list rows rise in, then the payout card. It never replays. It changes
// only classes and text (the CSS animates colour, opacity and transforms), and each counting number
// keeps its finished width, so nothing moves.

/** Customers billed on each day, the 1st to the 28th (302). */
const DOTS = [14, 12, 10, 8, 13, 10, 8, 11, 11, 10, 9, 12, 9, 7, 17, 13, 10, 9, 9, 12, 9, 11, 11, 9, 10, 13, 12, 13];
const TODAY = 19;
/** Before today, the customers who were followed up (a hollow ring, not green): day → dot indexes. */
const FOLLOWED = { 10: [3], 12: [1, 7], 14: [2], 15: [9], 16: [4, 11], 17: [0], 18: [5] };

const STATS = [
  { label: 'Invoiced this month', to: 36912, money: true },
  { label: 'Emailed automatically', to: 194 },
  { label: 'Mailed automatically', to: 8 },
  { label: 'Paid on autopay', to: 191, share: '95%' },
];
const CUSTOMERS = DOTS.reduce((a, n) => a + n, 0); // 302
const SENT = DOTS.slice(0, TODAY).reduce((a, n) => a + n, 0); // 202, through today

const RUN = [
  { name: 'Lakeshore HOA', amount: '$1,470.00', paid: true },
  { name: 'Dana Whitfield', amount: '$145.00', paid: true },
  { name: 'Avery Collins', amount: '$320.00', paid: true },
  { name: 'Derek Holloway', amount: '$145.00', note: 'Card expired. Retried and emailed.' },
  { name: 'Mark Sullivan', amount: '$170.00', note: '10 days overdue. Late fee added.' },
];

// The animation's timing, in ms from its start.
const FILL_MS = 1500; // days 1 to 19 fill over this, about 80ms a day
const ROWS_AT = 1600;
const ROW_STEP = 110;
const PAYOUT_AT = 2300;

const usd = (n) => `$${n.toLocaleString('en-US')}`;
const fmt = (el, n) => (el.dataset.money ? usd(n) : String(n));

const dotClass = (day, i) => {
  if (day === TODAY) return 'is-today';
  if (day > TODAY) return 'is-later';
  return FOLLOWED[day]?.includes(i) ? 'is-followed' : 'is-paid';
};

/** Puts the panel back to its start and plays it, once, when about 35% of it is on screen. */
function usePlayOnce(panelRef, payoutRef) {
  useEffect(() => {
    const panel = panelRef.current;
    const payout = payoutRef.current;
    if (!panel || !payout || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const days = [...panel.querySelectorAll('.bh-day')];
    const counts = [...panel.querySelectorAll('[data-to]')];
    const bar = panel.querySelector('.bh-fill');
    // Each number keeps its finished width while it counts, so what follows it stays put.
    // (Measured once: in development React runs this twice, the second time over the zeros.)
    counts.forEach((el) => {
      if (!el.style.minWidth) el.style.minWidth = `${el.getBoundingClientRect().width}px`;
      el.textContent = fmt(el, 0);
    });
    panel.classList.add('is-anim');
    payout.classList.add('is-anim');

    // The share of the dots filled by time t, days 1 to 19 each filling over its own slot.
    const filled = DOTS.slice(0, TODAY);
    const total = filled.reduce((a, n) => a + n, 0);
    const slot = FILL_MS / TODAY;
    const shareAt = (t) => {
      let n = 0;
      for (let d = 0; d < TODAY; d += 1) n += filled[d] * Math.min(1, Math.max(0, (t - d * slot) / slot));
      return n / total;
    };

    const timers = [];
    let raf = 0;
    const play = () => {
      const t0 = performance.now();
      days.forEach((el, d) => { if (d < TODAY - 1) timers.push(setTimeout(() => el.classList.add('is-on'), d * slot)); });
      const step = () => {
        const t = performance.now() - t0;
        const share = Math.min(1, shareAt(t));
        counts.forEach((el) => { el.textContent = fmt(el, Math.round(Number(el.dataset.to) * share)); });
        bar.style.transform = `scaleX(${share})`; // the bar grows with them, as one piece, to its 66.9% (CSS)
        if (t < FILL_MS) raf = requestAnimationFrame(step);
        else {
          // Finished: the numbers at their own width again (no gap after one if its font came in late).
          counts.forEach((el) => { el.textContent = fmt(el, Number(el.dataset.to)); el.style.minWidth = ''; });
          bar.style.transform = 'none';
        }
      };
      raf = requestAnimationFrame(step);
      timers.push(setTimeout(() => { days[TODAY - 1].classList.add('is-on'); panel.classList.add('is-lit'); }, FILL_MS));
      timers.push(setTimeout(() => panel.classList.add('is-rows'), ROWS_AT));
      timers.push(setTimeout(() => payout.classList.add('is-in'), PAYOUT_AT));
    };

    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      play();
    }, { threshold: 0.35 });
    io.observe(panel);

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [panelRef, payoutRef]);
}

function BillingCalendar() {
  const panelRef = useRef(null);
  const payoutRef = useRef(null);
  usePlayOnce(panelRef, payoutRef);

  return (
    <>
      <figure
        ref={panelRef}
        className="bc-panel"
        data-nosnippet=""
        aria-label="Example billing screen: a month of invoices sent and collected automatically."
      >
        <div className="bh-bar" aria-hidden="true">
          <span className="bh-name">
            <span className="bh-title">Billing</span>
            <span className="bh-company">Bayside Pool Co.</span>
          </span>
          <span className="bh-pill"><i />8:30 AM billing run complete</span>
        </div>

        <div className="bh-body" aria-hidden="true">
          <div className="bh-main">
            <div className="bh-stats">
              {STATS.map((s) => (
                <div key={s.label} className="bh-stat">
                  <span className="bh-stat-label">{s.label}</span>
                  <span className="bh-stat-value">
                    <span className="bh-count" data-to={s.to} data-money={s.money ? '1' : undefined}>
                      {s.money ? usd(s.to) : s.to}
                    </span>
                    {s.share && <span className="bh-stat-share">{s.share}</span>}
                  </span>
                </div>
              ))}
            </div>

            <div className="bh-chart">
              <div className="bh-collect">
                <div className="bh-collect-text">
                  <span>
                    <strong><span className="bh-count" data-to={SENT}>{SENT}</span></strong>
                    {' '}of {CUSTOMERS} invoices sent
                  </span>
                  <strong>{Math.round((SENT / CUSTOMERS) * 100)}%</strong>
                </div>
                <div className="bh-track"><div className="bh-fill" /></div>
              </div>

              <div className="bh-days">
                {DOTS.map((n, d) => {
                  const day = d + 1;
                  return (
                    <div key={day} className={`bh-day${day === TODAY ? ' is-today' : ''}${day % 2 ? ' is-odd' : ''}`}>
                      <span className="bh-stack">
                        {Array.from({ length: n }, (_, i) => <i key={i} className={`bh-dot ${dotClass(day, i)}`} />)}
                      </span>
                      <span className="bh-num">{day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bh-caption">
                <span className="bh-legend">
                  <span><i className="bh-dot is-paid" />Paid</span>
                  <span><i className="bh-dot is-followed" />Followed up for you</span>
                  <span><i className="bh-dot is-today" />Billing today</span>
                  <span><i className="bh-dot is-later" />Scheduled to send</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bh-run">
            <p className="bh-run-head">This morning’s run</p>
            <ul className="bh-rows">
              {RUN.map((r, i) => (
                <li key={r.name} className={`bh-row${r.paid ? ' is-paid' : ''}`} style={{ '--i': i }}>
                  <span className="bh-row-name">{r.name}</span>
                  <span className="bh-row-amount">{r.amount}</span>
                  {r.note && <span className="bh-row-note">{r.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </figure>

      <div ref={payoutRef} className="bh-payout" aria-hidden="true">
        <p className="bh-payout-label">Payout to your bank</p>
        <p className="bh-payout-line">
          <span className="bh-payout-amount">$3,090.00</span>
          <span className="bh-payout-when">Arrives tomorrow</span>
        </p>
      </div>
    </>
  );
}

// No props and no state: React never re-renders it, so the classes and numbers the animation sets stay.
export default memo(BillingCalendar);
