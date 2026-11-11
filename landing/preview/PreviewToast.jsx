import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { usePreviewTheme } from './previewTheme.js';
import { TOASTS } from './data.js';

// The toasts in the dashboard preview's top-right corner. A child of .mockup-holder, not of the
// preview (which clips), and themed from the same state as the preview.
//
// The first (the billing run) drops in 1s after the page loads and stays. The visitor's first scroll
// (past 60px, with the dashboard in view) moves on to the next, then one every 3.6s, only while the
// dashboard is in view. It stops on the last and leaves it showing: no loop, no replay. With reduced
// motion the first shows from the start and nothing plays.

const FIRST_AFTER_LOAD_MS = 1000;
const STEP_MS = 3600;
const SWAP_MS = 320; // after the exit starts: swap the content and drop the next one in
const FIRST_MIN_MS = 1200; // a scroll that comes before the first is in still lets it be read
const SCROLLED_PX = 60;

export default function PreviewToast() {
  const theme = usePreviewTheme();
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('hidden'); // 'hidden' | 'in' | 'out' | 'static'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('static');
      return undefined;
    }
    const mockup = ref.current?.closest('.hero-mockup');
    const timers = new Set();
    const later = (fn, ms) => {
      const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
      timers.add(t);
      return t;
    };
    let i = 0;
    let shownAt = 0; // when the current toast dropped in
    let scrolled = false;
    let inView = false;
    let step = 0;

    const advance = () => {
      step = 0;
      setPhase('out');
      later(() => {
        i += 1;
        setIndex(i);
        setPhase('in');
        shownAt = performance.now();
        schedule();
      }, SWAP_MS);
    };
    // Waits the toast's turn, only while the dashboard is in view; leaving it starts the wait over.
    function schedule() {
      if (step || !shownAt || !scrolled || !inView || i >= TOASTS.length - 1) return;
      const wait = i === 0 ? Math.max(0, shownAt + FIRST_MIN_MS - performance.now()) : STEP_MS;
      step = later(advance, wait);
    }
    const pause = () => {
      if (!step) return;
      clearTimeout(step);
      timers.delete(step);
      step = 0;
    };

    const showFirst = () => {
      setPhase('in');
      shownAt = performance.now();
      schedule();
    };
    const nav = performance.getEntriesByType?.('navigation')[0];
    const onLoad = () => later(showFirst, FIRST_AFTER_LOAD_MS);
    if (nav?.loadEventEnd > 0) later(showFirst, Math.max(0, nav.loadEventEnd + FIRST_AFTER_LOAD_MS - performance.now()));
    else window.addEventListener('load', onLoad, { once: true });

    const onScroll = () => {
      if (scrolled || window.scrollY <= SCROLLED_PX || !inView) return;
      scrolled = true;
      window.removeEventListener('scroll', onScroll);
      schedule();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = mockup && 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        if (inView) { onScroll(); schedule(); } else pause();
      })
      : null;
    if (io) io.observe(mockup);
    else inView = true;

    return () => {
      timers.forEach(clearTimeout);
      io?.disconnect();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const t = TOASTS[index];
  return (
    <div
      key={index}
      ref={ref}
      className={`pl-toast is-${phase}`}
      data-theme={theme}
      aria-hidden="true"
    >
      <span className="pl-toast-check"><Check size={12} strokeWidth={3.2} /></span>
      <div className="pl-toast-body">
        <div className="pl-toast-title">
          <span className="pl-toast-name">{t.title}</span>
          {t.meta && <span className="pl-toast-amount"> · {t.meta}</span>}
        </div>
        {t.detail && <div className="pl-toast-detail">{t.detail}</div>}
      </div>
    </div>
  );
}
