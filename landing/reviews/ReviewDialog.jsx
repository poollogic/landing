import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { forgetSignIn, getSupabase } from './data.js';
import { REVIEWS_MOCK } from './config.js';
import { MESSAGES, cleanedAddress, isPhoneOnly, isWritePath, oauthErrorMessage, safeHttps } from './logic.js';
import SignInPanel, { OAUTH_CHANNEL } from './SignInPanel.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewCard from './ReviewCard.jsx';
import './signin.css';
import './reviews.css';

// The review popup, over whatever page the visitor is on (opened by openReview.js; nothing here
// loads until then). One <dialog>, three steps: sign in (SignInPanel) → the company's review
// (ReviewForm) → the card as the homepage shows it. The page underneath never changes; Escape, the X
// and the backdrop close it.
//
// A sign-in lasts only as long as the popup: closing it, or leaving or reloading the page, ends it
// (forgetSignIn, data.js). Each opening is numbered (visit), and anything that finishes after the popup
// has closed, such as a sign-in still on its way, is dropped and its session ended, never shown.

const tidyAddress = () => window.history.replaceState(window.history.state, '', cleanedAddress(window.location.href));

export default function ReviewDialog({ register }) {
  const ref = useRef(null);
  const visit = useRef(0); // the current opening; 0 while closed
  const [openedAs, setOpenedAs] = useState(0); // the same, for what each render hands out
  const pressedOnBackdrop = useRef(false);
  const [open, setOpen] = useState(false);
  const [db, setDb] = useState(null);
  // loading | signin | form | saved | error | no-db
  const [step, setStep] = useState({ name: 'loading' });

  const signIn = (message = '') => setStep({ name: 'signin', message, key: Date.now() });
  const failed = (retry) => setStep({ name: 'error', retry });

  // Who's signed in, their company, and its review if it has one (RLS: their own company only).
  // `mine` is the opening this belongs to: if the popup has closed (or reopened) since, the sign-in is
  // ended instead.
  const loadAccount = useCallback(async (client, session, mine) => {
    const stale = () => !mine || mine !== visit.current;
    if (stale()) { forgetSignIn(); return; }
    setStep({ name: 'loading' });
    const retry = () => loadAccount(client, session, mine);
    const { data: profile, error: profileError } = await client.from('profiles').select('full_name, organization_id, role').eq('id', session.user.id).maybeSingle();
    if (stale()) { forgetSignIn(); return; }
    if (profileError) { failed(retry); return; }
    // A Google or Apple login of a technician (email and password are refused by the app's sign-in).
    if (profile && isPhoneOnly(profile.role)) { forgetSignIn(); signIn(MESSAGES.officeOnly); return; }
    if (!profile?.organization_id) { forgetSignIn(); signIn(MESSAGES.noAccount); return; }
    const [orgRes, reviewRes] = await Promise.all([
      client.from('organizations').select('company_name, branding').eq('id', profile.organization_id).maybeSingle(),
      client.from('reviews').select('rating, body, website_url, reviewer_name, reviewer_role, status').eq('company_id', profile.organization_id).maybeSingle(),
    ]);
    if (stale()) { forgetSignIn(); return; }
    // A network or server failure is said as one, never as "no company", and doesn't sign them out.
    if (orgRes.error || reviewRes.error) { failed(retry); return; }
    if (!orgRes.data) { forgetSignIn(); signIn(MESSAGES.noAccount); return; }
    setStep({
      name: 'form',
      account: { companyName: orgRes.data.company_name, fullName: profile.full_name, website: safeHttps(orgRes.data.branding?.websiteUrl) },
      existing: reviewRes.data,
    });
  }, []);

  const start = useCallback(async ({ returning = false } = {}) => {
    const mine = Math.abs(visit.current) + 1;
    visit.current = mine;
    setOpenedAs(mine);
    setOpen(true);
    setStep({ name: 'loading' });
    if (REVIEWS_MOCK) { setStep({ name: 'no-db' }); return; }
    let client;
    try {
      client = await getSupabase();
    } catch {
      if (mine === visit.current) failed(() => start({ returning }));
      return;
    }
    if (mine !== visit.current) return;
    if (!client) { setStep({ name: 'no-db' }); return; }
    setDb(client);
    const oauthError = returning ? oauthErrorMessage(window.location.search, window.location.hash) : null;
    // Back from Google or Apple by the page itself: this trades the code for a session (data.js).
    const { data } = await client.auth.getSession();
    if (returning) tidyAddress();
    if (mine !== visit.current) { forgetSignIn(); return; }
    if (data.session) loadAccount(client, data.session, mine);
    else signIn(oauthError ?? '');
  }, [loadAccount]);

  useEffect(() => { register({ open: start }); }, [register, start]);

  // Leaving or reloading the page ends any sign-in the popup made (a link, the back button, a refresh).
  useEffect(() => {
    window.addEventListener('pagehide', forgetSignIn);
    return () => window.removeEventListener('pagehide', forgetSignIn);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    // The browser puts focus on the X when it opens; start where the step's own focus goes instead.
    if (open && !dialog.open) { dialog.showModal(); (dialog.querySelector('#pn-email') ?? dialog.querySelector('#pn-dialog-title'))?.focus(); }
    if (!open && dialog.open) dialog.close();
    if (!open) return undefined;
    // The page underneath stays put while the popup is open.
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => { root.style.overflow = before; };
  }, [open]);

  // Each step starts with the keyboard (and a screen reader) on it: the sign-in at its email field
  // (SignInPanel), every other step at its heading, so focus never falls back to the page.
  useEffect(() => {
    if (!open || step.name === 'signin') return;
    ref.current?.querySelector('#pn-dialog-title')?.focus();
  }, [open, step]);

  const close = () => {
    // Numbers only go up, so a result from this opening can never pass for a later one.
    visit.current = -Math.abs(visit.current);
    setOpenedAs(0);
    setOpen(false);
    if (isWritePath(window.location.pathname)) tidyAddress();
    forgetSignIn();
  };

  const signOut = () => { forgetSignIn(); signIn(); };

  const editAgain = async () => {
    const { data } = await db.auth.getSession();
    if (data.session) loadAccount(db, data.session, openedAs);
    else signIn();
  };

  const wide = step.name === 'form' || step.name === 'saved';
  const title = (text, hidden = false) => <h2 id="pn-dialog-title" tabIndex={-1} className={hidden ? 'sr-only' : 'pn-title'}>{text}</h2>;

  return (
    <dialog
      ref={ref}
      className={`pn-signin${wide ? ' is-wide' : ''}`}
      aria-labelledby="pn-dialog-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      // The backdrop closes it only for a press that began there: a text selection dragged out of a
      // field and let go over the backdrop doesn't throw the review away.
      onPointerDown={(e) => { pressedOnBackdrop.current = e.target === ref.current; }}
      onClick={(e) => { if (e.target === ref.current && pressedOnBackdrop.current) close(); pressedOnBackdrop.current = false; }}
    >
      <div className="pn-body">
        <button type="button" className="pn-close" aria-label="Close" onClick={close}><X size={18} aria-hidden="true" /></button>

        {step.name === 'loading' && (
          <div className="pn-loading" role="status">
            {title('Write a review', true)}
            <Loader2 size={24} className="pn-spin" aria-label="Loading" />
          </div>
        )}

        {step.name === 'no-db' && (
          <>
            {title('Reviews aren’t connected')}
            <p className="pn-sub">Writing a review needs the reviews database, which this copy of the site isn’t connected to.</p>
          </>
        )}

        {step.name === 'error' && (
          <>
            {title('Something went wrong')}
            <p className="pn-sub">{MESSAGES.unreachable}</p>
            <button type="button" className="pn-submit" onClick={step.retry}>Try again</button>
          </>
        )}

        {step.name === 'signin' && db && (
          <SignInPanel key={step.key} db={db} message={step.message} onSignedIn={(session) => loadAccount(db, session, openedAs)} />
        )}

        {step.name === 'form' && (
          <>
            {title('Write your review')}
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
            {title('Your review is live')}
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
    const error = code ? null : (oauthErrorMessage(window.location.search, window.location.hash) ?? MESSAGES.oauthFailed);
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
