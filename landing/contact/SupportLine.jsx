import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';
import { FOCUS } from '../ReserveSize.jsx';
import { MESSAGES, oauthErrorMessage } from '../reviews/logic.js';
import {
  NOT_ELIGIBLE, STORAGE_KEY, fetchLine, getSupportClient, isReturning, mayBeSignedIn, signInAvailable, signOut, tidyAddress,
} from './supportSession.js';

// The direct support line in /contact's "Customer support" card. The page (and its pre-rendered HTML)
// always starts signed out: a blurred dummy number, never the real one, and "Sign in to view". The real
// number exists only on the server (server/supportLine.js); the browser asks for it after load, and only
// if this browser holds a sign-in from here (supportSession.js), or once the visitor signs in through the
// popup (SupportSignIn.jsx, loaded on the click). The answer is kept in memory and dropped on sign-out,
// including a sign-out in another tab.

const SupportSignIn = lazy(() => import('./SupportSignIn.jsx'));
const warmSignIn = () => { import('./SupportSignIn.jsx').catch(() => {}); getSupportClient().catch(() => {}); };

export const DUMMY_NUMBER = '(000) 000-0000'; // what the blur shows: never the real number

/** { line, signIn, signOut, dialog } for the card. `line` is null until a signed-in check passes. */
export function useSupportLine(enabled = true) {
  const [line, setLine] = useState(null);
  const [dialog, setDialog] = useState(null); // null, or { message } while the sign-in popup is open
  const [focusNumber, setFocusNumber] = useState(false);
  const numberRef = useRef(null);
  const watching = useRef(null);

  // A sign-out anywhere (here, another tab, or the session ending at Supabase) takes the number away.
  const watch = useCallback((client) => {
    if (!client || watching.current) return;
    watching.current = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) setLine(null);
    }).data.subscription;
  }, []);

  useEffect(() => {
    let live = true;
    const onStorage = (e) => { if (e.key === null || (e.key === STORAGE_KEY && e.newValue == null)) setLine(null); };
    window.addEventListener('storage', onStorage);

    if (enabled && mayBeSignedIn()) {
      (async () => {
        const returning = isReturning();
        const oauthError = returning ? oauthErrorMessage(window.location.search, window.location.hash) : null;
        let client;
        try { client = await getSupportClient(); } catch { return; }
        if (!client) return;
        // Back from Google or Apple by a full page trip: this also trades the code for a session.
        const { data } = await client.auth.getSession();
        if (returning) tidyAddress();
        if (!live) return;
        watch(client);
        if (!data.session) {
          if (returning) setDialog({ message: oauthError === MESSAGES.noAccount ? NOT_ELIGIBLE : (oauthError ?? MESSAGES.oauthFailed) });
          return;
        }
        const { status, line: got } = await fetchLine(data.session);
        if (!live) return;
        if (status === 200) { setLine(got); return; }
        if (status === 401 || status === 403) {
          await signOut(client);
          if (returning && status === 403) setDialog({ message: NOT_ELIGIBLE });
        }
        // 404 (not set up yet), 429 or unreachable: stay as signed out, keep the sign-in for next time.
      })();
    }
    return () => {
      live = false;
      window.removeEventListener('storage', onStorage);
      watching.current?.unsubscribe();
      watching.current = null;
    };
  }, [enabled, watch]);

  useEffect(() => {
    if (focusNumber && line) { numberRef.current?.focus(); setFocusNumber(false); }
  }, [focusNumber, line]);

  const signOutHere = useCallback(async () => {
    setLine(null);
    await signOut(await getSupportClient().catch(() => null));
  }, []);

  const dialogEl = dialog && (
    <Suspense fallback={null}>
      <SupportSignIn
        message={dialog.message}
        onLine={(got) => { setLine(got); getSupportClient().then(watch, () => {}); }}
        onClose={({ toNumber }) => { setDialog(null); if (toNumber) setFocusNumber(true); }}
      />
    </Suspense>
  );

  return { line, numberRef, openSignIn: () => setDialog({ message: '' }), signOut: signOutHere, dialog: dialogEl };
}

/** The 28px row: the dummy and "Sign in to view" when signed out; the number and hours when signed in. */
export function SupportPhoneRow({ line, numberRef, openSignIn, fallbackUrl }) {
  return (
    // .ct-phone is a size container: below a set width both states take the same two lines, above it the
    // same one line (landing/contact.css), so signing in or out never changes the card's size.
    <div className={`ct-phone${line ? ' is-in' : ''}`}>
      <div className="ct-phone-row">
        <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
        {line ? (
          <>
            <a ref={numberRef} href={line.tel} className={`ct-phone-number ${FOCUS}`}>{line.phone}</a>
            {line.hours ? <span className="ct-phone-end ct-phone-hours" title={line.hours}>{line.hours}</span> : <span className="ct-phone-end" />}
          </>
        ) : (
          <>
            <span className="ct-phone-dummy" aria-hidden="true">{DUMMY_NUMBER}</span>
            <span className="sr-only">Direct phone line, shown after you sign in.</span>
            <span className="ct-phone-end">
              {signInAvailable() ? (
                <button type="button" className={`ct-phone-btn ${FOCUS}`} onClick={openSignIn} onPointerEnter={warmSignIn} onFocus={warmSignIn}>
                  Sign in to view
                </button>
              ) : (
                // A copy of the site without the sign-in set up (VITE_REVIEWS off): the app's own sign-in.
                <a href={fallbackUrl} className={`ct-phone-btn ${FOCUS}`}>Sign in to view</a>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
