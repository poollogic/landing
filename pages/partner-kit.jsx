import React, { useState } from 'react';
import { PARTNER } from '../partnerProgram.js';

// /partners/kit — the disclosure kit: the exact words partners use, where they
// go, and what they can and can't say. The same wording goes in the invitation
// email and (later) the partner dashboard.

const label = { fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' };
const ACCENT_SOFT = 'color-mix(in oklab, var(--accent) 12%, transparent)';
const card = { border: '1px solid var(--line)', borderRadius: 16, padding: '24px', background: 'var(--bg)' };
const grid = (min) => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`, gap: 16 });

const EXAMPLE_PAGE = `${PARTNER.pageBase}yourname`;
const EXAMPLE_CODE = 'YOURCODE';

const PLATFORMS = [
  {
    where: 'YouTube and video',
    say: 'At the start of the mention, out loud:',
    copy: 'I get paid if you sign up with my link or code.',
    also: [
      <>On screen at the same time: <strong>Paid partnership with PoolLogic</strong></>,
      'First line of the description, above "more": the paid-link line below',
      'Tick YouTube\'s paid-promotion box too (it isn\'t enough on its own)',
    ],
  },
  {
    where: 'Instagram and TikTok',
    say: 'Turn on the platform\'s paid-partnership label, and start the caption with:',
    copy: `#ad I get paid if you sign up with my link or code: ${EXAMPLE_PAGE} (code ${EXAMPLE_CODE})`,
    also: ['Say it out loud at the start of the video as well'],
  },
  {
    where: 'Facebook groups and newsletters',
    say: 'Start the post or the mention with:',
    copy: `Ad: I earn a commission if you sign up with my link or code: ${EXAMPLE_PAGE} (code ${EXAMPLE_CODE})`,
    also: ['Put it before anything else you say about PoolLogic'],
  },
  {
    where: 'Podcasts',
    say: 'Spoken at the start of the mention, before you talk about PoolLogic:',
    copy: 'I get paid if you sign up with my link or code.',
    also: ['Put the paid-link line in the show notes too'],
  },
];

const DESCRIPTION_LINE = `Paid link: I earn a commission if you sign up → ${EXAMPLE_PAGE} (code ${EXAMPLE_CODE})`;

const NOT_ENOUGH = [
  '"Affiliate link" on its own',
  '#partner, #sp or #affiliate',
  'A disclosure only in the comments',
  'A disclosure only at the end, or only below "more"',
  'The platform\'s paid-partnership label without saying it yourself',
];

// The code's offer appears only once it's live (PARTNER.perkLive).
const OK_TO_SAY = [
  ...(PARTNER.perkLive ? [
    `"${PARTNER.perk.percentOff}% off your first month with my code"`,
  ] : []),
  'Nothing is charged when the trial ends; you choose a plan to keep going',
  `A ${PARTNER.trial.everyoneDays}-day free trial, no credit card`,
  'Priced by your active customers, with unlimited technicians on every plan',
  'They import your customers for you',
  'What you actually like about it, if you use it',
];

const NEEDS_APPROVAL = [
  ...(PARTNER.perkLive ? [] : ['Any discount or sign-up offer, until we tell you it\'s live']),
  '"Free processing" (Stripe\'s fees still apply)',
  'Savings figures or "you\'ll save $X"',
  'Comparisons that name a competitor',
  'Anything implying you work for or speak for PoolLogic',
  'Saying you use PoolLogic, if you don\'t',
];

