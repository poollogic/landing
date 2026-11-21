import React, { useEffect, lazy, Suspense } from 'react';
import { REVIEWS_ON } from './landing/reviews/config.js';
import { installReviewLinks, isOAuthReturn } from './landing/reviews/openReview.js';
import { Nav, Footer } from './components/site-chrome.jsx';
import SiteHeader from './landing/Nav.jsx';
import { payoutRange } from './partnerProgram.js';

// Sub-pages are each split into their own chunks — only fetched when visited.
const TermsPage = lazy(() => import('./pages/terms.jsx'));
const PrivacyPage = lazy(() => import('./pages/privacy.jsx'));
const TechAppPage = lazy(() => import('./pages/tech-app.jsx'));
const ContactPage = lazy(() => import('./pages/contact.jsx'));
const PricingPage = lazy(() => import('./pages/pricing.jsx'));
const ReservePage = lazy(() => import('./pages/reserve.jsx'));
const AiIntegrationsPage = lazy(() => import('./pages/ai-integrations.jsx'));
const PartnersPage = lazy(() => import('./pages/partners.jsx'));
const PartnerTermsPage = lazy(() => import('./pages/partner-terms.jsx'));
const TechnicianTermsPage = lazy(() => import('./pages/technician-terms.jsx'));
const DeleteAccountPage = lazy(() => import('./pages/delete-account.jsx'));
const PartnerKitPage = lazy(() => import('./pages/partner-kit.jsx'));
const WorkflowPage = lazy(() => import('./pages/workflow.jsx'));
const BillingPage = lazy(() => import('./pages/billing.jsx'));
const LandingPage = lazy(() => import('./pages/landing.jsx'));
// Customer reviews: only with VITE_REVIEWS=1 (landing/reviews/config.js). Off, both addresses show the
// homepage, marked noindex, like any unknown address, and none of it is built. On, writing a review is a
// popup over any page (landing/reviews/openReview.js); /reviews/write is the reviews page with it open.
const ReviewsPage = REVIEWS_ON ? lazy(() => import('./pages/reviews.jsx')) : null;
const ReviewOAuthReturn = REVIEWS_ON ? lazy(() => import('./landing/reviews/ReviewDialog.jsx').then((m) => ({ default: m.OAuthReturn }))) : null;

// Page defaults — accent color, hero layout, density, theme.
// EDITMODE markers are preserved so the external prototype editor can still patch this object.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3B82F6",
  "heroLayout": "stacked",
  "headline": "Pool service software your techs can run on day one",
  "subhead": "Pool service software for routes, chemistry tracking, repairs, and billing — all in one app your techs can use day one.",
  "density": "default",
  "theme": "light"
}/*EDITMODE-END*/;

const isTermsPath = (p) => p === '/terms' || p === '/terms/';
const isPrivacyPath = (p) => p === '/privacy' || p === '/privacy/';
const isTechAppPath = (p) => p === '/tech-app' || p === '/tech-app/';
const isContactPath = (p) => p === '/contact' || p === '/contact/';
const isPricingPath = (p) => p === '/pricing' || p === '/pricing/';
const isReservePath = (p) => p === '/reserve' || p === '/reserve/';
export const isAiIntegrationsPath = (p) => p === '/ai-and-automations' || p === '/ai-and-automations/';
const isPartnersPath = (p) => p === '/partners' || p === '/partners/';
const isPartnerTermsPath = (p) => p === '/partners/terms' || p === '/partners/terms/';
// The phone app's sign-in links here (the box on its location screen).
const isTechnicianTermsPath = (p) => p === '/technician-terms' || p === '/technician-terms/';
// Google Play's account deletion page: the URL is in the Play Console listing, so it stays exactly this.
const isDeleteAccountPath = (p) => p === '/delete-account' || p === '/delete-account/';
const isPartnerKitPath = (p) => p === '/partners/kit' || p === '/partners/kit/';
const isWorkflowPath = (p) => p === '/workflow' || p === '/workflow/';
const isBillingPath = (p) => p === '/recurring-billing' || p === '/recurring-billing/'; // /billing 301s here (public/_redirects)
const isReviewsPath = (p) => REVIEWS_ON && (p === '/reviews' || p === '/reviews/');
const isReviewWritePath = (p) => REVIEWS_ON && (p === '/reviews/write' || p === '/reviews/write/');

const SITE_ORIGIN = 'https://getpoolnautics.com';

