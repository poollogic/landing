import React, { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from './onboarding.js';

// Cloudflare Turnstile: an invisible-unless-needed bot check on the site's forms.
// Loads Cloudflare's script only on pages with a form; renders nothing until a site
// key is set in onboarding.js. onToken gets a fresh token (or null when it expires).
let scriptPromise;
const loadScript = () => {
  scriptPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptPromise;
};

// appearance 'interaction-only' keeps the widget invisible unless Cloudflare needs a challenge.
export default function Turnstile({ onToken, theme = 'auto', appearance = 'always' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;
    let id;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !ref.current || !window.turnstile) return;
      id = window.turnstile.render(ref.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        appearance,
        size: 'flexible',
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(null),
        'error-callback': () => onToken(null),
      });
    }).catch(() => onToken(null));
    return () => {
      cancelled = true;
      if (id !== undefined) window.turnstile?.remove(id);
    };
  }, [onToken, theme, appearance]);
  if (!TURNSTILE_SITE_KEY) return null;
  // Space is reserved only for an always-visible widget; a challenge, if one appears, takes its own.
  return <div ref={ref} className={`overflow-hidden rounded-[10px]${appearance === 'always' ? ' min-h-[65px]' : ''}`} />;
}
