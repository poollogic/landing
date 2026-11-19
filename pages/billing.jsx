import React, { useRef } from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/billing-page/billing-page.css';
import Nav from '../landing/Nav.jsx';
import HeroFx from '../landing/ai/HeroFx.jsx';
import BillingCalendar from '../landing/billing-page/BillingCalendar.jsx';
import useReveal from '../landing/ai/useReveal.js';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { FOCUS, PrimaryCta } from '../landing/ai/shared.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /billing: automatic billing in depth. On /ai-and-automations' design (its page wrapper, nav, hero,
// light, buttons and section bands: ai.css, landing/ai/shared.jsx), so its sections can follow the
// hero the same way; only this page's own layouts live in landing/billing-page/billing-page.css,
// under .billing-page. The hero only so far: noindex (ROUTE_META.billing), and not in the sitemap,
// nav or footer, until the rest is built. Pre-rendered (entry-server.jsx), so no window or document
// while rendering. Blocks with data-reveal fade up on scroll (useReveal), as on the AI page.

export default function BillingPage() {
  const theme = usePreviewTheme();
  const pageRef = useRef(null);
  useReveal(pageRef);
  return (
    <div ref={pageRef} className="mktg ai-page billing-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero: the AI page's (its ground, light and type), as one centred column: the copy, then
            the billing calendar, which the beam falls onto (HeroFx, stacked). */}
        <section className="hero ai-hero bp-hero relative overflow-x-clip" aria-labelledby="billing-hero-title">
          <HeroFx target="figure.bc-panel" stacked beamAt={0.5} />
          <div className="container">
            <div className="bp-hero-stack">
              <div className="ai-hero-copy bp-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <HeroHeading
                  id="billing-hero-title"
                  eyebrow="Pool service billing"
                  title={<><span className="bp-title-line">Pool Service Billing</span>{' '}<span className="bp-title-line">Software That Runs Itself</span></>}
                >
                  Set each customer’s rate and billing day once. Poolnautics sends the invoice in the 8:30 AM billing
                  run, charges cards on autopay, and reminds anyone who’s late. No more invoicing everyone by hand on
                  the 1st.
                </HeroHeading>
                <div className="ai-cta-row ai-cta-row--center">
                  <PrimaryCta theme={theme} />
                  <a href="/pricing" className={`ai-cta-ghost cta-secondary ${FOCUS}`}>See pricing</a>
                </div>
                <p className="hero-fine">Automatic invoicing is included in every plan.</p>
              </div>
              <div className="bp-hero-visual animate-mktg-fade-up motion-reduce:animate-none [animation-delay:150ms]">
                <BillingCalendar />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
