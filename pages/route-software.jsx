import React, { useEffect, useRef } from 'react';
import { ArrowRight, CalendarDays, GripVertical, Layers, MapPin, MoveHorizontal, Repeat, User } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/billing-page/billing-page.css';
import '../landing/import.css';
import '../landing/route.css';
import '../landing/technicians/pn-phone.css';
import '../landing/route-page/route-page.css';
import Nav from '../landing/Nav.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import FaqSection, { FAQS as HOME_FAQS } from '../landing/FaqSection.jsx';
import ImportDemo from '../landing/ImportDemo.jsx';
import { Handover } from '../landing/RouteSection.jsx';
import { Head, Tick } from '../landing/billing-page/PaymentAutomation.jsx';
import initPnPhones from '../landing/technicians/pnPhone.js';
import PN_ICONS from '../landing/technicians/pn-icons.html?raw';
import PN_PHONE_READINGS from '../landing/technicians/pn-phone-readings.html?raw';
import { ROUTE_TITLE, ROUTE_DESCRIPTION } from '../landing/route-page/routeMeta.js';
import { isReserving } from '../landing/onboarding.js';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { FOCUS, PrimaryCta } from '../landing/ai/shared.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /pool-route-software: routes and scheduling, the page for "pool route software" and "pool service
// scheduling software". /pool-service-billing's design throughout (its page classes, so billing-page.css
// and payment-automation.css style it: hero, section heads, two-column layouts, cards, FAQ and the
// closing section); this page's own pictures are landing/route-page/route-page.css (.rp-*, .rb-*).
// Reused as they are: the homepage's service report phone (#technicians), its import demo
// (#switching) and its route handover card (#routes). Every claim was checked against the web app and
// the phone app (Nov 21, 2026). Sections: hero (dark), drag and drop (white), recurring stops (grey),
// the technician app (white), mileage (grey), cost per visit (white), import (grey), handing over a
// route (dark), FAQ (grey), closing call to action (dark). Names, addresses and figures in the
// pictures are demo data. Pre-rendered (entry-server.jsx), so no window or document while rendering.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/pool-route-software`;
const homeFaq = (q) => {
  const f = HOME_FAQS.find((x) => x.q === q);
  if (!f) throw new Error(`route-software.jsx: the homepage FAQ "${q}" is missing`);
  return f;
};

// The FAQ: shown in #route-faq and sent as FAQPage structured data, from this one list. Three are the
// homepage's own answers, word for word.
export const FAQ = [
  homeFaq('Does the technician app work without signal?'),
  {
    q: 'Can a pool be serviced every other week?',
    a: 'Yes. Every stop is weekly or every other week, and for an every-other-week stop you choose whether its first visit is this week or next. A pool serviced more than once a week gets a stop for each visit, each with its own day.',
  },
  homeFaq('What comes over when I import?'),
  {
    q: 'Can I see what each pool costs me in chemicals?',
    a: 'Yes. Once you’ve entered your chemical prices, every customer’s page shows the chemical cost per visit: the latest visit, the average and the trend. The dashboard breaks it down by technician and by pool type.',
  },
  homeFaq('How does selling a route work?'),
];

// Structured data for the pre-rendered <head> (entry-server.jsx), as /pool-service-billing's: the page
// (about the product, index.html's site-wide SoftwareApplication #software), where it sits, the FAQ.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: ROUTE_TITLE,
    description: ROUTE_DESCRIPTION,
    inLanguage: 'en-US',
    dateModified: '2026-11-21',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': `${ORIGIN}/#software` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Pool route software', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];

const TRIAL_LABEL = isReserving ? 'Reserve your spot' : 'Start your free trial';
const TRIAL_FINE = 'Free for 30 days · No card to start';

/* ---------- Pictures ---------- */