const PartnerKitPage = () => (
  <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
    <div className="container" style={{ paddingTop: 'var(--page-top)', paddingBottom: 'var(--page-bottom)' }}>
      {/* Header */}
      <header style={{ maxWidth: 720, marginBottom: 48 }}>
        <a href="/partners" className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-5)', textDecoration: 'none', marginBottom: 20 }}>
          ← Partner Program
        </a>
        <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)', textWrap: 'balance' }}>
          Partner kit
        </h1>
        <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 620 }}>
          The exact words to use, where they go, and what you can say about PoolLogic. Every time you mention PoolLogic, say you're paid, at the start, in words. It's the law, and your audience trusts you more for it.
        </p>
      </header>

      {/* The one rule */}
      <div style={{ ...card, padding: '28px', border: '1px solid var(--accent)', boxShadow: '0 12px 32px -12px rgba(59,130,246,.35)' }}>
        <div style={{ ...label, color: 'var(--accent)' }}>The one rule</div>
        <p style={{ marginTop: 10, fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 640 }}>
          Say it at the start of the mention, in words your audience will hear or see before anything else about PoolLogic:
        </p>
        <CopyLine text="I get paid if you sign up with my link or code." big />
        <p style={{ marginTop: 12, fontSize: 13.5, color: 'var(--ink-5)', lineHeight: 1.55 }}>
          This is for commission partners. Use "Sponsored" only when PoolLogic pays you a flat fee for a specific piece of content.
        </p>
      </div>

      {/* Description line */}
      <section style={{ padding: '56px 0 0' }}>
        <KitHead title="Your description line">
          The first line of any description, caption or show notes, above the "more" cut-off. Swap in your own page and code.
        </KitHead>
        <CopyLine text={DESCRIPTION_LINE} />
      </section>

      {/* Per platform */}
      <section style={{ padding: '56px 0 0' }}>
        <KitHead title="Platform by platform" />
        <div style={grid(420)}>
          {PLATFORMS.map((p) => (
            <div key={p.where} style={card}>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>{p.where}</h3>
              <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.55 }}>{p.say}</p>
              <CopyLine text={p.copy} />
              <ul style={{ margin: '14px 0 0', paddingLeft: 18, fontSize: 13.5, color: 'var(--ink-4)', lineHeight: 1.55 }}>
                {p.also.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Never enough alone */}
      <section style={{ padding: '56px 0 0' }}>
        <KitHead title="Never enough on its own">
          These can sit alongside the words above, but they don't count as disclosure by themselves.
        </KitHead>
        <div style={{ ...card, background: 'var(--bg-soft)' }}>
          <List items={NOT_ENOUGH} tone="no" />
        </div>
      </section>

      {/* What you can say */}
      <section style={{ padding: '56px 0 0' }}>
        <KitHead title="What you can say" />
        <div style={grid(320)}>
          <div style={card}>
            <div style={{ ...label, color: 'var(--accent)', marginBottom: 14 }}>OK to say</div>
            <List items={OK_TO_SAY} tone="yes" />
          </div>
          <div style={{ ...card, background: 'var(--bg-soft)' }}>
            <div style={{ ...label, color: 'var(--ink-5)', marginBottom: 14 }}>Not without our approval</div>
            <List items={NEEDS_APPROVAL} tone="no" />
          </div>
        </div>
        <div style={{ marginTop: 16, ...card, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 7, background: 'var(--bg-muted)', color: 'var(--ink-2)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>
          </span>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', fontWeight: 600 }}>
            Never film real customer data.
            <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}> Use the screenshots and recordings in the kit.</span>
          </p>
        </div>
      </section>

      {/* Downloads */}
      <section style={{ padding: '56px 0 0' }}>
        <KitHead title="Logo, screenshots and recordings" />
        <div style={grid(220)}>
          {['Logo', 'Screenshots', 'Screen recordings'].map((t) => (
            <div key={t} style={{ ...card, borderStyle: 'dashed', background: 'var(--bg-soft)', textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>{t}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-5)' }}>Not posted yet</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 14.5, color: 'var(--ink-4)', lineHeight: 1.6 }}>
          Ask <a href={`mailto:${PARTNER.email}`} style={{ color: 'var(--accent)' }}>{PARTNER.email}</a> for the kit files. Send us your first piece of content before it goes live and we'll check the disclosure and the claims.
        </p>
      </section>

      <p style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-5)', lineHeight: 1.6 }}>
        This kit summarizes the disclosure and claims sections of the <a href="/partners/terms" style={{ color: 'var(--ink-3)', textDecoration: 'underline' }}>program terms</a>, which follow the FTC's Endorsement Guides (16 CFR Part 255). Where they differ, the terms apply.
      </p>
    </div>
  </main>
);

const KitHead = ({ title, children }) => (
  <div style={{ marginBottom: 20, maxWidth: 640 }}>
    <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)' }}>{title}</h2>
    {children && <p style={{ marginTop: 8, fontSize: 15, color: 'var(--ink-4)', lineHeight: 1.55 }}>{children}</p>}
  </div>
);

const List = ({ items, tone }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
    {items.map((t) => (
      <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, color: tone === 'yes' ? 'var(--ink-3)' : 'var(--ink-4)', lineHeight: 1.45 }}>
        <span style={{
          display: 'inline-flex', flexShrink: 0, width: 18, height: 18, borderRadius: '50%', marginTop: 1,
          background: tone === 'yes' ? ACCENT_SOFT : 'var(--bg-muted)',
          color: tone === 'yes' ? 'var(--accent)' : 'var(--ink-5)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {tone === 'yes'
            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>}
        </span>
        {t}
      </div>
    ))}
  </div>
);

// A line of wording with a Copy button.
const CopyLine = ({ text, big = false }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked: the text is still selectable */ }
  };
  return (
    <div style={{
      marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between',
      padding: big ? '14px 14px 14px 18px' : '10px 10px 10px 14px',
      border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-soft)',
    }}>
      <span style={{ fontSize: big ? 18 : 14, fontWeight: big ? 600 : 500, color: 'var(--ink)', lineHeight: 1.45, letterSpacing: big ? '-0.01em' : 0, overflowWrap: 'anywhere' }}>
        {text}
      </span>
      <button type="button" onClick={copy} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }} aria-label={`Copy: ${text}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

export default PartnerKitPage;
