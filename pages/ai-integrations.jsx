import React, { useRef } from 'react';
import {
  ArrowRight, BookOpen, Bot, CalendarDays, Check, Hash, Mail, MessageSquare, Webhook, Workflow, Inbox,
} from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import Nav from '../landing/Nav.jsx';
import AssistantChat from '../landing/ai/AssistantChat.jsx';
import HeroFx from '../landing/ai/HeroFx.jsx';
import EventFeed from '../landing/ai/EventFeed.jsx';
import Automations from '../landing/ai/Automations.jsx';
import McpDiagram from '../landing/ai/McpDiagram.jsx';
import LeadFlow from '../landing/ai/LeadFlow.jsx';
import TechPhone from '../landing/ai/TechPhone.jsx';
import Stance from '../landing/ai/Stance.jsx';
import Routine from '../landing/ai/Routine.jsx';
import Guardrails from '../landing/ai/Guardrails.jsx';
import Morning from '../landing/ai/Morning.jsx';
import Code, { formatJson } from '../landing/ai/Code.jsx';
import useReveal from '../landing/ai/useReveal.js';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { FOCUS, PrimaryCta, Ticks, header, headerLight } from '../landing/ai/shared.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import { Footer } from '../components/site-chrome.jsx';
import {
  ACTIONS, AI_PLAN, API_DOCS_URL, API_MAX_POST, AUTOMATION_LIMITS, BULK, LEAD_SOURCES, MCP_CLIENTS, MCP_TOOL_COUNT, PRICE_PROPOSALS,
  SAMPLE_PAYLOAD, SEND_LIMITS, SMS_PROVIDERS, TECH_APP, TRIAL_DAYS, TRIGGER_COUNT, WEBHOOK_EVENTS, WEBHOOK_GROUPS, WEBHOOK_LIMIT,
  WEBHOOK_MAX_AGE_MIN, WEBHOOK_RETRIES, WEBHOOK_SIGNATURE_HEADER,
} from '../aiFacts.js';

// /ai-and-automations: AI, automations and integrations. Pre-rendered at build time
// (entry-server.jsx → dist/ai-and-automations.html), so crawlers that don't run JavaScript get the
// whole page; main.jsx hydrates it. So: no window or document while rendering, and every
// mockup's text in the markup from the start. Numbers and lists come from aiFacts.js; claim
// nothing that isn't there. Owners first, developers lower down. All dark, on the --mktg-*
// tokens, with white and light sections between the dark ones; styles in landing/ai/ai.css.
// Blocks with data-reveal fade up on scroll (useReveal).

const ORIGIN = 'https://getpoolnautics.com';
// Published so far (2026-11-14 order): the hero, "The routine runs itself", Automations, the stance,
// "The short answer", Connect your AI (#connect-ai), then (not live yet) Guardrails and the technician
// app, then Lead capture (#leads, live); the rest follows them here, hidden. True
// brings back the rest of the page, with its FAQ in the JSON-LD and every pillar's link to its
// section. The live FAQ (AUTOMATION_FAQ, #automation-faq) is always on, with its own FAQPage JSON-LD:
// merge the two FAQs before publishing the rest, so the page has one. To preview the whole page
// locally without publishing it: VITE_AI_FULL_PAGE=1 npx vite.
const FULL_PAGE = import.meta.env.VITE_AI_FULL_PAGE === '1';
const PUBLISHED = new Set(['#automations', '#connect-ai', '#leads']); // the pillars' sections that are live
const PAGE_URL = `${ORIGIN}/ai-and-automations`;

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

// The live FAQ at the foot of the page (#automation-faq), and its FAQPage JSON-LD (structuredData):
// one list for both, so they can't drift apart. Checked against the app 2026-11-15.
const AUTOMATION_FAQ = [
  {
    q: 'What is pool service automation software?',
    a: 'Pool service automation software, also called pool service management software or pool business software, handles a pool company’s recurring work automatically: billing reminders, lead follow-ups, customer messages and service notifications.',
  },
  {
    q: 'Can I connect ChatGPT to my pool service software?',
    a: 'Yes. Poolnautics has a built-in MCP server, so ChatGPT, Claude or Grok can look up customers and invoices and take the actions you allow. It can never charge a card, refund a payment or change a price without your approval.',
  },
  {
    q: 'Can pool service software automate customer follow-ups?',
    a: 'Yes. Poolnautics includes configurable workflows that can automatically send text messages, emails and notifications based on business events, timing and conditions.',
  },
  {
    q: 'Does pool service billing software send invoices and reminders automatically?',
    a: 'Yes. Recurring invoices go out on schedule, and customers on autopay are charged automatically. Overdue reminders go out on schedule, late fees follow your rules, and a failed autopay payment is retried, with the customer emailed a link to update their card if it still can’t go through.',
  },
  {
    q: 'Does Poolnautics have a built-in AI chatbot?',
    a: 'Poolnautics provides built-in automations and integrations for connecting external AI assistants. You can bring your preferred AI rather than being locked into a proprietary chatbot.',
  },
  {
    q: 'Does Poolnautics support API and webhook integrations?',
    a: 'Yes. Poolnautics provides API access, webhook events and an MCP server for connecting external applications, automation platforms and AI assistants.',
  },
  {
    q: 'Which plan includes AI and automations?',
    a: `AI connections, automations and integrations are included in the ${AI_PLAN} plan. The ${TRIAL_DAYS}-day trial includes all of it.`,
  },
];

