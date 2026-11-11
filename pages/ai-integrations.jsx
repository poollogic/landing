import React, { useRef } from 'react';
import {
  ArrowRight, Ban, BookOpen, Bot, Check, Hash, History, KeyRound, Mail, MessageSquare, Send, ShieldCheck, Webhook, Workflow, Inbox,
} from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import Nav from '../landing/Nav.jsx';
import SectionHeader from '../landing/SectionHeader.jsx';
import AssistantChat from '../landing/ai/AssistantChat.jsx';
import HeroFx from '../landing/ai/HeroFx.jsx';
import SectionNav from '../landing/ai/SectionNav.jsx';
import AccessLevels from '../landing/ai/AccessLevels.jsx';
import Connections from '../landing/ai/Connections.jsx';
import EventFeed from '../landing/ai/EventFeed.jsx';
import AutomationFlow from '../landing/ai/AutomationFlow.jsx';
import LeadFlow from '../landing/ai/LeadFlow.jsx';
import TechPhone from '../landing/ai/TechPhone.jsx';
import PriceProposal from '../landing/ai/PriceProposal.jsx';
import Stance from '../landing/ai/Stance.jsx';
import Code, { formatJson } from '../landing/ai/Code.jsx';
import useReveal from '../landing/ai/useReveal.js';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { Footer } from '../components/site-chrome.jsx';
import {
  ACTIONS, AI_PLAN, API_DOCS_URL, API_MAX_POST, AUTOMATION_LIMITS, BULK, LEAD_SOURCES, MCP_TOOL_COUNT, NEVER, PRICE_PROPOSALS, RECIPES,
  RECIPE_COUNT, SAMPLE_PAYLOAD, SEND_LIMITS, SMS_PROVIDERS, TECH_APP, TRIAL_DAYS, TRIGGER_COUNT, TRIGGER_EXAMPLES, WEBHOOK_EVENTS,
  WEBHOOK_GROUPS, WEBHOOK_LIMIT, WEBHOOK_MAX_AGE_MIN, WEBHOOK_RETRIES, WEBHOOK_SIGNATURE_HEADER,
} from '../aiFacts.js';

// /ai-integrations: AI, automations and integrations. Pre-rendered at build time
// (entry-server.jsx → dist/ai-integrations.html), so crawlers that don't run JavaScript get the
// whole page; main.jsx hydrates it. So: no window or document while rendering, and every
// mockup's text in the markup from the start. Numbers and lists come from aiFacts.js; claim
// nothing that isn't there. Owners first, developers lower down. All dark, on the --mktg-*
// tokens; styles in landing/ai/ai.css. Blocks with data-reveal fade up on scroll (useReveal).

const ORIGIN = 'https://getpoolnautics.com';
// Only the hero, the stance and "The short answer" are published for now (2026-11-07). True brings
// back the rest of the page, with its FAQ in the JSON-LD, the pillars' links to their sections and
// the "On this page" bar (SectionNav.jsx). Add 'FAQPage' back to the route's jsonLd in
// scripts/seo-check.mjs with it.
const FULL_PAGE = false;
const PAGE_URL = `${ORIGIN}/ai-integrations`;
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';

