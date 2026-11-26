import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../landing.css';
import '../hero.css';
import '../ai/ai.css';
import './feature-page.css';
import Nav from '../Nav.jsx';
import HeroHeading from '../HeroHeading.jsx';
import TrialBand from '../ai/TrialBand.jsx';
import { Wordmark } from '../../components/brand-logo.jsx';
import { usePreviewTheme } from '../preview/previewTheme.js';
import { FOCUS, PrimaryCta } from '../ai/shared.jsx';
import { TRIAL_DAYS } from '../../aiFacts.js';
import { Footer } from '../../components/site-chrome.jsx';

// The Vision plan feature pages' shared pieces: /pool-service-mileage-tracking (pages/mileage-tracking.jsx)
// and /pool-service-fleet-management (pages/fleet-management.jsx), a pair built from the user's approved
// references. The page frame (light nav, the AI page's dark trial band, footer), the light hero with its
// buttons and "Vision plan" tag row, the sections and their centred headings, the phone-plus-three-points
// layout, points, questions and the arrow link. Styles: feature-page.css (.fp-*). The phone:
// FeaturePhone.jsx. Pre-rendered pages, so nothing here reads window or document while rendering. No
// entrance animations or scroll effects.

/** The page: the site's light nav over the hero, the sections, the AI page's trial band and the footer. */
// current: the page's own path, so the header's Features menu marks its link.
export function FeaturePage({ className, current, children }) {
  const theme = usePreviewTheme();
  return (
    <div className={`mktg ai-page feature-page ${className} relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased`}>
      <Nav tone="light" overlay current={current} />
      <main>
        {children}
        {/* The closing trial band (dark): /ai-and-automations' TrialBand, its copy as it is for now. */}
        <TrialBand theme={theme} />
      </main>
      <Footer />
    </div>
  );
}

const NoteTick = () => (
  <svg className="fp-note-tick" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** The Poolnautics wordmark inside the hero's sentence (the feature card heading's inline logo), with the
 *  word itself for screen readers. */
export const HeroWordmark = () => (
  <>
    <span className="fp-wordmark"><Wordmark style={{ display: 'inline-block' }} /></span>
    <span className="sr-only">Poolnautics</span>
  </>
);

/** The light hero (/ai-and-automations'): the h1 and sentence, "Start your free trial" and "See pricing",
 *  the Vision plan tag with the trial notes, and the page's card on the right. */
export function FeatureHero({ id, title, children, visual }) {
  const theme = usePreviewTheme();
  return (
    <section className="hero ai-hero ai-hero--light relative overflow-x-clip" data-theme="light" aria-labelledby={id}>
      <div className="container">
        <div className="ai-hero-grid">
          <div className="ai-hero-copy">
            <HeroHeading id={id} title={title}>{children}</HeroHeading>
            <div className="fp-hero-cta">
              <PrimaryCta theme={theme} label="Start your free trial" />
              <a className={`cta-secondary fp-ghost ${FOCUS}`} href="/pricing">See pricing</a>
            </div>
            <ul className="fp-notes">
              <li><span className="fp-plan">Vision plan</span></li>
              <li><NoteTick />Free for {TRIAL_DAYS} days</li>
              <li><NoteTick />No credit card</li>
            </ul>
          </div>
          <div className="ai-hero-visual">{visual}</div>
        </div>
      </div>
    </section>
  );
}

/** A section's centred heading: eyebrow, h2, and its intro (if any), in the site's heading classes. */
function Head({ id, eyebrow, title, sub }) {
  return (
    <div className="fp-head">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

/** A section: white, tint (light grey) or dark, with its centred heading when it has one (otherwise its
 *  own content carries the h2 that `id` names). */
export function FeatureSection({ tone, id, eyebrow, title, sub, className, children }) {
  return (
    <section className={`fp-sec fp-sec--${tone}${className ? ` ${className}` : ''}`} aria-labelledby={id}>
      <div className="container">
        {title && <Head id={id} eyebrow={eyebrow} title={title} sub={sub} />}
        {children}
      </div>
    </section>
  );
}

/** The phone on the left, three numbered points on the right: [small label, h3, sentence]. */
export function PhoneAndPoints({ phone, points }) {
  return (
    <div className="fp-how">
      <div className="fp-phone-col">{phone}</div>
      <ol className="fp-how-points">
        {points.map(([label, title, body]) => (
          <li key={title}><small>{label}</small><h3 className="fp-h3">{title}</h3><p className="fp-p">{body}</p></li>
        ))}
      </ol>
    </div>
  );
}

/** Short points, three across: [h3, sentence]. */
export function Points({ items, className }) {
  return (
    <ul className={className ? `fp-points ${className}` : 'fp-points'}>
      {items.map(([title, body]) => <li key={title}><h3 className="fp-h3">{title}</h3><p className="fp-p">{body}</p></li>)}
    </ul>
  );
}

/** Questions and answers as plain headings and paragraphs (no FAQ structured data). */
export function Questions({ items }) {
  return (
    <ul className="fp-faq">
      {items.map(([q, a]) => <li key={q}><h3 className="fp-h3">{q}</h3><p>{a}</p></li>)}
    </ul>
  );
}

/** A text link with an arrow. */
export function ArrowLink({ href, children }) {
  return (
    <a className={`fp-link ${FOCUS}`} href={href}>{children}<ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></a>
  );
}

/** The homepage feature card's green tick (feature-card.css .fc-tick, FeatureCard.jsx's Check). */
export const FcTick = () => (
  <span className="fc-tick" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);

/** The same tile in red, with a cross. */
export const FcCross = () => <span className="fc-tick fp-tick--x" aria-hidden="true">×</span>;

/** "50,700" (no Intl, so the server and the browser always write the same thing). */
export const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
