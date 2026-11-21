import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/billing-page/billing-page.css';
import Nav from '../landing/Nav.jsx';
import BillingCalendar from '../landing/billing-page/BillingCalendar.jsx';
import MonthBelt from '../landing/billing-page/MonthBelt.jsx';
import BillingSetup from '../landing/billing-page/BillingSetup.jsx';
import LateInvoices from '../landing/billing-page/LateInvoices.jsx';
import PlansTable from '../landing/billing-page/PlansTable.jsx';
import FaqSection from '../landing/FaqSection.jsx';
import { BILLING_TITLE, BILLING_DESCRIPTION } from '../landing/billing-page/billingMeta.js';
import { HowCustomersPay, FailedPayments, CardFees, BeyondRate, YourMoney, ClosingCta } from '../landing/billing-page/PaymentAutomation.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { FOCUS, PrimaryCta } from '../landing/ai/shared.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /recurring-billing (it was /billing): recurring billing in depth. On /ai-and-automations' design (its
// page wrapper, nav, hero ground, type and buttons: ai.css, landing/ai/shared.jsx); only this page's
// own layouts live in landing/billing-page/billing-page.css, under .billing-page. Still being built:
// indexed, in the sitemap, linked from the nav's Features menu, the page for "pool service payment
// automation". Its sections: hero (dark), statement and belt (white), settings and invoice (grey),
// how customers pay (white), late invoices (dark), failed payments (grey), card fees (white), beyond
// the monthly rate (grey), your money (dark), plans (white), FAQ (grey), closing call to action
// (dark); the payment automation ones are landing/billing-page/PaymentAutomation.jsx. The month's
// example figures (the hero's dots, the $145 rate, the totals) are billingDemo.js. Pre-rendered (entry-server.jsx),
// so no window or document while rendering. The hero's calendar and the belt under it run on one
// clock (billingClock.js).

const ORIGIN = 'https://getpoolnautics.com';
const REPAIRS_LINK = 'See how repairs and diagnostics work';

// The FAQ: shown in #billing-faq (FaqSection) and sent as FAQPage structured data (structuredData
// below, in the pre-rendered <head>), from this one list, so the two always match.
export const FAQ = [
  {
    q: 'What time do recurring invoices go out?',
    a: 'Around 8:30 AM on weekdays and 10:30 AM on weekends, in your company’s time zone. Poolnautics sends every invoice due that day in one billing run, so there is nothing to review and nothing to press.',
  },
  {
    q: 'Can every customer have their own billing day?',
    a: 'Yes. Billing begins on the customer’s start date and repeats from there, so one customer can be billed on the 7th and another on the 20th. You can also bill a customer quarterly or yearly.',
  },
  {
    q: 'What if a customer’s billing day is the 29th, 30th or 31st?',
    a: 'Shorter months don’t have a 29th, 30th or 31st to bill on. When a customer’s day doesn’t exist that month, their invoice goes out on the last day of the month instead, and that becomes their billing day from then on. For example, a customer who starts on January 31st is billed on February 28th, then on the 28th of every month after. Customers who start between the 1st and the 28th always keep their day.',
  },
  {
    q: 'What happens when a card on autopay fails?',
    a: 'The customer is emailed a notice that the payment failed, with a link to update their autopay. You don’t have to call anyone.',
  },
  {
    q: 'How do late fees work?',
    a: 'Choose a flat amount or a percentage and a grace period. Once an invoice is that many days past due, the fee is added for you. The customer gets a reminder the day after the due date and a firmer one when the fee is added.',
  },
  {
    q: 'Can I still send a one-off invoice?',
    a: 'Yes, and it’s one of the parts of Poolnautics we’ve spent the most time perfecting. Recurring invoices send themselves, while repairs and diagnostics run through their own workflow. A repair request can start at the pool or in the office. You price it once and send it as a quote or an invoice, and you can charge for a diagnostic before the visit or after. On Vision, the invoice sends itself when the job closes.',
    more: <a href="/workflow">{REPAIRS_LINK}</a>,
    moreHtml: `<a href="${ORIGIN}/workflow">${REPAIRS_LINK}</a>`,
  },
  {
    q: 'Do you take a cut of my customers’ payments?',
    a: 'No. Payments are processed by Stripe and we never take a cut. You can also pass the card fee on to customers, where state law allows.',
  },
  {
    q: 'Can I pause billing for a customer?',
    a: 'Yes. On Vision, service pauses by itself when an invoice goes unpaid for the number of days you set. On Insight you can place a billing hold yourself. Paused months aren’t billed, and the customer picks back up on their next billing day.',
  },
];

