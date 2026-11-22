import { useEffect, useSyncExternalStore } from 'react';

// One clock for /pool-service-billing's moving pictures, so they never drift apart: the hero's billing
// calendar takes a day per tick, and the month belt under it (MonthBelt.jsx) a step per second tick,
// in the same render. It ticks every 1.6s while either picture is on screen and the tab is showing,
// and stops otherwise (each one registers itself with useBillingClock). With reduced motion it never
// ticks; the pictures hold still instead (useStill). The server and the browser's first render both
// read tick 0, so the pre-rendered markup matches.

export const STEP_MS = 1600;

let tick = 0;
let timer = 0;
const listeners = new Set();
const shown = new Map(); // element -> on screen
let io = null;
let still = null;
let watching = false;

const emit = () => listeners.forEach((fn) => fn());

function sync() {
  const run = !still?.matches && !document.hidden && [...shown.values()].some(Boolean);
  if (run && !timer) timer = window.setInterval(() => { tick += 1; emit(); }, STEP_MS);
  else if (!run && timer) { window.clearInterval(timer); timer = 0; }
}

function watch() {
  if (watching) return;
  watching = true;
  still = window.matchMedia('(prefers-reduced-motion: reduce)');
  still.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  io = typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (shown.has(e.target)) shown.set(e.target, e.isIntersecting); });
      sync();
    });
}

function unwatch() {
  if (!watching || shown.size) return;
  watching = false;
  still.removeEventListener('change', sync);
  document.removeEventListener('visibilitychange', sync);
  io?.disconnect();
  io = null;
  sync();
}

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

/** The shared tick (0 on the server and at first render), counting while `ref`'s element is on screen. */
export function useBillingClock(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    watch();
    shown.set(el, !io); // without IntersectionObserver, count it as on screen
    io?.observe(el);
    sync();
    return () => {
      io?.unobserve(el);
      shown.delete(el);
      sync();
      unwatch();
    };
  }, [ref]);
  return useSyncExternalStore(subscribe, () => tick, () => 0);
}

const stillQuery = '(prefers-reduced-motion: reduce)';
/** True with reduced motion (false on the server and at first render, which then corrects itself). */
export function useStill() {
  return useSyncExternalStore(
    (fn) => { const mq = window.matchMedia(stillQuery); mq.addEventListener('change', fn); return () => mq.removeEventListener('change', fn); },
    () => window.matchMedia(stillQuery).matches,
    () => false,
  );
}
