import React, { useEffect, useRef, useState } from 'react';
import { Bell, LayoutDashboard, Route, Ticket, Users } from 'lucide-react';
import PhoneFrame from '../PhoneFrame.jsx';
import { InvoiceIcon } from '../preview/PreviewSidebar.jsx';
import { FOCUS } from '../ai/shared.jsx';
import '../preview/preview.css';

// /claude's hero demo: cause and effect. A phone running Claude in front of a Poolnautics window; what
// you type on the phone changes the window. The window is the homepage hero's product mock (the pl-*
// classes and the dark theme tokens, preview.css), drawn at 1:1. Four scenes loop (SCENES); a button
// jumps to one and the loop carries on from there. Names and figures are the site's demo data.
//
// Rendered on the server at scene 1's start (an empty phone), so the first paint matches what the
// browser draws; it plays only once it's on screen, and starts the scene over when it comes back.
// Reduced motion: no typing, no stagger, no loop; each scene shown finished, switched by the buttons.
//
// Nothing in it moves a layout box once drawn (the hero's layout-shift check scrolls through it while
// it plays): rows sit in fixed slots and move with transforms, a pill that changes is a new element
// (keyed by its text), and messages only ever add below what's there. The mock is aria-hidden; the
// four exchanges are listed for screen readers and crawlers under it. Styles: landing/claude/claude.css.

const PERSON = {
  CJ: { initial: 'C', color: '#475569' },
  Marcus: { initial: 'M', color: '#2563eb' },
  Mike: { initial: 'M', color: '#0f766e' },
};

const REQUESTS = [
  ['Heater not firing', 'Wexler · Repair'],
  ['Green pool', 'Varga · Lead'],
  ['Filter clean', 'McGill · Service'],
  ['Leak at the pump', 'Hamlin · Repair'],
];
const FIFTH = ['Salt cell check', 'Fring · Service']; // Mike's: never moves
const QUOTE = ['Pump replacement', 'Hamlin · Quote $2,500.00'];
const INVOICES = [
  ['Kim Wexler', '$385.00', '42 days late'],
  ['Howard Hamlin', '$520.00', '74 days late'],
  ['Chuck McGill', '$240.00', '118 days late'],
];

/** steps: how many changes the window makes, one after another, once Claude has used Poolnautics. */
export const SCENES = [
  {
    label: 'Cover a sick tech',
    prompt: 'CJ’s out sick. move his requests to Marcus',
    reply: 'Done. I moved CJ’s four open requests to Marcus.',
    steps: 4,
    toast: { text: '4 requests reassigned', via: true },
  },
  {
    label: 'Send a quote',
    prompt: 'quote the Hamlins the $2,500 pump and send it',
    reply: 'Sent. The Hamlins have the quote at your catalog price.',
    steps: 1,
    toast: { text: 'Quote emailed to Howard Hamlin', via: true },
  },
  {
    label: 'Chase late invoices',
    prompt: 'who owes us more than 30 days? remind them',
    reply: 'Three customers, $1,145 past due. Each got their invoice again with a link to pay.',
    steps: 3,
    toast: { text: '3 reminders sent', via: true },
  },
  {
    label: 'Charge a card',
    prompt: 'just charge Kim Wexler’s card the $385',
    reply: 'I can’t charge a card, at any access level. I can send her the invoice again.',
    steps: 0,
    toast: { text: 'Nothing changed. Claude can’t charge cards.', via: false, tone: 'amber' },
  },
];

// The timeline, in ms (see the brief): typing starts, per character, then the bubble, the status line,
// Poolnautics used, each change, the reply, and the hold before the next scene.
const T = { start: 500, perChar: 24, toBubble: 380, toUsing: 350, toUsed: 1000, stagger: 280, flash: 1000, toReply: 500, hold: 6000 };

const START = { typed: '', sent: false, status: null, replied: false, applied: 0, toast: false, flash: [] };
const finished = (i) => ({ typed: '', sent: true, status: 'used', replied: true, applied: SCENES[i].steps, toast: true, flash: [] });

/** What the window shows for a scene, after `applied` of its changes. */
function windowState(scene, applied) {
  switch (scene) {
    case 0: return { view: 'requests', techs: REQUESTS.map((_, i) => (applied > i ? 'Marcus' : 'CJ')), quote: false, fifth: true, badge: 1 };
    case 1: return { view: 'requests', techs: REQUESTS.map(() => 'Marcus'), quote: applied > 0, fifth: false, badge: applied > 0 ? 2 : 1 };
    case 2: return { view: 'invoices', reminded: INVOICES.map((_, i) => applied > i), badge: 2 };
    default: return { view: 'invoices', reminded: INVOICES.map(() => true), badge: 2 };
  }
}
/** The key of the row (or badge) the scene's nth change lights up. */
const flashKey = (scene, n) => (scene === 0 ? `req-${n}` : scene === 1 ? 'quote' : `inv-${n}`);

