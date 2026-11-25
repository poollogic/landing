import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
// The phone and the feature card's tick are styled by this page's own copies of their rules
// (pn-phone-route.css, mileage-page.css): importing pn-phone.css or feature-card.css would bundle those
// with the homepage's and /pool-route-software's CSS and change what those pages load.
import '../landing/technicians/pn-phone-route.css';
import '../landing/mileage-page/mileage-page.css';
import Nav from '../landing/Nav.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import TrialBand from '../landing/ai/TrialBand.jsx';
import { Wordmark } from '../components/brand-logo.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { FOCUS, PrimaryCta } from '../landing/ai/shared.jsx';
import { TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';
import { MILEAGE_TITLE, MILEAGE_DESCRIPTION } from '../landing/mileage-page/mileageMeta.js';
import {
  IRS_RATE_CENTS, IRS_RATE_SINCE, MILES_PER_TRUCK_WEEK, WEEKS, FLEET_MILES_WEEK, FLEET_MILES_YEAR, DEDUCTION_DOLLARS,
  ROUTE_STOPS, ROUTE_LEGS_TENTHS, ROUTE_TODAY_TENTHS, ROUTE_WEEK_TENTHS, WEEK_BARS, ROUTE_DAYS,
  GPS_LOG_TENTHS, ODOMETER_START, ODOMETER_END, ODOMETER_MILES, CHECKIN_GAP_TENTHS, thousands, tenths,
} from '../landing/mileage-page/mileageFacts.js';

// /pool-service-mileage-tracking: mileage tracking, built from the approved reference
// (mileage-page-reference.html, 2026-11-25): its layout, copy, demo data, colours, sizes and breakpoints
// (1020px: the hero stacks; 720px: one column). The site's own pieces where they exist: the light nav,
// /ai-and-automations' light hero (ai.css), the section heading classes, .hero-cta and .cta-secondary,
// the feature card's green tick (.fc-tick), the phone frame (.pn-phone) with the tech app's route list
// (pn-phone-route.css, from poolnautics-route-screen.html), the AI page's dark trial band (TrialBand.jsx)
// and the footer. This page's own blocks and sizes: landing/mileage-page/mileage-page.css (.mtk-*).
// Numbers: mileageFacts.js (the IRS rate in one place). No entrance animations or scroll effects.
// Pre-rendered (entry-server.jsx), so nothing here reads window or document while rendering.
// Sections: hero (light grey), why it matters (white), how it's measured (grey), the mileage log
// (white), truck check-ins (dark), no second app (white), questions (grey), the trial band (dark).

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/pool-service-mileage-tracking`;

// Structured data for the pre-rendered <head> (entry-server.jsx), as the other feature pages': the page
// (about the product, index.html's site-wide SoftwareApplication #software) and where it sits. No FAQPage.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: MILEAGE_TITLE,
    description: MILEAGE_DESCRIPTION,
    inLanguage: 'en-US',
    dateModified: '2026-11-25',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': `${ORIGIN}/#software` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Pool service mileage tracking', item: PAGE_URL },
    ],
  },
];

/* ---------- 1. Hero: the route card ---------- */

