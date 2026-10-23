import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/reserve.css';
import Nav from '../landing/Nav.jsx';
import Turnstile from '../landing/Turnstile.jsx';
import { submitForm } from '../landing/forms.js';
import { TURNSTILE_SITE_KEY } from '../landing/onboarding.js';
import { SOFTWARE_OPTIONS, TIMING_OPTIONS } from '../formOptions.js';
import { CheckDot, FOCUS, FeatureList, SizeStep, Stepper, isSize, priceRow, sizeLabel } from '../landing/ReserveSize.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /reserve: "Reserve your spot". While landing/onboarding.js is set to 'reserve', every sign-up
// button on the site comes here (the homepage's reserve section sends ?size=, so they land on
// step 2 with their size picked). Two steps in one card: (1) their size, which shows their rate
// straight away, then (2) their details. Requests go to /api/request (server/requestForm.js):
// the owner gets an email, the person gets a personal confirmation, and they join the waitlist
// audience. Styles: the homepage hero's classes (hero.css) plus landing/reserve.css.

function Field({ label, name, error, optional, children }) {
  return (
    <label className="rsv-field">
      <span className="rsv-label">{label}{optional && <span> (optional)</span>}</span>
      {children}
      {error && <span id={`${name}-error`} className="rsv-error">{error}</span>}
    </label>
  );
}

const Input = ({ name, error, ...props }) => (
  <input name={name} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className="rsv-input" {...props} />
);

