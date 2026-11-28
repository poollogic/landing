import React, { useRef, useState } from 'react';
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
import { GUIDE_DESCRIPTION, GUIDE_H1, GUIDE_LEDE } from '../landing/guides/raisePricesMeta.js';

// /guides/how-to-raise-prices: the first guide, a long-form article, built from the approved reference
// (price-guide-reference.html, 2026-11-25): its copy, example numbers, layout, colours, sizes and
// breakpoints (1020px, 720px). The site's light nav over a light hero (as /ai-and-automations), the
// footer, Satoshi, the container and the site's gutter; the article's own styles are
// landing/guides/guide.css (.gd-*, scoped to .guide-page for later guides). One h1, an h2 per part, h3s
// inside. The reference's script is ported as React: the break-even calculator, the letter's two
// versions and its Copy button, the contents list's current part (GuideToc.jsx) and the checklist, all
// in the pre-rendered markup, so the page reads in full without JavaScript (the calculator showing its
// default result, the first letter, the ten steps). No byline, no date, no FAQ structured data.

const ORIGIN = 'https://getpoolnautics.com';
const PAGE_URL = `${ORIGIN}/guides/how-to-raise-prices`;
const PRICE_PAGE = '/pool-service-price-increases';
// TODO: the URL of Alex Hormozi's video "How To Raise Your Prices [plus the letter I actually sent to
// customers]". The owner will supply it. Until then the link goes nowhere.
const HORMOZI_VIDEO_URL = '#';

// Its image (the share image) is added in entry-server.jsx from ROUTE_META, where the PNG's path lives.
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${PAGE_URL}#article`,
    headline: GUIDE_H1,
    description: GUIDE_DESCRIPTION,
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
      { '@type': 'ListItem', position: 3, name: 'How to raise prices', item: PAGE_URL },
    ],
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ---------- Hero ---------- */

