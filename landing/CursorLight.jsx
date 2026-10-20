import React, { useEffect, useRef } from 'react';

// Soft light that follows the cursor across the top of the page and fades out
// above the dashboard mockup (.mockup-holder). Styles live in landing/hero.css,
// which also hides it on touch devices and under reduced motion.

const CursorLight = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return undefined;

    const root = document.documentElement;
    let tx = 0, ty = 0, x = 0, y = 0, k = 0;
    let inside = false;
    let seen = false;
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) { x = tx; y = ty; seen = true; } // start at the cursor, not mid-screen
      inside = true;
    };
    const onLeave = () => { inside = false; };

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty('--lx', `${x}px`);
      el.style.setProperty('--ly', `${y}px`);

      let target = 0;
      const holder = document.querySelector('.mockup-holder');
      if (inside && holder) {
        const fadeEnd = holder.getBoundingClientRect().top + window.scrollY - 170;
        const fadeStart = fadeEnd - 240;
        const pageY = y + window.scrollY;
        target = Math.min(1, Math.max(0, 1 - (pageY - fadeStart) / (fadeEnd - fadeStart)));
      }
      k += (target - k) * 0.1;
      el.style.opacity = k.toFixed(3);

      // Never on the dashboard: the light stops at the preview's top edge.
      const mask = holder
        ? (() => {
          const t = holder.getBoundingClientRect().top;
          return `linear-gradient(to bottom, #000 ${t - 60}px, transparent ${t}px)`;
        })()
        : 'none';
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-light" aria-hidden="true" />;
};

export default CursorLight;
