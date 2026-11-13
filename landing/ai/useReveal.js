import { useEffect, useLayoutEffect } from 'react';

// Scroll reveal for /ai-and-automations: [data-reveal] blocks below the fold fade up (mktg-fade-up:
// opacity and transform only) as they come into view. The page arrives pre-rendered and fully
// visible; on hydration, anything already on screen (or above it) is left alone, so nothing
// that's been seen flashes. Reduced motion, or no IntersectionObserver: nothing hides.
// Put data-reveal only on wrappers whose className React never changes (it would drop is-in).
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function useReveal(ref) {
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const later = [...root.querySelectorAll('[data-reveal]')].filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    if (!later.length) return undefined;
    for (const el of later) el.classList.add('is-waiting');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.replace('is-waiting', 'is-in');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -6% 0px' });
    for (const el of later) io.observe(el);
    return () => {
      io.disconnect();
      for (const el of later) el.classList.remove('is-waiting');
    };
  }, [ref]);
}