const SHORTCUTS = [
  ['how-much', 'Break-even calculator', <><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></>],
  ['tell', 'Price increase letter to copy', <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7.5l8.5 6 8.5-6" /></>],
  ['checklist', '10-step checklist', <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8.5 12.2l2.4 2.4 4.6-5" /></>],
];

function HeroInvoice() {
  return (
    <div className="gd-vis" role="img" aria-label="An invoice showing a $155.00 subtotal, a $15.00 loyalty credit and a $140.00 total, then a $155.00 total from March 1">
      <div className="gd-vis-card">
        <span className="gd-vis-k">Every bill until March 1</span>
        <div className="gd-vis-r"><span>Subtotal</span><b>$155.00</b></div>
        <div className="gd-vis-r is-credit"><span>Loyalty credit</span><b>−$15.00</b></div>
        <div className="gd-vis-r is-total"><span>Total</span><b>$140.00</b></div>
      </div>
      <div className="gd-vis-next">
        <span className="gd-vis-k">From March 1</span>
        <div className="gd-vis-r"><span>Total</span><b>$155.00</b></div>
        <small>The credit ends. Nothing else changes.</small>
      </div>
    </div>
  );
}

/* ---------- Part 2: the break-even calculator ---------- */

/** 1500 → "1,500" (no Intl, so the server and the browser always write the same thing). */
const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const money = (n) => `$${thousands(Math.round(n))}`;
const num = (s) => Math.max(0, parseFloat(s) || 0);

/** Extra revenue = customers × raise; customers you could lose = floor(customers × raise / (price + raise)). */
function Calculator() {
  const [n, setN] = useState('100');
  const [p, setP] = useState('140');
  const [r, setR] = useState('15');
  const customers = num(n);
  const price = num(p);
  const raise = num(r);
  const extra = customers * raise;
  const lose = price + raise > 0 ? Math.floor((customers * raise) / (price + raise) + 1e-9) : 0;
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
    <div className="gd-calc">
      <p className="gd-calc-h">Break-even calculator</p>
      <div className="gd-calc-in">
        {field('gc-n', 'Customers getting the raise', n, setN, { mode: 'numeric', min: 1 })}
        {field('gc-p', 'What they pay now, per month', p, setP, { prefix: '$', mode: 'decimal', min: 1 })}
        {field('gc-r', 'Your raise, per month', r, setR, { prefix: '$', mode: 'decimal', min: 0 })}
      </div>
      <div className="gd-calc-out" aria-live="polite">
        <div className="gd-out">
          <span>Extra revenue if everyone stays</span>
          <b>{money(extra)} a month</b>
          <span>{money(extra * 12)} a year</span>
        </div>
        <div className="gd-out is-key">
          <span>You could lose</span>
          <b>{lose} {lose === 1 ? 'customer' : 'customers'}</b>
          <span>
            {lose > 0
              ? `and still bring in what you do today, with ${lose} fewer job${lose === 1 ? '' : 's'} to do.`
              : 'before you bring in less than you do today.'}
          </span>
        </div>
      </div>
      <p className="gd-calc-fine">
        Break-even is the raise divided by the new price, times the number of customers, rounded down. It compares revenue only;
        your costs also fall when you have fewer jobs.
      </p>
    </div>
  );
}

/* ---------- Part 5: the letter to copy ---------- */

const M = ({ children }) => <mark>{children}</mark>;
const LETTER_START = [
  <p key="s" className="gd-subj"><b>Subject:</b> Your <M>pool service</M> rate from <M>March 1</M></p>,
  <p key="h">Hi <M>First name</M>,</p>,
  <p key="c">Starting <M>March 1</M>, your <M>monthly</M> <M>pool service</M> rate will change from <M>$140.00</M> to <M>$155.00</M>.</p>,
  <p key="w">Our costs for <M>chemicals, fuel and insurance</M> have gone up, and this lets us keep sending the same team to your home every week.</p>,
];
const LETTER_END = [
  <p key="t">Thank you for being a customer. If you have any questions, reply to this email or call <M>your phone number</M>.</p>,
  <p key="n"><M>Your name</M></p>,
];
const LETTERS = [
  {
    key: 'a',
    tab: 'With the discount',
    body: [...LETTER_START, <p key="d">Until <M>March 1</M>, your invoices will show the new rate with a <M>$15.00</M> credit, so you’ll keep paying <M>$140.00</M>. Nothing else about your service changes.</p>, ...LETTER_END],
  },
  {
    key: 'b',
    tab: 'Plain notice',
    body: [...LETTER_START, <p key="d">Nothing else about your service changes, and you’ll keep paying <M>$140.00</M> until <M>March 1</M>.</p>, ...LETTER_END],
  },
];

/** Copies text to the clipboard; falls back to a hidden textarea where the Clipboard API isn't allowed. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* nothing more to try */ }
    ta.remove();
  }
}

