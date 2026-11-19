import React from 'react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/ai/ai.css';
import '../landing/billing-page/billing-page.css';
import Nav from '../landing/Nav.jsx';
import BillingCalendar from '../landing/billing-page/BillingCalendar.jsx';
import MonthBelt from '../landing/billing-page/MonthBelt.jsx';
import BillingSetup from '../landing/billing-page/BillingSetup.jsx';
import { usePreviewTheme } from '../landing/preview/previewTheme.js';
import { FOCUS, PrimaryCta } from '../landing/ai/shared.jsx';
import HeroHeading from '../landing/HeroHeading.jsx';
import { Footer } from '../components/site-chrome.jsx';

// /recurring-billing (it was /billing): recurring billing in depth. On /ai-and-automations' design (its
// page wrapper, nav, hero ground, type and buttons: ai.css, landing/ai/shared.jsx); only this page's
// own layouts live in landing/billing-page/billing-page.css, under .billing-page. Still being built:
// noindex (ROUTE_META.billing), and not in the sitemap, nav or footer. Pre-rendered (entry-server.jsx),
// so no window or document while rendering. The hero's calendar and the belt under it run on one
// clock (billingClock.js).

export default function BillingPage() {
  const theme = usePreviewTheme();
  return (
    <div className="mktg ai-page billing-page relative min-h-screen bg-mktg-page font-sans text-mktg-muted antialiased">
      <Nav />
      <main>
        {/* 1. Hero: the AI page's ground and type (no smoke or beam: the calendar's "today" is its only
            motion), as one centred column: the copy, then the billing calendar. */}
        <section className="hero ai-hero bp-hero relative overflow-x-clip" aria-labelledby="billing-hero-title">
          <div className="ai-hero-fade" aria-hidden="true" />
          <div className="container">
            <div className="bp-hero-stack">
              <div className="ai-hero-copy bp-hero-copy animate-mktg-fade-up motion-reduce:animate-none">
                <HeroHeading
                  id="billing-hero-title"
                  eyebrow="Recurring billing"
                  title={<><span className="bp-title-line">Pool Service Billing</span>{' '}<span className="bp-title-line">Software That Runs Itself</span></>}
                >
                  Set each customer’s rate and billing day once. Poolnautics sends the invoice every morning it’s
                  due, charges cards on autopay, and reminds anyone who’s late. No more invoicing everyone by hand
                  on the 1st.
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

        {/* 2. The statement: when billing starts and that it repeats, over a belt of monthly invoices. */}
        <section className="bp-statement" aria-labelledby="bp-statement-title">
          <div className="container">
            <h2 id="bp-statement-title" className="bp-statement-title">
              <span className="bp-statement-a">Start them today, or set a start date 10 days out.</span>{' '}
              <span className="bp-statement-b">Billing begins that day and repeats every month.</span>
            </h2>
            <MonthBelt />
          </div>
        </section>

        {/* 3. A customer's billing settings and the invoice they make. */}
        <section className="bp-setup" aria-labelledby="bp-setup-title">
          <div className="container">
            <BillingSetup />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
