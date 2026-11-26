import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/pricing.css';
import Nav from '../landing/Nav.jsx';
import SectionHeader from '../landing/SectionHeader.jsx';
import FaqSection from '../landing/FaqSection.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { ctaHref, isReserving } from '../landing/onboarding.js';
import { Footer } from '../components/site-chrome.jsx';
import { BRACKETS } from '../pricingPlans.js';
import { QUICKBOOKS_SYNC_SHOWN } from '../landing/quickbooksSync.js';

// /pricing: a dark top section (hero, then the pricing slab: the customer slider and billing switch
// on a raised plate, the two plans as wells pressed into it), the comparison (white), "No hidden
// fees" (a dark band with a white fee card over its foot), the FAQ (white) and a dark closing CTA.
// Built on the homepage's Tailwind setup, nav and SectionHeader; the slab, table and fee card are
// styled in landing/pricing.css (.pr-*).

const INSIGHT = 'Insight';
const VISION = 'Vision';

// What each plan's card lists (seven each, six on Insight while QuickBooks is hidden), as the app gates them (poollogic-web-app
// src/lib/planFeatures.ts): card fees are on every plan; automatic pause, fleet, mileage,
// automations, AI connections, bulk email and the API are Vision's. Everything else is in the
// comparison table (COMPARE).
const INSIGHT_FEATURES = [
  'Unlimited technicians & office staff',
  'Zero-click billing & autopay',
  'Card fees passed on to your customers',
  'Late fees & overdue reminders that run themselves',
  // QuickBooks: flip to available when Intuit approves production keys; hidden for now (landing/quickbooksSync.js).
  ...(QUICKBOOKS_SYNC_SHOWN ? ['QuickBooks Online integration (coming soon)'] : []),
  'Drag-and-drop routing & offline technician app',
  'Free white-glove migration',
];
const VISION_FEATURES = [
  'Automatic pause for customers who don’t pay',
  'Fleet: truck check-ins & oil change reminders',
  'Connect Claude, ChatGPT or Grok',
  'Automations, like invoicing when a job’s done',
  'Texting via Quo, Twilio, Telnyx or Dialpad',
  'Bulk email from your own domain',
  'API & webhooks (website, Google Ads, Meta)',
];

// Prices per month by active customers live in pricingPlans.js (the Partner Program
// reads them too). STOPS: each bracket's top, for the slider.
const STOPS = [100, 250, 500, 1000, 1500, 2500];
const CUSTOM = STOPS.length; // the slider's last stop: more than 2,500
const num = (n) => n.toLocaleString('en-US');
// Whole dollars, or cents when there are any ($74.25).
const usd = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

// Paying yearly saves 25%: a year costs 9 months' price, shown per month.
const YEARLY_SAVING = '25%';
const perMonth = (monthly, yearly) => (yearly ? Math.round(monthly * 75) / 100 : monthly);

// The highlighted plan: "Recommended", the blue tint and the primary button.
// TODO(owner): is Vision the plan to mark "Recommended"? Assumed yes (it was Insight before).
const FEATURED_PLAN = 'vision';
const customersLabel = (stop) => (stop === CUSTOM ? 'More than 2,500 active customers' : `Up to ${num(STOPS[stop])} active customers`);

// Comparison table: [feature, in Insight, in Vision, page about it], by category.
// TODO(owner): one-line explanations for "Vanishing Discount" price adjuster and Route handover tool.
const COMPARE = [
  ['Routing & Operations', [
    ['Unlimited technicians & office staff', true, true],
    ['Drag-and-drop routing', true, true],
    ['Offline technician app', true, true],
    ['Quotes & work orders', true, true],
    ['Chemical cost per visit', true, true],
    ['Route handover tool', false, true],
    ['Free white-glove migration', true, true],
  ]],
  ['Billing & Finance', [
    ['Zero-click billing & autopay', true, true],
    ['Chemicals on invoices', true, true],
    ['Card fees passed on to customers, where state law allows', true, true],
    ['Late fees applied automatically', true, true],
    ['Automatic overdue reminders', true, true],
    // QuickBooks: flip to available when Intuit approves production keys; hidden for now (landing/quickbooksSync.js).
    ...(QUICKBOOKS_SYNC_SHOWN ? [['QuickBooks Online integration (coming soon)', true, true]] : []),
    ['Automatic pause for customers who don’t pay', false, true],
    ['“Vanishing Discount” price adjuster', false, true],
  ]],
  ['Fleet', [
    ['Truck check-ins & oil change reminders', false, true],
    ['Mileage tracking', false, true],
  ]],
  ['Client Communication', [
    ['Texting from your business number', false, true],
    ['Automated SMS lead follow-ups', false, true],
    ['Bulk email from your own domain', false, true],
    ['Service reports & invoices emailed from your own domain', false, true],
  ]],
  ['Automation, AI & API', [
    ['Automations, like invoicing when a job’s done', false, true],
    ['Connect Claude, ChatGPT or Grok', false, true, '/ai-and-automations'],
    ['Quo, Twilio, Telnyx and Dialpad', false, true],
    ['API & webhooks (website, Google Ads, Meta)', false, true, '/ai-and-automations'],
  ]],
];

