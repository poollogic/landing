import React, { useId, useState } from 'react';

// /recurring-billing's settings section: a customer's billing settings (left) and the invoice they
// produce (right), a copy of the customer invoice page on portal.poolnautics.app drawn as a sheet of US
// Letter paper. The settings work, and the invoice follows them: the frequency sets the line, its
// quantity and the totals; the terms set the due date; autopay swaps "Pay now" for "Paid"; the
// surcharge shows or hides its line. Styles: billing-page.css (.bp-setup, .bp-set-*, .inv-*). An
// example customer and company, not real data.

const RATE = 145;
const INVOICE_DATE = Date.UTC(2025, 4, 5); // 05/05/2025, the customer's billing day
const DAY_MS = 86400000;

const FREQUENCIES = {
  Monthly: { qty: 1, period: 'month', adverb: 'monthly', day: '5th of each month' },
  Quarterly: { qty: 3, period: 'quarter', adverb: 'quarterly', day: '5th, every 3 months' },
  Yearly: { qty: 12, period: 'year', adverb: 'yearly', day: 'May 5th, every year' },
};
const TERMS = [
  { value: 0, short: 'Due on Receipt', label: 'Due on Receipt' },
  { value: 15, short: 'Net 15', label: 'Net 15 — 15 days' },
  { value: 30, short: 'Net 30', label: 'Net 30 — 30 days' },
  { value: 45, short: 'Net 45', label: 'Net 45 — 45 days' },
  { value: 60, short: 'Net 60', label: 'Net 60 — 60 days' },
];

