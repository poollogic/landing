import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/guides/guide.css';
import Nav from '../landing/Nav.jsx';
import GuideToc from '../landing/guides/GuideToc.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref } from '../landing/onboarding.js';
import { TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';
import { START_GUIDE_PATH, START_GUIDE_DESCRIPTION, START_GUIDE_H1, START_GUIDE_LEDE } from '../landing/guides/startBusinessMeta.js';

// /guides/how-to-start-a-pool-cleaning-business: the second guide, built from the owner's content
// reference (start-pool-business-guide.html, 2026-11-27): its copy, order, links, demo numbers and
// component choices, on the first guide's template (pages/guide-raise-prices.jsx, landing/guides/guide.css).
// One h1, an h2 per part. The route income calculator is the first guide's break-even calculator with
// three outputs; the contents list's current part is GuideToc.jsx; the checklist is the first guide's
// (ticks aren't saved, so the reference's "Your progress is saved on this device." is left out, as the
// brief says). Everything is in the pre-rendered markup, the calculator showing its default result.
// Structured data as the first guide: Article and BreadcrumbList, no FAQPage (Part 9 is a plain list).

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}${START_GUIDE_PATH}`;

// Its image (the share image) is added in entry-server.jsx from ROUTE_META, where the PNG's path lives.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${PAGE_URL}#article`,
    headline: START_GUIDE_H1,
    description: START_GUIDE_DESCRIPTION,
    url: PAGE_URL,
    mainEntityOfPage: PAGE_URL,
    inLanguage: 'en-US',
    publisher: { '@id': `${ORIGIN}/#organization` },
    isPartOf: { '@id': `${ORIGIN}/#website` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${ORIGIN}/guides` },
      { '@type': 'ListItem', position: 3, name: 'How to start a pool cleaning business', item: PAGE_URL },
    ],
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ---------- Hero ---------- */

// One icon each, from the first guide's set: a price tag (costs), its calculator, its checklist box.
const SHORTCUTS = [
  ['costs', 'Startup cost breakdown', <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r="1" /></>],
  ['calc', 'Route income calculator', <><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></>],
  ['checklist', 'Launch checklist', <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8.5 12.2l2.4 2.4 4.6-5" /></>],
];

function HeroRoute() {
  return (
    <div className="gd-vis" role="img" aria-label="An example 50-pool route billing $8,000 a month, with $3,250 in chemicals, fuel and truck costs, leaving $4,750. Typical startup budget: $2,000 to $15,000.">
      <div className="gd-vis-card">
        <span className="gd-vis-k">Example: a 50-pool route, per month</span>
        <div className="gd-vis-r"><span>Billing</span><b>$8,000</b></div>
        <div className="gd-vis-r is-credit"><span>Chemicals, fuel and truck</span><b>−$3,250</b></div>
        <div className="gd-vis-r is-total"><span>Left for you</span><b>$4,750</b></div>
      </div>
      <div className="gd-vis-next">
        <span className="gd-vis-k">To get started</span>
        <div className="gd-vis-r"><span>Budget</span><b>$2k–$15k</b></div>
        <small>Most of the spread is the truck.</small>
      </div>
    </div>
  );
}

/* ---------- Part 5: the route income calculator ---------- */

/** 1500 → "1,500" (no Intl, so the server and the browser always write the same thing). */
const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** Whole dollars; a loss (costs above the price) reads "−$650". */
const money = (n) => {
  const d = Math.round(n);
  return `${d < 0 ? '−' : ''}$${thousands(Math.abs(d))}`;
};
/** Empty or negative input counts as 0. */
const num = (s) => Math.max(0, parseFloat(s) || 0);

/** Billing = pools × price; left for you = pools × (price − costs); the route's sale value = billing × 8 to × 12. */
function Calculator() {
  const [n, setN] = useState('50');
  const [p, setP] = useState('160');
  const [c, setC] = useState('65');
  const pools = num(n);
  const price = num(p);
  const costs = num(c);
  const billing = pools * price;
  const left = pools * (price - costs);
  const field = (id, label, value, set, { prefix, mode, min }) => (
    <div className="gd-field">
      <label htmlFor={id}>{label}</label>
      <div className="gd-inp">
        {prefix && <i>{prefix}</i>}
        <input id={id} type="number" inputMode={mode} min={min} value={value} onChange={(e) => set(e.target.value)} />
      </div>
    </div>
  );
  return (
    <div className="gd-calc" id="calc">
      <p className="gd-calc-h">Route income calculator</p>
      <div className="gd-calc-in">
        {field('rc-n', 'Pools on your route', n, setN, { mode: 'numeric', min: 1 })}
        {field('rc-p', 'What you charge, per month', p, setP, { prefix: '$', mode: 'decimal', min: 1 })}
        {field('rc-c', 'Your costs per pool, per month', c, setC, { prefix: '$', mode: 'decimal', min: 0 })}
      </div>
      <div className="gd-calc-out" aria-live="polite">
        <div className="gd-out">
          <span>Monthly billing</span>
          <b>{money(billing)} a month</b>
          <span>{money(billing * 12)} a year</span>
        </div>
        <div className="gd-out is-key">
          <span>Left for you</span>
          <b>{money(left)} a month</b>
          <span>{money(left * 12)} a year, before insurance and taxes</span>
        </div>
        <div className="gd-out is-wide">
          <span>What the route could sell for</span>
          <b>{money(billing * 8)} to {money(billing * 12)}</b>
          <span>at 8 to 12 times monthly billing</span>
        </div>
      </div>
      <p className="gd-calc-fine">
        Costs per pool means chemicals, fuel and truck. It doesn’t include insurance, taxes or paying a helper. Sale value is a rough
        guide, not an appraisal.
      </p>
    </div>
  );
}

/* ---------- Part 8 and the contents ---------- */

// Eleven steps; ticks aren't saved, so they reset on reload (as the first guide's).
const STEPS = [
  'Check state and county license rules for the work you plan to do',
  'Register the business and get a local business tax receipt',
  'Open a business bank account',
  'Buy general liability insurance',
  'Buy your core equipment and a real test kit',
  'Work out your cost per stop and set your price',
  'Decide what’s included and what’s billed as extra',
  'Pick one service area to build your route in',
  'Claim your Google Business Profile',
  'Start a mileage log on day one. It matters for your taxes. Spoiler: some pool service software includes it.',
  'Set up autopay billing and service reports',
];

const TOC = [
  ['worth', 'Is it a good business?'],
  ['costs', 'What it costs to start'],
  ['license', 'Licenses and insurance'],
  ['gear', 'The equipment you need'],
  ['price', 'How to price a stop'],
  ['customers', 'Your first 50 customers'],
  ['systems', 'Choose the right software'],
  ['checklist', 'The checklist'],
  ['faq', 'Common questions'],
];

const Part = ({ n }) => <span className="gd-num"><i>{n}</i>Part {n}</span>;
// An outside source: rel="noopener", as the reference has it.
const Ext = ({ href, children }) => <a className="gd-a" href={href} rel="noopener">{children}</a>;

/* ---------- The page ---------- */

export default function GuideStartBusinessPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg guide-page relative min-h-screen font-sans antialiased">
      <Nav tone="light" overlay />
      <main>
        <header className="gd-hero">
          <div className="container">
            <div className="gd-hero-grid">
              <div>
                <p className="gd-eyebrow">Guide for new pool pros</p>
                <h1>{START_GUIDE_H1}</h1>
                <p className="gd-lede">{START_GUIDE_LEDE}</p>
                <ul className="gd-in">
                  {SHORTCUTS.map(([id, label, icon]) => (
                    <li key={id}>
                      <a href={`#${id}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <HeroRoute />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="gd-body">
            <GuideToc items={TOC} articleId="gd-art" />

            <article className="gd-art" id="gd-art">
              <div className="gd-short">
                <h2>The short version</h2>
                <ol>
                  <li>Check what your state and county require before you touch a pool.</li>
                  <li>Start lean: your own truck, basic gear, liability insurance.</li>
                  <li>Price every stop from your real costs, not from what the last guy charged.</li>
                  <li>Build a tight route in one area before you spread out.</li>
                  <li>Put billing on autopay from customer one.</li>
                </ol>
              </div>

              <section id="worth" aria-labelledby="worth-title">
                <Part n={1} />
                <h2 id="worth-title">Is it a good business?</h2>
                <p>Pool service is one of the few trades where the work repeats every week. A customer you sign in March is still paying you in November, and next March. You aren’t hunting for new jobs every Monday, you’re looking after a route.</p>
                <p>
                  That route is also an asset. Pool routes are bought and sold, and brokers commonly price them at around 8 to 12 times what they
                  bill each month. Every customer you add makes the business worth more on the day you sell it.{' '}
                  <Ext href="https://pooldial.com/resources/articles/business/pool-route-valuation-guide">See how routes are valued</Ext>.
                </p>
                <ul className="gd-list">
                  <li><b>What’s good about it.</b> Low cost to start, recurring income, and you can begin alone with the truck you already own.</li>
                  <li>
                    <b>A tax deduction for the miles you drive.</b> Business miles are deductible. The{' '}
                    <Ext href="https://www.irs.gov/tax-professionals/standard-mileage-rates">IRS standard rate</Ext> is 76 cents a mile as of July
                    2026, so 15,000 business miles in a year is an $11,400 deduction. You need a{' '}
                    <a className="gd-a" href="/pool-service-mileage-tracking">mileage log</a> to claim it, and your commute doesn’t count. Ask your
                    accountant how it applies to you.
                  </li>
                  <li><b>What’s hard about it.</b> It’s physical, outdoors and in the heat. Demand drops in winter in colder states. Chemicals are a real cost and a real hazard.</li>
                  <li><b>Where the money is lost.</b> Driving between stops that are too far apart, undercharging for chemicals, and invoices that go out late or not at all.</li>
                </ul>
                <div className="gd-pull"><p>You aren’t selling a clean pool.</p><p>You’re selling a pool the owner never has to think about.</p></div>
              </section>

              <section id="costs" aria-labelledby="costs-title">
                <Part n={2} />
                <h2 id="costs-title">What it costs to start</h2>
                <p>Published estimates for a new pool cleaning business run from about $2,000 to $15,000. The gap is almost all vehicle. If you start with a truck you already own, you’re at the low end.</p>
                <div className="gd-math">
                  <div className="gd-math-card"><span className="gd-math-k">Lean start</span><span className="gd-math-r">Vehicle <b>Yours</b></span><span className="gd-math-r">Gear and chemicals <b>Basic</b></span><span className="gd-math-r gd-math-t">Budget <b>$2k–$4k</b></span></div>
                  <div className="gd-math-arrow" aria-hidden="true"><Arrow /></div>
                  <div className="gd-math-card is-after"><span className="gd-math-k">Full setup</span><span className="gd-math-r">Vehicle <b>Work truck</b></span><span className="gd-math-r">Gear and branding <b>Complete</b></span><span className="gd-math-r gd-math-t">Budget <b>$8k–$15k</b></span></div>
                </div>
                <ul className="gd-list">
                  <li><b>Licenses and registration: $0 to $1,000.</b> Depends on your state, county and whether you form an LLC.</li>
                  <li><b>Equipment and supplies: $500 to $3,000.</b> Poles, brushes, nets, a vacuum, a test kit and your first chemicals.</li>
                  <li><b>Liability insurance: about $600 to $2,000 a year.</b> Don’t service a pool without it.</li>
                  <li><b>Marketing: a few hundred dollars.</b> Truck lettering, door hangers and a Google Business Profile, which is free.</li>
                </ul>
                <div className="gd-note"><p><b>Don’t buy the truck first.</b> Buy it when the route pays for it. A paid-off pickup with a clean rack looks more professional than a new truck with a loan and 12 customers.</p></div>
                <p>
                  Cost ranges are from <Ext href="https://www.zenbusiness.com/pool-cleaning-business-startup-costs/">ZenBusiness</Ext> and{' '}
                  <Ext href="https://startcosts.com/pool-cleaning">StartCosts</Ext>.
                </p>
              </section>

              <section id="license" aria-labelledby="license-title">
                <Part n={3} />
                <h2 id="license-title">Licenses and insurance</h2>
                <p>The rules change by state and sometimes by county, so check before you start. The pattern is similar in most places: cleaning and balancing water needs little or no special license, and repairing or replacing equipment usually needs a contractor license.</p>
                <p>Florida is a good example of how the line is drawn:</p>
                <ul className="gd-list">
                  <li><b>Cleaning residential pools.</b> No state contractor license for routine cleaning and chemical treatment.</li>
                  <li><b>Public and commercial pools.</b> Technicians need an approved course of 16 hours or more under the state health code.</li>
                  <li><b>Repairs and equipment.</b> Replacing a pump or heater takes a pool/spa servicing contractor license from the DBPR.</li>
                  <li><b>Local paperwork.</b> You’ll need a local business tax receipt, and some counties, such as Miami-Dade, register pool cleaners.</li>
                  <li><b>CPO certification.</b> The Certified Pool &amp; Spa Operator course from the Pool &amp; Hot Tub Alliance runs about 16 hours with an exam and lasts five years. Local rules decide whether public pools require it. For residential work it’s optional, and worth having.</li>
                </ul>
                <p>
                  Sources: <Ext href="https://www2.myfloridalicense.com/services-requiring-a-dbpr-license/">Florida DBPR</Ext>, the{' '}
                  <Ext href="https://sarasota.floridahealth.gov/programs-and-services/environmental-health/pools-and-spas/_documents/pool-contractor-licensing-information-2016.pdf">Florida Department of Health</Ext>{' '}
                  and <Ext href="https://www.miamidade.gov/licenses/library/forms/swimming-pool-cleaner-registration.pdf">Miami-Dade County</Ext>.
                  Rules change, so confirm with your own state and county.
                </p>
                <p>For insurance, in the order you’ll need it:</p>
                <ol className="gd-steps">
                  <li><b>General liability.</b> Covers damage to a customer’s pool or property. This is the one you can’t skip.</li>
                  <li><b>Commercial auto.</b> Your personal policy may not cover a truck used for work.</li>
                  <li><b>Workers’ compensation.</b> Required in most states once you hire.</li>
                </ol>
                <div className="gd-note"><p><b>Stay inside your license.</b> If a customer needs a repair you aren’t licensed for, refer it out. One unlicensed pump swap can cost more than a year of that customer’s service.</p></div>
              </section>

              <section id="gear" aria-labelledby="gear-title">
                <Part n={4} />
                <h2 id="gear-title">The equipment you need</h2>
                <p>You can service a residential pool with less than you think. Buy good versions of the things you touch at every stop, and wait on everything else.</p>
                <ul className="gd-list">
                  <li><b>Telescoping pole.</b> The tool you’ll use most. Buy a good one.</li>
                  <li><b>Brushes, a leaf rake and a skimmer net.</b> Carry a spare net.</li>
                  <li><b>Vacuum head and hose,</b> or a cart-mounted vacuum once the route justifies it.</li>
                  <li><b>A real test kit.</b> A drop kit or a photometer, not strips. Your readings are what you’re selling.</li>
                  <li><b>Chemicals.</b> Chlorine, acid, and what you need to adjust alkalinity, calcium and stabilizer.</li>
                  <li><b>Safety gear.</b> Gloves, eye protection, and secure, ventilated storage on the truck.</li>
                </ul>
              </section>

              <section id="price" aria-labelledby="price-title">
                <Part n={5} />
                <h2 id="price-title">How to price a stop</h2>
                <p>Most new owners copy a competitor’s price. Start from your costs instead. For one customer, add up what the chemicals cost you in a month, what it costs to drive there, and what your time is worth. What’s left has to be worth getting out of bed for.</p>
                <div className="gd-math">
                  <div className="gd-math-card"><span className="gd-math-k">One customer, per month</span><span className="gd-math-r">Price <b>$160</b></span><span className="gd-math-r">Chemicals, fuel, truck <b>$65</b></span><span className="gd-math-r gd-math-t">Left for you <b>$95</b></span></div>
                  <div className="gd-math-arrow" aria-hidden="true"><Arrow /></div>
                  <div className="gd-math-card is-after"><span className="gd-math-k">50 customers</span><span className="gd-math-r">Billing <b>$8,000</b></span><span className="gd-math-r">Chemicals, fuel, truck <b>$3,250</b></span><span className="gd-math-r gd-math-t">Left for you <b>$4,750</b></span></div>
                </div>
                <p>These are example numbers. Put your own in below.</p>
                <Calculator />
                <ul className="gd-list">
                  <li><b>Decide what’s included.</b> Chemicals in the price, or billed on top? Either works. Not deciding is what loses money.</li>
                  <li><b>Charge for extras.</b> Filter cleans, green pool recoveries and salt cells are separate line items, not favors.</li>
                  <li><b>Price for density.</b> A pool two streets from one you already service is worth more to you than one 20 minutes away.</li>
                </ul>
                <div className="gd-pull"><p>Know what every stop costs you.</p><p>Otherwise you can’t tell which customers are making you money.</p></div>
                <p>
                  When your costs go up, your prices have to follow. Our guide on{' '}
                  <a className="gd-a" href="/guides/how-to-raise-prices">how to raise prices without losing customers</a> covers that.
                </p>
              </section>

              <section id="customers" aria-labelledby="customers-title">
                <Part n={6} />
                <h2 id="customers-title">Your first 50 customers</h2>
                <p>Your goal isn’t 50 customers anywhere. It’s 50 customers close together. Pick one area and own it before you take work across town.</p>
                <ol className="gd-steps">
                  <li><b>Start where you already are.</b> Every pool you service has neighbors with pools. A door hanger on the five houses around each stop costs almost nothing.</li>
                  <li><b>Claim your Google Business Profile.</b> It’s free, and it’s where people look when they search for pool service near them. Ask every happy customer for a review.</li>
                  <li><b>Ask for referrals.</b> A free month for a referral that signs up is cheaper than any ad.</li>
                  <li><b>Consider buying a route.</b> You can buy existing accounts from another company or a route broker and start with income on day one. Check how long the customers have been on service before you pay.</li>
                </ol>
                <div className="gd-note"><p><b>Say no to the far ones.</b> A customer 25 minutes off your route costs you two stops’ worth of driving every week. Quote them higher or pass.</p></div>
              </section>

              <section id="systems" aria-labelledby="systems-title">
                <Part n={7} />
                <h2 id="systems-title">Choose software you won’t outgrow</h2>
                <p>The pool is the easy part. Most small pool companies struggle with the paperwork: invoices sent late, cards that fail without anyone noticing, and customers asking “did you come today?”</p>
                <p>It’s tempting to start with a notebook, a spreadsheet and a payment app, and plan to get real software later. The trouble is that later means moving 150 customers, their cards and their history while you’re also running the route. Starting right with five customers is a lot easier than switching with 150.</p>
                <p>The software you pick also decides how far you can grow without hiring for the office. With the right setup, a second truck means adding a tech. With the wrong one, it means adding a tech and someone to do the billing.</p>
                <p><b>What should it cost?</b> Pool software typically costs around 1% of your monthly recurring billing. On the example route above, that’s about $80 a month. A good one earns that back quickly: keep one $160-a-month customer who would have left, or win one referral, and it has paid for itself for the year. Referrals come from customers who are impressed by how professional you are, and they notice when their invoice lands in their inbox at the same time every month, quarter or year. That’s before you count the hours it saves you.</p>
                <ul className="gd-list">
                  <li><b>Billing that runs without you.</b> Recurring invoices should go out and cards should be charged on schedule, whether you’re at a pool, at home sick or on vacation.</li>
                  <li><b>Failed payments handled for you.</b> Cards fail every month. The software should retry them and tell the customer, so you aren’t finding out 60 days later.</li>
                  <li><b>A report your customers appreciate.</b> A clear photo of their clean pool with that day’s chemical readings, sent after every stop. A customer should never have to ask whether you came, or wonder. These reports build trust and give your customers peace of mind, and that’s what keeps them with you.</li>
                  <li><b>Invoices that are easy to read and easy to pay.</b> Customers should understand the bill at a glance and pay it from their phone in a few taps.</li>
                  <li><b>The whole business on your phone.</b> You’ll run this from the truck. If billing and customers only work on a desktop, you’ll be doing office work at night.</li>
                  <li><b>Room for a second and third tech.</b> Routes you can hand off, with gate codes and notes, and a record of what each tech did.</li>
                  <li><b>A way out.</b> You should be able to export everything, and your customers’ saved cards should belong to you.</li>
                </ul>
                <div className="gd-pull"><p>You clean the pools.</p><p>The software should send the bills.</p></div>
                <div className="gd-note is-brand">
                  <p>
                    <b>How Poolnautics handles it.</b> Poolnautics puts your recurring invoicing on autopilot: invoices go out and cards are charged
                    on schedule, wherever you are. Every stop ends with a GPS-stamped service report your customers will appreciate, with
                    high-quality photos of their clean pool and their chemical readings. Invoices are easy to read and easy to pay, and it all
                    works on your phone. See <a className="gd-a" href="/pool-service-billing">billing</a>, the{' '}
                    <a className="gd-a" href="/tech-app">technician app</a> and <a className="gd-a" href="/pool-route-software">routes</a>.
                  </p>
                </div>
              </section>

              <section id="checklist" aria-labelledby="checklist-title">
                <Part n={8} />
                <h2 id="checklist-title">The checklist</h2>
                <p>Tick these off as you go.</p>
                <ul className="gd-check">
                  {STEPS.map((s, i) => (
                    <li key={s}>
                      <label>
                        <input type="checkbox" id={`sk-${i}`} />
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></i>
                        <span>{s}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="faq" aria-labelledby="faq-title">
                <Part n={9} />
                <h2 id="faq-title">Common questions</h2>
                <ul className="gd-list">
                  <li><b>Is a pool cleaning business profitable?</b> It can be, because the income repeats and the startup cost is low. Profit comes down to three things: what you charge, what chemicals cost you, and how close together your stops are.</li>
                  <li><b>How much does it cost to start a pool cleaning business?</b> Published estimates run from about $2,000 to $15,000. Starting with your own truck puts you near the low end.</li>
                  <li><b>Do you need a license to clean pools?</b> It depends on your state and county. Routine residential cleaning often needs no special license, while repairs and public pools usually do. Check before you start.</li>
                  <li><b>What is CPO certification?</b> It’s the Certified Pool &amp; Spa Operator credential from the Pool &amp; Hot Tub Alliance: about 16 hours of training, an exam, and renewal every five years.</li>
                  <li><b>How much is a pool route worth?</b> Brokers commonly price routes at around 8 to 12 times monthly billing, so a route billing $8,000 a month might sell for $64,000 to $96,000.</li>
                </ul>
              </section>

              <div className="gd-proof">
                <span className="gd-num">For new pool companies</span>
                <h2>Start with the office already handled.</h2>
                <p>Recurring invoices on autopilot, service reports with readings and photos, routes in order, and mileage tracked per stop. Start with one customer, or bring over a route you bought and we’ll move the customers for you. The trial is free for {TRIAL_DAYS} days, with no credit card.</p>
                <div className="gd-proof-row">
                  <a className="hero-cta gd-cta" href="/pricing">See pricing<ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
                  <a className="gd-ghost" href={ctaHref(theme)}>Start your {TRIAL_DAYS}-day trial</a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
