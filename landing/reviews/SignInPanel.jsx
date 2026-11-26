import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Turnstile from '../Turnstile.jsx';
import { TURNSTILE_SITE_KEY } from '../onboarding.js';
import { APP_URL, REVIEWS_TURNSTILE_SITE_KEY, SIGNIN_URL } from './config.js';
import { MESSAGES } from './logic.js';

// The review popup's sign-in step (ReviewDialog), a copy of the Poolnautics app's sign-in form
// (signin.css). Email and password go through the app's own sign-in (SIGNIN_URL: its per-address
// limit, and its refusal of phone-only logins and unconfirmed companies), and the session it returns
// is handed to this site's client. Google and Apple open in a small window of their own (startOAuth),
// so the page underneath never leaves; that window comes back to /reviews/write?review=oauth
// (OAuthReturn in ReviewDialog.jsx), hands this page the one-time code and closes, and this page
// trades it. If the browser blocks the window, the page itself goes and comes back to where it was,
// with the popup open.

const SIGN_IN_FAILED = 'That email and password don’t match a Poolnautics account.';
const OAUTH_FAILED = MESSAGES.oauthFailed;
const NOT_CONFIRMED = 'Confirm your company’s email first: use the link we sent when you signed up, then try again.';
const UNREACHABLE = MESSAGES.unreachable;

const SITEKEY = REVIEWS_TURNSTILE_SITE_KEY ?? TURNSTILE_SITE_KEY;
const NOT_VERIFIED = 'We couldn’t confirm you’re a person. Try again in a moment.';

/** Email and password (and the Turnstile token) through the app's sign-in. Resolves { session } or { error }. */
async function signInThroughApp(db, email, password, turnstileToken) {
  let res;
  try {
    res = await fetch(SIGNIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, turnstileToken }),
      credentials: 'omit',
    });
  } catch {
    return { error: UNREACHABLE };
  }
  const body = await res.json().catch(() => ({}));
  if (res.status === 429) return { error: 'Too many tries. Wait a minute and try again.' };
  if (res.status === 403 && body.code === 'WEB_APP_NOT_FOR_ROLE') return { error: MESSAGES.officeOnly };
  if (res.status === 403 && body.code === 'EMAIL_NOT_CONFIRMED') return { error: NOT_CONFIRMED };
  if (res.status === 403 && body.code === 'NOT_VERIFIED') return { error: NOT_VERIFIED };
  if (res.status === 401) return { error: SIGN_IN_FAILED };
  if (!res.ok || !body.access_token || !body.refresh_token) return { error: UNREACHABLE };
  const { data, error } = await db.auth.setSession({ access_token: body.access_token, refresh_token: body.refresh_token });
  return error || !data.session ? { error: UNREACHABLE } : { session: data.session };
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.76c-.03-2.67 2.18-3.95 2.28-4.01-1.24-1.82-3.18-2.07-3.87-2.1-1.65-.17-3.21.97-4.05.97-.83 0-2.12-.95-3.49-.92-1.8.03-3.45 1.04-4.38 2.65-1.87 3.24-.48 8.04 1.34 10.67.89 1.29 1.95 2.73 3.34 2.68 1.34-.05 1.85-.87 3.47-.87 1.62 0 2.08.87 3.5.84 1.44-.03 2.36-1.31 3.24-2.6 1.02-1.49 1.44-2.94 1.47-3.01-.03-.01-2.82-1.08-2.85-4.3ZM13.71 4.92c.74-.9 1.24-2.14 1.1-3.38-1.07.04-2.36.71-3.12 1.6-.68.79-1.28 2.06-1.12 3.27 1.19.09 2.41-.6 3.14-1.49Z" />
    </svg>
  );
}

const PROVIDERS = [
  { id: 'google', label: 'Google', Icon: GoogleIcon },
  { id: 'apple', label: 'Apple', Icon: AppleIcon },
];

/** Where the page itself comes back to if the small window is blocked: here, with the popup open. */
export function returnHere() {
  const url = new URL(window.location.href);
  url.hash = '';
  url.searchParams.set('review', 'open');
  return url.href;
}

// The small window answers on this channel (OAuthReturn in ReviewDialog.jsx), not through
// window.opener: Google's sign-in page sends Cross-Origin-Opener-Policy: same-origin, which cuts the
// window off from this page for good (no opener, and popup.closed reads true while it's still open).
// A BroadcastChannel reaches every page of this site in this browser, so each try carries its own
// random id and only the page that started it listens for that id.
export const OAUTH_CHANNEL = 'poolnautics-review-sign-in';
const OAUTH_WAIT_MS = 10 * 60_000;

/** The small window, opened at once on the click (Safari blocks one opened after an await). */
function openSignInWindow() {
  const w = 480;
  const h = 640;
  const left = Math.max(0, window.screenX + (window.outerWidth - w) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - h) / 2);
  return window.open('about:blank', 'poolnautics-sign-in', `popup,width=${w},height=${h},left=${left},top=${top}`);
}

/**
 * Google or Apple in the small window `popup`. Resolves { code } once the provider has sent one back,
 * { error } if it refused or couldn't start, or {} if cancelled (cancel.current) or left for 10 minutes.
 * No window, or no BroadcastChannel: the page itself goes and comes back here with the popup open.
 */
