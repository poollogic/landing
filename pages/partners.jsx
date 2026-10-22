import React, { useState } from 'react';
import { I } from '../components/icons.jsx';
import {
  PARTNER, usd, payoutRows, payoutFrom, payoutRange, leftLine,
  perkLine, trialEveryone, TRIAL_ENDS,
} from '../partnerProgram.js';

// /partners — the one link sent to a creator, coach or group admin.
// Every number comes from partnerProgram.js; earnings are examples, never a
// promise. While PARTNER.perkLive is false (the code's 10% off isn't built
// yet), the audience offer is "coming soon" and nothing says it's available today.

// Same small uppercase label the pricing cards use.
const label = { fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' };
const ACCENT_SOFT = 'color-mix(in oklab, var(--accent) 12%, transparent)';
const ACCENT_INK = 'color-mix(in oklab, var(--accent) 75%, black)';

const PartnersPage = () => (
  <main style={{ background: 'var(--bg)', color: 'var(--ink-2)', minHeight: '100vh' }}>
    <Hero />
    <Deal />
    <Earnings />
    <HowItWorks />
    <WhatCounts />
    <WhoFor />
    <WhatYouGet />
    <PartnerFAQ />
    <Close />
  </main>
);

// ───────── shared bits ─────────

const SectionHead = ({ eyebrow, title, children, center = true }) => (
  <div style={{ textAlign: center ? 'center' : 'left', maxWidth: 680, margin: center ? '0 auto 40px' : '0 0 40px' }}>
    <div style={{ ...label, color: 'var(--accent)' }}>{eyebrow}</div>
    <h2 style={{ marginTop: 12, fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--ink)', textWrap: 'balance' }}>
      {title}
    </h2>
    {children && (
      <p style={{ marginTop: 14, fontSize: 15, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 580, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }}>
        {children}
      </p>
    )}
  </div>
);

const Check = ({ size = 18, muted = false }) => (
  <span style={{
    display: 'inline-flex', flexShrink: 0,
    width: size, height: size, borderRadius: '50%',
    background: muted ? 'var(--bg-muted)' : ACCENT_SOFT,
    color: muted ? 'var(--ink-5)' : 'var(--accent)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  }}>
    {muted
      ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
  </span>
);

const Badge = ({ children, tone = 'neutral' }) => (
  <span style={{
    ...label,
    display: 'inline-block',
    background: tone === 'accent' ? ACCENT_SOFT : 'var(--bg-muted)',
    color: tone === 'accent' ? ACCENT_INK : 'var(--ink-4)',
    padding: '4px 9px', borderRadius: 999,
  }}>{children}</span>
);

const card = {
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '28px 24px',
  background: 'var(--bg)',
};

const grid = (min) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
  gap: 16,
});

const ApplyButton = ({ children = 'Apply to partner' }) => (
  <a href={PARTNER.applyHref} className="btn btn-accent btn-lg" style={{ textDecoration: 'none' }}>
    {children}<I.arrowR />
  </a>
);

const Mail = () => (
  <a href={`mailto:${PARTNER.email}`} style={{ color: 'var(--accent)' }}>{PARTNER.email}</a>
);

const Strong = ({ children }) => <strong style={{ color: 'var(--ink-2)' }}>{children}</strong>;

// ───────── 1. hero ─────────

const Hero = () => (
  <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 'var(--page-top)', paddingBottom: 72 }}>
    <div aria-hidden="true" style={{
      position: 'absolute', inset: '0 0 auto 0', height: 480, zIndex: -1, pointerEvents: 'none',
      background: 'radial-gradient(900px 360px at 50% 0%, color-mix(in oklab, var(--accent) 4%, transparent), transparent 70%)',
    }} />
    <div className="container">
      <header style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ ...label, color: 'var(--accent)' }}>PoolLogic Partner Program</div>
        <h1 style={{ marginTop: 16, fontSize: 'clamp(36px, 4.4vw, 56px)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)', textWrap: 'balance' }}>
          Get paid when pool pros switch to PoolLogic.
        </h1>
        <p style={{ marginTop: 18, fontSize: 17, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', textWrap: 'pretty' }}>
          For creators, trainers and industry people whose audience runs pool routes.
          You get <Strong>a flat {payoutRange()} for every company you refer</Strong>, set by its plan and size,
          paid once its first month is paid.
          {PARTNER.perkLive && <> Your audience gets {PARTNER.perk.percentOff}% off their first month with your code.</>}
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 30, justifyContent: 'center', flexWrap: 'wrap' }}>
          <ApplyButton />
          <a href="#how-it-works" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>How it works</a>
        </div>
        <div className="mono" style={{ marginTop: 24, display: 'flex', gap: '6px 18px', flexWrap: 'wrap', justifyContent: 'center', fontSize: 11.5, color: 'var(--ink-5)' }}>
          <span>Free to join</span>
          <span>· Paid monthly</span>
          <span>· US partners only, for now</span>
        </div>
      </header>
    </div>
  </section>
);

