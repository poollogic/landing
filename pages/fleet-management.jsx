import React from 'react';
import { Bell } from 'lucide-react';
import {
  FeaturePage, FeatureHero, HeroWordmark, FeatureSection, PhoneAndPoints, Points, Questions, ArrowLink, thousands,
} from '../landing/feature-page/FeaturePage.jsx';
// The phone's frame and the route screen are feature-page's copies of their rules (feature-phone.css,
// pn-phone-route.css): importing pn-phone.css would bundle it with the homepage's and
// /pool-route-software's CSS and change what those pages load.
import { FeaturePhone, RouteTop, Ic } from '../landing/feature-page/FeaturePhone.jsx';
import '../landing/technicians/pn-phone-checkin.css';
import '../landing/fleet-page/fleet-page.css';
import { TRIAL_DAYS } from '../aiFacts.js';
import { FLEET_TITLE, FLEET_DESCRIPTION } from '../landing/fleet-page/fleetMeta.js';
import {
  OIL_SOON_MILES, OIL_EVERY, TRUCKS, CHECKINS_DUE, OIL_SOON_COUNT, OIL_DUE_COUNT, milesLeft, oilState, oilProgress,
  TRACK_TRUCK, TRACK_CHANGED, TRACK_SOON, trackPct, PREVIOUS_READING, ROUTE_STOPS,
} from '../landing/fleet-page/fleetFacts.js';

