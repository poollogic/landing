import React, { useRef } from 'react';
import { ArrowRight, Ban } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/claude/hero/claudeHero.css';
import '../landing/claude/claude.css';
import Nav from '../landing/Nav.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import ClaudeChat from '../landing/claude/hero/ClaudeChat.jsx';
import HeroFx from '../landing/claude/hero/HeroFx.jsx';
import AddToClaudeDialog from '../landing/claude/AddToClaudeDialog.jsx';
import { Wordmark } from '../components/brand-logo.jsx';
import useReveal from '../landing/ai/useReveal.js';
import { FOCUS, Ticks, header, headerLight } from '../landing/ai/shared.jsx';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { AI_PLAN, SEND_LIMITS, TRIAL_DAYS } from '../aiFacts.js';
import { Footer } from '../components/site-chrome.jsx';

// /claude: the Poolnautics connector for Claude, the follow-on to /ai-and-automations (built-in
// automations and "bring any AI"); this one is running the business from Claude. Built as that page
// is, on its design: the dark nav; its hero, a copy of that page's hero as it stood on 2026-11-23
// (landing/claude/hero/: the beam and smoke, the grid and its scaling, the chat demo titled "Claude";
// classes ch-), kept apart so that page's hero can change without this one; section bands (.ai-band: white and light grey;
// .ai-band-dark), headers (landing/ai/shared.jsx), tick lists, cards, FAQ and closing call to action,
// all from ai.css, which /tech-app, /pool-service-billing and /pool-route-software share too. Only this
// page's own layouts are in landing/claude/claude.css (claude- prefix). Pre-rendered (entry-server.jsx
// → dist/claude.html), so no window or document while rendering. Blocks with data-reveal fade up on
// scroll (useReveal).
//
// Claims kept to what the connector does (poollogic-web-app docs/ai-connections.md, checked against the
// app 2026-11-25; the facts are aiFacts.js's): it reassigns requests and moves route stops (shown first,
// then moved); it quotes catalog items at their catalog price and anything else at the price the person
// gives it; it shows a quote or invoice before sending it; it can't charge a card, refund, approve a quote
// for a customer or change a price without an owner or admin. No tool count, no "one click", no setup time.

