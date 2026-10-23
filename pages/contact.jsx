import React, { useCallback, useRef, useState } from 'react';
import Turnstile from '../landing/Turnstile.jsx';
import { submitForm } from '../landing/forms.js';
import { TURNSTILE_SITE_KEY } from '../landing/onboarding.js';
import { CUSTOMER_OPTIONS, PLAN_OPTIONS } from '../formOptions.js';

// Contact / demo-request page. The form posts to /api/request (server/requestForm.js).
// /contact?topic=partner is the Partner Program's Apply button until its own
// apply form ships: same form and endpoint, partner wording and fields.
const isPartnerTopic = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('topic') === 'partner';

const ContactPage = () => {
  const partner = isPartnerTopic();
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const startedAt = useRef(Date.now());
  const [token, setToken] = useState(null);
  const onToken = useCallback((t) => setToken(t), []);
  const [checkKey, setCheckKey] = useState(0); // remounts the bot check for a fresh one-time token
  const [fields, setFields] = useState({});
  const [already, setAlready] = useState(false);

  // Sent to /api/request (server/requestForm.js): spam checks, then an email to us and a confirmation to them.
  const onSubmit = async (e) => {
    e.preventDefault();
    if (TURNSTILE_SITE_KEY && !token) {
      setErrorMessage('One moment, we’re finishing a quick security check. Try again in a second.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');
    setFields({});
    const out = await submitForm(partner ? 'partner' : 'demo', e.currentTarget, { startedAt: startedAt.current, turnstileToken: token });
    if (out.ok) {
      setAlready(out.already);
      setStatus('success');
    } else {
      setErrorMessage(Object.keys(out.fields).length ? `${out.error} ${Object.values(out.fields)[0]}` : out.error);
      setFields(out.fields);
      setStatus('error');
      setToken(null);
      setCheckKey((k) => k + 1);
    }
  };

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 'var(--page-top)', paddingBottom: 'var(--page-bottom)' }}>
      <div style={{ maxWidth: 720, marginInline: 'auto' }}>
        <header style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', letterSpacing: '-0.035em', lineHeight: 1.1, color: 'var(--ink)' }}>
            {partner ? 'Apply to the Partner Program.' : 'See PoolLogic on your routes.'}
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            {partner
              ? <>Tell us who you reach and how you'd share PoolLogic. We reply within 3 business days. <a href="/partners" style={{ color: 'var(--accent)' }}>How the program works</a>.</>
              : "Tell us a little about your business and we'll get back within one business day to walk you through PoolLogic on your routes, customers, and billing."}
          </p>
        </header>

        {status === 'success' ? (
          <SuccessPanel partner={partner} already={already} onReset={() => setStatus('idle')} />
        ) : (
          <form
            onSubmit={onSubmit}
            style={{
              display: 'grid',
              gap: 18,
              padding: 32,
              border: '1px solid var(--line)',
              borderRadius: 14,
              background: 'var(--bg-muted, var(--bg))',
            }}
          >
            <Row>
              <Field label="Your name" name="name" required autoComplete="name" />
              <Field label={partner ? 'Channel, group or business' : 'Business name'} name="business" required autoComplete="organization" />
            </Row>
            <Row>
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
            </Row>

            {!partner && (
              <Row>
                <SelectField label="How many active customers?" name="customers" options={CUSTOMER_OPTIONS} required />
                <SelectField label="Which plan looks right?" name="plan" options={PLAN_OPTIONS} required />
              </Row>
            )}

            {partner ? (
              <TextareaField
                label="Where do you reach pool pros, and how would you share PoolLogic?"
                name="message"
                placeholder="Links to your channel, group or podcast (1–3), roughly how many people you reach, and whether they run pool companies."
                rows={5}
                required
              />
            ) : (
              <TextareaField
                label="What's frustrating you about your current setup?"
                name="message"
                placeholder="A sentence or two is plenty — late invoices, missed chemistry, sticky paperwork, anything."
                rows={5}
              />
            )}

            {/* Honeypot — visually hidden, off the tab order */}
            <div style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
              <label>
                Company website
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Turnstile key={checkKey} onToken={onToken} theme="light" />

            {status === 'error' && (
              <div style={{ fontSize: 14, color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 14px', borderRadius: 10 }}>
                {errorMessage} You can reach us directly at{' '}
                <a href="mailto:hello@poollogic.app" style={{ color: '#B91C1C', fontWeight: 600 }}>hello@poollogic.app</a>.
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === 'submitting'}
                style={{ minWidth: 180 }}
              >
                {status === 'submitting' ? 'Sending…' : partner ? 'Apply' : 'Get a demo'}
              </button>
              <span style={{ fontSize: 13, color: 'var(--ink-5)' }}>
                We reply within one business day. No spam, ever.
              </span>
            </div>
          </form>
        )}
      </div>
      </div>
    </main>
  );
};

const Row = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="contact-row">
    {children}
  </div>
);

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--ink-3)',
  marginBottom: 6,
  letterSpacing: '-0.005em',
};

const inputStyle = {
  width: '100%',
  padding: '11px 13px',
  fontSize: 15,
  lineHeight: 1.4,
  color: 'var(--ink)',
  background: 'var(--bg)',
  border: '1px solid var(--line)',
  borderRadius: 9,
  outline: 'none',
  transition: 'border-color .15s ease, box-shadow .15s ease',
  fontFamily: 'inherit',
};

const Field = ({ label, name, type = 'text', required, autoComplete }) => (
  <label style={{ display: 'block' }}>
    <span style={labelStyle}>{label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}</span>
    <input
      type={type}
      name={name}
      required={required}
      autoComplete={autoComplete}
      style={inputStyle}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  </label>
);

const SelectField = ({ label, name, options, required }) => (
  <label style={{ display: 'block' }}>
    <span style={labelStyle}>{label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}</span>
    <select
      name={name}
      required={required}
      defaultValue=""
      style={{ ...inputStyle, appearance: 'auto' }}
    >
      <option value="" disabled>Select an option…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);

const TextareaField = ({ label, name, placeholder, rows = 4, required }) => (
  <label style={{ display: 'block' }}>
    <span style={labelStyle}>{label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}</span>
    <textarea
      name={name}
      required={required}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  </label>
);

const SuccessPanel = ({ partner, already, onReset }) => (
  <div style={{ padding: 40, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--bg-muted, var(--bg))', textAlign: 'center' }}>
    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'color-mix(in oklab, var(--brand-green) 20%, transparent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green, #22A06B)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <h2 style={{ fontSize: 24, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 8 }}>Got it — we'll be in touch.</h2>
    <p style={{ fontSize: 15.5, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 440, margin: '0 auto' }}>
      {already
        ? "We already have your request and we'll be in touch soon. If you need us sooner, email"
        : partner
          ? "We'll reply within 3 business days about joining the Partner Program. Check your inbox for a confirmation. If you need us sooner, email"
          : "We'll reply within one business day to set up your demo. Check your inbox for a confirmation. If you need us sooner, email"} <a href="mailto:hello@poollogic.app" style={{ color: 'var(--accent)' }}>hello@poollogic.app</a>.
    </p>
    <button onClick={onReset} className="btn btn-outline" style={{ marginTop: 24 }}>Send another message</button>
  </div>
);

export default ContactPage;
