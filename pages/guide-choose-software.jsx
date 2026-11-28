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
import { CHOOSE_GUIDE_PATH, CHOOSE_GUIDE_DESCRIPTION, CHOOSE_GUIDE_H1, CHOOSE_GUIDE_LEDE } from '../landing/guides/chooseSoftwareMeta.js';

// /guides/how-to-choose-pool-service-software: the third guide, built from the owner's content reference
// (choose-pool-software-guide.html, 2026-11-27): its copy, order, links, example numbers and component
// choices, on the first guide's template (pages/guide-raise-prices.jsx, landing/guides/guide.css). One h1,
// an h2 per part, h3s for Part 3's three groups. The software cost calculator is the first guide's
// break-even calculator with three outputs; the contents list's current part is GuideToc.jsx; the
// checklist is the first guide's (ticks aren't saved). Everything is in the pre-rendered markup, the
// calculator showing its default result. Structured data as the first guide: Article and BreadcrumbList,
// no FAQPage (Part 11 is a plain list). No competitor product is named.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}${CHOOSE_GUIDE_PATH}`;

// Its image (the share image) is added in entry-server.jsx from ROUTE_META, where the PNG's path lives.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${PAGE_URL}#article`,
    headline: CHOOSE_GUIDE_H1,
    description: CHOOSE_GUIDE_DESCRIPTION,
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
      { '@type': 'ListItem', position: 3, name: 'How to choose pool service software', item: PAGE_URL },
    ],
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ---------- Hero ---------- */

// One icon each: the first guide's calculator, a question in a speech bubble, the first guide's checklist box.
const SHORTCUTS = [
  ['calc', 'Software cost calculator', <><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></>],
  ['questions', 'Seven questions to ask', <><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>],
  ['checklist', 'Trial checklist', <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8.5 12.2l2.4 2.4 4.6-5" /></>],
];

function HeroPricing() {
  return (
    <div className="gd-vis" role="img" aria-label="An example company with 150 pools and 3 technicians: $300 a month when priced per pool, $245 a month when priced per technician, a $660 difference over a year. Rule of thumb: software typically costs around 1 percent of monthly recurring billing.">
      <div className="gd-vis-card">
        <span className="gd-vis-k">Example: 150 pools, 3 techs, per month</span>
        <div className="gd-vis-r"><span>Priced per pool</span><b>$300</b></div>
        <div className="gd-vis-r is-credit"><span>Priced per technician</span><b>$245</b></div>
        <div className="gd-vis-r is-total"><span>Difference over a year</span><b>$660</b></div>
      </div>
      <div className="gd-vis-next">
        <span className="gd-vis-k">Rule of thumb</span>
        <div className="gd-vis-r"><span>Software budget</span><b>1%</b></div>
        <small>Of your monthly recurring billing. Then compare what’s included.</small>
      </div>
    </div>
  );
}

/* ---------- Part 4: the software cost calculator ---------- */

/** 1500 → "1,500" (no Intl, so the server and the browser always write the same thing). */
const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const money = (n) => `$${thousands(Math.round(n))}`;
/** Empty or negative input counts as 0. */
const num = (s) => Math.max(0, parseFloat(s) || 0);
/** cost ÷ billing as a percentage, one decimal, rounded half up (300 of 24,000 → "1.3%"). */
const share = (cost, billing) => `${(Math.round((cost * 1000) / billing) / 10).toFixed(1)}%`;
/** "1.3% of your billing. $600 at twice your size", or only the second part when there's no billing. */
const secondLine = (cost, twice, billing) => `${billing > 0 ? `${share(cost, billing)} of your billing. ` : ''}${money(twice)} at twice your size`;

// Example rates (the reference's): $2 a pool; $50 a month plus $65 a technician.
const PER_POOL = 2;
const TECH_BASE = 50;
const PER_TECH = 65;

function Calculator() {
  const [n, setN] = useState('150');
  const [t, setT] = useState('3');
  const [b, setB] = useState('24000');
  const pools = num(n);
  const techs = num(t);
  const billing = num(b);
  const perPool = pools * PER_POOL;
  const perTech = TECH_BASE + PER_TECH * techs;
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
      <p className="gd-calc-h">Software cost calculator</p>
      <div className="gd-calc-in">
        {field('sc-n', 'Pools you service', n, setN, { mode: 'numeric', min: 1 })}
        {field('sc-t', 'Technicians', t, setT, { mode: 'numeric', min: 1 })}
        {field('sc-b', 'Your billing, per month', b, setB, { prefix: '$', mode: 'decimal', min: 0 })}
      </div>
      <div className="gd-calc-out" aria-live="polite">
        <div className="gd-out">
          <span>Priced per pool, at $2 each</span>
          <b>{money(perPool)} a month</b>
          <span>{secondLine(perPool, pools * PER_POOL * 2, billing)}</span>
        </div>
        <div className="gd-out">
          <span>Priced per technician, at $50 + $65 each</span>
          <b>{money(perTech)} a month</b>
          <span>{secondLine(perTech, TECH_BASE + PER_TECH * 2 * techs, billing)}</span>
        </div>
        <div className="gd-out is-key is-wide">
          <span>A reasonable budget for your size</span>
          <b>About {money(billing * 0.01)} a month</b>
          <span>around 1% of your monthly recurring billing</span>
        </div>
      </div>
      <p className="gd-calc-fine">Example rates, not quotes. Use each vendor’s real prices, then run it again at twice your size.</p>
    </div>
  );
}