// "No hidden fees": [fee to ask about, figure, qualifier]. No competitor is named here.
const FEES = [
  ['Setup or onboarding fee', '$0', ''],
  ['Moving your data over', '$0', 'done for you'],
  ['Each extra technician or office user', '$0', 'unlimited on every plan'],
  ['Autopay and automatic billing', '$0', 'included on every plan'],
  ['Passing card fees on to your customers', '$0', 'included on every plan'],
  ['A cut of your customers’ payments', '0%', 'we never take one'],
  ['Penalty for going over your customer limit', '$0', 'you just move to the next tier'],
];

// The tier list as text (the slider shows one tier at a time), from pricingPlans.js.
const TIER_PRICES = `Monthly prices by active customers, Insight / Vision: ${BRACKETS.map(([size, i, v]) => `${size}, $${num(i)} / $${num(v)}`).join('; ')}. More than 2,500 active customers is priced for your fleet: talk to us. Billed yearly, every tier costs ${YEARLY_SAVING} less.`;

const FAQ = [
  ['Do I pay extra for new technicians or office staff?',
    'No. Every plan includes unlimited users. You only pay for the size of your route.'],
  ['Do paused customers count toward my price?',
    'No. Your price is based on active customers only. Paused customers don’t count.'],
  ['What happens if I go over my customer limit?',
    `You simply move into the next bracket. We’ll automatically adjust your billing for the following month. No hidden overage fees. ${TIER_PRICES}`],
  ['Is there a setup fee?',
    'Zero setup fees, and our white-glove onboarding and data migration is 100% free.',
    <a href="/switch-pool-service-software">See how switching works</a>],
  ['Do I need a credit card for the free trial?',
    isReserving
      ? 'No. When we onboard you, you sign up with just your email, and we import your route for you.'
      : 'No. Sign up with just your email and start importing your route immediately.'],
  ['Do you take a cut of my customers’ payments?',
    'No. Your customers’ payments go to your own Stripe account, and Poolnautics takes no fee on them.'],
  ['Who pays the card processing fees?',
    'Stripe charges its standard processing fees to your Stripe account. You can pass them on with a card fee of up to 3% on credit card payments, where your state allows it.'],
  ['Is there a discount for paying yearly?',
    `Yes. Pay for a year up front and save ${YEARLY_SAVING}.`],
].map(([q, a, more]) => ({ q, a, more }));

