import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/tech-app.css';
import Nav from '../landing/Nav.jsx';
import { PrimaryCta, Ticks, header, headerLight } from '../landing/ai/shared.jsx';
import AppStoreBadge, { APP_STORE_ID, APP_STORE_URL } from '../landing/AppStoreBadge.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';

// /tech-app: the technician app in depth. On the homepage's and /ai-and-automations' design: the same
// dark nav (landing/Nav.jsx), the AI page's dark hero (.ai-hero, with the glow instead of its beam),
// its section bands (.ai-band: white and light grey in turn, a dark band for the day on the truck),
// section labels, light cards (.ai-light-card), dark cards (.ai-pillar), tick lists and closing
// call to action, from ai.css and landing/ai/shared.jsx. Only this page's layouts live in
// landing/tech-app.css. The phone mockups below are drawn inline, in the site's font and blue.
// Pre-rendered (entry-server.jsx), so no window or document while rendering.

const FEATURES = [
  {
    index: '01',
    eyebrow: 'Required fields',
    title: 'Reports can’t go out half-empty',
    body: 'Chlorine, pH, CYA, alkalinity, hardness and water temperature are required on every report, and the tech can’t submit until they’re in. Leave off the photo and the app makes them confirm it first. The “you didn’t even service my pool” calls stop.',
    bullets: [
      'Readings required on every report, across the fleet',
      'No photo takes a deliberate confirm, never an accident',
      'Out-of-range readings are re-tested before any dose is suggested',
    ],
    visual: () => <RequiredFieldsMock />,
  },
  {
    index: '02',
    eyebrow: 'Smart subject lines',
    title: 'The subject line tells the truth before the customer opens it',
    body: 'When the tech reports low water, shocks the pool, replaces the filter or cleans the salt cell, the report’s subject line says so. Customers see what happened at a glance instead of digging through the email.',
    bullets: [
      'Set by what the tech reported, never typed by hand',
      'Low water, a shock, a new filter, a cleaned salt cell',
      'Sent the moment the report is submitted',
    ],
    visual: () => <InboxMock />,
  },
  {
    index: '03',
    eyebrow: 'Pool profile',
    title: 'One setup. The app does the math forever',
    body: 'Filter type, pool size, baseline pressure and salt or chlorine are stored once on the pool profile. From then on, doses are sized to that pool and every pressure reading is checked against its baseline, based on what’s actually in the water and what’s actually installed.',
    bullets: [
      'Live LSI as readings go in, for the techs you turn it on for',
      'Chemical doses sized to the pool',
      'Filter pressure tracked against the baseline',
    ],
    visual: () => <ProfileMock />,
  },
  {
    index: '04',
    eyebrow: 'Pressure alerts',
    title: 'The tech sees it at +8 PSI, while they’re still at the pool',
    body: 'Once a pool’s baseline filter pressure is recorded, the app checks every reading against it. More than 8 PSI over baseline and the reading is marked High on the report screen, so the filter gets dealt with before it turns into a call.',
    bullets: [
      'Checked against each pool’s own baseline',
      'Logged to service history automatically',
      'High readings stand out in the office’s service audit',
    ],
    visual: () => <PressureAlertMock />,
  },
  {
    index: '05',
    eyebrow: 'Filter cleanings',
    title: 'Logged automatically. Shown on the customer’s report',
    body: 'When a tech marks a filter cleaned, it’s added to that pool’s history and shown on the customer’s service report, without anyone typing “I cleaned the filter” into a notes field. They see what they paid for; you stop fielding calls about it.',
    bullets: [
      'Marked on the report, with a confirm so it’s never by accident',
      'Appears on the report as a line item',
      'The pool’s last cleaning date updates itself',
    ],
    visual: () => <FilterCleaningMock />,
  },
];

const PROBLEMS = [
  'Tech submits a report with no chlorine reading',
  'Filter pressure creeps up for weeks unnoticed',
  'Customer calls because “I don’t see anything in the email”',
];