// /pool-service-fleet-management: fleet management, built from the approved reference
// (fleet-page-reference.html, 2026-11-25): its layout, copy, demo data, colours, sizes and breakpoints
// (1020px: the hero stacks and the document cards go to one column; 720px: one column). The sibling of
// /pool-service-mileage-tracking: the two share landing/feature-page/ (FeaturePage.jsx, FeaturePhone.jsx,
// feature-page.css): the light nav, /ai-and-automations' light hero with the "Vision plan" tag row, the
// sections and their headings, the phone (.pn-phone) beside three points, the dark section's outlined
// cards, the questions, the AI page's dark trial band (TrialBand.jsx) and the footer. This page's own
// blocks: the Fleet card, the tech app's truck check-in in the phone (pn-phone-checkin.css, drawn from the
// app's TruckCheckinSheet), the oil change track, the document cards, "who drives what" and the link card
// to the mileage page (landing/fleet-page/fleet-page.css, .flt-*). Numbers: fleetFacts.js, the zones,
// bars and counts worked out from the mileages. No entrance animations or scroll effects. Pre-rendered
// (entry-server.jsx), so nothing here reads window or document while rendering.
// Sections: hero (light grey), truck check-ins (white), oil change reminders (grey), vehicle documents
// (dark), who drives what (white), the mileage page (grey), questions (white), the trial band (dark).

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/pool-service-fleet-management`;

// Structured data for the pre-rendered <head> (entry-server.jsx), as the other feature pages': the page
// (about the product, index.html's site-wide SoftwareApplication #software) and where it sits. No FAQPage.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: FLEET_TITLE,
    description: FLEET_DESCRIPTION,
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
      { '@type': 'ListItem', position: 2, name: 'Pool service fleet management', item: PAGE_URL },
    ],
  },
];

/* ---------- 1. Hero: the Fleet card ---------- */

/** Each truck's miles to its oil change, in words beside its bar (the bar itself is hidden from screen readers). */
const leftLabel = (t) => (milesLeft(t) > 0 ? `${thousands(milesLeft(t))} mi left` : 'Oil change due');

/** The app's Fleet overview: the counts, then every truck as a bar of how far through its oil change it is. */
function FleetCard() {
  return (
    <div className="flt-fo">
      <div className="flt-fo-head"><b>Fleet</b><span>{TRUCKS.length} trucks on file</span></div>
      <ul className="flt-fo-tiles">
        <li className="flt-fo-tile"><span>Check-ins due</span><b>{CHECKINS_DUE}</b></li>
        <li className="flt-fo-tile"><span>Oil changes soon</span><b>{OIL_SOON_COUNT}</b></li>
        <li className="flt-fo-tile"><span>Oil changes due</span><b>{OIL_DUE_COUNT}</b></li>
      </ul>
      <ul className="flt-fo-trucks">
        {TRUCKS.map((t) => {
          const state = oilState(t);
          const tone = state === 'ok' ? '' : ` flt-fo-left--${state}`;
          return (
            <li key={t.driver} className="flt-fo-truck">
              <div className="flt-fo-row">
                <b>{t.driver}<span>{t.truck}</span></b>
                <span className={`flt-fo-left${tone}`}>
                  {leftLabel(t)}
                  {/* The dark (soon) and red (due) badges, in words for screen readers. */}
                  {state === 'soon' && <span className="sr-only">, oil change soon</span>}
                </span>
              </div>
              <div className={`flt-fo-bar${state === 'ok' ? '' : ` flt-fo-bar--${state}`}`} aria-hidden="true">
                <i style={{ '--p': `${oilProgress(t)}%` }} />
              </div>
              <div className="flt-fo-sub">{thousands(t.odometer)} mi, checked in {t.checkedIn}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- 2. The phone: the tech app's truck check-in ---------- */

/** One reading on the check-in: its label and the last reading, the number as typed with "mi", the photo. */
function Reading({ label, aside, value, shot }) {
  return (
    <div className="pn-ci-reading">
      <div className="pn-ci-labels"><span>{label}</span><em>{aside}</em></div>
      <div className="pn-ci-row">
        <div className="pn-ci-field">{value}<i>mi</i></div>
        <div className="pn-ci-photo">
          {shot}
          <span className="pn-ci-remove"><Ic name="x" size={10} style={{ strokeWidth: 2.5 }} /></span>
        </div>
      </div>
    </div>
  );
}

/** Michael's check-in, as the tech app's sheet draws it over his finished route: the odometer and the next
 *  oil change typed, both photos taken, the note opened. A picture (hidden from screen readers). */
function CheckinPhone() {
  const t = TRACK_TRUCK;
  return (
    <FeaturePhone screen="pn-route pn-checkin">
      <RouteTop name={t.driver} done={ROUTE_STOPS} total={ROUTE_STOPS} />
      <div className="pn-ci-scrim" />
      <div className="pn-ci-sheet">
        <div className="pn-ci-card">
          <div className="pn-ci-head">
            <span className="pn-ci-icon"><Ic name="truck" size={22} style={{ strokeWidth: 1.5 }} /></span>
            <div className="pn-ci-names">
              <div className="pn-ci-title">Truck check-in</div>
              <div className="pn-ci-sub">{t.truck} · asked by your office</div>
            </div>
          </div>
          <p className="pn-ci-text">Next time you’re in the truck, read the odometer and the oil change sticker on the windshield.</p>
          <Reading
            label="Odometer"
            aside={`Last ${thousands(PREVIOUS_READING)} mi`}
            value={String(t.odometer)}
            shot={<span className="pn-ci-shot pn-ci-shot--odo"><span>{String(t.odometer).padStart(6, '0')}</span></span>}
          />
          <Reading
            label="Next oil change"
            aside={`Last ${thousands(t.oilDue)} mi`}
            value={String(t.oilDue)}
            shot={<span className="pn-ci-shot pn-ci-shot--sticker"><span>{thousands(t.oilDue)}</span></span>}
          />
          <div className="pn-ci-labels pn-ci-note"><span>Note to your office</span><em>Optional</em></div>
          <div className="pn-ci-area">Warning lights, damage, anything they should know</div>
          <div className="pn-ci-send"><Ic name="truck" size={16} />Send Mileage</div>
        </div>
        <div className="pn-ci-later">Later</div>
      </div>
    </FeaturePhone>
  );
}

const CHECKIN_POINTS = [
  ['On your schedule', 'Asked automatically', 'Every week, every two weeks or every month. Anyone whose last reading is that old is asked on a weekday morning.'],
  ['Never mid-route', 'It waits until the route is done', 'The notification holds until their route is finished, and nothing is sent between 8 PM and 7 AM.'],
  ['Any time', 'Ask one truck or all of them', 'Press Request for a single truck or Request from all. Each answer shows up as it comes in.'],
];

/* ---------- 3. The oil change track ---------- */

/** Michael's oil change, from the last change to 500 miles past due: blue, then dark for the last 500 miles,
 *  red past due, and the truck's mileage marked. Every position comes from the mileages (fleetFacts.js). */
function OilTrack() {
  const t = TRACK_TRUCK;
  const at = (miles) => `${trackPct(miles)}%`;
  const span = (from, to) => ({ '--a': at(from), '--b': at(to) });
  const state = oilState(t);
  const where = state === 'due'
    ? 'so its oil change is past due'
    : state === 'soon' ? `so it is inside the last ${OIL_SOON_MILES} miles` : `so it has ${thousands(milesLeft(t))} miles to go`;
  return (
    <div className="flt-ot">
      <div className="flt-ot-head">
        <b>{t.driver}<span>{t.truck}</span></b>
        <em>Oil changed every {thousands(OIL_EVERY)} miles, {thousands(milesLeft(t))} miles left</em>
      </div>
      <div className="flt-ot-wrap">
        <span className="flt-ot-pin" style={{ '--at': at(t.odometer) }} aria-hidden="true">{thousands(t.odometer)} mi</span>
        <div
          className="flt-ot-track"
          role="img"
          aria-label={`The truck is at ${thousands(t.odometer)} miles. Its oil was last changed at ${thousands(TRACK_CHANGED)} and is due at ${thousands(t.oilDue)}, ${where}.`}
        >
          <i className="flt-ot-z-soon" style={span(TRACK_SOON, t.oilDue)} />
          <i className="flt-ot-z-late" style={span(t.oilDue, Infinity)} />
          <i className="flt-ot-fill" style={span(TRACK_CHANGED, Math.min(t.odometer, TRACK_SOON))} />
          {t.odometer > TRACK_SOON && <i className="flt-ot-fill flt-ot-fill--soon" style={span(TRACK_SOON, Math.min(t.odometer, t.oilDue))} />}
          {t.odometer > t.oilDue && <i className="flt-ot-fill flt-ot-fill--late" style={span(t.oilDue, t.odometer)} />}
        </div>
        <div className="flt-ot-scale" aria-hidden="true">
          <span className="flt-ot-s0" style={{ '--at': at(TRACK_CHANGED) }}>{thousands(TRACK_CHANGED)} changed</span>
          <span className="flt-ot-s1" style={{ '--at': at(TRACK_SOON) }}>{thousands(TRACK_SOON)}</span>
          <span className="flt-ot-s2" style={{ '--at': at(t.oilDue) }}>{thousands(t.oilDue)} due</span>
        </div>
      </div>
      <ol className="flt-ot-legend">
        <li><h3 style={{ '--c': '#2e85ff' }}>After each change</h3><p>Mark oil changed, and the next one is set from the mileage it was changed at.</p></li>
        <li><h3 style={{ '--c': '#0e1117' }}>{OIL_SOON_MILES} miles out</h3><p>Your bell rings and the tech’s phone gets a reminder, once per oil change.</p></li>
        <li><h3 style={{ '--c': '#dc2626' }}>Past due</h3><p>If a check-in shows it still hasn’t been done, your bell rings once more.</p></li>
      </ol>
    </div>
  );
}

/* ---------- 4. Vehicle documents; 5. Who drives what; 7. Questions ---------- */

const DOCS = [
  {
    title: 'Plate expiry',
    body: 'Enter the month on the registration sticker, from the office or the tech’s phone.',
    when: 'You’re reminded',
    chips: ['30 days before', '7 days before', 'On the day'],
    points: ['Sent to your bell and the tech’s phone', 'Shows “Plate expired” in red once it lapses'],
  },
  {
    title: 'Insurance card',
    body: 'Upload a photo or PDF of the card with the date it ends.',
    when: 'You’re reminded',
    chips: ['30 days before', '7 days before'],
    points: ['The tech’s phone keeps a copy, even with no signal', 'One card can cover every truck on a fleet policy'],
  },
  {
    title: 'Registration photo',
    body: 'Add a photo of the registration from the office or the phone.',
    chips: ['Optional'],
    points: ['Shown whole, so its dates and numbers can be read'],
  },
];

const DRIVES = [
  ['Company truck', 'Asked for check-ins, reminded about oil changes, and asked for truck info.', 'Check-ins and reminders'],
  ['Own vehicle', 'Their miles are kept separate from the company’s trucks.', null],
  ['Subcontractor', 'Their miles are kept separate as a subcontractor’s.', null],
  ['Doesn’t drive', 'Nothing is tracked.', null],
];

const DRIVE_POINTS = [
  ['Trucks added from the phone', 'Each tech adds their own truck in the app: make, model, plate, mileage and when the oil change is due.'],
  ['Require truck info before a route', 'Switch it on and a tech in a company truck can’t start their route until the make, model, plate and plate expiry are in. You can unlock anyone for the day.'],
];

const QUESTIONS = [
  ['Which plan includes fleet management?', `Fleet management is part of the Vision plan. Every feature is included in your ${TRIAL_DAYS}-day trial, so you can try it before you choose a plan.`],
  ['Will a check-in interrupt a tech on their route?', 'No. The notification waits until their route is done, and nothing is sent between 8 PM and 7 AM.'],
  ['What if a tech doesn’t answer?', 'They’re asked once more that day when their route is done. If a check-in goes unanswered for 3 days, your bell tells you.'],
  ['What about techs who use their own vehicle?', 'Set what they drive to Own vehicle and they’re never asked for check-ins or oil changes.'],
  ['How do you know when an oil change is due?', 'From the tech’s latest check-in, where they read the oil change sticker, and from how often you’ve set that truck’s oil to be changed.'],
];

/* ---------- The page ---------- */

export default function FleetManagementPage() {
  const t = TRACK_TRUCK;
  return (
    <FeaturePage className="fleet-page" current="/pool-service-fleet-management">
      {/* 1. Hero (light grey): /ai-and-automations' light hero; the Fleet card on the right. The h1 is four
          spans, one line each on a phone. */}
      <FeatureHero
        id="flt-hero-title"
        title={<><span className="flt-hl">Pool Service </span><span className="flt-hl">Fleet Management </span><span className="flt-hl">That Keeps Itself </span><span className="flt-hl">Up to Date</span></>}
        visual={<FleetCard />}
      >
        The <HeroWordmark /> tech app asks each tech for their odometer and oil change sticker on your schedule. You
        see every truck’s mileage, oil change and paperwork in one place.
      </FeatureHero>

      {/* 2. Truck check-ins (white): the phone, then the three points. */}
      <FeatureSection
        tone="white"
        id="flt-checkins-title"
        eyebrow="Truck check-ins"
        title="One check-in keeps every truck current."
        sub="The tech enters the odometer and snaps the oil change sticker. That one reading updates the truck’s mileage and when its next oil change is due."
      >
        <PhoneAndPoints phone={<CheckinPhone />} points={CHECKIN_POINTS} />
      </FeatureSection>

      {/* 3. Oil change reminders (light grey): the track, then a sample of the office's notice. */}
      <FeatureSection
        tone="tint"
        id="flt-oil-title"
        eyebrow="Oil change reminders"
        title="Every oil change caught before it’s late."
        sub="Set how often each truck’s oil is changed. Check‑ins do the rest."
      >
        <OilTrack />
        {/* The bell's notice when a check-in comes in; its second line is the product's own wording. */}
        <div className="flt-notice">
          <span className="flt-bell" aria-hidden="true"><Bell size={18} strokeWidth={2} /></span>
          <div>
            <b>{t.driver} checked in his truck</b>
            <p>{t.truck} at {thousands(t.odometer)} mi. Oil change due at {thousands(t.oilDue)} mi.</p>
          </div>
        </div>
      </FeatureSection>

      {/* 4. Vehicle documents (dark): the page's one dark section before the trial band. */}
      <FeatureSection
        tone="dark"
        id="flt-docs-title"
        eyebrow="Vehicle documents"
        title="Plates, insurance and registration, with the dates watched."
        sub="Keep each truck’s paperwork with the truck, and hear about an expiry before it happens."
      >
        <ul className="flt-docs">
          {DOCS.map((d) => (
            <li key={d.title} className="fp-x-card">
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              <div className="flt-when">
                {d.when && <b>{d.when}</b>}
                <ul className="flt-chips">{d.chips.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
              <ul className="flt-doc-points">{d.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </li>
          ))}
        </ul>
      </FeatureSection>

      {/* 5. Who drives what (white): the four settings, then two points. */}
      <FeatureSection
        tone="white"
        id="flt-drives-title"
        eyebrow="Who drives what"
        title="Only the people in company trucks are asked."
        sub="One setting per technician decides who gets check-ins and reminders, and sorts their miles for your accountant."
      >
        <ul className="flt-drives">
          {DRIVES.map(([name, body, yes]) => (
            <li key={name} className="flt-drive">
              <b>{name}</b>
              <p>{body}</p>
              <span className={`flt-tag ${yes ? 'flt-tag--yes' : 'flt-tag--no'}`}>{yes ?? 'Never asked'}</span>
            </li>
          ))}
        </ul>
        <Points items={DRIVE_POINTS} className="flt-two" />
      </FeatureSection>

      {/* 6. The mileage page (light grey): a link card; its h2 names the section. */}
      <FeatureSection tone="tint" id="flt-mileage-title">
        <div className="flt-band">
          <div>
            <h2 id="flt-mileage-title">The same app logs every mile.</h2>
            <p>GPS measures the miles between stops and leaves the commute out, so the odometer photos and the mileage log back each other up.</p>
          </div>
          <ArrowLink href="/pool-service-mileage-tracking">See mileage tracking</ArrowLink>
        </div>
      </FeatureSection>

      {/* 7. Questions (white): plain headings, no FAQ structured data. */}
      <FeatureSection tone="white" id="flt-faq-title" eyebrow="Questions" title="Pool service fleet management questions.">
        <Questions items={QUESTIONS} />
      </FeatureSection>

      {/* 8. The closing trial band (dark): FeaturePage adds /ai-and-automations' TrialBand. */}
    </FeaturePage>
  );
}