export const ROUTE_META = {
  home: {
    title: 'Pool Service Software for Routes, Billing & AI | Poolnautics',
    description: 'Run your pool service business smarter with route management, customer tracking, technician apps, automated billing, service reports and powerful workflows with AI integrations.',
    ogTitle: 'Poolnautics — Run your pool route. Don’t let it run you.',
    ogDescription: 'Route your techs, track every chemical, and get paid on time, without lifting a finger. Import your Skimmer or Excel route in minutes.',
    path: '/',
  },
  pricing: {
    title: 'Pool Service Software Pricing — Poolnautics',
    description: 'Insight from $99/mo and Vision from $159/mo, priced by active customers, with unlimited technicians and office staff. 25% off yearly. 30-day free trial.',
    path: '/pricing',
  },
  reserve: {
    title: 'Reserve your spot — Poolnautics',
    description: 'Poolnautics brings on new pool companies in small groups, so every route is set up right. Reserve your spot in the next group.',
    path: '/reserve',
  },
  // Pre-rendered at build time (entry-server.jsx), so this is also what the served HTML carries.
  aiIntegrations: {
    title: 'Pool Service Automation & AI Integrations | Poolnautics',
    description: 'Automate pool service workflows, follow-ups and billing. Connect ChatGPT, Claude, Grok or your own AI to your pool business data with Poolnautics.',
    path: '/ai-and-automations',
  },
  techApp: {
    title: 'Tech app — Poolnautics',
    description: 'The Poolnautics tech app: routes, chemistry logging, GPS-verified service reports, and equipment notes from the field.',
    path: '/tech-app',
  },
  contact: {
    title: 'Contact Poolnautics — Get a Demo or Ask a Question',
    description: 'Get a demo on your own routes, ask a question, or reach Poolnautics support, partnerships and legal. A real person replies within one business day.',
    path: '/contact',
  },
  terms: {
    title: 'Terms of Service — Poolnautics',
    description: 'The terms for using Poolnautics pool service software: accounts, payments through Stripe, your responsibilities as a subscriber, the technician app, and more.',
    path: '/terms',
  },
  privacy: {
    title: 'Privacy Policy — Poolnautics',
    description: 'How Poolnautics collects, uses and protects information from pool service companies, their customers, and the technicians who use the Poolnautics app.',
    path: '/privacy',
  },
  partners: {
    title: 'Partner Program — Poolnautics',
    description: `Get paid when pool pros switch to Poolnautics: a flat ${payoutRange()} for every company you refer, set by its plan and size.`,
    path: '/partners',
  },
  technicianTerms: {
    title: 'Technician App Terms — Poolnautics',
    description: 'What a pool technician agrees to when they first sign in to the Poolnautics app: location on service reports, mileage logging, route review during work hours, and changing location access.',
    path: '/technician-terms',
  },
  deleteAccount: {
    title: 'Delete your account — Poolnautics',
    description: 'How to delete your Poolnautics account, in the app or without it, and what is deleted and what is kept, for technicians using the Poolnautics app and for pool service companies.',
    path: '/delete-account',
  },
  partnerTerms: {
    title: 'Partner Program Terms — Poolnautics',
    description: 'The terms of the Poolnautics Partner Program: referrals, what you earn per paying technician, payouts, disclosure and what partners may not do.',
    path: '/partners/terms',
  },
  partnerKit: {
    title: 'Partner kit — Poolnautics',
    description: 'The Poolnautics partner disclosure kit: the exact words to use on each platform, and what partners can and can\'t say.',
    path: '/partners/kit',
  },
  reviews: {
    title: 'Poolnautics reviews from pool service pros',
    description: 'Reviews of Poolnautics pool service software from verified pool companies, newest first, whatever the rating.',
    path: '/reviews',
  },
  reviewWrite: {
    title: 'Write a review — Poolnautics',
    description: 'Tell other pool pros what you think of Poolnautics.',
    path: '/reviews/write',
    robots: 'noindex,follow',
  },
  // Pre-rendered at build time (entry-server.jsx).
  workflow: {
    title: 'Pool Service Automation & Repair Workflow | Poolnautics',
    description: 'Automate your pool service business without building it yourself. Poolnautics turns repair requests into quotes, work orders and paid invoices, with no Zapier required.',
    path: '/workflow',
  },
  // Pre-rendered at build time (entry-server.jsx). Indexed from Nov 19, 2026 (in the sitemap, linked
  // from the nav's Features menu). It was /billing until Nov 2026.
  billing: {
    title: 'Recurring Billing Software for Pool Service Companies | Poolnautics',
    description: 'Recurring billing software for pool service companies. Give every customer their own rate, billing day and payment terms; Poolnautics sends the invoices and charges autopay cards for you.',
    path: '/recurring-billing',
  },
};

