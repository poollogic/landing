import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  FeaturePage, FeatureHero, HeroWordmark, FeatureSection, PhoneAndPoints, Points, Questions, ArrowLink, FcTick, FcCross,
} from '../landing/feature-page/FeaturePage.jsx';
// The phone (its frame and the route screen's rules) and the feature card's tick are feature-page's copies
// of their rules (feature-phone.css, pn-phone-route.css, feature-page.css): importing pn-phone.css or
// feature-card.css would bundle those with the homepage's and /pool-route-software's CSS and change what
// those pages load.
import { FeaturePhone, RouteTop, Ic } from '../landing/feature-page/FeaturePhone.jsx';
import '../landing/mileage-page/mileage-page.css';
import { TRIAL_DAYS } from '../aiFacts.js';
import { MILEAGE_TITLE, MILEAGE_DESCRIPTION } from '../landing/mileage-page/mileageMeta.js';
import {
  IRS_RATE_CENTS, IRS_RATE_SINCE, MILES_PER_TRUCK_WEEK, WEEKS, FLEET_MILES_WEEK, FLEET_MILES_YEAR, DEDUCTION_DOLLARS,
  ROUTE_STOPS, ROUTE_LEGS_TENTHS, ROUTE_TODAY_TENTHS, ROUTE_WEEK_TENTHS, WEEK_BARS, ROUTE_DAYS,
  GPS_LOG_TENTHS, ODOMETER_START, ODOMETER_END, ODOMETER_MILES, CHECKIN_GAP_TENTHS, thousands, tenths,
} from '../landing/mileage-page/mileageFacts.js';

// /pool-service-mileage-tracking: mileage tracking, built from the approved reference
// (mileage-page-reference.html, 2026-11-25): its layout, copy, demo data, colours, sizes and breakpoints
// (1020px: the hero stacks; 720px: one column). The sibling of /pool-service-fleet-management: the two
// share landing/feature-page/ (FeaturePage.jsx, feature-page.css): the light nav, /ai-and-automations'
// light hero with the "Vision plan" tag row, the sections and their headings, the phone (.pn-phone)
// beside three points, the feature card's green tick (.fc-tick), the questions, the AI page's dark trial
// band (TrialBand.jsx) and the footer. This page's own blocks: the route card, the three-number card, the
// mileage log, the check-in cards, the comparison cards and the tech app's route list in the phone
// (pn-phone-route.css, from poolnautics-route-screen.html); sizes in landing/mileage-page/mileage-page.css
// (.mtk-*). Numbers: mileageFacts.js (the IRS rate in one place). No entrance animations or scroll effects.
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

const PHONE_STOPS = [
  { n: null, name: 'Dana Whitfield', street: '1182 Laurel Court', city: 'Clearwater, FL 33756' },
  { n: null, name: 'Marcus Bell', street: '214 Marina Way', city: 'Clearwater, FL 33767' },
  { n: null, name: 'Elena Ortiz', street: '37 Harbor Bluff Drive', city: 'Largo, FL 33770' },
  { n: 4, name: 'Sam Whitaker', street: '88 Heron Way', city: 'Largo, FL 33771' },
  { n: 5, name: 'Nora Castillo', street: '28 Pelican Point', city: 'Largo, FL 33774' },
];
const PHONE_DONE = PHONE_STOPS.filter((s) => s.n === null).length; // 3 (18%)

