import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpDown, Bell, Blocks, Building2, ChevronDown, ChevronLeft, ChevronRight, CircleUser, CreditCard, FileText, Info,
  LayoutDashboard, LogOut, Moon, MoreHorizontal, Package, Palette, Plus, ReceiptText, Route, Search, Settings,
  SlidersHorizontal, Ticket, UserCog, Users,
} from 'lucide-react';
import PhoneFrame from './PhoneFrame.jsx';
import { PreviewCharts } from './preview/PreviewPanel.jsx';
import './preview/preview.css';
import './revenue-mobile.css';

// Collections (#collections) below 1024px: the desktop scroll story retold inside the shared
// iPhone frame, using the app's own phone layout (poollogic-web-app mobile-nav/, settings/).
// The section pins while you scroll; scroll position picks the step, and each step plays as a
// short timed animation (taps, sheet, screen pushes, switches), so it reads like someone using
// the app. Nothing here moves the page's scroll, so iPhone flings are never fought.
//
//   Beat 1  Nothing Slips     the phone is shown close up (top fixed, bottom running off the
//                             screen); the billing banner opens, tap "Autopay declined" and the
//                             app opens Invoices filtered to Payment failed (as the real app's
//                             attention row does); the phone settles back at beat 2
//   Beat 2  Late Fees         tap More → Settings → Billing, turn on Charge late fees, Auto-apply
//   Beat 3  Automatic Pause   scroll to Overdue, turn on Automatic pause
// All figures are the same MOCK data as the desktop dashboard.

// The timeline, in % of the screen's height scrolled since the section pinned. The pin lasts
// RUN of them (.rvm-track in revenue-mobile.css is 100svh + RUN svh tall).
const RUN = 297;
const STEPS = [14, 26, 30, 55, 59, 89, 93, 123, 127, 157, 187, 217, 251, 271].map((v) => v / RUN);
//  step:      1 open  2 tap  3 Invoices  4 tap  5 sheet  6 tap  7 Settings  8 tap  9 Billing
//             10 ↓late  11 late  12 auto  13 ↓overdue  14 pause
const TAPS = { 2: 'autopay', 4: 'more', 6: 'settings', 8: 'billing', 11: 'late', 12: 'auto', 14: 'pause' };
const BEATS = [[0, 50 / RUN], [50 / RUN, 247 / RUN], [247 / RUN, 1]];
const stepAt = (p) => STEPS.filter((t) => p >= t).length;
const beatAt = (p) => (p < BEATS[1][0] ? 0 : p < BEATS[2][0] ? 1 : 2);

const IOS = [0.32, 0.72, 0, 1]; // iOS navigation curve
const PUSH = { type: 'tween', duration: 0.5, ease: IOS };
const I = { size: 20, strokeWidth: 1.75, 'aria-hidden': true };

const ROWS = [
  { label: 'Autopay declined', count: 2, red: true, tapId: 'autopay' },
  { label: 'Invoices past due', note: '(overdue notices sent)', count: 3, red: true },
  { label: 'Estimates awaiting approval', count: 2 },
];
const TILES = [
  { label: 'Invoiced, month to date', dot: '#3885C6', value: '$52,720' },
  { label: 'Recurring revenue', dot: '#fff', value: '$48,930', unit: '/mo' },
  { label: 'Active customers', dot: 'rgba(203,213,225,.62)', value: '302', unit: '· 4 paused' },
  { label: 'Average per customer', dot: 'rgba(203,213,225,.62)', value: '$162.02', unit: '/mo' },
];

