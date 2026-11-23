import React, { useRef } from 'react';
import { ArrowRight, Ban, Check } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/claude/claude.css';
import Nav from '../landing/Nav.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import ClaudeDemo from '../landing/claude/ClaudeDemo.jsx';
import useReveal from '../landing/ai/useReveal.js';
import { FOCUS, Ticks, header, headerLight } from '../landing/ai/shared.jsx';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { AI_PLAN, SEND_LIMITS, TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';

// /claude: the Poolnautics connector for Claude, the follow-on to /ai-and-automations (built-in
// automations and "bring any AI"); this one is running the business from Claude. Built as that page
// is, on its design: the dark nav, its hero (.ai-hero), section bands (.ai-band: white and light grey;
// .ai-band-dark), headers (landing/ai/shared.jsx), tick lists, cards, FAQ and closing call to action,
// all from ai.css, which /tech-app, /pool-service-billing and /pool-route-software share too. Only this
// page's own layouts are in landing/claude/claude.css (claude- prefix). Pre-rendered (entry-server.jsx
// → dist/claude.html), so no window or document while rendering. Blocks with data-reveal fade up on
// scroll (useReveal).
//
// Claims kept to what the connector does (poollogic-web-app docs/ai-connections.md): it reassigns
// requests, never route stops; it can't charge a card, refund, approve a quote for a customer or
// change a price without an owner or admin. No tool count, no "one click", no setup time.

// ---- Links to wire up ----
// TODO: the Poolnautics listing in Claude's connector directory, once it's published (the web app's
// docs/ai-connections.md, "Claude's connector directory"). Until then the button goes to the setup steps.
export const CLAUDE_CONNECTOR_LINK = '#setup';
// The trial: wherever the AI page's "Start your 30-day trial" goes (landing/onboarding.js).
const trialLink = (theme) => ctaHref(theme);
const TRIAL_LABEL = isReserving ? 'Reserve your spot' : `Start your ${TRIAL_DAYS}-day trial`;

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/claude`;

const HERO_TICKS = [
  'Works in the Claude app on your phone',
  'Can’t charge a card or change a price on its own',
  `On the ${AI_PLAN} plan, and included in the ${TRIAL_DAYS}-day trial`,
];

const PLAYBOOK = [
  ['Your catalog.', 'Every quote uses your price. Claude never makes one up.'],
  ['Your automations.', 'If Poolnautics already sent the invoice, Claude doesn’t send it again.'],
  ['Your settings.', 'Tax rate, late fees, card fee, when accounts pause.'],
  ['Your office bell.', 'New leads, approved quotes, failed payments, jobs with no technician.'],
  ['The Poolnautics guides.', 'If they don’t cover something, Claude says it doesn’t know.'],
];

const DAY_TO_DAY = [
  ['Quotes and invoices', ['Quote the Wexler heater and email it.', 'The Hamlin job’s done. Invoice it.', 'Did the McGills approve their quote yet?']],
  ['Requests and technicians', ['Open a request for the Varga green pool.', 'Give it to Mike and mark it urgent.', 'What’s still waiting on a technician?']],
  ['Routes', ['Who’s out today?', 'Is anyone running behind?', 'What got skipped yesterday?']],
  ['Customers and leads', ['What did we do at the McGill pool last visit?', 'Add the Hamlins’ new gate code to their notes.', 'Make that Facebook lead a customer.']],
  ['Money', ['Who owes us more than 30 days?', 'How did October compare to September?', 'Raise everyone with no increase in a year by $10.']],
  ['Water and chemicals', ['Which pools are out of balance this week?', 'Any pools with phosphates over 500?', 'Who’s going through the most chlorine?']],
];

const STEPS = [
  ['Add Poolnautics in Claude', 'In Claude, open Customize, then Connectors, and add Poolnautics.'],
  ['Sign in and pick an access level', 'An owner or admin chooses how far Claude can go: read only, make changes, or send to customers.'],
  ['Ask it something real', 'Start with “what needs me today?” on the web, desktop or your phone.'],
];

const CANT = ['Charge a card', 'Refund a payment', 'Change a price without your approval', 'Approve a quote on a customer’s behalf'];

const GUARDS = [
  ['Everything is logged', 'Each change shows in the request’s history as done through your AI connection, and every customer email is kept in your AI activity.'],
  ['A lead can’t give Claude orders', 'Text inside lead forms, notes and requests is treated as information, never as instructions.'],
  ['Customer email has a ceiling', `At most ${SEND_LIMITS.emailsPerDay} customer emails a day, and the same invoice only once in 24 hours.`],
  ['You can pull the plug', 'Only an owner or admin can connect Claude, and any connection can be revoked on its own.'],
];

// The FAQ on the page and in the FAQPage JSON-LD: one list, so they can't drift apart. `link` turns
// those words of the answer into a link on the page.
const FAQ = [
  {
    q: 'Is there a Claude connector for pool service software?',
    a: 'Yes. Poolnautics has its own Claude connector. Once it’s connected, Claude can look up customers, routes and invoices and take the actions you allow.',
  },
  {
    q: 'Does it work in the Claude mobile app?',
    a: 'Yes. Add the connector on the web or desktop, and it’s available in your Claude conversations on your phone.',
  },
  {
    q: 'Can Claude charge my customers?',
    a: 'No. Claude can never charge a card or refund a payment. It can draft and send invoices, which customers pay from the link, and it can propose price changes for an owner or admin to approve.',
  },
  {
    q: 'Can Claude send quotes on its own?',
    a: 'With the Send to customers access level, yes. Quotes use your catalog prices, and only the customer can approve one.',
  },
  {
    q: 'Do I have to use Claude?',
    a: 'No. The same connection works with ChatGPT, Grok or your own agent. See AI and automations.',
    link: ['AI and automations', '/ai-and-automations'],
  },
  {
    q: 'Which plan includes the Claude connector?',
    a: `AI connections are on the ${AI_PLAN} plan. The ${TRIAL_DAYS}-day trial includes all of it.`,
  },
];

/** JSON-LD for <head>, written there by the pre-renderer (entry-server.jsx). */
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'Poolnautics for Claude',
    description: 'The Poolnautics connector for Claude. Send quotes, reassign requests, chase late invoices and check routes from Claude on your desk or your phone, inside limits you set.',
    inLanguage: 'en-US',
    dateModified: '2026-11-23',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': `${ORIGIN}/#software` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Poolnautics for Claude', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];

/* ---------- Buttons ---------- */

function AddToClaudeCta() {
  return (
    <a href={CLAUDE_CONNECTOR_LINK} className={`hero-cta ai-cta ${FOCUS}`}>
      <span className="hero-cta-label">Add to Claude</span>
      <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

function TrialCta({ theme }) {
  return <a href={trialLink(theme)} className={`ai-cta-ghost cta-secondary ${FOCUS}`}>{TRIAL_LABEL}</a>;
}

/** An answer, with its `link` words made a link. */
function Answer({ a, link }) {
  if (!link) return a;
  const [words, href] = link;
  const at = a.indexOf(words);
  return <>{a.slice(0, at)}<a href={href}>{words}</a>{a.slice(at + words.length)}</>;
}

/* ---------- The page ---------- */

export default function ClaudePage() {
  const theme = usePreviewTheme();
  const pageRef = useRef(null);
  useReveal(pageRef);
  return (
    <div ref={pageRef} className="mktg ai-page claude-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero: copy left; right, Claude on a phone changing a Poolnautics window (ClaudeDemo). */}
        <section className="hero ai-hero claude-hero relative overflow-x-clip" aria-labelledby="claude-hero-title">
          <div className="container">
            <div className="ai-hero-grid">
              <div className="ai-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <HeroHeading id="claude-hero-title" eyebrow="Poolnautics for Claude" title="Run your pool company with Claude">
                  Send the quote. Cover the sick tech. Chase the late invoice. Text Claude from the truck and it’s done in Poolnautics.
                </HeroHeading>
                <div className="ai-cta-row">
                  <AddToClaudeCta />
                  <TrialCta theme={theme} />
                </div>
                <ul className="claude-hero-ticks">
                  {HERO_TICKS.map((t) => (
                    <li key={t}><Check size={16} strokeWidth={2.4} aria-hidden="true" /><span>{t}</span></li>
                  ))}
                </ul>
              </div>
              <div className="ai-hero-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <ClaudeDemo />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Where Claude fits (white): heading left, the answer right (.ai-define's two columns). */}
        <section id="where-claude-fits" className="section ai-band ai-light bg-white" data-theme="light" aria-labelledby="fits-heading">
          <div className="container">
            <div className="ai-define claude-fits" data-reveal="">
              {headerLight({
                align: 'left',
                id: 'fits-heading',
                eyebrow: 'Where Claude fits',
                title: 'Automations run the routine. Claude gets the odd jobs.',
                className: 'mb-0',
              })}
              <div className="ai-define-answer">
                <p className="section-sub ai-sub-light">
                  Overdue reminders, late fees and failed-payment links already go out on their own in Poolnautics, with no
                  AI involved. Claude is for what you can’t put on a schedule: the one-off quote, the tech who called in,
                  the customer with a question.
                </p>
                <a href="/ai-and-automations" className={`ai-link ${FOCUS}`}>
                  See what’s already automated <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Your playbook (light grey): the header left, what Claude reads first right. */}
        <section id="playbook" className="section ai-band ai-light bg-slate-50" data-theme="light" aria-labelledby="playbook-heading">
          <div className="container">
            <div className="ai-split ai-split--even claude-playbook" data-reveal="">
              {headerLight({
                align: 'left',
                id: 'playbook-heading',
                eyebrow: 'Your playbook',
                title: 'It already knows how you run things.',
                subtitle: 'You don’t explain your business to Claude every morning. It looks things up in Poolnautics first, like a good office manager would, then does the job your way.',
                className: 'mb-0',
              })}
              <Ticks
                className="claude-playbook-ticks"
                items={PLAYBOOK.map(([lead, rest]) => (
                  <React.Fragment key={lead}><strong>{lead}</strong> {rest}</React.Fragment>
                ))}
              />
            </div>
          </div>
        </section>

        {/* 4. The day-to-day (dark): six groups of things people ask, no cards. */}
        <section id="day-to-day" className="section ai-band-dark bg-mktg-page" aria-labelledby="day-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                align: 'left',
                id: 'day-heading',
                eyebrow: 'The day-to-day',
                title: 'Most of what lands on the office in a day',
                className: 'mb-0',
              })}
            </div>
            <div className="claude-asks" data-reveal="">
              {DAY_TO_DAY.map(([group, asks]) => (
                <div key={group} className="claude-ask-group">
                  <h3>{group}</h3>
                  <ul>{asks.map((a) => <li key={a}>“{a}”</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="ai-note claude-asks-note" data-reveal="">
              A price change is only ever a proposal. An owner or admin approves it in Poolnautics, and can leave anyone out first.
            </p>
          </div>
        </section>

        {/* 5. Setup (darkest, the AI page's connect section): three steps on the dark cards. */}
        <section id="setup" className="section ai-band-dark ai-connect" aria-labelledby="setup-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                id: 'setup-heading',
                eyebrow: 'Setup',
                title: 'Set it up once. Use it anywhere you use Claude.',
                className: 'mb-0',
              })}
            </div>
            <ol className="ai-pillars claude-steps" data-reveal="">
              {STEPS.map(([title, text], i) => (
                <li key={title}>
                  <div className="ai-pillar">
                    <span className="ai-pillar-top">
                      <span className="ai-pillar-icon claude-step-n" aria-hidden="true">{i + 1}</span>
                      <span className="ai-pillar-tag">Step {i + 1}</span>
                    </span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Guardrails (white): what it can never do, beside how the limits hold. */}
        <section id="claude-guardrails" className="section ai-band ai-light bg-white" data-theme="light" aria-labelledby="guardrails-heading">
          <div className="container">
            <div data-reveal="">
              {headerLight({
                align: 'left',
                id: 'guardrails-heading',
                eyebrow: 'Guardrails',
                title: 'The limits live in Poolnautics, not in the prompt.',
                subtitle: 'Claude can’t talk its way past them, and neither can anyone else.',
                className: 'mb-0',
              })}
            </div>
            <div className="claude-guard" data-reveal="">
              <div className="ai-routine-card claude-cant">
                <p className="section-eyebrow">Never, at any access level</p>
                <h3 className="ai-routine-card-title">Claude can’t</h3>
                <ul className="ai-routine-list">
                  {CANT.map((t) => (
                    <li key={t}><Ban size={18} strokeWidth={2} aria-hidden="true" /><span>{t}</span></li>
                  ))}
                </ul>
              </div>
              <div className="claude-guard-points">
                {GUARDS.map(([title, text]) => (
                  <div key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ (light grey): the AI page's layout; the same list as the FAQPage JSON-LD. */}
        <section id="faq" className="section ai-band ai-light bg-slate-50" data-theme="light" aria-labelledby="faq-heading">
          <div className="container">
            <div data-reveal="">
              {headerLight({
                align: 'left',
                id: 'faq-heading',
                eyebrow: 'FAQ',
                title: 'Poolnautics and Claude FAQ',
                className: 'mb-0',
              })}
            </div>
            <div className="ai-qa claude-qa" data-reveal="">
              {FAQ.map((f) => (
                <div key={f.q} className="ai-qa-row">
                  <h3>{f.q}</h3>
                  <p><Answer a={f.a} link={f.link} /></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Closing call to action (dark): the AI page's. */}
        <section className="section ai-close" aria-labelledby="close-heading">
          <div className="container" data-reveal="">
            {header({
              id: 'close-heading',
              title: 'See what Claude does with your own customers.',
              subtitle: 'Connect it during the trial and ask it something real.',
              className: 'mb-0',
            })}
            <div className="ai-cta-row ai-cta-row--center">
              <AddToClaudeCta />
              <TrialCta theme={theme} />
            </div>
            <p className="hero-fine claude-close-fine">The {TRIAL_DAYS}-day trial includes everything. Your data exports as CSV, any time.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
