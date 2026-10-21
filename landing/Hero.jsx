import React from 'react';
import { ArrowRight } from 'lucide-react';
import DashboardPreview, { PreviewThemeToggle, PreviewThemeUnder } from './preview/DashboardPreview.jsx';
import PreviewToast from './preview/PreviewToast.jsx';
import HeroRipples from './HeroRipples.jsx';
import { trialHref, usePreviewTheme } from './preview/previewTheme.js';

// Hero for /landing. Background, light beams, type and CTA styling live in
// landing/hero.css; layout and the entrance animation stay in Tailwind.

// Staggered entrance: 300ms fade-up (ease-mktg), skipped under reduced motion.
const ENTER = 'animate-mktg-fade-up motion-reduce:animate-none';

const Hero = () => {
  const theme = usePreviewTheme();
  return (
  <section className="hero relative overflow-x-clip pb-24 lg:pb-16">
    <HeroRipples />
    <div className="hero-decor" aria-hidden="true">
      <div className="light-source" />
      <div className="light-shaft s1" />
      <div className="light-shaft s2" />
      <div className="light-shaft s3" />
      <div className="light-shaft s4" />
      {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className={`light-line l${n}`} />)}
    </div>

    <div className="mktg-container">
      {/* Text block */}
      <div className={`hero-copy mx-auto flex max-w-4xl flex-col items-center text-center ${ENTER}`}>
        <p className="hero-eyebrow">The next-generation pool service software</p>

        <h1 className="hero-title">The End of Pool Company Chaos.</h1>

        <h2 className="hero-sub">
          You didn’t start a business to become a full-time data entry clerk. PoolLogic is the all-in-one{' '}
          <strong>pool service software</strong> built to erase your daily friction—from Sunday billing runs to the
          6:00 AM sick-tech scramble.
        </h2>

        <a
          href={trialHref(theme)}
          className="hero-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
        >
          {/* Water that fills the button on hover: two rolling waves. */}
          <span className="hero-cta-water" aria-hidden="true">
            <svg className="hero-wave is-back" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 60 H 0 Z" /></svg>
            <svg className="hero-wave is-front" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 60 H 0 Z" /></svg>
          </span>
          <span className="hero-cta-label">
            Put Your Route on Autopilot <span className="hero-cta-trial"><span className="paren">(</span>Start 30-Day Trial<span className="paren">)</span></span>
          </span>
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>

        <p className="hero-fine">No credit card required. Import your Skimmer or Excel route in under 5 minutes.</p>
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
          <PreviewToast />
          <PreviewThemeUnder />
        </div>

      </div>
    </div>
  </section>
  );
};

export default Hero;
