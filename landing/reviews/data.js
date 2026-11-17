import { REVIEWS_MOCK, REVIEWS_ON, SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';
import { safeHttps, totalFromContentRange } from './logic.js';

export { safeHttps };

// ── Reading the cards: one plain request, no client library ─────────────────────────────────────
// The homepage section and /reviews only read public_reviews (the migration's view: published
// reviews, no ids of people or companies) with the public key, so they don't load supabase-js.

const CARD_FIELDS = 'id,rating,body,website_url,reviewer_name,reviewer_role,company_name,city,state,customer_since,created_at';

async function readCards(query, { count = false } = {}) {
  const headers = { apikey: SUPABASE_ANON_KEY, Accept: 'application/json' };
  // A legacy anon key is a JWT and goes as the bearer too; a publishable key goes only as apikey.
  if (SUPABASE_ANON_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  if (count) headers.Prefer = 'count=exact';
  const res = await fetch(`${SUPABASE_URL}/rest/v1/public_reviews?select=${CARD_FIELDS}&order=created_at.desc&${query}`, { headers, credentials: 'omit' });
  if (!res.ok) throw new Error(`public_reviews: ${res.status}`);
  return { rows: await res.json(), total: totalFromContentRange(res.headers.get('Content-Range')) };
}

const connected = () => Boolean(REVIEWS_ON && SUPABASE_URL && SUPABASE_ANON_KEY);

/** The newest `limit` published reviews, newest first. [] when reviews are off or unreachable. */
export async function newestReviews(limit) {
  if (REVIEWS_MOCK) return (await import('./mock.js')).MOCK_REVIEWS.slice(0, limit);
  if (!connected()) return [];
  try {
    return (await readCards(`limit=${limit}`)).rows;
  } catch {
    return [];
  }
}

/** One page of every published review, newest first: { rows, total }. Throws when unreachable. */
export async function reviewsPage(page, perPage) {
  const from = (page - 1) * perPage;
  if (REVIEWS_MOCK) {
    const all = (await import('./mock.js')).MOCK_REVIEWS;
    return { rows: all.slice(from, from + perPage), total: all.length };
  }
  if (!connected()) return { rows: [], total: 0 };
  const { rows, total } = await readCards(`offset=${from}&limit=${perPage}`, { count: true });
  return { rows, total: total ?? rows.length };
}

// ── Signing in and writing: supabase-js, only in the review popup ───────────────────────────────
// A sign-in here lasts only as long as the review popup: it's kept in this tab's sessionStorage (gone
// when the tab closes, never shared with other tabs) and ended when the popup closes or the page is
// left (ReviewDialog.jsx). It isn't the web app's session, which lives on the app's own domain.
// Google and Apple come back with a one-time code (PKCE): the small sign-in window hands it to this
// page, which trades it (SignInPanel.jsx); only after a full page trip there and back (?review=open)
// does the client read it off the address itself.

const STORAGE_KEY = 'poolnautics-reviews-auth';
const tabStorage = {
  getItem: (k) => { try { return window.sessionStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { window.sessionStorage.setItem(k, v); } catch { /* private mode: memory only */ } },
  removeItem: (k) => { try { window.sessionStorage.removeItem(k); } catch { /* nothing kept */ } },
};

let clientPromise = null;
/** The popup's Supabase client, made once. Null when reviews are off. A failed load can be tried again. */
export function getSupabase() {
  if (!connected()) return Promise.resolve(null);
  const returning = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('review') === 'open';
  clientPromise ??= import('@supabase/supabase-js')
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, storage: tabStorage, autoRefreshToken: true, flowType: 'pkce', detectSessionInUrl: returning, storageKey: STORAGE_KEY },
    }))
    .catch((err) => { clientPromise = null; throw err; });
  return clientPromise;
}

/**
 * Ends this tab's sign-in at once, even as the page goes away (pagehide): the session is revoked at
 * Supabase (only this one; the app stays signed in) by a request that outlives the page, and the stored
 * session and any half-done Google/Apple verifier are wiped synchronously. Safe with no sign-in.
 */
export function forgetSignIn() {
  let token = null;
  try {
    token = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? 'null')?.access_token ?? null;
    for (const k of Object.keys(window.sessionStorage)) if (k.startsWith(STORAGE_KEY)) window.sessionStorage.removeItem(k);
  } catch { /* nothing kept */ }
  if (!token || !connected()) return;
  fetch(`${SUPABASE_URL}/auth/v1/logout?scope=local`, {
    method: 'POST',
    keepalive: true,
    credentials: 'omit',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  }).catch(() => {});
}
