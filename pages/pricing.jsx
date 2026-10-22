import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/pricing.css';
import Nav from '../landing/Nav.jsx';
import SectionHeader from '../landing/SectionHeader.jsx';
import FaqSection from '../landing/FaqSection.jsx';
import { trialHref, usePreviewTheme } from '../landing/preview/previewTheme.js';
import { Footer } from '../components/site-chrome.jsx';
import { BRACKETS } from '../pricingPlans.js';

// /pricing: a dark top section (hero, customer slider, billing switch, plan
// cards), then the comparison, the tier table and the FAQ on alternating light
// backgrounds, and a dark closing CTA. Built on the homepage's Tailwind setup,
// nav and SectionHeader. The top section uses only the type-scale sizes
// (text-badge … text-display, tailwind.config.js).

const INSIGHT = 'Insight';
const VISION = 'Vision';

const INSIGHT_FEATURES = [
  'Unlimited Technicians',
  'Zero-Click Billing & Autopay',
  'Drag-and-Drop Routing',
  'Free White-Glove Migration',
];
const VISION_FEATURES = [
  'API & Webhooks (Website, Google Ads, Meta)',
  'Automated SMS Lead Follow-ups',
  'Texting via Quo, Twilio, Telnyx or Dialpad',
  '“Vanishing Discount” Price Adjuster',
  'Route Handover Tool',
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
const yearlyTotal = (monthly) => monthly * 9;
const yearlySaving = (monthly) => monthly * 12 - yearlyTotal(monthly);
const perMonth = (monthly, yearly) => (yearly ? Math.round(monthly * 75) / 100 : monthly);

// The highlighted plan: blue ring, "Most popular" badge, primary button.
const FEATURED_PLAN = 'insight';
const customersLabel = (stop) => (stop === CUSTOM ? 'More than 2,500 active customers' : `Up to ${num(STOPS[stop])} active customers`);

// Comparison table: [feature, in Insight, in Vision], by category.
const COMPARE = [
  ['Routing & Operations', [
    ['Unlimited technicians & office staff', true, true],
    ['Drag-and-drop routing', true, true],
    ['Offline technician app', true, true],
    ['Route handover tool', false, true],
    ['Free white-glove migration', true, true],
  ]],
  ['Billing & Finance', [
    ['Zero-click billing & autopay', true, true],
    ['Chemicals on invoices', true, true],
    ['Card surcharge, where state law allows', true, true],
    ['Automatic overdue reminders', true, true],
    ['Pause service for overdue accounts', false, true],
    ['“Vanishing Discount” price adjuster', false, true],
  ]],
  ['Client Communication', [
    ['Texting from your business number', false, true],
    ['Automated SMS lead follow-ups', false, true],
  ]],
  ['Integrations & API', [
    ['Quo, Twilio, Telnyx and Dialpad', false, true],
    ['API & webhooks (website, Google Ads, Meta)', false, true],
  ]],
];

const FAQ = [
  ['Do I pay extra for new technicians or office staff?',
    'No. Every plan includes unlimited users. You only pay for the size of your route.'],
  ['Do paused customers count toward my price?',
    'No. Your price is based on active customers only. Paused customers don’t count.'],
  ['What happens if I go over my customer limit?',
    'You simply move into the next bracket. We’ll automatically adjust your billing for the following month. No hidden overage fees.'],
  ['Is there a setup fee?',
    'Zero setup fees, and our white-glove onboarding and data migration is 100% free.'],
  ['Do I need a credit card for the free trial?',
    'No. Sign up with just your email and start importing your route immediately.'],
  ['Is there a discount for paying yearly?',
    `Yes. Pay for a year up front and save ${YEARLY_SAVING}.`],
].map(([q, a]) => ({ q, a }));

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';

/** price: the monthly-billing price for the chosen bracket, or null above 2,500 customers. */
function PlanCard({ name, price, yearly, maxCustomers, featured, lead, features, href }) {
  return (
    <div
      className={
        featured
          ? 'relative flex flex-col rounded-2xl bg-mktg-surface p-8 shadow-[0_0_50px_-12px_rgba(37,99,235,0.25)] ring-2 ring-blue-500'
          : 'relative flex flex-col rounded-2xl border border-slate-700/50 bg-mktg-surface/50 p-8'
      }
    >
      {featured && (
        <span className="brand-pill absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-[5px] text-badge font-semibold uppercase tracking-[.06em] text-white">
          Most popular
        </span>
      )}
      <h2 className="text-title font-semibold tracking-[-0.01em] text-white">{name}</h2>
      {price ? (
        <>
          <p className="mt-4 flex flex-wrap items-baseline font-tnum">
            <span className="text-display font-bold tracking-[-0.025em] text-white">{usd(perMonth(price, yearly))}</span>
            <span className="ml-1.5 text-body text-slate-400">/mo</span>
            {yearly && (
              <>
                <s className="ml-2 text-title font-medium text-[#64748b] decoration-[1.5px]" aria-hidden="true">{usd(price)}</s>
                <span className="sr-only">, instead of {usd(price)} a month billed monthly</span>
              </>
            )}
          </p>
          {yearly ? (
            <p className="mt-3 text-meta font-tnum text-slate-300">
              Billed {usd(yearlyTotal(price))} yearly
              <span className="text-slate-500">{'  ·  '}</span>
              <span className="font-semibold text-[#4ade80]">Save {usd(yearlySaving(price))}/yr</span>
            </p>
          ) : (
            <>
              <p className="mt-3 text-meta text-slate-300">Billed monthly.</p>
              <p className="text-meta font-tnum text-[#64748b]">
                or <span className="font-semibold text-[#93b4ff]">{usd(perMonth(price, true))}/mo</span> billed yearly
              </p>
            </>
          )}
          <p className="mt-1 border-b border-slate-700/50 pb-6 text-meta font-tnum text-slate-400">Includes up to {num(maxCustomers)} active customers.</p>
        </>
      ) : (
        <>
          <p className="mt-4 flex items-baseline">
            <span className="text-display font-bold tracking-[-0.025em] text-white">Custom</span>
          </p>
          <p className="mt-3 text-meta text-slate-300">Priced for your fleet. Talk to us for a quote.</p>
          <p className="mt-1 border-b border-slate-700/50 pb-6 text-meta text-slate-400">For more than 2,500 active customers.</p>
        </>
      )}
      {lead && <p className="mt-6 text-meta font-semibold text-white">{lead}</p>}
      <ul className={`${lead ? 'mt-4' : 'mt-6'} space-y-3 text-body text-slate-300`}>
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <Check size={18} strokeWidth={2.5} className="mt-[3px] flex-none text-blue-500" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
      {/* Pinned to the card's foot so both buttons line up. */}
      <div className="mt-auto pt-8">
        <a
          href={price ? href : '/contact'}
          className={`flex h-12 items-center justify-center rounded-lg text-body font-semibold text-white transition-colors ${FOCUS} ${
            featured ? 'bg-blue-600 shadow-lg hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          {price ? 'Start 30-Day Free Trial' : 'Talk to us'}
        </a>
      </div>
    </div>
  );
}

/** The tier table's compact billing switch: the same state as the main one above the cards. */
function MiniBillingSwitch({ yearly, onChange }) {
  return (
    <fieldset className="pr-mini" data-yearly={yearly ? '' : undefined}>
      <legend className="sr-only">Billing period</legend>
      <span className="pr-mini-pill" aria-hidden="true" />
      {[[false, 'Monthly'], [true, 'Yearly']].map(([value, label]) => (
        <label key={label}>
          <input
            type="radio"
            name="billing-period-table"
            className="sr-only"
            checked={yearly === value}
            onChange={() => onChange(value)}
          />
          <span className="pr-mini-opt">
            {label}
            {value && (
              <>
                <span className="pr-mini-save" aria-hidden="true">−{YEARLY_SAVING}</span>
                <span className="sr-only">, save {YEARLY_SAVING}</span>
              </>
            )}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export default function PricingPage() {
  const trial = trialHref(usePreviewTheme());
  const [stop, setStop] = useState(0); // the slider: an index into STOPS, or CUSTOM
  const [yearly, setYearly] = useState(true);
  const bracket = stop === CUSTOM ? null : BRACKETS[stop];
  const insight = bracket && bracket[1];
  const vision = bracket && bracket[2];
  return (
    <div className="mktg relative min-h-screen bg-mktg-base font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero (dark): clears the nav like the homepage hero; one group with the slider and cards. */}
        <section className="bg-mktg-base pb-[var(--section-head-gap)] pt-[var(--page-hero-top)]" aria-labelledby="pricing-heading">
          <div className="container">
            <SectionHeader
              as="h1"
              className="mb-0"
              id="pricing-heading"
              eyebrow="Transparent pricing"
              title="Scale your route, not your overhead."
              subtitle="Stop paying a “growth tax.” Every plan includes unlimited technicians and office staff. You only pay more when your business actually grows."
              eyebrowClassName="text-caption text-blue-500"
              titleClassName="text-[clamp(34px,4.1vw,46px)] font-bold leading-[1.08] tracking-[-0.028em] text-white"
              subtitleClassName="max-w-[600px] text-slate-400"
            />
          </div>
        </section>

        {/* 2. Slider, billing switch and plan cards (dark) */}
        <section className="section bg-mktg-base pt-0" aria-label="Plans">
          <div className="container">
            {/* Customer count: one stop per price bracket, evenly spaced. */}
            <div className="pr-card">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <div>
                  <label htmlFor="pr-customers" className="text-body font-semibold text-white">How many active customers do you have?</label>
                  <p className="mt-1 text-meta text-slate-400">Paused customers don’t count.</p>
                </div>
                <p className="flex items-baseline gap-2" aria-hidden="true">
                  <span className="text-[32px] font-bold leading-none tracking-[-0.025em] text-white font-tnum">
                    {stop === CUSTOM ? '2,500+' : num(STOPS[stop])}
                  </span>
                  <span className="text-body text-[#94a3b8]">active customers</span>
                </p>
              </div>
              <div className="mt-6">
                <div className="pr-slider">
                  <div className="pr-track" />
                  <div className="pr-fill" style={{ '--fill': stop / CUSTOM }}><span className="pr-sweep" /></div>
                  {STOPS.map((_, i) => i + 1).filter((i) => i > stop).map((i) => (
                    <span key={i} className="pr-dot" style={{ '--at': i / CUSTOM }} />
                  ))}
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
              {/* Announces the new prices as the slider moves. */}
              <p className="sr-only" aria-live="polite">
                {bracket
                  ? `${customersLabel(stop)}, billed ${yearly ? 'yearly' : 'monthly'}: Insight ${usd(perMonth(insight, yearly))} a month. Vision ${usd(perMonth(vision, yearly))} a month.`
                  : `${customersLabel(stop)}: custom pricing.`}
              </p>
            </div>

            {/* Billing period: native radios under one sliding brand pill. */}
            <fieldset className="mt-10 flex justify-center">
              <legend className="sr-only">Billing period</legend>
              <div className="pr-toggle-wrap">
                <div className="pr-toggle" data-yearly={yearly ? '' : undefined}>
                  <span className="pr-toggle-pill brand-pill" aria-hidden="true" />
                  {[[false, 'Monthly'], [true, 'Yearly']].map(([value, label]) => (
                    <label key={label}>
                      <input
                        type="radio"
                        name="billing-period"
                        className="sr-only"
                        checked={yearly === value}
                        onChange={() => setYearly(value)}
                      />
                      <span className="pr-toggle-opt">{label}</span>
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
              </div>
            </fieldset>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <PlanCard
                name={INSIGHT}
                price={insight}
                yearly={yearly}
                maxCustomers={STOPS[stop]}
                featured={FEATURED_PLAN === 'insight'}
                features={INSIGHT_FEATURES}
                href={trial}
              />
              <PlanCard
                name={VISION}
                price={vision}
                yearly={yearly}
                maxCustomers={STOPS[stop]}
                featured={FEATURED_PLAN === 'vision'}
                lead="Everything in Insight, plus:"
                features={VISION_FEATURES}
                href={trial}
              />
            </div>
          </div>
        </section>

        {/* 3. Feature comparison (light: white) */}
        <section id="compare" className="section bg-white" aria-labelledby="compare-heading">
          <div className="container">
            <SectionHeader id="compare-heading" title="Everything included, side by side" titleClassName="text-slate-900" />
            <table className="w-full table-fixed text-sm sm:text-[15px]">
              <caption className="sr-only">Compare plans</caption>
              <colgroup>
                <col />
                <col className="w-[6.5rem] sm:w-48" />
                <col className="w-[6.5rem] sm:w-48" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200">
                  <th scope="col" className="pb-4 text-left font-medium text-slate-500">Feature</th>
                  <th scope="col" className="pb-4 text-center font-semibold text-slate-900">{INSIGHT}</th>
                  <th scope="col" className="pb-4 text-center font-semibold text-slate-900">{VISION}</th>
                </tr>
              </thead>
              {COMPARE.map(([category, rows]) => (
                <tbody key={category}>
                  <tr>
                    <th colSpan={3} scope="colgroup" className="pb-3 pt-10 text-left text-base font-semibold text-slate-900">
                      {category}
                    </th>
                  </tr>
                  {rows.map(([feature, inInsight, inVision]) => (
                    <tr key={feature} className="border-b border-slate-100">
                      <th scope="row" className="py-3.5 pr-4 text-left font-normal text-slate-600">{feature}</th>
                      {[inInsight, inVision].map((on, i) => (
                        <td key={i} className="py-3.5 text-center">
                          {on
                            ? <span className="font-semibold text-blue-600" aria-label="Included">✓</span>
                            : <span className="text-slate-300" aria-label="Not included">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </section>

        {/* 4. Route size brackets (light: slate-50) */}
        <section className="section bg-slate-50 text-center" aria-labelledby="brackets-heading">
          <div className="container">
            <SectionHeader
              id="brackets-heading"
              title="Got a larger fleet? We scale with you."
              subtitle="Your price simply adjusts based on your active customer count. Paused customers don’t count. No surprises."
              titleClassName="text-slate-900"
              subtitleClassName="text-slate-600"
            />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
              {/* Top bar: title, and a second switch on the same billing-period state as the one above the cards. */}
              <div className="flex flex-col gap-3 border-b border-[#e2e8f0] px-6 py-[18px] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-body font-semibold text-[#0f172a]">Price by company size</p>
                <MiniBillingSwitch yearly={yearly} onChange={setYearly} />
              </div>
              <table className="w-full table-fixed">
                <caption className="sr-only">{yearly ? 'Price per month, billed yearly,' : 'Monthly price'} by active customers</caption>
                <colgroup>
                  <col className="w-[34%] max-[359px]:w-[30%]" />
                  <col className="w-[33%] max-[359px]:w-[35%]" />
                  <col className="w-[33%] max-[359px]:w-[35%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th scope="col" className="px-4 py-[18px] text-left text-meta font-medium text-[#64748b] sm:px-6">Active customers</th>
                    <th scope="col" className="px-2 py-[18px] text-center text-body font-semibold text-[#0f172a]">{INSIGHT}</th>
                    <th scope="col" className="px-2 py-[18px] text-center text-body font-semibold text-[#0f172a]">{VISION}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Each row selects its tier on the slider (click, Enter or Space). */}
                  {BRACKETS.map(([size, ...prices], row) => (
                    <tr
                      key={size}
                      tabIndex={0}
                      aria-current={row === stop ? 'true' : undefined}
                      onClick={() => setStop(row)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStop(row); }
                      }}
                      className={`cursor-pointer border-b border-[#f1f5f9] transition-colors last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500 ${
                        row === stop ? 'bg-[#f5f9ff]' : 'hover:bg-[#f8fafc]'
                      }`}
                    >
                      {/* Phones: one step down the type scale (two under 360px) so the longest yearly price ($1,559.25/mo) stays on one line. */}
                      <th scope="row" className="whitespace-nowrap py-3.5 pl-4 pr-1 text-left text-meta font-medium text-[#0f172a] max-[359px]:pl-3 max-[359px]:text-caption sm:px-6 sm:text-body">{size}</th>
                      {prices.map((price, i) => (
                        <td key={i} className="whitespace-nowrap px-1 py-3.5 text-center font-tnum sm:px-2">
                          <span className="text-body font-semibold tracking-[-0.01em] text-[#0f172a] max-[359px]:text-meta sm:text-lead">{usd(perMonth(price, yearly))}</span>
                          <span className="text-caption text-[#94a3b8] sm:text-meta">/mo</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Enterprise: above the last bracket. */}
              <div className="flex flex-col gap-4 border-t border-[#e2e8f0] bg-white px-6 py-5 text-left sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body font-semibold text-[#0f172a]">More than 2,500 active customers?</p>
                  <p className="text-meta text-[#64748b]">We’ll build a plan around your operation.</p>
                </div>
                <a
                  href="/contact"
                  className={`flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-6 text-body font-semibold text-white shadow-lg transition-colors hover:bg-[#3b82f6] ${FOCUS}`}
                >
                  Talk to us <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
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
              Start Your 30-Day Free Trial
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