const STEPS = [
  ['Arrive', 'Tap the stop and start the report. The pool’s profile is right there, and the dose calculator is set to its size.'],
  ['Log', 'Enter the readings. Each one is checked against your ranges as it goes in.'],
  ['Service', 'The app suggests doses. Filter cleanings are marked with a confirm. Pressure is checked against the pool’s baseline.'],
  ['Submit', 'Submit the report. It’s emailed to the customer under your company’s name, and the stop is closed.'],
];

const RELIABILITY = [
  ['Offline-first', 'Submit reports with no signal. They send once the app is open with signal again.'],
  ['Low spec friendly', 'Runs on iPhones with iOS 15.1 or later. Android coming soon.'],
  ['No double entry', 'The same data the office sees, written once, by the person who saw the pool.'],
];

// Structured data, in the pre-rendered page's <head> (entry-server.jsx): the technician app on the App
// Store (free, iOS 15.1 or later, as its listing says), published by Poolnautics (index.html's Organization).
const ORIGIN = 'https://getpoolnautics.com';
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    '@id': `${ORIGIN}/tech-app#app`,
    name: 'Poolnautics',
    description: 'The field app for pool service technicians: the day’s route, service reports with readings, chemicals and photos, and work orders, working offline. Technicians sign in with an invite from their pool service company.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'iOS 15.1 or later',
    downloadUrl: APP_STORE_URL,
    sameAs: APP_STORE_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${ORIGIN}/#organization` },
    url: `${ORIGIN}/tech-app`,
  },
];
// Safari on iPhone: Apple's "Open in the App Store" banner, on this page only (entry-server.jsx).
export const appBanner = `<meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}">`;