const ICON = { size: 16, strokeWidth: 1.25, absoluteStrokeWidth: true, 'aria-hidden': true };
const NAV = [['Dashboard', LayoutDashboard], ['Requests', Ticket], ['Customers', Users], ['Routes', Route], ['Invoices', InvoiceIcon]];

function TechPill({ name }) {
  const p = PERSON[name];
  // Keyed by the name where it's used: a new element, not a resized one.
  return (
    <span className="claude-pill claude-pill--tech">
      <span className="claude-initial" style={{ background: p.color }}>{p.initial}</span>
      {name}
    </span>
  );
}

function Row({ title, sub, pill, slot, hidden, flash, entering }) {
  return (
    <div
      className={`claude-row${flash ? ' is-flash' : ''}${hidden ? ' is-hidden' : ''}${entering ? ' is-entering' : ''}`}
      style={{ transform: `translateY(calc(${slot} * var(--claude-row-h)))` }}
    >
      <span className="claude-row-text">
        <span className="claude-row-title">{title}</span>
        <span className="claude-row-sub">{sub}</span>
      </span>
      {pill}
    </div>
  );
}

export default function ClaudeDemo() {
  const rootRef = useRef(null);
  const [scene, setScene] = useState(0);
  const [run, setRun] = useState(0); // bumped by a button, so picking the scene on screen starts it over
  const [p, setP] = useState(START);
  const [still, setStill] = useState(false); // reduced motion
  const [visible, setVisible] = useState(false);

  // Reduced motion, and whether the demo is on screen (it plays only then).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setStill(mq.matches);
    onMotion();
    mq.addEventListener('change', onMotion);
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return () => mq.removeEventListener('change', onMotion);
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(rootRef.current);
    return () => {
      mq.removeEventListener('change', onMotion);
      io.disconnect();
    };
  }, []);

  // One scene's timeline. Starts over whenever the scene, a pick or visibility changes.
  useEffect(() => {
    if (still) {
      setP(finished(scene));
      return undefined;
    }
    setP(START);
    if (!visible) return undefined;
    const s = SCENES[scene];
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const typed = T.start + s.prompt.length * T.perChar;
    for (let i = 1; i <= s.prompt.length; i++) at(T.start + i * T.perChar, () => setP((q) => ({ ...q, typed: s.prompt.slice(0, i) })));
    const bubble = typed + T.toBubble;
    at(bubble, () => setP((q) => ({ ...q, typed: '', sent: true })));
    const using = bubble + T.toUsing;
    at(using, () => setP((q) => ({ ...q, status: 'using' })));
    const used = using + T.toUsed;
    at(used, () => setP((q) => ({ ...q, status: 'used' })));
    for (let n = 0; n < s.steps; n++) {
      const key = flashKey(scene, n);
      at(used + n * T.stagger, () => setP((q) => ({ ...q, applied: n + 1, flash: [...q.flash, key] })));
      at(used + n * T.stagger + T.flash, () => setP((q) => ({ ...q, flash: q.flash.filter((k) => k !== key) })));
    }
    at(used + Math.max(0, s.steps - 1) * T.stagger + (s.steps ? T.stagger : 0), () => setP((q) => ({ ...q, toast: true })));
    const reply = used + T.toReply;
    at(reply, () => setP((q) => ({ ...q, replied: true })));
    at(Math.max(reply, used + s.steps * T.stagger) + T.hold, () => setScene((i) => (i + 1) % SCENES.length));
    return () => timers.forEach(clearTimeout);
  }, [scene, run, visible, still]);

  const pick = (i) => {
    setScene(i);
    setRun((r) => r + 1);
  };

  const s = SCENES[scene];
  const w = windowState(scene, p.applied);
  const lit = (key) => p.flash.includes(key);
  const shift = w.quote ? 1 : 0;

  return (
    <div ref={rootRef} className="claude-demo">
      <div className="claude-stage" aria-hidden="true">
        {/* The Poolnautics window */}
        <div className="claude-window">
          <div className="theme-scope dark claude-app">
            <div className="pl-frame">
              <aside className="pl-rail">
                <div className="pl-rail-top"><div className="pl-workspace">Bayside Pool Co.</div></div>
                <div className="pl-nav">
                  <div className="pl-nav-group">
                    {NAV.map(([label, Icon]) => (
                      <div key={label} className={`pl-nav-item${label === (w.view === 'requests' ? 'Requests' : 'Invoices') ? ' is-active' : ''}`}>
                        <span className="pl-nav-icon"><Icon {...ICON} /></span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
              <div className="pl-main">
                <div className="pl-panel claude-panel">
                  <div className="claude-panel-head">
                    <span className="claude-panel-title">{w.view === 'requests' ? 'Requests' : 'Invoices · Overdue'}</span>
                    <span className="claude-bell">
                      <Bell size={17} strokeWidth={1.5} aria-hidden="true" />
                      <span key={w.badge} className="claude-badge">{w.badge}</span>
                    </span>
                  </div>

                  <div className="claude-lists">
                    <div className={`claude-list${w.view === 'requests' ? ' is-on' : ''}`}>
                      <Row
                        title={QUOTE[0]}
                        sub={QUOTE[1]}
                        pill={<span className="claude-pill claude-pill--amber">Quote sent</span>}
                        slot={0}
                        hidden={!w.quote}
                        entering={!w.quote}
                        flash={lit('quote')}
                      />
                      {REQUESTS.map(([title, sub], i) => {
                        const tech = w.techs?.[i] ?? 'Marcus';
                        return <Row key={title} title={title} sub={sub} pill={<TechPill key={tech} name={tech} />} slot={i + shift} flash={lit(`req-${i}`)} />;
                      })}
                      <Row title={FIFTH[0]} sub={FIFTH[1]} pill={<TechPill name="Mike" />} slot={4 + shift} hidden={!w.fifth} />
                    </div>

                    <div className={`claude-list${w.view === 'invoices' ? ' is-on' : ''}`}>
                      {INVOICES.map(([name, amount, late], i) => {
                        const done = w.reminded?.[i] ?? false;
                        return (
                          <Row
                            key={name}
                            title={name}
                            sub={<span key={done ? 'sent' : 'none'}>{amount} · {done ? 'Reminder sent today' : 'No reminder this week'}</span>}
                            pill={done
                              ? <span key="sent" className="claude-pill claude-pill--green">Reminder sent</span>
                              : <span key="late" className="claude-pill claude-pill--red">{late}</span>}
                            slot={i}
                            flash={lit(`inv-${i}`)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={`claude-toast${p.toast ? ' is-in' : ''}${s.toast.tone === 'amber' ? ' is-amber' : ''}`}>
                    <span className="claude-toast-dot" />
                    <span>{s.toast.text}</span>
                    {s.toast.via && <span className="claude-toast-via">via Claude</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The phone, running Claude */}
        <div className="claude-phone-wrap">
          <PhoneFrame className="bz-phone--embedded claude-phone" statusBar="light">
            <div className="claude-chat">
              <div className="claude-chat-head">
                <span className="claude-chat-name">Claude</span>
                <span className="claude-chat-tag">Poolnautics</span>
              </div>
              <div className="claude-chat-body">
                {p.sent && <p className="claude-msg claude-msg--you">{s.prompt}</p>}
                {p.status && (
                  <p className={`claude-status${p.status === 'used' ? ' is-used' : ''}`}>
                    <span className="claude-status-mark" />
                    {p.status === 'used' ? 'Used Poolnautics' : 'Using Poolnautics'}
                  </p>
                )}
                {p.replied && <p className="claude-msg claude-msg--claude">{s.reply}</p>}
              </div>
              <div className="claude-input">
                {p.typed
                  ? <span className="claude-input-text">{p.typed}<span className="claude-caret" /></span>
                  : <span className="claude-input-placeholder">Message Claude</span>}
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>

      <div className="claude-try" role="group" aria-labelledby="claude-try-label">
        <span id="claude-try-label" className="claude-try-label">Try one</span>
        {SCENES.map((sc, i) => (
          <button key={sc.label} type="button" className={`claude-try-btn ${FOCUS}`} aria-pressed={i === scene} onClick={() => pick(i)}>
            {sc.label}
          </button>
        ))}
      </div>

      {/* The four exchanges, for screen readers and crawlers (the drawing above is hidden from them). */}
      <ul className="sr-only">
        {SCENES.map((sc) => (
          <li key={sc.label}>You: “{sc.prompt}” Claude: “{sc.reply}”</li>
        ))}
      </ul>
    </div>
  );
}
