import React, { useState } from 'react';
import { PricingCards } from '../components/sections.jsx';

// Pricing-page-specific FAQs. Kept narrower than the homepage FAQ — these are
// the questions a buyer who's already on /pricing is actually asking.
const FAQ_ITEMS = [
  {
    q: 'What does "free until you get paid" mean?',
    a: 'Core is $0/month with no per-tech fee. We make money on a flat 0.5% platform fee on payments processed through Stripe. Check, cash, and external payments are always free. If you never collect a dollar through PoolLogic, you never pay us a dollar.',
  },
  {
    q: 'How does the per-tech pricing work on Insight and Vision?',
    a: 'You\'re billed for the number of active technicians in your account each month. Add and remove techs freely — your next invoice reflects the change. No seat minimums and no per-stop or per-customer fees.',
  },
  {
    q: 'What\'s the difference between Insight and Vision?',
    a: 'Insight gives you the visibility layer — route insight scoring, daily service audits, operations dashboard, revenue and MRR analytics. Vision adds the AI layer on top — AI-drafted service reports, AI document import, predictive chemistry alerts, and Customer SMS when it launches.',
  },
  {
    q: 'Can I switch tiers later?',
    a: 'Yes, any time. Upgrades take effect immediately; downgrades take effect at the start of your next billing period. We don\'t lock you in.',
  },
  {
    q: 'Is there a setup fee or contract?',
    a: 'No setup fee, no annual contract required. Annual billing saves you ~25% if you want to commit; monthly is fine if you don\'t.',
  },
  {
    q: 'Do you migrate my data from Skimmer, Pool Office Manager, or others?',
    a: 'Yes — free, on every tier. Send us your export and we\'ll handle the import, including customer records, routes, and service history.',
  },
  {
    q: 'What payment processor do you use?',
    a: 'Stripe — specifically Stripe Connect Express. You\'ll onboard your own Stripe account through PoolLogic, and payments flow directly into that account. We never hold your money.',
  },
];

const PricingPage = () => {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 'var(--page-top)', paddingBottom: 'var(--page-bottom)' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)', textWrap: 'balance' }}>
            From your first pool to your fiftieth route.
          </h1>
          <p style={{ marginTop: 18, fontSize: 17, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Free to start, paid only when you collect. Every tier includes a flat <strong style={{ color: 'var(--ink-2)' }}>0.5%</strong> platform fee on Stripe-processed payments. Check, cash, and external payments are always free.
          </p>
        </header>

        {/* Pricing cards */}
        <PricingCards />

        {/* FAQ */}
        <section style={{ marginTop: 112, maxWidth: 760, marginInline: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 32px)', letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--ink)' }}>
              Pricing questions, answered.
            </h2>
            <p style={{ marginTop: 12, fontSize: 14.5, color: 'var(--ink-5)' }}>
              Still wondering about something? <a href="/contact" style={{ color: 'var(--accent)' }}>Talk to us</a>.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={item.q} item={item} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        {/* Final nudge */}
        <div style={{ textAlign: 'center', marginTop: 96, padding: '40px 32px', border: '1px solid var(--line)', borderRadius: 16, background: 'var(--bg-muted, var(--bg))' }}>
          <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 10 }}>
            Want to see it on your routes first?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ink-4)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.55 }}>
            Send us your tech count and what's frustrating you — we'll walk you through PoolLogic on your setup.
          </p>
          <a href="/contact" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>Get a demo →</a>
        </div>
      </div>
    </main>
  );
};

const FAQItem = ({ item, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 16,
          fontWeight: 500,
          color: 'var(--ink)',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span style={{
          display: 'inline-flex', width: 22, height: 22,
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink-5)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform .18s ease',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 0 22px 0', fontSize: 15, color: 'var(--ink-4)', lineHeight: 1.6, maxWidth: 680 }}>
          {item.a}
        </div>
      )}
    </div>
  );
};

export default PricingPage;