const FAQ = [
  {
    q: 'Can I connect ChatGPT or Claude to Poolnautics?',
    a: 'Yes. Sign in to Poolnautics from ChatGPT, Claude or Grok, and your assistant can look things up and get work done in your real data. Any other assistant that accepts a key works too, including Claude Code, Cursor or your company’s own agent. Just paste the key from Settings.',
  },
  {
    q: 'What is MCP, and what can an AI assistant do in Poolnautics?',
    a: `MCP (Model Context Protocol) is an open standard that lets AI assistants use tools inside other apps. Poolnautics has a built-in MCP server with ${MCP_TOOL_COUNT} tools in three access levels. Read only (15 tools) looks up customers, invoices, quotes, accounts receivable by age, visits with water readings, requests and revenue. Make changes (13 more) opens, moves and assigns requests, adds notes and drafts invoices. Send to customers (2 more) emails invoices and quotes. With Ask first on, ${PRICE_PROPOSALS.tools} more let it propose price changes for an owner or admin to approve.`,
  },
  {
    q: 'Can the AI charge my customers’ cards?',
    a: 'No. No access level can charge a card or bank account, refund, record or void a payment, add charges, or change recurring services, discounts, late fees or autopay. Those tools don’t exist, and it can’t change a price on its own either. An invoice the AI issues is never charged automatically: the customer pays from the link.',
  },
  {
    q: 'Can the AI change my customers’ prices?',
    a: `Not on its own. Price changes are off until an owner or admin turns on Ask first in ${PRICE_PROPOSALS.setting}. Then an assistant with Make changes access can propose new prices, such as $10 more a month for every customer without an increase in 12 months, with its reason. Nothing changes until an owner or admin approves the proposal inside Poolnautics, signed in. A yes typed in the chat doesn’t count. They can leave any customer out, no price moves more than ${PRICE_PROPOSALS.maxChangePercent}% in one proposal, and a proposal no one decides expires after ${PRICE_PROPOSALS.expiresDays} days. New prices start at each customer’s next bill, and customers aren’t emailed until you announce it.`,
  },
  {
    q: 'Can the AI email my customers?',
    a: `Only at the Send to customers level, and only invoices and quotes, inside hard limits. It can’t send drafts over ${SEND_LIMITS.maxInvoice}, the billing run’s own invoices, or drafts with a payment attached, and links are refused in its note. Each connection can send at most ${SEND_LIMITS.emailsPerDay} customer emails per 24 hours, and each document once per 24 hours. Every send shows on the request’s history with the connection’s name.`,
  },
  {
    q: 'Does the technician app use AI?',
    a: 'No, on purpose. AI works in the office, through your assistant’s connection. The technician app is a simple route and chemistry app: techs get a push notification when their route changes or they get a new work order, whether the app is open or not, including changes your AI assistant makes, and a bell in the app lists every notification.',
  },
  {
    q: 'Does Poolnautics work with Zapier and n8n?',
    a: 'Yes, through webhooks. Point a Poolnautics webhook at a Zapier or n8n webhook trigger and every event you choose arrives there, signed. Make and any other tool that receives webhooks work the same way. Leads come the other way through your lead link, which Zapier and Make can post to.',
  },
  {
    q: 'What webhook events are there?',
    a: `${WEBHOOK_EVENTS.length} events, plus a test ping: ${WEBHOOK_EVENTS.join(', ')}. Visit, payment, pause and equipment events fire whoever makes the change: the office, a technician’s phone, a payment or a background job.`,
  },
  {
    q: 'How are webhooks secured?',
    a: `Every delivery is signed with HMAC-SHA256 and your company’s webhook secret, in a ${WEBHOOK_SIGNATURE_HEADER} header (t=<unix time>,v1=<signature>). Check the signature and refuse anything older than ${WEBHOOK_MAX_AGE_MIN} minutes. Poolnautics refuses to send to private or internal addresses.`,
  },
  {
    q: 'What happens if my server is down?',
    a: `Poolnautics retries over about ${WEBHOOK_RETRIES.hours} hours (${WEBHOOK_RETRIES.attempts} attempts), with the same event id every time so you can skip duplicates, then marks the delivery failed. The delivery log in Settings shows each one with its exact payload, and Retry now sends it again.`,
  },
  {
    q: 'Do I need a developer?',
    a: 'No. Automations, the ready-made recipes, the lead link, texting and Slack are all set up in Settings, with no code, and connecting an AI assistant means pasting a token. A developer only helps if you want your own app to receive webhooks or add customers through the API.',
  },
  {
    q: 'Which plan includes this?',
    a: `${AI_PLAN}. AI access, automations, webhooks, the API, the lead link and texting are all on ${AI_PLAN}, and the ${TRIAL_DAYS}-day trial includes everything in ${AI_PLAN}.`,
  },
];

/** JSON-LD for <head>, written there by the pre-renderer (entry-server.jsx). */
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'AI, automations and integrations for pool service companies',
    description: 'How Poolnautics works with AI assistants over MCP, runs no-code automations, and connects to other tools through signed webhooks, a lead link and an API.',
    inLanguage: 'en-US',
    dateModified: '2026-11-07',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': `${ORIGIN}/#software` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'AI & integrations', item: PAGE_URL },
    ],
  },
  ...(FULL_PAGE ? [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }] : []),
];

