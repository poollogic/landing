import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/billing-page/billing-page.css';
import '../landing/import.css';
import '../landing/switch-page/switch-page.css';
import Nav from '../landing/Nav.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import ImportDemo from '../landing/ImportDemo.jsx';
import ImportCard from '../landing/ImportCard.jsx';
import { FOCUS, PrimaryCta } from '../landing/ai/shared.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref } from '../landing/onboarding.js';
import { Footer } from '../components/site-chrome.jsx';
import { SWITCH_PATH, SWITCH_TITLE, SWITCH_DESCRIPTION } from '../landing/switch-page/switchMeta.js';

// /switch-pool-service-software: switching to Poolnautics from other pool software, built from the approved
// reference (switching-page-reference.html, 2026-11-25): its copy, layout, colours, sizes and breakpoints
// (tablet up to 1020px, phone up to 720px). The hero is /pool-route-software's and /pool-service-billing's
// centred one (ai.css, billing-page.css) in a light theme, under the site's light nav, with the homepage's
// import demo (ImportDemo.jsx) under the copy: live, with this page's 612 customers. On phones the hero
// shows the compact import card (ImportCard.jsx) instead. Then the smart importer (white), two ways in (dark), what comes over (white), billing (grey),
// no lock-in (white), questions (grey) and the closing band (dark); their styles are switch-page.css
// (.sw-*). Other software is named only as a file source. Pre-rendered (entry-server.jsx), so no window
// or document while rendering.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}${SWITCH_PATH}`;

// The importer's file: 612 customers, the first eight A to Z (the fifth's last name is misspelt in the
// file and corrected by the demo's pointer; the second's type is changed to Vacation rental).
const IMPORT_COUNT = 612;
const IMPORT_TOTAL = '$92,412.00';
const IMPORT_ROWS = [
  { first: 'Aaron', last: 'Collins', street: '2148 Tramway Ln NE', city: 'Albuquerque' },
  { first: 'Abigail', last: 'Vega', street: '412 Loma Larga Rd', city: 'Corrales' },
  { first: 'Adam', last: 'Holloway', street: '8812 Osuna Rd NE', city: 'Albuquerque' },
  { first: 'Adriana', last: 'Raman', street: '2270 Cabezon Blvd', city: 'Rio Rancho' },
  { first: 'Alan', last: 'Castelano', street: '903 Montaño Rd NW', city: 'Albuquerque' },
  { first: 'Alex', last: 'Whitlock', street: '5120 Eubank Blvd NE', city: 'Albuquerque' },
  { first: 'Alicia', last: 'Ortega', street: '1409 Sara Rd SE', city: 'Rio Rancho' },
  { first: 'Allen', last: 'Kim', street: '77 Camino Del Sol', city: 'Corrales' },
];

const POINTS = [
  ['Matched for you', 'The importer reads your headings and lines them up with ours. Names like “Smith, Jane” and one-line addresses are split for you.'],
  ['Change any match', 'Every column shows which of yours it came from. Click its name to pick a different one, or leave it empty.'],
  ['Fix any cell', 'Click a cell to correct it. Emails that look mistyped are pointed out, and nothing is saved until you’ve reviewed it.'],
];

const WAYS = [
  ['Use the smart importer', 'Usually under 2 minutes', 'Upload the spreadsheet or export you already have. It matches your columns to ours, and you can change any match before you save.'],
  ['White-glove onboarding', 'Usually 1 business day', 'Send a spreadsheet, a PDF or a photo of your route sheet. We load your customers for you, free, and email you when they’re in.'],
];

const COMES = [
  ['Customers and contacts', 'Names, emails, phones and a second contact'],
  ['Service and billing addresses', 'Placed on the map as they import'],
  ['Pool and equipment details', 'Pool type and size, filter type, last clean dates'],
  ['Gate codes and technician notes', 'Technicians see them. Homeowners never do.'],
  ['Prices and billing cycles', 'Monthly, quarterly or yearly, with the next invoice date'],
  ['Routes', 'Technician, service day, stop order, weekly or every other week'],
];
const STAYS = [
  ['Saved cards', 'Card details can’t move between systems. One button emails your customers a link to save theirs again.'],
  ['Service history', 'Past visits and readings stay in your old system’s export.'],
  ['Balances', 'Collect what’s still owed where it was billed. Poolnautics bills from the date you choose.'],
];

const STEPS = [
  ['Today', 'Import your list', 'Your customers, routes and prices are in. Nothing is billed yet.'],
  ['When you’re ready', 'Turn on billing', 'Connect your own Stripe account and choose the first invoice date. Or choose “Don’t bill yet” and set it later.'],
  ['The date you chose', 'First invoices go out', 'From then on, each customer is invoiced on their own cycle. One button asks them to save a card for autopay.'],
];

