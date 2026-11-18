import useBrowserLayoutEffect from './useBrowserLayoutEffect.js';

// Desktop (≥1024px): the dashboard runs off the window's right edge (hero.css, "Desktop"), so its
// toast sits near the right edge of the part that's on screen. Its left edge, in the dashboard's own
// pixels (MOCKUP_WIDTH wide, before the hero scales it): min(855, visible width / scale − 270), where
// the visible width runs from the dashboard's left edge to the window's right edge. Written to
// --toast-left on .hero-mockup; measured once layout is done and again whenever the window or the
// dashboard changes size. Long messages run off the screen edge, as designed. Below 1024px it does
// nothing and the toast keeps its own place (preview.css).

export const MOCKUP_WIDTH = 1062;
const QUERY = '(min-width: 1024px)';
const MAX_LEFT = 855;
const FROM_EDGE = 270;

export default function useHeroToastAnchor(mockupRef) {
  useBrowserLayoutEffect(() => {
    const mockup = mockupRef.current;
    if (!mockup || !window.matchMedia || typeof ResizeObserver === 'undefined') return undefined;
    const mq = window.matchMedia(QUERY);

    const measure = () => {
      if (!mq.matches) { mockup.style.removeProperty('--toast-left'); return; }
      const box = mockup.getBoundingClientRect();
      const scale = box.width / MOCKUP_WIDTH;
      if (!scale) return;
      const visible = document.documentElement.clientWidth - box.left;
      mockup.style.setProperty('--toast-left', `${Math.round(Math.min(MAX_LEFT, visible / scale - FROM_EDGE))}px`);
    };

    // The dashboard's size follows the window's height; its left edge, the window's width.
    const ro = new ResizeObserver(measure);
    ro.observe(mockup);
    ro.observe(document.documentElement);
    mq.addEventListener('change', measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', measure);
      mockup.style.removeProperty('--toast-left');
    };
  }, [mockupRef]);
}
