import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { STAR, safeHttps } from './logic.js';

// The review popup's form (ReviewDialog), in the Poolnautics app's look like its sign-in (signin.css).
// The company's one review, new or to edit. The company's name is the account's, shown, never typed;
// the website starts as the review's, else the company's own (organizations.branding.websiteUrl).
// "What should we improve?" is saved apart (review_feedback) and never published. Publishing goes
// through submit_review(), which the database checks again (20270207120000_homepage_reviews.sql):
// rating, length, https, the honesty box, and 5 saves an hour.

export const MIN = 40;
export const MAX = 1200;

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

function Field({ id, label, optional, error, hint, children }) {
  return (
    <div className="pn-field">
      <label className="pn-label" htmlFor={id}>{label}{optional && <span className="pn-optional"> (optional)</span>}</label>
      {children}
      {hint}
      {error && <span id={`${id}-error`} className="pn-field-error">{error}</span>}
    </div>
  );
}

export default function ReviewForm({ db, account, existing, onSaved }) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [body, setBody] = useState(existing?.body ?? '');
  const [website, setWebsite] = useState(existing?.website_url ?? account.website ?? '');
  const [name, setName] = useState(existing?.reviewer_name ?? account.fullName ?? '');
  const [role, setRole] = useState(existing?.reviewer_role ?? '');
  const [feedback, setFeedback] = useState('');
  const [honest, setHonest] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
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
    if (Object.keys(e).length) {
      // The first field that needs fixing gets the keyboard (and a screen reader reads its error).
      const first = ['rating', 'body', 'name', 'website', 'honest'].find((k) => e[k]);
      const target = { rating: 'input[name="rating"]', body: '#rv-body', name: '#rv-name', website: '#rv-website', honest: '.pn-check input' }[first];
      ev.currentTarget.querySelector(target)?.focus();
      return;
    }
    setBusy(true);
    const { data, error } = await db.rpc('submit_review', {
      p_rating: rating,
      p_body: body.trim(),
      p_website_url: website.trim() || null,
      p_reviewer_name: name.trim(),
      p_reviewer_role: role.trim() || null,
      p_feedback: feedback.trim() || null,
      p_honest: honest,
    });
    setBusy(false);
    if (error) { setAlert(messageFor(error)); return; }
    onSaved(data);
  };

  const describedBy = (id) => (errors[id] ? `rv-${id}-error` : undefined);

  return (
    <form className="pn-review" onSubmit={submit} noValidate>
      {existing && <div role="status" className="pn-message is-info">Your company already has a review. Publishing again replaces it.</div>}

      <fieldset className="pn-field pn-rating" aria-describedby={errors.rating ? 'rv-rating-error' : undefined}>
        <legend className="pn-label">Your rating</legend>
        <div className="pn-rate">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={n <= rating ? 'is-on' : undefined}>
              <input type="radio" name="rating" value={n} className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
              <span className="sr-only">{n} {n === 1 ? 'star' : 'stars'}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d={STAR} /></svg>
            </label>
          ))}
        </div>
        {errors.rating && <span id="rv-rating-error" className="pn-field-error">{errors.rating}</span>}
      </fieldset>

      <Field
        id="rv-body" label="Your review" error={errors.body}
        hint={<span className={`pn-count${length > MAX || (errors.body && length < MIN) ? ' is-bad' : ''}`} aria-live="polite">{length} / {MAX}</span>}
      >
        <textarea
          id="rv-body" className="pn-input pn-textarea" name="body" rows={5} maxLength={MAX + 200} value={body}
          onChange={(e) => setBody(e.target.value)} aria-invalid={!!errors.body} aria-describedby={describedBy('body')}
          placeholder="What changed for your business, what you’d tell another pool pro."
        />
      </Field>

      <div className="pn-row">
        <Field id="rv-name" label="Your name, as shown" error={errors.name}>
          <input id="rv-name" className="pn-input" name="name" maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} />
        </Field>
        <Field id="rv-role" label="Your role" optional>
          <input id="rv-role" className="pn-input" name="role" maxLength={60} placeholder="Owner" value={role} onChange={(e) => setRole(e.target.value)} />
        </Field>
      </div>

      <Field id="rv-website" label="Company website" optional error={errors.website}>
        <input id="rv-website" className="pn-input" type="url" name="website" inputMode="url" maxLength={300} placeholder="https://yourcompany.com" value={website} onChange={(e) => setWebsite(e.target.value)} aria-invalid={!!errors.website} aria-describedby={describedBy('website')} />
      </Field>

      <Field id="rv-feedback" label="What should we improve?" optional hint={<span className="pn-hint">Private: only the Poolnautics team reads this. It’s never published.</span>}>
        <textarea id="rv-feedback" className="pn-input pn-textarea pn-textarea-sm" name="feedback" rows={3} maxLength={2000} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </Field>

      <label className="pn-check">
        <input type="checkbox" checked={honest} onChange={(e) => setHonest(e.target.checked)} aria-invalid={!!errors.honest} aria-describedby={errors.honest ? 'rv-honest-error' : undefined} />
        <span>This is my honest opinion. I understand every reviewer gets a featured listing and link, whatever the rating.</span>
      </label>
      {errors.honest && <span id="rv-honest-error" className="pn-field-error">{errors.honest}</span>}

      {alert && <div role="alert" className="pn-message pn-message-end">{alert}</div>}
      <button type="submit" className="pn-submit" disabled={busy}>
        {busy ? <Loader2 size={18} className="pn-spin" aria-label="Publishing" /> : 'Publish review'}
      </button>
    </form>
  );
}