/* ---------- Part 10 and the contents ---------- */

// Eleven steps; ticks aren't saved, so they reset on reload (as the first guide's).
const STEPS = [
  'Import ten real customers, or have the vendor do it',
  'Build one real route and reorder it',
  'Finish a stop on your phone with no signal',
  'Send yourself a service report and read it as a customer would',
  'Create a recurring invoice and pay it from your phone',
  'Ask to see what happens when a card fails',
  'Send a quote and approve it as the customer',
  'Run the office from your phone for a day',
  'Contact support with a real question and time the reply',
  'Export your data',
  'Price it at your size, and at twice your size',
];

const TOC = [
  ['need', 'Start with what you need'],
  ['types', 'Pool-specific or general?'],
  ['features', 'The features that matter'],
  ['cost', 'What it should cost'],
  ['money', 'Where your money goes'],
  ['questions', 'Seven questions to ask'],
  ['switching', 'Switching and your data'],
  ['support', 'Support and the company'],
  ['ai', 'AI and integrations'],
  ['trial', 'How to run a trial'],
  ['faq', 'Common questions'],
];

const Part = ({ n }) => <span className="gd-num"><i>{n}</i>Part {n}</span>;

/* ---------- The page ---------- */

export default function GuideChooseSoftwarePage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg guide-page relative min-h-screen font-sans antialiased">
      <Nav tone="light" overlay />
      <main>
        <header className="gd-hero">
          <div className="container">
            <div className="gd-hero-grid">
              <div>
                <p className="gd-eyebrow">Buyer’s guide for pool companies</p>
                <h1>{CHOOSE_GUIDE_H1}</h1>
                <p className="gd-lede">{CHOOSE_GUIDE_LEDE}</p>
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
              <HeroPricing />
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
                  <li>Write down what you need at your size before you look at any feature list.</li>
                  <li>Work out the real monthly cost today, and again at twice your size.</li>
                  <li>Find out where your money lands and who owns your customer data.</li>
                  <li>Ask every vendor the same seven questions.</li>
                  <li>Run a real trial with your own customers before you commit.</li>
                </ol>
              </div>

              <section id="need" aria-labelledby="need-title">
                <Part n={1} />
                <h2 id="need-title">Start with what you need</h2>
                <p>Every pool software has a long feature list, and every demo looks good. The way to keep your head is to decide what you need before you watch one. What that is depends mostly on your size.</p>
                <ul className="gd-list">
                  <li><b>One truck, under about 75 pools.</b> You need invoices that go out and get paid without you, a simple route, a report your customers receive after each stop, and all of it working from your phone. You don’t need much else yet.</li>
                  <li><b>Two to five technicians.</b> Now you need to hand routes to other people and know the work was done: required readings and photos, a record of who did what, and an office view that doesn’t depend on you being in the truck. Quotes and repairs start to matter here.</li>
                  <li><b>Six technicians and up.</b> You need permissions for office staff, reporting by route and by tech, automations that replace manual follow-up, fleet and mileage records, and a clean handoff to your accountant.</li>
                </ul>
                <p>Then think one size ahead. Switching software with 400 customers is far harder than choosing well at 80, so the right pick is one that fits you now and still fits when you’ve doubled.</p>
                <div className="gd-pull"><p>The best software is the one your techs will actually use.</p><p>And the one your office doesn’t have to babysit.</p></div>
              </section>

              <section id="types" aria-labelledby="types-title">
                <Part n={2} />
                <h2 id="types-title">Pool-specific or general field service software?</h2>
                <p>You’ll come across two families of software. Some is built only for pool service. Some is built for any trade that sends people to houses, such as plumbers, lawn care and cleaners, and is sold to pool companies too.</p>
                <ul className="gd-list">
                  <li><b>Pool-specific software</b> is built around a weekly route that repeats. It logs water readings and chemicals for each pool, keeps that history, and sends the customer a service report. Billing is designed for a flat monthly rate with extras added on.</li>
                  <li><b>General field service software</b> is strongest at one-off jobs: schedule it, quote it, invoice it. It usually has no place for chemical readings or dosing history, and a route of 60 identical weekly stops can be awkward to manage in it.</li>
                </ul>
                <div className="gd-note"><p><b>A simple test.</b> If weekly service is most of your revenue, start with pool-specific software. If most of your money comes from repairs, renovations or other trades, a general tool may suit you better.</p></div>
              </section>

              <section id="features" aria-labelledby="features-title">
                <Part n={3} />
                <h2 id="features-title">The features that matter, and how to test each</h2>
                <p>These are the jobs the software has to do. For each one, here’s what good looks like and one thing to ask or try.</p>
                <h3>Getting paid</h3>
                <ul className="gd-list">
                  <li><b>Recurring billing and autopay.</b> Invoices should be created and cards charged on schedule without anyone pressing a button. It should handle monthly, quarterly and yearly customers, and add chemicals or extra work to the next invoice automatically. Ask: “What does a person have to do each month for invoices to go out?” The right answer is nothing.</li>
                  <li><b>Failed payments and collections.</b> Cards fail every month. Good software retries them, tells the customer, applies your late fee, and can pause service for accounts that don’t pay. Ask to see exactly what happens on day 1, day 15 and day 30 of an unpaid invoice.</li>
                </ul>
                <h3>Doing the work</h3>
                <ul className="gd-list">
                  <li><b>Routes and scheduling.</b> You should be able to build a recurring route, reorder it by dragging, and move a whole day to another tech when someone calls out. Ask whether route optimization is included or costs extra.</li>
                  <li><b>The technician app.</b> Logging a stop should take seconds, not minutes, and it has to work with no signal. Look for required readings and required photos, so a report can’t be sent half finished.</li>
                  <li><b>Service reports.</b> After each stop the customer should get a clear photo of their pool with that day’s readings, automatically. For you, each report should record when and where it was sent.</li>
                  <li><b>Water chemistry.</b> Readings and chemicals should be logged per pool with full history, so you can see which pools are out of balance and which ones are costing you the most in chemicals.</li>
                  <li><b>Quotes, repairs and work orders.</b> A repair should flow from quote to customer approval to work order to invoice without anyone retyping it.</li>
                </ul>
                <h3>Running the office</h3>
                <ul className="gd-list">
                  <li><b>Customer messages.</b> Email is standard. If you want texting, ask whether texts are included or billed per message.</li>
                  <li><b>Reports for the owner.</b> At a minimum: what you billed, what’s overdue, and what each stop costs you. If you can’t see profit per customer, you can’t price properly.</li>
                  <li><b>The office on your phone.</b> Many tools give technicians a good app and leave billing and customers on a desktop. If you run the company from a truck, check that the whole thing works on a phone.</li>
                </ul>
              </section>

              <section id="cost" aria-labelledby="cost-title">
                <Part n={4} />
                <h2 id="cost-title">What it should cost</h2>
                <p>Software typically costs around 1% of your monthly recurring billing. What makes prices hard to compare is that vendors charge in different ways, and the cheapest at your size today may not be the cheapest after you grow.</p>
                <ul className="gd-list">
                  <li><b>Per pool or service location.</b> Commonly $1 to $2 for each location you service in a month, with a monthly minimum. Your bill rises with every customer you add.</li>
                  <li><b>Per technician.</b> A base fee, often around $50 a month, plus roughly $15 to $65 for each technician. Good value on dense routes, and it jumps each time you hire.</li>
                  <li><b>Tiers by customer count.</b> One price covers a band of customers, usually with unlimited users. You move up a step when you cross into the next band.</li>
                  <li><b>Flat plans from general tools.</b> Priced by feature level and number of users, with pool features missing or added on.</li>
                </ul>
                <p>These figures come from vendors’ published prices in late 2026. They change often, so check each pricing page yourself.</p>
                <div className="gd-math">
                  <div className="gd-math-card"><span className="gd-math-k">150 pools, 3 techs</span><span className="gd-math-r">Per pool, at $2 <b>$300</b></span><span className="gd-math-r">Per tech, $50 + $65 each <b>$245</b></span><span className="gd-math-r gd-math-t">Cheaper <b>Per tech</b></span></div>
                  <div className="gd-math-arrow" aria-hidden="true"><Arrow /></div>
                  <div className="gd-math-card is-after"><span className="gd-math-k">150 pools, 5 techs</span><span className="gd-math-r">Per pool, at $2 <b>$300</b></span><span className="gd-math-r">Per tech, $50 + $65 each <b>$375</b></span><span className="gd-math-r gd-math-t">Cheaper <b>Per pool</b></span></div>
                </div>
                <p>Same company, same pools. Two more technicians flipped which model was cheaper. Put your own numbers in:</p>
                <Calculator />
                <p><b>The costs that aren’t in the headline price.</b> Ask about each of these before you compare totals:</p>
                <ul className="gd-list">
                  <li><b>Card processing.</b> Usually around 3% of every card payment, on top of the software fee. Ask who sets the rate, and whether you can pass card fees on to customers where your state allows it.</li>
                  <li><b>Features held for higher plans.</b> Route optimization, texting, automations and photo limits are common ones. Price the plan you’ll really use.</li>
                  <li><b>Per-message and add-on fees.</b> Text messages billed one by one, or extras such as phone answering sold separately.</li>
                  <li><b>Extra users.</b> Some vendors charge for each office login or each technician.</li>
                  <li><b>Setup and migration.</b> Ask whether moving your customers over is free, paid, or left to you.</li>
                  <li><b>Contracts.</b> Ask whether you can pay monthly and cancel, and what the yearly discount is if you commit.</li>
                </ul>
                <div className="gd-note is-brand"><p><b>How Poolnautics prices.</b> By number of active customers, with unlimited technicians and office staff on every plan, so hiring doesn’t raise your bill. <a className="gd-a" href="/pricing">See pricing</a>.</p></div>
              </section>

              <section id="money" aria-labelledby="money-title">
                <Part n={5} />
                <h2 id="money-title">Payments: where your money goes</h2>
                <p>Billing is where pool software does the most good and the most damage. Before you look at anything else, understand how the money moves.</p>
                <ul className="gd-list">
                  <li><b>Whose account takes the payment.</b> With some software, customers pay into the vendor’s payment system and the vendor pays you out. With others, payments go into a processor account you own. Owning the account means your payout schedule, your records, and a direct line to the processor if something goes wrong.</li>
                  <li><b>What happens to saved cards if you leave.</b> If the cards live in the vendor’s system, you may have to ask every customer for their card again. If they live in your own processor account, they stay with you.</li>
                  <li><b>How fast you’re paid.</b> Ask how many days pass between a customer paying and the money reaching your bank.</li>
                  <li><b>Protection against double charges.</b> Ask what stops a customer being billed twice if a billing run fails partway through or someone clicks twice. “It’s never happened” is not an answer. You want to hear how the system prevents it.</li>
                  <li><b>Card fees.</b> Ask whether you can add a card fee or offer bank payments, and whether the software keeps that within your state’s rules.</li>
                </ul>
                <div className="gd-pull"><p>A missed feature costs you time.</p><p>A billing mistake costs you customers.</p></div>
              </section>

              <section id="questions" aria-labelledby="questions-title">
                <Part n={6} />
                <h2 id="questions-title">Seven questions to ask every vendor</h2>
                <p>Any software looks good on a features page or during a demo. These seven questions are about the day something goes wrong. Ask every vendor on your list the same seven, and write down what they say.</p>
                <ol className="gd-steps">
                  <li><b>Whose account does my money land in?</b> Listen for whether you own the processor account or the vendor does.</li>
                  <li><b>Can a customer ever be billed twice?</b> Listen for a mechanism, such as each invoice and charge having its own key, not a reassurance.</li>
                  <li><b>What happens when a customer disputes a charge?</b> Listen for what evidence the software keeps: service reports, photos, signed approvals.</li>
                  <li><b>Can my techs fake a service report?</b> Listen for location and time records, in-app photos and required readings.</li>
                  <li><b>Can my techs keep working with no signal?</b> Listen for whether the whole report can be completed offline and sent later, with nothing lost.</li>
                  <li><b>What happens when a card fails?</b> Listen for automatic retries and customer notices, and where failures show up for you.</li>
                  <li><b>What if I want to leave?</b> Listen for a full export, no contract, and what happens to your customers’ saved cards.</li>
                </ol>
                <div className="gd-note is-brand"><p><b>Our answers.</b> We answer all seven for Poolnautics on <a className="gd-a" href="/#questions">our homepage</a>.</p></div>
              </section>

              <section id="switching" aria-labelledby="switching-title">
                <Part n={7} />
                <h2 id="switching-title">Switching and your data</h2>
                <p>If you already use software, the move itself is part of the decision. A better product isn’t worth it if the switch costs you a month of chaos.</p>
                <ul className="gd-list">
                  <li><b>What comes over.</b> Customers and addresses are the easy part. Ask about routes and stop order, prices, service history, notes and gate codes, and saved cards.</li>
                  <li><b>Who does the work.</b> Some vendors give you an importer, some do it for you, some charge for it. Ask which, and how long it takes for a company your size.</li>
                  <li><b>Timing.</b> Switch just after a billing run, not just before one, and keep your old system readable for a full cycle in case you need to check something.</li>
                  <li><b>Getting your data out.</b> Before you put anything in, ask how you get it out. You should be able to export customers, invoices and service history yourself, at any time, without asking permission.</li>
                </ul>
                <p>If you’re moving to us, <a className="gd-a" href="/switch-pool-service-software">here’s how switching to Poolnautics works</a>.</p>
              </section>

              <section id="support" aria-labelledby="support-title">
                <Part n={8} />
                <h2 id="support-title">Support and the company behind it</h2>
                <p>You’re trusting this company with your billing, so judge the company as well as the product.</p>
                <ul className="gd-list">
                  <li><b>Who answers, and how fast.</b> Ask whether support is by phone, email or chat, what the hours are, and how quickly a real person replies. Then test it during your trial with a real question.</li>
                  <li><b>Help getting started.</b> Ask whether someone will set up your first route and billing with you, or whether you’re pointed at help articles.</li>
                  <li><b>Reviews.</b> Read the three-star reviews, not the five-star ones. They tell you what annoys people after six months.</li>
                  <li><b>A reference.</b> Ask to speak with a customer about your size. A vendor with happy customers will find you one.</li>
                  <li><b>How long they’ve been around.</b> An established vendor has a track record. A newer one may move faster and care more about each customer. Either can work, as long as you can export your data whenever you want.</li>
                  <li><b>How often it improves.</b> Ask what shipped in the last three months.</li>
                </ul>
              </section>

              <section id="ai" aria-labelledby="ai-title">
                <Part n={9} />
                <h2 id="ai-title">AI and integrations</h2>
                <p>Two things come up in almost every demo now. Both are worth having, and both deserve specific questions.</p>
                <ul className="gd-list">
                  <li><b>Accounting.</b> If your bookkeeper works in QuickBooks, ask whether the software connects to it, what moves across (invoices, payments, customers), and in which direction. If there’s no connection, ask what the export for your accountant looks like.</li>
                  <li><b>AI features.</b> Ask what the AI can do, and more importantly what it can never do. It shouldn’t be able to charge a card, issue a refund or change a price without a person approving it, and everything it does should be logged.</li>
                  <li><b>Who pays for AI.</b> Some AI features are included and some are sold as monthly add-ons. Get the price before you count it as a reason to buy.</li>
                </ul>
              </section>

              <section id="trial" aria-labelledby="trial-title">
                <Part n={10} />
                <h2 id="trial-title">How to run a trial</h2>
                <p>A demo shows you the software working for the salesperson. A trial shows you whether it works for you. Shortlist two or three, and put each one through the same tests with your own customers.</p>
                <p id="checklist">Tick these off for each product you try.</p>
                <ul className="gd-check">
                  {STEPS.map((s, i) => (
                    <li key={s}>
                      <label>
                        <input type="checkbox" id={`tk-${i}`} />
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></i>
                        <span>{s}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p><b>Slow down, or walk away, if you find any of these:</b></p>
                <ul className="gd-list">
                  <li><b>There’s a demo but no trial.</b> You should be able to use it yourself before you pay.</li>
                  <li><b>You can’t see the price without a sales call.</b> Published pricing is a sign the vendor expects to win on value.</li>
                  <li><b>A long contract is the only option.</b> A yearly discount is fine. Being locked in before you’ve used it is not.</li>
                  <li><b>You can’t export your own data.</b> If getting out is hard, think carefully before getting in.</li>
                  <li><b>Nobody can explain how double billing is prevented.</b> If the salesperson doesn’t know, ask for someone who does.</li>
                  <li><b>There’s a fee to bring your customers in, or to leave.</b></li>
                </ul>
              </section>

              <section id="faq" aria-labelledby="faq-title">
                <Part n={11} />
                <h2 id="faq-title">Common questions</h2>
                <ul className="gd-list">
                  <li><b>What is the best pool service software?</b> There isn’t one best product for everyone. The best pool service software for you depends on your size, how you bill, and whether weekly service or repairs make up most of your work. Shortlist two or three and run the same trial on each.</li>
                  <li><b>What’s the best pool service software for a small business?</b> For one or two trucks, look for billing that runs itself, a simple route, reports your customers receive, and a price that doesn’t punish you for being small. Skip tools built for large teams until you are one.</li>
                  <li><b>How much does pool service software cost?</b> Typically around 1% of your monthly recurring billing. Vendors charge per pool, per technician or by customer tier, so work out the total at your size and at twice your size.</li>
                  <li><b>Do I need software built for pool service?</b> If weekly service is most of your revenue, yes. General field service tools usually lack chemical readings and handle repeating routes poorly.</li>
                  <li><b>Does pool service software work with QuickBooks?</b> Some products connect to QuickBooks Online and some don’t. Ask what moves across and in which direction. If there’s no connection, ask to see the export your accountant would receive.</li>
                  <li><b>How long does it take to switch pool software?</b> Anywhere from an afternoon to a few weeks, depending on how much history you bring and who does the import. Plan the move around your billing cycle.</li>
                  <li><b>Should I pay monthly or yearly?</b> Yearly plans are usually cheaper. Start monthly, and switch to yearly once you’re sure.</li>
                </ul>
              </section>

              <div className="gd-proof">
                <span className="gd-num">For pool companies comparing software</span>
                <h2>Put Poolnautics on your shortlist.</h2>
                <p>Billing on autopilot, GPS-stamped service reports, unlimited technicians on every plan, and payments into your own Stripe account. Try it free for {TRIAL_DAYS} days with no credit card, and we’ll move your customers over.</p>
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
