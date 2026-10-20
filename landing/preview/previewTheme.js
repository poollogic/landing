import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

// The dashboard preview's theme (dark | light), shared by the preview, its
// mobile toggle and every trial link on /landing. Persisted per browser;
// falls back to dark whenever storage is unavailable.

const KEY = 'pl-preview-theme';
const APP_URL = 'https://app.poollogic.app';

const read = () => {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'dark';
  } catch {
    return 'dark';
  }
};

let theme = typeof window === 'undefined' ? 'dark' : read();
const listeners = new Set();

export const getPreviewTheme = () => theme;

export function setPreviewTheme(next) {
  if (next === theme) return;
  theme = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const usePreviewTheme = () => useSyncExternalStore(subscribe, getPreviewTheme, () => 'dark');

/** Sign-up / trial link carrying the chosen theme; the app reads ?theme= on sign-up. */
export const trialHref = (t) => `${APP_URL}/?theme=${t}`;

/**
 * Switch the theme with a ~300ms crossfade of the preview only: the View
 * Transitions API where supported (the page itself is told not to animate),
 * CSS colour transitions otherwise, and instantly under reduced motion.
 */
export function transitionPreviewTheme(next) {
  if (next === theme) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    setPreviewTheme(next);
    return;
  }
  const html = document.documentElement;
  if (typeof document.startViewTransition === 'function') {
    html.classList.add('pl-vt');
    try {
      const vt = document.startViewTransition(() => flushSync(() => setPreviewTheme(next)));
      vt.finished.finally(() => html.classList.remove('pl-vt'));
      return;
    } catch {
      html.classList.remove('pl-vt');
    }
  }
  const scope = document.querySelector('.theme-scope');
  scope?.classList.add('theme-animating');
  setPreviewTheme(next);
  window.setTimeout(() => scope?.classList.remove('theme-animating'), 320);
}