const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, name] = selector.match(/^meta\[(name|property)="([^"]+)"\]$/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const applyRouteMeta = (meta) => {
  const url = SITE_ORIGIN + meta.path;
  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[name="robots"]', 'content', meta.robots || 'index,follow,max-image-preview:large');
  setMeta('meta[property="og:title"]', 'content', meta.ogTitle || meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.ogDescription || meta.description);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[name="twitter:title"]', 'content', meta.ogTitle || meta.title);
  setMeta('meta[name="twitter:description"]', 'content', meta.ogDescription || meta.description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

// path: the route to render. The browser reads its own; the build's pre-renderer passes it (entry-server.jsx).
const App = ({ path: pathProp }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', TWEAK_DEFAULTS.accent);
    root.style.setProperty('--accent-ink', `color-mix(in oklab, ${TWEAK_DEFAULTS.accent} 80%, black)`);
    document.body.dataset.density = TWEAK_DEFAULTS.density;
    document.body.dataset.theme = TWEAK_DEFAULTS.theme;
  }, []);

  useEffect(() => { if (REVIEWS_ON) installReviewLinks(); }, []);

  const path = pathProp ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    let meta = ROUTE_META.home;
    if (isTermsPath(path)) meta = ROUTE_META.terms;
    else if (isPrivacyPath(path)) meta = ROUTE_META.privacy;
    else if (isTechAppPath(path)) meta = ROUTE_META.techApp;
    else if (isContactPath(path)) meta = ROUTE_META.contact;
    else if (isPricingPath(path)) meta = ROUTE_META.pricing;
    else if (isReservePath(path)) meta = ROUTE_META.reserve;
    else if (isAiIntegrationsPath(path)) meta = ROUTE_META.aiIntegrations;
    else if (isPartnersPath(path)) meta = ROUTE_META.partners;
    else if (isPartnerTermsPath(path)) meta = ROUTE_META.partnerTerms;
    else if (isTechnicianTermsPath(path)) meta = ROUTE_META.technicianTerms;
    else if (isDeleteAccountPath(path)) meta = ROUTE_META.deleteAccount;
    else if (isPartnerKitPath(path)) meta = ROUTE_META.partnerKit;
    else if (isWorkflowPath(path)) meta = ROUTE_META.workflow;
    else if (isBillingPath(path)) meta = ROUTE_META.billing;
    else if (isReviewsPath(path)) meta = ROUTE_META.reviews;
    else if (isReviewWritePath(path)) meta = ROUTE_META.reviewWrite;
    // Any other address shows the homepage; keep those copies out of search results.
    else if (path !== '/') meta = { ...ROUTE_META.home, robots: 'noindex,follow' };
    applyRouteMeta(meta);
  }, [path]);

  // The small Google / Apple sign-in window the review popup opens: only "Signing you in…", then it closes.
  if (REVIEWS_ON && typeof window !== 'undefined' && isOAuthReturn()) {
    return <Suspense fallback={null}><ReviewOAuthReturn /></Suspense>;
  }

  if (isTermsPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <TermsPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  if (isPrivacyPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <PrivacyPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  // Brings the homepage's dark nav and the footer itself, like the AI page. Pre-rendered.
  if (isTechAppPath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111318' }} />}>
          <TechAppPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Contact brings its own dark nav and the footer, like pricing.
  if (isContactPath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111318' }} />}>
          <ContactPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // The reviews page brings its own dark nav and the footer, like contact. At /reviews/write the
  // review popup opens over it (installReviewLinks).
  if (isReviewsPath(path) || isReviewWritePath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#08090c' }} />}>
          <ReviewsPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Pricing brings its own dark nav and the footer, like the homepage.
  if (isPricingPath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0F172A' }} />}>
          <PricingPage />
        </Suspense>
      </ErrorBoundary>
    );
  }
  if (isReservePath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0F172A' }} />}>
          <ReservePage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Pre-rendered: the served HTML already holds this page, and main.jsx hydrates it. Keep the
  // tree here the same as entry-server.jsx renders it.
  if (isAiIntegrationsPath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111318' }} />}>
          <AiIntegrationsPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Billing: the AI page's design, so it brings the same dark nav and the footer itself. Pre-rendered.
  if (isBillingPath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111318' }} />}>
          <BillingPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (isPartnersPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <PartnersPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  if (isTechnicianTermsPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <TechnicianTermsPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  if (isDeleteAccountPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <DeleteAccountPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  if (isPartnerTermsPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <PartnerTermsPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  // Pre-rendered, like /ai-and-automations: keep the tree here the same as entry-server.jsx renders it.
  // Brings its own dark nav and the footer.
  if (isWorkflowPath(path)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111318' }} />}>
          <WorkflowPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (isPartnerKitPath(path)) {
    return (
      <>
        <SiteHeader tone="light" />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <PartnerKitPage />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </>
    );
  }

  // The homepage: its own design, nav and styles (pages/landing.jsx). Lazy, so
  // its Tailwind CSS only ever loads here, never on the site's other pages;
  // the fallback holds the hero's colour so nothing flashes white.
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#111318' }} />}>
        <LandingPage />
      </Suspense>
    </ErrorBoundary>
  );
};

// Minimal class-based error boundary so a failed lazy import or runtime error
// inside a route renders a graceful fallback instead of a blank white page.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // Keep this lightweight — wired for an external logger later if needed.
    console.error('Route error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 640, margin: '120px auto', padding: '0 24px', textAlign: 'center', color: 'var(--ink-3)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>
            Something went wrong
          </div>
          <h1 style={{ marginTop: 12, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            This page failed to load.
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6 }}>
            Try refreshing. If the problem persists, head back to{' '}
            <a href="/" style={{ color: 'var(--accent)' }}>the home page</a>.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const RouteFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-5)', fontSize: 14 }}>
    <span style={{
      display: 'inline-block',
      width: 18, height: 18, borderRadius: '50%',
      border: '2px solid var(--line)',
      borderTopColor: 'var(--accent)',
      animation: 'spin 0.8s linear infinite',
    }}/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default App;