/** Justin's route list on the tech app, mid-morning: three stops reported. A picture (hidden from screen readers). */
function RoutePhone() {
  return (
    <FeaturePhone screen="pn-route">
      <RouteTop name="Justin" done={PHONE_DONE} total={ROUTE_STOPS} />

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
        <div className="pn-tab"><span className="pn-tab__icon"><Ic name="plusSquare" size={24} /></span>New</div>
      </div>
    </FeaturePhone>
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
const QUESTIONS = [
  ['Which plan includes mileage tracking?', `Mileage tracking is part of the Vision plan. Every feature is included in your ${TRIAL_DAYS}-day trial, so you can try it before you choose a plan.`],
  ['Does it log the drive to and from home?', 'No. Tracking runs from the first stop of the day to the last, so the commute stays out of the log.'],
  ['Do my techs have to start or stop anything?', 'No. The phone measures the distance between stops as they work their route in the tech app.'],
  ['What if a trip is wrong or wasn’t for work?', 'You can correct the miles or leave the trip out before you export.'],
  ['Which phones does it work on?', 'The tech app is free on iPhone. Android is coming soon.'],
];

/* ---------- The page ---------- */

export default function MileageTrackingPage() {
  return (
    <FeaturePage className="mileage-page" current="/pool-service-mileage-tracking">
      {/* 1. Hero (light grey): /ai-and-automations' light hero; the route card on the right. */}
      <FeatureHero id="mtk-hero-title" title="Pool Service Mileage Tracking That Logs Itself" visual={<RouteCard />}>
        The <HeroWordmark /> pool
        service tech app measures the miles between every stop by GPS. No separate mileage app, no logbook, and nothing
        for your techs to remember.
      </FeatureHero>

      {/* 2. Why it matters (white): the three-number card. */}
      <FeatureSection
        tone="white"
        id="mtk-why-title"
        eyebrow="Why it matters"
        title={`Every mile you log is ${IRS_RATE_CENTS}¢ you can deduct.`}
        sub="A mile nobody wrote down is a deduction you can’t take. For a truck that’s on a route all week, that adds up fast."
      >
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
      </FeatureSection>

      {/* 3. Mileage on autopilot (light grey): the phone, then the three points. */}
      <FeatureSection
        tone="tint"
        id="mtk-how-title"
        eyebrow="Mileage on autopilot"
        title="Every mile between stops, measured by the phone."
        sub="Your techs open their route like they always do. The app does the measuring."
      >
        <PhoneAndPoints phone={<RoutePhone />} points={HOW} />
      </FeatureSection>

      {/* 4. The mileage log (white): the Fleet card, then three points. */}
      <FeatureSection
        tone="white"
        id="mtk-log-heading"
        eyebrow="The mileage log"
        title="A stop-by-stop log, ready for your accountant."
        sub="Every leg is listed with its date, its technician and the miles between the two stops."
      >
        <MileageLog />
        <Points items={LOG_POINTS} />
      </FeatureSection>

      {/* 5. Truck check-ins (dark): the page's one dark section before the trial band. */}
      <FeatureSection
        tone="dark"
        id="mtk-checkins-title"
        eyebrow="Truck check-ins"
        title="Odometer photos that back up the log."
        sub="On a schedule you set, the app asks each tech for a photo of the odometer and the oil change sticker. That gives you a second record of every truck to hold against the GPS log."
      >
        <div className="mtk-x">
          <div className="fp-x-card">
            <span className="mtk-label">GPS mileage log</span>
            <b className="mtk-big mtk-num">{tenths(GPS_LOG_TENTHS)}<em>mi</em></b>
            <p>Justin’s routes from Nov 9 to Nov 20, measured stop to stop by his phone.</p>
            <div className="mtk-x-proof">{ROUTE_DAYS} route days, {ROUTE_DAYS * ROUTE_STOPS} stops</div>
          </div>
          <div className="fp-x-card">
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
          <ArrowLink href="/pool-service-fleet-management">See fleet management</ArrowLink>
        </p>
      </FeatureSection>

      {/* 6. No second app (white): two cards side by side. */}
      <FeatureSection
        tone="white"
        id="mtk-vs-title"
        eyebrow="No second app"
        title="One less app on your techs’ phones."
        sub="Most pool companies track mileage in a separate app, or not at all."
      >
        <div className="mtk-vs">
          <div className="mtk-vs-card">
            <h3 className="fp-h3">A separate mileage app</h3>
            <ul>{VS_THEM.map((t) => <li key={t}><FcCross />{t}</li>)}</ul>
          </div>
          <div className="mtk-vs-card mtk-vs-card--us">
            <h3 className="fp-h3">Mileage in Poolnautics</h3>
            <ul>{VS_US.map((t) => <li key={t}><FcTick />{t}</li>)}</ul>
          </div>
        </div>
      </FeatureSection>

      {/* 7. Questions (light grey): plain headings, no FAQ structured data. */}
      <FeatureSection tone="tint" id="mtk-faq-title" eyebrow="Questions" title="Pool service mileage tracking questions.">
        <Questions items={QUESTIONS} />
      </FeatureSection>

      {/* 8. The closing trial band (dark): FeaturePage adds /ai-and-automations' TrialBand. */}
    </FeaturePage>
  );
}