const Select = ({ name, options, error }) => (
  <select name={name} defaultValue="" aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className="rsv-input rsv-select">
    <option value="" disabled>Choose one</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

function Success({ name, already }) {
  const first = (name || '').trim().split(' ')[0];
  return (
    <div className="rsv-success" role="status">
      <CheckDot size={48} />
      <h2>{already ? `You’re already in${first ? `, ${first}` : ''}.` : `You’re in${first ? `, ${first}` : ''}.`}</h2>
      <p>Your rate is locked. We’ll reach out personally to schedule your 10-minute onboarding call.</p>
    </div>
  );
}

export default function ReservePage() {
  const startedAt = useRef(Date.now());
  const formRef = useRef(null);
  // Arriving from the homepage's reserve section with a size: straight to step 2
  const [initialSize] = useState(() => {
    const v = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('size') : null;
    return isSize(v) ? v : '';
  });
  const [step, setStep] = useState(initialSize ? 2 : 1);
  const [dir, setDir] = useState(initialSize ? 'right' : 'none'); // which way the step slides in: right (forward) | left (back)
  const [size, setSize] = useState(initialSize);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [result, setResult] = useState({});
  const [token, setToken] = useState(null);
  const onToken = useCallback((t) => setToken(t), []);
  const [checkKey, setCheckKey] = useState(0); // remounts the bot check for a fresh one-time token

  const goTo = (n) => {
    setDir(n > step ? 'right' : 'left');
    setStep(n);
  };
  // Entering step 2: the name field gets the focus (not on the first render, not going back)
  useEffect(() => {
    if (step === 2 && dir === 'right') formRef.current?.elements.name?.focus();
  }, [step, dir]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (TURNSTILE_SITE_KEY && !token) {
      setError('Please finish the quick security check above (tick the box if you see one), then try again.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setError('');
    setFields({});
    const out = await submitForm('waitlist', form, { startedAt: startedAt.current, turnstileToken: token });
    if (out.ok) {
      setResult({ name: form.elements.name.value, already: out.already });
      setStatus('done');
    } else {
      setError(out.error);
      setFields(out.fields);
      setStatus('error');
      setToken(null);
      setCheckKey((k) => k + 1);
      // Show whichever part of the form the problem is in
      if (out.fields?.customers) goTo(1);
      if (out.fields?.software || out.fields?.timing || out.fields?.message) setDetailsOpen(true);
    }
  };

  const row = priceRow(size);

  return (
    <div className="mktg rsv-page relative flex min-h-screen flex-col font-sans text-mktg-muted antialiased">
      <Nav />
      <main className="flex-1">
        <section className="hero rsv-hero relative overflow-x-clip" aria-labelledby="reserve-heading">
          <div className="container">
            <div className="rsv-grid">
              {/* Left: the promise */}
              <div className="rsv-intro">
                <p className="hero-eyebrow">White-glove onboarding</p>
                <h1 id="reserve-heading" className="hero-title">Reserve your spot.</h1>
                <p className="hero-sub">
                  See your price now. We’ll move your customers over and <strong>set everything up with you</strong> on a
                  10-minute call.
                </p>
                <FeatureList />
              </div>

              {/* Right: the two-step card */}
              <div className="rsv-card">
                {status === 'done' ? (
                  <Success {...result} />
                ) : (
                  <form ref={formRef} onSubmit={onSubmit} noValidate>
                    <Stepper step={step} size={size} />
                    {/* The size picker's value, submitted as before (the old <select name="customers">) */}
                    <input type="hidden" name="customers" value={size} />

                    {step === 1 ? (
                      <SizeStep
                        key="size"
                        className={`rsv-panel is-from-${dir}`}
                        size={size}
                        onSize={setSize}
                        onNext={() => goTo(2)}
                        error={fields.customers}
                      />
                    ) : (
                      <div key="details" className={`rsv-panel is-from-${dir}`}>
                        <div className="rsv-recap">
                          <span>
                            <b>{sizeLabel(size)} customers</b>
                            {row ? ` · Insight $${row[1]} · Vision $${row[2]}/mo` : ' · Priced individually'}
                          </span>
                          <button type="button" className={FOCUS} onClick={() => goTo(1)}>Change</button>
                        </div>
                        <h2 className="rsv-h2">Lock in your rate</h2>
                        <p className="rsv-h2-sub">A few details so we can reach out and set you up.</p>

                        <div className="rsv-fields">
                          <div className="rsv-row">
                            <Field label="Your name" name="name" error={fields.name}>
                              <Input name="name" error={fields.name} required autoComplete="name" maxLength={100} />
                            </Field>
                            <Field label="Business name" name="business" error={fields.business}>
                              <Input name="business" error={fields.business} required autoComplete="organization" maxLength={150} />
                            </Field>
                          </div>
                          <Field label="Email" name="email" error={fields.email}>
                            <Input name="email" error={fields.email} type="email" required autoComplete="email" maxLength={254} />
                          </Field>
                          <Field label="Phone" name="phone" optional error={fields.phone}>
                            <Input name="phone" error={fields.phone} type="tel" autoComplete="tel" maxLength={40} />
                          </Field>

                          {detailsOpen ? (
                            <>
                              <Field label="What do you use today?" name="software" optional error={fields.software}>
                                <Select name="software" options={SOFTWARE_OPTIONS} error={fields.software} />
                              </Field>
                              <Field label="When do you want to switch?" name="timing" optional error={fields.timing}>
                                <Select name="timing" options={TIMING_OPTIONS} error={fields.timing} />
                              </Field>
                              {/* The note is the server's "message" field */}
                              <Field label="Note" name="message" optional error={fields.message}>
                                <textarea name="message" rows={3} maxLength={2000} className="rsv-input rsv-textarea" placeholder="Your biggest headache right now, a deadline, anything." />
                              </Field>
                            </>
                          ) : (
                            <button type="button" className={`rsv-add ${FOCUS}`} onClick={() => setDetailsOpen(true)}>
                              <Plus size={15} strokeWidth={2} aria-hidden="true" /> Add details <span>(optional)</span>
                            </button>
                          )}
                        </div>

                        {/* Honeypot: off-screen and out of the tab order; people never fill it in */}
                        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                          <label>Company website<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label>
                        </div>

                        <Turnstile key={checkKey} onToken={onToken} theme="dark" appearance="interaction-only" />

                        {status === 'error' && (
                          <p role="alert" className="rsv-alert">
                            {error} You can also email us at <a href="mailto:hello@poollogic.app">hello@poollogic.app</a>.
                          </p>
                        )}

                        <button type="submit" className={`hero-cta rsv-cta ${FOCUS}`} disabled={status === 'sending'}>
                          <span className="hero-cta-label">{status === 'sending' ? 'Locking in…' : 'Lock in my rate'}</span>
                          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
                        </button>
                        <p className="rsv-fine">
                          <b>No credit card. Cancel within 30 days and you pay nothing.</b> We’ll only email you about your spot.
                        </p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
