import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { APP_URL } from './config.js';
import './signin.css';

// The review page's sign-in, as a popup that looks like the Poolnautics app's own sign-in
// (signin.css). Google and Apple leave for the provider and come back to /reviews/write, where
// supabase-js picks the sign-in up from the address (data.js); email and password sign in here.
// A native <dialog>: Escape, the backdrop and the X close it, and the page behind can't be reached.

const SIGN_IN_FAILED = 'That email and password don’t match a Poolnautics account.';

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

export default function SignInDialog({ db, open, message, onClose, onSignedIn }) {
  const ref = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(null); // null | 'password' | 'google' | 'apple'
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // The browser would focus the X first; start at the email, as the app's page does.
    if (open && !dialog.open) { dialog.showModal(); dialog.querySelector('#pn-email')?.focus(); }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // A sign-in that came back refused from Google or Apple says so here.
  useEffect(() => { if (message) setError(message); }, [message]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    setBusy('password');
    setError('');
    const { data, error: err } = await db.auth.signInWithPassword({ email: email.trim(), password });
    if (err || !data.session) {
      setBusy(null);
      setError(err?.status === 429 ? 'Too many tries. Wait a minute and try again.' : SIGN_IN_FAILED);
      return;
    }
    setBusy(null);
    setPassword('');
    onSignedIn(data.session);
  };

  const withProvider = async (provider) => {
    setBusy(provider);
    setError('');
    const { error: err } = await db.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/reviews/write` },
    });
    // On success the browser is already leaving for the provider.
    if (err) { setBusy(null); setError('That sign-in couldn’t start. Try again, or use your email and password.'); }
  };

  return (
    <dialog
      ref={ref}
      className="pn-signin"
      aria-labelledby="pn-signin-title"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="pn-body">
        <button type="button" className="pn-close" aria-label="Close" onClick={onClose}><X size={18} aria-hidden="true" /></button>
        <h2 id="pn-signin-title" className="pn-title">Welcome back</h2>
        <p className="pn-sub">Sign in to your Poolnautics account</p>

        <div className="pn-social">
          {PROVIDERS.map(({ id, label, Icon }) => (
            <button key={id} type="button" className="pn-provider" aria-label={`Continue with ${label}`} disabled={!!busy} onClick={() => withProvider(id)}>
              {busy === id ? <Loader2 size={16} className="pn-spin" aria-hidden="true" /> : <Icon />}
              {label}
            </button>
          ))}
        </div>

        <div className="pn-or" aria-hidden="true"><span /><span className="pn-or-text">Or</span><span /></div>

        <form onSubmit={submit} noValidate>
          {error && <div role="alert" className="pn-message">{error}</div>}
          <div className="pn-field">
            <label className="pn-label" htmlFor="pn-email">Email</label>
            <input
              id="pn-email" className="pn-input" type="email" name="email" autoComplete="username" placeholder="name@company.com"
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
          <button type="submit" className="pn-submit" disabled={!!busy}>
            {busy === 'password' ? <Loader2 size={18} className="pn-spin" aria-label="Signing in" /> : 'Sign in'}
          </button>
        </form>

        <p className="pn-foot">Forgot your <a href={APP_URL} target="_blank" rel="noreferrer">password</a>? Reset it in the app.</p>
      </div>
    </dialog>
  );
}
