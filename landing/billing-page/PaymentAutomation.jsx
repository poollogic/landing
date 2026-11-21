import React, { useId, useRef, useState } from 'react';
import {
  ArrowRight, Bell, Calendar, Check, CreditCard, Link as LinkIcon, List, Mail, Pointer, Printer, RotateCcw, User, XCircle,
} from 'lucide-react';
import { PrimaryCta } from '../ai/shared.jsx';
import { usePreviewTheme } from '../preview/previewTheme.js';
import { BILLED, CUSTOMERS, EMAILED, MAILED, RATE } from './billingDemo.js';
import './payment-automation.css';

// /recurring-billing's payment automation sections (pages/billing.jsx), on /ai-and-automations' type:
//   A  HowCustomersPay   how a customer pays, as a "When / Then" card per option, then the month's totals
//   B  FailedPayments    what happens when an autopay card fails
//   C  CardFees          a calculator: the card fees a company stops paying by passing them on
//   D  BeyondRate        chemicals and repairs on the invoice too
//   E  YourMoney         where the money goes (dark)
//   F  ClosingCta        the page's last call to action (dark, after the FAQ)
// Every option's and every card's text is in the pre-rendered HTML; choosing only shows and hides.
// Styles: payment-automation.css (.pa-*). Examples, not real data; the month's figures come from
// billingDemo.js, the same numbers as the hero's calendar.

const fmt = new Intl.NumberFormat('en-US');
const money = (dollars) => `$${fmt.format(dollars)}`;
const cents = (c) => `$${(c / 100).toFixed(2)}`;

/* ---------- Shared pieces ---------- */

/** A section head: eyebrow, a two-tone H2 (its first sentence muted, on its own line) and a sub. */
function Head({ id, eyebrow, a, b, sub, center = false }) {
  return (
    <div className={`pa-head${center ? ' pa-head--center' : ''}`}>
      <p className="pa-eyebrow">{eyebrow}</p>
      <h2 id={id} className="pa-h2">
        {b ? <><span className="pa-h2-a">{a}</span>{' '}<span className="pa-h2-b">{b}</span></> : a}
      </h2>
      {sub && <p className="pa-sub">{sub}</p>}
    </div>
  );
}

const Tick = () => (
  <span className="pa-tick" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);