// Structured data for search engines and AI assistants, in the pre-rendered page's <head>
// (entry-server.jsx): the page, about the product, and the FAQ (FaqSection's own copy is off, so
// it's here once). The product itself, with both plans' prices and features, is index.html's
// site-wide SoftwareApplication (#software): keep its prices and feature lists in step with
// pricingPlans.js and the lists above.
const ORIGIN = 'https://getpoolnautics.com';
export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Pool Service Software Pricing',
    url: `${ORIGIN}/pricing`,
    description: 'Poolnautics pricing: pool service software priced by active customers, with unlimited technicians and office staff, on two plans, Insight and Vision.',
    isPartOf: { '@id': `${ORIGIN}/#website` },
    // The product, its plans and features: index.html's site-wide SoftwareApplication (one place).
    about: { '@id': `${ORIGIN}/#software` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${ORIGIN}/pricing` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The whole dollars on show, counting from the last value to `target` over 480ms (ease-out quart)
 * when the slider or the switch changes the price. Renders `target` first (the server's HTML), and
 * jumps straight there under reduced motion or to and from "Custom" (null).
 */
function useCountedDollars(target) {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  useEffect(() => {
    const from = shownRef.current;
    const set = (v) => { shownRef.current = v; setShown(v); };
    if (from === target) return undefined;
    if (from == null || target == null || reducedMotion()) { set(target); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 480);
      const e = 1 - (1 - t) ** 4;
      set(t === 1 ? target : Math.round(from + (target - from) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

/** A plan's price: big dollars, small raised cents, "/mo" (" billed yearly"); read out as one value. */
function Price({ amount, yearly }) {
  const counted = useCountedDollars(amount == null ? null : Math.floor(amount));
  if (amount == null) {
    return (
      <p className="pr-price">
        <span className="pr-price-d">Custom</span>
      </p>
    );
  }
  const dollars = counted ?? Math.floor(amount); // the first frame back from "Custom"
  const cents = Math.round((amount - Math.floor(amount)) * 100);
  return (
    <p className="pr-price">
      <span className="sr-only">{usd(amount)} per month{yearly ? ', billed yearly' : ''}</span>
      <span className="pr-price-vis" aria-hidden="true">
        <span className="pr-price-d font-tnum">${num(dollars)}</span>
        {cents > 0 && <span className="pr-price-c font-tnum">.{String(cents).padStart(2, '0')}</span>}
        <span className="pr-price-per">/mo{yearly && <span className="pr-price-yr"> billed yearly</span>}</span>
      </span>
    </p>
  );
}

/** One plan, a well in the slab. price: the monthly-billing price for the chosen bracket, or null above 2,500. */
function PlanCard({ id, name, desc, price, yearly, featured, lead, features, href }) {
  return (
    <div className={`pr-plan${featured ? ' pr-plan--featured' : ''}`}>
      <div className="pr-plan-name">
        <h2 id={id}>{name}</h2>
        {featured && <p className="pr-plan-rec">Recommended</p>}
      </div>
      <p className="pr-plan-desc">{desc}</p>
      <Price amount={price == null ? null : perMonth(price, yearly)} yearly={yearly} />
      <a
        href={price ? href : '/contact'}
        aria-describedby={id}
        className={`pr-plan-btn ${featured ? 'pr-plan-btn--primary' : 'pr-plan-btn--secondary'} ${FOCUS}`}
      >
        {price ? (isReserving ? 'Reserve your spot' : 'Start 30-day free trial') : 'Talk to us'}
      </a>
      <div className="pr-plan-list">
        <p className="pr-plan-lead">{lead}</p>
        <ul>
          {features.map((f) => (
            <li key={f}>
              <Check size={16} strokeWidth={2.5} className="pr-plan-check" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** "Compare every feature": a smooth scroll to the comparison table (an instant one under reduced motion). */
function toCompare(e) {
  const table = document.getElementById('compare');
  if (!table) return;
  e.preventDefault();
  table.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(null, '', '#compare');
}

export default function PricingPage() {
  const trial = ctaHref(usePreviewTheme());
  const [stop, setStop] = useState(0); // the slider: an index into STOPS, or CUSTOM
  const [yearly, setYearly] = useState(true);
  const bracket = stop === CUSTOM ? null : BRACKETS[stop];
  const insight = bracket && bracket[1];
  const vision = bracket && bracket[2];
  const headPrice = (price) => (price ? `${usd(perMonth(price, yearly))}/mo` : 'Custom');
  const lastGroup = COMPARE.length - 1;
  return (
    <div className="mktg relative min-h-screen bg-mktg-base font-sans text-mktg-muted antialiased">
      <Nav current="/pricing" />
      <main>
        {/* 1. Hero (dark): the headline and one line, centred between the nav and the slab. */}
        <section className="pr-hero bg-mktg-base" aria-labelledby="pricing-heading">
          <div className="container">
            <SectionHeader
              as="h1"
              className="mb-0"
              id="pricing-heading"
              title="Scale your route, not your overhead."
              subtitle="Pool service software with unlimited technicians on every plan. Free for 30 days, no credit card."
              titleClassName="pr-hero-title text-white"
              subtitleClassName="pr-hero-sub"
            />
          </div>
        </section>

        {/* 2. The pricing slab (dark): one raised plate, the slider on top, the plans pressed into it. */}
        <section className="section bg-mktg-base pt-0" aria-label="Plans">
          <div className="container">
            <div className="pr-slab">
              {/* Top strip: the customer count and billing switch, then the slider (one stop per bracket). */}
              <div className="pr-card">
                <p className="pr-readout" aria-hidden="true">
                  <span className="pr-readout-num font-tnum">{stop === CUSTOM ? '2,500+' : num(STOPS[stop])}</span>
                  <span className="pr-readout-label">active customers</span>
                </p>
                <div className="pr-slider-row">
                  <label htmlFor="pr-customers" className="sr-only">How many active customers do you have?</label>
                  <div className="pr-slider">
                    <div className="pr-track" />
                    <div className="pr-fill" style={{ '--fill': stop / CUSTOM }} />
                    <input
                      id="pr-customers"
                      type="range"
                      min={0}
                      max={CUSTOM}
                      step={1}
                      value={stop}
                      onChange={(e) => setStop(Number(e.target.value))}
                      aria-valuetext={customersLabel(stop)}
                      className="pr-range"
                    />
                  </div>
                  <div className="pr-ticks" aria-hidden="true">
                    {[...STOPS, null].map((max, i) => (
                      <button
                        key={i}
                        type="button"
                        tabIndex={-1}
                        className="pr-tick"
                        style={{ '--at': i / CUSTOM }}
                        data-on={i === stop ? '' : undefined}
                        onClick={() => setStop(i)}
                      >
                        {max ? num(max) : '2,500+'}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Billing period: native radios under one sliding knob. In the first row from 920px;
                    below that, centred on its own row under the slider (still on the plate). */}
                <fieldset className="pr-period">
                  <legend className="sr-only">Billing period</legend>
                  <div className="pr-toggle" data-yearly={yearly ? '' : undefined}>
                    <span className="pr-toggle-pill" aria-hidden="true" />
                    {[[false, 'Monthly'], [true, 'Yearly']].map(([value, label]) => (
                      <label key={label}>
                        <input
                          type="radio"
                          name="billing-period"
                          className="sr-only"
                          checked={yearly === value}
                          onChange={() => setYearly(value)}
                        />
                        <span className="pr-toggle-opt">
                          {label}
                          {value && (
                            <>
                              <span className="pr-toggle-save" aria-hidden="true">−{YEARLY_SAVING}</span>
                              <span className="sr-only">, save {YEARLY_SAVING}</span>
                            </>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="pr-nudge" aria-live="polite">
                    {!yearly && (
                      <>
                        <span className="font-medium text-[#94a3b8]">Switch to yearly, </span>
                        <span className="font-semibold text-[#4ade80]">get 3 months free</span>
                      </>
                    )}
                  </p>
                </fieldset>
                {/* Announces the new prices as the slider moves. */}
                <p className="sr-only" aria-live="polite">
                  {bracket
                    ? `${customersLabel(stop)}, billed ${yearly ? 'yearly' : 'monthly'}: Insight ${usd(perMonth(insight, yearly))} a month. Vision ${usd(perMonth(vision, yearly))} a month.`
                    : `${customersLabel(stop)}: custom pricing.`}
                </p>
              </div>

              {/* The plans: two wells, then the link to the full comparison. */}
              <div className="pr-plans">
                <PlanCard
                  id="plan-insight"
                  name={INSIGHT}
                  desc="Billing, routing and the technician app."
                  price={insight}
                  yearly={yearly}
                  featured={FEATURED_PLAN === 'insight'}
                  lead="Includes:"
                  features={INSIGHT_FEATURES}
                  href={trial}
                />
                <PlanCard
                  id="plan-vision"
                  name={VISION}
                  desc="Adds automations, texting, fleet and AI."
                  price={vision}
                  yearly={yearly}
                  featured={FEATURED_PLAN === 'vision'}
                  lead="Everything in Insight, plus:"
                  features={VISION_FEATURES}
                  href={trial}
                />
                <a href="#compare" onClick={toCompare} className="pr-compare-link">
                  Compare every feature <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Why it pays for itself: on every plan. */}
            {/* TODO(owner): cut or shorten this now that "No hidden fees" covers it? */}
            <p className="mx-auto mt-10 max-w-[640px] text-center text-body leading-relaxed text-slate-300">
              Pass card processing costs on to your customers instead of eating them, and let late fees apply
              themselves. That alone can more than cover your plan.{' '}
              <span className="font-semibold text-white">And we never take a cut of your customers’ payments.</span>
            </p>
          </div>
        </section>

        {/* 3. Feature comparison (white): a sticky header with the live prices, Vision's column tinted. */}
        <section id="compare" className="pr-cmp-section bg-white" aria-labelledby="compare-heading">
          <div className="container">
            <SectionHeader id="compare-heading" className="pr-cmp-head" title="Everything included, side by side" titleClassName="text-slate-900" />
            <table className="pr-cmp">
              <caption className="sr-only">Compare plans</caption>
              <colgroup>
                <col />
                <col className="pr-cmp-plan" />
                <col className="pr-cmp-plan" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="pr-cmp-feature">Feature</th>
                  <th scope="col">
                    <span className="pr-cmp-name">{INSIGHT}</span>
                    <span className="pr-cmp-price font-tnum">{headPrice(insight)}</span>
                  </th>
                  <th scope="col" className="pr-cmp-v">
                    <span className="pr-cmp-name">{VISION}</span>
                    <span className="pr-cmp-price font-tnum">{headPrice(vision)}</span>
                  </th>
                </tr>
              </thead>
              {COMPARE.map(([category, rows], g) => (
                <tbody key={category}>
                  <tr className="pr-cmp-group">
                    <th colSpan={2} scope="colgroup">{category}</th>
                    <td className="pr-cmp-v" />
                  </tr>
                  {rows.map(([feature, inInsight, inVision, href], r) => (
                    <tr key={feature} className={`pr-cmp-row${g === lastGroup && r === rows.length - 1 ? ' pr-cmp-last' : ''}`}>
                      <th scope="row">
                        {href ? <a href={href} className={`underline decoration-slate-300 underline-offset-4 hover:text-blue-600 hover:decoration-blue-600 ${FOCUS}`}>{feature}</a> : feature}
                      </th>
                      {[inInsight, inVision].map((on, i) => (
                        <td key={i} className={i ? 'pr-cmp-v' : undefined}>
                          {on
                            ? <span className="pr-cmp-yes" aria-label="Included">✓</span>
                            : <span className="pr-cmp-no" aria-label="Not included">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>

            {/* Under the table: the trial, as the Vision button (Talk to us above 2,500). */}
            <div className="pr-cmp-cta">
              <div>
                <p className="pr-cmp-cta-title">Try it on your own route.</p>
                <p className="pr-cmp-cta-text">Free for 30 days, no credit card required. Migration is on us.</p>
              </div>
              <a href={vision ? trial : '/contact'} className={`pr-cmp-cta-btn ${FOCUS}`}>
                {vision ? (isReserving ? 'Reserve your spot' : 'Start 30-day free trial') : 'Talk to us'}
              </a>
            </div>
          </div>
        </section>

        {/* 4. No hidden fees: a dark band, and a white fee card pulled up over its foot. */}
        <section className="pr-fees-band" aria-labelledby="fees-heading">
          <div className="container">
            <SectionHeader
              id="fees-heading"
              className="mb-0"
              eyebrow="No hidden fees"
              title="Some pool software charges extra for the basics. We include them."
              subtitle="Automatic billing and passing card fees on to your customers are part of every plan. Ask any vendor what they charge for these before you sign."
              eyebrowClassName="text-blue-500"
              titleClassName="pr-fees-title text-white"
              subtitleClassName="pr-fees-sub"
            />
          </div>
        </section>
        <section className="pr-fees" aria-label="Fees">
          <div className="container">
            <div className="pr-fee-card">
              <table className="pr-fee-table">
                <caption className="sr-only">What Poolnautics charges for fees other software may add</caption>
                <colgroup>
                  <col className="pr-fee-col1" />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Fee to ask about</th>
                    <th scope="col">What Poolnautics charges</th>
                  </tr>
                </thead>
                <tbody>
                  {FEES.map(([fee, figure, qualifier]) => (
                    <tr key={fee}>
                      <th scope="row">{fee}</th>
                      <td>
                        <span className="pr-fee-fig font-tnum">{figure}</span>
                        {qualifier && <span className="pr-fee-q">{qualifier}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pr-fee-note">
                <strong>The one extra:</strong> mailing paper invoices or documents is billed separately. Card processing
                is Stripe’s standard rate, paid to Stripe and not to us, and you can pass it on to customers where your
                state allows.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ (light: white), in the homepage FAQ's layout. */}
        <FaqSection
          id="pricing-faq"
          items={FAQ}
          eyebrow={null}
          title="Frequently asked questions."
          subtitle={null}
          background="#fff"
          structuredData={false}
        />

        {/* 6. Final CTA (dark) */}
        <section className="section bg-mktg-base text-center" aria-labelledby="pricing-cta-heading">
          <div className="container">
            <SectionHeader id="pricing-cta-heading" title="Ready to take your weekends back?" titleClassName="text-white" />
            <a
              href={trial}
              className={`inline-flex h-16 items-center justify-center rounded-xl bg-blue-600 px-12 text-lg font-semibold text-white transition-colors hover:bg-blue-500 ${FOCUS}`}
            >
              {isReserving ? 'Reserve your spot' : 'Start Your 30-Day Free Trial'}
            </a>
          </div>
        </section>
      </main>
      {/* On the site's own light background, as on every other page. */}
      <div style={{ background: 'var(--bg)' }}>
        <Footer />
      </div>
    </div>
  );
}
