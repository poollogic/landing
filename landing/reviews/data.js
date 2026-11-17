import { REVIEWS_MOCK, REVIEWS_ON, SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';

// The site's one Supabase client, made the first time it's needed (so supabase-js loads only on pages
// that use it). A sign-in here lasts only as long as the review popup: it's kept in this tab's
// sessionStorage (gone when the tab closes, never shared with other tabs) and ended when the popup
// closes (ReviewDialog.jsx). It isn't the web app's session, which lives on the app's own domain.
// Google and Apple come back with a one-time code (PKCE): the small sign-in window hands it to this
// page, which trades it (SignInPanel.jsx); only after a full page trip there and back (?review=open)
// does the client read it off the address itself.
const tabStorage = {
  getItem: (k) => { try { return window.sessionStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { window.sessionStorage.setItem(k, v); } catch { /* private mode: memory only */ } },
  removeItem: (k) => { try { window.sessionStorage.removeItem(k); } catch { /* nothing kept */ } },
};
let clientPromise = null;
export function getSupabase() {
  if (!REVIEWS_ON || !SUPABASE_URL || !SUPABASE_ANON_KEY) return Promise.resolve(null);
  const returning = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('review') === 'open';
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, storage: tabStorage, autoRefreshToken: true, flowType: 'pkce', detectSessionInUrl: returning, storageKey: 'poolnautics-reviews-auth' },
  }));
  return clientPromise;
}

// The cards' fields: public_reviews, the migration's view (no ids of people or companies).
const CARD_FIELDS = 'id, rating, body, website_url, reviewer_name, reviewer_role, company_name, city, state, customer_since, created_at';

/** The newest `limit` published reviews, newest first. [] when reviews are off or unreachable. */
export async function newestReviews(limit) {
  if (REVIEWS_MOCK) return (await import('./mock.js')).MOCK_REVIEWS.slice(0, limit);
  const db = await getSupabase();
  if (!db) return [];
  const { data, error } = await db.from('public_reviews').select(CARD_FIELDS).order('created_at', { ascending: false }).limit(limit);
  return error ? [] : data;
}

/** One page of every published review, newest first: { rows, total }. */
export async function reviewsPage(page, perPage) {
  const from = (page - 1) * perPage;
  if (REVIEWS_MOCK) {
    const all = (await import('./mock.js')).MOCK_REVIEWS;
    return { rows: all.slice(from, from + perPage), total: all.length };
  }
  const db = await getSupabase();
  if (!db) return { rows: [], total: 0 };
  const { data, count, error } = await db.from('public_reviews').select(CARD_FIELDS, { count: 'exact' })
    .order('created_at', { ascending: false }).range(from, from + perPage - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}

/** The link only if it's a well-formed https address (the database checks it too). */
export function safeHttps(url) {
  if (typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' || !u.hostname.includes('.')) return null;
    // A bare domain stays as typed, not with the "/" the browser adds.
    return u.pathname === '/' && !u.search && !u.hash ? u.origin : u.href;
  } catch {
    return null;
  }
}