// [icon, tag, title, text, the section it links to]
const PILLARS = [
  [Bot, `${MCP_TOOL_COUNT} MCP tools`, 'Your AI, inside Poolnautics', 'Ask who owes what, assign requests, draft and send invoices, from the AI you already use.', '#connect-ai'],
  [Webhook, `${WEBHOOK_EVENTS.length} webhooks`, 'Every event streams out', 'New leads, finished visits, failed payments, sent wherever you need them.', '#webhooks'],
  [Workflow, 'No-code', 'Automatic follow-ups', 'Texts, emails and alerts go out on their own, with waits, conditions and quiet hours.', '#automations'],
  [Inbox, 'Forms + ads', 'Leads from anywhere', 'Your lead link catches forms and ad leads, tags the source and starts the follow-up.', '#leads'],
];

const CHECKLIST = [
  ['A real AI connection, not just a chatbot', `A built-in MCP server with ${MCP_TOOL_COUNT} tools that work on your real data, from Claude Code, Cursor, VS Code or any app that connects to an MCP server with a key.`],
  ['Permission levels you control', 'Three levels that build on each other: Read only, Make changes, Send to customers. Only an owner or admin can create a connection; each one is named and can be revoked on its own, and one switch turns all AI access off.'],
  ['Money guardrails', 'No level can charge, refund, record or void a payment, add charges, or change discounts, late fees or autopay. Those tools don’t exist. Prices change only when an owner or admin approves the AI’s proposal.'],
  ['Signed, retried webhooks with a delivery log', `HMAC-SHA256 signatures, retries over about ${WEBHOOK_RETRIES.hours} hours with the same event id, and a delivery log with the exact payload and Retry now.`],
  ['Events from field work, not just the CRM', 'visit.completed carries water readings, LSI, chemicals added and the photo count; filter, salt cell and service pause events fire whether the change comes from the office, a tech’s phone or a background job.'],
  ['Built-in automations with quiet hours and opt-out handling', `${TRIGGER_COUNT} triggers, ${ACTIONS.length} actions, up to ${AUTOMATION_LIMITS.actions} steps with their own waits, sending hours, and STOP replies honored automatically.`],
  ['Lead capture from any form or ad', 'A lead link that Jotform, Typeform, Webflow and Google Ads lead forms post to directly, with Facebook, Instagram, Wix, Squarespace and WordPress through Zapier.'],
  ['A record of what the AI did', 'Every send shows on the request’s history as sent by the connection’s name (AI assistant), and Settings shows when each connection was last used.'],
];

const SIGNATURE_SNIPPET = `import crypto from 'node:crypto';

// rawBody: the request body exactly as it arrived (a string).
// secret: your webhook secret from Settings (whsec_…).
export function isFromPoolnautics(rawBody, signatureHeader, secret) {
  // PoolLogic-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256>
  const { t, v1 } = Object.fromEntries(
    signatureHeader.split(',').map((part) => part.split('=')),
  );
  if (!t || !v1) return false;
  // Refuse anything older than 5 minutes.
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(\`\${t}.\${rawBody}\`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}`;

/* ---------- Small shared pieces ---------- */

const Eyebrow = 'ai-eyebrow';
const header = (props) => (
  <SectionHeader
    eyebrowClassName={Eyebrow}
    titleClassName="text-mktg-primary"
    subtitleClassName="text-mktg-muted"
    {...props}
  />
);