const NoteTick = () => (
  <svg className="mtk-note-tick" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** Justin's Friday: the drive in and home left out, the legs between stops counted. */
function RouteCard() {
  const [first, second, rest] = ROUTE_LEGS_TENTHS;
  return (
    <div className="mtk-route">
      <div className="mtk-route-head">
        <div><b>Justin’s route</b><span>Friday, {ROUTE_STOPS} stops</span></div>
        <span className="mtk-pill">Route complete</span>
      </div>
      <ol className="mtk-stops">
        <li className="mtk-leg mtk-leg--off mtk-leg--first">Drive from home, not logged</li>
        <li className="mtk-stop">1182 Laurel Court<span>First stop</span></li>
        <li className="mtk-leg">{tenths(first)} mi</li>
        <li className="mtk-stop">214 Marina Way<span>Stop 2</span></li>
        <li className="mtk-leg">{tenths(second)} mi</li>
        <li className="mtk-stop">37 Harbor Bluff Drive<span>Stop 3</span></li>
        <li className="mtk-leg">{tenths(rest)} mi across {ROUTE_STOPS - 4} more stops</li>
        <li className="mtk-stop">9 Osprey Landing<span>Last stop</span></li>
        <li className="mtk-leg mtk-leg--off mtk-leg--last">Drive home, not logged</li>
      </ol>
      <div className="mtk-route-foot">
        <div className="mtk-foot-col"><span>Today</span><b className="mtk-num">{tenths(ROUTE_TODAY_TENTHS)}<small>mi</small></b></div>
        {/* Decorative week strip; the bars are illustrative, not to scale from zero. */}
        <div className="mtk-week" role="img" aria-label="Miles logged each day this week, Monday to Friday">
          {WEEK_BARS.map(([day, h], i) => (
            <i key={i} className={i === WEEK_BARS.length - 1 ? 'is-on' : undefined} style={{ '--h': `${h}px` }}>{day}</i>
          ))}
        </div>
        <div className="mtk-foot-col mtk-foot-col--week"><span>This week</span><b className="mtk-num">{tenths(ROUTE_WEEK_TENTHS)}<small>mi</small></b></div>
      </div>
    </div>
  );
}

/* ---------- 3. The phone: the tech app's route list ---------- */

// The app's own icons (poolnautics-route-screen.html, lucide shapes), drawn inline.
const PN = {
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  calculator: <><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" /></>,
  bell: <><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></>,
  gear: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
  circleCheck: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
  pin: <><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  ticket: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></>,
  cart: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>,
  plus: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8M12 8v8" /></>,
};
const Ic = ({ name, size = 20, style }) => <svg width={size} height={size} viewBox="0 0 24 24" style={style}>{PN[name]}</svg>;

const PHONE_STOPS = [
  { n: null, name: 'Dana Whitfield', street: '1182 Laurel Court', city: 'Clearwater, FL 33756' },
  { n: null, name: 'Marcus Bell', street: '214 Marina Way', city: 'Clearwater, FL 33767' },
  { n: null, name: 'Elena Ortiz', street: '37 Harbor Bluff Drive', city: 'Largo, FL 33770' },
  { n: 4, name: 'Sam Whitaker', street: '88 Heron Way', city: 'Largo, FL 33771' },
  { n: 5, name: 'Nora Castillo', street: '28 Pelican Point', city: 'Largo, FL 33774' },
];
const PHONE_DONE = PHONE_STOPS.filter((s) => s.n === null).length; // 3
const PHONE_PCT = Math.round((PHONE_DONE / ROUTE_STOPS) * 100); // 18

/** Justin's route list on the tech app, mid-morning: three stops reported. A picture (hidden from screen readers). */
function RoutePhone() {
  return (
    <div className="pn-phone pn-phone--route mtk-phone" aria-hidden="true">
      <div className="pn-screen pn-route">
        <div className="pn-island" />
        <div className="pn-status">
          <span>9:41</span>
          <span className="pn-status__right">
            <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx="1" /><rect x="5.2" y="5.5" width="3.2" height="6.5" rx="1" /><rect x="10.4" y="3" width="3.2" height="9" rx="1" /><rect x="15.6" y="0" width="3.2" height="12" rx="1" /></svg>
            <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.6c2.3 0 4.4.9 6 2.4.2.2.5.2.7 0l.9-.9c.2-.2.2-.5 0-.7C14.1 1.4 11.4.3 8.5.3S2.9 1.4.9 3.4c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0 1.6-1.5 3.7-2.4 6-2.4Zm0 3.9c1.3 0 2.4.5 3.3 1.3.2.2.5.2.7 0l.9-.9c.2-.2.2-.5 0-.7-1.3-1.2-3-2-4.9-2s-3.6.8-4.9 2c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0 .9-.8 2-1.3 3.3-1.3Zm2.1 2.9c.2-.2.2-.5 0-.7-.6-.5-1.3-.8-2.1-.8s-1.5.3-2.1.8c-.2.2-.2.5 0 .7l1.7 1.8c.2.2.5.2.7 0l1.8-1.8Z" /></svg>
            <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.4" /><rect x="2" y="2" width="20" height="9" rx="2.5" /><path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" fillOpacity="0.45" /></svg>
          </span>
        </div>

        <div className="pn-top">
          <div className="pn-daybar">
            <div className="pn-day"><b>Today</b><span>Nov 20</span><Ic name="chevronDown" size={16} /></div>
            <div className="pn-tools">
              <span><Ic name="calculator" /></span>
              {/* The bell's dot: something new since the list was last opened (the app's NotificationsBell). */}
              <span><span className="pn-bell"><Ic name="bell" /><i className="pn-bell-dot" /></span></span>
              <span><Ic name="gear" /></span>
            </div>
          </div>
          <div className="pn-greet">
            <div className="pn-greet__name">Hey, Justin</div>
            <div className="pn-synced"><Ic name="circleCheck" size={14} />Synced</div>
          </div>
          <div className="pn-card pn-progress">
            <div className="pn-progress__row">
              <div className="pn-progress__count"><b>{PHONE_DONE}</b><i> / {ROUTE_STOPS}</i> stops complete</div>
              <div className="pn-pct">{PHONE_PCT}%</div>
            </div>
            <div className="pn-track"><span style={{ width: `${PHONE_PCT}%` }} /></div>
          </div>
          <div className="pn-button"><Ic name="pin" size={18} />Map This Route</div>
        </div>

        <div className="pn-list">
          <ul className="pn-stops">
            {PHONE_STOPS.map((s) => (
              <li key={s.name} className="pn-card pn-stop">
                {s.n === null
                  ? <div className="pn-tile pn-tile--done"><Ic name="check" size={18} style={{ strokeWidth: 2.25 }} /></div>
                  : <div className="pn-tile">{s.n}</div>}
                <div className="pn-stop__info">
                  <div className="pn-stop__name">{s.name}</div>
                  <div className="pn-stop__street">{s.street}</div>
                  <div className="pn-stop__city">{s.city}</div>
                  {s.n === null && <div className="pn-stop__status">Reported</div>}
                </div>
                <Ic name="chevronRight" size={16} />
              </li>
            ))}
          </ul>
        </div>

        <div className="pn-bar">
          <div className="pn-tab"><span className="pn-tab__icon"><Ic name="ticket" size={24} /></span>Work Orders</div>
          <div className="pn-tab"><span className="pn-tab__icon"><Ic name="cart" size={24} /></span>Notes &amp; Shop</div>
          <div className="pn-tab"><span className="pn-tab__icon"><Ic name="plus" size={24} /></span>New</div>
        </div>
      </div>
    </div>
  );
}

const HOW = [
  ['First stop', 'Tracking starts with the route', 'The log begins at the first pool of the day, so the drive in from home stays out of it.'],
  ['Every stop', 'GPS measures each leg', 'The phone measures the distance from one stop to the next, every day. Nobody starts a timer or writes anything down.'],
  ['Last stop', 'Tracking ends with the route', 'The drive home isn’t logged either. What’s left is the miles driven for the business.'],
];

/* ---------- 4. The mileage log ---------- */

const [JUSTIN_LEG_1, JUSTIN_LEG_2] = ROUTE_LEGS_TENTHS; // the hero card's first two legs, as logged
const LOG_TILES = [['Miles this month', '2,948'], ['Legs logged', '724'], ['Corrected', '3'], ['Left out', '6']];
const LOG_ROWS = [
  { date: 'Nov 20', tech: 'Justin', from: '1182 Laurel Court', to: '214 Marina Way', miles: tenths(JUSTIN_LEG_1) },
  { date: 'Nov 20', tech: 'Justin', from: '214 Marina Way', to: '37 Harbor Bluff Drive', miles: tenths(JUSTIN_LEG_2) },
  { date: 'Nov 20', tech: 'Gabriel', from: '902 Bayshore Blvd', to: '4410 Gulf Pines Lane', miles: '5.2', tag: 'Corrected' },
  { date: 'Nov 20', tech: 'Michael', from: '18 Egret Cove', to: '77 Palmetto Avenue', miles: '11.6', tag: 'Left out' },
  { date: 'Nov 20', tech: 'Michael', from: '77 Palmetto Avenue', to: '640 Sandpiper Court', miles: '3.7' },
];

function MileageLog() {
  return (
    <div className="mtk-log">
      <div className="mtk-log-top">
        <h3 id="mtk-log-title">Fleet</h3>
        <div className="mtk-tiles">
          {LOG_TILES.map(([label, value]) => <div key={label} className="mtk-tile"><span>{label}</span><b>{value}</b></div>)}
        </div>
      </div>
      {/* The app's tabs and buttons, drawn: not controls here, so hidden from screen readers. */}
      <div className="mtk-log-bar" aria-hidden="true">
        <div className="mtk-tabs"><span>Trucks</span><b>Mileage</b></div>
        <div className="mtk-btns"><span className="mtk-btn">November</span><span className="mtk-btn mtk-btn--dark">Export</span></div>
      </div>
      <div className="mtk-table" role="table" aria-labelledby="mtk-log-title">
        <div className="mtk-row mtk-row--head" role="row">
          {['Date', 'Technician', 'From', 'To', 'Miles'].map((h) => <span key={h} role="columnheader">{h}</span>)}
        </div>
        {LOG_ROWS.map((r) => (
          <div key={r.from} className={`mtk-row${r.tag === 'Left out' ? ' mtk-row--out' : ''}`} role="row">
            <span role="cell">{r.date}</span>
            <span role="cell">{r.tech}</span>
            <span role="cell">{r.from}</span>
            <span role="cell">{r.to}</span>
            <span role="cell">
              <b>{r.miles}</b>
              {r.tag && <span className={`mtk-tag${r.tag === 'Left out' ? ' mtk-tag--grey' : ''}`}>{r.tag}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LOG_POINTS = [
  ['Stop to stop, with dates', 'Each row is one leg of a route: where it started, where it ended and how far it was.'],
  ['Fix it before it leaves', 'Leave out a trip that wasn’t for work, or correct the miles on one that’s wrong, before you export.'],
  ['One export for the books', 'Pull the whole period in one file and send it to whoever does your taxes and bookkeeping.'],
];

/* ---------- 6. No second app; 7. Questions ---------- */

const VS_THEM = [
  'One more subscription, usually billed per driver',
  'Drivers have to remember to open it, or write their miles down',
  'The miles live apart from the routes they belong to',
];
const VS_US = [
  'Built into the tech app your team already uses',
  'Starts and stops with the route, with nothing to press',
  'Every leg sits next to the stops it connects',
];
/** The homepage feature card's green tick (feature-card.css .fc-tick, FeatureCard.jsx's Check). */
const FcTick = () => (
  <span className="fc-tick" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);

const QUESTIONS = [
  ['Which plan includes mileage tracking?', `Mileage tracking is part of the Vision plan. Every feature is included in your ${TRIAL_DAYS}-day trial, so you can try it before you choose a plan.`],
  ['Does it log the drive to and from home?', 'No. Tracking runs from the first stop of the day to the last, so the commute stays out of the log.'],
  ['Do my techs have to start or stop anything?', 'No. The phone measures the distance between stops as they work their route in the tech app.'],
  ['What if a trip is wrong or wasn’t for work?', 'You can correct the miles or leave the trip out before you export.'],
  ['Which phones does it work on?', 'The tech app is free on iPhone. Android is coming soon.'],
];

/** A section's centred heading: eyebrow, h2, and its intro (if any), in the site's heading classes. */
function Head({ id, eyebrow, title, sub }) {
  return (
    <div className="mtk-head">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

/* ---------- The page ---------- */

export default function MileageTrackingPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg ai-page mileage-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav tone="light" overlay />
      <main>
        {/* 1. Hero (light grey): /ai-and-automations' light hero; the route card on the right. */}
        <section className="hero ai-hero ai-hero--light relative overflow-x-clip" data-theme="light" aria-labelledby="mtk-hero-title">
          <div className="container">
            <div className="ai-hero-grid">
              <div className="ai-hero-copy">
                <HeroHeading id="mtk-hero-title" title="Pool Service Mileage Tracking That Logs Itself">
                  The <span className="mtk-wordmark"><Wordmark style={{ display: 'inline-block' }} /></span><span className="sr-only">Poolnautics</span> pool
                  service tech app measures the miles between every stop by GPS. No separate mileage app, no logbook, and nothing
                  for your techs to remember.
                </HeroHeading>
                <div className="mtk-hero-cta">
                  <PrimaryCta theme={theme} label="Start your free trial" />
                  <a className={`cta-secondary mtk-ghost ${FOCUS}`} href="/pricing">See pricing</a>
                </div>
                <ul className="mtk-notes">
                  <li><span className="mtk-plan">Vision plan</span></li>
                  <li><NoteTick />Free for {TRIAL_DAYS} days</li>
                  <li><NoteTick />No credit card</li>
                </ul>
              </div>
              <div className="ai-hero-visual">
                <RouteCard />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Why it matters (white): the three-number card. */}
        <section className="mtk-sec mtk-sec--white" aria-labelledby="mtk-why-title">
          <div className="container">
            <Head
              id="mtk-why-title"
              eyebrow="Why it matters"
              title={`Every mile you log is ${IRS_RATE_CENTS}¢ you can deduct.`}
              sub="A mile nobody wrote down is a deduction you can’t take. For a truck that’s on a route all week, that adds up fast."
            />
            <ol className="mtk-math">
              <li>
                <span className="mtk-label">Three trucks</span>
                <b className="mtk-big mtk-num">{thousands(FLEET_MILES_WEEK)}<em>mi a week</em></b>
                <span>{MILES_PER_TRUCK_WEEK} miles a week each</span>
              </li>
              <li>
                <i className="mtk-chip" aria-hidden="true"><ArrowRight size={13} strokeWidth={2.4} /></i>
                <span className="mtk-label">Over a year</span>
                <b className="mtk-big mtk-num">{thousands(FLEET_MILES_YEAR)}<em>mi</em></b>
                <span>{WEEKS} weeks of stop-to-stop driving</span>
              </li>
              <li>
                <i className="mtk-chip" aria-hidden="true"><ArrowRight size={13} strokeWidth={2.4} /></i>
                <span className="mtk-label">Deduction</span>
                <b className="mtk-big mtk-num">${thousands(DEDUCTION_DOLLARS)}</b>
                <span>At the IRS standard rate</span>
              </li>
            </ol>
            <p className="mtk-fine">
              Based on the IRS standard mileage rate of {IRS_RATE_CENTS} cents a mile, in effect since {IRS_RATE_SINCE}. What you can
              deduct depends on how you claim vehicle costs, so check with your accountant.
            </p>
          </div>
        </section>

        {/* 3. Mileage on autopilot (light grey): the phone, then the three points. */}
        <section className="mtk-sec mtk-sec--tint" aria-labelledby="mtk-how-title">
          <div className="container">
            <Head
              id="mtk-how-title"
              eyebrow="Mileage on autopilot"
              title="Every mile between stops, measured by the phone."
              sub="Your techs open their route like they always do. The app does the measuring."
            />
            <div className="mtk-how">
              <div className="mtk-phone-col"><RoutePhone /></div>
              <ol className="mtk-how-points">
                {HOW.map(([label, title, body]) => (
                  <li key={label}><small>{label}</small><h3 className="mtk-h3">{title}</h3><p className="mtk-p">{body}</p></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 4. The mileage log (white): the Fleet card, then three points. */}
        <section className="mtk-sec mtk-sec--white" aria-labelledby="mtk-log-heading">
          <div className="container">
            <Head
              id="mtk-log-heading"
              eyebrow="The mileage log"
              title="A stop-by-stop log, ready for your accountant."
              sub="Every leg is listed with its date, its technician and the miles between the two stops."
            />
            <MileageLog />
            <ul className="mtk-points">
              {LOG_POINTS.map(([title, body]) => <li key={title}><h3 className="mtk-h3">{title}</h3><p className="mtk-p">{body}</p></li>)}
            </ul>
          </div>
        </section>

        {/* 5. Truck check-ins (dark): the page's one dark section before the trial band. */}
        <section className="mtk-sec mtk-sec--dark" aria-labelledby="mtk-checkins-title">
          <div className="container">
            <Head
              id="mtk-checkins-title"
              eyebrow="Truck check-ins"
              title="Odometer photos that back up the log."
              sub="On a schedule you set, the app asks each tech for a photo of the odometer and the oil change sticker. That gives you a second record of every truck to hold against the GPS log."
            />
            <div className="mtk-x">
              <div className="mtk-x-card">
                <span className="mtk-label">GPS mileage log</span>
                <b className="mtk-big mtk-num">{tenths(GPS_LOG_TENTHS)}<em>mi</em></b>
                <p>Justin’s routes from Nov 9 to Nov 20, measured stop to stop by his phone.</p>
                <div className="mtk-x-proof">{ROUTE_DAYS} route days, {ROUTE_DAYS * ROUTE_STOPS} stops</div>
              </div>
              <div className="mtk-x-card">
                <span className="mtk-label">Truck check-ins</span>
                <b className="mtk-big mtk-num">{thousands(ODOMETER_MILES)}<em>mi</em></b>
                <p>The same two weeks on the Toyota Tacoma’s odometer, from two photo check-ins.</p>
                <div className="mtk-x-proof">
                  <span className="mtk-odo"><span>{thousands(ODOMETER_START)}</span><i>Photo, Nov 6</i></span>
                  <span aria-hidden="true">→</span>
                  <span className="mtk-odo"><span>{thousands(ODOMETER_END)}</span><i>Photo, Nov 20</i></span>
                </div>
              </div>
            </div>
            <div className="mtk-x-result">
              <b className="mtk-big mtk-num">{tenths(CHECKIN_GAP_TENTHS)}<em>mi apart</em></b>
              <p>
                About four miles a day: the drives to and from home, which the log leaves out. When the two records line up like
                this, your accountant has the route miles and the truck’s total, each backing the other.
              </p>
            </div>
            <p className="mtk-center">
              {/* /#fleet (the homepage's fleet section) until the dedicated fleet page exists; then link that. */}
              <a className={`mtk-link ${FOCUS}`} href="/#fleet">See fleet management<ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></a>
            </p>
          </div>
        </section>

        {/* 6. No second app (white): two cards side by side. */}
        <section className="mtk-sec mtk-sec--white" aria-labelledby="mtk-vs-title">
          <div className="container">
            <Head
              id="mtk-vs-title"
              eyebrow="No second app"
              title="One less app on your techs’ phones."
              sub="Most pool companies track mileage in a separate app, or not at all."
            />
            <div className="mtk-vs">
              <div className="mtk-vs-card">
                <h3 className="mtk-h3">A separate mileage app</h3>
                <ul>{VS_THEM.map((t) => <li key={t}><span className="fc-tick mtk-tick--x" aria-hidden="true">×</span>{t}</li>)}</ul>
              </div>
              <div className="mtk-vs-card mtk-vs-card--us">
                <h3 className="mtk-h3">Mileage in Poolnautics</h3>
                <ul>{VS_US.map((t) => <li key={t}><FcTick />{t}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Questions (light grey): plain headings, no FAQ structured data. */}
        <section className="mtk-sec mtk-sec--tint" aria-labelledby="mtk-faq-title">
          <div className="container">
            <Head id="mtk-faq-title" eyebrow="Questions" title="Pool service mileage tracking questions." />
            <ul className="mtk-faq">
              {QUESTIONS.map(([q, a]) => <li key={q}><h3 className="mtk-h3">{q}</h3><p>{a}</p></li>)}
            </ul>
          </div>
        </section>

        {/* 8. The closing trial band (dark): /ai-and-automations' TrialBand, its copy as it is for now. */}
        <TrialBand theme={theme} />
      </main>
      <Footer />
    </div>
  );
}