/** A finger tap: a soft ring that blooms and fades inside its (position: relative) target. */
function Tap({ on, n }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.span
          key={n}
          className="rvm-tap"
          initial={{ scale: 0.35, opacity: 0.6 }}
          animate={{ scale: 1.3, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}

const Switch = ({ on }) => <span className={`rvm-sw${on ? ' on' : ''}`}><i /></span>;

function SwitchRow({ t, d, on, dim, tap, id, info }) {
  return (
    <div className={`rvm-row is-switch${dim ? ' dim' : ''}`}>
      <span className="rvm-row-t">{t}{info && <Info size={14} strokeWidth={1.75} aria-hidden />}</span>
      <span className="rvm-sw-wrap"><Switch on={on} /><Tap on={tap?.id === id} n={tap?.n} /></span>
      <span className="rvm-row-d">{d}</span>
    </div>
  );
}

function FieldRow({ t, d, v, pre, suf, chev, dim }) {
  return (
    <div className={`rvm-row${dim ? ' dim' : ''}`}>
      <span className="rvm-row-t">{t}</span>
      <span className="rvm-field">
        {pre && <em>{pre}</em>}<span>{v}</span>{suf && <em>{suf}</em>}
        {chev && <ChevronDown size={16} strokeWidth={1.75} aria-hidden />}
      </span>
      <span className="rvm-row-d">{d}</span>
    </div>
  );
}

function TopBar({ title, count, more }) {
  return (
    <div className="rvm-top">
      <span className="rvm-title">{title}{count != null && <small>{count}</small>}</span>
      <span className="rvm-ic">{more ? <MoreHorizontal {...I} /> : <Search {...I} />}</span>
      <span className="rvm-ic"><Bell {...I} /></span>
    </div>
  );
}

/** One screen of the app's navigation stack: slides in from the right, parks a little to the left (dimmed) when covered. */
function Screen({ index, current, children }) {
  const x = index === current ? '0%' : index < current ? '-28%' : '100%';
  return (
    <motion.div className="rvm-screen" initial={false} animate={{ x }} transition={PUSH}>
      {children}
      <motion.div className="rvm-shade" initial={false} animate={{ opacity: index < current ? 1 : 0 }} transition={PUSH} />
    </motion.div>
  );
}

function Dashboard({ open, tap }) {
  return (
    <>
      <TopBar title="Good evening, Alex" />
      <div className="rvm-body">
        <p className="rvm-date">Monday, November 2, 2026</p>
        <div className={`rvm-banner${open ? ' open' : ''}`}>
          <div className="rvm-banner-top">
            <span className="rvm-mark">!</span>
            <p><b>5 billing problems</b><span> · 2 other alerts</span></p>
            <ChevronDown className="rvm-chev" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <motion.ul
            className="rvm-rows"
            initial={false}
            animate={open ? 'open' : 'closed'}
            variants={{ open: { height: 'auto', transition: { duration: 0.45, ease: IOS, staggerChildren: 0.07, delayChildren: 0.08 } }, closed: { height: 0, transition: { duration: 0.35, ease: IOS } } }}
          >
            {ROWS.map((r) => (
              <motion.li
                key={r.label}
                className={r.tapId && tap?.id === r.tapId ? 'is-pressed' : undefined}
                variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: -6 } }}
              >
                <span className={`rvm-dot${r.red ? ' is-red' : ''}`} />
                <span className="rvm-row-label">{r.label}{r.note && <span className="rvm-row-note"> {r.note}</span>}</span>
                <b>{r.count}</b>
                {r.tapId && <Tap on={tap?.id === r.tapId} n={tap?.n} />}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div className="rvm-tiles">
          {TILES.map((t) => (
            <div key={t.label} className="rvm-tile">
              <span className="rvm-tile-l"><i style={{ background: t.dot }} />{t.label}</span>
              <span className="rvm-tile-v">{t.value}{t.unit && <small>{t.unit}</small>}</span>
            </div>
          ))}
        </div>
        {/* The app's phone dashboard continues with the Trends cards: the hero preview's own. */}
        <div className="rvm-charts theme-scope dark"><PreviewCharts /></div>
      </div>
    </>
  );
}

// Invoices, filtered to Payment failed: where the dashboard's failed-payments row goes
// (poollogic-web-app components/BillingInvoicing.tsx, phone layout). MOCK data.
const INV_TILES = [
  { label: 'Outstanding', dot: '#3b82f6', value: '$12,480' },
  { label: 'Overdue', dot: '#fb923c', value: '$3,265' },
  { label: 'Drafts', dot: 'rgba(203,213,225,.62)', value: '$1,150' },
  { label: 'Paid', dot: '#34b864', value: '$40,240' },
];
const FAILED = [
  { name: 'Kim Wexler', amount: '$210.00', no: '#11042', due: '9d overdue' },
  { name: 'Howard Hamlin', amount: '$160.00', no: '#11055', due: '13d overdue' },
];

function Invoices() {
  return (
    <>
      <TopBar title="Invoices" count={FAILED.length} more />
      <div className="rvm-body">
        <div className="rvm-tiles is-inv">
          {INV_TILES.map((t) => (
            <div key={t.label} className="rvm-tile">
              <span className="rvm-tile-l"><i style={{ background: t.dot }} />{t.label}</span>
              <span className="rvm-tile-v">{t.value}</span>
            </div>
          ))}
        </div>
        <div className="rvm-seg">
          {['All', 'Invoices', 'Estimates', 'Added charges'].map((o) => <span key={o} className={o === 'Invoices' ? 'on' : undefined}>{o}</span>)}
        </div>
        <div className="rvm-search"><Search size={16} strokeWidth={1.75} aria-hidden />Search customer or invoice #</div>
        <div className="rvm-chips">
          <span className="rvm-chip is-icon"><SlidersHorizontal size={15} strokeWidth={1.75} aria-hidden /></span>
          <span className="rvm-chip on">Date range<i>1</i></span>
          <span className="rvm-chip on">Status<i>1</i></span>
          <span className="rvm-chip">Amount</span>
          <span className="rvm-chip is-icon"><ArrowUpDown size={15} strokeWidth={1.75} aria-hidden /></span>
        </div>
        <div className="rvm-groupbar"><span>Payment failed · {FAILED.length}</span><span>$370</span></div>
        {FAILED.map((f) => (
          <div key={f.no} className="rvm-inv">
            <span className="rvm-inv-name">{f.name}</span>
            <span className="rvm-inv-amt">{f.amount}</span>
            <span className="rvm-inv-meta">{f.no} · <i /> Payment failed · {f.due}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const SETTINGS = [
  ['BUSINESS', [['General', Building2], ['Billing', CreditCard], ['Plan', Users], ['Branding', Palette], ['Documents', FileText], ['Integrations', Blocks]]],
  ['YOU', [['Account', CircleUser]]],
];

function SettingsList({ tap }) {
  return (
    <>
      <TopBar />
      <div className="rvm-body">
        <h2 className="rvm-h1">Settings</h2>
        {SETTINGS.map(([group, items]) => (
          <div key={group} className="rvm-group">
            <div className="rvm-glabel">{group}</div>
            {items.map(([label, Icon]) => (
              <div key={label} className={`rvm-link${label === 'Billing' && tap?.id === 'billing' ? ' is-pressed' : ''}`}>
                <Icon {...I} /><span>{label}</span><ChevronRight size={16} strokeWidth={1.75} aria-hidden />
                {label === 'Billing' && <Tap on={tap?.id === 'billing'} n={tap?.n} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Billing({ step, tap }) {
  const lateRef = useRef(null);
  const overdueRef = useRef(null);
  const endRef = useRef(null);
  const clipRef = useRef(null);
  const [stops, setStops] = useState({ late: 0, overdue: 0 });
  useLayoutEffect(() => {
    // offsetTop is layout px, unaffected by the frame's scaling transforms
    const measure = () => {
      // Like a real page at its end: the last row stops just above the floating tab bar.
      const visible = clipRef.current.clientHeight - TAB_ZONE;
      const end = endRef.current.offsetTop + endRef.current.offsetHeight + 20 - visible;
      setStops({ late: lateRef.current.offsetTop - 14, overdue: Math.min(overdueRef.current.offsetTop - 14, end) });
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);
  const late = step >= 11, auto = step >= 12, pause = step >= 14;
  const y = step >= 13 ? -stops.overdue : step >= 10 ? -stops.late : 0;
  return (
    <>
      <TopBar />
      <div className="rvm-clip" ref={clipRef}>
        <motion.div className="rvm-body rvm-scroll" initial={false} animate={{ y }} transition={{ type: 'tween', duration: 0.7, ease: IOS }}>
          <div className="rvm-back"><ChevronLeft size={18} strokeWidth={2} aria-hidden />Settings<small>{late ? 'Saved' : ''}</small></div>
          <h2 className="rvm-h1">Billing</h2>
          <p className="rvm-sub">How you get paid, and what you add on top of the work.</p>
          <div className="rvm-sec">Rates and fees</div>
          <FieldRow t="Card processing fee" v="2.9" suf="%" d="Added to credit card payments, never debit. Maximum 3% (the Visa/Mastercard cap)." />
          <div className="rvm-sec" ref={lateRef}>Late fees</div>
          <SwitchRow info id="late" tap={tap} on={late} t="Charge late fees" d="Add a fee to invoices that go past due. Nothing already overdue is charged." />
          <FieldRow dim={!late} t="Fee type" v="Flat amount ($)" chev d="A fixed dollar amount per invoice." />
          <FieldRow dim={!late} t="Fee amount" pre="$" v="25" d="e.g. 25 = $25.00 flat fee" />
          <FieldRow dim={!late} t="Grace period" v="10" d="Days past the due date before a fee applies. 0 for none." />
          <SwitchRow dim={!late} id="auto" tap={tap} on={auto} t="Auto-apply late fees" d="Applied in the daily billing run once the grace period is up. Off, you add them by hand." />
          <div className="rvm-sec" ref={overdueRef}>Overdue</div>
          <SwitchRow info id="pause" tap={tap} on={pause} t="Automatic pause" d="Customers who stop paying are paused for you, billing and service, and resume by themselves once they pay. The route slot is held." />
          <FieldRow dim={!pause} t="Pause after" v="30" d="How many days past due an invoice can get before its customer is paused." />
          <div className="rvm-sec">Chemical costs</div>
          <div className="rvm-row is-switch" ref={endRef}><span className="rvm-row-t">Chemical pricing</span><span className="rvm-btn">Manage</span><span className="rvm-row-d">Per-unit cost of what goes in the water.</span></div>
        </motion.div>
      </div>
    </>
  );
}

const TAB_ZONE = 48 + 64; // the tab bar's bottom offset + height (revenue-mobile.css .rvm-tabs)
const TABS = [LayoutDashboard, ReceiptText, Plus, Users, MoreHorizontal];

function TabBar({ active, tap }) {
  return (
    <div className="rvm-tabs">
      <motion.span className="rvm-cap" initial={false} animate={{ x: `${active * 100}%` }} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
      {TABS.map((Icon, i) => (
        <span key={i} className={`rvm-tab${i === active ? ' on' : ''}`}>
          <Icon size={26} strokeWidth={1.5} aria-hidden />
          {i === 4 && <Tap on={tap?.id === 'more'} n={tap?.n} />}
        </span>
      ))}
    </div>
  );
}

const SHEET = [
  ['WORK', [['Requests', Ticket], ['Routes', Route], ['Payments', CreditCard], ['Services & Parts', Package]]],
  ['BUSINESS', [['Staff', UserCog], ['Settings', Settings], ['Docs', FileText]]],
];

function MoreSheet({ show, tap }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div key="bd" className="rvm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
          <motion.div key="sheet" className="rvm-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
            <span className="rvm-grab" />
            <div className="rvm-me">
              <span className="rvm-avatar">A</span>
              <span className="rvm-me-t"><b>Alex Rivera</b><small>Owner · Bayside Pool Co.</small></span>
              <span className="rvm-round"><Moon size={18} strokeWidth={1.75} aria-hidden /></span>
              <span className="rvm-round"><LogOut size={18} strokeWidth={1.75} aria-hidden /></span>
            </div>
            {SHEET.map(([group, items]) => (
              <div key={group} className="rvm-group">
                <div className="rvm-glabel">{group}</div>
                {items.map(([label, Icon]) => (
                  <div key={label} className={`rvm-link is-sheet${label === 'Settings' && tap?.id === 'settings' ? ' is-pressed' : ''}`}>
                    <Icon {...I} /><span>{label}</span>
                    {label === 'Settings' && <Tap on={tap?.id === 'settings'} n={tap?.n} />}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function RevenueMobileStory({ features }) {
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const copyRef = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  const [beat, setBeat] = useState(0);
  const [tap, setTap] = useState(null);
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1.3); // beat 1 close-up, on top of scale
  const last = useRef(0);

  const sync = (v) => {
    setBeat(beatAt(v));
    const s = stepAt(v);
    if (s === last.current) return;
    if (s > last.current && TAPS[s]) setTap({ id: TAPS[s], n: s }); // taps only play going forward
    last.current = s;
    setStep(s);
  };
  useMotionValueEvent(p, 'change', sync);
  useLayoutEffect(() => {
    last.current = stepAt(p.get());
    setStep(last.current);
    setBeat(beatAt(p.get()));
  }, [p]);
  useEffect(() => {
    if (!tap) return undefined;
    const t = setTimeout(() => setTap(null), 700);
    return () => clearTimeout(t);
  }, [tap]);

  // Fit the phone between the step copy and the bottom of the (pinned, 100svh) stage.
  useLayoutEffect(() => {
    const fit = () => {
      const st = stickyRef.current;
      if (!st) return;
      const h = st.clientHeight - copyRef.current.offsetHeight - 22 - 36;
      const w = st.clientWidth - 48;
      const s = Math.max(0.6, Math.min(st.clientWidth >= 600 ? 1.7 : 1.25, h / 586, w / 262));
      setScale(s);
      setZoom(Math.max(1, Math.min(1.35, (st.clientWidth - 16) / (262 * s)))); // stays inside the screen's width
    };
    fit();
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const b0 = useTransform(p, [BEATS[0][0], BEATS[0][1] - 0.02], [0, 1]);
  const b1 = useTransform(p, [BEATS[1][0], BEATS[1][1] - 0.02], [0, 1]);
  const b2 = useTransform(p, [BEATS[2][0], BEATS[2][1] - 0.06], [0, 1]);
  const screen = step >= 9 ? 3 : step >= 7 ? 2 : step >= 3 ? 1 : 0;
  const sheet = step >= 5 && step < 7;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={trackRef} className="rvm-track">
        <div ref={stickyRef} className="rvm-sticky">
          <div ref={copyRef} className="rvm-copy">
            <div className="rvm-bars" aria-hidden="true">
              {[b0, b1, b2].map((b, i) => <span key={i}><motion.i style={{ scaleX: b }} /></span>)}
            </div>
            <div className="rvm-texts">
              {features.map((f, i) => (
                <motion.div
                  key={f.n}
                  className="rvm-text"
                  initial={false}
                  animate={{ opacity: i === beat ? 1 : 0, y: i === beat ? 0 : i < beat ? -10 : 10 }}
                  transition={{ duration: 0.4, ease: IOS }}
                >
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="rvm-fit"
            style={{ width: 262 * scale, height: 586 * scale, transformOrigin: '50% 0' }}
            initial={false}
            animate={{ scale: beat === 0 ? zoom : 1 }}
            transition={{ type: 'tween', duration: 0.8, ease: IOS }}
            aria-hidden="true"
          >
            <div className="rvm-scale" style={{ transform: `scale(${scale})` }}>
              <PhoneFrame className="bz-phone--embedded rvm-phone" statusBar="light">
                <div className="rvm-app">
                  <Screen index={0} current={screen}><Dashboard open={step >= 1} tap={tap} /></Screen>
                  <Screen index={1} current={screen}><Invoices /></Screen>
                  <Screen index={2} current={screen}><SettingsList tap={tap} /></Screen>
                  <Screen index={3} current={screen}><Billing step={step} tap={tap} /></Screen>
                  <MoreSheet show={sheet} tap={tap} />
                  <TabBar active={step < 3 ? 0 : step < 5 ? 1 : 4} tap={tap} />
                </div>
              </PhoneFrame>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
