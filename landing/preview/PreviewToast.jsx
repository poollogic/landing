import React, { useLayoutEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { usePreviewTheme } from './previewTheme.js';
import { SCROLL_FX_QUERY } from '../useHeroScrollFx.js';

// The billing-run toast, floating over the dashboard preview's top-right
// corner. A child of .mockup-holder, not of the preview (which clips), and
// themed from the same state as the preview's theme toggle.
//
// On desktop (≥1024px, no reduced motion) it waits off to the right until
// the dashboard's top is within the top 25% of the window, then slides in
// once while its figures count up from 0. Elsewhere it shows as it always has.

const INVOICES = 163;
const AMOUNT = 26409;
const COUNT_MS = 900;
const FINAL = `${INVOICES} invoices sent · $${AMOUNT.toLocaleString('en-US')}`;

export default function PreviewToast() {
  const theme = usePreviewTheme();
  const ref = useRef(null);
  const nameRef = useRef(null);
  const amountRef = useRef(null);
  const [phase, setPhase] = useState('static'); // 'static' | 'waiting' | 'in'
  const [k, setK] = useState(1); // count-up progress, 0–1
  const [minWidths, setMinWidths] = useState(null);

  useLayoutEffect(() => {
    const mockup = ref.current?.closest('.hero-mockup');
    if (!mockup || !window.matchMedia || !('IntersectionObserver' in window)) return undefined;
    const mq = window.matchMedia(SCROLL_FX_QUERY);
    let io = null;
    let raf = 0;
    let fired = false;

    const enter = () => {
      fired = true;
      io.disconnect();
      io = null;
      // The final strings are still showing (the card is hidden): their exact
      // widths, with fonts loaded, hold the card's size through the count.
      const width = (el) => parseFloat(getComputedStyle(el).width);
      setMinWidths([width(nameRef.current), width(amountRef.current)]);
      setK(0);
      setPhase('in');
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / COUNT_MS);
        setK(1 - (1 - p) ** 3); // ease-out cubic
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const onChange = () => {
      if (fired) return;
      if (mq.matches && !io) {
        setPhase('waiting');
        // The root is the top 25% of the window.
        io = new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) enter();
        }, { rootMargin: '0px 0px -75% 0px' });
        io.observe(mockup);
      } else if (!mq.matches && io) {
        io.disconnect();
        io = null;
        setPhase('static');
      }
    };

    onChange();
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollEntry = phase !== 'static';
  return (
    <div
      ref={ref}
      className={`pl-toast${scrollEntry ? ' is-scroll-entry' : ''}${phase === 'in' ? ' is-in' : ''}`}
      data-theme={theme}
      role="status"
    >
      <span className="pl-toast-check" aria-hidden="true"><Check size={12} strokeWidth={3.2} /></span>
      <div className="pl-toast-body">
        {/* Screen readers get the final figures, never the count. */}
        <span className="sr-only">{FINAL}</span>
        <div className="pl-toast-title" aria-hidden="true">
          <span ref={nameRef} className="pl-toast-name" style={minWidths ? { minWidth: minWidths[0] } : undefined}>
            {Math.round(INVOICES * k)} invoices sent
          </span>
          <span className="pl-toast-sep"> · </span>
          <span ref={amountRef} className="pl-toast-amount" style={minWidths ? { minWidth: minWidths[1] } : undefined}>
            ${Math.round(AMOUNT * k).toLocaleString('en-US')}
          </span>
        </div>
        <div className="pl-toast-detail">
          <span>Recurring billing run</span> · <span>just now</span>
        </div>
      </div>
    </div>
  );
}
