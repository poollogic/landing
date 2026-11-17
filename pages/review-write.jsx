import React, { useEffect, useState } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/reserve.css';
import '../landing/reviews/reviews.css';
import Nav from '../landing/Nav.jsx';
import ReviewCard from '../landing/reviews/ReviewCard.jsx';
import { getSupabase, safeHttps } from '../landing/reviews/data.js';
import { APP_URL, REVIEWS_MOCK } from '../landing/reviews/config.js';
import { FOCUS } from '../landing/ReserveSize.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /reviews/write (only with VITE_REVIEWS=1; app.jsx). Signed out: sign in with the Poolnautics email
// and password (Supabase Auth, the anon key; this site keeps its own session). Signed in: the
// company's one review, new or to edit. The company's name is the account's, shown, never typed;
// the website starts as the review's, else the company's own (organizations.branding.websiteUrl).
// "What should we improve?" is saved apart (review_feedback) and never published. Publishing goes
// through submit_review(), which the database checks again (20270207120000_homepage_reviews.sql):
// rating, length, https, the honesty box, and 5 saves an hour. The card shown after is what the
// homepage shows. Fields and card: the reserve form's (reserve.css).

const MIN = 40;
const MAX = 1200;
const STAR = 'M8 1.2l2.06 4.18 4.6.67-3.33 3.25.79 4.59L8 11.72l-4.12 2.17.79-4.59L1.34 6.05l4.6-.67z';

const ERRORS = {
  rate_limited: 'You’ve saved your review several times in the last hour. Try again later.',
  not_attested: 'Tick the box to confirm this is your honest opinion.',
  not_signed_in: 'Your sign-in has run out. Sign in again.',
};
const messageFor = (error) => {
  const text = `${error?.message ?? ''} ${error?.details ?? ''}`;
  const key = Object.keys(ERRORS).find((k) => text.includes(k));
  if (key) return ERRORS[key];
  if (/website_url/.test(text)) return 'The website must be a full https:// address.';
  if (/body/.test(text)) return `Your review needs ${MIN} to ${MAX} characters.`;
  return 'Your review couldn’t be saved. Try again in a moment.';
};

function Field({ label, optional, error, name, hint, children }) {
  return (
    <label className="rsv-field">
      <span className="rsv-label">{label}{optional && <span> (optional)</span>}</span>
      {children}
      {hint}
      {error && <span id={`${name}-error`} className="rsv-error">{error}</span>}
    </label>
  );
}

function SignIn({ db, onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const { data, error: err } = await db.auth.signInWithPassword({ email: email.trim(), password });
    if (err || !data.session) {
      setStatus('idle');
      setError(err?.status === 429 ? 'Too many tries. Wait a minute and try again.' : 'That email and password don’t match a Poolnautics account.');
      return;
    }
    onSignedIn(data.session);
  };

  return (
    <form className="rsv-card" onSubmit={submit} noValidate>
      <p className="lr-page-eyebrow">Sign in to write a review</p>
      <p className="rsv-fine lr-signin-note">Use the email and password you sign in to Poolnautics with.</p>
      <div className="rsv-fields">
        <Field label="Email" name="email">
          <input className="rsv-input" type="email" name="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" name="password">
          <input className="rsv-input" type="password" name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
      </div>
      {error && <p role="alert" className="rsv-alert">{error}</p>}
      <button type="submit" className={`hero-cta rsv-cta ${FOCUS}`} disabled={status === 'sending' || !email || !password}>
        <span className="hero-cta-label">{status === 'sending' ? 'Signing in…' : 'Sign in'}</span>
      </button>
      <p className="rsv-fine">Forgot your password? <a className="lr-link" href={APP_URL}>Reset it in the Poolnautics app</a>.</p>
    </form>
  );
}

