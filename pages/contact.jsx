import React, { useCallback, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, CodeXml, Handshake, LifeBuoy, Scale } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/reserve.css';
import '../landing/contact.css';
import Nav from '../landing/Nav.jsx';
import Turnstile from '../landing/Turnstile.jsx';
import { submitForm } from '../landing/forms.js';
import { TURNSTILE_SITE_KEY } from '../landing/onboarding.js';
import { CheckDot, FOCUS } from '../landing/ReserveSize.jsx';
import { Footer } from '../components/site-chrome.jsx';
import { CUSTOMER_OPTIONS } from '../formOptions.js';
import { payoutRange } from '../partnerProgram.js';

// /contact: a short heading, the form (a demo, a question or a Partner Program application, picked
// with the switch at its top), then the other ways to reach us. Kept deliberately sparse. The form posts
// to /api/request (server/requestForm.js) as the form kind of the same name: the owner gets an
// email, the person a confirmation. /contact?topic=question|partner opens on that topic (the
// Partner Program's Apply button is ?topic=partner). The card and fields are /reserve's
// (reserve.css); the rest is contact.css.

const APP_URL = 'https://app.poollogic.app';
const HELLO = 'hello@getpoolnautics.com';

const TOPICS = {
  demo: { tab: 'Get a demo', submit: 'Request a demo', done: 'We’ll reply within one business day to set up a time.' },
  question: { tab: 'Ask a question', submit: 'Send message', done: 'We’ll reply within one business day.' },
  partner: {
    tab: 'Partner program',
    submit: 'Apply',
    fine: <>We reply to applications within 3 business days. <a href="/partners" className="ct-inline">How the program works</a></>,
    done: 'We’ll reply within 3 business days.',
  },
};
const isTopic = (t) => Object.hasOwn(TOPICS, t);

const WAYS = [
  {
    Icon: LifeBuoy,
    title: 'Customer support',
    body: 'Already using Poolnautics? Email us and we’ll help you sort it out.',
    links: [['support@getpoolnautics.com', 'mailto:support@getpoolnautics.com'], ['Sign in to Poolnautics', APP_URL, true]],
  },
  {
    Icon: Handshake,
    title: 'Partner program',
    body: `Earn a flat ${payoutRange()} for every pool company you refer.`,
    links: [['partners@getpoolnautics.com', 'mailto:partners@getpoolnautics.com'], ['How the program works', '/partners']],
  },
  {
    Icon: CodeXml,
    title: 'Developers',
    body: 'Connect Claude, Grok, ChatGPT or your own AI, or build on the Poolnautics API.',
    links: [['AI & integrations', '/ai-integrations']],
  },
  {
    Icon: Scale,
    title: 'Legal and privacy',
    body: 'Contracts, your data, and requests about either.',
    links: [['legal@getpoolnautics.com', 'mailto:legal@getpoolnautics.com'], ['privacy@getpoolnautics.com', 'mailto:privacy@getpoolnautics.com']],
  },
];

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

const Textarea = ({ name, error, ...props }) => (
  <textarea name={name} rows={3} maxLength={2000} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className="rsv-input rsv-textarea" {...props} />
);

function Success({ topic, name, already, onReset }) {
  const first = (name || '').trim().split(' ')[0];
  return (
    <div className="rsv-success" role="status">
      <CheckDot size={48} />
      <h2>{already ? 'We already have it.' : `Thanks${first ? `, ${first}` : ''}. Got it.`}</h2>
      <p>
        {already ? 'We’ll be in touch soon.' : `${TOPICS[topic].done} A confirmation is on its way to your inbox.`}
        {' '}Need us sooner? Email <a href={`mailto:${HELLO}`} className="ct-inline">{HELLO}</a>.
      </p>
      <button type="button" className={`ct-again ${FOCUS}`} onClick={onReset}>Send another message</button>
    </div>
  );
}

