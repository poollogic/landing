import useBrowserLayoutEffect from './useBrowserLayoutEffect.js';

// The desktop hero's scroll-linked motion (≥1024px, without reduced motion). The page scrolls
// normally; on top of that, from one handler:
//  - parallax: the hero copy rises 1.3x as fast as the page over the first 800px (--hero-shift,
//    which hero.css turns into its transform);
//  - the laptop (laptop.css): the dashboard straightens from a 10deg tilt at 93% over the first
//    460px, then drops its transform; the keyboard deck flattens from 62 to 83deg as it rises, its
//    reflection sweeping across it.
// One passive scroll listener, attached only while the hero is on screen, schedules one
// requestAnimationFrame. The frame reads only scrollY (offsets are measured on resize) and writes only
// values that changed: transforms (the copy's through its custom property), and will-change while
// something moves. Below 1024px, with reduced motion or without JS none of it runs, and the CSS draws
// the resting state: the copy in place, the dashboard flat, the deck at 72deg.

export const SCROLL_FX_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const PARALLAX = 0.3; // the copy's extra speed
const PARALLAX_PX = 800; // ...over this much scrolling
const TILT_PX = 460; // the dashboard is straight after this much scrolling
const IDLE_MS = 200; // will-change comes off once nothing has moved for this long
const DECK_REACH = 320; // how far above its box the deck can still be seen

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** One element's styles: writes a value only when it changes; '' removes it. */
const writer = (el) => {
  const last = {};
  return (prop, value) => {
    if (last[prop] === value) return false;
    last[prop] = value;
    if (prop.startsWith('--')) {
      if (value) el.style.setProperty(prop, value);
      else el.style.removeProperty(prop);
    } else {
      el.style[prop] = value;
    }
    return true;
  };
};

export default function useHeroScrollFx(heroRef) {
  useBrowserLayoutEffect(() => {
    const hero = heroRef.current;
    const copy = hero?.querySelector('.hero-copy');
    const holder = hero?.querySelector('.mockup-holder');
    const deckBox = hero?.querySelector('.lt-deck-box');
    const deck = deckBox?.querySelector('.lt-deck');
    const sheen = deckBox?.querySelector('.lt-sheen');
    if (!copy || !holder || !deck || !sheen || !window.matchMedia) return undefined;

    const mq = window.matchMedia(SCROLL_FX_QUERY);
    let on = false;
    let raf = 0;
    let deckTop = 0; // the deck's box, in document coordinates
    let vh = 0;
    let io = null;
    let ro = null;
    let listening = false;
    let idle = 0;
    let set = null;

    // The only layout reads: on enable, resize and size changes.
    const measure = () => {
      deckTop = deckBox.getBoundingClientRect().top + window.scrollY;
      vh = window.innerHeight;
    };

    const rest = () => {
      idle = 0;
      set.copy('willChange', '');
      set.holder('willChange', '');
      set.deck('willChange', '');
      set.sheen('willChange', '');
    };

    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      let moved = false;

      // Parallax: nothing at the top, so the copy has no transform there.
      const shift = Math.round(-PARALLAX * Math.min(Math.max(y, 0), PARALLAX_PX) * 10) / 10;
      if (set.copy('--hero-shift', shift ? `translate3d(0, ${shift}px, 0)` : '')) {
        set.copy('willChange', shift ? 'transform' : '');
        moved = true;
      }

      // The dashboard's tilt; no transform once straight.
      const p = clamp01(y / TILT_PX);
      const e = 1 - (1 - p) ** 3;
      const tilt = e >= 1 ? '' : `rotateX(${((1 - e) * 10).toFixed(3)}deg) scale(${(0.93 + 0.07 * e).toFixed(4)})`;
      if (set.holder('transform', tilt)) {
        set.holder('willChange', tilt ? 'transform' : '');
        moved = true;
      }

      // The deck and its reflection, only while on screen (or about to be).
      const top = deckTop - y;
      if (top < vh + 100 && top > -DECK_REACH) {
        const t = clamp01((top - 0.08 * vh) / (0.92 * vh));
        if (set.deck('transform', `rotateX(${(83 - 21 * t ** 0.85).toFixed(2)}deg)`)) {
          // The band (on an element 2.2x the deck) travels from 0.75 of the deck's width (t = 0,
          // near the top) to 0.25 (t = 1, low on screen).
          set.sheen('transform', `translateX(${(-((0.45 + 0.3 * t) / 2.2) * 100).toFixed(2)}%)`);
          set.deck('willChange', 'transform');
          set.sheen('willChange', 'transform');
          moved = true;
        }
      }

      if (moved) {
        clearTimeout(idle);
        idle = setTimeout(rest, IDLE_MS);
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { measure(); schedule(); };
    const listen = (yes) => {
      if (yes === listening) return;
      listening = yes;
      if (yes) window.addEventListener('scroll', schedule, { passive: true });
      else window.removeEventListener('scroll', schedule);
    };

    const enable = () => {
      on = true;
      set = { copy: writer(copy), holder: writer(holder), deck: writer(deck), sheen: writer(sheen) };
      // The pre-rendered page's stand-in until now (landing/firstPaint.js, hero.css).
      document.documentElement.classList.remove('lt-pending');
      measure();
      frame();
      // Scroll is only listened to while the hero is on screen; one more frame as it leaves or comes
      // back, so everything lands where the scroll position says.
      io = new IntersectionObserver(([entry]) => { listen(entry.isIntersecting); schedule(); });
      io.observe(hero);
      window.addEventListener('resize', onResize);
      ro = new ResizeObserver(onResize); // the deck's offset follows the copy's height and font loading
      ro.observe(hero);
    };
    const disable = () => {
      on = false;
      cancelAnimationFrame(raf);
      raf = 0;
      clearTimeout(idle);
      listen(false);
      io?.disconnect();
      io = null;
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      ro = null;
      copy.style.removeProperty('--hero-shift');
      for (const el of [copy, holder, deck, sheen]) {
        el.style.transform = '';
        el.style.willChange = '';
      }
    };
    const onChange = () => { if (mq.matches && !on) enable(); else if (!mq.matches && on) disable(); };

    onChange();
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      if (on) disable();
    };
  }, [heroRef]);
}
