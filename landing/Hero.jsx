import React, { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import DashboardPreview from './preview/DashboardPreview.jsx';
import { HERO_DATE } from './preview/data.js';
import { getPreviewTheme, usePreviewTheme } from './preview/previewTheme.js';
import PhoneFrame from './PhoneFrame.jsx';
import './laptop.css';
import HeroPhoneDash from './HeroPhoneDash.jsx';
import { ctaHref, isReserving } from './onboarding.js';
import useHeroToastAnchor from './useHeroToastAnchor.js';

// Phones (under 768px), where the hero shows the iPhone (HeroPhoneDash) instead of the desktop
// dashboard (hero.css switches at the same width). Updates if the window crosses the breakpoint; false on
// the server.
const PHONE_QUERY = '(max-width: 767.98px)';
const subscribePhone = (fn) => {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener('change', fn);
  return () => mq.removeEventListener('change', fn);
};
const useIsPhone = () => useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);
// The billing-run toast is decoration: absolutely positioned (it can't move anything), shown on the
// desktop dashboard (from 768px, tablets too; never on phones) and only loaded once the page has painted.
const PreviewToast = lazy(() => import('./preview/PreviewToast.jsx'));
function useAfterPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setReady(true), { timeout: 1500 });
    return () => cancel(id);
  }, []);
  return ready;
}

// The homepage hero. Background, light beams, type and CTA styling live in
// landing/hero.css; layout and the entrance animation stay in Tailwind. On
// desktop (hero.css, "Desktop") it's one screen: the copy on the left, the dashboard on the right,
// running off the window's edge, its toast placed by useHeroToastAnchor. On tablets (768px to 1023px)
// the copy is centred over the same desktop dashboard, scaled to the container's width, its toast in
// the window's top-right corner (hero.css, "Homepage hero, tablets"). On phones (under 768px) it's a
// whole iPhone showing the app's light phone dashboard in Safari (HeroPhoneDash), under two lines of
// caption; nothing in it moves.

// The offer under the buttons. The second links to the switching page.
const TICKS = ['No credit card, free for 30 days', 'We’ll move your customers over'];
const TICK_LINKS = { 'We’ll move your customers over': '/switch-pool-service-software' };

// Staggered entrance: 300ms fade-up (ease-mktg), skipped under reduced motion.
const ENTER = 'animate-mktg-fade-up motion-reduce:animate-none';

const Hero = () => {
  const theme = usePreviewTheme();
  const isPhone = useIsPhone();
  const mockupRef = useRef(null);
  useHeroToastAnchor(mockupRef);
  const showToast = useAfterPaint();
  // The pre-rendered page is drawn with the dark preview. When this visitor's is light, the page's
  // first script hid the preview (html.pv-pending, scripts/prerender.mjs) so it doesn't flash dark;
  // show it once it's drawn in the visitor's theme.
  useEffect(() => {
    if (theme === getPreviewTheme()) document.documentElement.classList.remove('pv-pending');
  }, [theme]);
  return (
  <section className="hero hero--home relative overflow-x-clip">
    <div className="hero-decor" aria-hidden="true">
      <div className="light-source" />
      <div className="light-shaft s1" />
      <div className="light-shaft s2" />
      <div className="light-shaft s3" />
      <div className="light-shaft s4" />
      {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className={`light-line l${n}`} />)}
    </div>
    {/* Below lg: the top of the hero flat in the page's colour, under the iPhone status bar (hero.css). */}
    <div className="hero-top-flat" aria-hidden="true" />

    <div className="container">
      {/* Text block */}
      <div className={`hero-copy mx-auto flex max-w-4xl flex-col items-center text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left ${ENTER}`}>
        {/* Three set lines at every width, each span a line of its own (hero.css). */}
        <h1 className="hero-title">
          <span className="hero-title-line">Pool service software</span>{' '}
          <span className="hero-title-line">built to run and grow</span>{' '}
          <span className="hero-title-line">your pool business</span>
        </h1>

        {/* Two sentences, one per line, at every width. */}
        <p className="hero-sub">
          <span className="hero-sub-line">Other pool software takes your time.</span>{' '}
          <span className="hero-sub-line">Poolnautics was built to give it back.</span>
        </p>

        {/* The trial button and "See pricing", a quiet text link beside it (under it on phones). */}
        <div className="hero-actions">
          <a
            href={ctaHref(theme)}
            className="hero-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            <span className="hero-cta-label">{isReserving ? 'Reserve your spot' : 'Start your free trial'}</span>
            <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <a href="/pricing" className="hero-pricing">See pricing</a>
        </div>
        {/* The offer, one tick per line, under both. */}
        <ul className="hero-ticks">
          {TICKS.map((t) => (
            <li key={t}>
              <Check size={16} strokeWidth={2.25} aria-hidden="true" />
              {TICK_LINKS[t] ? <a href={TICK_LINKS[t]} className="hero-tick-link">{t}</a> : t}
            </li>
          ))}
        </ul>
      </div>

      {/* Under 768px: two lines over the iPhone; hidden from 768px (hero.css). */}
      <p className="hero-card-caption">Works as well on your phone as it does on your desktop.</p>
      <p className="hero-card-sub">Manage billing, customers and routes from anywhere.</p>

      {/* Dashboard preview: the first screen down to two Live route progress rows, sized to its content. */}
      <div ref={mockupRef} className={`hero-mockup relative mx-auto max-w-[1120px] [animation-delay:150ms] ${ENTER}`}>
        <div className="mockup-holder">
          {/* From 768px: the bezel around the screen, a floating window (laptop.css). */}
          <div className="lt-bezel" aria-hidden="true" />
          {/* Both dashboards are always rendered, so the pre-rendered page is the same at every width.
              From 768px, hero.css takes the frame away and the desktop dashboard sits in the holder on
              its own. On phones the frame is a whole iPhone, showing only the phone dashboard. */}
          <PhoneFrame className="bz-phone--embedded hero-phone">
            <DashboardPreview date={HERO_DATE.long} />
            <HeroPhoneDash />
          </PhoneFrame>
          <div className="preview-glint" aria-hidden="true" />
          {showToast && !isPhone && <Suspense fallback={null}><PreviewToast /></Suspense>}
        </div>

      </div>
    </div>
  </section>
  );
};

export default Hero;