const money = (n) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
const usDate = (ms) => {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${d.getUTCFullYear()}`;
};

function Switch({ on, onChange, labelledBy }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-labelledby={labelledBy} className={`bp-switch${on ? ' is-on' : ''}`} onClick={() => onChange(!on)}>
      <i aria-hidden="true" />
    </button>
  );
}

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// The company's logo on the invoice: an emblem (sun over waves in a ring) and its name.
const Emblem = ({ id }) => (
  <svg viewBox="0 0 60 60" width="58" height="58" aria-hidden="true">
    <defs>
      <clipPath id={`${id}c`}><circle cx="30" cy="30" r="27" /></clipPath>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e8f4ff" /><stop offset="1" stopColor="#bfe0fb" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="29" fill="#0e2a4d" />
    <g clipPath={`url(#${id}c)`}>
      <rect width="60" height="60" fill={`url(#${id}s)`} />
      <circle cx="30" cy="27" r="9" fill="#f6b73c" />
      <path d="M-2 30c5.3-4 10.7-4 16 0s10.7 4 16 0 10.7-4 16 0 10.7 4 16 0V62H-2z" fill="#49a6ee" />
      <path d="M-10 38c5.3-4 10.7-4 16 0s10.7 4 16 0 10.7-4 16 0 10.7 4 16 0 10.7-4 16 0V62h-80z" fill="#1f6fc4" />
      <path d="M-2 46c5.3-4 10.7-4 16 0s10.7 4 16 0 10.7-4 16 0 10.7 4 16 0V62H-2z" fill="#0e2a4d" />
    </g>
  </svg>
);

function Invoice({ frequency, terms, autopay, surcharge, uid }) {
  const f = FREQUENCIES[frequency];
  const total = RATE * f.qty;
  return (
    <div className="bp-invoice-wrap">
      <figure className="bp-invoice" aria-label="Example invoice, made from the settings">
        <div className="inv-top">
          <div className="inv-logo">
            <Emblem id={uid} />
            <div>
              <p className="inv-word">Beachside</p>
              <p className="inv-word-sub">POOL CARE</p>
            </div>
          </div>
          <div className="inv-meta">
            <p className="inv-kind">Invoice</p>
            <p className="inv-meta-line">INV - 11042</p>
            <p className="inv-meta-line"><b>DATE:</b> {usDate(INVOICE_DATE)}</p>
            <p className="inv-meta-line"><b>DUE DATE:</b> {usDate(INVOICE_DATE + terms * DAY_MS)}</p>
          </div>
        </div>

        <div className="inv-parties">
          <div>
            <p className="inv-label">FROM</p>
            <p className="inv-name">BEACHSIDE POOL CARE</p>
            <p className="inv-line">400 Marina Boulevard</p>
            <p className="inv-line">Clearwater, FL 33755</p>
            <p className="inv-line">billing@beachsidepoolcare.com</p>
            <p className="inv-line">(727) 555-0142</p>
          </div>
          <div>
            <p className="inv-label">TO</p>
            <p className="inv-name">Dana Whitfield</p>
            <p className="inv-line">18 Lakeview Drive</p>
            <p className="inv-line">Clearwater, FL 33764</p>
            <p className="inv-line">dana.whitfield@email.com</p>
            <p className="inv-line">(727) 555-0178</p>
          </div>
        </div>

        <div className="inv-bar">
          <span>DESCRIPTION</span><span>QTY</span><span>PRICE</span><span>TOTAL</span>
        </div>
        <div className="inv-item">
          <div>
            <p className="inv-item-title">Weekly Pool Service - {frequency} Billing</p>
            <p className="inv-item-desc">
              Weekly pool service provided throughout the {f.period} and billed {f.adverb}. Includes water
              testing and balancing, surface cleaning, debris removal and an equipment check.
            </p>
          </div>
          <span>{f.qty}</span>
          <span>{money(RATE)}</span>
          <span className="inv-item-total">{money(total)}</span>
        </div>

        <div className="inv-totals">
          <p className="inv-subtotal"><span>Subtotal</span><span>{money(total)}</span></p>
          <p className="inv-total"><span>Total</span><span>{money(total)}</span></p>
        </div>
        {surcharge && <p className="inv-surcharge">Add 2.9% if paying by credit card.</p>}

        {autopay
          ? <p className="inv-paid"><span className="inv-paid-tag">Paid</span>Card on file charged automatically</p>
          : <span className="inv-pay">Pay now</span>}
      </figure>
    </div>
  );
}

export default function BillingSetup() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [frequency, setFrequency] = useState('Monthly');
  const [terms, setTerms] = useState(15);
  const [autopay, setAutopay] = useState(false);
  const [surcharge, setSurcharge] = useState(true);
  const id = (name) => `${uid}-${name}`;
  const termsShort = TERMS.find((t) => t.value === terms).short;

  return (
    <div className="bp-setup-grid">
      <div className="bp-setup-copy">
        <h2 id="bp-setup-title" className="bp-setup-title">Get paid every month without doing the billing.</h2>
        <p className="bp-setup-sub">
          Set a customer up once, with their own rate, billing day and payment terms. Their invoice goes out on
          schedule without you.
        </p>
        <div className="bp-settings">
          <div className="bp-set-row bp-set-row--freq">
            <span id={id('freq')} className="bp-set-label">Billing frequency</span>
            <div className="bp-seg" role="group" aria-labelledby={id('freq')}>
              {Object.keys(FREQUENCIES).map((name) => (
                <button key={name} type="button" className={`bp-seg-item${frequency === name ? ' is-on' : ''}`} aria-pressed={frequency === name} onClick={() => setFrequency(name)}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="bp-set-row">
            <span className="bp-set-label">Monthly rate</span>
            <span className="bp-set-value">{money(RATE)}</span>
          </div>
          <div className="bp-set-row">
            <span className="bp-set-label">Billing day</span>
            <span className="bp-set-value">{FREQUENCIES[frequency].day}</span>
          </div>
          <div className="bp-set-row">
            <label htmlFor={id('terms')} className="bp-set-label">Payment terms</label>
            <span className="bp-select">
              <span className="bp-set-value" aria-hidden="true">{termsShort}</span>
              <Chevron />
              <select id={id('terms')} value={terms} onChange={(e) => setTerms(Number(e.target.value))}>
                {TERMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </span>
          </div>
          <div className="bp-set-row">
            <span id={id('autopay')} className="bp-set-label">Autopay</span>
            <Switch on={autopay} onChange={setAutopay} labelledBy={id('autopay')} />
          </div>
          <div className="bp-set-row">
            <span id={id('surcharge')} className="bp-set-label">Credit card surcharge</span>
            <span className="bp-set-pair">
              <span className={`bp-set-value${surcharge ? '' : ' is-dim'}`}>2.9%</span>
              <Switch on={surcharge} onChange={setSurcharge} labelledBy={id('surcharge')} />
            </span>
          </div>
        </div>
      </div>
      <Invoice frequency={frequency} terms={terms} autopay={autopay} surcharge={surcharge} uid={uid} />
    </div>
  );
}
