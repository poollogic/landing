import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

// The dashboard preview's theme (dark | light), shared by the preview, its
// mobile toggle and every trial link on the homepage. A choice made with the
// toggle is saved per browser and always wins. Until then: desktop starts dark;
// phones and tablets (a touch screen, no hover) follow the device's Light/Dark
// appearance setting, live (e.g. iOS switching automatically at sunset).

const KEY = 'pl-preview-theme';
const APP_URL = 'https://app.poollogic.app';

const media = (q) => {
  try {
    return window.matchMedia(q);
  } catch {
    return null;
  }
};
const isTouchDevice = () => !!media('(hover: none) and (pointer: coarse)')?.matches;
const systemTheme = () => (media('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light');

const saved = () => {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
};
const initial = () => saved() ?? (isTouchDevice() ? systemTheme() : 'dark');

let theme = typeof window === 'undefined' ? 'dark' : initial();
const listeners = new Set();

// Follow the device's appearance while the page is open, until the visitor picks one.
if (typeof window !== 'undefined') {
  media('(prefers-color-scheme: dark)')?.addEventListener?.('change', () => {
    if (saved() || !isTouchDevice()) return;
    const next = systemTheme();
    if (next === theme) return;
    theme = next;
    listeners.forEach((fn) => fn());
  });
}

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
/** Replays the preview's short soften-and-settle on a theme switch (plSwap). */
function playSwap() {
  const el = document.querySelector('.pl-preview');
  if (!el) return;
  el.classList.remove('is-swapping');
  void el.offsetWidth; // restart the animation
  el.classList.add('is-swapping');
  el.addEventListener('animationend', () => el.classList.remove('is-swapping'), { once: true });
}

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
      const vt = document.startViewTransition(() => {
        flushSync(() => setPreviewTheme(next));
        playSwap();
      });
      vt.finished.finally(() => html.classList.remove('pl-vt'));
      return;
    } catch {
      html.classList.remove('pl-vt');
    }
  }
  const scope = document.querySelector('.theme-scope');
  scope?.classList.add('theme-animating');
  setPreviewTheme(next);
  playSwap();
  window.setTimeout(() => scope?.classList.remove('theme-animating'), 320);
}
