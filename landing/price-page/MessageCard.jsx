import React, { useEffect, useRef } from 'react';
import { CURRENT, NEW_PRICE, RAISE, START_DAY, START_LONG, usd } from './priceDemo.js';

// Step 3 on /pool-service-price-increases: the app's message editor (rebuilt in HTML, the app's type),
// writing the price increase email, as the approved reference's script does it. The email types itself,
// and for every customer value the pointer clicks "Insert field", the menu opens (scrolling one row to
// reach the date), the row is picked and the value drops in with a short blue flash. It starts when the
// card is half in view, holds the finished email for 6 seconds and replays while it stays in view.
// The finished email is always in .em-ghost (invisible while it plays), so the editor keeps its final
// height at every width and nothing under it moves. Pre-rendered: the server, a visitor without
// JavaScript, and one who prefers reduced motion all get the finished email (.em-body.is-static), still.
// A picture: role="img" with a description; the menu and pointer are hidden from screen readers.

const ROW = 33; // a menu row's height (px)
const SHOWN = 11; // rows the menu shows before it scrolls

// The Insert field menu, in the app's order (BulkEmailPage.tsx).
// TODO: "Start date" / {{start_date}} is a guessed name for the date field. Use the real one from the
// app. (The app's last field is "Effective date" {{effective_date}}, which is the customer's next invoice
// date when the change was made, not the date full price starts.)
const FIELDS = [
  ['first', 'First name', '{{first_name}}'],
  ['last', 'Last name', '{{last_name}}'],
  ['fulln', 'Full name', '{{full_name}}'],
  ['rday', 'Route day', '{{route_day}}'],
  ['stop', 'Stop number', '{{stop_number}}'],
  ['addr', 'Address', '{{address}}'],
  ['tech', 'Technician first name', '{{technician_first_name}}'],
  ['current', 'Current price', '{{current_price}}'],
  ['new', 'New price', '{{new_price}}'],
  ['diff', 'Difference', '{{price_difference}}'],
  ['cycle', 'Billing cycle', '{{billing_cycle}}'],
  ['date', 'Start date', '{{start_date}}'],
];

// The email: plain text ('t') and fields ('f': the value shown, the menu row it comes from).
const PARAS = [
  [['t', 'Hi '], ['f', 'Dana', 'first'], ['t', ',']],
  [['t', 'Starting '], ['f', START_LONG, 'date'], ['t', ', your '], ['f', 'monthly', 'cycle'], ['t', ' pool service rate will change from '], ['f', usd(CURRENT), 'current'], ['t', ' to '], ['f', usd(NEW_PRICE), 'new'], ['t', '.']],
  [['t', 'Until then your invoices will show the new rate with a '], ['f', usd(RAISE), 'diff'], ['t', ' credit, so you’ll keep paying '], ['f', usd(CURRENT), 'current'], ['t', '.']],
  [['t', 'Thank you for being a customer.']],
];

const LABEL = 'The message editor writing a price increase email, inserting each customer’s name, start date, billing cycle, current price, new price and difference from the Insert field menu';