const TechAppPage = () => {
  const theme = usePreviewTheme();
  return (
    <div className="mktg ai-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav current="/tech-app" />
      <main>
        {/* Hero: the AI page's, with the phone where its chat window is. */}
        <section className="hero ai-hero ai-hero--glow relative overflow-x-clip" aria-labelledby="tech-hero-title">
          <div className="container">
            <div className="ai-hero-grid">
              <div className="ai-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <HeroHeading id="tech-hero-title" eyebrow="The technician app" title="The pool service technician app, built for the truck">
                  Most pool software hands the tech a form and hopes for the best. The Poolnautics app enforces what
                  matters, calculates what’s tedious and flags what’s drifting, so a new hire runs the route like a
                  ten-year vet, and the report writes itself.
                </HeroHeading>
                <div className="ai-cta-row">
                  <PrimaryCta theme={theme} />
                  <AppStoreBadge height={48} priority />
                </div>
                <p className="hero-fine">The {TRIAL_DAYS}-day trial includes all of it.</p>
              </div>
              <div className="ai-hero-visual tk-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <Phone>
                  <RequiredFieldsScreen />
                </Phone>
              </div>
            </div>
          </div>
        </section>

        {/* What goes wrong without it: one light card on white. */}
        <section className="ai-light bg-white tk-problems-band" data-theme="light" aria-label="What goes wrong without it">
          <div className="container">
            <div className="ai-light-card tk-problems">
              <p className="section-eyebrow ai-eyebrow tk-problems-label">What goes wrong without it</p>
              <ol className="tk-problems-list">
                {PROBLEMS.map((t, i) => (
                  <li key={t}><span className="tk-problems-n" aria-hidden="true">0{i + 1}</span><span>{t}</span></li>
                ))}
              </ol>
              <p className="tk-problems-fixed">Fixed below <span aria-hidden="true">↓</span></p>
            </div>
          </div>
        </section>

        {/* The five features, light grey and white in turn, the copy and the phone swapping sides. */}
        {FEATURES.map((f, i) => (
          <section
            key={f.index}
            id={`feature-${f.index}`}
            className={`section ai-band ai-light ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
            data-theme="light"
            aria-labelledby={`feature-${f.index}-heading`}
          >
            <div className="container">
              <div className={`ai-split ai-split--even${i % 2 === 1 ? ' ai-split--reverse' : ''}`}>
                <div>
                  {headerLight({
                    align: 'left',
                    id: `feature-${f.index}-heading`,
                    eyebrow: <><span className="ai-eyebrow-n">{f.index}</span>{f.eyebrow}</>,
                    title: f.title,
                    subtitle: f.body,
                    className: 'mb-0',
                  })}
                  <Ticks items={f.bullets} className="tk-ticks" />
                </div>
                <div className="tk-visual">{f.visual()}</div>
              </div>
            </div>
          </section>
        ))}

        {/* A day on the truck: a dark band, with dark cards. */}
        <section id="day-on-the-truck" className="section ai-band-dark bg-mktg-page" aria-labelledby="day-heading">
          <div className="container">
            {header({
              id: 'day-heading',
              title: 'A day on the truck',
              subtitle: 'From pulling into the driveway to the report landing in the customer’s inbox.',
              className: 'mb-0',
            })}
            <ol className="ai-pillars" role="list">
              {STEPS.map(([step, body], i) => (
                <li key={step}>
                  <div className="ai-pillar">
                    <p className="ai-pillar-step">Step 0{i + 1}</p>
                    <h3>{step}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Reliability: one light card on white. */}
        <section className="section ai-band ai-light bg-white" data-theme="light" aria-labelledby="reliability-heading">
          <div className="container">
            <div className="ai-light-card tk-reliability">
              {headerLight({
                align: 'left',
                id: 'reliability-heading',
                title: 'Built to keep working when the bars drop',
                subtitle: 'The truck app keeps your route on the phone and stores every report until it can send it. It works on the cheap phone your seasonal hire bought at Walmart.',
                className: 'mb-0',
              })}
              <ul className="tk-reliability-list">
                {RELIABILITY.map(([k, v]) => (
                  <li key={k}><h3>{k}</h3><p>{v}</p></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Closing call to action: the AI page's. */}
        <section className="section ai-close" aria-labelledby="close-heading">
          <div className="container">
            {header({
              id: 'close-heading',
              title: 'Put it in front of a tech today',
              subtitle: 'Import your real routes. Your techs download the Poolnautics app and sign in the moment your account is live.',
              className: 'mb-0',
            })}
            <div className="ai-cta-row ai-cta-row--center">
              <PrimaryCta theme={theme} />
              <AppStoreBadge height={48} />
            </div>
            <p className="hero-fine tk-close-fine">The {TRIAL_DAYS}-day trial includes all of it.</p>
            {/* The office side of the route: building it, recurring stops, mileage, cost per visit. */}
            <p className="tk-close-more"><a href="/pool-route-software">See how routes are built and scheduled</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TechAppPage;

// ───────── visuals: phone frame + screens ─────────

const Phone = ({ children }) => (
  <div style={{
    width: 290, padding: 12,
    background: 'linear-gradient(180deg, #1f242b 0%, #0f1217 100%)',
    borderRadius: 38,
    boxShadow: '0 30px 60px -30px rgba(15, 23, 42, .35), 0 0 0 1px rgba(255,255,255,.04) inset',
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
      width: 80, height: 18, background: '#0c1015', borderRadius: 12, zIndex: 2,
    }} />
    <div style={{
      background: '#fff',
      borderRadius: 28,
      overflow: 'hidden',
      minHeight: 540,
      position: 'relative',
      fontFamily: 'inherit',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px 0',
        fontSize: 11, color: '#52525b', fontFamily: 'inherit',
      }}>
        <span>9:42</span>
        <span style={{ display: 'flex', gap: 6, opacity: 0.6 }}>
          <span>●●●</span><span>●●</span>
        </span>
      </div>
      <div style={{ padding: '14px 18px 24px' }}>
        {children}
      </div>
    </div>
  </div>
);

const ScreenHeader = ({ kicker, title, time }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{
        fontSize: 10.5, fontFamily: 'inherit',
        textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', fontWeight: 500,
      }}>{kicker}</div>
      {time && <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: 'inherit' }}>{time}</div>}
    </div>
    <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: '#09090b', letterSpacing: '-0.015em' }}>{title}</div>
  </div>
);

// — screen: required fields —

const RequiredFieldsScreen = () => (
  <>
    <ScreenHeader kicker="Stop 04 of 14" title="1402 Bayshore Blvd" time="9:42" />
    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        ['pH', '7.4', true],
        ['Chlorine', '2.8', true],
        ['CYA', '—', false],
        ['Photo of pool', 'Tap to add', false],
        ['Filter pressure', '14 psi', true],
      ].map(([label, value, ok], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px',
          background: ok ? '#fbfbfc' : 'color-mix(in oklab, var(--brand-blue) 8%, white)',
          border: `1px solid ${ok ? '#f1f1f3' : 'color-mix(in oklab, var(--brand-blue) 32%, transparent)'}`,
          borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 11.5, color: '#a1a1aa', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, color: ok ? '#09090b' : 'color-mix(in oklab, var(--brand-blue) 80%, black)' }}>{value}</div>
          </div>
          {ok
            ? <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600, fontFamily: 'inherit' }}>✓</span>
            : <span style={{ fontSize: 9.5, color: 'var(--brand-blue)', fontWeight: 600, fontFamily: 'inherit', letterSpacing: '0.1em' }}>REQUIRED</span>}
        </div>
      ))}
    </div>
    <button disabled style={{
      marginTop: 16, width: '100%',
      padding: '12px 14px',
      background: '#e4e4e7', color: '#a1a1aa',
      border: 0, borderRadius: 10,
      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
    }}>Submit (2 fields missing)</button>
  </>
);

const RequiredFieldsMock = () => <Phone><RequiredFieldsScreen /></Phone>;

// — screen: inbox / smart subject —

const InboxMock = () => (
  <Phone>
    <ScreenHeader kicker="Inbox preview" title="What the customer sees" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
      {[
        { from: 'Poolnautics', subj: '⚠ Water level low · 3204 Coquina Ct', time: '4:42p', highlight: true },
        { from: 'Poolnautics', subj: 'Service complete · 1402 Bayshore Blvd', time: 'Mon' },
        { from: 'Poolnautics', subj: 'Filter cleaning logged · 3204 Coquina Ct', time: 'Mon' },
        { from: 'Poolnautics', subj: 'Service complete · 614 S Rome Ave', time: 'Sun' },
      ].map((m, i) => (
        <div key={i} style={{
          padding: '11px 12px',
          borderRadius: 10,
          background: m.highlight ? 'color-mix(in oklab, var(--brand-blue) 6%, white)' : '#fbfbfc',
          border: `1px solid ${m.highlight ? 'color-mix(in oklab, var(--brand-blue) 26%, transparent)' : '#f1f1f3'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa', fontFamily: 'inherit' }}>
            <span style={{ color: m.highlight ? 'var(--brand-blue)' : '#71717a', fontWeight: 600 }}>{m.from}</span>
            <span>{m.time}</span>
          </div>
          <div style={{
            fontSize: 13, marginTop: 4,
            fontWeight: m.highlight ? 600 : 500,
            color: m.highlight ? 'color-mix(in oklab, var(--brand-blue) 80%, black)' : '#18181b',
            lineHeight: 1.35,
          }}>{m.subj}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 14, fontSize: 10.5, color: '#a1a1aa', fontFamily: 'inherit', textAlign: 'center' }}>
      Subject auto-flagged from reading
    </div>
  </Phone>
);

// — screen: pool profile + LSI —

const ProfileMock = () => (
  <Phone>
    <ScreenHeader kicker="Pool profile" title="3204 Coquina Ct" />
    <div style={{
      padding: 12, background: '#fbfbfc', border: '1px solid #f1f1f3', borderRadius: 10,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11.5,
    }}>
      {[
        ['Pool size', '18,400 gal'],
        ['Surface', 'Pebble Tec'],
        ['Filter', 'Cartridge'],
        ['Baseline psi', '12 psi'],
        ['Sanitizer', 'Saltwater'],
        ['Heater', 'Gas · 400k BTU'],
      ].map(([k, v]) => (
        <div key={k}>
          <div style={{ fontFamily: 'inherit', fontSize: 9.5, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#18181b', marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{
      marginTop: 12,
      padding: 12,
      background: 'color-mix(in oklab, var(--brand-blue) 5%, white)',
      border: '1px solid color-mix(in oklab, var(--brand-blue) 20%, transparent)',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: 'inherit', fontSize: 10, color: 'var(--brand-blue)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live LSI</div>
        <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: 'inherit' }}>Recalculating</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#09090b', fontVariantNumeric: 'tabular-nums' }}>−0.12</span>
        <span style={{ fontSize: 11, color: '#71717a', fontWeight: 500 }}>Balanced</span>
      </div>
    </div>
    <div style={{
      marginTop: 10, padding: 12, background: '#fbfbfc', border: '1px solid #f1f1f3', borderRadius: 10,
    }}>
      <div style={{ fontFamily: 'inherit', fontSize: 9.5, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggested dose</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#18181b', marginTop: 4 }}>4 oz muriatic acid · raises alk balance</div>
    </div>
  </Phone>
);

// — screen: pressure alert —

const PressureAlertMock = () => (
  <Phone>
    <ScreenHeader kicker="Stop 07 of 14" title="907 S Boulevard" time="10:31" />
    <div style={{
      padding: 14, borderRadius: 12,
      background: 'color-mix(in oklab, var(--brand-blue) 10%, white)',
      border: '1px solid color-mix(in oklab, var(--brand-blue) 36%, transparent)',
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <span style={{
        flexShrink: 0, width: 9, height: 9, borderRadius: '50%',
        background: 'var(--brand-blue)',
        boxShadow: '0 0 0 5px color-mix(in oklab, var(--brand-blue) 18%, transparent)',
        marginTop: 4,
      }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#09090b' }}>Filter pressure +8.4 PSI over baseline</div>
        <div style={{ fontSize: 11.5, color: '#3f3f46', marginTop: 4, lineHeight: 1.45 }}>
          Baseline 12 psi · reading 20.4 psi. Recommend cleaning before next visit.
        </div>
      </div>
    </div>
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        ['Log cleaning now', true],
        ['Schedule for next visit', false],
        ['Acknowledge — already cleaned', false],
      ].map(([label, primary], i) => (
        <button key={i} style={{
          padding: '11px 14px',
          background: primary ? 'var(--brand-blue)' : '#fff',
          color: primary ? '#fff' : '#18181b',
          border: `1px solid ${primary ? 'var(--brand-blue)' : '#e4e4e7'}`,
          borderRadius: 10,
          fontSize: 13, fontWeight: 500, textAlign: 'left',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}>{label}</button>
      ))}
    </div>
    <div style={{
      marginTop: 14, padding: 10, borderRadius: 10, background: '#fbfbfc', border: '1px solid #f1f1f3',
      fontSize: 11, color: '#71717a', fontFamily: 'inherit',
    }}>
      Pressure history: 12 · 12 · 13 · 15 · 20.4
    </div>
  </Phone>
);

// — screen: filter cleaning logged + on report —

const FilterCleaningMock = () => (
  <Phone>
    <ScreenHeader kicker="Service report" title="3204 Coquina Ct" />
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: 'color-mix(in oklab, var(--brand-blue) 6%, white)',
      border: '1px solid color-mix(in oklab, var(--brand-blue) 22%, transparent)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--brand-blue)',
        color: '#fff', fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✓</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#09090b' }}>Filter cleaning logged</div>
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 1, fontFamily: 'inherit' }}>Auto-added to service report</div>
      </div>
    </div>
    <div style={{
      marginTop: 14, padding: 14, borderRadius: 10,
      background: '#fbfbfc', border: '1px solid #f1f1f3',
    }}>
      <div style={{ fontFamily: 'inherit', fontSize: 9.5, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What the customer sees</div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
        {[
          ['Skim & brush', '✓'],
          ['Vacuum', '✓'],
          ['Chemistry check', '✓'],
          ['Filter cleaning', '✓'],
          ['Stabilizer added (1 lb)', '✓'],
        ].map(([k, v], i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '5px 0',
          }}>
            <span style={{ color: '#3f3f46' }}>{k}</span>
            <span style={{ color: 'var(--brand-blue)', fontFamily: 'inherit', fontSize: 11, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{
      marginTop: 12, padding: 10, borderRadius: 10, background: '#fbfbfc', border: '1px solid #f1f1f3',
      fontSize: 11, color: '#71717a', lineHeight: 1.45,
    }}>
      <span style={{ color: '#3f3f46', fontWeight: 600 }}>Pool history</span> &nbsp;Filter cleaned 6 times in last 12 months.
    </div>
  </Phone>
);