// The hero's route board: one day, a column per technician, a stop mid-drag from Gabriel's route to
// Michael's. A still picture (no motion, fixed sizes), hidden from screen readers: the page says it.
const BOARD = [
  { tech: 'Justin', count: 17, stops: [['1', '1182 Laurel Ct', 'Weekly'], ['2', '233 Oakmont Ln', 'Weekly'], ['3', '7700 Ridgeway Rd', 'Every other week'], ['4', '49 Harbor Cir', 'Weekly']] },
  { tech: 'Gabriel', count: 18, stops: [['1', '957 Sunrise Dr', 'Weekly'], ['2', '310 Bayview Ter', 'Every other week'], ['3', '3204 Coquina Ct', 'Weekly', 'lifted'], ['4', '1402 Bayshore Blvd', 'Weekly']] },
  { tech: 'Michael', count: 15, stops: [['1', '88 Palm Ave', 'Weekly'], ['2', '615 Gulf View Dr', 'Weekly'], [null, 'Drop here', null, 'slot'], ['3', '22 Heron Way', 'Every other week']] },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function RouteBoard() {
  return (
    <div className="rb-panel" aria-hidden="true">
      <div className="rb-head">
        <span className="rb-title">Routes</span>
        <span className="rb-days">{DAYS.map((d) => <span key={d} className={d === 'Tue' ? 'is-on' : undefined}>{d}</span>)}</span>
      </div>
      <div className="rb-cols">
        {BOARD.map((col) => (
          <div key={col.tech} className="rb-col">
            <div className="rb-col-head"><span className="rb-avatar">{col.tech[0]}</span><b>{col.tech}</b><span>{col.count} stops</span></div>
            {col.stops.map(([n, addr, freq, state]) => (
              state === 'slot' ? <div key={addr} className="rb-slot">{addr}</div> : (
                <div key={addr} className={`rb-stop${state === 'lifted' ? ' is-lifted' : ''}`}>
                  <GripVertical size={14} strokeWidth={2} className="rb-grip" />
                  <span className="rb-n">{n}</span>
                  <span className="rb-stop-text"><b>{addr}</b><span>{freq}</span></span>
                </div>
              )
            ))}
            <div className="rb-more">+ {col.count - col.stops.filter((s) => s[3] !== 'slot').length} more</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A light card: a label, then rows of an icon, a title and a note. */
function ListCard({ label, rows, foot }) {
  return (
    <div className="pa-card rp-card" aria-hidden="true">
      <p className="pa-card-label pa-card-label--blue">{label}</p>
      <ul className="rp-rows">
        {rows.map(({ Icon, t, note, value }) => (
          <li key={t}>
            {Icon && <span className="rp-icon"><Icon size={16} strokeWidth={2} /></span>}
            <span className="rp-row-text"><b>{t}</b>{note && <span>{note}</span>}</span>
            {value && <span className="rp-value">{value}</span>}
          </li>
        ))}
      </ul>
      {foot && <p className="rp-foot">{foot}</p>}
    </div>
  );
}

/** A recurring stop's settings, as the customer page sets them. */
function StopSettings() {
  return (
    <div className="pa-card rp-card rp-settings" aria-hidden="true">
      <p className="pa-card-label pa-card-label--blue">Route · 3204 Coquina Ct</p>
      <dl className="rp-fields">
        <div><dt>Technician</dt><dd><span className="rp-select">Gabriel</span></dd></div>
        <div><dt>Service day</dt><dd><span className="rp-select">Tuesday</span></dd></div>
        <div><dt>Stop</dt><dd><span className="rp-select">3 of 18</span></dd></div>
        <div>
          <dt>Frequency</dt>
          <dd><span className="rp-seg"><span>Weekly</span><span className="is-on">Every other week</span></span></dd>
        </div>
        <div><dt>First visit</dt><dd><span className="rp-seg"><span className="is-on">This week</span><span>Next week</span></span></dd></div>
      </dl>
      <p className="rp-foot"><Repeat size={14} strokeWidth={2} /> On Gabriel’s Tuesday route every other week, third stop.</p>
    </div>
  );
}

/* ---------- The page ---------- */

export default function RouteSoftwarePage() {
  const theme = usePreviewTheme();
  const phoneRef = useRef(null);
  useEffect(() => { initPnPhones(phoneRef.current); }, []); // the phone's rulers and controls, once

  return (
    <div className="mktg ai-page billing-page route-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      {/* The phone's icons: a 0 × 0 sprite, as on the homepage. */}
      <div dangerouslySetInnerHTML={{ __html: PN_ICONS }} />
      <Nav />
      <main>
        {/* 1. Hero (dark): /pool-service-billing's, the route board in place of its calendar. */}
        <section className="hero ai-hero bp-hero relative overflow-x-clip" aria-labelledby="route-hero-title">
          <div className="ai-hero-fade" aria-hidden="true" />
          <div className="container">
            <div className="bp-hero-stack">
              <div className="ai-hero-copy bp-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <HeroHeading
                  id="route-hero-title"
                  eyebrow="Routes & scheduling"
                  title={<><span className="bp-title-line">Pool route software that keeps</span>{' '}<span className="bp-title-line">every stop on schedule</span></>}
                >
                  Poolnautics is pool route software for pool service companies. Give each pool a technician, a
                  service day and a place in the route once, and every tech opens the app to the right stops. It’s
                  pool service scheduling software you set up once, not every Monday.
                </HeroHeading>
                <div className="ai-cta-row ai-cta-row--center">
                  <PrimaryCta theme={theme} label={TRIAL_LABEL} />
                  <a href="/pricing" className={`ai-cta-ghost cta-secondary ${FOCUS}`}>See pricing</a>
                </div>
                <p className="hero-fine">{TRIAL_FINE}</p>
              </div>
              <div className="bp-hero-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <RouteBoard />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Drag and drop (white). */}
        <section className="pa-section pa-white" aria-labelledby="rp-drag-title">
          <div className="container">
            <div className="pa-inner">
              <div className="pa-split">
                <div className="pa-copy">
                  <Head
                    id="rp-drag-title"
                    eyebrow="Route building"
                    a="Build and change routes"
                    b="by drag and drop."
                    sub="Every route is on one screen. Move a stop and it’s saved: no forms, no rebuilding the week."
                  />
                  <ul className="pa-checks" role="list">
                    {['Works with a mouse, or press and hold on a tablet', 'Select several stops and move them together', 'Optimize route reorders a tech’s day from the start address you choose, and you apply or discard it'].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="pa-visual">
                  <ListCard
                    label="Drag a stop"
                    rows={[
                      { Icon: GripVertical, t: 'Up or down the list', note: 'Changes the stop order for that day' },
                      { Icon: User, t: 'Onto another technician', note: 'Hands the stop to their route' },
                      { Icon: CalendarDays, t: 'Onto another day', note: 'Moves it to that service day' },
                      { Icon: Layers, t: 'Several at once', note: 'Select them, then drag them together' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Recurring stops (grey). */}
        <section className="pa-section pa-grey" aria-labelledby="rp-recurring-title">
          <div className="container">
            <div className="pa-inner">
              <div className="pa-split pa-split--mirror">
                <div className="pa-copy">
                  <Head
                    id="rp-recurring-title"
                    eyebrow="Recurring stops"
                    a="Set each stop once."
                    b="It shows up on the right day, every time."
                    sub="Every pool has a technician, a service day and a place in the stop order, serviced weekly or every other week. A pool you visit twice a week simply gets two stops."
                  />
                  <ul className="pa-checks" role="list">
                    {['Technician, service day and stop order', 'Weekly or every other week, starting this week or next', 'More than one visit a week, each on its own day'].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                  <p className="rp-more"><a href="/pool-service-billing">Billing runs on its own schedule: see recurring billing<ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" /></a></p>
                </div>
                <div className="pa-visual">
                  <StopSettings />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The technician app (white): the homepage's service report phone. */}
        <section className="pa-section pa-white rp-app" aria-labelledby="rp-app-title">
          <div className="container">
            <div className="pa-inner">
              <div className="pa-split pa-split--mirror">
                <div className="pa-copy">
                  <Head
                    id="rp-app-title"
                    eyebrow="The technician app"
                    a="Your techs get one simple app."
                    b="You get proof of every stop."
                    sub="The day’s route is on their phone, and every service report comes back with the readings, the chemicals and the photos. Each report is emailed to the customer automatically."
                  />
                  <ul className="rp-points" role="list">
                    <li><h3>Works offline</h3><p>Reports, photos and “can’t service” notes are saved on the phone and send by themselves when the signal comes back.</p></li>
                    <li><h3>Readings and photos</h3><p>The readings each pool type needs are required before a report will send, and the app asks for a photo of the pool or equipment.</p></li>
                    <li><h3>GPS-stamped service reports</h3><p>The phone’s location is saved with every report the moment it’s sent.</p></li>
                    <li><h3>Chemical dosing calculator</h3><p>Works out each dose from the readings and the pool’s size, surface and sanitizer, even offline.</p></li>
                  </ul>
                  <p className="rp-more rp-more--left"><a href="/tech-app">See the technician app<ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" /></a></p>
                </div>
                <div className="pa-visual rp-phone" ref={phoneRef} dangerouslySetInnerHTML={{ __html: PN_PHONE_READINGS }} />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Mileage (grey). */}
        <section className="pa-section pa-grey" aria-labelledby="rp-miles-title">
          <div className="container">
            <div className="pa-inner">
              <div className="pa-split">
                <div className="pa-copy">
                  <Head
                    id="rp-miles-title"
                    eyebrow="Mileage"
                    a="Mileage tracked by GPS,"
                    b="stop to stop."
                    sub="On Vision, the tech’s phone measures the drive from each stop to the next, with supply runs kept separate. Export it with dates for your accountant."
                  />
                  <ul className="pa-checks" role="list">
                    {['Measured between service reports, not from home', 'Switched on per technician', 'Ready to export for taxes and bookkeeping'].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="pa-visual">
                  {/* Each address kept whole (no-break spaces): on a narrow card a trip wraps after its arrow. */}
                  <ListCard
                    label="Justin · Tuesday"
                    rows={[
                      { Icon: MapPin, t: '1182 Laurel Ct → 233 Oakmont Ln', value: '1.8 mi' },
                      { Icon: MapPin, t: '233 Oakmont Ln → 7700 Ridgeway Rd', value: '0.9 mi' },
                      { Icon: MapPin, t: '7700 Ridgeway Rd → 49 Harbor Cir', value: '2.6 mi' },
                      { Icon: MoveHorizontal, t: '12 more stops', value: '17.1 mi' },
                    ]}
                    foot={<><b>Total</b><span>22.4 mi</span></>}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Cost per visit (white). */}
        <section className="pa-section pa-white" aria-labelledby="rp-cost-title">
          <div className="container">
            <div className="pa-inner">
              <div className="pa-split pa-split--mirror">
                <div className="pa-copy">
                  <Head
                    id="rp-cost-title"
                    eyebrow="Cost per visit"
                    a="Know your cost per visit"
                    b="for every pool."
                    sub="The chemicals your techs log are priced at your own costs, so every customer’s page shows what a visit really costs you, and which pools are drifting up."
                  />
                  <ul className="pa-checks" role="list">
                    {['The latest visit, the average and the trend', 'By technician and by pool type on the dashboard', 'Spot the pools to re-price before they cost you'].map((t) => (
                      <li key={t}><Tick />{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="pa-visual">
                  <ListCard
                    label="Chemical cost per visit"
                    rows={[
                      { t: '3204 Coquina Ct', note: 'Salt · 15,000 gal', value: '$14.20' },
                      { t: '1402 Bayshore Blvd', note: 'Chlorine · 22,000 gal', value: '$22.75' },
                      { t: '957 Sunrise Dr', note: 'Chlorine · 12,000 gal', value: '$11.90' },
                      { t: '310 Bayview Ter', note: 'Salt · 18,000 gal', value: '$16.35' },
                    ]}
                    foot={<><span>Example figures, at your chemical prices.</span></>}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Import (grey): the homepage's import demo. */}
        <section className="pa-section pa-grey rp-import-band" aria-labelledby="rp-import-title">
          <div className="container">
            <div className="pa-inner">
              <Head
                center
                id="rp-import-title"
                eyebrow="Switching"
                a="Import your routes"
                b="from Skimmer, QuickBooks or a spreadsheet."
                sub="QuickBooks exports are recognized automatically. A Skimmer export or any spreadsheet works too: Poolnautics suggests a match for each column and you confirm it. Each customer’s technician, service day, stop order and frequency come over with them."
              />
              <div className="im-demo-slot rp-import">
                <ImportDemo />
              </div>
            </div>
          </div>
        </section>

        {/* 8. Handing over a route (dark): the homepage's handover card. */}
        <section className="pa-section pa-dark ra-section" aria-labelledby="rp-handover-title">
          <div className="container">
            <div className="pa-inner">
              <div className="pa-split">
                <div className="pa-copy">
                  <Head
                    id="rp-handover-title"
                    eyebrow="Route sales"
                    a="Buy, sell or hand over a route."
                    b="The customers move in minutes."
                    sub="Agree the sale however you like. Then send the customers to the buyer’s Poolnautics account with an 8-character code, and their stops arrive on the same day, order and frequency, ready to assign."
                  />
                </div>
                <div className="pa-visual">
                  <Handover />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ (light grey), stacked; its FAQPage data is in the <head>. */}
        <FaqSection
          id="route-faq"
          items={FAQ}
          title="Pool route software questions"
          subtitle={null}
          align="center"
          structuredData={false}
          headColors={false}
        />

        {/* 10. The closing call to action (dark). */}
        <section className="pa-section pa-dark pa-close" aria-labelledby="rp-close-title">
          <div className="container">
            <div className="pa-close-inner">
              <h2 id="rp-close-title" className="pa-h2 pa-close-title">Put your routes on one screen.</h2>
              <p className="pa-sub">Import your customers, set each stop once, and hand your techs an app that sends back proof of every visit.</p>
              <div className="pa-close-row">
                <PrimaryCta theme={theme} label={TRIAL_LABEL} />
                <a href="/pricing" className="pa-text-link">See pricing</a>
              </div>
              <p className="pa-close-fine">{TRIAL_FINE}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