/** Runs the animation in the card. Returns a function that stops it and clears every timer. */
function animate(card) {
  const body = card.querySelector('.em-body');
  const live = card.querySelector('.em-live');
  const msgLabel = card.querySelectorAll('.em-lab')[1];
  const ins = card.querySelector('.em-ins--message');
  const menu = card.querySelector('.em-menu');
  const list = menu.firstChild;
  const cur = card.querySelector('.em-cursor');
  const caret = document.createElement('span');
  caret.className = 'em-caret';

  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
  let playing = false;
  let visible = false;
  let stopped = false;

  body.classList.remove('is-static');

  const moveTo = (el, fx, fy) => {
    const r = el.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    cur.style.transform = `translate(${Math.round(r.left - c.left + r.width * fx)}px,${Math.round(r.top - c.top + r.height * fy)}px)`;
  };
  const click = (fn) => { cur.classList.add('is-down'); later(() => { cur.classList.remove('is-down'); fn(); }, 110); };

  function insertField(seg, p, done) {
    const c = card.getBoundingClientRect();
    menu.style.top = `${Math.round(msgLabel.getBoundingClientRect().bottom - c.top + 4)}px`;
    list.style.transition = 'none';
    list.style.transform = 'translateY(0)';
    cur.style.opacity = '1';
    moveTo(ins, 0.55, 0.5);
    later(() => click(() => {
      ins.classList.add('is-hot');
      menu.classList.add('is-open');
      list.style.transition = '';
      const idx = Math.max(0, FIELDS.findIndex((f) => f[0] === seg[2]));
      const row = list.children[idx];
      const scroll = idx >= SHOWN ? (idx - SHOWN + 1) * ROW : 0;
      later(() => {
        if (scroll) { moveTo(menu, 0.35, 0.8); list.style.transform = `translateY(-${scroll}px)`; }
        later(() => {
          moveTo(row, 0.3, 0.5);
          later(() => {
            row.classList.add('is-on');
            later(() => click(() => {
              menu.classList.remove('is-open');
              ins.classList.remove('is-hot');
              const b = document.createElement('b');
              b.className = 'em-f is-new';
              b.textContent = seg[1];
              p.insertBefore(b, caret);
              later(() => { b.classList.remove('is-new'); row.classList.remove('is-on'); }, 420);
              cur.style.opacity = '0';
              later(done, 300);
            }), 190);
          }, 340);
        }, scroll ? 380 : 0);
      }, 220);
    }), 360);
  }

  function play() {
    if (stopped) return;
    playing = true;
    live.textContent = '';
    menu.classList.remove('is-open');
    let pi = 0;
    let si = 0;
    let ci = 0;
    let p = null;
    let node = null;
    moveTo(body, 0.6, 0.5);
    function step() {
      const segs = PARAS[pi];
      if (si >= segs.length) { pi += 1; nextPara(); return; }
      const s = segs[si];
      if (s[0] === 'f') { si += 1; insertField(s, p, step); return; }
      if (ci === 0) { node = document.createTextNode(''); p.insertBefore(node, caret); }
      node.nodeValue += s[1].charAt(ci);
      ci += 1;
      if (ci >= s[1].length) { ci = 0; si += 1; }
      const ch = node.nodeValue.slice(-1);
      later(step, ch === ',' || ch === '.' ? 140 : 14 + Math.random() * 22);
    }
    function nextPara() {
      if (pi >= PARAS.length) { later(() => { playing = false; if (visible) play(); }, 6000); return; }
      p = document.createElement('p');
      live.appendChild(p);
      p.appendChild(caret);
      si = 0;
      later(step, pi === 0 ? 500 : 300);
    }
    nextPara();
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !playing) play();
  }, { threshold: 0.5 });
  io.observe(card);

  return () => {
    stopped = true;
    io.disconnect();
    timers.forEach(clearTimeout);
    timers.clear();
  };
}

export default function MessageCard() {
  const ref = useRef(null);
  useEffect(() => {
    const card = ref.current;
    if (!card || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    return animate(card);
  }, []);

  return (
    <div className="pr-msg" ref={ref} role="img" aria-label={LABEL}>
      <span className="em-h">Message</span>
      <div className="em-lab"><span>Subject</span><span className="em-ins"><i>{'{ }'}</i>Insert field</span></div>
      <span className="em-subj">Your pool service rate from {START_DAY}</span>
      <div className="em-lab"><span>Message</span><span className="em-ins em-ins--message"><i>{'{ }'}</i>Insert field</span></div>
      <div className="em-ed">
        <div className="em-bar">
          <span style={{ fontWeight: 700 }}>B</span>
          <span style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>I</span>
          <span style={{ textDecoration: 'underline' }}>U</span>
          <span className="em-sep" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" fill="currentColor" /><circle cx="4.5" cy="12" r="1" fill="currentColor" /><circle cx="4.5" cy="18" r="1" fill="currentColor" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10" /><path d="M4 4.5l1.2-.6V8M3.6 15.2c.3-.6 2.4-.8 2.4.5 0 .9-1.6 1.5-2.4 2.8H6" strokeWidth="1.4" /></svg>
          <span className="em-sep" />
          <span>– ⌄</span>
          <svg className="em-end" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /></svg>
        </div>
        <div className="em-body is-static">
          <div className="em-ghost">
            {PARAS.map((segs, i) => (
              <p key={i}>{segs.map((s, j) => (s[0] === 'f' ? <b key={j}>{s[1]}</b> : <React.Fragment key={j}>{s[1]}</React.Fragment>))}</p>
            ))}
          </div>
          <div className="em-live" />
        </div>
      </div>
      <span className="em-hint">Fields like <code>{'{{first_name}}'}</code> are filled in for each customer.</span>
      <div className="em-menu" aria-hidden="true" style={{ height: `${SHOWN * ROW + 6}px` }}>
        <div className="em-list">
          {FIELDS.map(([key, label, token]) => <div key={key}><span>{label}</span><code>{token}</code></div>)}
        </div>
      </div>
      <div className="em-cursor" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 3l14 8.2-6.3 1.5L9.6 19 5 3z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