function ContactCard() {
  const [topic, setTopic] = useState(() => {
    const t = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('topic') : null;
    return isTopic(t) ? t : 'demo';
  });
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [result, setResult] = useState({});
  const [token, setToken] = useState(null);
  const onToken = useCallback((t) => setToken(t), []);
  const [checkKey, setCheckKey] = useState(0); // remounts the bot check for a fresh one-time token
  const t = TOPICS[topic];

  // Switching topic keeps what's typed in the shared fields, clears any errors, and puts the topic
  // in the address (so it can be shared, and the owner's email shows which one it was).
  const pick = (next) => {
    setTopic(next);
    setStatus('idle');
    setError('');
    setFields({});
    window.history.replaceState(null, '', next === 'demo' ? '/contact' : `/contact?topic=${next}`);
  };

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
    const out = await submitForm(topic, form, { startedAt: startedAt.current, turnstileToken: token });
    if (out.ok) {
      setResult({ name: form.elements.name.value, already: out.already });
      setStatus('done');
    } else {
      setError(out.error);
      setFields(out.fields);
      setStatus('error');
      setToken(null);
      setCheckKey((k) => k + 1);
    }
  };

  const reset = () => {
    startedAt.current = Date.now();
    setStatus('idle');
    setResult({});
  };

  return (
    <div className="rsv-card ct-card-form">
      {status === 'done' ? (
        <Success topic={topic} {...result} onReset={reset} />
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="ct-topics" role="group" aria-label="What can we help with?">
            {Object.entries(TOPICS).map(([key, { tab }]) => (
              <button key={key} type="button" className={`ct-topic ${FOCUS}`} aria-pressed={topic === key} onClick={() => pick(key)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="rsv-fields">
            <div className="rsv-row">
              <Field label="Name" name="name" error={fields.name}>
                <Input name="name" error={fields.name} required autoComplete="name" maxLength={100} />
              </Field>
              <Field label="Email" name="email" error={fields.email}>
                <Input name="email" error={fields.email} type="email" required autoComplete="email" maxLength={254} />
              </Field>
            </div>
            <div className="rsv-row">
              <Field label={topic === 'partner' ? 'Channel, group or business' : 'Business'} name="business" optional={topic === 'question'} error={fields.business}>
                <Input name="business" error={fields.business} required={topic !== 'question'} autoComplete="organization" maxLength={150} />
              </Field>
              {topic === 'demo' ? (
                <Field label="Active customers" name="customers" error={fields.customers}>
                  <Select name="customers" options={CUSTOMER_OPTIONS} error={fields.customers} />
                </Field>
              ) : (
                <Field label="Phone" name="phone" optional error={fields.phone}>
                  <Input name="phone" error={fields.phone} type="tel" autoComplete="tel" maxLength={40} />
                </Field>
              )}
            </div>

            {/* Each topic's message field: keyed, so switching topic starts it empty */}
            {topic === 'demo' && (
              <Field key="demo" label="Anything we should know?" name="message" optional error={fields.message}>
                <Textarea name="message" error={fields.message} />
              </Field>
            )}
            {topic === 'question' && (
              <Field key="question" label="Your question" name="message" error={fields.message}>
                <Textarea name="message" error={fields.message} required />
              </Field>
            )}
            {topic === 'partner' && (
              <Field key="partner" label="Where do you reach pool pros?" name="message" error={fields.message}>
                <Textarea name="message" error={fields.message} required placeholder="Links to your channel, group or podcast, and roughly how many people you reach." />
              </Field>
            )}
          </div>

          {/* Honeypot: off-screen and out of the tab order; people never fill it in */}
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label>Company website<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <Turnstile key={checkKey} onToken={onToken} theme="dark" appearance="interaction-only" />

          {status === 'error' && (
            <p role="alert" className="rsv-alert">
              {error} You can also email us at <a href={`mailto:${HELLO}`}>{HELLO}</a>.
            </p>
          )}

          <button type="submit" className={`hero-cta rsv-cta ${FOCUS}`} disabled={status === 'sending'}>
            <span className="hero-cta-label">{status === 'sending' ? 'Sending…' : t.submit}</span>
            <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <p className="ct-form-note">We only use your details to reply. No spam, ever.</p>
          {t.fine && <p className="rsv-fine">{t.fine}</p>}
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="mktg ct-page relative flex min-h-screen flex-col font-sans text-mktg-muted antialiased">
      <div className="ct-light" aria-hidden="true" />
      <Nav current="/contact" />
      <main className="flex-1">
        <section className="hero ct-hero relative overflow-x-clip" aria-labelledby="contact-heading">
          <div className="container">
            <div className="ct-grid">
              <div className="ct-intro">
                <span className="ct-eyebrow">Contact</span>
                <h1 id="contact-heading" className="hero-title">Talk to our team.</h1>
                <p className="hero-sub">
                  Get a demo on your own routes, ask a question, or apply to the Partner Program. A real person
                  replies within one business day.
                </p>
                <ul className="ct-perks">
                  <li><Check strokeWidth={2.5} />A live walkthrough on your own routes</li>
                  <li><Check strokeWidth={2.5} />Straight answers from the people who build it</li>
                  <li><Check strokeWidth={2.5} />No sales sequence, no bots</li>
                </ul>
                <p className="ct-direct">Prefer email? <a href={`mailto:${HELLO}`} className="ct-inline">{HELLO}</a></p>
              </div>
              <ContactCard />
            </div>
          </div>
        </section>

        <section className="ct-more" aria-labelledby="ct-more-heading">
          <div className="container">
            <h2 id="ct-more-heading" className="ct-h2">Other ways to reach us</h2>
            <p className="ct-more-sub">Every address goes to a real person.</p>
            <ul className="ct-ways">
              {WAYS.map(({ Icon, title, body, links }) => (
                <li key={title} className="ct-way">
                  <span className="ct-way-icon"><Icon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <div className="ct-way-links">
                    {links.map(([label, href, external]) => (
                      <a key={href} href={href} className={FOCUS}>
                        {label}
                        {external ? <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" /> : !href.startsWith('mailto:') && <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <p className="ct-company">Poolnautics LLC · St. Petersburg, Florida</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
