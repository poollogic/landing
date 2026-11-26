import { REVIEWS_ON, SUPABASE_ANON_KEY, SUPABASE_URL } from '../reviews/config.js';

// The sign-in behind /contact's direct support line (SupportLine.jsx). It's the review popup's sign-in
// (the app's own door for email and password, Google and Apple in a small window: reviews/SignInPanel.jsx)
// with one difference: it's kept. The session sits in this browser's localStorage under its own key, so a
// customer who signed in once sees the number on every later visit until they sign out or the session
// ends. It never holds the number: the page asks /api/support-line (server/supportLine.js) for it on each
// visit, with this session's access token, and keeps the answer in memory only.
//
// Nothing here loads supabase-js up front: a visitor who has never signed in here costs one localStorage
// read and nothing else.

export const STORAGE_KEY = 'poolnautics-support-auth';
export const NOT_ELIGIBLE = 'The direct line is for Poolnautics company accounts. Sign in with your office login (owner, admin or manager).';
const RETURN_PARAM = 'signin';
const RETURN_VALUE = 'support';

const local = {
  getItem: (k) => { try { return window.localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { window.localStorage.setItem(k, v); } catch { /* private mode: this visit only */ } },
  removeItem: (k) => { try { window.localStorage.removeItem(k); } catch { /* nothing kept */ } },
};

export const signInAvailable = () => Boolean(REVIEWS_ON && SUPABASE_URL && SUPABASE_ANON_KEY);

/** Back from Google or Apple by a full page trip (the small window was blocked). */
export const isReturning = () => typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).get(RETURN_PARAM) === RETURN_VALUE;

/** True if this browser may hold a sign-in from here: only then is supabase-js loaded on page load. */
export const mayBeSignedIn = () => signInAvailable() && (isReturning() || local.getItem(STORAGE_KEY) != null);

/** Where a full page trip to Google or Apple comes back to: this page, with the sign-in to finish. */
export function returnUrl() {
  const url = new URL(window.location.href);
  url.hash = '';
  url.searchParams.set(RETURN_PARAM, RETURN_VALUE);
  return url.href;
}

/** The address with what that trip left on it removed. */
export function tidyAddress() {
  const url = new URL(window.location.href);
  [RETURN_PARAM, 'code', 'state', 'error', 'error_code', 'error_description'].forEach((k) => url.searchParams.delete(k));
  if (/error|access_token/.test(url.hash)) url.hash = '';
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

let clientPromise = null;
/** This page's Supabase client, made once. Null when sign-in isn't set up. A failed load can be tried again. */
export function getSupportClient() {
  if (!signInAvailable()) return Promise.resolve(null);
  clientPromise ??= import('@supabase/supabase-js')
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, storage: local, autoRefreshToken: true, flowType: 'pkce', detectSessionInUrl: isReturning(), storageKey: STORAGE_KEY },
    }))
    .catch((err) => { clientPromise = null; throw err; });
  return clientPromise;
}

/**
 * Asks the server for the line with this session. Resolves { status, line? }: 200 with
 * { phone, tel, hours }; 401 / 403 / 404 / 429 / other as the server said; 0 if it couldn't be reached.
 */
export async function fetchLine(session) {
  if (!session?.access_token) return { status: 401 };
  try {
    const res = await fetch('/api/support-line', {
      headers: { Authorization: `Bearer ${session.access_token}`, Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
    });
    if (res.status !== 200) return { status: res.status };
    const line = await res.json().catch(() => null);
    if (typeof line?.phone !== 'string' || typeof line?.tel !== 'string' || !/^tel:\+\d{4,15}$/.test(line.tel)) return { status: 0 };
    return { status: 200, line: { phone: line.phone, tel: line.tel, hours: typeof line.hours === 'string' ? line.hours : '' } };
  } catch {
    return { status: 0 };
  }
}

/** Wipes the stored sign-in from this browser at once (and any half-done Google/Apple verifier). */
export function wipeStored() {
  try {
    for (const k of Object.keys(window.localStorage)) if (k.startsWith(STORAGE_KEY)) window.localStorage.removeItem(k);
  } catch { /* nothing kept */ }
}

/**
 * Signs this browser out: the session is ended at Supabase (this one only; the app stays signed in), then
 * wiped here. Supabase is asked first, because it reads the session it ends from storage; the wipe happens
 * after at most 3 seconds even if Supabase doesn't answer.
 */
export async function signOut(client) {
  try {
    if (client) await Promise.race([client.auth.signOut({ scope: 'local' }), new Promise((r) => { setTimeout(r, 3000); })]);
  } catch { /* wiped anyway */ }
  wipeStored();
}
