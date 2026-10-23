import { useEffect } from 'react';

// Phones: as the page scrolls past the hero's iPhone, the dashboard inside it scrolls
// just far enough to bring the "Cost per visit" chart fully into view, then stops.
// Linked to the page scroll (reverses on the way back up), eased in and out, between
// the phone's top reaching START and END of the window's height.
//
// Where the browser supports scroll-driven animations (Safari 26+, Chrome 115+), the
// motion is a CSS animation on a view timeline (hero.css) that runs on the compositor
// alongside the scroll, so it stays smooth on iPhone. This hook only measures the
// distance and range and hands them to CSS as custom properties. Elsewhere it falls
// back to a transform updated from a rAF-throttled scroll listener that runs only
// while the phone is on screen. Off under reduced motion either way.

const START = 0.6; // phone's top at 60% of the window: begin
const END = 0.05; // …at 5%: done
const ease = (t) => t * t * (3 - 2 * t); // smoothstep
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function usePhonePreviewScroll(holderRef, enabled) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const holder = holderRef.current;
    const phone = holder?.querySelector('.hero-phone');
    const frame = holder?.querySelector('.pl-frame');
    const main = holder?.querySelector('.pl-main');
    const card = holder?.querySelector('.pl-charts > .pl-card:nth-child(2)'); // Cost per visit
    if (!phone || !frame || !main || !card) return undefined;

    const native = window.CSS?.supports?.('animation-timeline: view()');
    let travel = 0;
    let shown = -1;
    let raf = 0;
    let listening = false;

    // How far the dashboard moves, in .pl-frame's own (unzoomed) pixels: until the
    // card's foot sits just above the frame's bottom fade.
    const measure = () => {
      main.style.animation = 'none'; // measure the dashboard at rest
      main.style.transform = '';
      shown = -1;
      const frameH = parseFloat(getComputedStyle(frame).height); // CSS px, before zoom
      const frameRect = frame.getBoundingClientRect();
      const scale = frameRect.height / frameH || 1; // on-screen px per frame px
      const cardBottom = (card.getBoundingClientRect().bottom - frameRect.top) / scale;
      travel = Math.max(0, Math.round(cardBottom + 12 - frameH * 0.86));
      main.style.animation = '';
      if (native) {
        // The view timeline runs from the phone's top at the window's bottom (0%) to
        // its bottom at the window's top (100%).
        const vh = window.innerHeight;
        const span = vh + phone.getBoundingClientRect().height;
        main.style.setProperty('--pps-travel', `${travel}px`);
        main.style.setProperty('--pps-from', `${(((1 - START) * vh) / span) * 100}%`);
        main.style.setProperty('--pps-to', `${(((1 - END) * vh) / span) * 100}%`);
        main.classList.add('is-scroll-linked');
      } else {
        update();
      }
    };

    const update = () => {
      raf = 0;
      const top = phone.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const y = Math.round(travel * ease(clamp01((START * vh - top) / ((START - END) * vh))) * 10) / 10;
      if (y === shown) return;
      shown = y;
      main.style.transform = y ? `translateY(${-y}px)` : '';
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const io = native ? null : new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        window.addEventListener('scroll', onScroll, { passive: true });
        listening = true;
        onScroll();
      } else if (!entry.isIntersecting && listening) {
        window.removeEventListener('scroll', onScroll);
        listening = false;
      }
    });
    io?.observe(phone);
    // Skip resize events that changed nothing (iOS sends plenty while scrolling).
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const onResize = () => {
      if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 1) return;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      measure();
    };
    window.addEventListener('resize', onResize);
    measure();
    document.fonts?.ready.then(measure);

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      main.classList.remove('is-scroll-linked');
      ['--pps-travel', '--pps-from', '--pps-to'].forEach((p) => main.style.removeProperty(p));
      main.style.transform = '';
    };
  }, [holderRef, enabled]);
}
