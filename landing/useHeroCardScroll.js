import { useEffect } from 'react';

// Below lg: as the page scrolls past the hero's dashboard card (HeroPhoneDash.jsx), the list under its
// pinned header moves up until its last row ("Next billing") sits at the card's foot, with no empty
// space under it (at most MAX_TRAVEL px), so the routes and money rows come into view. Linked to the
// page scroll (it reverses on the way back up) and eased with smoothstep:
//   progress = clamp((0.60 × window height − card top) / (0.50 × window height), 0, 1)
// so nothing moves until the card's top passes 60% of the window, and it's done at 10%.
//
// Where the browser supports scroll-driven animations (Safari 26+, Chrome 115+), the motion is a CSS
// animation on the card's view timeline (hero.css) that runs on the compositor with the scroll, so it
// stays smooth on iPhone; this hook only works out where in that timeline it starts and ends.
// Elsewhere a rAF-throttled passive scroll listener sets the transform, only while the card is on
// screen. Off under reduced motion either way: the list stays where it starts.

const MAX_TRAVEL = 200;
const START = 0.6; // card's top at 60% of the window: begin
const END = 0.1; // …at 10%: done
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
      const top = card.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const y = Math.round(travel * ease(clamp01((START * vh - top) / ((START - END) * vh))) * 10) / 10;
      if (y === shown) return;
      shown = y;
      list.style.transform = y ? `translateY(${-y}px)` : '';
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    // The view timeline runs from the card's top at the window's bottom (0%) to its bottom at the
    // window's top (100%): the card's top is at START of the window at (1 − START) × height of it.
    const measure = () => {
      // How far the list runs past the card's foot, in layout sizes (its transform doesn't count). From
      // the list's offset in the dashboard, which includes the first section's margin collapsing through it.
      travel = Math.min(MAX_TRAVEL, Math.max(0, list.offsetTop + list.offsetHeight - dash.clientHeight));
      shown = -1;
      if (!native) { update(); return; }
      const vh = window.innerHeight;
      const span = vh + card.getBoundingClientRect().height;
      list.style.setProperty('--hd-travel', `${travel}px`);
      list.style.setProperty('--hd-from', `${(((1 - START) * vh) / span) * 100}%`);
      list.style.setProperty('--hd-to', `${(((1 - END) * vh) / span) * 100}%`);
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
      ['--hd-travel', '--hd-from', '--hd-to'].forEach((p) => list.style.removeProperty(p));
      list.style.transform = '';
    };
  }, [holderRef, enabled]);
}