// Structured data for the pre-rendered <head> (entry-server.jsx): the page (about the product,
// index.html's site-wide SoftwareApplication #software), where it sits, and the FAQ, its answers as
// shown (the link under one answer included).
const PAGE_URL = `${ORIGIN}/recurring-billing`;
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: BILLING_TITLE,
    description: BILLING_DESCRIPTION,
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
      { '@type': 'ListItem', position: 2, name: 'Recurring billing', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.moreHtml ? `${f.a}<br>${f.moreHtml}` : f.a },
    })),
  },
];

export default function BillingPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg ai-page billing-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero: the AI page's ground and type (no smoke or beam: the calendar's "today" is its only
            motion), as one centred column: the copy, then the billing calendar. */}
        <section className="hero ai-hero bp-hero relative overflow-x-clip" aria-labelledby="billing-hero-title">
          <div className="ai-hero-fade" aria-hidden="true" />
          <div className="container">
            <div className="bp-hero-stack">
              <div className="ai-hero-copy bp-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <HeroHeading
                  id="billing-hero-title"
                  eyebrow="Recurring billing & payment automation"
                  title={<><span className="bp-title-line">Pool Service Billing</span>{' '}<span className="bp-title-line">Software That Runs Itself</span></>}
                >
                  Set each customer’s rate and billing day once. Poolnautics sends the invoice every morning it’s
                  due, charges cards on autopay, and reminds anyone who’s late. No more invoicing everyone by hand
                  on the 1st.
                </HeroHeading>
                <div className="ai-cta-row ai-cta-row--center">
                  <PrimaryCta theme={theme} />
                  <a href="/pricing" className={`ai-cta-ghost cta-secondary ${FOCUS}`}>See pricing</a>
                </div>
                <p className="hero-fine">Automatic invoicing is included in every plan.</p>
              </div>
              <div className="bp-hero-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <BillingCalendar />
              </div>
            </div>
          </div>
        </section>

        {/* 2. The statement: when billing starts and that it repeats, over a belt of monthly invoices. */}
        <section className="bp-statement" aria-labelledby="bp-statement-title">
          <div className="container">
            <h2 id="bp-statement-title" className="bp-statement-title">
              <span className="bp-statement-a">Start them today, or set a start date 10 days out.</span>{' '}
              <span className="bp-statement-b">Billing begins that day and repeats every month.</span>
            </h2>
            <MonthBelt />
          </div>
        </section>

        {/* 3. A customer's billing settings and the invoice they make. */}
        <section className="bp-setup" aria-labelledby="bp-setup-title">
          <div className="container">
            <BillingSetup />
          </div>
        </section>

        {/* 4. How customers pay (white): the three ways, as a When / Then card, and the month's totals. */}
        <HowCustomersPay />

        {/* 5. Late invoices (dark): what happens to that invoice if it isn't paid, the homepage's timeline. */}
        <LateInvoices />

        {/* 6–9. Failed payments (grey), card fees (white), beyond the monthly rate (grey), your money (dark). */}
        <FailedPayments />
        <CardFees />
        <BeyondRate />
        <YourMoney />

        {/* 10. Plans (white): billing on Insight and Vision. */}
        <PlansTable />

        {/* 11. FAQ (light grey), the homepage's accordion, stacked; its FAQPage data is in the <head>. */}
        <FaqSection
          id="billing-faq"
          items={FAQ}
          title="Questions about recurring billing."
          subtitle={null}
          align="center"
          structuredData={false}
          headColors={false}
        />

        {/* 12. The closing call to action (dark). */}
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
