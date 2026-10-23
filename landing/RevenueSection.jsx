import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import {
  Bell, ChevronUp, CreditCard, FileText, LayoutDashboard, Package, Plus, Route, Search, Settings, Ticket, UserCog, Users,
} from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import { useRevenueStory, RevenueStoryStyles, FeatureBar, RevenueSettingsLayer, StoryCursor } from './RevenueStory.jsx';
import RevenueMobileStory from './RevenueMobileStory.jsx';
import './revenue.css';

// Section 3: revenue protection. Centred copy, three numbered features, then a
// decorative dashboard snippet whose red billing banner opens as it scrolls
// into view and fades into the page at the bottom. On desktop (≥ 1024px) the
// features row and the dashboard pin while the app "plays" a scroll story:
// overdue notices → late fees → automatic pause (RevenueStory.jsx). All figures are MOCK data:
// 5 billing problems = 2 + 3 (the red, critical rows) plus 2 estimates
// waiting (not a billing problem, so no red dot); 7 in all.

const FEATURES = [
  {
    n: '01',
    title: 'Nothing Slips Through the Cracks',
    body: 'A card fails on autopay? An invoice goes past due? PoolLogic puts it at the top of your dashboard with one tap to fix it, and automatically sends overdue reminders to customers for you.',
  },
  {
    n: '02',
    title: 'Late Fees on Autopilot',
    body: 'Set a flat or percentage fee and a grace period once. PoolLogic adds it in the daily billing run. No awkward phone calls.',
  },
  {
    n: '03',
    title: 'Automatic Pause & Resume',
    body: 'Customers who stop paying are paused, billing and service, and resume the moment they pay. Their route slot is held.',
  },
];

const NAV = [
  { label: 'Operations', items: [['Dashboard', LayoutDashboard, true], ['Requests', Ticket], ['Customers', Users], ['Routes', Route], ['Staff', UserCog], ['Settings', Settings]] },
  { label: 'Money', items: [['Invoices', FileText], ['Payments', CreditCard]] },
  { label: 'Catalog', items: [['Services & Parts', Package]] },
];

// The app's own labels (dashboard/Dashboard.tsx attention sources).
const ROWS = [
  { label: 'Autopay declined', hint: 'Card declined · ACH returned', count: 2, critical: true },
  { label: 'Invoices past due', note: '(overdue notices sent)', hint: 'Late fees applied', count: 3, critical: true },
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
          <div className="rvs-dash">
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
                  <span className="rv-row-label">{r.label}{r.note && <span className="rv-row-hint"> {r.note}</span>}{r.hint && <span className="rv-row-hint"> · {r.hint}</span>}</span>
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
          <RevenueSettingsLayer />
        </div>
        <StoryCursor />
      </div>
    </div>
  );
}

// The desktop story runs from 1024px up (as RevenueStory.jsx does); below that the phone story.
const WIDE = '(min-width: 1024px)';
const useIsWide = () => useSyncExternalStore(
  (cb) => { const mq = window.matchMedia(WIDE); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb); },
  () => window.matchMedia(WIDE).matches,
  () => true,
);

export default function RevenueSection() {
  const sectionRef = useRef(null);
  const wide = useIsWide();
  useRevenueStory(sectionRef, wide);
  return (
    <section ref={sectionRef} id="collections" className="rv section" aria-labelledby="revenue-heading">
      <RevenueStoryStyles />
      <div className="rv-inner container">
        <SectionHeader
          id="revenue-heading"
          eyebrow="Financial watchdog"
          title={<>
            <span className="rv-h2-a">Stop trading your free time</span>{' '}
            <span className="rv-h2-b">to customers who choose to ignore their invoices.</span>
          </>}
          subtitle="You didn’t start a business to act as a full-time debt collector—so let PoolLogic play the bad guy. Automate your financial SOPs so everyone is treated fairly and you get your time back. From tracking forgotten chemical charges to automatically deploying late fees and pausing service for non-payers, the system enforces your rules flawlessly. Stop sending awkward texts and let the software get your accounts in line."
          eyebrowClassName="text-[#FF0036]"
          subtitleClassName="text-[#94a3b8]"
        />

        {wide ? (
          <div className="rvs-track">
            <div className="rvs-sticky">
              <div className="rv-features">
                {FEATURES.map((f) => (
                  <div key={f.n} className="rv-feature">
                    <FeatureBar />
                    <h3 className="rv-ft">{f.title}</h3>
                    <p className="rv-fd">{f.body}</p>
                  </div>
                ))}
              </div>

              <DashboardSnippet />
            </div>
          </div>
        ) : (
          <RevenueMobileStory features={FEATURES} />
        )}
      </div>
    </section>
  );
}