const LOCK = [
  ['Export everything, any time', 'Every customer, route and billing detail downloads as a CSV, with no row limit.'],
  ['No contract', 'Pay monthly or yearly, and cancel when you like.'],
  ['Your Stripe account stays yours', 'Your customers and their saved cards live in your own Stripe account, not ours.'],
];

// The questions: shown in the Questions section and sent as FAQPage structured data (structuredData
// below, in the pre-rendered <head>), from this one list, so the two always match.
export const FAQ = [
  ['How long does it take to switch?', 'A typical customer list imports in a couple of minutes. If you’d rather send it to us, we load it for you, usually within one business day.'],
  ['What comes over when I import?', 'Customers and their contact details, service and billing addresses, pool and equipment details, price and billing cycle, and the next invoice date. Routes come over too: technician, service day, stop order, and weekly or every-other-week service. Service history, balances and saved cards don’t.'],
  ['What happens to my customers’ saved cards?', 'Card details can’t be moved from one system to another. Once you’ve connected Stripe, one button emails your customers a link to save a card or bank account for autopay. Each link works for 30 days.'],
  ['Do I have to stop using my old software first?', 'No. Import your list and check it. Nothing is billed until you’ve turned on billing and the first invoice date you chose arrives.'],
  ['My list is a mess. Does that matter?', 'No. Your columns can be named anything, and you can fix any cell before saving. If it’s a PDF or a photo of a route sheet, send it to us and we’ll load it.'],
  ['What does it cost to switch?', 'Nothing. Importing is free, having us load your list is free, and the trial is free for 30 days with no credit card.'],
];

// Structured data for the pre-rendered <head> (entry-server.jsx): the page (about the product,
// index.html's site-wide SoftwareApplication #software), where it sits, and the questions as shown.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: SWITCH_TITLE,
    description: SWITCH_DESCRIPTION,
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
      { '@type': 'ListItem', position: 2, name: 'Switch pool service software', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);
const Dash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 12h12" /></svg>
);
const Head = ({ id, eyebrow, title, lede }) => (
  <div className="sw-head">
    <p className="sw-eyebrow">{eyebrow}</p>
    <h2 id={id} className="sw-h2">{title}</h2>
    {lede && <p className="sw-lede">{lede}</p>}
  </div>
);
const Item = ({ title, note, no }) => (
  <li>
    <span className={`sw-ic${no ? ' sw-ic--no' : ''}`}>{no ? <Dash /> : <Tick />}</span>
    <span>{title}<small>{note}</small></span>
  </li>
);

