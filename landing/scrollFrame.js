// The homepage's one scroll listener, shared by its scroll-linked sections (useHeroScrollFx.js,
// DaySection.jsx). Passive, and throttled to one requestAnimationFrame: each frame reads scrollY once
// and hands it to every subscriber, which must only write (no layout reads; offsets are measured on
// resize). Sections subscribe while they're on screen, so with none on screen there's no listener.

const subs = new Set();
let raf = 0;
let attached = false;

const run = () => {
  raf = 0;
  const y = window.scrollY;
  subs.forEach((fn) => fn(y));
};
const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };

/** Calls fn(scrollY) once per frame in which the page scrolled. Returns the unsubscribe. */
export function onScrollFrame(fn) {
  subs.add(fn);
  if (!attached) {
    attached = true;
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  return () => {
    subs.delete(fn);
    if (subs.size || !attached) return;
    attached = false;
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(raf);
    raf = 0;
  };
}
