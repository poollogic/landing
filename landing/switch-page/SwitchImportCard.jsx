import React, { useEffect, useRef, useState } from 'react';

// The compact import card phones get in the hero (720px and under; switch-page.css shows it there and
// hides the importer), from the approved reference (switching-page-reference.html, #hd and its script):
// a file's four columns are matched one by one, then five rows turn from raw text into customers,
// counting up to 612, then the next 607 are mentioned. It plays while at least 35% of it is on screen
// and loops every few seconds after it ends; between runs and before the first it shows its finished
// state, which is also the pre-rendered markup and what reduced motion shows. Names, addresses and
// prices are made up for the demo.

const TOTAL = 612;
const COLS = [
  { raw: 'Fn', name: 'First name' },
  { raw: 'Ln', name: 'Last name' },
  { raw: 'Svc Addr', name: 'Address' },
  { raw: 'City', name: 'City' },
];
const NBSP3 = '   ';
const ROWS = [
  { raw: ['Aaron', 'Collins', '2148 Tramway Ln NE', 'Albuquerque', '140', 'tues'], name: 'Aaron Collins', addr: '2148 Tramway Ln NE, Albuquerque', price: '$140.00', when: 'Tue, weekly' },
  { raw: ['Abigail', 'Vega', '412 Loma Larga Rd', 'Corrales', '$145.00', 'Tue'], name: 'Abigail Vega', addr: '412 Loma Larga Rd, Corrales', price: '$145.00', when: 'Tue, weekly' },
  { raw: ['Adam', 'Holloway', '8812 Osuna Rd NE', 'Albuquerque', '150', 'wed'], name: 'Adam Holloway', addr: '8812 Osuna Rd NE, Albuquerque', price: '$150.00', when: 'Wed, weekly' },
  { raw: ['Adriana', 'Raman', '2270 Cabezon Blvd', 'Rio Rancho', '155', 'Thurs'], name: 'Adriana Raman', addr: '2270 Cabezon Blvd, Rio Rancho', price: '$155.00', when: 'Thu, weekly' },
  { raw: ['Alan', 'Castellano', '903 Montaño Rd NW', 'Albuquerque', '160', 'every other fri'], name: 'Alan Castellano', addr: '903 Montaño Rd NW, Albuquerque', price: '$160.00', when: 'Fri, every other week' },
];
const COUNTS = ['122', '245', '367', '490', '612'];
const READY = `${TOTAL} customers ready`;

// The finished state: every column matched, every row a customer.
const DONE = { cols: COLS.length, flash: 0, rows: ROWS.map(() => 'done'), status: READY, ready: true };
const START = { cols: 0, flash: 0, rows: ROWS.map(() => ''), status: 'Reading your file…', ready: false };

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function SwitchImportCard() {
  const ref = useRef(null);
  const [s, setS] = useState(DONE);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const set = (p) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));
    const setRow = (i, v) => set((prev) => ({ rows: prev.rows.map((r, j) => (j === i ? v : r)) }));
    let visible = false;
    let running = false;
    const run = () => {
      if (!visible) { running = false; return; }
      running = true;
      setS(START);
      at(700, () => set({ status: 'Matching columns…' }));
      COLS.forEach((_, i) => at(1000 + i * 320, () => set({ cols: i + 1, flash: i + 1 })));
      const r0 = 1000 + COLS.length * 320 + 450;
      ROWS.forEach((_, i) => {
        at(r0 + i * 430, () => setRow(i, 'scan'));
        at(r0 + i * 430 + 300, () => { setRow(i, 'done'); set({ status: `${COUNTS[i]} of ${TOTAL} ready` }); });
      });
      const end = r0 + ROWS.length * 430 + 350;
      at(end, () => set({ ready: true, status: READY }));
      at(end + 4200, run);
    };
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !running) { running = true; at(900, run); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="hd-wrap">
      <div
        ref={ref}
        className={`sw-demo${s.ready ? ' is-ready' : ''}`}
        id="hd"
        role="img"
        aria-label={`A customer export being imported: its columns are matched, then its rows become customers with addresses and monthly prices. ${TOTAL} customers are ready to review.`}
      >
        <div className="sw-demo-top">
          <span className="sw-file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
            customers-export.csv
          </span>
          <span className="sw-status">{s.status}</span>
        </div>
        <div className="hd-map">
          {COLS.map((c, i) => (
            <div key={c.raw} className={`hd-col${i < s.cols ? ' is-on' : ''}${i < s.flash ? ' is-flash' : ''}`}>
              <span className="hd-rawh">{c.raw}</span>
              <span className="hd-mapped"><b>{c.name}</b><small>from “{c.raw}”</small></span>
            </div>
          ))}
        </div>
        <ul className="sw-rows">
          {ROWS.map((r, i) => (
            <li key={r.name} className={`sw-row${s.rows[i] === 'done' ? ' is-done' : s.rows[i] === 'scan' ? ' is-scan' : ''}`}>
              <span className="sw-raw">{r.raw.join(NBSP3)}</span>
              <span className="sw-clean">
                <span className="sw-ok"><Tick /></span>
                <span className="sw-who"><b>{r.name}</b><small>{r.addr}</small></span>
                <span className="sw-meta"><b>{r.price}</b><small>{r.when}</small></span>
              </span>
            </li>
          ))}
        </ul>
        <p className={`hd-more${s.ready ? ' is-on' : ''}`}>and {TOTAL - ROWS.length} more customers</p>
        <div className="sw-demo-foot"><span>Nothing is saved until you review it</span><span className="sw-demo-btn">Continue</span></div>
      </div>
    </div>
  );
}
