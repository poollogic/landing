import React, { useState } from 'react';

// Contact / demo-request page. Form posts to Formspree.
// PLACEHOLDER — replace with your real Formspree endpoint before going live.
// Get one at https://formspree.io, copy the form URL (looks like
// https://formspree.io/f/abcdwxyz), and paste it below.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

const SIZE_OPTIONS = [
  '1 technician (just me)',
  '2–5 technicians',
  '6–15 technicians',
  '16+ technicians',
];

const TIER_OPTIONS = [
  'Core — free until you get paid',
  'Insight — $29–39/tech/mo',
  'Vision — $59–79/tech/mo',
  'Enterprise',
  'Not sure yet — help me pick',
];

const ContactPage = () => {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill hidden fields, humans don't. If filled, silently succeed.
    if (data.get('company_website')) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body?.error || 'Something went wrong. Please email us instead.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error. Please email us instead.');
      setStatus('error');
    }
  };

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 96px' }}>
        <header style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', letterSpacing: '-0.035em', lineHeight: 1.1, color: 'var(--ink)' }}>
            See PoolLogic on your routes.
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Tell us a little about your business and we'll get back within one business day to walk you through PoolLogic on your routes, customers, and billing.
          </p>
        </header>

        {status === 'success' ? (
          <SuccessPanel onReset={() => setStatus('idle')} />
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
              <Field label="Business name" name="business" required autoComplete="organization" />
            </Row>
            <Row>
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
            </Row>

            <Row>
              <SelectField label="How many technicians?" name="size" options={SIZE_OPTIONS} required />
              <SelectField label="Which plan looks right?" name="tier" options={TIER_OPTIONS} required />
            </Row>

            <TextareaField
              label="What's frustrating you about your current setup?"
              name="message"
              placeholder="A sentence or two is plenty — late invoices, missed chemistry, sticky paperwork, anything."
              rows={5}
            />

            {/* Honeypot — visually hidden, off the tab order */}
            <div style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
              <label>
                Company website
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

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
                {status === 'submitting' ? 'Sending…' : 'Get a demo'}
              </button>
              <span style={{ fontSize: 13, color: 'var(--ink-5)' }}>
                We reply within one business day. No spam, ever.
              </span>
            </div>
          </form>
        )}
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

const TextareaField = ({ label, name, placeholder, rows = 4 }) => (
  <label style={{ display: 'block' }}>
    <span style={labelStyle}>{label}</span>
    <textarea
      name={name}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  </label>
);

const SuccessPanel = ({ onReset }) => (
  <div style={{ padding: 40, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--bg-muted, var(--bg))', textAlign: 'center' }}>
    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'color-mix(in oklab, var(--brand-green) 20%, transparent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green, #22A06B)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <h2 style={{ fontSize: 24, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 8 }}>Got it — we'll be in touch.</h2>
    <p style={{ fontSize: 15.5, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 440, margin: '0 auto' }}>
      We'll reply within one business day to set up your demo. If you need us sooner, email <a href="mailto:hello@poollogic.app" style={{ color: 'var(--accent)' }}>hello@poollogic.app</a>.
    </p>
    <button onClick={onReset} className="btn btn-outline" style={{ marginTop: 24 }}>Send another message</button>
  </div>
);

export default ContactPage;
