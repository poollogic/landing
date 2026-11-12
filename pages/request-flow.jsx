import React from 'react';
import { ArrowRight, Bell, CircleCheck, Clock, ClipboardList } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/request-flow/request-flow.css';
import Nav from '../landing/Nav.jsx';
import SectionHeader from '../landing/SectionHeader.jsx';
import { BrowserFrame, PhoneFrame } from '../landing/request-flow/Frames.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { Footer } from '../components/site-chrome.jsx';

// /request-flow: the feature page for requests, diagnostics and work orders, built from the approved
// design (request-flow-reference.html). Pre-rendered at build time (entry-server.jsx →
// dist/request-flow.html), so crawlers get every word; main.jsx hydrates it. So: no window or
// document while rendering. Nine sections, dark and light in turn; styles in
// landing/request-flow/request-flow.css (rf-). Every screenshot is a PhoneFrame or BrowserFrame
// placeholder (landing/request-flow/Frames.jsx) until the real one is passed in.

const ORIGIN = 'https://getpoolnautics.com';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';

// The FAQ: shown in #faq and sent as FAQPage structured data (structuredData below), from this one list.
export const FAQ = [
  {
    q: 'Who can create a repair request?',
    a: 'Technicians create one from the stop screen in the technician app. Admins and office users create one in the web app by clicking New, then Request, which is what you’d use when a customer calls the office.',
  },
  {
    q: 'Can we charge for a diagnostic before the visit?',
    a: 'Yes. If your company requires payment first, the customer is invoiced and the diagnostic only reaches the assigned technician once it’s paid. You can also bill the diagnostic after the visit.',
  },
  {
    q: 'Do we have to send a quote, or can we invoice straight away?',
    a: 'Either. Send a quote and it becomes a work order when the customer approves. Send an invoice and it becomes a work order when it’s paid.',
  },
  {
    q: 'Can technicians see prices?',
    a: 'No. Technicians see the request details and the full history of the job, but not the price. The customer’s phone number is shown only if you allow it for that technician.',
  },
  {
    q: 'What if a job needs more work than expected?',
    a: 'The technician taps Needs extra work or parts, describes what’s needed and can add a photo. That goes to the office, where it can be quoted right away.',
  },
  {
    q: 'When is the customer invoiced for a quoted job?',
    a: 'Automatically, after the technician marks the work order complete. The default wait is five minutes, and you can change it or make it immediate in Automations.',
  },
  {
    q: 'How do customers receive quotes?',
    a: 'By email. If you use Integrations, you can also trigger your own automations from the same events.',
  },
  {
    q: 'Is there a schedule or calendar for work orders?',
    a: 'Work orders aren’t tied to a fixed schedule. Each technician works from their open work orders list and lets the customer know when they’re on the way.',
  },
];

// For <head> (entry-server.jsx).
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Requests, diagnostics and work orders', item: `${ORIGIN}/request-flow` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];

/* ---------- Pieces ---------- */