// ───────── 2. the deal in three cards ─────────

const Deal = () => {
  const cards = [
    {
      badge: 'For your audience',
      big: `${PARTNER.perk.percentOff}% off`,
      sub: 'their first month, with your code',
      body: PARTNER.perkLive
        ? <>After the {PARTNER.trial.everyoneDays}-day free trial everyone gets, your code takes {PARTNER.perk.percentOff}% off their first paid month.</>
        : <>On top of the {PARTNER.trial.everyoneDays}-day free trial everyone gets. It isn't live yet; we'll tell you before it is, so you can mention it once it's real.</>,
      soon: !PARTNER.perkLive,
    },
    {
      badge: 'Insight company',
      big: <><span style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink-4)', letterSpacing: 0 }}>from </span>{payoutFrom('Insight')}</>,
      sub: 'per company, paid once',
      body: <>The amount depends on the company's size: its active customers in its first paid month. Paid in your next monthly payout once that month is paid.</>,
      accent: true,
    },
    {
      badge: 'Vision company',
      big: <><span style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink-4)', letterSpacing: 0 }}>from </span>{payoutFrom('Vision')}</>,
      sub: 'per company, paid once',
      body: <>More for companies on Vision, up to {usd(Math.max(...PARTNER.payouts.Vision))} for the biggest. Companies above {PARTNER.customAbove} active customers are a custom deal.</>,
    },
  ];
  return (
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="container">
        <SectionHead eyebrow="The deal" title="A flat amount per company. No math required." />
        <div style={grid(260)}>
          {cards.map((c) => (
            <div key={c.badge} style={{
              ...card,
              border: c.accent ? '1px solid var(--accent)' : card.border,
              boxShadow: c.accent ? '0 12px 32px -12px rgba(59,130,246,.35)' : 'none',
            }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge>{c.badge}</Badge>
                {c.soon && <Badge tone="accent">Coming soon</Badge>}
              </div>
              <div style={{ marginTop: 18, fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', color: c.soon ? 'var(--ink-5)' : 'var(--ink)', lineHeight: 1 }}>{c.big}</div>
              <div style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>{c.sub}</div>
              <p style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink-4)', lineHeight: 1.55 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ───────── 3. what you could earn ─────────

const Earnings = () => {
  const cell = { padding: '11px 0', borderTop: '1px solid var(--line)', fontSize: 14, color: 'var(--ink-3)' };
  const num = { ...cell, fontWeight: 600, color: 'var(--ink)', textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
  const head = { ...label, color: 'var(--ink-5)', paddingBottom: 10, textAlign: 'right' };
  return (
    <section className="section" style={{ background: 'var(--bg-soft)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '32px 60px', alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow="What you earn" title="One flat amount per company, paid once." center={false}>
              Find the company's plan and its active customers in its first paid month; that's what you earn.
              No percentages to work out, and nothing that depends on how much the company bills its customers.
            </SectionHead>
          </div>

          <div style={{ ...card, padding: '24px 24px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Badge>Per referred company</Badge>
              <span style={{ fontSize: 12.5, color: 'var(--ink-5)' }}>Paid once, after its first paid month</span>
            </div>
            <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...head, textAlign: 'left' }}>Active customers</th>
                  <th style={head}>Insight</th>
                  <th style={head}>Vision</th>
                </tr>
              </thead>
              <tbody>
                {payoutRows().map((r) => (
                  <tr key={r.customers}>
                    <td style={cell}>{r.customers}</td>
                    <td style={num}>{usd(r.insight)}</td>
                    <td style={num}>{usd(r.vision)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={cell}>More than {PARTNER.customAbove}</td>
                  <td colSpan={2} style={{ ...cell, textAlign: 'right', color: 'var(--ink-4)' }}>Custom deal</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-5)', lineHeight: 1.55 }}>
              Monthly or yearly billing, the amount is the same. It stays earned if the company keeps paying to day {PARTNER.clawbackBeforeDay}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ───────── 4. how it works ─────────

const HowItWorks = () => {
  const steps = [
    {
      t: 'Apply',
      d: 'Five minutes. Tell us who you reach and how you\'d share PoolLogic. We reply within 3 business days.',
      icon: <I.userPlus />,
    },
    {
      t: 'Get your page and code',
      d: <>Your own page at <span className="mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{PARTNER.pageBase}yourname</span>, and a code your audience can say out loud, like <span className="mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>YOURNAME</span>.</>,
      icon: <I.qr />,
    },
    {
      t: 'Share it your way',
      d: <>Videos, podcasts, groups, conversations at the supply house. Say you're paid at the start of every mention; the <a href="/partners/kit" style={{ color: 'var(--accent)' }}>partner kit</a> has the exact words.</>,
      icon: <I.sparkle />,
    },
    {
      t: 'Get paid monthly',
      d: <>When a company's first month is paid, its flat amount goes into your next payout, by the {PARTNER.payout.byDay}, once you're owed {usd(PARTNER.payout.minimum)}.{' '}
        {PARTNER.dashboardLive ? 'Watch it all on your private dashboard.' : 'We email you your numbers each month.'}</>,
      icon: <I.billing />,
    },
  ];
  return (
    <section id="how-it-works" className="section" style={{ scrollMarginTop: 32 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px 60px' }}>
          <div>
            <div style={{ ...label, color: 'var(--accent)' }}>How it works</div>
            <h2 style={{ marginTop: 12, fontSize: 'clamp(24px, 3vw, 34px)', letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--ink)', textWrap: 'balance' }}>
              Apply once. Share the way you already do.
            </h2>
            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.55, maxWidth: 420 }}>
              No quotas and no scripts. You talk to pool pros already; when one of them is fed up with their software, send them your link.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {steps.map((s, i) => (
              <div key={s.t} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16, padding: '22px 0', borderTop: '1px solid var(--line)' }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-5)', paddingTop: 6 }}>0{i + 1}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 7, background: ACCENT_SOFT, color: 'var(--accent)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{s.t}</h3>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.6 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ───────── 5. what counts: a company that pays for a plan ─────────

const WhatCounts = () => {
  const timeline = [
    ['Signs up', 'with your link or code'],
    [`${PARTNER.trial.everyoneDays}-day trial`, 'free, no credit card'],
    ['Chooses a plan', 'Insight or Vision, priced by active customers'],
    ['First month paid', 'its flat amount in your next payout'],
  ];
  return (
    <section id="what-counts" className="section" style={{ background: 'var(--bg-soft)', scrollMarginTop: 32 }}>
      <div className="container">
        <SectionHead eyebrow="What counts" title="A company that pays for a plan.">
          A company you referred counts once it has paid for its first month on a PoolLogic plan, after its trial.
          Its plan and active customers at that point set your amount. That's usually two to three months after sign-up.
        </SectionHead>
        <div style={grid(220)}>
          {timeline.map(([big, sub], i) => (
            <div key={big} style={{ ...card, background: 'var(--bg)', padding: '22px 22px' }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-5)' }}>0{i + 1}</span>
              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)' }}>{big}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--ink-5)', lineHeight: 1.5 }}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, ...card, padding: '20px 24px', background: 'var(--bg)' }}>
          <div style={{ ...label, color: 'var(--ink-5)', marginBottom: 8 }}>The company has to stay</div>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
            A company's amount is taken back if, before <Strong>day {PARTNER.clawbackBeforeDay}</Strong> from its first paid month,
            {' '}{leftLine()}, or its first payment is refunded or charged back. Anything taken back comes off your next payout.
          </p>
        </div>
      </div>
    </section>
  );
};

// ───────── 6. who it's for ─────────

const WhoFor = () => {
  const yes = [
    'Pool-business YouTubers and podcasters',
    'Route coaches and trainers',
    'Facebook group and forum admins',
    'Supply-house reps',
    'Accountants and bookkeepers for pool companies',
  ];
  const no = [
    'Coupon and deal sites',
    'Paid ads on the PoolLogic name',
    'Cold email or text lists',
    'Audiences of homeowners rather than pool companies',
  ];
  const List = ({ items, muted }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
      {items.map((t) => (
        <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, color: muted ? 'var(--ink-4)' : 'var(--ink-3)', lineHeight: 1.45 }}>
          <Check muted={muted} />{t}
        </div>
      ))}
    </div>
  );
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Who it's for" title="People pool pros already listen to." />
        <div style={grid(300)}>
          <div style={card}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>A good fit</h3>
            <List items={yes} />
          </div>
          <div style={{ ...card, background: 'var(--bg-soft)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Not a fit</h3>
            <List items={no} muted />
          </div>
        </div>
      </div>
    </section>
  );
};

// ───────── 7. what you get ─────────

const WhatYouGet = () => {
  const items = [
    { t: 'Your own page', d: <>A page for your audience at <span className="mono" style={{ fontSize: 12.5 }}>{PARTNER.pageBase}yourname</span>, with your name and the offer on it.</>, icon: <I.dashboard /> },
    { t: 'A code', d: 'One your audience can say out loud and type at sign-up, plus one per video if you want to see what each brings in.', icon: <I.qr /> },
    PARTNER.dashboardLive
      ? { t: 'A private dashboard', d: 'Clicks, sign-ups, paying companies and what you\'ve earned, on a private link. No login.', icon: <I.chart /> }
      : { t: 'Your numbers', d: 'Sign-ups, paying companies and what you\'ve earned, by email each month. A private dashboard is coming.', icon: <I.chart /> },
    { t: 'A partner kit', d: 'Logo, screenshots and finished screen recordings, so you never need to film real customer data.', icon: <I.estimate /> },
    { t: 'A direct line to the founder', d: 'Questions from your audience, feature requests, a demo for a viewer: you talk to the person who builds it.', icon: <I.phone /> },
  ];
  return (
    <section className="section" style={{ background: 'var(--bg-soft)' }}>
      <div className="container">
        <SectionHead eyebrow="What you get" title="Everything you need to mention it well." />
        <div style={grid(300)}>
          {items.map((it) => (
            <div key={it.t} style={{ ...card, padding: '22px 22px', background: 'var(--bg)' }}>
              <span style={{ display: 'inline-flex', width: 32, height: 32, borderRadius: 8, background: ACCENT_SOFT, color: 'var(--accent)', alignItems: 'center', justifyContent: 'center' }}>{it.icon}</span>
              <h3 style={{ marginTop: 14, fontSize: 16, fontWeight: 600 }}>{it.t}</h3>
              <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.55 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ───────── 8. FAQ ─────────

const FAQ_ITEMS = [
  {
    q: 'When am I paid?',
    a: <>Monthly, by the {PARTNER.payout.byDay}, once you're owed at least {usd(PARTNER.payout.minimum)} and we have your W-9. A company's amount goes into the payout after its first paid month. We pay by {PARTNER.payout.methods}.</>,
  },
  {
    q: 'What does my audience get?',
    a: PARTNER.perkLive
      ? <>Everyone gets {trialEveryone()}. {TRIAL_ENDS} With your code, they also get {perkLine()}.</>
      : <>Everyone gets {trialEveryone()}. With your code, they'll also get {perkLine()}. That's coming soon; we'll tell you before it's live so you only ever mention what's real.</>,

  },
  {
    q: 'What about very large companies?',
    a: <>Companies with more than {PARTNER.customAbove} active customers are priced individually, so the standard offer doesn't apply. If you're bringing in an operation that size, talk to us first and we'll agree your terms: <Mail />.</>,
  },
  {
    q: 'How long does my link last?',
    a: <>A click on your link is remembered for {PARTNER.linkDays} days on that device. Your code works any time: if someone signs up months later and types it in, the company is yours.</>,
  },
  {
    q: 'Do existing PoolLogic customers count?',
    a: 'No. Only new companies count, and not your own company, your employees, or a company that already has or recently closed a PoolLogic account.',
  },
  {
    q: 'Do I have to say I\'m paid?',
    a: <>Yes, every time, at the start of the mention. It's the law (the FTC's Endorsement Guides) and it's in the terms. We give you the exact words for each platform in the <a href="/partners/kit" style={{ color: 'var(--accent)' }}>partner kit</a>.</>,
  },
  {
    q: 'What about taxes?',
    a: 'You\'re an independent contractor. We need a W-9 before your first payout, and we send a 1099-NEC where the law requires one. Ask your own tax advisor how to report it.',
  },
  {
    q: 'Can I run ads?',
    a: 'Not on the PoolLogic name: no bidding on "PoolLogic" or close variations in search ads, and no PoolLogic in your domain, handle or social names. Promoting your own content that mentions PoolLogic is fine.',
  },
  {
    q: 'Who can join?',
    a: <>Partners in {PARTNER.country} only, for now, aged 18 or over. Your audience should be people who run or work at pool service companies.</>,
  },
  {
    q: 'What happens if I stop posting?',
    a: <>Nothing changes for companies you've already referred: you're still paid for each one once its first month is paid, even if either of us ends the partnership without cause. Only a breach of the terms forfeits earnings.</>,
  },
];

const PartnerFAQ = () => (
  <section className="section">
    <div className="container">
    <div style={{ maxWidth: 760, marginInline: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 32px)', letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--ink)' }}>
          Partner questions, answered.
        </h2>
        <p style={{ marginTop: 12, fontSize: 14.5, color: 'var(--ink-5)' }}>
          The full rules are in the <a href="/partners/terms" style={{ color: 'var(--accent)' }}>program terms</a>. Anything else: <Mail />.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {FAQ_ITEMS.map((item, i) => <FAQItem key={item.q} item={item} defaultOpen={i === 0} />)}
      </div>
    </div>
    </div>
  </section>
);

// Same accordion row as the /pricing FAQ.
const FAQItem = ({ item, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', background: 'transparent', border: 'none', padding: '20px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          fontSize: 16, fontWeight: 500, color: 'var(--ink)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        }}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span style={{
          display: 'inline-flex', width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink-5)', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform .18s ease', flexShrink: 0,
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

// ───────── 9. close ─────────

const Close = () => (
  <section className="section" style={{ paddingTop: 0 }}>
    <div className="container">
      <div style={{ textAlign: 'center', padding: '40px 32px', border: '1px solid var(--line)', borderRadius: 16, background: 'var(--bg-muted, var(--bg))' }}>
        <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 10 }}>
          Know pool pros who are fed up with their software?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-4)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.55 }}>
          Apply in five minutes. We reply within 3 business days.
        </p>
        <ApplyButton />
        <p style={{ marginTop: 18, fontSize: 13.5, color: 'var(--ink-5)' }}>
          {PARTNER.dashboardLive ? 'Already a partner? Email us for your dashboard link: ' : 'Already a partner? '}
          <Mail />
        </p>
      </div>

      {/* Disclosure */}
      <p style={{ marginTop: 40, fontSize: 12.5, color: 'var(--ink-5)', lineHeight: 1.6, textAlign: 'center', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', textWrap: 'pretty' }}>
        PoolLogic partners are independent: they aren't PoolLogic employees, and they earn a referral payment when a company they refer pays for a PoolLogic plan.
        See the <a href="/partners/terms" style={{ color: 'var(--ink-3)', textDecoration: 'underline' }}>program terms</a> and the{' '}
        <a href="/partners/kit" style={{ color: 'var(--ink-3)', textDecoration: 'underline' }}>disclosure kit</a>.
      </p>
    </div>
  </section>
);

export default PartnersPage;
