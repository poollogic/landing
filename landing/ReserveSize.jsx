import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BRACKETS } from '../pricingPlans.js';
import './reserve.css';

// The "Reserve your spot" card's first step, shared by /reserve (pages/reserve.jsx) and the
// homepage's reserve section (ReserveSection.jsx): pick a size, see your rate, Next.
// Prices come from pricingPlans.js (the same list /pricing uses). Styles: reserve.css.

// [button label, submitted value]. Values are the form's existing customer options
// (formOptions.js, from the pricing brackets).
export const OVER = 'More than 2,500';
export const SIZES = [...BRACKETS.map(([customers]) => [customers, customers]), ['2,500+', OVER]];
export const sizeLabel = (value) => SIZES.find(([, v]) => v === value)?.[0] ?? value;
export const priceRow = (value) => BRACKETS.find(([customers]) => customers === value);
export const isSize = (value) => SIZES.some(([, v]) => v === value);

// The checked points beside the card
export const FEATURES = [
  ['Price up front', 'Your rate shows the moment you pick a size.'],
  ['We move your customers', 'We bring them over and set up your automations with you.'],
  ['30 days to decide', 'Test drive any tier for 30 days before committing.'],
  ['No credit card', 'Reserving is free. We reach out to schedule.'],
];

export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';

/** The homepage feature-list check: an 18px circle, rgba(59,130,246,.15), with a #3B82F6 tick. */
export const CheckDot = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={`flex-none ${className}`} aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="rgba(59,130,246,.15)" />
    <path d="M6 10.4l2.6 2.6L14 7.6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function FeatureList() {
  return (
    <ul className="rsv-features">
      {FEATURES.map(([title, body]) => (
        <li key={title}>
          <CheckDot className="mt-[2px]" />
          <div>
            <p className="rsv-feature-t">{title}</p>
            <p className="rsv-feature-d">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** (1) Your size — line — (2) Your details. The line fills to 50% once a size is picked, 100% on step 2. */
export function Stepper({ step, size }) {
  const fill = step === 2 ? 100 : size ? 50 : 0;
  const Dot = ({ n, label, state }) => (
    <span className={`rsv-stepper-item is-${state}`}>
      <span className="rsv-stepper-dot">{state === 'done' ? <CheckDot size={22} /> : n}</span>
      {label}
    </span>
  );
  return (
    <div className="rsv-stepper" aria-label={`Step ${step} of 2`}>
      <Dot n={1} label="Your size" state={step === 2 ? 'done' : 'active'} />
      <span className="rsv-stepper-line" aria-hidden="true"><i style={{ width: `${fill}%` }} /></span>
      <Dot n={2} label="Your details" state={step === 2 ? 'active' : 'todo'} />
    </div>
  );
}

/** Slides open (grid rows 0fr → 1fr). */
export function Reveal({ open, children }) {
  return (
    <div className={`rsv-reveal${open ? ' is-open' : ''}`} aria-hidden={open ? undefined : 'true'}>
      <div>{children}</div>
    </div>
  );
}

/** Their rate for the size picked, locked in when they reserve. */
export function PricePanel({ size }) {
  const row = priceRow(size);
  if (!size) return null;
  if (!row) {
    return (
      <div className="rsv-price">
        <p className="rsv-price-trial">Either way, you start with a 30-day free trial.</p>
        <p>Over 2,500 customers is priced individually. We’ll set your rate with you on the call.</p>
      </div>
    );
  }
  return (
    <div className="rsv-price">
      <p className="rsv-price-trial">Insight or Vision? Your 30-day free trial gives you plenty of time to decide.</p>
      <div className="rsv-price-plans">
        <div><small>Insight</small><b>${row[1]}</b><span>/mo</span><em>Core routing &amp; billing</em></div>
        <div><small>Vision</small><b>${row[2]}</b><span>/mo</span><em>Advanced automations &amp; integrations</em></div>
      </div>
      <p><span className="rsv-locked">Locked in today</span><span className="rsv-sep"> · </span>Save an extra 25% paying yearly</p>
    </div>
  );
}

/** Step 1: the size question, the size buttons, the rate and Next. */
export function SizeStep({ size, onSize, onNext, error, className = '' }) {
  return (
    <div className={className}>
      <h2 className="rsv-h2">How many active customers?</h2>
      <p className="rsv-h2-sub">Pick your size to see your rate.</p>
      <div className="rsv-sizes" role="radiogroup" aria-label="Active customers">
        {SIZES.map(([label, value]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={size === value}
            className={`rsv-size${size === value ? ' is-on' : ''}${value === OVER ? ' is-wide' : ''} ${FOCUS}`}
            onClick={() => onSize(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p className="rsv-error">{error}</p>}
      <Reveal open={!!size}><PricePanel size={size} /></Reveal>
      <button type="button" className={`hero-cta rsv-cta ${FOCUS}`} disabled={!size} onClick={onNext}>
        <span className="hero-cta-label">Next</span>
        <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <p className="rsv-fine">
        <b>No credit card. Cancel within 30 days and you pay nothing.</b> Takes about 30 seconds.
      </p>
    </div>
  );
}