// The sign-up button: where the homepage's goes (landing/onboarding.js), in its style (hero.css .hero-cta).
function PrimaryCta({ theme }) {
  return (
    <a href={ctaHref(theme)} className={`hero-cta rf-cta ${FOCUS}`}>
      <span className="hero-cta-label">{isReserving ? 'Reserve Your Spot' : 'Start 30-Day Trial'}</span>
      <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

// The site's check mark (decorative: the list item says it all).
const Tick = () => (
  <svg className="rf-tick" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const Checks = ({ items, className = '' }) => (
  <ul className={`rf-checks ${className}`} role="list">
    {items.map((item) => <li key={item}><Tick /><span>{item}</span></li>)}
  </ul>
);

// A numbered list whose numbers are drawn (the <ol> gives screen readers the order).
const Num = ({ n }) => <span className="rf-num" aria-hidden="true">{n}</span>;

/* ---------- Sections ---------- */

function Hero({ theme }) {
  return (
    <section className="rf-hero rf-dark" aria-labelledby="rf-hero-heading">
      <div className="rf-inner rf-hero-grid">
        <div className="rf-hero-copy">
          <p className="rf-hero-eyebrow">Requests, diagnostics &amp; work orders</p>
          <h1 id="rf-hero-heading" className="rf-hero-title">Pool repair work orders that run themselves.</h1>
          <p className="rf-hero-sub">
            A tech spots a problem. You set a price. Poolnautics handles the approval, the work order, the invoice and the
            payment, so no finished job goes unbilled.
          </p>
          <Checks className="rf-hero-checks" items={['One step for the office', 'Works whether you quote or invoice', 'Set up around how your company already runs']} />
          <div className="rf-hero-actions">
            <PrimaryCta theme={theme} />
            <a href="#requests" className={`rf-text-link ${FOCUS}`}>See how the flow works</a>
          </div>
        </div>
        <div className="rf-hero-visual">
          <BrowserFrame className="rf-hero-browser" variant="dark" height={330} label="Office dashboard: a new request" priority />
          <PhoneFrame className="rf-hero-phone" variant="dark" width={176} label="Tech app: stop screen" priority />
        </div>
      </div>
    </section>
  );
}

function Requests() {
  return (
    <section id="requests" className="rf-section rf-light" aria-labelledby="requests-heading">
      <div className="rf-inner">
        <SectionHeader
          id="requests-heading"
          eyebrow="Requests"
          title="Two ways a repair request starts. Both take seconds."
          subtitle="Whether the problem is spotted at the pool or phoned in to the office, it ends up in the same place, ready for you to price."
        />
        <div className="rf-cards rf-cards--2">
          <article className="rf-card rf-source">
            <span className="rf-chip">Technician app</span>
            <h3 className="rf-source-title">From the pool</h3>
            <p className="rf-body">Your tech opens a request right from the stop they’re already on. A few simple questions, an optional photo, and it’s sent.</p>
            <Checks className="rf-checks--sm" items={['Starts from the stop screen', 'A few quick questions, including urgency', 'Photo is optional']} />
            <div className="rf-source-shot">
              <PhoneFrame variant="light" width={190} label="Tech app: new request" />
            </div>
          </article>
          <article className="rf-card rf-source">
            <span className="rf-chip">Web app</span>
            <h3 className="rf-source-title">From the office</h3>
            <p className="rf-body">A customer calls about a problem? Click New, then Request. Anyone on your team can open one.</p>
            <Checks className="rf-checks--sm" items={['New, then Request, from the sidebar', 'Open to admins and office users', 'Handled exactly like a tech’s request']} />
            <div className="rf-source-shot">
              <BrowserFrame className="rf-source-browser" variant="light" height={340} label="Web app: New → Request" />
            </div>
          </article>
        </div>
        <div className="rf-note">
          <span className="rf-note-icon"><Bell size={20} strokeWidth={2} aria-hidden="true" /></span>
          <p><strong>The office knows right away.</strong> A notification on the bell shows the new request and how urgent it is.</p>
        </div>
      </div>
    </section>
  );
}

const DIAGNOSTIC_STEPS = [
  { title: 'Mark the request as a diagnostic', body: 'One switch. Everything else works the same as any other request.' },
  { title: 'Get paid before the visit, or after', body: 'Require payment up front and the visit only reaches your tech once the invoice is paid. Or bill it after the visit. You decide once, during setup.' },
  { title: 'Your tech reports what’s wrong', body: 'A pump that needs replacing, a dead salt cell panel, whatever it is. They record the problem and the parts it needs.' },
  { title: 'The office gets everything it needs to quote', body: 'The findings land on your dashboard, ready to turn into a quote or an invoice.' },
];

function Diagnostics() {
  return (
    <section id="diagnostics" className="rf-section rf-dark" aria-labelledby="diagnostics-heading">
      <div className="rf-inner rf-split rf-split--phone-end">
        <div className="rf-split-copy">
          <SectionHeader
            id="diagnostics-heading"
            align="left"
            eyebrow="Diagnostics"
            title="Not sure what’s wrong yet? Send a diagnostic first."
            subtitle="Your tech goes out, finds the problem, and sends back exactly what the office needs to price the repair."
           
          />
          <ol className="rf-steps" role="list">
            {DIAGNOSTIC_STEPS.map((s, i) => (
              <li key={s.title}>
                <Num n={i + 1} />
                <div>
                  <h3 className="rf-item-title">{s.title}</h3>
                  <p className="rf-item-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rf-split-phone">
          <PhoneFrame variant="dark" width={250} label="Tech app: diagnostic report" />
        </div>
      </div>
    </section>
  );
}

const QUOTE_POINTS = [
  { title: 'Pick from your catalog, or type it in', body: 'Use your Services & Parts list for the repairs you do every week, or enter a one-off price for the ones you don’t.' },
  { title: 'Choose the technician as you send', body: 'The job is already assigned when the customer says yes. If you forget, Poolnautics tells you the work order has no technician.' },
  { title: 'The customer gets it by email', body: 'A clear price they can act on from their inbox, with no phone call needed.' },
];

const PATHS = [
  { title: 'If you send a quote', body: 'For companies that want the customer to agree to the price first.', steps: ['Quote emailed', 'Customer approves', 'Work order opens', 'Invoice sends when the job is done'] },
  { title: 'If you send an invoice', body: 'For companies that want to be paid before anyone starts the work.', steps: ['Invoice emailed', 'Customer pays', 'Work order opens', 'Already paid when the job is done'] },
];

function Quotes() {
  return (
    <section id="quotes" className="rf-section rf-light" aria-labelledby="quotes-heading">
      <div className="rf-inner">
        <SectionHeader
          id="quotes-heading"
          eyebrow="Quotes & invoices"
          title="Price it once. Send it as a quote or an invoice."
          subtitle="This is the only step the office has to do. Everything after it moves by itself."
        />
        <div className="rf-split rf-split--even">
          <BrowserFrame variant="light" height={360} label="Web app: pricing a request" />
          <ul className="rf-points" role="list">
            {QUOTE_POINTS.map((p) => (
              <li key={p.title}>
                <h3 className="rf-item-title">{p.title}</h3>
                <p className="rf-item-body">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rf-cards rf-cards--2 rf-paths">
          {PATHS.map((p) => (
            <article key={p.title} className="rf-card rf-path">
              <h3 className="rf-path-title">{p.title}</h3>
              <p className="rf-body">{p.body}</p>
              <ol className="rf-path-steps" role="list">
                {p.steps.map((s, i) => <li key={s}><Num n={i + 1} />{s}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const TECH_POINTS = [
  { title: 'Everything they need', body: 'The request details, the customer’s approval, and every note from the office or another tech.' },
  { title: 'Only what you allow', body: 'Prices stay hidden. The customer’s phone number shows only if you turn it on for that technician.' },
  { title: 'Customers know they’re coming', body: 'Your tech lets the customer know when they’re on the way.' },
  { title: 'Two buttons to finish', body: 'Mark complete, or Needs extra work or parts. Nothing else to fill in.' },
];

function WorkOrders() {
  return (
    <section id="work-orders" className="rf-section rf-dark" aria-labelledby="work-orders-heading">
      <div className="rf-inner rf-split rf-split--phone-start">
        <div className="rf-split-phone">
          <PhoneFrame variant="dark" width={250} label="Tech app: open work orders" />
        </div>
        <div className="rf-split-copy">
          <SectionHeader
            id="work-orders-heading"
            align="left"
            eyebrow="Technician app"
            title="Your tech sees the job, not the price."
            subtitle="Every open work order sits in one list at the bottom of the app. There’s no schedule to manage and no calling the office for details."
           
          />
          <ul className="rf-grid-points" role="list">
            {TECH_POINTS.map((p) => (
              <li key={p.title}>
                <h3 className="rf-item-title">{p.title}</h3>
                <p className="rf-item-body">{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="rf-callout">
            <h3 className="rf-item-title">When the job turns out bigger than expected</h3>
            <p className="rf-item-body">The tech taps Needs extra work or parts, types what’s needed and adds a photo. It goes straight to the office, where you can quote it on the spot.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const BILLING_STATS = [
  { value: '5 min', label: 'Default wait before the invoice sends' },
  { value: 'Instant', label: 'If you’d rather not wait at all' },
  { value: 'Your call', label: 'Change it any time in Automations' },
];

function Billing() {
  return (
    <section id="billing" className="rf-section rf-light" aria-labelledby="billing-heading">
      <div className="rf-inner rf-split rf-split--billing">
        <div className="rf-split-copy">
          <SectionHeader
            id="billing-heading"
            align="left"
            eyebrow="Automatic billing"
            title="The job closes. The invoice sends itself."
            subtitle="When your tech marks a quoted job complete, the approved estimate becomes an invoice and goes to the customer. No one has to remember."
           
          />
          <ul className="rf-stats" role="list">
            {BILLING_STATS.map((s) => (
              <li key={s.value}>
                <span className="rf-stat-value">{s.value}</span>
                <span className="rf-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="rf-billing-note">
            <strong>A finished job that never gets billed is the easiest way for a pool company to lose money.</strong>{' '}
            Forget to bill one $125 filter change a week and that’s $6,500 a year.
          </p>
        </div>
        <BrowserFrame variant="light" height={380} label="Web app: Automations panel" />
      </div>
    </section>
  );
}

const BENEFITS = [
  { icon: Clock, title: 'Less manual work', body: 'One step for the office on each job. The approval, the work order and the invoice move without anyone pushing them.' },
  { icon: ClipboardList, title: 'Nothing forgotten', body: 'Finished work is billed automatically, and extra parts come back to the office to be quoted, not lost in a text message.' },
  { icon: CircleCheck, title: 'Runs like clockwork', body: 'Customers get their quote, their heads-up and their invoice on time, every time. That’s what a professional company looks like from the outside.' },
];

function Setup() {
  return (
    <section id="setup" className="rf-section rf-grey" aria-labelledby="setup-heading">
      <div className="rf-inner">
        <SectionHeader
          id="setup-heading"
          eyebrow="Setup"
          title="Complicated underneath. Simple for your team."
          subtitle="Every pool company handles repairs a little differently. During onboarding we set the flow up to match your procedures, so day to day there’s almost nothing to think about."
        />
        <div className="rf-cards rf-cards--3">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rf-card rf-benefit">
              <span className="rf-benefit-icon"><Icon size={22} strokeWidth={2} aria-hidden="true" /></span>
              <h3 className="rf-benefit-title">{title}</h3>
              <p className="rf-item-body">{body}</p>
            </article>
          ))}
        </div>
        <div className="rf-card rf-decide">
          <h3 className="rf-path-title">You decide once. It runs that way from then on.</h3>
          <Checks className="rf-checks--grid" items={['Quote first, or invoice first', 'Diagnostics paid before the visit, or after', 'How long to wait before a finished job is invoiced', 'What each technician is allowed to see']} />
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="rf-section rf-light" aria-labelledby="faq-heading">
      <div className="rf-inner">
        <SectionHeader id="faq-heading" eyebrow="FAQ" title="Questions about requests, diagnostics and work orders" className="rf-faq-head" />
        <div className="rf-faq">
          {FAQ.map((f) => (
            <div key={f.q} className="rf-faq-item">
              <h3 className="rf-item-title">{f.q}</h3>
              <p className="rf-faq-answer">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ theme }) {
  return (
    <section id="contact" className="rf-section rf-dark rf-contact" aria-labelledby="contact-heading">
      <div className="rf-inner">
        <h2 id="contact-heading" className="rf-contact-title">Have more questions?</h2>
        <p className="rf-contact-sub">Tell us how your company handles repairs today, and we’ll show you how the flow would work for you.</p>
        <div className="rf-contact-actions">
          <a href="/contact" className={`rf-cta-ghost ${FOCUS}`}>Contact us</a>
          <PrimaryCta theme={theme} />
        </div>
      </div>
    </section>
  );
}

/* ---------- The page ---------- */

export default function RequestFlowPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg rf-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        <Hero theme={theme} />
        <Requests />
        <Diagnostics />
        <Quotes />
        <WorkOrders />
        <Billing />
        <Setup />
        <Faq />
        <Contact theme={theme} />
      </main>
      <Footer />
    </div>
  );
}
