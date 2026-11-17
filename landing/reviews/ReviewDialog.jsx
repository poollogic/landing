import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { getSupabase, safeHttps } from './data.js';
import { REVIEWS_MOCK } from './config.js';
import SignInPanel, { OAUTH_CHANNEL, OFFICE_ONLY } from './SignInPanel.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewCard from './ReviewCard.jsx';
import './signin.css';
import './reviews.css';

// The review popup, over whatever page the visitor is on (opened by openReview.js; nothing here
// loads until then). One <dialog>, three steps: sign in (SignInPanel) → the company's review
// (ReviewForm) → the card as the homepage shows it. Someone already signed in starts at the form.
// The page underneath never changes; Escape, the X and the backdrop close it. Closing it signs out:
// no sign-in is left on this site once the popup is gone (data.js keeps it to this tab meanwhile).

const NO_ACCOUNT = 'That sign-in isn’t linked to a Poolnautics company, so it can’t post a review. Use the account you sign in to Poolnautics with.';
// Phone-only logins (the web app's canUseWebApp); the database refuses them too (20270208120000).
const isPhoneOnly = (role) => ['technician', 'repair_tech'].includes(String(role ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_'));

/** A refusal from Google or Apple, read off the address (?error=… or #error=…), in plain words. */
export function readOAuthError() {
  const params = new URLSearchParams(window.location.search);
  new URLSearchParams(window.location.hash.slice(1)).forEach((v, k) => params.set(k, v));
  if (!params.get('error')) return null;
  const raw = `${params.get('error')} ${params.get('error_code') ?? ''} ${params.get('error_description') ?? ''}`;
  if (/signup_disabled|signups? not allowed/i.test(raw)) return NO_ACCOUNT;
  if (/access_denied/i.test(raw) && !params.get('error_description')) return 'Sign-in was cancelled.';
  return 'That sign-in didn’t work. Try again, or use your email and password.';
}

/** The address without what a sign-in left on it (?review, ?code, errors, a token hash). */
export function cleanAddress() {
  const url = new URL(window.location.href);
  ['review', 'code', 'error', 'error_code', 'error_description', 'state'].forEach((k) => url.searchParams.delete(k));
  if (/error|access_token/.test(url.hash)) url.hash = '';
  const path = url.pathname === '/reviews/write' || url.pathname === '/reviews/write/' ? '/reviews' : url.pathname;
  window.history.replaceState(window.history.state, '', `${path}${url.search}${url.hash}`);
}

export default function ReviewDialog({ register }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [db, setDb] = useState(null);
  // loading | no-db | signin | form | saved
  const [step, setStep] = useState({ name: 'loading' });

  const signIn = (message = '') => setStep({ name: 'signin', message, key: Date.now() });

  // Who's signed in, their company, and its review if it has one (RLS: their own company only).
  const loadAccount = useCallback(async (client, session) => {
    setStep({ name: 'loading' });
    const { data: profile } = await client.from('profiles').select('full_name, organization_id, role').eq('id', session.user.id).maybeSingle();
    // A Google or Apple login of a technician (email and password are refused by the app's sign-in).
    if (profile && isPhoneOnly(profile.role)) { await client.auth.signOut({ scope: 'local' }); signIn(OFFICE_ONLY); return; }
    const [{ data: org }, { data: existing }] = profile?.organization_id
      ? await Promise.all([
        client.from('organizations').select('company_name, branding').eq('id', profile.organization_id).maybeSingle(),
        client.from('reviews').select('rating, body, website_url, reviewer_name, reviewer_role, status').eq('company_id', profile.organization_id).maybeSingle(),
      ])
      : [{ data: null }, { data: null }];
    // A Google or Apple login with no Poolnautics company: signed straight back out, as the app does.
    if (!org) { await client.auth.signOut({ scope: 'local' }); signIn(NO_ACCOUNT); return; }
    setStep({
      name: 'form',
      account: { companyName: org.company_name, fullName: profile.full_name, website: safeHttps(org.branding?.websiteUrl) },
      existing,
    });
  }, []);

  const start = useCallback(async ({ returning = false } = {}) => {
    setOpen(true);
    setStep({ name: 'loading' });
    if (REVIEWS_MOCK) { setStep({ name: 'no-db' }); return; }
    const client = await getSupabase();
    if (!client) { setStep({ name: 'no-db' }); return; }
    setDb(client);
    const oauthError = returning ? readOAuthError() : null;
    // Back from Google or Apple by the page itself: this trades the code for a session (data.js).
    const { data } = await client.auth.getSession();
    if (returning) cleanAddress();
    if (data.session) loadAccount(client, data.session);
    else signIn(oauthError ?? '');
  }, [loadAccount]);

  useEffect(() => { register({ open: start }); }, [register, start]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    // The browser focuses the X on opening; start at the email when the sign-in is showing.
    if (open && !dialog.open) { dialog.showModal(); dialog.querySelector('#pn-email')?.focus(); }
    if (!open && dialog.open) dialog.close();
    if (!open) return undefined;
    // The page underneath stays put while the popup is open.
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => { root.style.overflow = before; };
  }, [open]);

  const close = () => {
    setOpen(false);
    if (/^\/reviews\/write\/?$/.test(window.location.pathname)) cleanAddress();
    // This browser's sign-in on the site ends with the popup (only this one; the app stays signed in).
    db?.auth.signOut({ scope: 'local' }).catch(() => {});
  };

  const signOut = async () => {
    await db.auth.signOut({ scope: 'local' });
    signIn();
  };

  const editAgain = async () => {
    const { data } = await db.auth.getSession();
    if (data.session) loadAccount(db, data.session);
    else signIn();
  };

  const wide = step.name === 'form' || step.name === 'saved';

  return (
    <dialog
      ref={ref}
      className={`pn-signin${wide ? ' is-wide' : ''}`}
      aria-labelledby="pn-dialog-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === ref.current) close(); }}
    >
      <div className="pn-body">
        <button type="button" className="pn-close" aria-label="Close" onClick={close}><X size={18} aria-hidden="true" /></button>

        {step.name === 'loading' && (
          <div className="pn-loading" role="status">
            <h2 id="pn-dialog-title" className="sr-only">Write a review</h2>
            <Loader2 size={24} className="pn-spin" aria-label="Loading" />
          </div>
        )}

        {step.name === 'no-db' && (
          <>
            <h2 id="pn-dialog-title" className="pn-title">Reviews aren’t connected</h2>
            <p className="pn-sub">Writing a review needs the reviews database, which this copy of the site isn’t connected to.</p>
          </>
        )}

        {step.name === 'signin' && db && <SignInPanel key={step.key} db={db} message={step.message} onSignedIn={(session) => loadAccount(db, session)} />}

        {step.name === 'form' && (
          <>
            <h2 id="pn-dialog-title" className="pn-title">Write your review</h2>
            <p className="pn-sub">
              Reviewing as <strong className="pn-strong">{step.account.companyName}</strong>
              {' · '}
              <button type="button" className="pn-text-button" onClick={signOut}>Sign out</button>
            </p>
            <ReviewForm db={db} account={step.account} existing={step.existing} onSaved={(saved) => setStep({ name: 'saved', saved })} />
          </>
        )}

        {step.name === 'saved' && (
          <>
            <h2 id="pn-dialog-title" className="pn-title">Your review is live</h2>
            <p className="pn-sub">{step.saved?.review ? 'This is how it shows on the Poolnautics homepage.' : 'It’s saved, but it isn’t shown on the site right now. Write to hello@getpoolnautics.com if you think that’s a mistake.'}</p>
            {/* The card in the site's own type, as the homepage shows it. */}
            {step.saved?.review && <div className="pn-preview font-sans"><ReviewCard review={step.saved.review} /></div>}
            <div className="pn-done-actions">
              <button type="button" className="pn-text-button" onClick={editAgain}>Edit it</button>
              <a className="pn-text-button" href="/reviews">See all reviews</a>
            </div>
            <button type="button" className="pn-submit" onClick={close}>Done</button>
          </>
        )}
      </div>
    </dialog>
  );
}

/**
 * The small Google / Apple window's page (/reviews/write?review=oauth&rid=…, app.jsx). It hands the
 * provider's one-time code (or why there's none) to the page that opened it, which trades it, and
 * closes: this window never holds a session. The hand-over goes by BroadcastChannel, tagged with the
 * try's id, because Google's sign-in page cuts this window off from its opener (SignInPanel.jsx).
 * A window the browser won't let close says it's done instead.
 */
export function OAuthReturn() {
  const [shown, setShown] = useState('working'); // working | done | failed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('rid');
    const code = params.get('code');
    const error = code ? null : (readOAuthError() ?? 'That sign-in didn’t work. Try again, or use your email and password.');
    window.history.replaceState(null, '', window.location.pathname);
    if (!id || typeof BroadcastChannel === 'undefined') { setShown('failed'); return undefined; }
    const channel = new BroadcastChannel(OAUTH_CHANNEL);
    channel.postMessage({ id, code, error });
    channel.close();
    window.close();
    const t = window.setTimeout(() => setShown('done'), 400);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className="pn-oauth-return" role="status">
      {shown === 'working' && (<><Loader2 size={24} className="pn-spin" aria-hidden="true" /><span>Signing you in…</span></>)}
      {shown === 'done' && <span>All set. Close this window to go back to Poolnautics.</span>}
      {shown === 'failed' && <span>Sign-in couldn’t finish here. Close this window, go back to Poolnautics, and sign in with your email and password.</span>}
    </div>
  );
}
