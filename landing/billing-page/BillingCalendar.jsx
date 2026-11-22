import React, { memo, useEffect, useRef } from 'react';

// /pool-service-billing's hero picture: a billing screen for one example month at Bayside Pool Co. The
// stat cards, the collection bar, a dot calendar (a dot per customer on their own billing day, the 1st
// to the 28th, "today" the 19th) and this morning's run, with the payout card over its bottom-right
// corner. Styles: billing-page.css (.bc-panel, .bh-*). All of it is an example, not real data, and no
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
  { dot: 'blue', label: 'Invoiced this month', to: 36912, money: true },
  { dot: 'white', label: 'Emailed automatically', to: 211 },
  { dot: 'white', label: 'Mailed automatically', to: 8 },
  { dot: 'slate', label: 'Paid on autopay', to: 191, share: '87%' },
];
const BILLED = 36912;
const COLLECTED = 33959;

const RUN = [
  { name: 'Lakeshore HOA', amount: '$1,470.00' },
  { name: 'Dana Whitfield', amount: '$145.00' },
  { name: 'Avery Collins', amount: '$320.00' },
  { name: 'Derek Holloway', amount: '$145.00', note: 'Card expired. Retried and emailed.' },
  { name: 'Priya Raman', amount: '$170.00', note: '10 days overdue. Late fee added.' },
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
        bar.style.transform = `scaleX(${share})`; // the bar grows with them, to its 92%
        if (t < FILL_MS) raf = requestAnimationFrame(step);
        else {
          counts.forEach((el) => { el.textContent = fmt(el, Number(el.dataset.to)); });
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
                  <span className="bh-stat-label"><i className={`bh-key bh-key--${s.dot}`} />{s.label}</span>
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
              <div className="bh-caption">
                <span>One dot per customer, on their own billing day</span>
                <span className="bh-legend">
                  <span><i className="bh-dot is-paid" />Paid</span>
                  <span><i className="bh-dot is-followed" />Followed up for you</span>
                  <span><i className="bh-dot is-later" />Scheduled</span>
                </span>
              </div>

              <div className="bh-collect">
                <div className="bh-track"><div className="bh-fill" /></div>
                <div className="bh-collect-text">
                  <span>
                    <strong><span className="bh-count" data-to={COLLECTED} data-money="1">{usd(COLLECTED)}</span></strong>
                    {' '}collected of {usd(BILLED)}
                  </span>
                  <strong>92%</strong>
                </div>
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
            </div>
          </div>

          <div className="bh-run">
            <p className="bh-run-head">This morning’s run</p>
            <ul className="bh-rows">
              {RUN.map((r, i) => (
                <li key={r.name} className="bh-row" style={{ '--i': i }}>
                  <i className={`bh-dot ${r.note ? 'is-followed' : 'is-paid'}`} />
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
