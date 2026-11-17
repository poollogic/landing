// Homepage reviews (landing/reviews/, pages/reviews.jsx; writing one is a popup, openReview.js): off unless the build
// sets VITE_REVIEWS=1. Reviews live in the app's Supabase project (the web app's migration
// 20270207120000_homepage_reviews.sql), read and written with the public anon key and, to write, the
// member's own sign-in. Only the anon key ever belongs here, never the service role key.
//
// For local work without a database, VITE_REVIEWS_MOCK=1 (dev server only) shows made-up reviews from
// mock.js instead; the review popup then says it needs a database.

export const REVIEWS_ON = import.meta.env.VITE_REVIEWS === '1';
export const REVIEWS_MOCK = REVIEWS_ON && import.meta.env.DEV && import.meta.env.VITE_REVIEWS_MOCK === '1';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const APP_URL = 'https://app.poolnautics.app';
// Email and password sign in through the app's own door (its per-address limit, and its refusal of
// phone-only logins and unconfirmed companies), which answers this site only (the web app's
// routes/hono/_marketingSignInCors.ts). A preview points it at its own app with VITE_REVIEWS_SIGNIN_URL.
export const SIGNIN_URL = import.meta.env.VITE_REVIEWS_SIGNIN_URL || `${APP_URL}/api/auth/signin`;
// The popup's sign-in carries the site's Turnstile check (landing/Turnstile.jsx), verified by the app's
// sign-in with the widget's secret (MARKETING_TURNSTILE_SECRET_KEY). A preview on localhost, which the
// site's widget doesn't allow, sets VITE_REVIEWS_TURNSTILE_SITE_KEY to Cloudflare's test key.
export const REVIEWS_TURNSTILE_SITE_KEY = import.meta.env.VITE_REVIEWS_TURNSTILE_SITE_KEY || undefined;
export const PER_PAGE = 12; // /reviews
