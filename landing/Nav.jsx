import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePreviewTheme } from './preview/previewTheme.js';
import { ctaHref, isReserving } from './onboarding.js';
import { Wordmark } from '../components/brand-logo.jsx';
import FeaturesMenu, { LINKS, MENU_FEATURES } from './FeaturesMenu.jsx';
import './nav.css';

// The site header. Dark, absolutely positioned over the hero, on the homepage, /pricing and /contact;
// light (tone="light"), in the page's flow, on the legal and partner pages; light over a white hero
// (tone="light" overlay) on /ai-and-automations.
// Either way it scrolls away with the page. Styles live in landing/nav.css.

const APP_URL = 'https://app.poolnautics.app/';

// Below this width the burger menu replaces the links (the same breakpoint as index.html's).
const MENU_MAX = 880;

// hideCta: no "Reserve your spot" / "Start free trial" button, in the bar or the menu, on the page it
// would lead to (/reserve).
// current: the page's own path (e.g. '/pricing'), so its link shows as the page you're on. A prop,
// not window.location, so a pre-rendered page renders the same on the server.
// tone: 'dark' or 'light', the page's background.
// overlay: with tone="light", over a white hero like the dark one (absolute, the page's own type), not
// in the page's flow: /ai-and-automations. Its colours: nav.css ("Light, over a white hero").
// autoHide: fixed at the top instead of scrolling away: it slides out when the visitor scrolls down and
// back in when they scroll up, on a solid dark ground once the page is off the top (nav.css "Auto-hide").
// At the very top it looks as it always does. For a page whose hero has no buttons, so "Start free
// trial" stays in reach: /pool-service-price-increases. Dark tone only for now (a light page would need
// a light ground).
const Nav = ({ hideCta = false, current, tone = 'dark', overlay = false, autoHide = false }) => {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const ref = useRef(null);
  const burger = useRef(null);
  const theme = usePreviewTheme();
  const light = tone === 'light' ? ` is-light${overlay ? ' is-over' : ''}` : '';

  // Close the mobile menu on Escape, outside click, or growing past the menu's widths.
  useEffect(() => {
    if (!open) return undefined;
    // Escape: focus goes back to the menu button, as the Features dropdown's does to its own.
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burger.current?.focus();
    };
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const mq = window.matchMedia(`(min-width: ${MENU_MAX + 0.02}px)`);
    const onResize = (e) => { if (e.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    mq.addEventListener('change', onResize);
    // The page behind the open menu doesn't scroll (html.nav-locked, hero.css).
    document.documentElement.classList.add('nav-locked');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      mq.removeEventListener('change', onResize);
      document.documentElement.classList.remove('nav-locked');
    };
  }, [open]);

  // Auto-hide: off the top, a solid ground; past the bar's own height, scrolling down tucks it away and
  // scrolling up brings it back (4px of travel either way first, so a trackpad's jitter doesn't flicker
  // it). Keyboard focus inside it brings it back too. Read once per frame.
  useEffect(() => {
    if (!autoHide) return undefined;
    const header = ref.current;
    let lastY = Math.max(0, window.scrollY);
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const barH = header?.offsetHeight || 64;
      setScrolled(y > 0);
      if (y <= barH) { setTucked(false); lastY = y; return; }
      if (y > lastY + 4) { setTucked(true); lastY = y; } else if (y < lastY - 4) { setTucked(false); lastY = y; }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    const onFocus = () => setTucked(false);
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    header?.addEventListener('focusin', onFocus);
    return () => {
      window.removeEventListener('scroll', onScroll);
      header?.removeEventListener('focusin', onFocus);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [autoHide]);
  const autoHideClass = autoHide ? ` is-autohide${scrolled ? ' is-scrolled' : ''}${tucked && !open && !featuresOpen ? ' is-tucked' : ''}` : '';

  // Unlock straight away (not after the re-render), so a /#section link can scroll the page.
  const close = () => {
    document.documentElement.classList.remove('nav-locked');
    setOpen(false);
  };

  return (
    <>
    <header className={`lp-nav${light}${autoHideClass}`} ref={ref}>
      <div className="lp-nav-bar container">
        <a href="/" className="lp-nav-wordmark" aria-label="Poolnautics — home"><Wordmark bg={tone} /></a>

        <nav className="nav-links" aria-label="Primary">
          <FeaturesMenu open={featuresOpen} setOpen={setFeaturesOpen} />
          {LINKS.map(([label, href]) => <a key={label} href={href} aria-current={href === current ? 'page' : undefined}>{label}</a>)}
        </nav>

        <div className="nav-right">
          <a href={APP_URL} className="nav-signin">Sign in</a>
          {!hideCta && (
            <a href={ctaHref(theme)} className="nav-trial">
              {isReserving ? 'Reserve your spot' : 'Start free trial'}
              <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            ref={burger}
            className="nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="lp-nav-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
          </button>
        </div>

        <nav id="lp-nav-menu" className="nav-menu" aria-label="Mobile" hidden={!open}>
          {/* Features: a heading, always open, then its links. Sign in is in the bar at every width.
              TODO(owner): "Features" looks like Pricing and Contact but isn't tappable. Link it to a
              features overview page, if one is made, or make it a smaller grey label. */}
          <p className="nav-menu-label" id="lp-nav-menu-features">Features</p>
          <div className="menu-features" role="group" aria-labelledby="lp-nav-menu-features">
            {MENU_FEATURES.map(({ label, href }) => (
              <a key={href} href={href} className="menu-feature" onClick={close}>{label}</a>
            ))}
          </div>
          <hr />
          {LINKS.map(([label, href]) => <a key={label} href={href} className="menu-main" aria-current={href === current ? 'page' : undefined} onClick={close}>{label}</a>)}
          {!hideCta && (
            <a href={ctaHref(theme)} className="menu-trial" onClick={close}>
              {isReserving ? 'Reserve your spot' : 'Start free trial'}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          )}
        </nav>
      </div>
    </header>
    {/* Dims the page behind the open menu; outside the header so it sits under it (z-index 99 < 100).
        A tap on it closes the menu. */}
    <div className={`nav-scrim${light}${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
    </>
  );
};

export default Nav;
