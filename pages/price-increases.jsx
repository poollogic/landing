import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/feature-page/feature-page.css';
import '../landing/price-page/price-page.css';
import Nav from '../landing/Nav.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import { FeatureSection, Points, Questions } from '../landing/feature-page/FeaturePage.jsx';
import MessageCard from '../landing/price-page/MessageCard.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { PrimaryCta } from '../landing/ai/shared.jsx';
import { TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';
import { PRICE_TITLE, PRICE_DESCRIPTION } from '../landing/price-page/priceMeta.js';
import { CURRENT, RAISE, NEW_PRICE, QUARTER, START_SHORT, START_LONG, START_DAY, usd } from '../landing/price-page/priceDemo.js';
import aquaBlueLogo from '../landing/price-page/aqua-blue-pools.svg';

// /pool-service-price-increases: raising prices with the price adjuster, built from the approved reference
// (price-increases-page-reference.html, 2026-11-25): its layout, copy, demo data, colours, sizes and
// breakpoints (1020px and 720px). The site's pieces where they exist: the dark nav (here with autoHide:
// the hero has no buttons, so the nav and its "Start free trial" stay in reach), /pool-service-billing's
// dark centred hero without its buttons or ticks, the feature pages' sections, headings, points and
// questions (landing/feature-page/), the billing page's closing band (.pa-close) and the footer. New:
// the hero's invoice, notes and timeline, the case study, and the three app screens (customer list,
// adjuster, message editor), rebuilt in HTML in the app's type with made-up customers; each is a picture
// (role="img" with a description). Styles: landing/price-page/price-page.css. Figures: priceDemo.js.
// Pre-rendered (entry-server.jsx), so nothing here reads window or document while rendering; the email's
// animation starts after load (MessageCard.jsx). No FAQ structured data.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/pool-service-price-increases`;
const ADJUST_URL = 'https://app.poolnautics.app/customers/bulk-adjust'; // the app's price increase page

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: PRICE_TITLE,
    description: PRICE_DESCRIPTION,
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
      { '@type': 'ListItem', position: 2, name: 'Raise pool service prices', item: PAGE_URL },
    ],
  },
];