function ReviewForm({ db, account, existing, onSaved, onSignOut }) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [body, setBody] = useState(existing?.body ?? '');
  const [website, setWebsite] = useState(existing?.website_url ?? account.website ?? '');
  const [name, setName] = useState(existing?.reviewer_name ?? account.fullName ?? '');
  const [role, setRole] = useState(existing?.reviewer_role ?? '');
  const [feedback, setFeedback] = useState('');
  const [honest, setHonest] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [alert, setAlert] = useState('');

  const length = body.trim().length;
  const validate = () => {
    const e = {};
    if (!rating) e.rating = 'Choose a rating from 1 to 5 stars.';
    if (length < MIN) e.body = `At least ${MIN} characters (${MIN - length} to go).`;
    if (length > MAX) e.body = `At most ${MAX} characters.`;
    if (website.trim() && !safeHttps(website.trim())) e.website = 'A full https:// address, like https://yourcompany.com';
    if (!name.trim()) e.name = 'Add the name to show with your review.';
    if (!honest) e.honest = ERRORS.not_attested;
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setAlert('');
    if (Object.keys(e).length) return;
    setStatus('sending');
    const { data, error } = await db.rpc('submit_review', {
      p_rating: rating,
      p_body: body,
      p_website_url: website.trim() || null,
      p_reviewer_name: name,
      p_reviewer_role: role.trim() || null,
      p_feedback: feedback.trim() || null,
      p_honest: honest,
    });
    setStatus('idle');
    if (error) { setAlert(messageFor(error)); return; }
    onSaved(data);
  };

  return (
    <form className="rsv-card" onSubmit={submit} noValidate>
      <div className="lr-company-row">
        <div>
          <p className="rsv-label">Reviewing as</p>
          <p className="lr-company-name">{account.companyName}</p>
        </div>
        <button type="button" className={`lr-signout ${FOCUS}`} onClick={onSignOut}>Sign out</button>
      </div>
      {existing && <p className="rsv-fine">Your company already has a review. Publishing again replaces it.</p>}

      <div className="rsv-fields">
        <fieldset className="rsv-field" aria-describedby={errors.rating ? 'rating-error' : undefined}>
          <legend className="rsv-label">Your rating</legend>
          <div className="lr-rate">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={n <= rating ? 'is-on' : undefined}>
                <input type="radio" name="rating" value={n} className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
                <span className="sr-only">{n} {n === 1 ? 'star' : 'stars'}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d={STAR} /></svg>
              </label>
            ))}
          </div>
          {errors.rating && <span id="rating-error" className="rsv-error">{errors.rating}</span>}
        </fieldset>

        <Field
          label="Your review"
          name="body"
          error={errors.body}
          hint={<span className={`lr-count${length > MAX || (errors.body && length < MIN) ? ' is-bad' : ''}`} aria-live="polite">{length} / {MAX}</span>}
        >
          <textarea
            className="rsv-input rsv-textarea" name="body" rows={6} maxLength={MAX + 200} value={body}
            onChange={(e) => setBody(e.target.value)} aria-invalid={!!errors.body} aria-describedby={errors.body ? 'body-error' : undefined}
            placeholder="What changed for your business, what you’d tell another pool pro."
          />
        </Field>

        <div className="rsv-row">
          <Field label="Your name, as shown" name="name" error={errors.name}>
            <input className="rsv-input" name="name" maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
          </Field>
          <Field label="Your role" optional name="role">
            <input className="rsv-input" name="role" maxLength={60} placeholder="Owner" value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
        </div>

        <Field label="Company website" optional name="website" error={errors.website}>
          <input className="rsv-input" type="url" name="website" inputMode="url" maxLength={300} placeholder="https://yourcompany.com" value={website} onChange={(e) => setWebsite(e.target.value)} aria-invalid={!!errors.website} />
        </Field>

        <Field label="What should we improve?" optional name="feedback" hint={<span className="lr-private">Private: only the Poolnautics team reads this. It’s never published.</span>}>
          <textarea className="rsv-input rsv-textarea" name="feedback" rows={3} maxLength={2000} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        </Field>

        <label className="lr-check">
          <input type="checkbox" checked={honest} onChange={(e) => setHonest(e.target.checked)} aria-invalid={!!errors.honest} aria-describedby={errors.honest ? 'honest-error' : undefined} />
          <span>This is my honest opinion. I understand every reviewer gets a featured listing and link, whatever the rating.</span>
        </label>
        {errors.honest && <span id="honest-error" className="rsv-error">{errors.honest}</span>}
      </div>

      {alert && <p role="alert" className="rsv-alert">{alert}</p>}
      <button type="submit" className={`hero-cta rsv-cta ${FOCUS}`} disabled={status === 'sending'}>
        <span className="hero-cta-label">{status === 'sending' ? 'Publishing…' : 'Publish review'}</span>
      </button>
    </form>
  );
}