function Ticks({ items, className = '' }) {
  return (
    <ul className={`ai-ticks ${className}`}>
      {items.map((t) => (
        <li key={typeof t === 'string' ? t : t.key}>
          <Check size={16} strokeWidth={2.4} aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function PrimaryCta({ theme }) {
  return (
    <a href={ctaHref(theme)} className={`hero-cta ai-cta ${FOCUS}`}>
      <span className="hero-cta-label">{isReserving ? 'Reserve your spot' : 'Start your 30-day trial'}</span>
      <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

function DocsCta() {
  return (
    <a href={API_DOCS_URL} className={`ai-cta-ghost ${FOCUS}`}>
      <BookOpen size={17} strokeWidth={1.75} aria-hidden="true" />
      Read the API docs
    </a>
  );
}

/* ---------- The page ---------- */

export default function AiIntegrationsPage() {
  const theme = usePreviewTheme();
  const pageRef = useRef(null);
  useReveal(pageRef);
  return (
    <div ref={pageRef} className="mktg ai-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero: the homepage hero's type on a deep-navy ground, with a beam of light falling onto the
            assistant window and smoke rising off it (HeroFx, WebGL, browser only); copy left, the assistant right. */}
        <section className="hero ai-hero relative overflow-x-clip" aria-labelledby="ai-hero-title">
          <HeroFx />
          <div className="container">
            <div className="ai-hero-grid">
              <div className="ai-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <p className="hero-eyebrow">Pool service automation</p>
                <h1 id="ai-hero-title" className="hero-title">Pool service software that feeds your automations</h1>
                <p className="hero-sub">
                  Every customer, visit, payment and lead flows into Claude, Grok, ChatGPT or your own AI. Automate just
                  about anything, from chasing overdue invoices to proposing price increases to reassigning requests when a tech calls in sick.
                </p>
                <div className="ai-cta-row">
                  <PrimaryCta theme={theme} />
                  <DocsCta />
                </div>
                <p className="hero-fine">
                  AI, automations and integrations are on the {AI_PLAN} plan. The {TRIAL_DAYS}-day trial includes all of it.
                </p>
              </div>
              <div className="ai-hero-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <AssistantChat />
              </div>
            </div>
          </div>
        </section>

        {/* 1b. The stance, light, between the dark hero and the dark sections below (Stance.jsx). */}
        <Stance />

        {/* 2. The definition, then the four pillars (each links to its section). */}
        <section id="what-is-ai-ready" className="section bg-mktg-page" aria-labelledby="what-is-heading">
          <div className="container">
            <div className="ai-define" data-reveal="">
              {header({
                align: 'left',
                id: 'what-is-heading',
                eyebrow: 'The short answer',
                title: 'What is AI-ready pool service software?',
                className: 'mb-0',
              })}
              <div className="ai-define-answer">
                <p className="ai-define-lead">
                  Software your AI assistant can safely work inside. It reads your business data, sends every event to
                  your other tools, and runs your follow-ups on its own.
                </p>
                <p className="ai-define-detail">
                  In Poolnautics: a built-in MCP server, {WEBHOOK_EVENTS.length} signed webhook events and{' '}
                  <span className="whitespace-nowrap">no-code</span> automations, with hard limits that keep AI away from
                  charges and refunds, and never let it change a price on its own.
                </p>
              </div>
            </div>
            <ul className="ai-pillars" data-reveal="">
              {PILLARS.map(([Icon, tag, title, text, href]) => {
                const body = (
                  <>
                    <span className="ai-pillar-top">
                      <span className="ai-pillar-icon"><Icon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                      <span className="ai-pillar-tag">{tag}</span>
                    </span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </>
                );
                return (
                  <li key={title}>
                    {FULL_PAGE ? (
                      <a href={href} className={`ai-pillar ${FOCUS}`}>
                        {body}
                        <span className="ai-pillar-more">See how <ArrowRight size={14} strokeWidth={2} aria-hidden="true" /></span>
                      </a>
                    ) : <div className="ai-pillar">{body}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {FULL_PAGE && (<>
        {/* 3. Connecting an assistant (MCP): how it works, the connections list, the three levels. */}
        <section id="connect-ai" className="section bg-mktg-base" aria-labelledby="connect-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                align: 'left',
                id: 'connect-heading',
                eyebrow: 'AI assistant · MCP',
                title: 'Connect your AI assistant to Poolnautics',
                subtitle: `Poolnautics has a built-in MCP server with ${MCP_TOOL_COUNT} tools. Paste a token into Claude Code, Cursor, VS Code or any app that connects to an MCP server with a key, and your assistant can look things up and get work done in your real data.`,
              })}
            </div>
            <div className="ai-split">
              <div className="ai-split-text" data-reveal="">
                <h3 className="ai-h3">You decide what it can do</h3>
                <Ticks items={[
                  'Only an owner or admin can create a connection.',
                  'Each connection is named and can be revoked on its own.',
                  'Settings shows each connection’s level and when it was last used.',
                  'One company-wide switch turns all AI access off.',
                  'When connecting, the admin ticks an agreement written for the level they chose.',
                ]}
                />
                <Connections />
              </div>
              <div data-reveal="">
                <h3 className="ai-h3">Three access levels that build on each other</h3>
                <p className="ai-p">Moves go through the same code as your office screen, so history, automations and webhooks all run as if your office made them.</p>
                <AccessLevels />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Guardrails: the money is off limits. */}
        <section id="guardrails" className="section bg-mktg-page" aria-labelledby="guardrails-heading">
          <div className="container">
            <div className="ai-split ai-split--even">
              <div data-reveal="">
                {header({
                  align: 'left',
                  id: 'guardrails-heading',
                  eyebrow: 'Guardrails',
                  title: 'AI that can never touch your money',
                  subtitle: 'Charging and refunding aren’t switched off for the AI. The tools for them don’t exist, at any access level, so there’s nothing to misconfigure and nothing a cleverly worded message can talk it into.',
                  className: 'mb-0',
                })}
                <p className="ai-callout">
                  <ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span>An invoice the AI issues is never charged automatically. The customer pays from the link.</span>
                </p>
              </div>
              <div className="ai-never" data-reveal="">
                <h3 className="ai-never-title">No access level can ever</h3>
                <ul>
                  {NEVER.map((n) => (
                    <li key={n}><Ban size={18} strokeWidth={1.75} aria-hidden="true" />{n}</li>
                  ))}
                </ul>
                <p className="ai-never-foot">Those tools don’t exist.</p>
              </div>
            </div>

            {/* Ask first: the AI proposes new prices; a person approves them in Poolnautics. */}
            <div id="ask-first" className="ai-split ai-ask">
              <div data-reveal="">
                <p className="ai-ask-label">Ask first</p>
                <h3 className="ai-ask-title">Price changes? It asks first.</h3>
                <p className="ai-ask-copy">
                  Turn on Ask first and your assistant can propose new prices, like $10 more a month for every customer
                  who hasn’t had an increase in a year. A proposal changes nothing. An owner or admin opens it in
                  Poolnautics, checks every customer’s price now and new price, leaves anyone out, and approves. A “yes”
                  typed in the chat doesn’t count.
                </p>
                <ul className="ai-dash ai-ask-list">
                  <li>Off until an owner or admin turns it on</li>
                  <li>No customer’s price moves more than {PRICE_PROPOSALS.maxChangePercent}% in one proposal</li>
                  <li>New prices start at each customer’s next bill</li>
                  <li>A price that changed since the proposal is skipped, never overwritten</li>
                  <li>Customers aren’t emailed until you announce it</li>
                  <li>A proposal no one decides expires after {PRICE_PROPOSALS.expiresDays} days</li>
                </ul>
              </div>
              <div className="ai-ask-visual" data-reveal="">
                <PriceProposal />
              </div>
            </div>

            <div className="ai-cards ai-cards--3" data-reveal="">
              <div className="ai-card">
                <Send size={32} strokeWidth={1.75} aria-hidden="true" />
                <h3>Hard limits on what it sends</h3>
                <ul className="ai-dash">
                  <li>No drafts over {SEND_LIMITS.maxInvoice}</li>
                  <li>Not the billing run’s own invoices</li>
                  <li>No drafts with a payment attached</li>
                  <li>No links in its note to the customer</li>
                  <li>At most {SEND_LIMITS.emailsPerDay} customer emails per connection per 24 hours</li>
                  <li>One send per document per connection per 24 hours</li>
                </ul>
              </div>
              <div className="ai-card">
                <History size={32} strokeWidth={1.75} aria-hidden="true" />
                <h3>Every send is on the record</h3>
                <p>Each send shows on the request’s history with the name of the connection that sent it.</p>
                <p className="ai-history">
                  <span className="ai-history-dot" aria-hidden="true" />
                  <span>Invoice INV-1042 sent to Jimmy McGill by <b>Office laptop (AI assistant)</b></span>
                </p>
              </div>
              <div className="ai-card">
                <KeyRound size={32} strokeWidth={1.75} aria-hidden="true" />
                <h3>Records are information, not instructions</h3>
                <p>
                  The AI is told that text inside your records, like a lead’s message or a note, is information and
                  never instructions to follow. A guard against prompt injection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4b. The technician app: no AI, on purpose. */}
        <section id="technician-app" className="section bg-mktg-base" aria-labelledby="tech-app-heading">
          <div className="container">
            <div className="ai-split ai-split--tech">
              <div data-reveal="">
                {header({
                  align: 'left',
                  id: 'tech-app-heading',
                  eyebrow: 'The technician app',
                  title: 'Does the technician app use AI? No, on purpose.',
                  subtitle: 'AI works in the office. The tech app is the bridge between visits: the route, the readings, the photos, done. Nothing new to learn, so a tech can run it on day one.',
                  className: 'mb-0',
                })}
                <Ticks items={TECH_APP} className="ai-tech-ticks" />
                <p className="ai-tech-close">Built to be the easiest app your techs have ever used.</p>
                <a href="/tech-app" className={`ai-link ${FOCUS}`}>See the technician app <ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></a>
              </div>
              <div className="ai-tech-visual" data-reveal="">
                <TechPhone />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Webhooks: the events, a live-looking delivery log beside a real payload, then delivery. */}
        <section id="webhooks" className="section bg-mktg-page" aria-labelledby="webhooks-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                id: 'webhooks-heading',
                eyebrow: 'Webhooks',
                title: 'Webhooks for every pool service event',
                subtitle: `${WEBHOOK_EVENTS.length} events, from the first lead to the last salt cell clean, sent to Zapier, n8n, Make or your own app the moment they happen. Signed, retried and logged.`,
              })}
            </div>
            <div className="ai-events" data-reveal="">
              {WEBHOOK_GROUPS.map(([group, events]) => (
                <div key={group} className="ai-event-group">
                  <h3>{group}</h3>
                  <ul>{events.map((e) => <li key={e}><code>{e}</code></li>)}</ul>
                </div>
              ))}
            </div>
            <p className="ai-note" data-reveal="">
              Visit, payment, pause and equipment events fire whoever makes the change: the office, a technician’s
              phone, a payment or a background job. Plus a test ping, any time.
            </p>
            <div className="ai-feed-grid" data-reveal="">
              <EventFeed />
              <Code title="visit.completed" label="Payload" code={formatJson(SAMPLE_PAYLOAD)} highlight={'"event"'} />
            </div>
            <ul className="ai-facts" data-reveal="">
              <li>
                <h3>Signed</h3>
                <p><code>{WEBHOOK_SIGNATURE_HEADER}: t=&lt;unix&gt;,v1=&lt;HMAC-SHA256&gt;</code>. Reject anything older than {WEBHOOK_MAX_AGE_MIN} minutes.</p>
              </li>
              <li>
                <h3>Retried</h3>
                <p>Over about {WEBHOOK_RETRIES.hours} hours ({WEBHOOK_RETRIES.attempts} attempts), with the same event id every time, then marked failed.</p>
              </li>
              <li>
                <h3>Logged</h3>
                <p>A delivery log in Settings with the exact payload of each delivery, and Retry now.</p>
              </li>
              <li>
                <h3>Protected</h3>
                <p>Up to {WEBHOOK_LIMIT} webhooks per company. Private addresses are refused (SSRF protection).</p>
              </li>
            </ul>
          </div>
        </section>

        {/* 6. Automations: the builder as a timeline, what it can do, then six recipes. */}
        <section id="automations" className="section bg-mktg-base" aria-labelledby="automations-heading">
          <div className="container">
            <div className="ai-split ai-split--flow">
              <div data-reveal="">
                {header({
                  align: 'left',
                  id: 'automations-heading',
                  eyebrow: 'Automations',
                  title: 'Pool service automations, no code required',
                  subtitle: 'Pick what starts it, add up to five actions with a wait before each, and Poolnautics follows up for you: new leads, unapproved estimates, failed payments, finished jobs.',
                  className: 'mb-0',
                })}
                <div className="ai-auto-facts">
                  <div>
                    <h3 className="ai-h3"><span className="font-tnum">{TRIGGER_COUNT}</span> triggers</h3>
                    <p className="ai-p">{TRIGGER_EXAMPLES.slice(0, 7).join(' · ')}, and more.</p>
                  </div>
                  <div>
                    <h3 className="ai-h3"><span className="font-tnum">{ACTIONS.length}</span> actions</h3>
                    <p className="ai-p">{ACTIONS.join(' · ')}.</p>
                  </div>
                  <div>
                    <h3 className="ai-h3">Steps, conditions and timing</h3>
                    <Ticks items={[
                      `Up to ${AUTOMATION_LIMITS.actions} actions per automation, each with its own wait (${AUTOMATION_LIMITS.waitDays} days in all).`,
                      `Up to ${AUTOMATION_LIMITS.conditions} “only if” conditions, checked again just before sending.`,
                      'Sending hours, so nobody gets a text at 10 PM.',
                      '“Not twice”: holds back if they heard from another automation recently. Never for money messages.',
                      'Replies of STOP are honored automatically.',
                    ]}
                    />
                  </div>
                </div>
              </div>
              <div data-reveal="">
                <AutomationFlow />
              </div>
            </div>

            <div className="ai-recipes" data-reveal="">
              <h3 className="ai-recipes-title"><span className="font-tnum">{RECIPE_COUNT}</span> ready-made recipes, including</h3>
              <ul>
                {RECIPES.map((r) => (
                  <li key={r.title} className="ai-recipe">
                    <span className="ai-recipe-when">When: {r.when.toLowerCase()}</span>
                    <b>{r.title}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Leads in. */}
        <section id="leads" className="section bg-mktg-page" aria-labelledby="leads-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                id: 'leads-heading',
                eyebrow: 'Lead capture',
                title: 'Capture pool service leads from any form or ad',
                subtitle: 'Every company gets a lead link. Point your website forms and lead ads at it, no code, and every lead lands in Poolnautics with its source, ready for follow-up.',
              })}
            </div>
            <div data-reveal="">
              <LeadFlow />
            </div>
            <p className="ai-note ai-note--center" data-reveal="">
              Sources: {LEAD_SOURCES.join(', ')} and more.
            </p>
          </div>
        </section>

        {/* 8. Texting and team tools. */}
        <section id="texting" className="section bg-mktg-base" aria-labelledby="texting-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                align: 'left',
                id: 'texting-heading',
                eyebrow: 'Texting & team',
                title: 'Texting and team integrations for pool companies',
                subtitle: 'Texts go out from your own business number, the office hears about what matters in Slack, and one message can reach your whole route.',
              })}
            </div>
            <div className="ai-cards ai-cards--3" data-reveal="">
              <div className="ai-card">
                <MessageSquare size={32} strokeWidth={1.75} aria-hidden="true" />
                <h3>Text from your business number</h3>
                <p>Connect {SMS_PROVIDERS.slice(0, -1).join(', ')} or {SMS_PROVIDERS.at(-1)} with your own API key, stored encrypted. Customers see your number, not ours.</p>
                <ul className="ai-chips" aria-label="Works with">
                  {SMS_PROVIDERS.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <div className="ai-card">
                <Hash size={32} strokeWidth={1.75} aria-hidden="true" />
                <h3>Post to Slack</h3>
                <p>Any automation can post to Slack: a new lead, a failed payment, a pool with high phosphate. The office sees it where they already talk.</p>
                <ul className="ai-chips" aria-label="Works with"><li>Slack</li></ul>
              </div>
              <div className="ai-card">
                <Mail size={32} strokeWidth={1.75} aria-hidden="true" />
                <h3>Bulk text and email from the office</h3>
                <p>Email up to {BULK.emails} customers per send, with merge tags. Text up to {BULK.texts} per send, between {BULK.textHours} only.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. For builders: the API, the lead link, webhook signing, and a signature check. */}
        <section id="developers" className="section bg-mktg-page" aria-labelledby="developers-heading">
          <div className="container">
            <div className="ai-split ai-split--code">
              <div data-reveal="">
                {header({
                  align: 'left',
                  id: 'developers-heading',
                  eyebrow: 'For builders',
                  title: 'Pool service software API for developers',
                  subtitle: 'Add customers and leads from your own systems, and verify every webhook Poolnautics sends.',
                  className: 'mb-0',
                })}
                <div className="ai-dev">
                  <div>
                    <h3 className="ai-h3">The API</h3>
                    <Ticks items={[
                      'A bearer key per company, which you can rotate.',
                      'Endpoints to add customers, with their rate and billing cycle, and leads.',
                      `Up to ${API_MAX_POST} per post.`,
                      'Docs with field-by-field references, and signature checks in Node.js and Python.',
                    ]}
                    />
                  </div>
                  <div>
                    <h3 className="ai-h3">The lead link</h3>
                    <p className="ai-p">No key to keep secret: forms and lead-ad tools post straight to it.</p>
                  </div>
                  <div>
                    <h3 className="ai-h3">Webhook signing</h3>
                    <p className="ai-p">HMAC-SHA256 over the timestamp and the raw body, with your company’s secret. The same event id on every retry.</p>
                  </div>
                </div>
                <div className="ai-cta-row ai-cta-row--left">
                  <DocsCta />
                </div>
              </div>
              <div data-reveal="">
                <Code title="verify-webhook.js" label="Node.js" lang="js" code={SIGNATURE_SNIPPET} />
              </div>
            </div>
          </div>
        </section>

        {/* 10. The buyer's checklist. */}
        <section id="checklist" className="section bg-mktg-base" aria-labelledby="checklist-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                id: 'checklist-heading',
                eyebrow: 'Buyer’s checklist',
                title: 'What to look for in AI-ready pool service software',
                subtitle: 'Eight things that separate real AI and automation from a chatbot bolted on, and how Poolnautics handles each.',
              })}
            </div>
            <div className="ai-table-wrap" data-reveal="">
              <table className="ai-table">
                <caption className="sr-only">What to look for, and how Poolnautics does it</caption>
                <thead>
                  <tr>
                    <th scope="col">What to look for</th>
                    <th scope="col">How Poolnautics does it</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST.map(([what, how], i) => (
                    <tr key={what}>
                      <th scope="row"><span className="ai-table-n font-tnum" aria-hidden="true">{i + 1}</span>{what}</th>
                      <td>{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 11. FAQ: the same list feeds the FAQPage JSON-LD (structuredData above). */}
        <section id="faq" className="section bg-mktg-page" aria-labelledby="faq-heading">
          <div className="container ai-faq">
            <div data-reveal="">
              {header({
                align: 'left',
                id: 'faq-heading',
                eyebrow: 'FAQ',
                title: 'AI and integrations questions, answered',
                subtitle: <>Can’t find yours? <a href="/contact">Ask us anything</a>.</>,
                className: 'mb-0',
              })}
            </div>
            <div className="ai-faq-list" data-reveal="">
              {FAQ.map((f, i) => (
                <details key={f.q} className="ai-faq-item" open={i === 0}>
                  <summary>
                    <h3>{f.q}</h3>
                    <span className="ai-faq-icon" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Closing CTA. */}
        <section className="section ai-close" aria-labelledby="close-heading">
          <div className="container" data-reveal="">
            {header({
              id: 'close-heading',
              title: 'Put AI to work on your pool route',
              subtitle: `Everything on this page is in ${AI_PLAN}, and the ${TRIAL_DAYS}-day trial includes all of it.`,
              className: 'mb-0',
            })}
            <div className="ai-cta-row ai-cta-row--center">
              <PrimaryCta theme={theme} />
              <DocsCta />
            </div>
          </div>
        </section>
        </>)}
      </main>
      <Footer />
      {FULL_PAGE && <SectionNav />}
    </div>
  );
}