const Arrow = ({ width = 2.2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
);
const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

/** "Already on Poolnautics? Start your price increase →" (and "Already a customer?" in the closing band). */
const OpenInApp = ({ lead }) => (
  <p className="pr-open">{lead} <a href={ADJUST_URL}>Start your price increase{' '}<Arrow /></a></p>
);

/* ---------- 1. Hero ---------- */

const NOTES = [
  ['The new price is on every bill', 'By the date it starts, they’ve already seen it.'],
  ['The increase is credited back', 'Under a label you write, such as “Loyalty Credit”.'],
  ['The total doesn’t change', 'They pay exactly what they pay today, to the cent.'],
];
const TIMELINE = [
  ['Today', 'Price set', 'You send the email'],
  ['December', usd(CURRENT), 'Credited'],
  ['January', usd(CURRENT), 'Credited'],
  ['February', usd(CURRENT), 'Credited'],
  [START_DAY, usd(NEW_PRICE), 'The credit stops by itself'],
];

function HeroVisual() {
  return (
    <div className="pr-stage">
      <div className="pr-top">
        <div
          className="pr-paper"
          role="img"
          aria-label={`Bottom of an invoice: subtotal ${usd(NEW_PRICE)}, Rate Transition Credit (Existing Customer) minus ${usd(RAISE)}, total ${usd(CURRENT)}`}
        >
          <div className="pz-sum">
            <div><span>Subtotal</span><span>{usd(NEW_PRICE)}</span></div>
            <div><span><i>Rate Transition Credit</i><i>(Existing Customer)</i></span><span>-{usd(RAISE)}</span></div>
            <div className="pz-total"><span>Total</span><span>{usd(CURRENT)}</span></div>
          </div>
        </div>
        <ul className="pr-notes">
          {NOTES.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}
        </ul>
      </div>
      <ol className="pr-time">
        {TIMELINE.map(([when, what, note], i) => (
          <li key={when} className={i === TIMELINE.length - 1 ? 'is-end' : undefined}><small>{when}</small><b>{what}</b><span>{note}</span></li>
        ))}
      </ol>
      <p className="pr-time-note">
        <b>You choose how much notice they get.</b> This example gives three months. It could be one month, or any date from
        tomorrow to two years out.
      </p>
    </div>
  );
}

/* ---------- 2–3. Why, and the case study ---------- */

const WHY = [
  ['Your costs don’t stand still', 'Chemicals, fuel, insurance and wages keep climbing. Every year you hold your prices, your margin covers the difference.'],
  ['The raise gets put off anyway', 'Asking feels risky, so most owners wait, and old accounts drift further below what they should pay.'],
  ['By hand, it’s one customer at a time', 'Working out who was last raised when, editing each customer and writing each email separately.'],
];

const RESULTS = [
  ['Customers who cancelled', '3% to 6%', '1 customer'],
  ['Calls asking if the bill was a mistake', 'Every year', 'None'],
];

function CaseStudy() {
  return (
    <div className="pr-case">
      <div>
        <p className="pr-cs-eye">Price increase case study</p>
        <h3 id="pr-case-title">No calls. One cancellation.</h3>
        <p className="pr-cs-p">
          Aqua Blue Pools Corp. raises its prices once a year. It always planned to lose a few customers when it did, and to take
          calls from people who never saw the email and thought the higher bill was a mistake.
        </p>
        <p className="pr-cs-p">Its latest increase was the first run this way. The new price and the credit were on every invoice before the date.</p>
        <div className="pr-cs-by">
          <img className="pr-cs-logo" src={aquaBlueLogo} alt="Aqua Blue Pools" width="209" height="58" loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="pr-cs-res">
        {RESULTS.map(([k, before, now]) => (
          <div key={k} className="pr-cs-item">
            <span className="pr-cs-k">{k}</span>
            <div className="pr-cs-v">
              <div><span className="pr-cs-n">{before}</span><span className="pr-cs-c">Earlier increases</span></div>
              <svg className="pr-cs-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              <div><span className="pr-cs-n is-now">{now}</span><span className="pr-cs-c is-now">This increase</span></div>
            </div>
          </div>
        ))}
        <p className="pr-cs-note">One company, one increase. Cancellations counted up to the day the new price started.</p>
      </div>
    </div>
  );
}

/* ---------- 4. Step 1: the customer list ---------- */

const CUSTOMERS = [
  ['Dana Whitfield', 'Tampa', 'Sep 2025', 'Dec 1, 2026', usd(CURRENT)],
  ['Marcus Bell', 'Largo', 'Apr 2025', 'Dec 2, 2026', usd(145)],
  ['Elena Ortiz', 'Seminole', null, 'Dec 2, 2026', usd(135)],
  ['Sam Whitaker', 'St Petersburg', 'Sep 2024', 'Dec 3, 2026', usd(150)],
  ['Nora Castillo', 'Clearwater', null, 'Dec 4, 2026', usd(130)],
  ['Owen Price', 'Tampa', 'Jun 2025', 'Dec 4, 2026', usd(142)],
];

function CustomerList() {
  return (
    <div
      className="pr-bl"
      role="img"
      aria-label="Customer list filtered to customers whose last increase was 9 or more months ago and who pay $120 to $160, all ticked"
    >
      <div className="bl-top">
        <div className="bl-tabs"><span className="is-on">All<i>47</i></span><span>Selected</span></div>
        <div className="bl-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          Search customers
        </div>
      </div>
      <div className="bl-filters">
        <div className="bl-f is-set">Last increase <b>9+ months</b></div>
        <div className="bl-f is-set">MRR <b>$120–$160</b><Chevron /></div>
        <div className="bl-f">Sanitizer <Chevron /></div>
        <div className="bl-f">Billing day <Chevron /></div>
        <div className="bl-f">City <Chevron /></div>
        <div className="bl-f">+ More</div>
      </div>
      <div className="bl-row bl-head">
        <span className="bl-check"><Tick /></span><span>Customer</span><span>Last increase</span><span className="bl-next">Next invoice</span><span className="bl-amt">Current</span>
      </div>
      {CUSTOMERS.map(([name, city, last, next, amount]) => (
        <div key={name} className="bl-row">
          <span className="bl-check"><Tick /></span>
          <span><span className="bl-name">{name}</span><span className="bl-city">{city}</span></span>
          {last ? <span>{last}</span> : <span className="bl-never">—</span>}
          <span className="bl-next">{next}</span>
          <span className="bl-amt">{amount}</span>
        </div>
      ))}
    </div>
  );
}

const FILTER_POINTS = [
  ['By their last increase', 'A slider sets how long it’s been, to the month: 9 months, 14, whatever fits.'],
  ['By what drives your cost', 'Sanitizer, city, route day or technician, so a raise can follow chemical use or drive time.'],
  ['By what they pay now', 'A price range picks out the old, underpriced accounts without touching anyone else.'],
];

/* ---------- 5. Step 2: the adjuster ---------- */

function Adjuster() {
  return (
    <div
      className="pr-adj"
      role="img"
      aria-label={`The price adjuster: raise the monthly rate by $${RAISE}, starting on a future date, ${START_LONG}, with the invoice line label Rate Transition Credit (Existing Customer)`}
    >
      <span className="aj-title">Monthly rate</span>
      <span className="aj-sub">Raise or lower what they pay each month.</span>
      <div className="aj-seg"><span className="is-on">Fixed $</span><span>Percent %</span></div>
      <div className="aj-input"><span className="aj-pre">$</span><span className="aj-val">{RAISE}</span></div>
      <span className="aj-hint">Use a negative number to decrease, e.g. -5</span>
      <span className="aj-label">When does the new price start?</span>
      <span className="aj-req">Required — pick one to continue.</span>
      <div className="aj-opt"><span className="aj-radio" /><b>Right away</b><span className="aj-desc">Their next invoice is at the new price.</span></div>
      <div className="aj-opt is-on"><span className="aj-radio" /><b>On a future date</b><span className="aj-desc">Their rate goes up now, but they keep paying today’s price until then.</span></div>
      <span className="aj-label">Start date</span>
      <div className="aj-input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
        <span className="aj-val">{START_SHORT}</span>
      </div>
      <span className="aj-hint">The first invoice on or after this date is at the full price.</span>
      <span className="aj-label">Invoice line label</span>
      <div className="aj-input"><span className="aj-val">Rate Transition Credit (Existing Customer)</span></div>
    </div>
  );
}

const ADJUST_POINTS = [
  ['The amount', 'A dollar amount or a percentage', `Add $${RAISE} to everyone in the group, or raise them all by 8%.`],
  ['The notice', 'You decide how much notice', 'One month, three months, a full season. The credit ends on the date you pick, any day from tomorrow to two years out. Or start right away.'],
  ['The label', 'The credit line is in your words', 'Write your own, up to 60 characters: “Loyalty Credit”, “Valued Customer Credit”.'],
];

/** Numbered points beside a card: [small label, h3, sentence] (the feature pages' .fp-how-points). */
const SidePoints = ({ items }) => (
  <ol className="fp-how-points">
    {items.map(([label, title, body]) => (
      <li key={title}><small>{label}</small><h3 className="fp-h3">{title}</h3><p className="fp-p">{body}</p></li>
    ))}
  </ol>
);

/* ---------- 6. What your customers see ---------- */

function BeforeAfter() {
  return (
    <div className="pr-ba">
      <div className="pr-ba-col">
        <div className="pr-ba-card">
          <span className="pr-ba-when">Every bill until {START_DAY}</span>
          <div className="pr-ba-row"><span>Subtotal</span><span>{usd(NEW_PRICE)}</span></div>
          <div className="pr-ba-row pr-ba-credit"><span>Rate Transition Credit</span><span>−{usd(RAISE)}</span></div>
          <span className="pr-ba-gap" />
          <div className="pr-ba-row pr-ba-total"><span>Total</span><span>{usd(CURRENT)}</span></div>
        </div>
        <p className="pr-ba-cap"><b>They pay what they pay today.</b> The credit takes the increase back off.</p>
      </div>
      <div className="pr-ba-arrow" aria-hidden="true">{START_DAY}<Arrow /></div>
      <div className="pr-ba-col pr-ba-col--after">
        <div className="pr-ba-card">
          <span className="pr-ba-when">From {START_DAY}</span>
          <div className="pr-ba-row"><span>Subtotal</span><span>{usd(NEW_PRICE)}</span></div>
          <div className="pr-ba-row pr-ba-ghost"><span>Credit ended</span><span /></div>
          <span className="pr-ba-gap" />
          <div className="pr-ba-row pr-ba-total"><span>Total</span><span>{usd(NEW_PRICE)}</span></div>
        </div>
        <p className="pr-ba-cap"><b>The credit line is gone.</b> It’s the same {usd(NEW_PRICE)} they’ve seen on every bill.</p>
      </div>
    </div>
  );
}

const SEE_POINTS = [
  ['It reads as a thank-you', 'The line says “Existing Customer”. They can see they’re getting a better deal than someone new.'],
  ['No countdown on the bill', 'The invoice looks normal. Your email explains the schedule once, clearly.'],
  ['A paused customer loses nothing', 'The credit counts bills, not months. Someone who pauses for winter still gets every credited bill.'],
];

/* ---------- 7. Step 3; 8. Checks; 9. Questions ---------- */

const EMAIL_POINTS = [
  ['Written once', 'You write the email', 'It opens ready to edit when you apply the change. The words are yours.'],
  ['Filled in for each', 'Their price, their date', 'Each customer gets their own current price, new price, difference, billing cycle and start date.'],
  ['Sent by you', 'Never automatic', 'Customers are never emailed on their own. A future start date also makes it easy to give the notice you promise.'],
  ['Kept in your history', 'Every email is saved', 'You can see who was emailed and when. If a customer says they never saw it, you have the date in front of you.'],
];

const CHECKS = [
  ['Nobody is selected for you', 'Opening the page selects no one. You choose the group.'],
  ['The start has to be chosen', 'There’s no default. You decide between right away and a date.'],
  ['Every customer, before and after', 'A preview lists each one’s current price, new price, what they pay now and when full price starts.'],
  ['No email until you send it', 'The announcement waits for you to read it and press send.'],
  ['Any increase can be cancelled', 'Cancel one customer’s increase and their old price comes back.'],
  ['It’s all on the record', 'Each customer’s rate history shows old price, new price and the date they start paying it.'],
];

const QUESTIONS = [
  ['How do I raise pool service prices without losing customers?', 'Take away the surprise. Put the new price on the bill early, credit the difference back until a date you choose, and tell customers what’s happening. Aqua Blue Pools ran an increase this way and had no calls and one cancellation.'],
  ['How do I tell customers about a price increase?', 'When you apply the change, an email opens for you to edit. Each customer’s copy has their own current price, new price and start date. Nothing is sent until you press send, and customers are never emailed automatically. Every email sent is saved in your history.'],
  ['How much notice should I give before a price increase?', 'That’s your call. Set the start date anywhere from tomorrow to two years out, and customers keep paying today’s price until then. Check your service agreements for any notice they require.'],
  ['Does the price go up gradually?', 'No. The credit is the whole increase, so the total stays exactly the same until the date. Then it steps up once.'],
  ['What about quarterly and yearly customers?', `The credit scales with the bill, and everyone reaches full price on the same date. A quarterly customer going from $${CURRENT * QUARTER} to $${NEW_PRICE * QUARTER} sees a $${RAISE * QUARTER} credit.`],
  ['What happens if a customer pauses service?', 'They keep every credited bill. The credit counts invoices, not months.'],
  ['Can I undo a price increase?', 'Yes. Cancel increase puts the old price back for that customer. If it never billed, it’s struck through in their history.'],
];

/* ---------- The page ---------- */

export default function PriceIncreasesPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg ai-page feature-page price-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav autoHide current="/pool-service-price-increases" />
      <main>
        {/* 1. Hero (dark): the billing page's centred hero, no buttons or ticks; the invoice, notes and
            timeline under the copy. */}
        <section className="hero ai-hero bp-hero bp-hero--billing pr-hero relative overflow-x-clip" aria-labelledby="pr-hero-title">
          <div className="ai-hero-fade" aria-hidden="true" />
          <div className="container">
            <div className="bp-hero-copy pr-hero-copy">
              <HeroHeading id="pr-hero-title" eyebrow="How to raise pool service prices" title="The Easy, Safe Way to Raise Pool Service Prices">
                Pick who’s due a raise, set the new price and choose the date it starts. Until then every invoice shows the new price
                with the increase credited back, so they pay exactly what they pay today.
              </HeroHeading>
              <OpenInApp lead="Already on Poolnautics?" />
            </div>
            <div className="bp-hero-visual">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* 2. Why (white), then 3. the case study on the same white, with no gap between them. */}
        <FeatureSection
          tone="white"
          className="pr-why"
          id="pr-why-title"
          eyebrow="Why price increases lose customers"
          title="A price increase isn’t the problem. The surprise is."
          sub="Most customers understand that your costs go up. What loses them is a bigger bill with no warning. How you ask is what matters."
        >
          <Points items={WHY} />
        </FeatureSection>
        <FeatureSection tone="white" className="pr-case-sec" id="pr-case-title">
          <CaseStudy />
          <p className="pr-share">
            <b>Ran an increase with Poolnautics?</b> Tell us how it went. We want the success stories and the things we should fix.{' '}
            {/* TODO: point this at a short form (company, what happened, may we quote you). The Contact page for now. */}
            <a href="/contact">Share your experience</a>
          </p>
        </FeatureSection>

        {/* 4. Step 1 (grey): the customer list. */}
        <FeatureSection
          tone="tint"
          id="pr-step1-title"
          eyebrow="Step 1: Choose who gets the increase"
          title="Start with the customers whose price hasn’t moved."
          sub={<><a className="pr-inline" href={ADJUST_URL}>Start a price increase</a>, filter your customer list and tick who’s due.</>}
        >
          <CustomerList />
          <Points items={FILTER_POINTS} />
        </FeatureSection>

        {/* 5. Step 2 (white): the adjuster beside three points. */}
        <FeatureSection
          tone="white"
          id="pr-step2-title"
          eyebrow="Step 2: Set the new price"
          title="Choose how much to raise prices, and when."
          sub="Raise by a fixed amount or a percentage, choose when the new price starts, and name the credit line your customers will see."
        >
          <div className="pr-split">
            <Adjuster />
            <SidePoints items={ADJUST_POINTS} />
          </div>
        </FeatureSection>

        {/* 6. What your customers see (grey): before and after. */}
        <FeatureSection
          tone="tint"
          id="pr-see-title"
          eyebrow="What your customers see"
          title="They see the new price. They keep paying the old one, until the date you pick."
          sub="It isn’t gradual. The total stays the same to the cent, then steps up once on the date."
        >
          <BeforeAfter />
          <p className="pr-ba-also">
            <b>Billed quarterly or yearly?</b> The credit scales with the bill. A quarterly customer sees {usd(NEW_PRICE * QUARTER)} with
            a {usd(RAISE * QUARTER)} credit, and reaches full price on the same date.
          </p>
          <Points items={SEE_POINTS} />
        </FeatureSection>

        {/* 7. Step 3 (white): the message editor, typing itself, beside four points. */}
        <FeatureSection
          tone="white"
          id="pr-step3-title"
          eyebrow="Step 3: Tell your customers"
          title="Tell customers about the price increase with one email."
          sub="A price increase notice with their own numbers lands better than a general “prices are going up”."
        >
          <div className="pr-split pr-split--msg">
            <MessageCard />
            <SidePoints items={EMAIL_POINTS} />
          </div>
        </FeatureSection>

        {/* 8. Checks (dark): six cards and the billing panel line. */}
        <FeatureSection
          tone="dark"
          id="pr-checks-title"
          eyebrow="Checks before anything changes"
          title="A customer can’t be surprised by accident."
          sub="Every step that could catch someone out needs a decision from you first."
        >
          <ul className="pr-safe">
            {CHECKS.map(([h, p]) => <li key={h} className="fp-x-card"><h3>{h}</h3><p>{p}</p></li>)}
          </ul>
          <p className="pr-status">
            On Dana’s billing panel: <b>−{usd(RAISE)}</b>, <b>2 of 3 invoices left</b>, paying <b>{usd(CURRENT)}</b> per invoice until then.
          </p>
        </FeatureSection>

        {/* 9. Questions (grey): plain headings, no FAQ structured data. */}
        <FeatureSection tone="tint" id="pr-faq-title" eyebrow="Questions" title="Questions about raising pool service prices.">
          <Questions items={QUESTIONS} />
        </FeatureSection>

        {/* 10. The closing band: the billing page's .pa-close, this page's copy, and "Already a customer?". */}
        <section className="pa-section pa-dark pa-close" aria-labelledby="pr-close-title">
          <div className="container">
            <div className="pa-close-inner">
              <h2 id="pr-close-title" className="pa-h2 pa-close-title">Raise pool service prices without the surprise.</h2>
              <p className="pa-sub">Pick who’s due, set the date and send one email. Your customers see it coming.</p>
              <div className="pa-close-row">
                <PrimaryCta theme={theme} label={`Start your ${TRIAL_DAYS}-day trial`} />
                <a href="/pricing" className="pa-text-link">See pricing</a>
              </div>
              <p className="pa-close-fine">Free for {TRIAL_DAYS} days · No credit card</p>
              <OpenInApp lead="Already a customer?" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