/** JSON-LD for <head>, written there by the pre-renderer (entry-server.jsx). */
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'Pool Service Automation Software with AI',
    description: 'Pool service software that automates billing, lead follow-ups and reminders on its own. Connect ChatGPT, Claude or Grok to your pool business. 30-day trial.',
    inLanguage: 'en-US',
    dateModified: '2026-11-22',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    about: { '@id': `${ORIGIN}/#software` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'AI & automations', item: PAGE_URL },
    ],
  },
  ...(FULL_PAGE ? [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }] : []),
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: AUTOMATION_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];

// [icon, tag, title, text, the section it links to]
const PILLARS = [
  [Workflow, 'No-code', 'Automatic follow-ups', 'Texts, emails and alerts go out on their own, with waits, conditions and quiet hours.', '#automations'],
  [Bot, `${MCP_TOOL_COUNT} MCP tools`, 'Your AI, connected', 'Ask who owes what, assign requests and send invoices from the AI you already use.', '#connect-ai'],
  [Inbox, 'Forms + ads', 'Leads from anywhere', 'Your lead link catches forms and ad leads, tags the source and starts the follow-up.', '#leads'],
  [Webhook, `${WEBHOOK_EVENTS.length} webhooks`, 'Every event streams out', 'New leads, finished visits and failed payments, sent to Zapier, n8n or your own app.', '#webhooks'],
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

/* ---------- Small shared pieces (the rest: landing/ai/shared.jsx) ---------- */

function DocsCta() {
  return (
    <a href={API_DOCS_URL} className={`ai-cta-ghost cta-secondary ${FOCUS}`}>
      <BookOpen size={17} strokeWidth={1.75} aria-hidden="true" />
      Read the API docs
    </a>
  );
}

/** The hero's second button: a walkthrough, requested on the contact page (its "Get a demo" tab, the
 *  default; the office replies to set up a time). Styled as DocsCta. */
function WalkthroughCta() {
  return (
    <a href="/contact" className={`ai-cta-ghost cta-secondary ${FOCUS}`}>
      <CalendarDays size={17} strokeWidth={1.75} aria-hidden="true" />
      Book a walkthrough
    </a>
  );
}

/** The trial button at the foot of a section: the hero's, centered, 48px below the section's content. */
function SectionCta({ theme }) {
  return (
    <div className="ai-cta-row ai-cta-row--center ai-cta-row--section" data-reveal="">
      <PrimaryCta theme={theme} />
    </div>
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
                <HeroHeading id="ai-hero-title" eyebrow="Pool service automation" title="Pool Service Automation Software That Handles the Routine for You">
                  Poolnautics is pool service software with the automations already built in: lead follow-ups, overdue
                  reminders, failed-payment links and review requests. For everything else, securely connect ChatGPT, Claude, Grok or your own AI to
                  your pool service data.
                </HeroHeading>
                <div className="ai-cta-row">
                  <PrimaryCta theme={theme} />
                  <WalkthroughCta />
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

        {/* 2. The routine runs itself (white): what runs on its own beside what you'd ask your AI for (Routine.jsx). */}
        <Routine />

        {/* 3. Automations (light): pick a built-in follow-up on the left, see it run on the right (Automations.jsx). */}
        <section id="automations" className="section ai-light bg-slate-50" data-theme="light" aria-labelledby="automations-heading">
          <div className="container">
            <Automations
              focus={FOCUS}
              header={headerLight({
                align: 'left',
                id: 'automations-heading',
                eyebrow: 'Automations',
                // "follow-up" never breaks across lines.
                title: <>Pool service billing and <span className="whitespace-nowrap">follow-up</span> automations, built in.</>,
                subtitle: [
                  'If a text fails, it’s sent again. Nothing goes out twice. Nothing goes out during quiet hours. You don’t set any of that up.',
                  'An automation here is just a process that’s been standardized: lead follow-up, onboarding, turning estimates into jobs, recurring invoices, fleet.',
                ],
                className: 'mb-0',
              })}
            />
            <SectionCta theme={theme} />
          </div>
        </section>

        {/* 4. The stance, white, after Automations (Stance.jsx). */}
        <Stance />

        {/* 5. The definition, then the four pillars (each links to its section): dark. */}
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
                  <span className="whitespace-nowrap">no-code</span> automations, with hard limits: no charges, no refunds,
                  and no price change without your approval.
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
                    {/* A link only once its section is published. */}
                    {FULL_PAGE || PUBLISHED.has(href)
                      ? <a href={href} className={`ai-pillar ${FOCUS}`}>{body}</a>
                      : <div className="ai-pillar">{body}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 6. Connecting an assistant (MCP): the levels, the hub and what each level can do (McpDiagram.jsx). */}
        <section id="connect-ai" className="section ai-connect" aria-labelledby="connect-heading">
          <div className="container">
            <div className="section-head section-head--center ai-connect-head" data-reveal="">
              <p className="section-eyebrow ai-eyebrow">AI assistant · MCP</p>
              <h2 id="connect-heading" className="section-title text-mktg-primary">
                Connect Claude, ChatGPT or Grok <span className="ai-break">to your pool service software</span>
              </h2>
              <p className="section-sub text-mktg-muted">
                Your assistant gets {MCP_TOOL_COUNT} tools. You choose how far it can go.
              </p>
              <p className="ai-works">
                <span className="ai-works-label">Works with</span>
                {['Claude', 'ChatGPT', 'Grok', ...MCP_CLIENTS, 'Your own agent'].map((c) => <span key={c}>{c}</span>)}
              </p>
            </div>
            <div data-reveal="">
              <McpDiagram />
            </div>
            <div className="ai-connect-foot" data-reveal="">
              <p>
                <strong>You stay in control.</strong> Only an owner or admin can connect an assistant, and any connection can
                be revoked on its own.
              </p>
              <a href="/claude" className={`ai-link ${FOCUS}`}>Using Claude? See Poolnautics for Claude <ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></a>
            </div>
            <SectionCta theme={theme} />
          </div>
        </section>

        {/* 7. Guardrails (white): ask it for something it shouldn't do (Guardrails.jsx). */}
        <Guardrails focus={FOCUS} cta={<SectionCta theme={theme} />} />

        {/* 8. The technician app (light grey): no AI, on purpose. Ends with the page's call to action. */}
        <section id="technician-app" className="section ai-light ai-tech bg-slate-50" data-theme="light" aria-labelledby="tech-app-heading">
          <div className="container">
            <div className="ai-split ai-split--tech">
              <div data-reveal="">
                {headerLight({
                  align: 'left',
                  id: 'tech-app-heading',
                  eyebrow: 'The technician app',
                  title: 'A pool service app your techs can run on day one. No AI, on purpose.',
                  subtitle: 'AI works in the office. The pool service app is the bridge between visits: the route, the readings, the photos, done. Nothing new to learn, so a tech can run it on day one.',
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
            <div className="ai-tech-cta" data-reveal="">
              <PrimaryCta theme={theme} />
              <p>The {TRIAL_DAYS}-day trial includes all of it.</p>
            </div>
          </div>
        </section>

        {/* 9. Leads in (live since 2026-11-14), under the technician app. */}
        <section id="leads" className="section bg-mktg-page" aria-labelledby="leads-heading">
          <div className="container">
            <div data-reveal="">
              {header({
                id: 'leads-heading',
                eyebrow: 'Lead capture',
                title: 'Capture pool service leads from any form or ad',
                subtitle: 'Every company gets a lead link. Point your website forms and lead ads at it, no code, and every pool service lead lands in Poolnautics with its source, ready for follow-up.',
              })}
            </div>
            <div data-reveal="">
              <LeadFlow />
            </div>
            <p className="ai-note ai-note--center" data-reveal="">
              Sources: {LEAD_SOURCES.join(', ')} and more.
            </p>
            <SectionCta theme={theme} />
          </div>
        </section>

        {FULL_PAGE && (<>
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

        {/* 5. Webhooks: the events, a live-looking delivery log beside a real payload, then delivery. */}
        <section id="webhooks" className="section bg-mktg-base" aria-labelledby="webhooks-heading">
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

        {/* 11b. Call to action (light), before the FAQ. */}
        <section className="section ai-light ai-cta-band" data-theme="light" aria-labelledby="cta-band-heading">
          <div className="container" data-reveal="">
            <h2 id="cta-band-heading" className="ai-cta-band-title">Software your AI assistant can safely work inside.</h2>
            <p className="ai-cta-band-sub">
              It reads your business data, sends every event to your other tools, and runs your follow-ups on its own.
            </p>
            <div className="ai-cta-row ai-cta-row--center">
              <PrimaryCta theme={theme} />
              <a href={API_DOCS_URL} className={`ai-text-link ${FOCUS}`}>Read the API docs</a>
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

        {/* The FAQ (light, live): the last section. Question left, answer right, as in .ai-define;
            every answer shown, and the same list as the FAQPage JSON-LD (AUTOMATION_FAQ). */}
        <section id="automation-faq" className="section ai-light bg-slate-50" data-theme="light" aria-labelledby="automation-faq-heading">
          <div className="container">
            <div data-reveal="">
              {headerLight({
                align: 'left',
                id: 'automation-faq-heading',
                eyebrow: 'FAQ',
                title: 'Pool service automation software FAQ',
                className: 'mb-0',
              })}
            </div>
            <div className="ai-qa" data-reveal="">
              {AUTOMATION_FAQ.map((f) => (
                <div key={f.q} className="ai-qa-row">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The closing section (dark): what ran overnight, and the button (Morning.jsx). */}
        <Morning theme={theme} />
      </main>
      <Footer />
    </div>
  );
}
