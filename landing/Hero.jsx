import React, { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import DashboardPreview from './preview/DashboardPreview.jsx';
import { HERO_DATE } from './preview/data.js';
import { getPreviewTheme, usePreviewTheme } from './preview/previewTheme.js';
import PhoneFrame from './PhoneFrame.jsx';
import './laptop.css';
import HeroPhoneDash from './HeroPhoneDash.jsx';
import useHeroCardScroll from './useHeroCardScroll.js';
import { ctaHref, isReserving } from './onboarding.js';
import useHeroToastAnchor from './useHeroToastAnchor.js';

// Phones and tablets (below lg), where the hero shows the dashboard card (HeroPhoneDash) instead of
// the desktop dashboard. Updates if the window crosses the breakpoint; false on the server.
const BELOW_LG_QUERY = '(max-width: 1023.98px)';
const subscribeBelowLg = (fn) => {
  const mq = window.matchMedia(BELOW_LG_QUERY);
  mq.addEventListener('change', fn);
  return () => mq.removeEventListener('change', fn);
};
const useIsBelowLg = () => useSyncExternalStore(subscribeBelowLg, () => window.matchMedia(BELOW_LG_QUERY).matches, () => false);

// The billing-run toast is decoration: absolutely positioned (it can't move
// anything), hidden below lg, and only loaded once the page has painted.
const PreviewToast = lazy(() => import('./preview/PreviewToast.jsx'));
function useAfterPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.matchMedia(BELOW_LG_QUERY).matches) return undefined; // display:none there anyway
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
// running off the window's edge, its toast placed by useHeroToastAnchor. Below lg the dashboard is
// the phone dashboard card (HeroPhoneDash), whose list moves with the page (useHeroCardScroll).

// The offer under the primary button.
const TICKS = ['We’ll move your customers over', 'Free for 30 days', 'No credit card'];

// Staggered entrance: 300ms fade-up (ease-mktg), skipped under reduced motion.
const ENTER = 'animate-mktg-fade-up motion-reduce:animate-none';

const Hero = () => {
  const theme = usePreviewTheme();
  const isBelowLg = useIsBelowLg();
  const holderRef = useRef(null);
  const mockupRef = useRef(null);
  useHeroCardScroll(holderRef, isBelowLg);
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
        {/* On phones each span is a line of its own (hero.css); wider, the headline wraps as it fits. */}
        <h1 className="hero-title">
          <span className="hero-title-line">Pool service software</span>{' '}
          <span className="hero-title-line">built to run and grow</span>{' '}
          <span className="hero-title-line">your business</span>
        </h1>

        {/* Two wordings, both in the markup: the long one from 1100px, the short one below (hero.css). On
            phones each short sentence is a line of its own. */}
        <p className="hero-sub">
          <span className="hero-sub-wide">Pool business software that puts billing, routes and service reports on autopilot. Cut your overhead. Add more pools.</span>
          <span className="hero-sub-narrow">
            <span className="hero-sub-line">Billing, routes and service reports on autopilot.</span>{' '}
            <span className="hero-sub-line">Cut your overhead. Add more pools.</span>
          </span>
        </p>

        <div className="hero-actions">
          <a
            href={ctaHref(theme)}
            className="hero-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            <span className="hero-cta-label">{isReserving ? 'Reserve your spot' : 'Start your free trial'}</span>
            <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </a>
          {/* The offer in three ticks: one row, then two (hero.css). Between the buttons in the markup, so
              below lg they sit under the primary; from lg they wrap onto their own row under both. */}
          <ul className="hero-ticks">
            {TICKS.map((t) => (
              <li key={t}><Check size={14} strokeWidth={2.25} aria-hidden="true" />{t}</li>
            ))}
          </ul>
          <a
            href="/pricing"
            className="hero-cta-alt cta-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            See pricing
          </a>
        </div>
      </div>

      {/* 640px to lg: two lines over the dashboard card; hidden on phones and from lg (hero.css). */}
      <p className="hero-card-caption">Built for your desktop and your phone.</p>
      <p className="hero-card-sub">Billing, customers and route management. Not just the tech app.</p>

      {/* Dashboard preview: the first screen down to two Live route progress rows, sized to its content. */}
      <div ref={mockupRef} className={`hero-mockup relative mx-auto max-w-[1120px] [animation-delay:150ms] ${ENTER}`}>
        <div className="mockup-holder" ref={holderRef}>
          {/* lg and up: the bezel around the screen, a floating window (laptop.css). */}
          <div className="lt-bezel" aria-hidden="true" />
          {/* Both dashboards are always rendered, so the pre-rendered page is the same at every width.
              lg and up, hero.css takes the frame away and the desktop dashboard sits in the holder on
              its own. Below lg the frame is the dark card, showing only the phone dashboard. */}
          <PhoneFrame className="bz-phone--embedded hero-phone">
            <DashboardPreview date={HERO_DATE.long} />
            <HeroPhoneDash />
          </PhoneFrame>
          <div className="preview-glint" aria-hidden="true" />
          {showToast && <Suspense fallback={null}><PreviewToast /></Suspense>}
        </div>

      </div>
    </div>
  </section>
  );
};

export default Hero;
