import React from 'react';
import { ArrowRight, Bell, Braces, CircleCheck, Clock, ClipboardList, Webhook } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/workflow/workflow.css';
import Nav from '../landing/Nav.jsx';
import SectionHeader from '../landing/SectionHeader.jsx';
import { BrowserFrame, PhoneFrame } from '../landing/workflow/Frames.jsx';
import SetupFlowSection from '../landing/workflow/SetupFlowSection.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { Footer } from '../components/site-chrome.jsx';
import { AI_PLAN } from '../aiFacts.js';

// /workflow (was /request-flow, which redirects here): the feature page for requests, diagnostics and work orders, built from the approved
// design (request-flow-reference.html). Pre-rendered at build time (entry-server.jsx →
// dist/workflow.html), so crawlers get every word; main.jsx hydrates it. So: no window or
// document while rendering. Nine sections, dark and light in turn; styles in
// landing/workflow/workflow.css (rf-). Every screenshot is a PhoneFrame or BrowserFrame
// placeholder (landing/workflow/Frames.jsx) until the real one is passed in.

const ORIGIN = 'https://getpoolnautics.com';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';

// The FAQ: shown in #faq and sent as FAQPage structured data (structuredData below), from this one list.
export const FAQ = [
  {
    q: 'How do I automate a pool service business?',
    a: 'Start with the work that repeats on every repair: the request, the quote, the work order and the invoice. In Poolnautics you answer about 10 setup questions once, and from then on the office prices the job and everything after it runs by itself, from customer approval to the paid invoice.',
  },
  {
    q: 'What parts of a pool service business can be automated?',
    a: 'Quote approvals, work orders reaching the technician app, invoices sending when the work order is marked complete, and payment collection all run automatically. Leads from your website form and Google Ads land in Requests on their own, and customer texts go out from your existing number.',
  },
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
    q: 'What happens after the customer approves a repair quote?',
    a: 'A work order opens for the technician you chose. When they mark it complete, the approved quote becomes an invoice and goes to the customer automatically, five minutes later by default.',
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
  {
    q: 'Can I train ChatGPT, Grok or another AI agent to do this instead?',
    a: 'An AI assistant is good at writing a repair description or a message to a customer. On its own, it doesn’t keep track of your open repairs, know which customers approved, assign the technician, or send the invoice when the job is done; you’d have to feed it every update. Poolnautics does those steps itself. If you use an AI assistant, you can connect ChatGPT, Claude or Grok to Poolnautics, and it can look up your real requests, open and assign them, add notes and draft invoices.',
  },
  {
    q: 'Do I need Zapier or n8n to automate my pool service business?',
    a: 'No. Poolnautics automates the repair workflow on its own: requests, quotes, work orders and invoices move from one step to the next without any outside tool. Texting, website forms and Google Ads leads connect directly. Zapier and n8n are there if you want something custom, such as sending Meta lead ads into Requests.',
  },
];

// For <head> (entry-server.jsx).
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Requests, diagnostics and work orders', item: `${ORIGIN}/workflow` },
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
          <p className="rf-hero-eyebrow">Pool service automation</p>
          <h1 id="rf-hero-heading" className="rf-hero-title">Automate your pool service workflow.</h1>
          <p className="rf-hero-sub">
            A tech spots a problem. You set a price. Poolnautics handles the approval, the work order, the invoice and the
            payment, so no finished job goes unbilled.
          </p>
          <Checks className="rf-hero-checks" items={['One step for the office', 'Works whether you quote or invoice', 'Set up in about 10 simple questions']} />
          <div className="rf-hero-actions">
            <PrimaryCta theme={theme} />
            <a href="#requests" className={`rf-text-link ${FOCUS}`}>See how the flow works</a>
          </div>
        </div>
        <div className="rf-hero-visual">
          {/* Sized from the hero's visual (workflow.css --rf-hero-vis): 330 × 176px at 440px. */}
          <BrowserFrame className="rf-hero-browser" variant="dark" height="calc(var(--rf-hero-vis, 440px) * .75)" label="Office dashboard: a new request" priority />
          <PhoneFrame className="rf-hero-phone" variant="dark" width="calc(var(--rf-hero-vis, 440px) * .4)" label="Tech app: stop screen" priority />
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
  { title: 'If you (or your AI agent) send a quote', body: 'For companies that want the customer to agree to the price first.', steps: ['Quote emailed', 'Customer approves', 'Work order shows on tech app', 'Invoice sends when the work order is marked complete'] },
  { title: 'If you send an invoice', body: 'For companies that want to be paid before anyone starts the work.', steps: ['Invoice emailed', 'Customer pays', 'Work order shows on tech app', 'Already paid when the job is done'] },
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
            title="Automatic invoicing: the job closes, the invoice sends itself."
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
          subtitle="Every pool company handles repairs a little differently. When you get started, a few simple questions set the flow up to match your procedures, so day to day there’s almost nothing to think about."
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

// What an AI assistant can do with this flow, from the AI page's facts (aiFacts.js: the Send to
// customers level and its limits, NEVER, the "estimate isn't approved after 2–14 days" automation).
// Claims nothing that page doesn't; the details are there.
const AI_POINTS = [
  { title: 'Connect Grok, ChatGPT or Claude', body: 'Sign in to Poolnautics from your assistant, or connect any other AI through MCP with a key.' },
  { title: 'Let it send the quotes you’ve priced', body: 'It can email quotes and invoices to your customers, inside hard limits. It can never charge a card or change a price on its own.' },
  { title: 'Follow up when customers go quiet', body: 'An automation texts or emails a customer whose quote isn’t approved after 2 to 14 days. Or ask your assistant to send it again.' },
];