async function startOAuth(db, provider, popup, cancel, returnUrl = returnHere) {
  if (!popup || typeof BroadcastChannel === 'undefined') {
    popup?.close();
    const { error } = await db.auth.signInWithOAuth({ provider, options: { redirectTo: returnUrl() } });
    return error ? { error: OAUTH_FAILED } : new Promise(() => {}); // leaving
  }
  const id = crypto.randomUUID();
  const channel = new BroadcastChannel(OAUTH_CHANNEL);
  const answer = new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve({}), OAUTH_WAIT_MS);
    const done = (result) => { window.clearTimeout(timer); channel.close(); cancel.current = null; resolve(result); };
    cancel.current = () => { done({}); try { popup.close(); } catch { /* cut off from it */ } };
    channel.onmessage = (e) => {
      if (e.data?.id !== id) return;
      done(e.data.code ? { code: e.data.code } : { error: e.data.error || OAUTH_FAILED });
    };
  });
  const { data, error } = await db.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/reviews/write?review=oauth&rid=${id}`, skipBrowserRedirect: true },
  });
  if (error || !data?.url) { cancel.current?.(); return { error: OAUTH_FAILED }; }
  popup.location.href = data.url;
  return answer;
}

// `returnUrl`: where a full page trip to Google or Apple comes back to (the review popup's by default;
// /contact's support sign-in passes its own, landing/contact/).
export default function SignInPanel({ db, message, onSignedIn, returnUrl = returnHere }) {
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(null); // null | 'password' | 'google' | 'apple'
  const cancelOAuth = useRef(null);
  useEffect(() => () => cancelOAuth.current?.(), []);
  const [error, setError] = useState(message || '');
  // Turnstile: invisible unless Cloudflare wants a click. Its token is single-use, so each try gets a
  // fresh widget (check). A try made before the token arrives waits for it, up to 8 seconds.
  const [check, setCheck] = useState(0);
  const token = useRef(null);
  const waiters = useRef([]);
  const onToken = useCallback((t) => {
    token.current = t;
    if (t) { waiters.current.forEach((w) => w(t)); waiters.current = []; }
  }, []);
  const tokenNow = () => (!SITEKEY || token.current ? Promise.resolve(token.current) : new Promise((resolve) => {
    waiters.current.push(resolve);
    window.setTimeout(() => resolve(token.current), 8000);
  }));

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => { if (message) setError(message); }, [message]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    setBusy('password');
    setError('');
    const result = await signInThroughApp(db, email.trim(), password, await tokenNow());
    token.current = null;
    setCheck((n) => n + 1);
    setBusy(null);
    if (result.error) { setError(result.error); return; }
    setPassword('');
    onSignedIn(result.session);
  };

  const withProvider = async (provider) => {
    setBusy(provider);
    setError('');
    const result = await startOAuth(db, provider, openSignInWindow(), cancelOAuth, returnUrl);
    if (!result.code) { setBusy(null); if (result.error) setError(result.error); return; }
    // This page made the code's verifier, so it trades the code; the small window never held a session.
    const { data, error: err } = await db.auth.exchangeCodeForSession(result.code);
    setBusy(null);
    if (err || !data.session) { setError(OAUTH_FAILED); return; }
    onSignedIn(data.session);
  };

  return (
    <>
      <h2 id="pn-dialog-title" className="pn-title">Welcome back</h2>
      <p className="pn-sub">Sign in to your Poolnautics account</p>

      <div className="pn-social">
        {PROVIDERS.map(({ id, label, Icon }) => (
          <button key={id} type="button" className="pn-provider" aria-label={`Continue with ${label}`} disabled={!!busy} onClick={() => withProvider(id)}>
            {busy === id ? <Loader2 size={16} className="pn-spin" aria-hidden="true" /> : <Icon />}
            {label}
          </button>
        ))}
      </div>
      {(busy === 'google' || busy === 'apple') && (
        <p className="pn-waiting" role="status">
          Finish signing in with {busy === 'google' ? 'Google' : 'Apple'} in the window that opened.{' '}
          <button type="button" className="pn-text-button" onClick={() => cancelOAuth.current?.()}>Cancel</button>
        </p>
      )}

      <div className="pn-or" aria-hidden="true"><span /><span className="pn-or-text">Or</span><span /></div>

      <form onSubmit={submit} noValidate>
        {error && <div role="alert" className="pn-message">{error}</div>}
        <div className="pn-field">
          <label className="pn-label" htmlFor="pn-email">Email</label>
          <input
            ref={emailRef} id="pn-email" className="pn-input" type="email" name="email" autoComplete="username" placeholder="name@company.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="pn-field">
          <label className="pn-label" htmlFor="pn-password">Password</label>
          <div className="pn-password">
            <input
              id="pn-password" className="pn-input" type={shown ? 'text' : 'password'} name="password" autoComplete="current-password"
              placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="pn-eye" aria-label={shown ? 'Hide password' : 'Show password'} onClick={() => setShown((v) => !v)}>
              {shown ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <Turnstile key={check} sitekey={SITEKEY} onToken={onToken} theme="dark" appearance="interaction-only" />
        <button type="submit" className="pn-submit" disabled={!!busy}>
          {busy === 'password' ? <Loader2 size={18} className="pn-spin" aria-label="Signing in" /> : 'Sign in'}
        </button>
      </form>

      <p className="pn-foot">Forgot your <a href={APP_URL} target="_blank" rel="noreferrer">password</a>? Reset it in the app.</p>
    </>
  );
}