function Letter() {
  const [shown, setShown] = useState('a');
  const [copied, setCopied] = useState(false);
  const bodies = useRef({});
  const timer = useRef(0);
  const copy = async () => {
    const body = bodies.current[shown];
    if (!body) return;
    // The version on screen, as plain text, a blank line between paragraphs.
    const text = [...body.querySelectorAll('p')].map((el) => el.innerText.trim()).join('\n\n');
    await copyText(text);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="gd-tpl">
      <div className="gd-tpl-top">
        <div className="gd-tabs" role="tablist" aria-label="Letter version">
          {LETTERS.map((l) => (
            <button
              key={l.key}
              type="button"
              id={`gd-tab-${l.key}`}
              className={shown === l.key ? 'is-on' : undefined}
              role="tab"
              aria-selected={shown === l.key}
              aria-controls={`gd-letter-${l.key}`}
              onClick={() => setShown(l.key)}
            >
              {l.tab}
            </button>
          ))}
        </div>
        <button type="button" className="gd-copy" onClick={copy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      {LETTERS.map((l) => (
        <div
          key={l.key}
          id={`gd-letter-${l.key}`}
          className="gd-tpl-body"
          role="tabpanel"
          aria-labelledby={`gd-tab-${l.key}`}
          hidden={shown !== l.key}
          ref={(el) => { bodies.current[l.key] = el; }}
        >
          {l.body}
        </div>
      ))}
    </div>
  );
}

/* ---------- Part 7 and Part 8 ---------- */

const PUSHBACK = [
  ['“That’s a big jump.”', <>“I understand. It’s our first increase in <M>two years</M>, and it covers what <M>chemicals and fuel</M> cost us now. You’ll keep today’s price until <M>March 1</M>.”</>],
  ['“I can’t afford that.”', <>“I’d rather keep you than lose you. Let’s look at what we could change, like <M>how often we come</M>, to get you to a number that works.”</>],
  ['“Someone else is cheaper.”', <>“They might be. Here’s what you get with us: <M>the same tech every week and a photo report after every visit</M>. If you want to try them, no hard feelings, and you’re welcome back.”</>],
  ['“Nobody told me.”', <>“I’m sorry you missed it. We sent it on <M>January 28</M> to <M>the email we have on file</M>. I’ll send it again right now, and you still have until <M>March 1</M> at today’s price.”</>],
];

// Ten steps; ticks aren't saved, so they reset on reload.
const STEPS = [
  'Work out the new price and run the break-even math',
  'Decide who goes first',
  'Pick the start date, at least one full billing cycle out',
  'Check your service agreement for notice rules',
  'Write the notice, with the numbers and the date in the first two lines',
  'Put the new price and the credit on every invoice until the date',
  'Send the notice, and keep a record of who got it and when',
  'Tell whoever answers the phone what to say',
  'On the date, take the credit off',
  'A month later, write down who called and who left, for next year',
];

const TOC = [
  ['why', 'Why you have to raise prices'],
  ['how-much', 'How much to raise'],
  ['who', 'Who gets the raise first'],
  ['notice', 'How much notice to give'],
  ['tell', 'How to tell your customers'],
  ['vanishing', 'The vanishing discount'],
  ['pushback', 'When someone pushes back'],
  ['checklist', 'The checklist'],
];

const Part = ({ n }) => <span className="gd-num"><i>{n}</i>Part {n}</span>;

/* ---------- The page ---------- */

export default function GuideRaisePricesPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg guide-page relative min-h-screen font-sans antialiased">
      <Nav tone="light" overlay />
      <main>
        <header className="gd-hero">
          <div className="container">
            <div className="gd-hero-grid">
              <div>
                <p className="gd-eyebrow">Guide for service businesses</p>
                <h1>{GUIDE_H1}</h1>
                <p className="gd-lede">{GUIDE_LEDE}</p>
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
              <HeroInvoice />
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
                  <li>Run the break-even math first. It tells you how many customers you can afford to lose.</li>
                  <li>Raise new customers first, then your oldest, lowest-priced accounts.</li>
                  <li>Tell everyone plainly, with their own numbers, at least one billing cycle ahead.</li>
                  <li>Put the new price on the bill early, and credit the difference back until the date.</li>
                  <li>Don’t bargain on price. Change what’s included.</li>
                </ol>
              </div>

              <section id="why" aria-labelledby="why-title">
                <Part n={1} />
                <h2 id="why-title">Why you have to raise prices</h2>
                <p>Your costs go up every year whether you raise your prices or not. Supplies, fuel, insurance, wages. If your price stays flat, the difference comes out of your profit.</p>
                {/* TODO: this sentence is pending the owner's check against Alex Hormozi's original video (the 25% example). */}
                <p>
                  Price is also the biggest lever you have. Alex Hormozi makes the point with simple math in{' '}
                  <a className="gd-a" href={HORMOZI_VIDEO_URL} target="_blank" rel="noopener noreferrer">How To Raise Your Prices</a>: if you
                  keep 25% of every dollar as profit, a 25% price increase doubles that profit, because your costs didn’t move.
                </p>
                <div className="gd-math">
                  <div className="gd-math-card"><span className="gd-math-k">Today</span><span className="gd-math-r">Price <b>$100</b></span><span className="gd-math-r">Costs <b>$75</b></span><span className="gd-math-r gd-math-t">Profit <b>$25</b></span></div>
                  <div className="gd-math-arrow" aria-hidden="true"><Arrow /></div>
                  <div className="gd-math-card is-after"><span className="gd-math-k">After a 25% raise</span><span className="gd-math-r">Price <b>$125</b></span><span className="gd-math-r">Costs <b>$75</b></span><span className="gd-math-r gd-math-t">Profit <b>$50</b></span></div>
                </div>
                <p>It works the other way too. Say you charge $140 a month, keep 25% as profit, and your costs rise 4% a year. Hold that price for three years and your profit on that customer falls from $35 to about $22. That’s over a third of your profit gone without a single customer leaving.</p>
                <div className="gd-pull"><p>Not raising prices is still a decision.</p><p>It’s a pay cut you give yourself, a little at a time.</p></div>
              </section>

              <section id="how-much" aria-labelledby="how-much-title">
                <Part n={2} />
                <h2 id="how-much-title">How much to raise</h2>
                <p>There’s no magic number. Owners usually pick one of three ways:</p>
                <ul className="gd-list">
                  <li><b>Match your costs.</b> If your costs are up 6%, a 6% raise keeps your margin where it was. It doesn’t make up for the years you held your price.</li>
                  <li><b>Catch up to today’s price.</b> Bring long-time customers up to what you’d quote a new customer now.</li>
                  <li><b>A flat amount.</b> The same dollar figure for a group of similar customers. Simple to explain.</li>
                </ul>
                <p>Whatever you choose, run this before you worry about who might leave. It shows how many customers you could lose and still bring in the same money.</p>
                <Calculator />
                <p>If that number is more customers than you think would leave, the raise pays for itself.</p>
              </section>

              <section id="who" aria-labelledby="who-title">
                <Part n={3} />
                <h2 id="who-title">Who gets the raise first</h2>
                <p>You don’t have to raise everyone at once, or by the same amount. Go in this order:</p>
                <ol className="gd-steps">
                  <li><b>New customers.</b> Quote the new price from today. Nobody is upset by a price they never paid less than.</li>
                  <li><b>Your oldest, lowest-priced accounts.</b> They’ve had your best deal for the longest, and they’re the furthest below what the work costs you now.</li>
                  <li><b>Everyone else, on a schedule.</b> Once a year, at the same time of year, so it becomes something customers expect.</li>
                </ol>
                <p>
                  Group customers by{' '}
                  <a className="gd-a" href="/guides/how-to-start-a-pool-cleaning-business#price">what they cost you to serve</a>. A job that takes twice the time or supplies, or a stop 25 minutes off your route, shouldn’t get the same raise as an easy one around the corner.</p>
              </section>

              <section id="notice" aria-labelledby="notice-title">
                <Part n={4} />
                <h2 id="notice-title">How much notice to give</h2>
                <p>Give at least one full billing cycle, so nobody is charged a price they haven’t been told about. Better still, give 30 days or more. The bigger the raise, the more notice it deserves.</p>
                <p>Before you pick a date, read your own service agreement. Some agreements, and some local rules, require written notice a set number of days ahead. If yours does, that’s your minimum.</p>
                <div className="gd-note"><p><b>Pick one date for everyone in the group.</b> Monthly, quarterly and yearly customers can all move on the same day. It’s easier to explain and easier to keep track of.</p></div>
              </section>

              <section id="tell" aria-labelledby="tell-title">
                <Part n={5} />
                <h2 id="tell-title">How to tell customers about a price increase</h2>
                <p>Much of the damage from a price increase comes from how it’s announced. A customer who finds out from their bill feels tricked. A customer who was told plainly, ahead of time, doesn’t.</p>
                <h3>What a good notice does</h3>
                <ol className="gd-steps">
                  <li><b>Says it in the first two lines.</b> What’s changing, by how much, and when. Don’t make them hunt for it.</li>
                  <li><b>Gives the reason in one sentence.</b> Your costs went up. That’s enough. Don’t apologize three times.</li>
                  <li><b>Uses their numbers.</b> Their current price and their new price, not “rates are going up 8%”.</li>
                  <li><b>Says what isn’t changing.</b> Same service, same day, same people.</li>
                  <li><b>Thanks them and tells them how to reach you.</b></li>
                </ol>
                <h3>A price increase letter you can copy</h3>
                <p>Swap the highlighted parts for your own. The first version uses the vanishing discount from the next part. The second is a plain notice.</p>
                <Letter />
              </section>

              <section id="vanishing" aria-labelledby="vanishing-title">
                <Part n={6} />
                <h2 id="vanishing-title">The vanishing discount</h2>
                <p>This is the part that changes how a raise lands. Don’t let the price jump on a date. Put the new price on the bill <b>now</b>, and credit the increase back until the date you chose. The total stays what they pay today. On the date, the credit line disappears and nothing else changes.</p>
                <div className="gd-ba" role="img" aria-label="Every bill until March 1 shows a $155.00 subtotal, a $15.00 loyalty credit and a $140.00 total. From March 1 the credit has ended and the total is $155.00.">
                  <div className="gd-ba-card"><span className="gd-ba-when">Every bill until March 1</span><span className="gd-ba-row">Subtotal <b>$155.00</b></span><span className="gd-ba-row is-credit">Loyalty credit <b>−$15.00</b></span><span className="gd-ba-row is-total">Total <b>$140.00</b></span></div>
                  <div className="gd-ba-pill">March 1 <Arrow /></div>
                  <div className="gd-ba-card is-after"><span className="gd-ba-when">From March 1</span><span className="gd-ba-row">Subtotal <b>$155.00</b></span><span className="gd-ba-row is-ghost">Credit ended</span><span className="gd-ba-row is-total">Total <b>$155.00</b></span></div>
                </div>
                <h3>Why it works</h3>
                <ul className="gd-list">
                  <li><b>Nobody is surprised.</b> They see the new price on a bill before they ever pay it.</li>
                  <li><b>The new price becomes the normal price.</b> By the date, it’s the number they’ve been looking at for weeks or months.</li>
                  <li><b>It reads as a favor.</b> A line called “Loyalty credit” says you’re giving them something, which is true.</li>
                  <li><b>There’s nothing to argue with on the day.</b> The bill looks the same as last month’s, minus one line they were told would end.</li>
                </ul>
                {/* TODO: this sentence is pending the owner's check against Alex Hormozi's original video. */}
                <p>Alex Hormozi describes a version of this for existing customers: announce the new price, and let loyal customers keep the old one for a set period.</p>
                <h3>Doing it by hand</h3>
                <p>You can do this in any invoicing tool. Change each customer’s price, add a discount line for the difference, and set a reminder to remove it on the date. With a handful of customers that’s fine. With a few hundred, on different billing cycles, it’s a lot to keep straight.</p>
                <p>If you run a pool company, <a className="gd-a" href={PRICE_PAGE}>Poolnautics adds and removes the credit for you</a>.</p>
              </section>

              <section id="pushback" aria-labelledby="pushback-title">
                <Part n={7} />
                <h2 id="pushback-title">When someone pushes back</h2>
                <p>A few people will call. Decide what you’ll say before they do, and make sure whoever answers the phone knows it too. One rule covers most calls:</p>
                <div className="gd-pull"><p>Don’t bargain on price. Change what’s included.</p></div>
                {PUSHBACK.map(([them, you]) => (
                  <div key={them} className="gd-chat">
                    <div className="is-them"><small>Customer</small><p>{them}</p></div>
                    <div className="is-you"><small>You</small><p>{you}</p></div>
                  </div>
                ))}
                <p>That last one is why you keep a record of what you sent, to whom, and when.</p>
              </section>

              <section id="checklist" aria-labelledby="checklist-title">
                <Part n={8} />
                <h2 id="checklist-title">The checklist</h2>
                <p>Everything above, in order. Tick them off as you go.</p>
                <ul className="gd-check">
                  {STEPS.map((s, i) => (
                    <li key={s}>
                      <label>
                        <input type="checkbox" id={`gk-${i}`} />
                        <i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></i>
                        <span>{s}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="gd-proof">
                <span className="gd-num">For pool companies</span>
                <h2>Poolnautics does parts 3 to 6 for you.</h2>
                <p>Filter your customers by their last increase, set the raise and the date, and every invoice carries the new price with the credit until then. Aqua Blue Pools ran its yearly increase this way and had no calls and one cancellation. Its earlier increases lost 3% to 6% of customers.</p>
                <div className="gd-proof-row">
                  <a className="hero-cta gd-cta" href={PRICE_PAGE}>See how price increases work<ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
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
