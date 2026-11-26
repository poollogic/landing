import { useEffect } from 'react';

// Phones (720px and under): as the page scrolls past the hero’s dashboard card (HeroPhoneDash.jsx), the list under its
// pinned header moves up until its last row ("Next billing") sits at the card's foot, with no empty
// space under it (at most MAX_TRAVEL px), so the routes and money rows come into view. Linked to the
// page scroll (it reverses on the way back up) and eased with smoothstep. Nothing moves until the whole
// card is on screen (its foot at the window's foot); it's done when the card's top reaches the window's
// top. That's the view timeline's `contain` range (hero.css: contain 0% to contain 100%).
//
// Where the browser supports scroll-driven animations (Safari 26+, Chrome 115+), the motion is a CSS
// animation on the card's view timeline (hero.css) that runs on the compositor with the scroll, so it
// stays smooth on iPhone; this hook only measures how far the list travels.
// Elsewhere a rAF-throttled passive scroll listener sets the transform, only while the card is on
// screen. Off under reduced motion either way: the list stays where it starts.

const MAX_TRAVEL = 200;
const ease = (t) => t * t * (3 - 2 * t); // smoothstep (hero.css: cubic-bezier(1/3, 0, 2/3, 1))
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function useHeroCardScroll(holderRef, enabled) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const card = holderRef.current?.querySelector('.hero-phone');
    const list = card?.querySelector('.hd-list');
    const dash = card?.querySelector('.hero-dash');
    if (!card || !list || !dash) return undefined;

    const native = window.CSS?.supports?.('animation-timeline: view()');
    let travel = 0;
    let shown = -1;
    let raf = 0;
    let listening = false;

    const update = () => {
      raf = 0;
      const { top, height } = card.getBoundingClientRect();
      const vh = window.innerHeight;
      // `contain`, as CSS has it: from the card fully in view to its first edge leaving. For a card
      // shorter than the window, its top from (window height − card height) down to 0; for a taller one
      // (no phone today), from 0 to (window height − card height).
      const start = Math.max(0, vh - height);
      const end = Math.min(0, vh - height);
      const progress = start === end ? (top <= start ? 1 : 0) : clamp01((start - top) / (start - end));
      const y = Math.round(travel * ease(progress) * 10) / 10;
      if (y === shown) return;
      shown = y;
      list.style.transform = y ? `translateY(${-y}px)` : '';
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const measure = () => {
      // How far the list runs past the card's foot, in layout sizes (its transform doesn't count). From
      // the list's offset in the dashboard, which includes the first section's margin collapsing through it.
      travel = Math.min(MAX_TRAVEL, Math.max(0, list.offsetTop + list.offsetHeight - dash.clientHeight));
      shown = -1;
      if (!native) { update(); return; }
      list.style.setProperty('--hd-travel', `${travel}px`);
      list.classList.add('is-scroll-linked');
    };

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
    io?.observe(card);
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
    // First measure a frame after mount, once the page is laid out (not forcing layout mid-load).
    const first = requestAnimationFrame(measure);

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(first);
      list.classList.remove('is-scroll-linked');
      list.style.removeProperty('--hd-travel');
      list.style.transform = '';
    };
  }, [holderRef, enabled]);
}
