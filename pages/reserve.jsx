import React, { useCallback, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import Nav from '../landing/Nav.jsx';
import Turnstile from '../landing/Turnstile.jsx';
import { submitForm } from '../landing/forms.js';
import { TURNSTILE_SITE_KEY } from '../landing/onboarding.js';
import { CUSTOMER_OPTIONS, SOFTWARE_OPTIONS, TIMING_OPTIONS } from '../formOptions.js';
import { Footer } from '../components/site-chrome.jsx';

// /reserve: "Reserve your spot". While landing/onboarding.js is set to 'reserve',
// every sign-up button on the site comes here. Requests go to /api/request
// (server/requestForm.js): the owner gets an email, the person gets a personal
// confirmation, and they join the waitlist audience.

const STEPS = [
  ['Tell us about your company', 'About 30 seconds. No payment and no credit card.'],
  ['We reach out personally', 'Our founder reads every request and gets in touch before your group opens.'],
  ['We set you up', 'We move your customers over for you and walk you through everything, so day one just works.'],
];

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400';
const INPUT = 'mt-1.5 w-full rounded-lg border border-slate-700/70 bg-slate-900/60 px-3.5 py-2.5 text-body text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30';

function Field({ label, name, error, optional, children }) {
  return (
    <label className="block">
      <span className="text-meta font-medium text-slate-300">
        {label}{optional && <span className="font-normal text-slate-500"> (optional)</span>}
      </span>
      {children}
      {error && <span id={`${name}-error`} className="mt-1 block text-caption text-rose-400">{error}</span>}
    </label>
  );
}

const Input = ({ name, error, ...props }) => (
  <input name={name} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className={INPUT} {...props} />
);

const Select = ({ name, options, error, placeholder = 'Choose one' }) => (
  <select name={name} required defaultValue="" aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className={`${INPUT} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9`}>
    <option value="" disabled>{placeholder}</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

function Success({ name, business, already }) {
  const first = (name || '').trim().split(' ')[0];
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-mktg-surface/60 p-8 text-center sm:p-10" role="status">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <Check size={22} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-title font-semibold text-white">
        {already ? 'You’re already on the list.' : `You’re on the list${first ? `, ${first}` : ''}.`}
      </h2>
      <p className="mx-auto mt-3 max-w-[420px] text-body text-slate-400">
        {already
          ? 'We have your request, and we’ll be in touch before your group opens.'
          : <>{business ? <><span className="text-slate-200">{business}</span> has a spot reserved</> : 'Your spot is reserved'} for one of our next onboarding groups. Check your inbox for a note from our founder, Jonathan, and reply to it any time with questions.</>}
      </p>
    </div>
  );
}

export default function ReservePage() {
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [result, setResult] = useState({});
  const [token, setToken] = useState(null);
  const onToken = useCallback((t) => setToken(t), []);
  const [checkKey, setCheckKey] = useState(0); // remounts the bot check for a fresh one-time token

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (TURNSTILE_SITE_KEY && !token) {
      setError('One moment, we’re finishing a quick security check. Try again in a second.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setError('');
    setFields({});
    const out = await submitForm('waitlist', form, { startedAt: startedAt.current, turnstileToken: token });
    if (out.ok) {
      setResult({ name: form.elements.name.value, business: form.elements.business.value, already: out.already });
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(out.error);
      setFields(out.fields);
      setStatus('error');
      setToken(null);
      setCheckKey((k) => k + 1);
    }
  };

  return (
    <div className="mktg relative flex min-h-screen flex-col bg-mktg-base font-sans text-mktg-muted antialiased">
      <Nav />
      <main className="flex-1">
        <section className="bg-mktg-base pb-24 pt-[var(--page-hero-top)]" aria-labelledby="reserve-heading">
          <div className="container grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
            {/* The why and what happens next */}
            <div className="lg:pt-4">
              <p className="text-caption font-semibold uppercase tracking-[.14em] text-blue-500">Now onboarding in small groups</p>
              <h1 id="reserve-heading" className="mt-3.5 text-[clamp(34px,4.1vw,46px)] font-bold leading-[1.08] tracking-[-0.028em] text-white">
                Reserve your spot.
              </h1>
              <p className="mt-5 max-w-[480px] text-lead text-slate-400">
                We bring on new pool companies a few at a time, so we’re here to answer every question and make sure your
                setup, and your whole experience, is perfect from day one.
              </p>
              <ol className="mt-10 grid gap-6">
                {STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-slate-700 font-tnum text-meta font-semibold text-slate-300">{i + 1}</span>
                    <div>
                      <p className="text-body font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-meta text-slate-400">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* The form */}
            <div>
              {status === 'done' ? (
                <Success {...result} />
              ) : (
                <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-2xl border border-slate-700/50 bg-mktg-surface/60 p-6 sm:p-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" name="name" error={fields.name}>
                      <Input name="name" error={fields.name} required autoComplete="name" maxLength={100} />
                    </Field>
                    <Field label="Business name" name="business" error={fields.business}>
                      <Input name="business" error={fields.business} required autoComplete="organization" maxLength={150} />
                    </Field>
                    <Field label="Email" name="email" error={fields.email}>
                      <Input name="email" error={fields.email} type="email" required autoComplete="email" maxLength={254} />
                    </Field>
                    <Field label="Phone" name="phone" optional error={fields.phone}>
                      <Input name="phone" error={fields.phone} type="tel" autoComplete="tel" maxLength={40} />
                    </Field>
                  </div>
                  <Field label="How many active customers?" name="customers" error={fields.customers}>
                    <Select name="customers" options={CUSTOMER_OPTIONS} error={fields.customers} />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="What do you use today?" name="software" error={fields.software}>
                      <Select name="software" options={SOFTWARE_OPTIONS} error={fields.software} />
                    </Field>
                    <Field label="When do you want to switch?" name="timing" error={fields.timing}>
                      <Select name="timing" options={TIMING_OPTIONS} error={fields.timing} />
                    </Field>
                  </div>
                  <Field label="Anything we should know?" name="message" optional error={fields.message}>
                    <textarea name="message" rows={3} maxLength={2000} className={INPUT} placeholder="Your biggest headache right now, a deadline, anything." />
                  </Field>

                  {/* Honeypot: off-screen and out of the tab order; people never fill it in */}
                  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label>Company website<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label>
                  </div>

                  <Turnstile key={checkKey} onToken={onToken} theme="dark" />

                  {status === 'error' && (
                    <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-meta text-rose-300">
                      {error} You can also email us at <a href="mailto:hello@poollogic.app" className="font-semibold text-rose-200 underline">hello@poollogic.app</a>.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 text-body font-semibold text-white shadow-lg transition-colors hover:bg-blue-500 disabled:opacity-70 ${FOCUS}`}
                  >
                    {status === 'sending' ? 'Reserving…' : <>Reserve my spot <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" /></>}
                  </button>
                  <p className="text-center text-caption text-slate-500">
                    We’ll only email you about your spot and the occasional PoolLogic update. Unsubscribe any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <div style={{ background: 'var(--bg)' }}>
        <Footer />
      </div>
    </div>
  );
}