export default function SwitchSoftwarePage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg ai-page billing-page switch-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav tone="light" overlay />
      <main>
        <div className="sw">
          {/* 1. Hero (light): the billing page's centred column, then the importer (phones: the import card). */}
          <section className="hero ai-hero bp-hero relative overflow-x-clip sw-hero2 is-lh" aria-labelledby="switch-hero-title">
            <div className="ai-hero-fade" aria-hidden="true" />
            <div className="container">
              <div className="bp-hero-stack">
                <div className="ai-hero-copy bp-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                  <HeroHeading
                    id="switch-hero-title"
                    eyebrow="Switching pool service software"
                    title={<><span className="bp-title-line">Switching to Poolnautics</span>{' '}<span className="bp-title-line">takes minutes, not weeks</span></>}
                  >
                    Coming from other pool software? Import your list yourself in minutes, or send it to us and our
                    white-glove onboarding team sets it up for you, free.
                  </HeroHeading>
                  <div className="ai-cta-row ai-cta-row--center">
                    <PrimaryCta theme={theme} label="Start your free trial" />
                    <a href="#comes-over" className={`ai-cta-ghost cta-secondary ${FOCUS}`}>See what comes over</a>
                  </div>
                  <p className="hero-fine">Free for 30 days · No card to start</p>
                </div>
                {/* No entrance animation here: from 1021px the visual is centred with a transform (switch-page.css),
                    which an animation's transform would replace. */}
                <div className="bp-hero-visual sw-hero-visual">
                  <div className="im-demo-slot sw-imp">
                    <ImportDemo count={IMPORT_COUNT} rows={IMPORT_ROWS} total={IMPORT_TOTAL} />
                  </div>
                  <ImportCard />
                </div>
              </div>
            </div>
          </section>

          {/* 2. The smart importer (white): three points. */}
          <section className="sw-sec sw-white" id="importer" aria-labelledby="sw-importer-title">
            <div className="container">
              <Head
                id="sw-importer-title"
                eyebrow="The smart importer"
                title={<>It matches your columns. <span className="sw-nb">You have the final say.</span></>}
                lede="Upload your file, check the matches, then save."
              />
              <ul className="sw-points">
                {POINTS.map(([t, p]) => <li key={t}><h3 className="sw-h3">{t}</h3><p className="sw-p">{p}</p></li>)}
              </ul>
            </div>
          </section>

          {/* 3. Two ways in (dark, a blue wash from the top right). */}
          <section className="sw-sec sw-dark sw-ways-sec" id="two-ways" aria-labelledby="sw-ways-title">
            <div className="container">
              <Head
                id="sw-ways-title"
                eyebrow="Two ways in"
                title="Two ways to import your pool service customers."
                lede="Import your list yourself with the smart importer, or send it to us and our white-glove onboarding team loads it for you."
              />
              <div className="sw-ways sw-ways--2">
                {WAYS.map(([k, n, p]) => (
                  <div key={k} className="sw-way"><p className="sw-way-k">{k}</p><p className="sw-way-n">{n}</p><p>{p}</p></div>
                ))}
              </div>
              <p className="sw-works">
                <span>The importer reads CSV, Excel, Numbers and Google Sheets files, and exports from QuickBooks, Jobber, Skimmer and Pool Brain. Up to 5,000 customers per file.</span>
                <span>Stuck on a file? Request help and our team texts you, usually within 1 business hour.</span>
              </p>
            </div>
          </section>

          {/* 4. What comes over (white): what comes with you, what stays behind. */}
          <section className="sw-sec sw-white" id="comes-over" aria-labelledby="sw-comes-title">
            <div className="container">
              <Head
                id="sw-comes-title"
                eyebrow="What comes over"
                title="Your customers, your routes and your prices come with you."
                lede="And here’s what doesn’t, so there are no surprises on day one."
              />
              <div className="sw-two">
                <div>
                  <h3 className="sw-h3">Comes with you</h3>
                  <ul className="sw-list">{COMES.map(([t, n]) => <Item key={t} title={t} note={n} />)}</ul>
                  <a className={`sw-more ${FOCUS}`} href="/pool-route-software">See how pool routes and scheduling work</a>
                </div>
                <div>
                  <h3 className="sw-h3">Stays behind</h3>
                  <ul className="sw-list">{STAYS.map(([t, n]) => <Item key={t} title={t} note={n} no />)}</ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Billing (grey): billing starts on the date you pick. */}
          <section className="sw-sec sw-tint" id="billing" aria-labelledby="sw-billing-title">
            <div className="container">
              <Head
                id="sw-billing-title"
                eyebrow="Billing"
                title="Billing starts on the date you pick."
                lede="Importing your customers doesn’t bill anyone. You decide when the first invoices go out."
              />
              <ol className="sw-steps">
                {STEPS.map(([when, t, p]) => (
                  <li key={t} className="sw-step"><small>{when}</small><h3 className="sw-h3">{t}</h3><p className="sw-p">{p}</p></li>
                ))}
              </ol>
              <p className="sw-more-row"><a className={`sw-more ${FOCUS}`} href="/pool-service-billing">See how pool service billing works</a></p>
            </div>
          </section>

          {/* 6. No lock-in (white). */}
          <section className="sw-sec sw-white sw-lock-sec" aria-labelledby="sw-lock-title">
            <div className="container">
              <Head
                id="sw-lock-title"
                eyebrow="No lock-in"
                title="Easy to join. Just as easy to leave."
                lede="You shouldn’t stay with software because leaving is hard."
              />
              <div className="sw-out">
                {LOCK.map(([t, p]) => <div key={t} className="sw-out-card"><h3>{t}</h3><p>{p}</p></div>)}
              </div>
              <p className="sw-more-row"><a className={`sw-more ${FOCUS}`} href="/guides/how-to-choose-pool-service-software">Read our guide to choosing pool service software</a></p>
            </div>
          </section>

          {/* 7. Questions (grey); their FAQPage data is in the <head>. */}
          <section className="sw-sec sw-tint" aria-labelledby="sw-faq-title">
            <div className="container">
              <Head id="sw-faq-title" eyebrow="Questions" title="Questions about switching pool software." />
              <div className="sw-faq">
                {FAQ.map(([q, a]) => <div key={q}><h3 className="sw-h3">{q}</h3><p>{a}</p></div>)}
              </div>
            </div>
          </section>

          {/* 8. Closing band (dark). */}
          <section className="sw-band" aria-labelledby="sw-band-title">
            <div className="container">
              <h2 id="sw-band-title" className="sw-h2">Bring the list you already have.</h2>
              <p className="sw-band-sub">Import it yourself in a couple of minutes, or send it to us and we’ll load it for you.</p>
              <div className="sw-band-row">
                <a className={`sw-cta ${FOCUS}`} href={ctaHref(theme)}>
                  Start your free trial
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <a className={`sw-link ${FOCUS}`} href="/pricing">See pricing</a>
              </div>
              <p className="sw-band-fine">Free for 30 days. No credit card.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