export default function ReviewWritePage() {
  // loading | no-db | signed-out | no-account | form | saved
  const [view, setView] = useState({ name: 'loading' });
  const [db, setDb] = useState(null);

  // Who's signed in, their company, and its review if it has one (RLS: their own company only).
  const loadAccount = async (client, session) => {
    setView({ name: 'loading' });
    const uid = session.user.id;
    const { data: profile } = await client.from('profiles').select('full_name, organization_id').eq('id', uid).maybeSingle();
    if (!profile?.organization_id) { setView({ name: 'no-account' }); return; }
    const [{ data: org }, { data: existing }] = await Promise.all([
      client.from('organizations').select('company_name, branding').eq('id', profile.organization_id).maybeSingle(),
      client.from('reviews').select('rating, body, website_url, reviewer_name, reviewer_role, status').eq('company_id', profile.organization_id).maybeSingle(),
    ]);
    if (!org) { setView({ name: 'no-account' }); return; }
    setView({
      name: 'form',
      account: { companyName: org.company_name, fullName: profile.full_name, website: safeHttps(org.branding?.websiteUrl) },
      existing,
    });
  };

  useEffect(() => {
    let live = true;
    if (REVIEWS_MOCK) { setView({ name: 'no-db' }); return undefined; }
    getSupabase().then(async (client) => {
      if (!live) return;
      if (!client) { setView({ name: 'no-db' }); return; }
      setDb(client);
      const { data } = await client.auth.getSession();
      if (!live) return;
      if (data.session) loadAccount(client, data.session);
      else setView({ name: 'signed-out' });
    });
    return () => { live = false; };
  }, []);

  const editAgain = async () => {
    const { data } = await db.auth.getSession();
    if (data.session) loadAccount(db, data.session);
    else setView({ name: 'signed-out' });
  };

  const signOut = async () => {
    await db.auth.signOut();
    setView({ name: 'signed-out' });
  };

  return (
    <div className="mktg lr-page relative flex min-h-screen flex-col font-sans text-mktg-muted antialiased">
      <Nav />
      <main className="lr-page-main" aria-labelledby="write-title">
        <div className="lr-write">
          <header className="lr-page-head">
            <h1 id="write-title" className="lr-page-title">{view.name === 'saved' ? 'Your review is live' : 'Tell the industry what you think'}</h1>
            {view.name !== 'saved' && <p className="lr-page-sub">It goes live on the Poolnautics homepage right away, with your company name and a link to your website.</p>}
          </header>

          {view.name === 'loading' && <p className="lr-empty" role="status">Loading…</p>}
          {view.name === 'no-db' && <p className="lr-empty" role="alert">Writing a review needs the reviews database, which this copy of the site isn’t connected to.</p>}
          {view.name === 'no-account' && (
            <p className="lr-empty" role="alert">
              This sign-in isn’t linked to a Poolnautics company, so it can’t post a review.{' '}
              <button type="button" className="lr-signout" onClick={signOut}>Sign out</button>
            </p>
          )}
          {view.name === 'signed-out' && db && <SignIn db={db} onSignedIn={(session) => loadAccount(db, session)} />}
          {view.name === 'form' && (
            <ReviewForm db={db} account={view.account} existing={view.existing} onSignOut={signOut} onSaved={(saved) => setView({ name: 'saved', saved })} />
          )}
          {view.name === 'saved' && (
            <div className="lr-done">
              {view.saved?.review ? (
                <ReviewCard review={view.saved.review} />
              ) : (
                <p className="lr-empty" role="status">Your review is saved, but it isn’t shown on the site right now. Write to hello@getpoolnautics.com if you think that’s a mistake.</p>
              )}
              <div className="lr-done-actions">
                <a className="lr-link" href="/#reviews">See it on the homepage</a>
                <a className="lr-link" href="/reviews">See all reviews</a>
                <button type="button" className="lr-link" onClick={editAgain}>Edit it</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
