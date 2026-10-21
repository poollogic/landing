import { useLayoutEffect } from 'react';

// Desktop hero scroll effect. At ≥1024px without reduced motion it adds
// .has-hero-fx to the page (styles at the end of hero.css) and drives, from
// native scrolling:
//  - the headline block (.hero-copy), fixed: fades, shrinks to 85% and blurs;
//  - the nav, rays and headline, held in place until the dashboard reaches the
//    top of the viewport, then carried off with it.
// Scroll and resize only schedule a frame; one requestAnimationFrame loop
// writes the styles and stops once the eased values settle. Below 1024px or
// with reduced motion the class is never added and the hero is unchanged.

// Also gates the toast's scroll entrance (preview/PreviewToast.jsx).
export const SCROLL_FX_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const EASE = 0.12; // share of the remaining distance covered each frame

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const opacityAt = (y) => (1 - clamp01((y - 20) / 440)) ** 1.6;
const scaleAt = (y) => 1 - 0.15 * clamp01((y - 20) / 600);

export default function useHeroScrollFx(heroRef) {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const root = hero?.closest('.mktg');
    const nav = root?.querySelector('.lp-nav');
    const decor = hero?.querySelector('.hero-decor');
    const container = hero?.querySelector(':scope > .container');
    const copy = hero?.querySelector('.hero-copy');
    const mockup = hero?.querySelector('.hero-mockup');
    if (!nav || !decor || !container || !copy || !mockup || !window.matchMedia) return undefined;

    const mq = window.matchMedia(SCROLL_FX_QUERY);
    let on = false;
    let raf = 0;
    let lockEnd = 0; // the dashboard's top, in document coordinates
    let opacity = 1;
    let scale = 1;
    let ro = null;

    // The copy is out of flow, so the container keeps its height as padding;
    // the dashboard then starts where it always has.
    const measure = () => {
      container.style.paddingTop = `${copy.offsetHeight}px`;
      lockEnd = mockup.getBoundingClientRect().top + window.scrollY;
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
      nav.style.transform = lift;
      decor.style.transform = lift;
      copy.style.transform = `${lift} scale(${scale})`;
      copy.style.opacity = String(opacity);
      const blur = (1 - opacity) * 3;
      copy.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '';
      copy.style.visibility = opacity < 0.01 ? 'hidden' : '';

      if (opacity !== opacityTarget || scale !== scaleTarget) raf = requestAnimationFrame(frame);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { measure(); schedule(); };

    const enable = () => {
      on = true;
      root.classList.add('has-hero-fx');
      measure();
      // Start at the resting values for the current scroll (e.g. after a reload mid-page).
      opacity = opacityAt(window.scrollY);
      scale = scaleAt(window.scrollY);
      frame();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', onResize);
      ro = new ResizeObserver(onResize); // the copy's height follows the viewport and font loading
      ro.observe(copy);
    };
    const disable = () => {
      on = false;
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      ro = null;
      root.classList.remove('has-hero-fx');
      container.style.paddingTop = '';
      for (const el of [nav, decor, copy]) el.style.transform = '';
      copy.style.opacity = '';
      copy.style.filter = '';
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
