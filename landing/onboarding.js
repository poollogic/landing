import { trialHref } from './preview/previewTheme.js';

// How new companies get in: one switch for every sign-up button on the site.
//   'reserve'  the buttons say "Reserve your spot" and open /reserve (every
//              account starts with a white-glove onboarding call)
//   'open'     the buttons start the 30-day free trial in the app, as before
export const ONBOARDING = 'reserve';
export const isReserving = ONBOARDING === 'reserve';

// Where a sign-up button goes.
export const ctaHref = (theme) => (isReserving ? '/reserve' : trialHref(theme));

// Cloudflare Turnstile site key (public; the secret lives in Cloudflare). Empty: no widget.
export const TURNSTILE_SITE_KEY = '0x4AAAAAAFhvxYHZf3cQ9_mJ';
