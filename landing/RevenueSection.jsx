import React, { useEffect, useRef } from 'react';
import {
  Bell, ChevronUp, CreditCard, FileText, LayoutDashboard, Package, Plus, Route, Search, Settings, Ticket, UserCog, Users,
} from 'lucide-react';
import './revenue.css';

// Section 3: revenue protection. Centred copy, three numbered features, then a
// decorative dashboard snippet whose red billing banner opens as it scrolls
// into view and fades into the page at the bottom. All figures are MOCK data:
// 5 billing problems = 2 + 3 (the red, critical rows) plus 2 estimates
// waiting (not a billing problem, so no red dot); 7 in all.

const FEATURES = [
  {
    n: '01',
    title: 'Instant Error Catching',
    body: 'Stop waiting 60 days to realize a payment bounced. The dashboard flags failed auto-pays front-and-center the second you log in.',
  },
  {
    n: '02',
    title: 'Automated Account Enforcement',
    body: 'Get a prioritized list of past-due accounts. Late notices go out automatically, and PoolLogic can add late fees and pause service for you.',
  },
  {
    n: '03',
    title: 'No More Free Chemicals',
    body: 'Techs log specialty chemicals in the app, and the system automatically tags them for the next invoice run.',
  },
];

const NAV = [
  { label: 'Operations', items: [['Dashboard', LayoutDashboard, true], ['Requests', Ticket], ['Customers', Users], ['Routes', Route], ['Staff', UserCog], ['Settings', Settings]] },
  { label: 'Money', items: [['Invoices', FileText], ['Payments', CreditCard]] },
  { label: 'Catalog', items: [['Services & Parts', Package]] },
];

// The app's own labels (dashboard/Dashboard.tsx attention sources).
const ROWS = [
  { label: 'Payments to fix', hint: 'Card declined · ACH returned', count: 2, critical: true },
  { label: 'Invoices past due', hint: 'Late fees applied', count: 3, critical: true },
  { label: 'Estimates awaiting approval', hint: 'Sent to customers', count: 2 },
];

const TILES = [
  { label: 'Invoiced, month to date', dot: '#3885C6', value: '$52,720' },
  { label: 'Recurring revenue', dot: '#fff', value: '$48,930', unit: '/mo' },
  { label: 'Active customers', dot: 'rgba(203,213,225,.62)', value: '302', unit: '· 4 paused' },
  { label: 'Average per customer', dot: 'rgba(203,213,225,.62)', value: '$162.02', unit: '/mo' },
];

const ICON = { size: 16, strokeWidth: 1.5, 'aria-hidden': true };

/** Opens the banner when it crosses 35% up from the bottom of the screen going
 *  down; closes it only when it drops back below that line going up. */
function useBannerReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('open');
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.classList.add('open');
        else if (e.rootBounds && e.boundingClientRect.top > e.rootBounds.bottom) el.classList.remove('open');
      },
      { rootMargin: '0px 0px -35% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

function DashboardSnippet() {
  const bannerRef = useRef(null);
  useBannerReveal(bannerRef);
  return (
    <div className="rv-snippet" aria-hidden="true">
      <div className="rv-frame">
        <aside className="rv-side">
          <div className="rv-co">Bayside Pool Co.</div>
          <div className="rv-actions">
            <span className="rv-new"><Plus {...ICON} /> New</span>
            <span className="rv-ico"><Search {...ICON} /></span>
            <span className="rv-ico rv-bell"><Bell {...ICON} /></span>
          </div>
          {NAV.map((g) => (
            <div key={g.label} className="rv-group">
              <div className="rv-glabel">{g.label}</div>
              {g.items.map(([label, Icon, active]) => (
                <div key={label} className={`rv-nav${active ? ' is-active' : ''}`}><Icon {...ICON} />{label}</div>
              ))}
            </div>
          ))}
        </aside>

        <div className="rv-main">
          <div className="rv-hello">Good evening, Alex</div>
          <div className="rv-date">Monday, November 2, 2026</div>

          <div className="rv-banner" ref={bannerRef}>
            <div className="rv-banner-top">
              <span className="rv-mark">!</span>
              <p className="rv-banner-text">
                <b>5 billing problems</b>
              </p>
              <span className="rv-ghost">Review all 7 <ChevronUp size={14} strokeWidth={2} className="rv-chev" /></span>
              <span className="rv-fix">Fix 2 payments <span>→</span></span>
            </div>
            <ul className="rv-rows">
              {ROWS.map((r) => (
                <li key={r.label}>
                  <span className={`rv-dot${r.critical ? ' is-red' : ''}`} />
                  <span className="rv-row-label">{r.label}{r.hint && <span className="rv-row-hint"> · {r.hint}</span>}</span>
                  <span className="rv-row-count">{r.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rv-tiles">
            {TILES.map((t) => (
              <div key={t.label} className="rv-tile">
                <span className="rv-tile-label"><span style={{ background: t.dot }} />{t.label}</span>
                <span className="rv-tile-value">{t.value}{t.unit && <small>{t.unit}</small>}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RevenueSection() {
  return (
    <section id="collections" className="rv" aria-labelledby="revenue-heading">
      <div className="rv-inner">
        <div className="rv-copy">
          <p className="rv-eyebrow">Revenue protection</p>
          <h2 id="revenue-heading" className="rv-h2">
            <span className="rv-h2-a">Stop working for free.</span>
            <span className="rv-h2-b">Plug your revenue leaks.</span>
          </h2>
          <p className="rv-lede">
            You cannot collect what you cannot see. Pool companies bleed thousands of dollars a month because expired
            credit cards and forgotten chemical charges get lost in messy spreadsheets. PoolLogic acts as your automated
            financial watchdog.
          </p>
        </div>

        <div className="rv-features">
          {FEATURES.map((f) => (
            <div key={f.n} className="rv-feature">
              <h3 className="rv-ft">{f.title}</h3>
              <p className="rv-fd">{f.body}</p>
            </div>
          ))}
        </div>

        <DashboardSnippet />
      </div>
    </section>
  );
}