function AiAssistants() {
  return (
    <section id="ai" className="rf-section rf-grey" aria-labelledby="ai-heading">
      <div className="rf-inner">
        <SectionHeader
          id="ai-heading"
          eyebrow="AI assistants"
          title="Already automatic. Add your AI for the rest."
          subtitle="Poolnautics runs your repairs with as little input from you as possible. If you use an AI assistant, connect it and it works the same requests, quotes and invoices alongside you."
        />
        <div className="rf-cards rf-cards--3">
          {AI_POINTS.map((p) => (
            <article key={p.title} className="rf-card rf-ai-card">
              <h3 className="rf-item-title">{p.title}</h3>
              <p className="rf-item-body">{p.body}</p>
            </article>
          ))}
        </div>
        <div className="rf-ai-more">
          <a href="/ai-and-automations" className={`rf-text-link ${FOCUS}`}>
            See everything your AI can do <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <p className="rf-ai-fine">AI, automations and integrations are on the {AI_PLAN} plan.</p>
        </div>
      </div>
    </section>
  );
}

// What connects to Poolnautics, as the web app's Settings → Integrations lists it (names and
// categories; IntegrationsDirectory.tsx). Its app icons live in the web app, not here.
// TODO: swap the neutral tiles for the Integrations panel's icons once they're in this repo
// (Quo, Twilio, Telnyx, Dialpad, Slack, website, Google, Meta, Claude). API and Webhooks already
// use the panel's glyphs (lucide's Braces and Webhook).
const INTEGRATION_GROUPS = [
  {
    title: 'Text customers',
    label: 'Text from the number your customers already know.',
    items: [{ name: 'Quo', category: 'Messaging' }, { name: 'Twilio', category: 'Messaging' }, { name: 'Telnyx', category: 'Messaging' }, { name: 'Dialpad', category: 'Messaging' }],
  },
  {
    title: 'Capture leads',
    label: 'New leads land in Requests, tagged with where they came from.',
    items: [{ name: 'Website forms', category: 'Lead capture' }, { name: 'Google Ads', category: 'Lead capture' }, { name: 'Meta lead ads', category: 'Lead capture, set up in Zapier' }],
  },
  {
    title: 'Keep the office in the loop',
    label: 'Post to a channel, or let your AI work from your requests and invoices.',
    items: [{ name: 'Slack', category: 'Communication' }, { name: 'AI assistants', category: 'ChatGPT, Claude, Grok', href: '/ai-and-automations' }],
  },
  {
    title: 'Build your own',
    label: 'For anything custom, including Zapier and n8n if you want them.',
    items: [{ name: 'API', category: 'Developer', Glyph: Braces }, { name: 'Webhooks', category: 'Developer', Glyph: Webhook }],
  },
];

function IntegrationCard({ name, category, href, Glyph }) {
  const content = (
    <>
      <span className="rf-int-icon" aria-hidden="true">{Glyph && <Glyph size={20} strokeWidth={2} />}</span>
      <span className="rf-int-text">
        <span className="rf-int-name">{name}</span>
        <span className="rf-int-cat">{category}</span>
      </span>
    </>
  );
  return href
    ? <a href={href} className={`rf-card rf-int-card rf-int-card--link ${FOCUS}`}>{content}</a>
    : <div className="rf-card rf-int-card">{content}</div>;
}

function Integrations() {
  return (
    <section id="integrations" className="rf-section rf-light" aria-labelledby="integrations-heading">
      <div className="rf-inner">
        {/* SectionHeader's pattern, with two paragraphs under the title. */}
        <div className="section-head section-head--center">
          <p className="section-eyebrow">Integrations</p>
          <h2 id="integrations-heading" className="section-title">Automate your pool service business without building it in Zapier.</h2>
          <p className="section-sub">
            Most pool companies automate by stitching apps together: a form tool, a quoting tool, an invoicing tool, and a
            Zapier or n8n account to pass data between them. Then a zap breaks on a Friday and a finished job never gets billed.
          </p>
          <p className="section-sub">
            Poolnautics does the passing for you. A request becomes a quote, a quote becomes a work order, and a closed job
            sends its own invoice. There’s nothing to wire up and nothing to maintain.
          </p>
        </div>
        <div className="rf-int-connect">
          <h3 className="rf-path-title">Connect what you already use</h3>
          <p className="rf-body">Keep your phone number, your ads and your website. Poolnautics plugs into them directly.</p>
        </div>
        <div className="rf-int-groups">
          {INTEGRATION_GROUPS.map((g) => (
            <div key={g.title} className="rf-int-group">
              <div className="rf-int-group-head">
                <h4 className="rf-item-title">{g.title}</h4>
                <p className="rf-item-body">{g.label}</p>
              </div>
              <ul className="rf-int-grid" role="list">
                {g.items.map((item) => <li key={item.name}><IntegrationCard {...item} /></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="rf-ai-more">
          <p className="rf-int-close">Zapier and n8n still work with Poolnautics. You just don’t need them to run your business.</p>
          <p className="rf-ai-fine">AI, automations and integrations are on the {AI_PLAN} plan.</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="rf-section rf-light" aria-labelledby="faq-heading">
      <div className="rf-inner">
        <SectionHeader id="faq-heading" eyebrow="FAQ" title="Questions about automating your pool service" className="rf-faq-head" />
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

export default function WorkflowPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg rf-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        <Hero theme={theme} />
        <SetupFlowSection />
        <Requests />
        <Diagnostics />
        <Quotes />
        <AiAssistants />
        <Integrations />
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
