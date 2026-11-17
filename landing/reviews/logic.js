// The reviews' plain logic: no React, no browser globals at import, no import.meta.env, so Node's test
// runner loads it as is (logic.test.mjs, in npm test). The components and data.js take it from here.

/** The review popup's address. Any link to it opens the popup instead (openReview.js). */
export const WRITE_PATH = /^\/reviews\/write\/?$/;
export const isWritePath = (pathname) => WRITE_PATH.test(pathname);

/** The 16×16 star the cards and the rating picker draw. */
export const STAR = 'M8 1.2l2.06 4.18 4.6.67-3.33 3.25.79 4.59L8 11.72l-4.12 2.17.79-4.59L1.34 6.05l4.6-.67z';

export const MESSAGES = {
  noAccount: 'That sign-in isn’t linked to a Poolnautics company, so it can’t post a review. Use the account you sign in to Poolnautics with.',
  officeOnly: 'Reviews are written from an office login (owner, admin or manager). Technician logins can’t post one.',
  oauthFailed: 'That sign-in didn’t work. Try again, or use your email and password.',
  oauthCancelled: 'Sign-in was cancelled.',
  unreachable: 'We couldn’t reach Poolnautics. Check your connection and try again.',
};

/** The link only if it's a well-formed https address (the database checks it too). A bare domain stays as typed. */
export function safeHttps(url) {
  if (typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' || !u.hostname.includes('.')) return null;
    return u.pathname === '/' && !u.search && !u.hash ? u.origin : u.href;
  } catch {
    return null;
  }
}

/** Phone-only logins (the web app's canUseWebApp, src/lib/roles.ts). The database refuses them too. */
export const isPhoneOnly = (role) => ['technician', 'repair_tech'].includes(String(role ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_'));

/** A refusal from Google, Apple or Supabase on the way back (search and hash params), in plain words; null if none. */
export function oauthErrorMessage(search = '', hash = '') {
  const params = new URLSearchParams(search);
  new URLSearchParams(hash.replace(/^#/, '')).forEach((v, k) => params.set(k, v));
  if (!params.get('error')) return null;
  const raw = `${params.get('error')} ${params.get('error_code') ?? ''} ${params.get('error_description') ?? ''}`;
  if (/signup_disabled|signups? not allowed/i.test(raw)) return MESSAGES.noAccount;
  if (/access_denied/i.test(raw) && !params.get('error_description')) return MESSAGES.oauthCancelled;
  return MESSAGES.oauthFailed;
}

/** The address with what a sign-in left on it removed (?review, ?code, ?rid, errors, a token hash); /reviews/write becomes /reviews. */
export function cleanedAddress(href) {
  const url = new URL(href);
  ['review', 'code', 'rid', 'error', 'error_code', 'error_description', 'state'].forEach((k) => url.searchParams.delete(k));
  if (/error|access_token/.test(url.hash)) url.hash = '';
  const path = isWritePath(url.pathname) ? '/reviews' : url.pathname;
  return `${path}${url.search}${url.hash}`;
}

/**
 * Should this click open the popup? Only a plain left click, on a same-site link to /reviews/write that
 * opens in this tab. A modifier key, a new tab or window, or a download is left to the browser.
 */
export function isPopupClick({ button, metaKey, ctrlKey, shiftKey, altKey, defaultPrevented }, link, origin) {
  if (defaultPrevented || button !== 0 || metaKey || ctrlKey || shiftKey || altKey || !link) return false;
  if ((link.target && link.target !== '_self') || link.download) return false;
  try {
    const url = new URL(link.href, origin);
    return url.origin === origin && isWritePath(url.pathname);
  } catch {
    return false;
  }
}

const rtf = typeof Intl !== 'undefined' ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;
/** "3 days ago", from an ISO date. */
export function ago(iso, now = Date.now()) {
  let v = (new Date(iso).getTime() - now) / 1000;
  if (Number.isNaN(v)) return '';
  const steps = [[60, 'second'], [60, 'minute'], [24, 'hour'], [7, 'day'], [4.35, 'week'], [12, 'month'], [Infinity, 'year']];
  for (const [size, unit] of steps) {
    if (Math.abs(v) < size) return rtf ? rtf.format(Math.round(v), unit) : '';
    v /= size;
  }
  return '';
}

/** "1-12/37" (PostgREST's Content-Range) → 37; null when it doesn't say. */
export function totalFromContentRange(header) {
  const m = /\/(\d+)$/.exec(header ?? '');
  return m ? Number(m[1]) : null;
}
