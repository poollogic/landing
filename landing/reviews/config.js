// Homepage reviews (landing/reviews/, pages/reviews.jsx, pages/review-write.jsx): off unless the build
// sets VITE_REVIEWS=1. Reviews live in the app's Supabase project (the web app's migration
// 20270128120000_homepage_reviews.sql), read and written with the public anon key and, to write, the
// member's own sign-in. Only the anon key ever belongs here, never the service role key.
//
// For local work without a database, VITE_REVIEWS_MOCK=1 (dev server only) shows made-up reviews from
// mock.js instead; the write page then says it needs a database.

export const REVIEWS_ON = import.meta.env.VITE_REVIEWS === '1';
export const REVIEWS_MOCK = REVIEWS_ON && import.meta.env.DEV && import.meta.env.VITE_REVIEWS_MOCK === '1';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const APP_URL = 'https://app.poollogic.app';
export const PER_PAGE = 12; // /reviews
