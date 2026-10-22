import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import DashboardPreview, { PreviewThemeToggle, PreviewThemeUnder } from './preview/DashboardPreview.jsx';
import { trialHref, usePreviewTheme } from './preview/previewTheme.js';
import useHeroScrollFx from './useHeroScrollFx.js';

// The billing-run toast is decoration: absolutely positioned (it can't move
// anything), hidden on phones, and only loaded once the page has painted.
const PreviewToast = lazy(() => import('./preview/PreviewToast.jsx'));
function useAfterPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(max-width: 767.98px)').matches) return undefined; // display:none there anyway
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setReady(true), { timeout: 1500 });
    return () => cancel(id);
  }, []);
  return ready;
}

// Hero for /landing. Background, light beams, type and CTA styling live in
// landing/hero.css; layout and the entrance animation stay in Tailwind. On
// desktop, useHeroScrollFx adds the scroll effect (fixed, fading headline).

// Staggered entrance: 300ms fade-up (ease-mktg), skipped under reduced motion.
const ENTER = 'animate-mktg-fade-up motion-reduce:animate-none';

const Hero = () => {
  const theme = usePreviewTheme();
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
          href={trialHref(theme)}
          className="hero-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
        >
          <span className="hero-cta-label">
            Put Your Route on Autopilot <span className="hero-cta-trial"><span className="paren">(</span>Start 30-Day Trial<span className="paren">)</span></span>
          </span>
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>

        <p className="hero-fine">No credit card required. Import your Skimmer or Excel route in minutes.</p>
      </div>

      {/* Below lg the rail and its account menu are hidden: the theme lives here instead. */}
      <div className={`hero-toggle flex justify-center lg:hidden [animation-delay:150ms] ${ENTER}`}>
        <PreviewThemeToggle />
      </div>

      {/* Dashboard preview: the first screen down to two Live route progress rows, sized to its content. */}
      <div className={`hero-mockup relative mx-auto max-w-[1120px] [animation-delay:150ms] ${ENTER}`}>
        <div className="mockup-holder">
          <DashboardPreview />
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