/** A product card: a label, title and status pill, then a When / Then timeline. */
function ProductCard({ label, title, pill, steps, ...rest }) {
  return (
    <div className="pa-product" {...rest}>
      <div className="pa-product-head">
        <div>
          <p className="pa-product-label">{label}</p>
          <h3 className="pa-product-title">{title}</h3>
        </div>
        <span className="pa-pill">{pill}</span>
      </div>
      <ol className="pa-steps" role="list">
        {steps.map(({ when, title: t, note, Icon }) => (
          <li key={t} className="pa-step">
            <span className="pa-step-icon" aria-hidden="true"><Icon size={16} strokeWidth={2} /></span>
            <div className="pa-step-text">
              <span className="pa-step-kind">{when ? 'When' : 'Then'}</span>
              <span className="pa-step-title">{t}</span>
              {note && <span className="pa-step-note">{note}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- A. How customers pay ---------- */

const PAY_OPTIONS = [
  {
    id: 'autopay',
    label: 'Charge the card on file',
    card: {
      title: 'Autopay',
      pill: `Paid · ${cents(RATE * 100)}`,
      steps: [
        { when: true, title: 'Dana’s billing day arrives', note: 'The 5th of each month, in the 8:30 AM run', Icon: Calendar },
        { title: 'Her invoice is emailed', note: `${cents(RATE * 100)} for weekly pool service`, Icon: Mail },
        { title: 'The card on file is charged', note: 'Visa ···· 4242', Icon: CreditCard },
        { title: 'The receipt is emailed', note: 'Marked paid. Nothing for you to do.', Icon: Check },
      ],
    },
  },
  {
    id: 'pay-button',
    label: 'A Pay button in the emailed invoice',
    card: {
      title: 'One-tap payment',
      pill: `Paid · ${cents(RATE * 100)}`,
      steps: [
        { when: true, title: 'The invoice lands in their inbox', note: 'With a Pay now button', Icon: Mail },
        { title: 'They tap Pay now', note: 'No login, no app, no password', Icon: Pointer },
        { title: 'They pay by card', note: 'And can save it for autopay next time', Icon: CreditCard },
        { title: 'The receipt is emailed', note: 'Marked paid on your dashboard', Icon: Check },
      ],
    },
  },
  {
    id: 'mailed',
    label: 'Printed and mailed for you',
    card: {
      title: 'Mailed invoices',
      pill: 'Mailed',
      steps: [
        { when: true, title: 'A customer has no email on file', Icon: User },
        { title: 'Their invoice is printed and posted', note: 'Nothing for you to stuff or stamp', Icon: Printer },
        { title: 'It’s logged in the same billing run', note: 'So you can see everything that went out', Icon: List },
      ],
    },
  },
];

const TOTALS = [
  { n: fmt.format(CUSTOMERS), label: 'customers billed' },
  { n: fmt.format(EMAILED), label: 'invoices emailed' },
  { n: fmt.format(MAILED), label: 'invoices mailed' },
  { n: money(BILLED), label: 'billed' },
  { n: '0', label: 'buttons pressed' },
];

export function HowCustomersPay() {
  const [sel, setSel] = useState(0);
  const refs = useRef([]);
  const labelId = useId();
  // A radio group: arrows move the choice (and focus) round the three, Home and End jump.
  const onKey = (e, i) => {
    const n = PAY_OPTIONS.length;
    const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const next = (to + n) % n;
    setSel(next);
    refs.current[next]?.focus();
  };
  return (
    <section className="pa-section pa-white" aria-labelledby="pa-pay-title">
      <div className="container">
        <div className="pa-inner">
          <div className="pa-split">
            <div className="pa-copy">
              <Head
                id="pa-pay-title"
                eyebrow="Payment automation"
                a="You’re on the route at 8:30."
                b="Your payments collect themselves."
                sub="Built for mobile pool service businesses. Set a customer up once and Poolnautics bills them, collects, and sends the receipt."
              />
              <p className="pa-choose" id={labelId}>How customers pay <span className="pa-choose-hint">Tap one</span></p>
              <div className="pa-options" role="radiogroup" aria-labelledby={labelId}>
                {PAY_OPTIONS.map((o, i) => (
                  <button
                    key={o.id}
                    ref={(el) => { refs.current[i] = el; }}
                    type="button"
                    role="radio"
                    aria-checked={sel === i}
                    aria-controls={`pa-pay-${o.id}`}
                    tabIndex={sel === i ? 0 : -1}
                    className={`pa-option${sel === i ? ' is-on' : ''}`}
                    onClick={() => setSel(i)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    <span className="pa-radio" aria-hidden="true" />
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="pa-visual">
              {PAY_OPTIONS.map((o, i) => (
                <ProductCard
                  key={o.id}
                  id={`pa-pay-${o.id}`}
                  hidden={sel !== i}
                  label="8:30 AM billing run"
                  {...o.card}
                />
              ))}
            </div>
          </div>

          <div className="pa-totals">
            <p className="pa-totals-label"><span className="pa-dot" aria-hidden="true" />That same month, added up</p>
            <dl className="pa-totals-grid">
              {TOTALS.map((t) => (
                <div key={t.label} className="pa-total">
                  <dt>{t.label}</dt>
                  <dd>{t.n}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- B. Failed payments ---------- */

export function FailedPayments() {
  return (
    <section className="pa-section pa-grey" aria-labelledby="pa-failed-title">
      <div className="container">
        <div className="pa-inner">
          <div className="pa-split pa-split--mirror">
            <div className="pa-copy">
              <Head
                id="pa-failed-title"
                eyebrow="Failed payments"
                a="A card fails."
                b="You don’t pick up the phone."
                sub="Expired, declined or replaced. Poolnautics works through it and only tells you once the customer has already been asked to fix it."
              />
              <ul className="pa-checks" role="list">
                {['No awkward call about a declined card', 'The customer fixes it themselves from the email', 'Next month’s billing carries on as normal'].map((t) => (
                  <li key={t}><Tick />{t}</li>
                ))}
              </ul>
            </div>
            <div className="pa-visual">
              <ProductCard
                label="When autopay fails"
                title="Failed card follow-up"
                pill="Automatic"
                steps={[
                  { when: true, title: 'An autopay charge is declined', note: 'Expired, replaced or over its limit', Icon: XCircle },
                  { title: 'The card is retried once', Icon: RotateCcw },
                  { title: 'The customer is emailed a link', note: 'To update their card themselves', Icon: LinkIcon },
                  { title: 'Your dashboard flags it', note: '“Payment failed · card retried, customer emailed”', Icon: Bell },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- C. Card fees ---------- */

const FEE_PCT = 2.9;

/** A labelled slider, its current value at the right of its label, and the value read out as text. */
function Slider({ label, value, min, max, step, onChange, show }) {
  const id = useId();
  return (
    <div className="pa-slider">
      <div className="pa-slider-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="pa-slider-value">{show(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={show(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function CardFees() {
  const [customers, setCustomers] = useState(200);
  const [bill, setBill] = useState(RATE);
  // In whole cents and dollars, so $145 × 2.9% is $4.21 (4.205 rounds up) and 200 of them $841.
  const feeCents = Math.round((bill * 100 * FEE_PCT) / 100);
  const monthly = Math.round((customers * bill * FEE_PCT) / 100);
  const yearly = monthly * 12;
  return (
    <section className="pa-section pa-white" aria-labelledby="pa-fees-title">
      <div className="container">
        <div className="pa-inner">
          <Head
            center
            id="pa-fees-title"
            eyebrow="Card fees"
            a="Most pool companies eat the card fees."
            b="Yours can pass them on."
            sub="Add a surcharge to card payments and the processing fee comes off your books."
          />
          <div className="pa-pair">
            <div className="pa-card pa-calc">
              <p className="pa-card-label">Try your numbers</p>
              <Slider label="Customers paying by card" value={customers} min={25} max={1000} step={25} onChange={setCustomers} show={(v) => fmt.format(v)} />
              <Slider label="Average monthly bill" value={bill} min={80} max={300} step={5} onChange={setBill} show={(v) => money(v)} />
              <dl className="pa-calc-rows">
                <div><dt>One invoice</dt><dd>{cents(bill * 100)}</dd></div>
                <div><dt>Card fee, {FEE_PCT}%</dt><dd>+ {cents(feeCents)}</dd></div>
                <div className="is-keep"><dt>You keep</dt><dd>{cents(bill * 100)}</dd></div>
              </dl>
            </div>
            <div className="pa-dark-card">
              <p className="pa-card-label">Card fees you stop paying</p>
              <p className="pa-big">{money(monthly)}<span> a month</span></p>
              <p className="pa-big-note">That’s {money(yearly)} a year that stays with you, at a {FEE_PCT}% card fee.</p>
              <p className="pa-fine">Example figures. Surcharging is available where state law allows.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- D. Beyond the monthly rate ---------- */

export function BeyondRate() {
  return (
    <section className="pa-section pa-grey" aria-labelledby="pa-beyond-title">
      <div className="container">
        <div className="pa-inner">
          <Head
            center
            id="pa-beyond-title"
            eyebrow="Beyond the monthly rate"
            a="The monthly rate bills itself."
            b="So does everything else."
            sub="A finished job that never gets invoiced is the easiest way for a pool company to lose money."
          />
          <div className="pa-pair">
            <div className="pa-card">
              <p className="pa-card-label pa-card-label--blue">On every plan</p>
              <h3 className="pa-h3">Chemicals on the invoice</h3>
              <p className="pa-p">Turn it on for a customer and the chemicals your tech logs at each visit are added to that month’s invoice.</p>
              <div className="pa-snippet">
                <div><span>Weekly pool service</span><span>{cents(RATE * 100)}</span></div>
                <div className="is-green"><span>Chemicals used in May</span><span>+ $18.40</span></div>
              </div>
            </div>
            <div className="pa-card">
              <p className="pa-card-label pa-card-label--blue">Vision plan</p>
              <h3 className="pa-h3">Repairs invoiced on completion</h3>
              <p className="pa-p">When a tech marks a job complete, the invoice goes out by itself after the delay you choose.</p>
              <div className="pa-snippet">
                <div><span>1:07 PM · Justin marked DE split &amp; clean complete</span></div>
                <div className="is-green"><span>1:12 PM · Invoice sent to Avery Collins</span><span>$175.00</span></div>
              </div>
            </div>
          </div>
          <p className="pa-more"><a href="/ai-and-automations">See how automations work<ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" /></a></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- E. Your money (dark) ---------- */

export function YourMoney() {
  return (
    <section className="pa-section pa-dark" aria-labelledby="pa-money-title">
      <div className="container">
        <div className="pa-inner pa-money">
          <Head id="pa-money-title" eyebrow="Your money" a="Where does the money go?" />
          <div className="pa-money-answer">
            <p className="pa-money-big">Straight into your own Stripe account, then out to your bank. We never take a cut.</p>
            <p className="pa-money-small">Poolnautics never holds your money, never charges a per-invoice fee, and never sees or stores a full card number. You pay for your plan and nothing else, however much you bill.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- F. Closing call to action (dark, after the FAQ) ---------- */

export function ClosingCta() {
  const theme = usePreviewTheme();
  return (
    <section className="pa-section pa-dark pa-close" aria-labelledby="pa-close-title">
      <div className="container">
        <div className="pa-close-inner">
          <h2 id="pa-close-title" className="pa-h2 pa-close-title">Put your payments on autopilot.</h2>
          <p className="pa-sub">Set each customer up once. Poolnautics bills them, collects, and follows up.</p>
          <div className="pa-close-row">
            <PrimaryCta theme={theme} />
            <a href="/pricing" className="pa-text-link">See pricing</a>
          </div>
          <p className="pa-close-fine">Free for 30 days · No credit card</p>
        </div>
      </div>
    </section>
  );
}
