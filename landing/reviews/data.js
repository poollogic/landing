import { REVIEWS_MOCK, REVIEWS_ON, SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';

// The site's one Supabase client, made the first time it's needed (so supabase-js loads only on pages
// that use it). Its sign-in is kept in this browser under its own key; it isn't the web app's session,
// which lives on app.poollogic.app.
let clientPromise = null;
export function getSupabase() {
  if (!REVIEWS_ON || !SUPABASE_URL || !SUPABASE_ANON_KEY) return Promise.resolve(null);
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'poolnautics-reviews-auth' },
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