// ---- Links ----
// "Add to Claude" opens the popup (AddToClaudeDialog.jsx: the connector link to copy and paste in
// Claude). Once Poolnautics is listed in Claude's connector directory (the web app's
// docs/ai-connections.md), the popup can point there too.
// The trial: wherever the AI page's "Start your 30-day trial" goes (landing/onboarding.js).
const trialLink = (theme) => ctaHref(theme);
const TRIAL_LABEL = isReserving ? 'Reserve your spot' : `Start your ${TRIAL_DAYS}-day trial`;

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/claude`;

const PLAYBOOK = [
  ['Your catalog.', 'Anything in it is quoted at your price, and anything that isn’t gets the price you give it.'],
  ['Your automations.', 'If Poolnautics already sent the invoice, Claude doesn’t send it again.'],
  ['Your settings.', 'Tax rate, late fees, card fee, when accounts pause.'],
  ['Your office bell.', 'New leads, approved quotes, failed payments, jobs with no technician.'],
  ['The Poolnautics guides.', 'If they don’t cover something, Claude says it doesn’t know.'],
];

const DAY_TO_DAY = [
  ['Quotes and invoices', ['Quote the Wexler heater and email it.', 'The Hamlin job’s done. Invoice it.', 'Did the McGills approve their quote yet?']],
  ['Requests and technicians', ['Open a request for the Varga green pool.', 'Give it to Mike and mark it urgent.', 'What’s still waiting on a technician?']],
  ['Routes', ['Who’s out today?', 'Is anyone running behind?', 'What got skipped yesterday?']],
  ['Customers and leads', ['What did we do at the McGill pool last visit?', 'Update the Hamlin gate code to 3072.', 'Make that Facebook lead a customer.']],
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
  ['Everything is logged', 'Every change and every customer email is kept in your AI activity, and anything it does on a request shows in that request’s history too.'],
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
    a: 'No. Claude can never charge a card or refund a payment. It can draft and send invoices, which customers pay from the link (unless they agreed to an automatic charge when they approved the quote), and it can propose price changes for an owner or admin to approve.',
  },
  {
    q: 'Can Claude send quotes on its own?',
    a: 'With the Send to customers access level, yes. Claude shows you the quote first and sends it when you say so. Anything from your catalog is at your price, and only the customer can approve a quote.',
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

/** Opens the "Add to Claude" popup (onOpen gets the button, for focus to come back to). size: the
 *  hero's own button class (ch-cta, claudeHero.css) or the shared one (ai-cta, the closing section). */
function AddToClaudeCta({ onOpen, size = 'ai-cta' }) {
  return (
    <button type="button" aria-haspopup="dialog" onClick={(e) => onOpen(e.currentTarget)} className={`hero-cta ${size} ${FOCUS}`}>
      <span className="hero-cta-label">Add to Claude</span>
      <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

/** The hero's eyebrow: "poolnautics + Claude". Claude is plain text until we have Anthropic's
 *  wordmark file, which goes in its place unaltered (never drawn or imitated here). */
function LogoPair() {
  return (
    <div className="hero-eyebrow claude-logos" role="img" aria-label="Poolnautics + Claude">
      <Wordmark bg="dark" height={17} style={{ display: 'inline-block', verticalAlign: '-3.7px' }} />
      <span className="claude-logos-plus">+</span>
      <span className="claude-logos-claude">Claude</span>
    </div>
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
  const dialogRef = useRef(null);
  const openDialog = (from) => dialogRef.current?.open(from);
  useReveal(pageRef);
  return (
    <div ref={pageRef} className="mktg ai-page claude-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero: /ai-and-automations' hero as it stood on 2026-11-23, copied (landing/claude/hero/,
            claudeHero.css: the beam and smoke on the chat window, the grid and its scaling), with this page's words. */}
        <section className="hero ch-hero relative overflow-x-clip" aria-labelledby="claude-hero-title">
          <HeroFx />
          <div className="container">
            <div className="ch-hero-grid">
              <div className="ch-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <LogoPair />
                <HeroHeading id="claude-hero-title" title="Scale and automate your pool company with our Claude MCP connector">
                  Poolnautics hands Claude the full blueprint for your work orders, routes, billing and follow-ups. You
                  never have to teach it how a pool business runs.
                </HeroHeading>
                <div className="ch-cta-row">
                  <AddToClaudeCta onOpen={openDialog} size="ch-cta" />
                </div>
                <p className="hero-fine claude-trial-line">
                  New to Poolnautics?{' '}
                  <a href={trialLink(theme)} className={FOCUS}>
                    {isReserving ? 'Reserve your spot' : `Start a ${TRIAL_DAYS}-day trial`} <span aria-hidden="true">→</span>
                  </a>
                </p>
              </div>
              <div className="ch-hero-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <ClaudeChat />
              </div>
            </div>
          </div>
        </section>

        {/* 2. The Poolnautics blueprint (white): the header left, what Claude reads first right. */}
        <section id="playbook" className="section ai-band ai-light bg-white" data-theme="light" aria-labelledby="playbook-heading">
          <div className="container">
            <div className="ai-split ai-split--even claude-playbook" data-reveal="">
              {headerLight({
                align: 'left',
                id: 'playbook-heading',
                eyebrow: 'The Poolnautics blueprint',
                title: 'Claude already knows how your pool company runs.',
                subtitle: 'You don’t explain your pool service software to Claude every morning. Our MCP connector hands it the Poolnautics blueprint first, so it does the job your way, like a good office manager would.',
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

        {/* 3. Where Claude fits (light grey): heading left, the answer right (.ai-define's two columns). */}
        <section id="where-claude-fits" className="section ai-band ai-light bg-slate-50" data-theme="light" aria-labelledby="fits-heading">
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
              <AddToClaudeCta onOpen={openDialog} />
              <TrialCta theme={theme} />
            </div>
            <p className="hero-fine claude-close-fine">The {TRIAL_DAYS}-day trial includes everything. Your data exports as CSV, any time.</p>
          </div>
        </section>
      </main>
      <Footer />
      <AddToClaudeDialog ref={dialogRef} />
    </div>
  );
}
