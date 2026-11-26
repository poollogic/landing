import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X } from 'lucide-react';
import SignInPanel from '../reviews/SignInPanel.jsx';
import { MESSAGES } from '../reviews/logic.js';
import { NOT_ELIGIBLE, fetchLine, getSupportClient, returnUrl, signOut } from './supportSession.js';
import '../reviews/signin.css';

// "Sign in to view" on /contact: the review popup's sign-in (same look, same doors: SignInPanel), in a
// popup of its own over the page. Loaded only on that click (SupportLine.jsx). Once signed in, it asks the
// server for the line (supportSession.js → /api/support-line) and hands it to the card, then closes. The
// sign-in is kept in this browser, unlike the review popup's.

const SIGN_IN_LOST = 'Your sign-in didn’t go through. Try again.';
const TOO_MANY = 'Too many tries. Wait a while and try again.';

export default function SupportSignIn({ message = '', onClose, onLine }) {
  const ref = useRef(null);
  const alive = useRef(true);
  const pressedOnBackdrop = useRef(false);
  const [db, setDb] = useState(null);
  // loading | signin | checking | unavailable | error
  const [step, setStep] = useState({ name: 'loading' });
  const signIn = (msg = '') => setStep({ name: 'signin', message: msg, key: Date.now() });

  const start = useCallback(async () => {
    setStep({ name: 'loading' });
    try {
      const client = await getSupportClient();
      if (!alive.current) return;
      if (!client) { setStep({ name: 'error', message: MESSAGES.unreachable, retry: start }); return; }
      setDb(client);
      setStep({ name: 'signin', message, key: Date.now() });
    } catch {
      if (alive.current) setStep({ name: 'error', message: MESSAGES.unreachable, retry: start });
    }
  }, [message]);

  useEffect(() => {
    alive.current = true;
    start();
    return () => { alive.current = false; };
  }, [start]);

  const check = async (client, session) => {
    setStep({ name: 'checking' });
    const { status, line } = await fetchLine(session);
    if (status === 200) { onLine(line); onClose({ toNumber: true }); return; }
    if (!alive.current) return;
    if (status === 403) { await signOut(client); signIn(NOT_ELIGIBLE); return; }
    if (status === 401) { await signOut(client); signIn(SIGN_IN_LOST); return; }
    if (status === 404) { setStep({ name: 'unavailable' }); return; }
    setStep({ name: 'error', message: status === 429 ? TOO_MANY : MESSAGES.unreachable, retry: () => check(client, session) });
  };

  // Opens as a modal, keyboard on the first field; the page underneath stays put.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => { root.style.overflow = before; };
  }, []);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (step.name === 'signin') return; // SignInPanel focuses its email field
    dialog.querySelector('#pn-dialog-title')?.focus();
  }, [step]);

  const close = () => onClose({ toNumber: false });
  const title = (text, hidden = false) => <h2 id="pn-dialog-title" tabIndex={-1} className={hidden ? 'sr-only' : 'pn-title'}>{text}</h2>;

  return createPortal(
    <dialog
      ref={ref}
      className="pn-signin"
      aria-labelledby="pn-dialog-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onPointerDown={(e) => { pressedOnBackdrop.current = e.target === ref.current; }}
      onClick={(e) => { if (e.target === ref.current && pressedOnBackdrop.current) close(); pressedOnBackdrop.current = false; }}
    >
      <div className="pn-body">
        <button type="button" className="pn-close" aria-label="Close" onClick={close}><X size={18} aria-hidden="true" /></button>

        {(step.name === 'loading' || step.name === 'checking') && (
          <div className="pn-loading" role="status">
            {title(step.name === 'checking' ? 'Getting the direct line' : 'Sign in', true)}
            <Loader2 size={24} className="pn-spin" aria-label="Loading" />
          </div>
        )}

        {step.name === 'signin' && db && (
          <SignInPanel key={step.key} db={db} message={step.message} returnUrl={returnUrl} onSignedIn={(session) => check(db, session)} />
        )}

        {step.name === 'unavailable' && (
          <>
            {title('You’re signed in')}
            <p className="pn-sub">Our direct line isn’t set up yet. Email support@getpoolnautics.com and a real person will help you.</p>
            <button type="button" className="pn-submit" onClick={close}>Done</button>
          </>
        )}

        {step.name === 'error' && (
          <>
            {title('Something went wrong')}
            <p className="pn-sub">{step.message}</p>
            <button type="button" className="pn-submit" onClick={step.retry}>Try again</button>
          </>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
