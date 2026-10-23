import React, { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight } from 'lucide-react';
import DashboardPreview, { PreviewThemeToggle, PreviewThemeUnder } from './preview/DashboardPreview.jsx';
import { usePreviewTheme } from './preview/previewTheme.js';
import PhoneFrame from './PhoneFrame.jsx';
import usePhonePreviewScroll from './usePhonePreviewScroll.js';
import { ctaHref, isReserving } from './onboarding.js';
import useHeroScrollFx from './useHeroScrollFx.js';

// Phones (<768px). Read before the first render, so the right preview paints straight
// away (no flash, no layout shift); updates if the window crosses the breakpoint.
const PHONE_QUERY = '(max-width: 767.98px)';
const subscribePhone = (fn) => {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener('change', fn);
  return () => mq.removeEventListener('change', fn);
};
const useIsPhone = () => useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);

// The billing-run toast is decoration: absolutely positioned (it can't move
// anything), hidden on phones, and only loaded once the page has painted.
const PreviewToast = lazy(() => import('./preview/PreviewToast.jsx'));
function useAfterPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.matchMedia(PHONE_QUERY).matches) return undefined; // display:none there anyway
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setReady(true), { timeout: 1500 });
    return () => cancel(id);
  }, []);
  return ready;
}

// The homepage hero. Background, light beams, type and CTA styling live in
// landing/hero.css; layout and the entrance animation stay in Tailwind. On
// desktop, useHeroScrollFx adds the scroll effect (fixed, fading headline).

// Staggered entrance: 300ms fade-up (ease-mktg), skipped under reduced motion.
const ENTER = 'animate-mktg-fade-up motion-reduce:animate-none';

const Hero = () => {
  const theme = usePreviewTheme();
  const isPhone = useIsPhone();
  const holderRef = useRef(null);
  usePhonePreviewScroll(holderRef, isPhone); // phones: the dashboard scrolls a little with the page
  const heroRef = useRef(null);
  useHeroScrollFx(heroRef);
  const showToast = useAfterPaint();
  return (
  <section ref={heroRef} className="hero relative overflow-x-clip">
    <div className="hero-decor" aria-hidden="true">
      <div className="light-source" />
      <div className="light-shaft s1" />
      <div className="light-shaft s2" />
      <div className="light-shaft s3" />
      <div className="light-shaft s4" />
      {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className={`light-line l${n}`} />)}
    </div>

    <div className="container">
      {/* Text block */}
      <div className={`hero-copy mx-auto flex max-w-4xl flex-col items-center text-center ${ENTER}`}>
        <p className="hero-eyebrow">All-in-one pool route management software</p>

        <h1 className="hero-title">
          <span className="hero-title-line">Run your pool route.</span>{' '}
          <span className="hero-title-line">Don’t let it run you.</span>
        </h1>

        <h2 className="hero-sub">
          Route your techs, track every chemical, and get paid on time, without lifting a finger. Automated SOPs for
          your whole <strong>pool service</strong> business.
        </h2>

        <a
          href={ctaHref(theme)}
          className="hero-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
        >
          <span className="hero-cta-label">
            Put Your Route on Autopilot <span className="hero-cta-trial"><span className="paren">(</span>{isReserving ? 'Reserve Your Spot' : 'Start 30-Day Trial'}<span className="paren">)</span></span>
          </span>
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>

        <p className="hero-fine">
          {isReserving
            ? 'Every account starts with white-glove onboarding: we move your customers over and set everything up with you.'
            : 'No credit card required. Import your Skimmer or Excel route in minutes.'}
        </p>
      </div>

      {/* Below lg the rail and its account menu are hidden: the theme lives here instead. */}
      <div className={`hero-toggle flex justify-center lg:hidden [animation-delay:150ms] ${ENTER}`}>
        <PreviewThemeToggle />
      </div>

      {/* Dashboard preview: the first screen down to two Live route progress rows, sized to its content. */}
      <div className={`hero-mockup relative mx-auto max-w-[1120px] [animation-delay:150ms] ${ENTER}`}>
        <div className="mockup-holder" ref={holderRef}>
          {/* Phones: the preview inside the shared iPhone frame (the Billing section's phone). */}
          {isPhone ? (
            <PhoneFrame className="bz-phone--embedded hero-phone" statusBar={theme === 'dark' ? 'light' : 'dark'}>
              <DashboardPreview />
            </PhoneFrame>
          ) : (
            <DashboardPreview />
          )}
          <div className="preview-glint" aria-hidden="true" />
          {showToast && <Suspense fallback={null}><PreviewToast /></Suspense>}
          <PreviewThemeUnder />
        </div>

      </div>
    </div>
  </section>
  );
};

export default Hero;
