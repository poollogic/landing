import useBrowserLayoutEffect from './useBrowserLayoutEffect.js';

// Desktop hero scroll effects. At ≥1024px without reduced motion it adds .has-hero-fx to the page
// (styles at the end of hero.css) and drives, from native scrolling:
//  - the headline block (.hero-copy), fixed: fades and shrinks to 85%;
//  - the nav, rays and headline, held in place until the dashboard reaches the top of the viewport,
//    then carried off with it;
//  - the laptop (laptop.css): the dashboard straightens from a 10deg tilt at 93% over the first
//    460px, and the keyboard deck flattens as it rises, its reflection sweeping across it.
// One passive scroll listener, attached only while the hero is on screen, schedules one
// requestAnimationFrame; the frame reads only scrollY (offsets are measured on resize), writes only
// transform and opacity, and skips any value that hasn't changed. The headline's fade eases, so the
// frame repeats until it settles. will-change is on only while something moves, and the dashboard
// drops its transform once straight. Below 1024px or with reduced motion none of this runs.

export const SCROLL_FX_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const EASE = 0.12; // share of the remaining distance covered each frame
const TILT_PX = 460; // the dashboard is straight after this much scrolling
const IDLE_MS = 200; // will-change comes off once nothing has moved for this long
const DECK_REACH = 320; // how far above its box the deck can still be seen

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const opacityAt = (y) => (1 - clamp01((y - 20) / 440)) ** 1.6;
const scaleAt = (y) => 1 - 0.15 * clamp01((y - 20) / 600);

/** Writes a style property only when its value changes. */
const writer = (el) => {
  const last = {};
  return (prop, value) => {
    if (last[prop] === value) return;
    last[prop] = value;
    el.style[prop] = value;
  };
};

export default function useHeroScrollFx(heroRef) {
  useBrowserLayoutEffect(() => {
    const hero = heroRef.current;
    const root = hero?.closest('.mktg');
    const nav = root?.querySelector('.lp-nav');
    const decor = hero?.querySelector('.hero-decor');
    const container = hero?.querySelector(':scope > .container');
    const copy = hero?.querySelector('.hero-copy');
    const mockup = hero?.querySelector('.hero-mockup');
    if (!nav || !decor || !container || !copy || !mockup || !window.matchMedia) return undefined;
    const holder = mockup.querySelector('.mockup-holder');
    const deckBox = hero.querySelector('.lt-deck-box');
    const deck = deckBox?.querySelector('.lt-deck');
    const band = deckBox?.querySelector('.lt-sheen-band');

    const mq = window.matchMedia(SCROLL_FX_QUERY);
    let on = false;
    let raf = 0;
    let lockEnd = 0; // the dashboard's top, in document coordinates
    let deckTop = 0; // the keyboard deck's box, likewise
    let vh = 0;
    let opacity = 1;
    let scale = 1;
    let ro = null;
    let io = null;
    let listening = false;
    let idle = 0;
    let set = null; // style writers, per element
    let holderTf = null; // the last transforms written (the browser rewrites style strings)
    let deckTf = null;

    // The copy is out of flow, so the container keeps its height as padding; the dashboard then
    // starts where it always has. The only layout reads, on resize and size changes.
    const measure = () => {
      container.style.paddingTop = `${copy.offsetHeight}px`;
      lockEnd = mockup.getBoundingClientRect().top + window.scrollY;
      if (deckBox) deckTop = deckBox.getBoundingClientRect().top + window.scrollY;
      vh = window.innerHeight;
    };

    const rest = () => {
      idle = 0;
      set.holder('willChange', '');
      if (deck) { set.deck('willChange', ''); set.band('willChange', ''); }
    };

    const laptop = (y) => {
      let moved = false;
      if (holder) {
        const p = clamp01(y / TILT_PX);
        const e = 1 - (1 - p) ** 3;
        if (e >= 1) {
          holderTf = '';
          set.holder('transform', '');
          set.holder('willChange', '');
        } else {
          const tf = `rotateX(${((1 - e) * 10).toFixed(3)}deg) scale(${(0.93 + 0.07 * e).toFixed(4)})`;
          if (tf !== holderTf) {
            holderTf = tf;
            set.holder('willChange', 'transform');
            set.holder('transform', tf);
            moved = true;
          }
        }
      }
      if (deck) {
        const top = deckTop - y; // the deck box's top in the window
        if (top < vh + 100 && top > -DECK_REACH) { // on screen, or about to be
          const t = clamp01((top - 0.08 * vh) / (0.92 * vh));
          const tf = `rotateX(${(83 - 21 * t ** 0.85).toFixed(2)}deg)`;
          if (tf !== deckTf) {
            deckTf = tf;
            set.deck('willChange', 'transform');
            set.band('willChange', 'transform');
            set.deck('transform', tf);
            // The band is 220% of the deck's width: -15% to -85% of the deck's width.
            set.band('transform', `translateX(${(-((0.15 + 0.7 * t) / 2.2) * 100).toFixed(2)}%)`);
            moved = true;
          }
        }
      }
      if (moved) {
        clearTimeout(idle);
        idle = setTimeout(rest, IDLE_MS);
      }
    };

    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      const opacityTarget = opacityAt(y);
      const scaleTarget = scaleAt(y);
      opacity += (opacityTarget - opacity) * EASE;
      scale += (scaleTarget - scale) * EASE;
      if (Math.abs(opacityTarget - opacity) < 0.001) opacity = opacityTarget;
      if (Math.abs(scaleTarget - scale) < 0.0005) scale = scaleTarget;

      const lift = `translateY(${Math.min(0, lockEnd - y)}px)`;
      set.nav('transform', lift);
      set.decor('transform', lift);
      set.copy('transform', `${lift} scale(${scale.toFixed(4)})`);
      set.copy('opacity', opacity.toFixed(3));
      set.copy('visibility', opacity < 0.01 ? 'hidden' : '');
      laptop(y);

      if (opacity !== opacityTarget || scale !== scaleTarget) raf = requestAnimationFrame(frame);
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
      holderTf = null;
      deckTf = null;
      set = { nav: writer(nav), decor: writer(decor), copy: writer(copy), holder: holder && writer(holder), deck: deck && writer(deck), band: band && writer(band) };
      root.classList.add('has-hero-fx');
      // The pre-rendered page's stand-ins until now (landing/firstPaint.js, hero.css).
      document.documentElement.classList.remove('hero-fx-pending', 'lt-pending');
      measure();
      // Start at the resting values for the current scroll (e.g. after a reload mid-page).
      opacity = opacityAt(window.scrollY);
      scale = scaleAt(window.scrollY);
      frame();
      // Scroll is only listened to while the hero is on screen; one more frame as it leaves or
      // comes back, so everything lands where the scroll position says.
      io = new IntersectionObserver(([entry]) => { listen(entry.isIntersecting); schedule(); });
      io.observe(hero);
      window.addEventListener('resize', onResize);
      ro = new ResizeObserver(onResize); // the copy's height follows the viewport and font loading
      ro.observe(copy);
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
      root.classList.remove('has-hero-fx');
      container.style.paddingTop = '';
      for (const el of [nav, decor, copy, holder, deck, band]) {
        if (!el) continue;
        el.style.transform = '';
        el.style.willChange = '';
      }
      copy.style.opacity = '';
      copy.style.visibility = '';
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
