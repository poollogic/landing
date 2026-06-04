// Landing page sections

import React, { useState, useEffect, useRef } from 'react';
import { Logo, I, PoolDropIcon } from './icons.jsx';
import { PoolLogicApp, RouteCard, InvoiceCard, ServiceReportCard, DashboardCard } from './product-ui.jsx';

const Nav = ({ accent }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'color-mix(in oklab, var(--bg) 80%, transparent)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(160%) blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(160%) blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'all .2s ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'relative' }}>
        <a href="/" aria-label="PoolLogic — home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Logo size={38} gap={6} fontSize={scrolled ? 18 : 21} hideIcon={scrolled} />
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 14, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {[
          ['Product', '/#features'],
          ['Solutions', '/#solutions'],
          ['Pricing', '/pricing'],
          ['Customers', '/#switching'],
          ['Resources', '/#faq']].
          map(([l, href]) =>
          <a key={l} href={href} style={{ padding: '8px 14px', color: 'var(--ink-3)', borderRadius: 7, textDecoration: 'none' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{l}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="https://app.poollogic.app" className="btn btn-ghost btn-sm nav-signin" style={{ textDecoration: 'none' }}>Sign in</a>
          <a href="/contact" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Get a demo<I.arrowR /></a>
        </div>
      </div>
    </nav>);

};

const Hero = ({ layout, headline, subhead }) => {
  const isSplit = layout === 'split';
  const isCenter = layout === 'center';
  const isProof = layout === 'proof';
  const isStacked = !isSplit && !isCenter && !isProof;

  const fillsViewport = isCenter || isStacked;

  return (
    <>
      <section className="hero-section" style={{
        paddingTop: fillsViewport ? 0 : 72,
        paddingBottom: fillsViewport ? 0 : 60,
        position: 'relative',
        overflow: 'hidden',
        minHeight: fillsViewport ? 'calc(100vh - 64px)' : undefined,
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Backdrop wash */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: 'radial-gradient(800px 400px at 50% -100px, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', width: '100%' }}>
          {isSplit ?
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56, alignItems: 'center', width: '100%' }}>
              <div className="rise">
                <HeroBadge />
                <h1 style={{ marginTop: 22, textWrap: 'balance' }}>{headline}</h1>
                <p style={{ fontSize: 19, color: 'var(--ink-4)', marginTop: 22, maxWidth: 520, lineHeight: 1.5 }}>{subhead}</p>
                <HeroCTAs />
                <HeroProof centered={false} />
              </div>
              <div className="rise" style={{ animationDelay: '.1s', position: 'relative' }}>
                <ProductShowcase compact />
              </div>
            </div> :
          isProof ?
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center', width: '100%' }}>
              <div className="rise">
                <HeroBadge />
                <h1 style={{ marginTop: 22, textWrap: 'balance' }}>{headline}</h1>
                <p style={{ fontSize: 19, color: 'var(--ink-4)', marginTop: 22, maxWidth: 540, lineHeight: 1.5 }}>{subhead}</p>
                <HeroCTAs />
              </div>
              <div className="rise" style={{ animationDelay: '.1s' }}>
                <ProofChecklist />
              </div>
            </div> :

          <div style={{ width: '100%', position: 'relative' }}>
            {/* Floating UI fragments — only on stacked layout where there's empty side space */}
            {isStacked && <HeroFloaters />}
            <div className="hero-content rise" style={{ textAlign: (isCenter || isStacked) ? 'center' : 'left', maxWidth: isCenter ? 880 : 820, margin: (isCenter || isStacked) ? '0 auto' : 0, position: 'relative', zIndex: 1 }}>
              {/* HIDDEN: HeroAuthorityStrip — "Trusted by pool pros — 100,000+ service reports sent weekly".
                  Restore when we have a defensible number. */}
              {false && <HeroAuthorityStrip centered={isCenter || isStacked}/>}
              <h1 style={{ marginTop: 22, maxWidth: (isCenter || isStacked) ? 760 : 820, marginLeft: (isCenter || isStacked) ? 'auto' : 0, marginRight: (isCenter || isStacked) ? 'auto' : 0, textWrap: 'balance' }}>{headline}</h1>
              <p style={{ fontSize: 17.5, color: 'var(--ink-4)', marginTop: 20, maxWidth: 560, marginLeft: (isCenter || isStacked) ? 'auto' : 0, marginRight: (isCenter || isStacked) ? 'auto' : 0, lineHeight: 1.55 }}>{subhead}</p>
              <div style={{ display: 'flex', justifyContent: (isCenter || isStacked) ? 'center' : 'flex-start' }}>
                <HeroCTAs />
              </div>
              <HeroProof centered={isCenter || isStacked} />
            </div>
          </div>
          }
        </div>
      </section>
    </>);

};

// Animated search field that types through a list of rhetorical queries one by one,
// holds, then deletes — visually previews the "everything is searchable" promise.
const TypingSearchQuery = ({ queries }) => {
  const [text, setText] = useState('');
  const [queryIndex, setQueryIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | holding | deleting | between
  const scrollRef = useRef(null);

  // Real <input> behavior: when text exceeds the visible width, scroll the
  // content left so the caret stays pinned to the right edge.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [text]);

  useEffect(() => {
    const current = queries[queryIndex];
    let timer;
    if (phase === 'typing') {
      if (text.length < current.length) {
        // Slight per-char jitter so it feels human, not metronomic
        const delay = 32 + Math.random() * 40;
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), delay);
      } else {
        timer = setTimeout(() => setPhase('holding'), 1600);
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 1400);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 18);
      } else {
        timer = setTimeout(() => setPhase('between'), 350);
      }
    } else if (phase === 'between') {
      setQueryIndex((queryIndex + 1) % queries.length);
      setPhase('typing');
    }
    return () => clearTimeout(timer);
  }, [text, phase, queryIndex, queries]);

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      width: '100%', maxWidth: 580,
      padding: '12px 16px',
      background: 'var(--bg)',
      border: '1px solid var(--line)',
      borderRadius: 999,
      boxShadow: '0 1px 2px rgba(15, 23, 42, .04)',
      textAlign: 'left',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-6)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="11" cy="11" r="7"/>
        <path d="M21 21l-4.3-4.3"/>
      </svg>
      <span ref={scrollRef} className="hide-scrollbar" style={{ flex: 1, minWidth: 0, fontSize: 15, color: 'var(--ink-3)', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden' }}>
        {text}
        <span style={{
          display: 'inline-block',
          width: 1.5, height: '1em',
          background: 'var(--accent)',
          marginLeft: 1,
          verticalAlign: 'text-bottom',
          animation: 'caret-blink 1s steps(2) infinite',
        }}/>
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 20, height: 20,
        padding: '0 6px',
        border: '1px solid var(--bg-muted)',
        borderRadius: 5,
        background: 'var(--bg-soft)',
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        fontSize: 11, color: 'var(--ink-5)',
        lineHeight: 1, flexShrink: 0,
      }}>/</span>
    </div>
  );
};

// Rhetorical question styled to mirror the app's search/filter input — visually previews
// the "everything is searchable" promise the demo below pays off.
const SearchQuery = ({ text }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 12,
    width: '100%', maxWidth: 580,
    padding: '12px 16px',
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    borderRadius: 999,
    boxShadow: '0 1px 2px rgba(15, 23, 42, .04)',
    textAlign: 'left',
  }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-6)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.3-4.3"/>
    </svg>
    <span style={{ flex: 1, fontSize: 15, color: 'var(--ink-3)', fontWeight: 500, lineHeight: 1.4 }}>
      {text}
    </span>
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 20, height: 20,
      padding: '0 6px',
      border: '1px solid var(--bg-muted)',
      borderRadius: 5,
      background: 'var(--bg-soft)',
      fontFamily: "'Geist Mono', ui-monospace, monospace",
      fontSize: 11, color: 'var(--ink-5)',
      lineHeight: 1, flexShrink: 0,
    }}>/</span>
  </div>
);

// Authority strip: usage stat above the H1. Primes credibility before the headline lands.
const HeroAuthorityStrip = ({ centered }) => (
  <div style={{
    display: 'flex',
    justifyContent: centered ? 'center' : 'flex-start',
  }}>
    <div className="authority-strip" style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      fontSize: 12.5, color: 'var(--ink-4)',
    }}>
      {/* avatar stack */}
      <div style={{ display: 'flex' }}>
        {[
          'linear-gradient(135deg, color-mix(in oklab, var(--brand-blue) 60%, white), var(--brand-blue))',
          'linear-gradient(135deg, var(--brand-green), color-mix(in oklab, var(--brand-green) 65%, black))',
          'linear-gradient(135deg, var(--brand-orange), color-mix(in oklab, var(--brand-orange) 65%, black))',
          'linear-gradient(135deg, color-mix(in oklab, var(--brand-teal) 60%, white), var(--brand-teal))',
        ].map((bg, i) => (
          <span key={i} style={{
            width: 22, height: 22, borderRadius: '50%',
            background: bg,
            border: '2px solid var(--bg)',
            marginLeft: i === 0 ? 0 : -7,
          }}/>
        ))}
      </div>
      <span>
        Trusted by pool pros — <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>100,000+ service reports</strong> sent weekly
      </span>
    </div>
  </div>
);

// Floating UI fragments: drift in around the centered headline.
// On scroll, each card "blows off" the page on its own trajectory — staggered delay,
// asymmetric direction, accelerating ease-in, and a touch of motion blur near the end.
// Inner div keeps the gentle bob; outer wrapper handles the scroll-driven exit.
const HeroFloaters = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        raf = null;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  // Animation doesn't start until the user has scrolled past SCROLL_START.
  // By then the top cards have naturally scrolled out of the viewport, so the visible
  // motion is concentrated on the bottom cards.
  // SCROLL_RANGE is wide enough that rotation/translation are still actively progressing
  // as the cards leave the viewport — they don't freeze mid-flight.
  const SCROLL_START = 180;
  const SCROLL_RANGE = 360;
  const progress = Math.max(0, Math.min(1, (scrollY - SCROLL_START) / SCROLL_RANGE));

  // inv card uses its own progress that starts immediately on scroll, so the user
  // sees it fly off the page the moment they begin scrolling.
  const INV_RANGE = 260;
  const invProgress = Math.max(0, Math.min(1, scrollY / INV_RANGE));

  // chem also flies away early but with a brief delay (delay: 0.20 below means
  // motion begins at ~140px of scroll). Range is wide so the drift off-screen is slow.
  const CHEM_RANGE = 700;
  const chemProgress = Math.max(0, Math.min(1, scrollY / CHEM_RANGE));

  // Each card has its own motion *functions* so the horizontal path is hand-tuned:
  //   txFn(p) — horizontal displacement curve (px)
  //   tyFn(p) — vertical displacement curve (px)
  //   rotFn(p) — rotation curve (deg)
  const PI = Math.PI;
  const blow = (prog, { delay, txFn, tyFn, rotFn, fadeStart, fadeRate }) => {
    const pRaw = prog - delay;
    const p = Math.max(0, Math.min(1, pRaw / Math.max(0.01, 1 - delay)));
    const fade = p < fadeStart ? 1 : Math.max(0, 1 - (p - fadeStart) * fadeRate);
    return {
      tx: txFn(p),
      ty: tyFn(p),
      rot: rotFn(p),
      opacity: fade,
    };
  };

  // Top cards (chem, inv) get minimal movement — by the time the animation kicks in,
  // they're already off-screen from natural page scroll. Bottom cards carry the visible motion.

  // chem (top-left) — flies up-and-to-the-left with a counter-clockwise spin.
  // delay: 0.20 within chemProgress = brief pause before motion starts on scroll.
  const chem = blow(chemProgress, {
    delay: 0.20,
    txFn: (p) => -150 * Math.pow(p, 1.6),
    tyFn: (p) => -240 * Math.pow(p, 1.7),
    rotFn: (p) => -28 * p,
    fadeStart: 0.6, fadeRate: 2.5,
  });

  // inv (top-right) — flies up-and-to-the-right with a clockwise spin, immediately
  // on scroll. Uses invProgress so the exit isn't gated on SCROLL_START.
  const inv = blow(invProgress, {
    delay: 0.00,
    txFn: (p) => 130 * Math.pow(p, 1.5),
    tyFn: (p) => -220 * Math.pow(p, 1.7),
    rotFn: (p) => 22 * p,
    fadeStart: 0.55, fadeRate: 2.4,
  });

  // rep (bottom-right) — drift up and to the right, clockwise spin.
  // Linear rotation keeps the spin alive all the way out of the viewport.
  const rep = blow(progress, {
    delay: 0.10,
    txFn: (p) => 130 * (1 - Math.pow(1 - p, 2.4)),
    tyFn: (p) => -300 * Math.pow(p, 1.9),
    rotFn: (p) => 34 * p,
    fadeStart: 0.68, fadeRate: 2.8,
  });

  const checkBadge = (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 18, borderRadius: '50%',
      background: 'var(--brand-green)', color: '#fff', flexShrink: 0,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 6"/>
      </svg>
    </span>
  );

  const wrap = (pos, t) => ({
    position: 'absolute',
    ...pos,
    transform: `translate3d(${t.tx}px, ${t.ty}px, 0) rotate(${t.rot}deg)`,
    opacity: t.opacity,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
    zIndex: 0,
  });

  const card = {
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    borderRadius: 12,
    boxShadow: '0 24px 48px -24px rgba(15, 23, 42, .18), 0 4px 12px -4px rgba(15, 23, 42, .08)',
    fontFamily: "'Geist', sans-serif",
  };

  return (
    <div className="hero-floaters" style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Mid-left: chemistry alert */}
      <div style={wrap({ top: 220, left: -140 }, chem)}>
        <div style={{
          ...card,
          padding: '12px 14px', width: 240,
          display: 'flex', alignItems: 'flex-start', gap: 10,
          animation: 'float-1 7s ease-in-out infinite',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 8,
            background: 'color-mix(in oklab, var(--brand-orange) 14%, transparent)',
            color: 'var(--brand-orange)', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '0.02em' }}>CHEMISTRY ALERT</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.35 }}>Cl low at 142 Marina Way</div>
          </div>
        </div>
      </div>

      {/* Top-right: invoice paid */}
      <div style={wrap({ top: -70, right: -100 }, inv)}>
        <div style={{
          ...card,
          padding: '12px 14px', width: 232,
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'float-2 8s ease-in-out infinite',
        }}>
          {checkBadge}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500, lineHeight: 1.3 }}>Invoice paid · Mirro Residence</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-5)', marginTop: 2 }}>$189.00 · ACH · just now</div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-green)' }}>+$189</span>
        </div>
      </div>

      {/* Bottom-right: report sent */}
      <div style={wrap({ top: 360, right: -80 }, rep)}>
        <div style={{
          ...card,
          padding: '12px 14px', width: 230,
          display: 'flex', alignItems: 'flex-start', gap: 10,
          animation: 'float-4 10s ease-in-out infinite',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 8,
            background: 'color-mix(in oklab, var(--brand-blue) 12%, transparent)',
            color: 'var(--brand-blue)', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>
              <path d="M14 3v5h5M9 13h6M9 17h4"/>
            </svg>
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '0.02em' }}>REPORT SENT</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.35 }}>Crestwood Pool · 12 photos</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(-2deg); }
          25%      { transform: translate(-2px, -5px) rotate(-2deg); }
          50%      { transform: translate(0, -10px) rotate(-2deg); }
          75%      { transform: translate(2px, -5px) rotate(-2deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(4deg); }
          25%      { transform: translate(3px, -7px) rotate(4deg); }
          50%      { transform: translate(0, -13px) rotate(4deg); }
          75%      { transform: translate(-3px, -7px) rotate(4deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) rotate(5deg); }
          25%      { transform: translate(3px, -6px) rotate(5deg); }
          50%      { transform: translate(0, -11px) rotate(5deg); }
          75%      { transform: translate(-3px, -6px) rotate(5deg); }
        }
        @media (max-width: 1360px) {
          .hero-floaters { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-floaters > * { transition: opacity .2s ease; }
        }
      `}</style>
    </div>
  );
};

const HeroBadge = ({ centered }) =>
<a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 6px', border: '1px solid var(--line)', borderRadius: 999, background: 'var(--bg)', fontSize: 12.5, color: 'var(--ink-3)', boxShadow: '0 1px 2px rgba(15,23,42,.04)', transition: 'all .15s' }}
onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--ink-6)';e.currentTarget.style.transform = 'translateY(-1px)';}}
onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--line)';e.currentTarget.style.transform = 'none';}}>
    <span style={{ background: 'var(--accent)', color: 'white', padding: '3px 9px', borderRadius: 999, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em' }}>NEW</span>
    Tickets → quotes → tech to-dos, in a few clicks
    <span style={{ color: 'var(--ink-5)' }}><I.arrowR /></span>
  </a>;


const HeroCTAs = () =>
<div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
    <a href="/contact" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>Get a demo<I.arrowR /></a>
  </div>;


// Proof animation for the right side of the proof-layout hero.
// A "live checklist" — rows arrive at the bottom, get checked, gently scroll up, exit at top.
// Reads as the product literally checking off what you'd ask of it, in real time.
const ProofChecklist = () => {
  const allItems = [
  { cat: 'Setup', text: 'Imported 1,208 customers from CSV' },
  { cat: 'Routes', text: 'Optimized 12 routes for tomorrow' },
  { cat: 'Reports', text: 'Branded service report sent to Mirro Residence' },
  { cat: 'Chemistry', text: 'Auto-alert: Cl low at 142 Marina Way' },
  { cat: 'Tickets', text: 'Pump replacement ticket → quote in 1 tap' },
  { cat: 'Billing', text: 'Recurring invoice charged · $189.00' },
  { cat: 'Truck', text: 'Tech started stop #4 (offline mode)' },
  { cat: 'Quotes', text: 'Quote approved → added to Wed route' },
  { cat: 'Payments', text: 'ACH payment posted from Crystal HOA' },
  { cat: 'Routes', text: '6 unrouted stops auto-assigned to Marcus' },
  { cat: 'Reports', text: 'Photo + chemistry attached to report #2841' },
  { cat: 'Audit', text: 'Service audit caught a missed stop' }];


  const VISIBLE = 5;
  const ROW_H = 60;
  const TICK_MS = 2200;

  // Each "frame" pushes a new item onto a rolling window.
  const [head, setHead] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setHead((h) => h + 1), TICK_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Build current window: [head-VISIBLE+1 ... head]
  const window_ = [];
  for (let i = head - VISIBLE; i <= head; i++) {
    if (i < 0) continue;
    const it = allItems[i % allItems.length];
    window_.push({ ...it, slotKey: i });
  }

  // Position from bottom: index 0 is oldest (top, fading out), last is newest (just appeared at bottom)
  const newest = window_.length - 1;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        boxShadow: '0 30px 60px -30px rgba(15, 23, 42, .15), 0 8px 16px -8px rgba(15, 23, 42, .06)',
        overflow: 'hidden',
        fontFamily: "'Geist', sans-serif"
      }}>
      
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--bg-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'var(--brand-green)'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-green)',
              boxShadow: '0 0 0 3px color-mix(in oklab, var(--brand-green) 25%, transparent)',
              animation: 'live-pulse 1.8s ease-in-out infinite'
            }} />
            Live
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>What PoolLogic just did</span>
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-5)' }}>auto · real-time</span>
      </div>

      {/* Rows window */}
      <div style={{
        position: 'relative',
        height: ROW_H * VISIBLE,
        overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, transparent 0, black 12%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 12%, black 100%)'
      }}>
        {window_.map((item, i) => {
          const fromTop = i; // 0 is oldest
          // Position from top — animate from one slot below to current slot
          const top = fromTop * ROW_H;
          const isNew = i === newest;
          return (
            <div
              key={item.slotKey}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                top: top,
                height: ROW_H,
                display: 'grid',
                gridTemplateColumns: '36px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: '0 18px',
                borderBottom: i < VISIBLE - 1 ? '1px solid var(--line)' : 'none',
                transition: 'top .55s cubic-bezier(.32,.72,.18,1), opacity .55s',
                opacity: i === 0 && window_.length === VISIBLE + 1 ? 0 : 1,
                animation: isNew ? 'pc-row-in .55s cubic-bezier(.32,.72,.18,1)' : 'none'
              }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--brand-green)',
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px -3px rgba(16, 185, 129, .45)',
                    animation: isNew ? 'pc-check-pop .6s cubic-bezier(.34,1.56,.64,1)' : 'none'
                  }}>
                  
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{
                    animation: isNew ? 'pc-check-draw .5s cubic-bezier(.32,.72,.18,1) .15s both' : 'none'
                  }}>
                    <path d="M5 12l5 5L20 6" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: isNew ? 0 : 0 }} />
                  </svg>
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.text}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-5)', marginTop: 3, letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {item.cat}
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-5)' }} className="mono">
                just now
              </div>
            </div>);

        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 18px',
        borderTop: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-soft)'
      }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>
          <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>1,247 actions</strong> automated today
        </span>
        <span style={{ fontSize: 12, color: 'var(--ink-5)' }}>across 87 trucks</span>
      </div>

      <style>{`
        @keyframes pc-row-in {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pc-check-pop {
          0%   { transform: scale(0.4); }
          60%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes pc-check-draw {
          0%   { stroke-dashoffset: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes live-pulse {
          0%, 100% { box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand-green) 25%, transparent); }
          50%      { box-shadow: 0 0 0 6px color-mix(in oklab, var(--brand-green) 12%, transparent); }
        }
      `}</style>
    </div>);

};

const HeroProof = ({ centered }) => {
  // "By the numbers" trio — three outcome metrics that count up once on mount.
  // Replaces the old rotating checkmark ticker with a calmer, more authoritative
  // proof strip. Figures reuse claims already made elsewhere on the page.
  const stats = [
  { value: 10, unit: 'min', caption: 'Up and running' },
  { value: 6, unit: '', caption: 'Nav tabs, not 23' },
  { value: 11, unit: 'days', caption: 'Faster to get paid' }];


  return (
    <div
      className="hero-proof"
      style={{
        marginTop: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'flex-start',
        flexWrap: 'wrap',
        rowGap: 16
      }}>
      {stats.map((s, i) =>
      <React.Fragment key={s.caption}>
          {i > 0 &&
        <span
          className="hero-proof-sep"
          aria-hidden="true"
          style={{ width: 1, height: 34, background: 'var(--line)', margin: '0 26px', display: 'inline-block' }} />
        }
          <div style={{
          display: 'flex', flexDirection: 'column', gap: 4,
          textAlign: centered ? 'center' : 'left'
        }}>
            <span style={{
            fontSize: 27, fontWeight: 600, letterSpacing: '-0.03em',
            color: 'var(--ink)', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"'
          }}>
              <CountUp to={s.value} />
              {s.unit &&
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-4)', marginLeft: 3, letterSpacing: '-0.01em' }}>
                  {s.unit}
                </span>
            }
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-5)' }}>
              {s.caption}
            </span>
          </div>
        </React.Fragment>
      )}
    </div>);

};

// Animated integer that eases from 0 → `to` once on mount (cubic ease-out),
// honoring reduced-motion by jumping straight to the final value.
const CountUp = ({ to }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {setN(to);return;}

    let raf;
    const start = performance.now();
    const dur = 850;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return <>{n}</>;
};

// Side-by-side bloated-vs-simple nav illustration to make the "doesn't fight you back" claim concrete
const NavComparison = () => {
  const bloatedTabs = ['Dashboard', 'Operations', 'Routes', 'Customers', 'Stops', 'Visits', 'Chemistry', 'Photos', 'Tickets', 'Estimates', 'Quotes', 'Invoices', 'Payments', 'Statements', 'Recurring', 'Inventory', 'Parts', 'Vendors', 'Staff', 'Timesheets', 'Reports', 'Audit', 'Settings'];
  const ourTabs = ['Dashboard', 'Routes', 'Customers', 'Tickets', 'Billing', 'Reports'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 36, maxWidth: 720 }}>
      {/* Them */}
      <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', background: 'var(--bg-soft)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>Other software</span>
          <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>{bloatedTabs.length} tabs</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {bloatedTabs.map((t, i) =>
          <span key={t} style={{
            fontSize: 11, padding: '3px 7px',
            border: '1px solid var(--line)', borderRadius: 5,
            background: 'var(--bg)',
            color: i > 7 ? 'var(--ink-6)' : 'var(--ink-4)',
            opacity: i > 12 ? 0.6 : 1
          }}>{t}</span>
          )}
        </div>
      </div>
      {/* Us */}
      <div style={{ border: '1.5px solid var(--accent)', borderRadius: 12, padding: '14px 16px', background: 'var(--bg)', position: 'relative', boxShadow: '0 8px 24px -12px color-mix(in oklab, var(--accent) 30%, transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>PoolLogic</span>
          <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>{ourTabs.length} tabs</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ourTabs.map((t) =>
          <span key={t} style={{
            fontSize: 12, padding: '4px 9px',
            borderRadius: 6,
            background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
            color: 'var(--accent-ink)',
            fontWeight: 500
          }}>{t}</span>
          )}
        </div>
      </div>
    </div>);

};

// Product screenshot wrapper that auto-scales
const ProductShowcase = ({ compact = false }) => {
  const [width, setWidth] = useState(compact ? 560 : 1240);
  const containerRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      if (w > 0) {
        setWidth(compact ? Math.min(640, w) : Math.min(1240, w));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', update);
    return () => {ro.disconnect();window.removeEventListener('resize', update);};
  }, [compact]);

  const scale = width / 1100;

  return (
    <div ref={containerRef} className="product-showcase" style={{
      width: '100%',
      maxWidth: compact ? 640 : 1240,
      height: 660 * scale,
      position: 'relative'
    }}>
      <PoolLogicApp scale={scale} />
    </div>);

};

// Features — Attio-style stacked rows under a sticky frame header.
const Features = () => {
  const hatch = 'repeating-linear-gradient(135deg, color-mix(in oklab, var(--ink-6) 22%, transparent) 0 1px, transparent 1px 9px)';
  return (
    <section id="features" className="section-divider" style={{ position: 'relative' }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '0 0 auto 0', height: 420, zIndex: -1, pointerEvents: 'none',
        background: 'radial-gradient(900px 320px at 50% 0%, color-mix(in oklab, var(--accent) 4%, transparent), transparent 70%)',
      }} />
      <div className="features-wide" style={{
        maxWidth: 1480,
        marginInline: 'auto',
        paddingInline: 'clamp(16px, 4vw, 80px)',
        position: 'relative',
      }}>
        {/* Hatched gutters extending up behind the intro so the canvas is unified */}
        <div aria-hidden="true" className="features-gutter-bg" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: 0, width: 'clamp(48px, 6vw, 96px)',
          background: hatch, opacity: 0.7,
          borderRight: '1px solid var(--line)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" className="features-gutter-bg" style={{
          position: 'absolute', top: 0, bottom: 0,
          right: 0, width: 'clamp(48px, 6vw, 96px)',
          background: hatch, opacity: 0.7,
          borderLeft: '1px solid var(--line)',
          pointerEvents: 'none',
        }} />

        {/* Section header — centered, refined, sits above the rows */}
        <div className="features-header" style={{
          maxWidth: 780,
          marginInline: 'auto',
          padding: '0 clamp(20px, 3vw, 36px) 72px',
          textAlign: 'center',
        }}>
          <h2 className="features-headline" style={{
            fontSize: 'clamp(32px, 3.6vw, 48px)',
            letterSpacing: '-0.035em',
            lineHeight: 1.04,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>
            Built for how you actually run a route.
          </h2>
          <p className="features-subhead" style={{
            marginTop: 22,
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--ink-4)',
            maxWidth: 620,
            marginInline: 'auto',
            textWrap: 'balance',
          }}>
            Add a customer in seconds and they're already in the perfect slot. Open one screen to see any stop, any tech, any day. Reports, billing, and the tech app all running off the same record — so nothing falls through.
          </p>
        </div>

        <div className="feature-rows" style={{ position: 'relative' }}>
          <FeatureRow
            title="A new customer, fully set up in under 10 minutes."
            body="First, the customer is added — name, address, pool details. Next, billing is configured — cadence, payment method, autopay. Finally, the customer is assigned to a tech's route on the right day. Three steps, one sitting, under ten minutes from phone call to first visit on the calendar."
            ctaLabel="Book a demo"
            ctaHref="/contact"
            flow={<RoutingFlow />}
            sidePanel={<RoutingSidePanel />}
            decoration="route"
            texture="dots"
            isFirst
          />
          <FeatureRow
            title="A service report that builds customer trust."
            body="Every visit produces a clean, branded report — chemistry, dosages, photos, tech notes — emailed to the owner before the truck leaves the driveway. Submissions are GPS-stamped at the pool, so one tap on GPS Verify ↗ opens the exact map pin and customers know the stop actually happened where it should. If a tech flags low water, high chlorine, or equipment shut-offs from the field, the warning lands in the report automatically. Disputes drop. 'Did you come today?' calls disappear."
            ctaLabel="See what your customers will see"
            ctaHref="/tech-app"
            flow={<TechAppFlow />}
            sidePanel={<TechAppSidePanel />}
            decoration="reports"
            texture="hatch"
          />
          <FeatureRow
            title="Send the right message to the right list, in 30 seconds."
            body="Filter your customers by anything that matters — pool type, MRR, route day, tech, city — then write one message that personalizes itself with each customer's first name, address, route day, and stop number. Price increases, holiday closings, weather delays, route shuffles — what used to be a Saturday-night spreadsheet exercise now takes a single coffee."
            ctaLabel="Book a demo"
            ctaHref="/contact"
            flow={<BulkMessageFlow />}
            sidePanel={<BulkMessageSidePanel />}
            decoration="messages"
            texture="dots"
          />
          <FeatureRow
            title="Stop chasing payments."
            body="Every customer is billed on their own day — the date you set at signup, not the 1st of the month. Pick the payment terms that fit each account: Due on receipt, Net 7, 15, or 30. Invoices fire on schedule, and customers pay one tap from the email with card, ACH, or check (autopay keeps it running). The moment an invoice goes overdue, an automatic reminder lands in their inbox. Set company-wide late fees once — choose how many days past due before they're added — and the system handles the rest. Never forget about an invoice again, and quit manually chasing payments."
            ctaLabel="See pricing"
            ctaHref="/pricing"
            flow={<BillingPhone />}
            sidePanel={<BillingSidePanel />}
            decoration="paid"
            texture="hatch"
            isLast
          />
        </div>
      </div>
    </section>);

};

// ============================================================================
// Background textures — each FeatureRow can opt into a distinct canvas pattern
// so the four rows feel related but visually individual.
// ============================================================================
// Textures use fluid `calc(100% / N)` cell sizes so the pattern always
// tiles to a whole number of cells edge-to-edge. No clipped half-cells at the
// column borders regardless of viewport width.
const TEXTURES = {
  // Dotted grid — many small dots tightly packed (graph-paper density).
  dots: {
    image: 'radial-gradient(circle, color-mix(in oklab, var(--ink-6) 32%, transparent) 0.6px, transparent 0.8px)',
    size: 'calc(100% / 60) calc(100% / 36)',
  },
  // Fixed-cell ruled grid — Attio-style 36×36px architectural canvas.
  // Each cell is a discrete square with hairlines on the right + bottom
  // edges. Cell size is fixed (not fluid) so the grid reads as a real
  // measurement system rather than a stretched pattern.
  grid: {
    image: `
      linear-gradient(to right, color-mix(in oklab, var(--ink-6) 28%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in oklab, var(--ink-6) 28%, transparent) 1px, transparent 1px)
    `,
    size: '36px 36px',
  },
  // Horizontal ledger rules — 14 row stripes.
  ledger: {
    image: 'linear-gradient(to bottom, color-mix(in oklab, var(--ink-6) 14%, transparent) 1px, transparent 1px)',
    size: '100% calc(100% / 14)',
  },
  // Diagonal hatch — keep repeating-linear-gradient; it tiles infinitely and
  // doesn't have an edge-alignment problem.
  hatch: {
    image: `
      repeating-linear-gradient(135deg,
        color-mix(in oklab, var(--ink-6) 12%, transparent) 0 1px,
        transparent 1px 14px)
    `,
    size: 'auto',
  },
};

// ============================================================================
// FeatureRow — Attio-style three columns.
// ============================================================================
// Layout: outer left hatched gutter | text col | flow diagram col | side panel col | outer right hatched gutter.
// Background texture is controlled per-row via the `texture` prop.
// Vertical rules separate columns; horizontal rules cap top + bottom.
const FeatureRow = ({ title, body, ctaLabel, ctaHref = '/contact', flow, sidePanel, decoration, texture = 'dots', isFirst, isLast }) => {
  const rule = '1px solid var(--line)';
  const tex = TEXTURES[texture] || TEXTURES.dots;
  return (
    <div className="feature-row" style={{
      position: 'relative',
      display: 'grid',
      // outer transparent gutters (wrapper paints the hatch) | text | flow | side
      gridTemplateColumns: 'clamp(48px, 6vw, 96px) minmax(240px, 0.95fr) minmax(440px, 1.6fr) minmax(280px, 1.1fr) clamp(48px, 6vw, 96px)',
      minHeight: 560,
    }}>
      {/* LEFT gutter — transparent spacer with vertical rule only. The
          horizontal rule stops at this vertical rule and doesn't enter
          the hatched area. */}
      <div aria-hidden="true" className="feature-row-gutter" style={{
        borderRight: rule,
      }} />

      {/* LEFT — text column */}
      <div className="feature-row-left" style={{
        padding: '40px 36px 40px 28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24,
        borderRight: rule,
        borderTop: isFirst ? rule : 'none',
        borderBottom: rule,
      }}>
        <div>
          <h3 style={{
            fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em',
            color: 'var(--ink)', lineHeight: 1.2,
            textWrap: 'balance',
          }}>{title}</h3>
          <p style={{
            marginTop: 14, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-4)',
          }}>{body}</p>
        </div>
        {ctaLabel && (
          <a href={ctaHref} style={{
            color: 'var(--ink-2)', textDecoration: 'none',
            fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            width: 'fit-content',
          }}>
            {ctaLabel} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      {/* CENTER — flow diagram column. Texture tiles cleanly to the column
          edges (fluid cell sizes), with a soft mask to fade toward the flow. */}
      <div className="feature-row-center" style={{
        position: 'relative',
        padding: '48px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: rule,
        borderTop: isFirst ? rule : 'none',
        borderBottom: rule,
        background: tex.bg || 'var(--bg)',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: tex.image,
          backgroundSize: tex.size,
          backgroundPosition: '0 0',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          {flow}
        </div>
      </div>

      {/* RIGHT — clean white, side panel stacked over decoration. Texture
          appears only as a small contained patch anchoring the decoration. */}
      <div className="feature-row-right" style={{
        position: 'relative',
        padding: '36px 28px 36px 28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24,
        background: 'var(--bg)',
        borderTop: isFirst ? rule : 'none',
        borderBottom: rule,
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>{sidePanel}</div>
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          minHeight: 140,
        }}>
          {/* small contained texture patch behind the decoration */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '0 -28px -36px -28px',
            backgroundImage: tex.image,
            backgroundSize: tex.size,
            backgroundPosition: '0 0',
            opacity: 0.6,
            maskImage: 'radial-gradient(120% 120% at 60% 100%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(120% 120% at 60% 100%, black 0%, transparent 75%)',
            borderTop: '1px solid var(--line)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {decoration === 'cubes' && <CubesDecoration />}
            {decoration === 'orbit' && <OrbitDecoration />}
            {decoration === 'reports' && <ReportsDecoration />}
            {decoration === 'route' && <RouteDecoration />}
            {decoration === 'paid' && <PaidStampsDecoration />}
            {decoration === 'messages' && <BulkMessageDecoration />}
          </div>
        </div>
      </div>

      {/* RIGHT gutter — transparent spacer with vertical rule only. */}
      <div aria-hidden="true" className="feature-row-gutter" style={{
        borderLeft: rule,
      }} />
    </div>
  );
};

// ============================================================================
// Flow diagrams — each feature row has a structurally distinct flow.
// ============================================================================

const FlowShell = ({ children, maxWidth = 460 }) => (
  <div style={{
    position: 'relative', width: '100%', maxWidth,
    fontFamily: "'Geist', sans-serif",
  }}>{children}</div>
);

const InlineResult = ({ children, indent = 18 }) => {
  const accent = 'color-mix(in oklab, var(--accent) 55%, transparent)';
  const accentSoft = 'color-mix(in oklab, var(--accent) 18%, transparent)';
  return (
    <div style={{
      marginLeft: indent, display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11.5, color: 'var(--ink-4)',
    }}>
      <span aria-hidden="true" style={{
        display: 'inline-block', width: 12, height: 12,
        background: `radial-gradient(circle, ${accent} 0 30%, ${accentSoft} 45%, transparent 65%)`,
        borderRadius: '50%', flexShrink: 0,
      }} />
      <span>{children}</span>
    </div>
  );
};

// Connector palette — bright accent green for active paths, muted gray for
// inactive. Triangular arrowheads land at the top edge of the next card.
const FLOW_STROKE_ACTIVE = 'color-mix(in oklab, var(--accent) 85%, transparent)';
const FLOW_STROKE_INACTIVE = 'color-mix(in oklab, var(--ink-6) 40%, transparent)';

// Marker recipe matching Attio's inspected pattern: simple filled triangle,
// viewBox 0-10, refX positioned so the tip lands at the line endpoint,
// fill color matches the stroke (so it reads as part of the line, not a
// separate symbol). markerUnits="strokeWidth" lets the marker scale with
// stroke weight.
const FlowDefs = () => (
  <defs>
    <marker id="flow-arrow-active" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill={FLOW_STROKE_ACTIVE} />
    </marker>
    <marker id="flow-arrow-inactive" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill={FLOW_STROKE_INACTIVE} />
    </marker>
  </defs>
);

// Straight vertical connector. Line ends EXACTLY at the chevron's base (the
// container bottom minus ARROW_H), so the line visually meets the chevron's
// upper points. The chevron itself extends from there down to bottom:0.
const DropConnector = ({ height = 56, active = true }) => {
  const stroke = active ? FLOW_STROKE_ACTIVE : FLOW_STROKE_INACTIVE;
  const cx = 10;
  const chevW = 6; // half-width of chevron base
  const tipY = height - 1; // tip 1px above the very bottom (avoids clipping)
  const baseY = tipY - 7; // chevron base 7px above the tip
  return (
    <div aria-hidden="true" style={{ height, display: 'flex', justifyContent: 'center' }}>
      <svg width="20" height={height} viewBox={`0 0 20 ${height}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
        {/* line — from top to the chevron's base (where the two upper points sit) */}
        <line
          x1={cx} y1="0" x2={cx} y2={baseY}
          stroke={stroke} strokeWidth="1.5" strokeLinecap="butt"
          strokeDasharray={active ? undefined : '3 4'}
        />
        {/* chevron — same SVG, same coordinate system. Cannot misalign. */}
        <path
          d={`M ${cx - chevW} ${baseY} L ${cx} ${tipY} L ${cx + chevW} ${baseY}`}
          stroke={stroke} strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

// Open V-chevron. Vertex sits flush with container bottom; base (the two
// upper ends of the chevron) sits at y=0 inside the SVG, which means the
// chevron extends UPWARD by ARROW_H pixels from `bottom:0`.
// Use ARROW_OVERLAP to know where the line should stop to meet the chevron.
const ARROW_W = 14;
const ARROW_H = 8;
const ARROW_OVERLAP = ARROW_H; // line should end this far ABOVE the chevron tip
const Arrowhead = ({ color, left }) => (
  <svg
    aria-hidden="true"
    width={ARROW_W} height={ARROW_H} viewBox={`0 0 ${ARROW_W} ${ARROW_H}`} fill="none"
    style={{
      position: 'absolute',
      bottom: 0,
      left,
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      display: 'block',
    }}>
    <path d={`M 0 0 L ${ARROW_W / 2} ${ARROW_H} L ${ARROW_W} 0`}
      stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      fill="none" />
  </svg>
);

// Branch connector — bezier elbows from a parent down to two children.
// The bezier paths stretch with the column width (preserveAspectRatio="none")
// but the arrowheads are tiny separate SVGs anchored by % so they never
// distort.
const BranchConnector = ({
  height = 80,
  leftActive = false,
  rightActive = false,
  leftLabel,
  rightLabel,
}) => {
  const tone = (a) => a ? FLOW_STROKE_ACTIVE : FLOW_STROKE_INACTIVE;
  return (
    <div aria-hidden="true" style={{ position: 'relative', height }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" fill="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* Bezier curves end at chevron base; chevrons are part of the same
            path string so endpoint and arrowhead share geometry exactly. */}
        {(() => {
          const baseY = height - 8;
          const tipY = height - 1;
          return (
            <>
              <path
                d={`M 50 0 C 50 ${height * 0.4}, 75 ${height * 0.6}, 75 ${baseY}`}
                stroke={tone(rightActive)} strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray={rightActive ? undefined : '3 4'}
                vectorEffect="non-scaling-stroke" fill="none"
              />
              <path
                d={`M 50 0 C 50 ${height * 0.4}, 25 ${height * 0.6}, 25 ${baseY}`}
                stroke={tone(leftActive)} strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray={leftActive ? undefined : '3 4'}
                vectorEffect="non-scaling-stroke" fill="none"
              />
              {/* Chevrons — drawn IN THE SAME SVG so endpoint geometry is
                  guaranteed to align with the bezier tip. Base intentionally
                  narrow (1.5 viewBox units = ~6-7px at typical column width)
                  because horizontal viewBox units get stretched. */}
              <path
                d={`M 23.5 ${baseY} L 25 ${tipY} L 26.5 ${baseY}`}
                stroke={tone(leftActive)} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                vectorEffect="non-scaling-stroke" fill="none"
              />
              <path
                d={`M 73.5 ${baseY} L 75 ${tipY} L 76.5 ${baseY}`}
                stroke={tone(rightActive)} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                vectorEffect="non-scaling-stroke" fill="none"
              />
            </>
          );
        })()}
      </svg>
      {leftLabel && (
        <div style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
          <BranchLabel tone={leftActive ? 'good' : 'neutral'} active={leftActive}>{leftLabel}</BranchLabel>
        </div>
      )}
      {rightLabel && (
        <div style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
          <BranchLabel tone={rightActive ? 'good' : 'neutral'} active={rightActive}>{rightLabel}</BranchLabel>
        </div>
      )}
    </div>
  );
};

// Join connector — two parents merging down to one child. Both curves land
// at the same center point, so one shared Arrowhead at 50%.
const JoinConnector = ({ height = 64, leftActive = true, rightActive = true }) => {
  const tone = (a) => a ? FLOW_STROKE_ACTIVE : FLOW_STROKE_INACTIVE;
  // Arrow takes the active color (if either branch active)
  const arrowColor = leftActive || rightActive ? FLOW_STROKE_ACTIVE : FLOW_STROKE_INACTIVE;
  return (
    <div aria-hidden="true" style={{ height, position: 'relative' }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" fill="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {(() => {
          const baseY = height - 8;
          const tipY = height - 1;
          return (
            <>
              <path
                d={`M 25 0 C 25 ${height * 0.55}, 50 ${height * 0.55}, 50 ${baseY}`}
                stroke={tone(leftActive)} strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray={leftActive ? undefined : '3 4'}
                vectorEffect="non-scaling-stroke" fill="none"
              />
              <path
                d={`M 75 0 C 75 ${height * 0.55}, 50 ${height * 0.55}, 50 ${baseY}`}
                stroke={tone(rightActive)} strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray={rightActive ? undefined : '3 4'}
                vectorEffect="non-scaling-stroke" fill="none"
              />
              <path
                d={`M 48.5 ${baseY} L 50 ${tipY} L 51.5 ${baseY}`}
                stroke={arrowColor} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                vectorEffect="non-scaling-stroke" fill="none"
              />
            </>
          );
        })()}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1. Routing — Add customer → system suggests slot → owner accepts → route
//    reshapes. Tells the "drop in and it's already in the right place" story.
// ---------------------------------------------------------------------------
// Slim entry-point card — eyebrow-style, sits above the trigger card.
// Shows an icon in a soft accent square + the title, nothing else.
// Used to indicate the two ways a new customer can land in PoolLogic.
const EntryCard = ({ icon, title }) => {
  const renderIcon = () => {
    const common = {
      width: 14, height: 14, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'color-mix(in oklab, var(--accent) 75%, black)',
      strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': true,
    };
    if (icon === 'plus') {
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    }
    if (icon === 'webhook') {
      // Three-point branch — a stylized "webhook" glyph
      return <svg {...common}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><circle cx="12" cy="7" r="3" /><path d="M9 17h6M14 9.5l3 4.5M10 9.5L7 14" /></svg>;
    }
    return null;
  };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 9,
      padding: '8px 14px 8px 8px',
      background: 'var(--bg)',
      border: '1px solid var(--line)',
      borderRadius: 10,
      boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 6px 14px -12px rgba(15, 23, 42, .2)',
      fontFamily: "'Geist', sans-serif",
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: 6,
        background: 'color-mix(in oklab, var(--accent) 12%, white)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{renderIcon()}</span>
      <span style={{
        fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}>{title}</span>
    </div>
  );
};

const RoutingFlow = () => {
  // Same green family as the Reports diagram — keeps the visual language
  // consistent across all flows.
  const activeStroke = '#4aa873';
  const activeStrokeSoft = '#7fc99c';

  // --- Card with notched border (port circles plug into the notches) ----
  const Card = ({
    iconNode, iconBg, iconFg,
    title, tag, desc,
    active = true,
    width = 280, height = 80,
    portTop, portBottom, portLeft, portRight,
    // animDelay (ms): if provided, the green border + port circles draw
    // on after this delay (relative to when .routing-active is added).
    // If omitted, the border is statically drawn (always visible green).
    animDelay,
  }) => {
    const w = width, h = height;
    const cx = w / 2;
    const r = 12;
    const path = `M ${r + 0.5} 0.5
      L ${w - r - 0.5} 0.5
      A ${r} ${r} 0 0 1 ${w - 0.5} ${r}
      L ${w - 0.5} ${h - r}
      A ${r} ${r} 0 0 1 ${w - r - 0.5} ${h - 0.5}
      L ${r + 0.5} ${h - 0.5}
      A ${r} ${r} 0 0 1 0.5 ${h - r}
      L 0.5 ${r}
      A ${r} ${r} 0 0 1 ${r + 0.5} 0.5 Z`;
    return (
      <div style={{
        position: 'relative', width: w, height: h,
        filter: 'drop-shadow(rgba(24, 39, 75, 0.04) 0px 4px 4px) drop-shadow(rgba(24, 39, 75, 0.02) 0px 2px 4px)',
        opacity: active ? 1 : 0.72,
      }}>
        <svg aria-hidden="true" width={w} height={h}
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path d={path} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
          {active && animDelay == null && (
            <path d={path} fill="none" stroke={activeStroke} strokeWidth="1" />
          )}
          {active && animDelay != null && (
            <path
              d={path}
              className="routing-anim-path"
              data-delay={animDelay}
              fill="none"
              stroke={activeStroke}
              strokeWidth="1"
              pathLength="1"
            />
          )}
          {portTop && (
            <circle cx={cx} cy="0.5" r="5"
              className={animDelay != null ? 'routing-anim-port' : undefined}
              data-delay={animDelay != null ? animDelay : undefined}
              fill="var(--bg)" stroke={activeStroke} strokeWidth="1"
            />
          )}
          {portBottom && (
            <circle cx={cx} cy={h - 0.5} r="5"
              className={animDelay != null ? 'routing-anim-port' : undefined}
              data-delay={animDelay != null ? animDelay : undefined}
              fill="var(--bg)" stroke={activeStroke} strokeWidth="1"
            />
          )}
          {portLeft && (
            <circle cx="0.5" cy={h / 2} r="5"
              fill="var(--bg)" stroke={activeStroke} strokeWidth="1" />
          )}
          {portRight && (
            <circle cx={w - 0.5} cy={h / 2} r="5"
              fill="var(--bg)" stroke={activeStroke} strokeWidth="1" />
          )}
        </svg>

        <div style={{
          position: 'absolute', inset: 1,
          display: 'flex', flexDirection: 'column',
          padding: '12px',
          fontFamily: "'Geist', sans-serif",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div aria-hidden="true" style={{
                width: 18, height: 18,
                color: 'var(--ink-5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{iconNode}</div>
              <p style={{
                margin: 0,
                fontSize: 14, fontWeight: 600, lineHeight: '20px',
                letterSpacing: '-0.015em',
                color: active ? 'var(--ink)' : 'var(--ink-5)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{title}</p>
            </div>
            {tag && (
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '1px 7px',
                borderRadius: 6,
                background: 'var(--bg-muted)',
                color: 'var(--ink-5)',
                fontSize: 11.5, lineHeight: '16px',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{tag}</span>
            )}
          </div>
          <hr style={{ marginTop: 10, marginBottom: 'auto', border: 0, borderTop: '1px solid var(--line-2)' }} />
          {desc && (
            <p style={{
              margin: 0,
              fontSize: 12, lineHeight: '16px',
              color: 'var(--ink-5)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{desc}</p>
          )}
        </div>
      </div>
    );
  };

  // --- Status pill (overlapping card edge) ----
  const StatusBadge = ({ children }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20,
      padding: '0 7px 0 5px',
      background: '#e7f6ec',
      color: '#1f7a3a',
      border: '1px solid #c8e8d2',
      borderRadius: 6,
      fontSize: 12, lineHeight: '16px', fontWeight: 500,
      fontFamily: "'Geist', sans-serif",
      whiteSpace: 'nowrap',
    }}>
      <svg width="12" height="12" fill="none" aria-hidden="true">
        <path d="M3 5.727 3.742 6.9c.442.699.663 1.048.947 1.17a1 1 0 0 0 .778.007c.286-.118.512-.464.965-1.156L9 3"
          stroke="#1f7a3a" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </span>
  );

  // --- Trigger eyebrow tab ----
  const TriggerTag = () => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 5px 8px',
      background: 'var(--bg-soft)',
      borderTop: '1px solid var(--line)',
      borderLeft: '1px solid var(--line)',
      borderRight: '1px solid var(--line)',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      fontSize: 12, color: 'var(--ink-5)', fontWeight: 500, lineHeight: '16px',
      fontFamily: "'Geist', sans-serif",
    }}>
      <svg width="12" height="12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r=".75" fill="var(--ink-5)" />
        <circle cx="6" cy="6" r="5" stroke="var(--ink-5)" strokeWidth="1.1" />
        <circle cx="6" cy="6" r="2.5" stroke="var(--ink-5)" strokeWidth="1.1" />
      </svg>
      Trigger
    </span>
  );

  // --- Branch pill (sits on the elbow midpoint) ----
  const BranchPill = ({ children, active }) => {
    const styles = active
      ? { bg: 'color-mix(in oklab, #3a9b5e 12%, white)', fg: '#1f7a3a', bd: 'color-mix(in oklab, #3a9b5e 32%, white)' }
      : { bg: 'var(--bg)', fg: 'var(--ink-5)', bd: 'var(--line)' };
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        fontSize: 11.5, fontWeight: 500,
        borderRadius: 8,
        background: styles.bg, color: styles.fg,
        border: `1px solid ${styles.bd}`,
        fontFamily: "'Geist', sans-serif", letterSpacing: '-0.005em',
        boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 4px 8px -6px rgba(15, 23, 42, .15)',
        opacity: active ? 1 : 0.7,
      }}>{children}</span>
    );
  };

  // --- Icons — match the PoolLogic app sidebar style: stroke-only, soft
  // blue, rounded line joins/caps, ~1.7px stroke at 24×24 scale, designed
  // to read clearly at 13×13 inside the card icon chip. Each glyph aligns
  // with a real screen in the app.
  const iconProps = {
    width: 14, height: 14, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  // Customer detail screen — head and rounded shoulders silhouette,
  // matches the "Customers" tab in the app sidebar.
  const PersonIcon = () => (
    <svg {...iconProps}>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 19.5c0-3.5 3.1-6.3 7-6.3s7 2.8 7 6.3" />
    </svg>
  );
  // Billing/Schedule screen — card with magnetic stripe + thin signature
  // line, matches the "Billing" tab.
  const CardIcon = () => (
    <svg {...iconProps}>
      <rect x="3" y="6" width="18" height="13" rx="2.6" />
      <line x1="3" y1="10.2" x2="21" y2="10.2" />
      <line x1="7" y1="15" x2="11" y2="15" />
    </svg>
  );
  // Route screen — two pins connected by a curved path. Reads as a
  // multi-stop route on a map.
  const RouteIcon = () => (
    <svg {...iconProps}>
      <path d="M7 4.5c-2.2 0-4 1.8-4 4 0 2.6 4 6 4 6s4-3.4 4-6c0-2.2-1.8-4-4-4z" />
      <circle cx="7" cy="8.5" r="1.2" />
      <path d="M17 13.5c-2.2 0-4 1.8-4 4 0 2.6 4 6 4 6s4-3.4 4-6c0-2.2-1.8-4-4-4z" />
      <circle cx="17" cy="17.5" r="1.2" />
      <path d="M11 8.5c2 0 3 2 3 4.5" strokeDasharray="1.5 2" />
    </svg>
  );
  // Autopay/bolt — lightning glyph, fitting "hands-free" / automated.
  const BoltIcon = () => (
    <svg {...iconProps}>
      <path d="M13.5 2 4 14h6.5L9.5 22 20 10h-6.5l1-8z" />
    </svg>
  );
  // One-tap pay — clock face glyph (rounded, friendly), implying
  // "scheduled" or "on-time" payment, matches the manual-pay branch.
  const ZapIcon = () => (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3.2 2" />
    </svg>
  );

  // --- Canvas layout ----
  // Total height tuned to roughly match the phone section (~580px) so the
  // two adjacent feature rows have the same visual weight.
  const CANVAS_W = 470;
  const CANVAS_H = 580;

  // Vertical chain w/ branch at bottom. Hand-tuned horizontal offsets create
  // a gentle zigzag rhythm matching the Reports diagram.
  const trigger = { x: 22,  y: 40,  w: 270, h: 76 };
  const billing = { x: 160, y: 170, w: 290, h: 76 };
  const route   = { x: 70,  y: 300, w: 320, h: 76 };
  const autopay = { x: 8,   y: 440, w: 220, h: 76 };
  const manual  = { x: 240, y: 440, w: 220, h: 76 };

  const port = (c, side) => {
    if (side === 'top')    return { x: c.x + c.w / 2, y: c.y + 0.5 };
    if (side === 'bottom') return { x: c.x + c.w / 2, y: c.y + c.h - 0.5 };
  };

  // Scroll-into-view trigger. When the canvas enters the viewport, add a
  // `.routing-active` class to the wrapper which kicks off all CSS keyframe
  // animations (wires + card borders) to draw on once and stay drawn.
  // When the canvas leaves the viewport, the class is removed so the next
  // time the user scrolls back, the animation replays.
  const canvasRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <FlowShell maxWidth={CANVAS_W}>
      {/* Continuous-loop animation. Total cycle = 12s. Each animated element
          uses dynamic keyframes generated below where its draw kicks in at
          its delay (0–9.6s window), holds, then fades out at 9.6–11s, and
          stays invisible 11–12s before the next cycle. All elements share
          the same global cycle so they fade together. Generated per-delay
          keyframes are referenced by class name. */}
      {(() => {
        const TOTAL = 12000; // ms per cycle
        const DRAW_DUR = 1200; // ms to draw each element on
        const FADE_START = 9800; // ms — when everything fades out
        const FADE_END = 11000; // ms — fully invisible
        const delays = [0, 1400, 2800, 4200, 5600, 7000, 8400];
        const css = delays.map((d) => {
          const drawStart = (d / TOTAL) * 100;
          const drawEnd = ((d + DRAW_DUR) / TOTAL) * 100;
          const fadeStart = (FADE_START / TOTAL) * 100;
          const fadeEnd = (FADE_END / TOTAL) * 100;
          return `
            @keyframes routing-path-${d} {
              0%, ${drawStart}%        { stroke-dashoffset: 1; opacity: 0; }
              ${drawStart + 0.01}%     { opacity: 1; }
              ${drawEnd}%, ${fadeStart}% { stroke-dashoffset: 0; opacity: 1; }
              ${fadeEnd}%, 100%        { stroke-dashoffset: 0; opacity: 0; }
            }
            @keyframes routing-fade-${d} {
              0%, ${drawStart}%        { opacity: 0; }
              ${drawEnd}%, ${fadeStart}% { opacity: 1; }
              ${fadeEnd}%, 100%        { opacity: 0; }
            }
            .routing-active .routing-anim-path[data-delay="${d}"] {
              stroke-dasharray: 1 1;
              animation: routing-path-${d} ${TOTAL}ms linear infinite;
            }
            .routing-active .routing-anim-port[data-delay="${d}"] {
              animation: routing-fade-${d} ${TOTAL}ms linear infinite;
            }
            .routing-active .routing-anim-pill[data-delay="${d}"] {
              animation: routing-fade-${d} ${TOTAL}ms linear infinite;
            }
          `;
        }).join('\n');
        return (
          <style>{`
            .routing-anim-path {
              stroke-dasharray: 1 1;
              stroke-dashoffset: 1;
              opacity: 0;
            }
            .routing-anim-port { opacity: 0; }
            .routing-anim-pill { opacity: 0; }
            ${css}
          `}</style>
        );
      })()}
      <div
        ref={canvasRef}
        className={inView ? 'routing-active' : ''}
        style={{ position: 'relative', width: '100%', maxWidth: CANVAS_W, height: CANVAS_H, fontFamily: "'Geist', sans-serif" }}
      >

        {/* Connector wires */}
        <svg
          aria-hidden="true"
          width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
        >
          {(() => {
            const Tb = port(trigger, 'bottom');
            const Bt = port(billing, 'top');
            const Bb = port(billing, 'bottom');
            const Rt = port(route, 'top');
            const Rb = port(route, 'bottom');
            const At = port(autopay, 'top');
            const Mt = port(manual, 'top');

            const elbow = (a, b) => {
              const midY = (a.y + b.y) / 2;
              const dir = b.x > a.x ? 1 : -1;
              const r = 8;
              return `M ${a.x} ${a.y - 2}
                      L ${a.x} ${midY - r}
                      Q ${a.x} ${midY} ${a.x + dir * r} ${midY}
                      L ${b.x - dir * r} ${midY}
                      Q ${b.x} ${midY} ${b.x} ${midY + r}
                      L ${b.x} ${b.y + 2}`;
            };

            const trackStroke = 'color-mix(in oklab, var(--ink-5) 22%, transparent)';
            const wireBase = {
              strokeWidth: 1,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              fill: 'none',
            };

            // Active wire: gray track + green overlay that draws on, holds,
            // then fades out on a continuous 12s loop. data-delay selects
            // which keyframe controls its draw timing within the cycle.
            const ActiveWire = ({ d, delay }) => (
              <>
                <path d={d} stroke={trackStroke} {...wireBase} />
                <path
                  d={d}
                  className="routing-anim-path"
                  data-delay={delay}
                  stroke={activeStroke}
                  pathLength="1"
                  {...wireBase}
                />
              </>
            );

            // Inactive wire: only the gray track. Used for the Pay-each-
            // invoice branch which should never light up green.
            const InactiveWire = ({ d }) => (
              <path d={d} stroke={trackStroke} {...wireBase} />
            );

            // Strict sequence: card → wire → card → wire → card → wire → card
            // Each step is 1200ms with a 200ms beat between, so the eye can
            // clearly read each transition. Total runtime ~9.6s.
            return (
              <>
                <ActiveWire d={elbow(Tb, Bt)} delay={1400} />
                <ActiveWire d={elbow(Bb, Rt)} delay={4200} />
                <ActiveWire d={elbow(Rb, At)} delay={7000} />
                <InactiveWire d={elbow(Rb, Mt)} />
              </>
            );
          })()}
        </svg>

        {/* Trigger — New lead */}
        <div style={{ position: 'absolute', left: trigger.x, top: trigger.y }}>
          <div className="routing-anim-pill" data-delay={0} style={{ position: 'absolute', top: -22, left: 10, zIndex: 0 }}>
            <TriggerTag />
          </div>
          <div className="routing-anim-pill" data-delay={0} style={{ position: 'absolute', top: -22, right: 14, zIndex: 3 }}>
            <StatusBadge>Added</StatusBadge>
          </div>
          <Card
            iconNode={<PersonIcon />}
            iconBg="color-mix(in oklab, var(--accent) 14%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Customer added"
            tag="Contact"
            desc="Name, address, pool details"
            width={trigger.w} height={trigger.h}
            portBottom
            animDelay={0}
          />
        </div>

        {/* Billing locked in */}
        <div style={{ position: 'absolute', left: billing.x, top: billing.y }}>
          <div className="routing-anim-pill" data-delay={2800} style={{ position: 'absolute', top: -22, right: 14, zIndex: 3 }}>
            <StatusBadge>Set</StatusBadge>
          </div>
          <Card
            iconNode={<CardIcon />}
            iconBg="color-mix(in oklab, var(--accent) 12%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Billing locked in"
            tag="Schedule"
            desc="Monthly · the 17th · autopay-ready"
            width={billing.w} height={billing.h}
            portTop portBottom
            animDelay={2800}
          />
        </div>

        {/* Assigned to route */}
        <div style={{ position: 'absolute', left: route.x, top: route.y }}>
          <div className="routing-anim-pill" data-delay={5600} style={{ position: 'absolute', top: -22, right: 14, zIndex: 3 }}>
            <StatusBadge>Assigned</StatusBadge>
          </div>
          <Card
            iconNode={<RouteIcon />}
            iconBg="color-mix(in oklab, #7c3aed 12%, white)"
            iconFg="#7c3aed"
            title="Assigned to route"
            tag="Routing"
            desc="Jared · Thursdays · stop #7"
            width={route.w} height={route.h}
            portTop portBottom
            animDelay={5600}
          />
        </div>

        {/* Branch pills — fade in with the route→autopay wire (delay 7000ms) */}
        <div className="routing-anim-pill" data-delay={7000} style={{ position: 'absolute', left: 96, top: 397, zIndex: 4 }}>
          <BranchPill active>Autopay on</BranchPill>
        </div>
        <div className="routing-anim-pill" data-delay={7000} style={{ position: 'absolute', left: 314, top: 397, zIndex: 4 }}>
          <BranchPill active={false}>Pay each invoice</BranchPill>
        </div>

        {/* Autopay leaf */}
        <div style={{ position: 'absolute', left: autopay.x, top: autopay.y }}>
          <Card
            iconNode={<BoltIcon />}
            iconBg="color-mix(in oklab, var(--accent) 12%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Hands-free"
            desc="Card on file · charges on the 17th"
            width={autopay.w} height={autopay.h}
            portTop
            animDelay={8400}
          />
        </div>

        {/* Pay-each-invoice leaf — muted to match the inactive branch pill */}
        <div style={{ position: 'absolute', left: manual.x, top: manual.y }}>
          <Card
            iconNode={<ZapIcon />}
            iconBg="var(--bg-muted)"
            iconFg="var(--ink-5)"
            title="One-tap pay"
            desc="Email link · card, ACH, or check"
            active={false}
            width={manual.w} height={manual.h}
            portTop
          />
        </div>
      </div>
    </FlowShell>
  );
};

// ---------------------------------------------------------------------------
// 2. Reports — linear chain with an inline data chip between steps showing
//    the actual readings flowing through to the report.
// ---------------------------------------------------------------------------
// Reports — Attio-style workflow canvas. Cards are positioned absolutely on
// a fixed-size canvas so they can be offset horizontally with a hand-drawn
// rhythm (left, right-of-center, left). Connectors are elbow lines with
// 90° turns and chevron arrows landing on the next card's edge — not smooth
// beziers down a center axis. The active branch glows softly; the inactive
// branch is dashed gray with a ghosted card.
const ReportsFlow = () => {
  // Active stroke uses the SAME green family as our status pills
  // (#e7f6ec / #c8e8d2 / #1f7a3a), so the green outline on active cards,
  // the green port circles, and the green pills all read as one unified
  // "this succeeded" visual story. NOT using var(--accent) here because
  // our accent is brand blue — we want green for the workflow trace.
  const activeStroke = '#4aa873';
  const activeStrokeSoft = '#7fc99c';
  const inactiveStroke = 'color-mix(in oklab, var(--ink-6) 32%, transparent)';

  // Custom-path Card — instead of a CSS border, the outline is an SVG path
  // with NOTCHES cut out at the top and bottom center. The port circles
  // sit in those notches so the connector lines visually plug into the card.
  // This is the structural technique Attio uses to make the cards look
  // hand-drawn and wire-diagram-like, vs. plain rectangles.
  //
  // Active cards have two stacked strokes (gray base + accent overlay) so
  // the accent appears as a refined trace around the card.
  const Card = ({
    iconNode, iconBg, iconFg,
    title, tag, desc,
    active = true,
    width = 280, height = 80,
    portTop, portBottom, portLeft, portRight,
  }) => {
    const w = width, h = height;
    const cx = w / 2;
    const r = 12;
    // Continuous closed-rectangle path. The port circles overlay this
    // border at top-center and bottom-center — their white fill covers
    // the border behind them, so visually the circle looks like it sits
    // in a notch when in fact the border is unbroken. This is the same
    // trick the Attio reference uses.
    const path = `M ${r + 0.5} 0.5
      L ${w - r - 0.5} 0.5
      A ${r} ${r} 0 0 1 ${w - 0.5} ${r}
      L ${w - 0.5} ${h - r}
      A ${r} ${r} 0 0 1 ${w - r - 0.5} ${h - 0.5}
      L ${r + 0.5} ${h - 0.5}
      A ${r} ${r} 0 0 1 0.5 ${h - r}
      L 0.5 ${r}
      A ${r} ${r} 0 0 1 ${r + 0.5} 0.5 Z`;

    return (
      <div style={{
        position: 'relative', width: w, height: h,
        filter: 'drop-shadow(rgba(24, 39, 75, 0.04) 0px 4px 4px) drop-shadow(rgba(24, 39, 75, 0.02) 0px 2px 4px)',
        opacity: active ? 1 : 0.5,
      }}>
        <svg aria-hidden="true" width={w} height={h}
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {/* Base outline — always drawn in gray so the card has structure
              regardless of state */}
          <path d={path} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
          {/* Active overlay — accent green trace on top of the gray */}
          {active && (
            <path d={path} fill="none" stroke={activeStroke} strokeWidth="1" />
          )}
          {/* Port circles — sit on the card edge at center of each side.
              White fill covers the underlying border, making each port
              look like a notch in the card outline. */}
          {portTop && (
            <circle cx={cx} cy="0.5" r="5"
              fill="var(--bg)"
              stroke={active ? activeStroke : inactiveStroke}
              strokeWidth="1"
            />
          )}
          {portBottom && (
            <circle cx={cx} cy={h - 0.5} r="5"
              fill="var(--bg)"
              stroke={active ? activeStroke : inactiveStroke}
              strokeWidth="1"
            />
          )}
          {portLeft && (
            <circle cx="0.5" cy={h / 2} r="5"
              fill="var(--bg)"
              stroke={active ? activeStroke : inactiveStroke}
              strokeWidth="1"
            />
          )}
          {portRight && (
            <circle cx={w - 0.5} cy={h / 2} r="5"
              fill="var(--bg)"
              stroke={active ? activeStroke : inactiveStroke}
              strokeWidth="1"
            />
          )}
        </svg>

        {/* Card content — sits inside the SVG border */}
        <div style={{
          position: 'absolute', inset: 1,
          display: 'flex', flexDirection: 'column',
          padding: '12px',
          fontFamily: "'Geist', sans-serif",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
              <div aria-hidden="true" style={{
                width: 20, height: 20, borderRadius: 6,
                background: iconBg,
                color: iconFg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{iconNode}</div>
              <p style={{
                margin: 0,
                fontSize: 14, fontWeight: 600, lineHeight: '20px',
                letterSpacing: '-0.015em',
                color: active ? 'var(--ink)' : 'var(--ink-5)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{title}</p>
            </div>
            {tag && (
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '1px 7px',
                borderRadius: 6,
                background: 'var(--bg-muted)',
                color: 'var(--ink-5)',
                fontSize: 11.5, lineHeight: '16px',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{tag}</span>
            )}
          </div>
          <hr style={{ marginTop: 10, marginBottom: 'auto', border: 0, borderTop: '1px solid var(--line-2)' }} />
          {desc && (
            <p style={{
              margin: 0,
              fontSize: 12, lineHeight: '16px',
              color: 'var(--ink-5)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{desc}</p>
          )}
        </div>
      </div>
    );
  };

  // Status pill — using OUR existing green palette (#e7f6ec / #1f7a3a /
  // #c8e8d2 are the FlowPill values used everywhere else in the codebase).
  // Structural pattern lifted from Attio: 20px height, small check icon,
  // tight horizontal padding.
  const StatusBadge = ({ children }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20,
      padding: '0 7px 0 5px',
      background: '#e7f6ec',
      color: '#1f7a3a',
      border: '1px solid #c8e8d2',
      borderRadius: 6,
      fontSize: 12, lineHeight: '16px', fontWeight: 500,
      fontFamily: "'Geist', sans-serif",
      whiteSpace: 'nowrap',
    }}>
      <svg width="12" height="12" fill="none" aria-hidden="true">
        <path d="M3 5.727 3.742 6.9c.442.699.663 1.048.947 1.17a1 1 0 0 0 .778.007c.286-.118.512-.464.965-1.156L9 3"
          stroke="#1f7a3a" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </span>
  );

  // "Trigger" eyebrow tab — structural pattern lifted from Attio: rounded
  // top, flat bottom (open onto the card below), sits just above the card
  // top edge so it reads as a folder tab. Uses our palette.
  const TriggerTag = () => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 5px 8px',
      background: 'var(--bg-soft)',
      borderTop: '1px solid var(--line)',
      borderLeft: '1px solid var(--line)',
      borderRight: '1px solid var(--line)',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      fontSize: 12, color: 'var(--ink-5)', fontWeight: 500, lineHeight: '16px',
      fontFamily: "'Geist', sans-serif",
    }}>
      <svg width="12" height="12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r=".75" fill="var(--ink-5)" />
        <circle cx="6" cy="6" r="5" stroke="var(--ink-5)" strokeWidth="1.1" />
        <circle cx="6" cy="6" r="2.5" stroke="var(--ink-5)" strokeWidth="1.1" />
      </svg>
      Trigger
    </span>
  );

  // Icon SVGs — proper glyphs, not single characters. Closer to the
  // Attio reference where every icon is a real symbol.
  const TechIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  );
  const SendIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2z" />
    </svg>
  );
  const SwitchIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7h6l4 5l-4 5H3" />
      <path d="M3 7l4 5l-4 5" />
      <path d="M21 7h-4" />
      <path d="M21 17h-4" />
    </svg>
  );
  const BellIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
  const DocIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );

  // Branch pill — sits on the line at the junction. Wider/taller than the
  // simple BranchLabel, with a slight pill shape and the active one filled
  // green.
  const BranchPill = ({ children, active }) => {
    const styles = active
      ? { bg: 'color-mix(in oklab, #3a9b5e 12%, white)', fg: '#1f7a3a', bd: 'color-mix(in oklab, #3a9b5e 32%, white)' }
      : { bg: 'var(--bg)', fg: 'var(--ink-5)', bd: 'var(--line)' };
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        fontSize: 11.5, fontWeight: 500,
        borderRadius: 8,
        background: styles.bg, color: styles.fg,
        border: `1px solid ${styles.bd}`,
        fontFamily: "'Geist', sans-serif", letterSpacing: '-0.005em',
        boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 4px 8px -6px rgba(15, 23, 42, .15)',
        opacity: active ? 1 : 0.7,
      }}>{children}</span>
    );
  };

  // ---------------------------------------------------------------------
  // Canvas layout — absolute positioning so each card sits at a hand-tuned
  // x/y. The canvas is 460×620; cards and connectors are positioned by
  // % so they stay aligned regardless of column width.
  // ---------------------------------------------------------------------
  const CANVAS_W = 470;
  const CANVAS_H = 540;

  // Four-card vertical chain with a branch at the bottom:
  //   Stop closed (trigger)
  //      ↓ (GPS verified chip on the wire)
  //   Build branded report
  //      ↓
  //   Anything off-range? (switch)
  //      ↙       ↘
  //   Notify     Send
  //   the owner  service report
  const trigger   = { x: 22,  y: 40,  w: 270, h: 80 };
  const build     = { x: 160, y: 175, w: 290, h: 80 };
  const switchC   = { x: 70,  y: 310, w: 300, h: 80 };
  const alertL    = { x: 12,  y: 445, w: 215, h: 80 };
  const standardL = { x: 243, y: 445, w: 215, h: 80 };

  // Port coordinates — convert (card, side) to canvas position. The card
  // port circles sit on the card edges (top/bottom centered horizontally,
  // left/right centered vertically). Endpoint at exact port-circle center.
  const port = (c, side) => {
    if (side === 'top')    return { x: c.x + c.w / 2, y: c.y + 0.5 };
    if (side === 'bottom') return { x: c.x + c.w / 2, y: c.y + c.h - 0.5 };
    if (side === 'left')   return { x: c.x + 0.5, y: c.y + c.h / 2 };
    if (side === 'right')  return { x: c.x + c.w - 0.5, y: c.y + c.h / 2 };
  };

  return (
    <FlowShell maxWidth={CANVAS_W}>
      <div style={{ position: 'relative', width: '100%', maxWidth: CANVAS_W, height: CANVAS_H, fontFamily: "'Geist', sans-serif" }}>

        {/* Connector SVG — fixed pixel size to match card pixel coords.
            No preserveAspectRatio scaling (which would desync the wires
            from the absolutely-positioned cards). Wires start/end at
            port-circle centers on the card edges. */}
        <svg
          aria-hidden="true"
          width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
        >
          {(() => {
            const Tb  = port(trigger, 'bottom');
            const Bit = port(build, 'top');
            const Bb  = port(build, 'bottom');
            const St  = port(switchC, 'top');
            const Sb  = port(switchC, 'bottom');
            const Ait = port(alertL, 'top');
            const STt = port(standardL, 'top');

            // Elbow with rounded corners — wires that aren't perfectly
            // aligned vertically. Drops to midY, turns horizontally, drops
            // into target port. Endpoints extend 2px past ports.
            const elbow = (a, b) => {
              const midY = (a.y + b.y) / 2;
              const dir = b.x > a.x ? 1 : -1;
              const r = 8;
              return `M ${a.x} ${a.y - 2}
                      L ${a.x} ${midY - r}
                      Q ${a.x} ${midY} ${a.x + dir * r} ${midY}
                      L ${b.x - dir * r} ${midY}
                      Q ${b.x} ${midY} ${b.x} ${midY + r}
                      L ${b.x} ${b.y + 2}`;
            };

            return (
              <>
                <path d={elbow(Tb, Bit)} stroke={activeStroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d={elbow(Bb, St)} stroke={activeStroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d={elbow(Sb, Ait)} stroke={activeStroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d={elbow(Sb, STt)} stroke={activeStroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </>
            );
          })()}
        </svg>

        {/* Trigger — Stop closed */}
        <div style={{ position: 'absolute', left: trigger.x, top: trigger.y }}>
          <div style={{ position: 'absolute', top: -22, left: 10, zIndex: 0 }}>
            <TriggerTag />
          </div>
          <div style={{ position: 'absolute', top: -22, right: 14, zIndex: 3 }}>
            <StatusBadge>Triggered</StatusBadge>
          </div>
          <Card
            iconNode={<TechIcon />}
            iconBg="color-mix(in oklab, var(--accent) 14%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Stop closed"
            tag="Tech app"
            desc="Photos, chemistry, dosing submitted"
            width={trigger.w} height={trigger.h}
            portBottom
          />
        </div>

        {/* GPS chip — sits in the open space to the LEFT of the elbow,
            vertically centered on the horizontal wire segment between
            trigger and build cards. */}
        <div style={{ position: 'absolute', left: 22, top: 136, zIndex: 2 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 11px',
            background: 'var(--bg)',
            border: `1px solid ${activeStrokeSoft}`,
            borderRadius: 999,
            fontSize: 11.5,
            boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 8px 18px -12px rgba(15, 23, 42, .2)',
          }}>
            <span aria-hidden="true" style={{
              width: 14, height: 14, borderRadius: '50%',
              background: '#e7f6ec',
              color: activeStroke,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8,
            }}>◉</span>
            <span style={{ color: 'var(--ink-5)' }}>GPS</span>
            <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>verified</span>
          </span>
        </div>

        {/* Build branded report */}
        <div style={{ position: 'absolute', left: build.x, top: build.y }}>
          <div style={{ position: 'absolute', top: -22, right: 14, zIndex: 3 }}>
            <StatusBadge>Completed</StatusBadge>
          </div>
          <Card
            iconNode={<SendIcon />}
            iconBg="color-mix(in oklab, var(--accent) 12%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Build branded report"
            tag="Templates"
            desc="Pulls owner, pool, readings, photos"
            width={build.w} height={build.h}
            portTop portBottom
          />
        </div>

        {/* Switch — Anything off-range? */}
        <div style={{ position: 'absolute', left: switchC.x, top: switchC.y }}>
          <div style={{ position: 'absolute', top: -22, right: 14, zIndex: 3 }}>
            <StatusBadge>Checked</StatusBadge>
          </div>
          <Card
            iconNode={<SwitchIcon />}
            iconBg="color-mix(in oklab, #7c3aed 12%, white)"
            iconFg="#7c3aed"
            title="Anything off-range?"
            tag="Condition"
            desc="High Cl · low water · equipment off"
            width={switchC.w} height={switchC.h}
            portTop portBottom
          />
        </div>

        {/* Alert leaf — Notify the office */}
        <div style={{ position: 'absolute', left: alertL.x, top: alertL.y }}>
          <Card
            iconNode={<BellIcon />}
            iconBg="color-mix(in oklab, var(--accent) 12%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Notify the office"
            desc="Low water flagged at the pool"
            width={alertL.w} height={alertL.h}
            portTop
          />
        </div>

        {/* Standard leaf — Send service report */}
        <div style={{ position: 'absolute', left: standardL.x, top: standardL.y }}>
          <Card
            iconNode={<SendIcon />}
            iconBg="color-mix(in oklab, var(--accent) 12%, white)"
            iconFg="color-mix(in oklab, var(--accent) 75%, black)"
            title="Send service report"
            desc="Email with low-water notice"
            width={standardL.w} height={standardL.h}
            portTop
          />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <InlineResult>One less thing to worry about · proof of every visit</InlineResult>
      </div>
    </FlowShell>
  );
};

// ---------------------------------------------------------------------------
// 3. Billing — Customer setup → frequency selected → invoice auto-fires on
//    schedule → customer pays through their preferred method (CC/ACH/check).
// ---------------------------------------------------------------------------
// Billing — calendar-backbone silhouette. A vertical "ledger" runs down the
// left side with each step pinned to its actual date. The recurring invoice
// dates are part of the spine, not a separate chip, so the cadence story is
// the layout itself.
const BillingFlow = () => {
  const accentStroke = 'color-mix(in oklab, var(--accent) 65%, transparent)';
  const mutedStroke = 'color-mix(in oklab, var(--ink-6) 40%, transparent)';
  const dateColor = 'color-mix(in oklab, var(--accent) 75%, black)';
  const dateColorMuted = 'var(--ink-5)';

  // A single row of the ledger: date marker on the left, card on the right.
  // The dot on the spine + horizontal stub line tie the row to the date.
  const LedgerRow = ({ date, dateMuted, children, lastInGroup, gapBelow = 16, dimmed }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '64px 14px 1fr', alignItems: 'start', columnGap: 8 }}>
      {/* left column: date label */}
      <div style={{
        textAlign: 'right',
        fontSize: 11, fontFamily: "'Geist Mono', monospace",
        fontVariantNumeric: 'tabular-nums',
        color: dateMuted ? dateColorMuted : dateColor,
        fontWeight: dateMuted ? 500 : 600,
        paddingTop: 6, lineHeight: 1.2,
        opacity: dimmed ? 0.55 : 1,
      }}>{date}</div>

      {/* middle column: spine dot + connector to the next row */}
      <div aria-hidden="true" style={{ position: 'relative', height: '100%', minHeight: 28 }}>
        {/* vertical line spans the full row height; lastInGroup hides the tail */}
        <div style={{
          position: 'absolute', left: 6, top: 10, bottom: lastInGroup ? '50%' : -gapBelow,
          width: 1.5,
          background: dimmed ? mutedStroke : accentStroke,
        }} />
        {/* dot at the row's date */}
        <div style={{
          position: 'absolute', left: 1, top: 5,
          width: 13, height: 13, borderRadius: '50%',
          background: 'var(--bg)',
          border: `2px solid ${dimmed ? mutedStroke : accentStroke}`,
        }} />
        {/* horizontal stub leading to the card */}
        <div style={{
          position: 'absolute', left: 12, top: 11,
          width: 10, height: 1.5,
          background: dimmed ? mutedStroke : accentStroke,
        }} />
      </div>

      {/* right column: the actual card(s) */}
      <div style={{ paddingBottom: gapBelow, opacity: dimmed ? 0.55 : 1 }}>{children}</div>
    </div>
  );

  const cardBase = {
    background: 'var(--bg)',
    border: '1px solid color-mix(in oklab, var(--accent) 35%, var(--line))',
    borderRadius: 10,
    padding: '10px 12px',
    boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 12px 28px -22px color-mix(in oklab, var(--accent) 35%, rgba(15, 23, 42, .25))',
    fontFamily: "'Geist', sans-serif",
  };
  const cardMuted = {
    ...cardBase,
    border: '1px solid var(--line)',
    boxShadow: '0 1px 0 rgba(15, 23, 42, .02)',
  };

  const Card = ({ icon, iconBg, iconFg, title, tag, desc, statusLabel, muted }) => (
    <div style={{ position: 'relative' }}>
      {statusLabel && !muted && (
        <div style={{ position: 'absolute', top: -9, right: 6, zIndex: 2 }}>
          <FlowPill tone="good">✓ {statusLabel}</FlowPill>
        </div>
      )}
      <div style={muted ? cardMuted : cardBase}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div aria-hidden="true" style={{
            width: 20, height: 20, borderRadius: 5,
            background: iconBg, color: iconFg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>{icon}</div>
          <div style={{
            flex: 1, minWidth: 0,
            fontSize: 12.5, fontWeight: 600,
            color: muted ? 'var(--ink-4)' : 'var(--ink)', letterSpacing: '-0.01em',
          }}>{title}</div>
          {tag && <span style={{
            fontSize: 9.5, color: 'var(--ink-5)',
            padding: '1px 6px', borderRadius: 4,
            background: 'var(--bg-muted)',
            fontFamily: "'Geist Mono', monospace", letterSpacing: '-0.005em',
          }}>{tag}</span>}
        </div>
        {desc && <div style={{
          marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--line-2)',
          fontSize: 10.5, color: 'var(--ink-5)', lineHeight: 1.35,
        }}>{desc}</div>}
      </div>
    </div>
  );

  return (
    <FlowShell maxWidth={520}>
      <LedgerRow date="Mar 12">
        <Card
          icon="◎"
          iconBg="color-mix(in oklab, var(--accent) 14%, white)"
          iconFg="color-mix(in oklab, var(--accent) 75%, black)"
          title="Customer added"
          tag="Customers"
          desc="Vega, M. · weekly service"
          statusLabel="Saved"
        />
      </LedgerRow>

      <LedgerRow date="Mar 12" dateMuted gapBelow={20}>
        <Card
          icon="▸"
          iconBg="color-mix(in oklab, var(--accent) 10%, white)"
          iconFg="color-mix(in oklab, var(--accent) 75%, black)"
          title="Locked: monthly on the 17th"
          tag="Schedule"
          desc="Invoice any day of the month — never forced to the 1st"
          statusLabel="Set"
        />
      </LedgerRow>

      <LedgerRow date="Mar 17" gapBelow={12}>
        <Card
          icon="▸"
          iconBg="color-mix(in oklab, var(--accent) 10%, white)"
          iconFg="color-mix(in oklab, var(--accent) 75%, black)"
          title="Mar 17 invoice fires"
          tag="Billing"
          desc="Sent by email · pay one tap · receipt + portal"
          statusLabel="Sent"
        />
        {/* the two payment paths nest under this date as sub-rows */}
        <div style={{
          marginTop: 10, marginLeft: 14,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          position: 'relative',
        }}>
          {/* small bracket connecting back to the parent card */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: -8, top: -10, bottom: '50%',
            width: 8, borderLeft: `1.5px solid ${accentStroke}`, borderBottom: `1.5px solid ${accentStroke}`,
            borderBottomLeftRadius: 6,
          }} />
          <div>
            <div style={{ marginBottom: 4 }}>
              <BranchLabel tone="good" active>Card / ACH</BranchLabel>
            </div>
            <MiniStep label="Paid from email" desc="Autopay · receipt sent" statusLabel="Paid" />
          </div>
          <div>
            <div style={{ marginBottom: 4 }}>
              <BranchLabel tone="good" active>Check</BranchLabel>
            </div>
            <MiniStep label="Marked paid" desc="Logged by the office" statusLabel="Logged" />
          </div>
        </div>
      </LedgerRow>

      {/* upcoming-month markers — ghost rows that hint at recurrence without
          repeating the cards. The spine continues; the cards are absent. */}
      <LedgerRow date="Apr 17" dateMuted dimmed gapBelow={10}>
        <div style={{
          fontSize: 11, color: 'var(--ink-5)',
          padding: '4px 0',
          fontStyle: 'italic',
        }}>Next invoice queued</div>
      </LedgerRow>
      <LedgerRow date="May 17" dateMuted dimmed gapBelow={0} lastInGroup>
        <div style={{ fontSize: 11, color: 'var(--ink-6)', padding: '4px 0' }}>…and every month after</div>
      </LedgerRow>

      <div style={{ marginTop: 18, marginLeft: 86 }}>
        <InlineResult indent={0}>Every customer billed on their own day · no batches, no chasing</InlineResult>
      </div>
    </FlowShell>
  );
};

// BillingPhone — phone-frame mockup showing the customer-facing invoice.
// Mirrors the PhoneWithReport pattern (Reports section): same dark frame,
// notch, status bar with live time, frosted top overlay, scrollable
// content area. The screen content is the InvoiceContent component
// (matches the actual invoice the customer pays from).
const BillingPhone = () => {
  // When the customer taps "Choose payment method" on the invoice, slide
  // up a bottom sheet showing the three payment options (Card / ACH /
  // Check) with the surcharge breakdown. Tap X or backdrop to dismiss.
  const [sheetOpen, setSheetOpen] = React.useState(false);
  return (
    <div style={{
      width: 290,
      borderRadius: 38,
      padding: 7,
      background: 'linear-gradient(180deg, #1a1d24 0%, #0f1217 100%)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(15, 23, 42, 0.4), 0 14px 28px -16px rgba(15, 23, 42, 0.3)',
      position: 'relative',
    }}>
      <div style={{
        position: 'relative',
        height: 580,
        borderRadius: 32,
        background: '#f7f8fa',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Frosted overlay at top */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 44,
          zIndex: 9,
          pointerEvents: 'none',
          backdropFilter: 'blur(8px) saturate(140%)',
          WebkitBackdropFilter: 'blur(8px) saturate(140%)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 60%, rgba(255,255,255,0) 100%)',
          maskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
        }} />

        {/* Notch */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 90, height: 22,
          background: '#0f1217',
          borderRadius: 999,
          zIndex: 10,
        }} />

        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 22px 0',
          fontSize: 11, color: '#0f0f0e',
          fontFamily: "'Geist', sans-serif",
          fontWeight: 600,
          zIndex: 11,
          pointerEvents: 'none',
        }}>
          <span><LiveStatusBarTime /></span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 10 }}>
            <span aria-hidden="true">●●●○</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>87%</span>
          </span>
        </div>

        {/* Scrollable invoice content — uses the iOS system font stack
            to match the actual PoolLogic invoice (its body uses
            -apple-system / BlinkMacSystemFont). */}
        <div
          className="phone-report-scroll hide-scrollbar"
          style={{
            position: 'absolute', inset: 0,
            paddingTop: 38,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <InvoiceContent onChoosePayment={() => setSheetOpen(true)} />
        </div>

        {/* Payment-method bottom sheet — slides up from the bottom when
            "Choose payment method" is tapped. Backdrop dims the invoice
            behind it. Tap X or the backdrop to dismiss. */}
        <PaymentMethodSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      </div>
    </div>
  );
};

// PaymentMethodSheet — bottom-sheet that slides up over the invoice when
// the customer taps "Choose payment method." Shows the three options
// (Card / ACH / Check) with their respective amounts (Card includes the
// 2.9% surcharge breakdown). Backdrop dims the invoice behind it; tap X
// or the backdrop to dismiss.
const PaymentMethodSheet = ({ open, onClose }) => {
  const methods = [
    {
      key: 'card',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="6" width="18" height="13" rx="2.5" />
          <line x1="3" y1="11" x2="21" y2="11" />
          <line x1="7" y1="15.5" x2="11" y2="15.5" />
        </svg>
      ),
      label: 'Pay by credit card',
      sub: '+2.9% surcharge',
      amount: '$179.05',
      surcharge: '+$5.05',
    },
    {
      key: 'ach',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18M5 21V11M19 21V11M3 10h18L12 4z" />
          <path d="M9 21V13M15 21V13" />
        </svg>
      ),
      label: 'Pay by ACH',
      sub: 'no surcharge',
      amount: '$174.00',
    },
    {
      key: 'check',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      ),
      label: 'Mail a check',
      sub: 'no surcharge',
      amount: '$174.00',
    },
  ];

  return (
    <>
      {/* Backdrop — gentle dim + light blur of the invoice behind it,
          matching the real app's softer treatment. */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          zIndex: 12,
          background: 'rgba(15, 23, 42, 0.22)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 280ms ease',
        }}
      />

      {/* Sheet */}
      <div
        aria-hidden={!open}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          zIndex: 13,
          background: '#ffffff',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          paddingBottom: 14,
          maxHeight: '88%',
          overflowY: 'auto',
        }}
        className="hide-scrollbar"
      >
        {/* Drag handle */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          padding: '8px 0 6px',
        }}>
          <div style={{
            width: 36, height: 4, borderRadius: 3,
            background: '#d6d3d1',
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '4px 14px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: '#1c1917', letterSpacing: '-0.015em',
            lineHeight: 1.25,
          }}>How would you like to pay?</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              width: 20, height: 20,
              background: 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: 0,
              color: '#78716c',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Amount due */}
        <div style={{ padding: '8px 14px 12px' }}>
          <div style={{
            fontSize: 8.5, fontWeight: 700,
            color: '#a8a29e',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Amount Due</div>
          <div style={{
            fontSize: 24, fontWeight: 800,
            color: '#1c1917', letterSpacing: '-0.025em',
            lineHeight: 1.05,
            fontVariantNumeric: 'tabular-nums',
            marginTop: 2,
          }}>$174.00</div>
          <div style={{
            fontSize: 9.5, color: '#78716c',
            lineHeight: 1.5, marginTop: 4,
          }}>
            to <span style={{ color: '#1c1917', fontWeight: 700 }}>BAYSHORE POOL CO.</span>
            {' · '}INV - 36,308 · Due Mar 24
          </div>
        </div>

        {/* Divider — full-width edge-to-edge, matching the real app */}
        <div style={{ height: 1, background: '#f0efed', margin: '0 0 12px' }} />

        {/* Payment method rows */}
        <div style={{
          padding: '0 12px',
          display: 'flex', flexDirection: 'column', gap: 7,
        }}>
          {methods.map((m) => (
            <button
              key={m.key}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 11px',
                background: '#ffffff',
                border: '1px solid #e7e5e4',
                borderRadius: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              {/* Icon — smaller, no chunky tinted bg */}
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: '#eef4fa',
                color: '#2977b7',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {React.cloneElement(m.icon, { width: 14, height: 14 })}
              </span>

              {/* Label + sub stacked */}
              <span style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                <span style={{
                  display: 'block',
                  fontSize: 11.5, fontWeight: 700, color: '#1c1917',
                  letterSpacing: '-0.005em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{m.label}</span>
                <span style={{
                  display: 'block',
                  fontSize: 9.5, color: '#a8a29e',
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                }}>{m.sub}</span>
              </span>

              {/* Amount + chevron inline */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                flexShrink: 0,
              }}>
                <span style={{ textAlign: 'right', lineHeight: 1.2 }}>
                  <span style={{
                    display: 'block',
                    fontSize: 12, fontWeight: 700, color: '#1c1917',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{m.amount}</span>
                  {m.surcharge && (
                    <span style={{
                      display: 'block',
                      fontSize: 9, color: '#a8a29e',
                      marginTop: 2,
                      fontVariantNumeric: 'tabular-nums',
                    }}>{m.surcharge}</span>
                  )}
                </span>
                <span aria-hidden="true" style={{ color: '#a8a29e', display: 'inline-flex', marginLeft: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '12px 14px 4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            fontSize: 9, color: '#a8a29e',
            display: 'inline-flex', gap: 7, alignItems: 'center',
          }}>
            <span>Terms</span>
            <span style={{ color: '#d6d3d1' }}>·</span>
            <span>Privacy</span>
            <span style={{ color: '#d6d3d1' }}>·</span>
            <span>Surcharge disclosure</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 9.5, color: '#78716c',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Secured by</span>
            <StripeWordmark height={10} />
          </div>
        </div>
      </div>
    </>
  );
};

// Stripe's official Slate wordmark. We display this on the customer
// checkout surfaces where Stripe actually processes payments (matches
// our real product). Per Stripe's Marks Usage Terms we must use the
// unmodified official mark — no recoloring or style changes.
const StripeWordmark = ({ height = 10 }) => {
  // Source aspect ratio is 360 × 151. Scale width to match height.
  const width = (height * 360) / 151;
  return (
    <svg
      width={width} height={height} viewBox="0 0 360 151"
      xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Stripe"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M360 78.2001C360 52.6001 347.6 32.4001 323.9 32.4001C300.1 32.4001 285.7 52.6001 285.7 78.0001C285.7 108.1 302.7 123.3 327.1 123.3C339 123.3 348 120.6 354.8 116.8V96.8001C348 100.2 340.2 102.3 330.3 102.3C320.6 102.3 312 98.9002 310.9 87.1002H359.8C359.8 85.8002 360 80.6002 360 78.2001ZM310.6 68.7001C310.6 57.4002 317.5 52.7001 323.8 52.7001C329.9 52.7001 336.4 57.4002 336.4 68.7001H310.6Z" fill="#061B31"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M247.1 32.4001C237.3 32.4001 231 37.0001 227.5 40.2001L226.2 34.0001H204.2V150.6L229.2 145.3L229.3 117C232.9 119.6 238.2 123.3 247 123.3C264.9 123.3 281.2 108.9 281.2 77.2001C281.1 48.2001 264.6 32.4001 247.1 32.4001ZM241.1 101.3C235.2 101.3 231.7 99.2001 229.3 96.6002L229.2 59.5001C231.8 56.6001 235.4 54.6002 241.1 54.6002C250.2 54.6002 256.5 64.8001 256.5 77.9001C256.5 91.3001 250.3 101.3 241.1 101.3Z" fill="#061B31"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M169.8 26.5L194.9 21.1V0.800049L169.8 6.10005V26.5Z" fill="#061B31"/>
      <path d="M194.9 34.1001H169.8V121.6H194.9V34.1001Z" fill="#061B31"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M142.9 41.5001L141.3 34.1001H119.7V121.6H144.7V62.3001C150.6 54.6001 160.6 56.0001 163.7 57.1001V34.1001C160.5 32.9001 148.8 30.7001 142.9 41.5001Z" fill="#061B31"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M92.8999 12.4001L68.4999 17.6001L68.3999 97.7001C68.3999 112.5 79.4999 123.4 94.2999 123.4C102.5 123.4 108.5 121.9 111.8 120.1V99.8001C108.6 101.1 92.7999 105.7 92.7999 90.9001V55.4001H111.8V34.1002H92.7999L92.8999 12.4001Z" fill="#061B31"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M25.3 59.5001C25.3 55.6001 28.5 54.1002 33.8 54.1002C41.4 54.1002 51 56.4001 58.6 60.5001V37.0001C50.3 33.7001 42.1 32.4001 33.8 32.4001C13.5 32.4001 0 43.0001 0 60.7001C0 88.3001 38 83.9001 38 95.8001C38 100.4 34 101.9 28.4 101.9C20.1 101.9 9.5 98.5002 1.1 93.9002V117.7C10.4 121.7 19.8 123.4 28.4 123.4C49.2 123.4 63.5 113.1 63.5 95.2001C63.4 65.4001 25.3 70.7001 25.3 59.5001Z" fill="#061B31"/>
    </svg>
  );
};

// Apple Pay Mark — official RGB artwork from developer.apple.com/apple-pay/marketing.
// Used UNMODIFIED per Apple's Marketing Guidelines:
//   • Use only Apple-provided artwork (no custom recreations)
//   • Do not alter color, aspect ratio, corner radius
//   • Do not add shadows, animations, or effects
//   • Maintain clear space ≥ ¼ the height of the mark
//   • Don't display smaller than other payment marks
// Source aspect ratio is 165.521 × 105.965 (≈ 1.562 : 1).
const ApplePayMark = ({ height = 32 }) => {
  const width = (height * 165.521) / 105.965;
  return (
    <svg
      width={width} height={height}
      viewBox="0 0 165.52107 105.9651"
      xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Apple Pay"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <g>
        <path d="M150.69807,0H14.82318c-0.5659,0-1.1328,0-1.69769,0.0033c-0.47751,0.0034-0.95391,0.0087-1.43031,0.0217 c-1.039,0.0281-2.0869,0.0894-3.1129,0.2738c-1.0424,0.1876-2.0124,0.4936-2.9587,0.9754 c-0.9303,0.4731-1.782,1.0919-2.52009,1.8303c-0.73841,0.7384-1.35721,1.5887-1.83021,2.52 c-0.4819,0.9463-0.7881,1.9166-0.9744,2.9598c-0.18539,1.0263-0.2471,2.074-0.2751,3.1119 c-0.0128,0.4764-0.01829,0.9528-0.0214,1.4291c-0.0033,0.5661-0.0022,1.1318-0.0022,1.6989V91.142 c0,0.5671-0.0011,1.13181,0.0022,1.69901c0.00311,0.4763,0.0086,0.9527,0.0214,1.4291 c0.028,1.03699,0.08971,2.08469,0.2751,3.11069c0.1863,1.0436,0.4925,2.0135,0.9744,2.9599 c0.473,0.9313,1.0918,1.7827,1.83021,2.52c0.73809,0.7396,1.58979,1.3583,2.52009,1.8302 c0.9463,0.4831,1.9163,0.7892,2.9587,0.9767c1.026,0.1832,2.0739,0.2456,3.1129,0.2737c0.4764,0.0108,0.9528,0.0172,1.43031,0.0194 c0.56489,0.0044,1.13179,0.0044,1.69769,0.0044h135.87489c0.5649,0,1.13181,0,1.69659-0.0044 c0.47641-0.0022,0.95282-0.0086,1.4314-0.0194c1.0368-0.0281,2.0845-0.0905,3.11301-0.2737 c1.041-0.1875,2.0112-0.4936,2.9576-0.9767c0.9313-0.4719,1.7805-1.0906,2.52011-1.8302c0.7372-0.7373,1.35599-1.5887,1.8302-2.52 c0.48299-0.9464,0.78889-1.9163,0.97429-2.9599c0.1855-1.026,0.2457-2.0737,0.2738-3.11069 c0.013-0.4764,0.01941-0.9528,0.02161-1.4291c0.00439-0.5672,0.00439-1.1319,0.00439-1.69901V14.8242 c0-0.5671,0-1.1328-0.00439-1.6989c-0.0022-0.4763-0.00861-0.9527-0.02161-1.4291c-0.02811-1.0379-0.0883-2.0856-0.2738-3.1119 c-0.18539-1.0432-0.4913-2.0135-0.97429-2.9598c-0.47421-0.9313-1.093-1.7816-1.8302-2.52 c-0.73961-0.7384-1.58881-1.3572-2.52011-1.8303c-0.9464-0.4818-1.9166-0.7878-2.9576-0.9754 c-1.0285-0.1844-2.0762-0.2457-3.11301-0.2738c-0.47858-0.013-0.95499-0.0183-1.4314-0.0217C151.82988,0,151.26297,0,150.69807,0 L150.69807,0z" />
        <path fill="#FFFFFF" d="M150.69807,3.532l1.67149,0.0032c0.4528,0.0032,0.90561,0.0081,1.36092,0.0205 c0.79201,0.0214,1.71849,0.0643,2.58209,0.2191c0.7507,0.1352,1.38029,0.3408,1.9845,0.6484 c0.5965,0.3031,1.14301,0.7003,1.62019,1.1768c0.479,0.4797,0.87671,1.0271,1.18381,1.6302 c0.30589,0.5995,0.51019,1.2261,0.64459,1.9823c0.1544,0.8542,0.1971,1.7832,0.21881,2.5801 c0.01219,0.4498,0.01819,0.8996,0.0204,1.3601c0.00429,0.5569,0.0042,1.1135,0.0042,1.6715V91.142 c0,0.558,0.00009,1.1136-0.0043,1.6824c-0.00211,0.4497-0.0081,0.8995-0.0204,1.3501c-0.02161,0.7957-0.0643,1.7242-0.2206,2.5885 c-0.13251,0.7458-0.3367,1.3725-0.64429,1.975c-0.30621,0.6016-0.70331,1.1484-1.18022,1.6251 c-0.47989,0.48-1.0246,0.876-1.62819,1.1819c-0.5997,0.3061-1.22821,0.51151-1.97151,0.6453 c-0.88109,0.157-1.84639,0.2002-2.57339,0.2199c-0.4574,0.0103-0.9126,0.01649-1.37889,0.0187 c-0.55571,0.0043-1.1134,0.0042-1.6692,0.0042H14.82318c-0.0074,0-0.0146,0-0.0221,0c-0.5494,0-1.0999,0-1.6593-0.0043 c-0.4561-0.00211-0.9112-0.0082-1.3512-0.0182c-0.7436-0.0201-1.7095-0.0632-2.5834-0.2193 c-0.74969-0.1348-1.3782-0.3402-1.9858-0.6503c-0.59789-0.3032-1.1422-0.6988-1.6223-1.1797 c-0.4764-0.4756-0.8723-1.0207-1.1784-1.6232c-0.3064-0.6019-0.5114-1.2305-0.64619-1.9852 c-0.15581-0.8626-0.19861-1.7874-0.22-2.5777c-0.01221-0.4525-0.01731-0.9049-0.02021-1.3547l-0.0022-1.3279l0.0001-0.3506V14.8242 l-0.0001-0.3506l0.0021-1.3251c0.003-0.4525,0.0081-0.9049,0.02031-1.357c0.02139-0.7911,0.06419-1.7163,0.22129-2.5861 c0.1336-0.7479,0.3385-1.3765,0.6465-1.9814c0.3037-0.5979,0.7003-1.1437,1.17921-1.6225 c0.477-0.4772,1.02309-0.8739,1.62479-1.1799c0.6011-0.3061,1.2308-0.5116,1.9805-0.6465c0.8638-0.1552,1.7909-0.198,2.5849-0.2195 c0.4526-0.0123,0.9052-0.0172,1.3544-0.0203l1.6771-0.0033H150.69807" />
        <g>
          <g>
            <path d="M45.1862,35.64053c1.41724-1.77266,2.37897-4.15282,2.12532-6.58506c-2.07464,0.10316-4.60634,1.36871-6.07207,3.14276 c-1.31607,1.5192-2.4809,3.99902-2.17723,6.3293C41.39111,38.72954,43.71785,37.36345,45.1862,35.64053" />
            <path d="M47.28506,38.98252c-3.38211-0.20146-6.25773,1.91951-7.87286,1.91951c-1.61602,0-4.08931-1.81799-6.76438-1.76899 c-3.48177,0.05114-6.71245,2.01976-8.4793,5.15079c-3.63411,6.2636-0.95904,15.55471,2.57494,20.65606 c1.71618,2.5238,3.78447,5.30269,6.50976,5.20287c2.57494-0.10104,3.58421-1.66732,6.71416-1.66732 c3.12765,0,4.03679,1.66732,6.76252,1.61681c2.82665-0.05054,4.59381-2.52506,6.30997-5.05132 c1.96878-2.877,2.77473-5.65498,2.82542-5.80748c-0.0507-0.05051-5.45058-2.12204-5.50065-8.33358 c-0.05098-5.20101,4.23951-7.6749,4.44144-7.82832C52.3832,39.4881,48.5975,39.08404,47.28506,38.98252" />
          </g>
          <g>
            <path d="M76.73385,31.94381c7.35096,0,12.4697,5.06708,12.4697,12.44437c0,7.40363-5.22407,12.49704-12.65403,12.49704h-8.13892 v12.94318h-5.88037v-37.8846H76.73385z M68.41059,51.9493h6.74732c5.11975,0,8.0336-2.75636,8.0336-7.53479 c0-4.77792-2.91385-7.50845-8.00727-7.50845h-6.77365V51.9493z" />
            <path d="M90.73997,61.97864c0-4.8311,3.70182-7.79761,10.26583-8.16526l7.56061-0.44614v-2.12639 c0-3.07185-2.07423-4.90959-5.53905-4.90959c-3.28251,0-5.33041,1.57492-5.82871,4.04313h-5.35574 c0.31499-4.98859,4.56777-8.66407,11.3941-8.66407c6.69466,0,10.97377,3.54432,10.97377,9.08388v19.03421h-5.43472v-4.54194 h-0.13065c-1.60125,3.07185-5.09341,5.01441-8.71623,5.01441C94.52078,70.30088,90.73997,66.94038,90.73997,61.97864z M108.56641,59.4846v-2.17905l-6.8,0.41981c-3.38683,0.23649-5.30306,1.73291-5.30306,4.09579 c0,2.41504,1.99523,3.99046,5.04075,3.99046C105.46823,65.81161,108.56641,63.08108,108.56641,59.4846z" />
            <path d="M119.34167,79.9889v-4.5946c0.4193,0.10483,1.36425,0.10483,1.83723,0.10483c2.6252,0,4.04313-1.10245,4.90908-3.9378 c0-0.05267,0.49931-1.68025,0.49931-1.70658l-9.97616-27.64562h6.14268l6.98432,22.47371h0.10432l6.98433-22.47371h5.9857 l-10.34483,29.06304c-2.36186,6.69517-5.0924,8.84789-10.81577,8.84789C121.17891,80.12006,119.76098,80.06739,119.34167,79.9889z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

// Apple Pay lockup — just the Apple-logo + "Pay" wordmark from Apple's
// official Apple Pay Mark, with the rounded-rect background stripped out.
// Used inside a custom white button (Apple Pay Button white variant) since
// Apple doesn't publish a downloadable button SVG. Paths and transform are
// copied verbatim from the CMYK Apple Pay Mark so the lockup typography is
// Apple's official artwork.
const ApplePayLockup = ({ height = 22, color = '#000' }) => {
  // The lockup occupies roughly the inner region of the 220.69×141.29 mark.
  // Lockup bounding box (in pre-transform path units, since the transform
  // is matrix(0.1333,0,0,-0.1333,0,141.29)):
  //   x: ~225 to ~1450, y: ~260 to ~770 (path units)
  // After transform: x ≈ 30 to 193, y ≈ 38 to 106 (px in 220.69×141.29 box)
  // So the lockup natural box is ~163 × 68 px. Aspect ratio ≈ 2.4 : 1.
  const ratio = 163 / 68;
  const width = height * ratio;
  return (
    <svg
      width={width} height={height}
      viewBox="30 38 163 68"
      xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Apple Pay"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <g transform="matrix(0.13333333,0,0,-0.13333333,0,141.29333)" fill={color}>
        <path d="M 451.859,703.246 c 14.176,17.723 23.789,41.527 21.254,65.848 -20.746,-1.031 -46.062,-13.688 -60.718,-31.426 -13.161,-15.191 -24.805,-39.988 -21.774,-63.297 23.289,-2.016 46.559,11.641 61.238,28.875" />
        <path d="m 472.852,669.828 c -33.825,2.012 -62.579,-19.203 -78.731,-19.203 -16.156,0 -40.894,18.188 -67.641,17.691 -34.82,-0.507 -67.125,-20.195 -84.796,-51.503 -36.34,-62.637 -9.59,-155.551 25.754,-206.567 17.156,-25.234 37.839,-53.016 65.097,-52.019 25.746,1.003 35.84,16.668 67.137,16.668 31.281,0 40.371,-16.668 67.629,-16.172 28.265,0.507 45.937,25.254 63.097,50.519 19.692,28.77 27.747,56.551 28.254,58.074 -0.507,0.508 -54.507,21.223 -55.004,83.336 -0.511,52.012 42.391,76.746 44.415,78.282 -24.231,35.836 -62.086,39.879 -75.211,40.894" />
        <path d="M 684.105,540.16 h 67.473 c 51.199,0 80.336,27.563 80.336,75.344 0,47.781 -29.137,75.086 -80.074,75.086 h -67.735 z m 83.235,200.051 c 73.512,0 124.691,-50.668 124.691,-124.441 0,-74.04 -52.234,-124.977 -126.539,-124.977 H 684.105 V 361.371 h -58.8 v 378.84 H 767.34" />
        <path d="m 1085.66,464.809 v 21.785 l -67.99,-4.199 c -33.869,-2.364 -53.041,-17.325 -53.041,-40.957 0,-24.149 19.961,-39.903 50.411,-39.903 39.64,0 70.62,27.305 70.62,63.274 z M 907.402,439.867 c 0,48.309 37.012,77.977 102.658,81.649 l 75.6,4.464 v 21.262 c 0,30.719 -20.74,49.094 -55.39,49.094 -32.821,0 -53.297,-15.746 -58.29,-40.43 h -53.55 c 3.152,49.887 45.679,86.641 113.94,86.641 66.95,0 109.74,-35.445 109.74,-90.84 V 361.371 h -54.35 v 45.418 h -1.3 c -16.02,-30.723 -50.94,-50.144 -87.175,-50.144 -54.082,0 -91.883,33.601 -91.883,83.222" />
        <path d="m 1193.42,259.758 v 45.949 c 4.19,-1.047 13.64,-1.047 18.37,-1.047 26.25,0 40.43,11.028 49.09,39.375 0,0.528 4.99,16.809 4.99,17.07 l -99.76,276.458 h 61.43 l 69.84,-224.739 h 1.05 l 69.84,224.739 h 59.86 L 1324.68,346.926 c -23.63,-66.953 -50.93,-88.477 -108.16,-88.477 -4.73,0 -18.91,0.528 -23.1,1.309" />
      </g>
    </svg>
  );
};

// InvoiceContent — JSX rendition of the customer-facing invoice page that
// opens when they tap the Pay button in the email. Uses Stripe's official
// wordmark (StripeWordmark) on payment-related surfaces only.
const InvoiceContent = ({ onChoosePayment }) => {
  // Whether the line-item detail row is expanded. Mirrors the actual
  // invoice's "View details" / "Hide details" toggle (chevron flips).
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  return (
  <div style={{
    background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 20%, rgba(41, 119, 183, 0.04) 70%, rgba(41, 119, 183, 0.06) 100%)',
    minHeight: '100%',
  }}>
    {/* Secure checkout bar — dark band at top */}
    <div style={{
      background: '#000',
      color: '#fff',
      textAlign: 'center',
      padding: '8px 12px',
      fontSize: 10.5, fontWeight: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 5,
      letterSpacing: '0.02em',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Secure Checkout
    </div>

    {/* Content area */}
    <div style={{ padding: 12 }}>
      {/* Pay-by-card card */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid #e7e5e4',
        marginBottom: 14,
      }}>
        <div style={{ color: '#78716c', fontSize: 10 }}>Pay by card · INV - 36,308</div>
        <div style={{
          fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
          color: '#1c1917', lineHeight: 1.05,
          marginTop: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>$179.05</div>
        <div style={{
          fontSize: 9, color: '#78716c', fontStyle: 'italic',
          marginTop: 1,
        }}>
          includes 2.9% card surcharge{' '}
          <span style={{ color: '#57534e', textDecoration: 'underline', textUnderlineOffset: 2, fontStyle: 'normal', fontWeight: 500 }}>Learn more</span>
        </div>

        {/* Stripe-secured payment box. The "Secured by stripe" pill
            sits OVER the top border of the box, half-above the line.
            Sizing matches Stripe's real injected checkout: top wallet button
            is slightly taller than the secondary card button, with generous
            vertical padding and ~15px button labels. */}
        <div style={{
          position: 'relative',
          marginTop: 14,
          border: '1px solid #e7e5e4',
          borderRadius: 10,
          background: 'rgba(245, 245, 244, 0.4)',
          padding: '14px 8px 8px',
        }}>
          <span style={{
            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#fff',
            padding: '0 6px',
            fontSize: 9.5, fontWeight: 500, color: '#78716c',
            whiteSpace: 'nowrap',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Secured by</span>
            <StripeWordmark height={9} />
          </span>

          {/* Apple Pay button — white variant per Apple's HIG (white bg,
              1px black outline). The Apple+Pay lockup inside is Apple's
              official artwork extracted from the Apple Pay Mark (unmodified,
              just rendered in black for the light-mode variant). */}
          <button
            type="button"
            aria-label="Pay with Apple Pay"
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid #000',
              borderRadius: 5,
              padding: 0,
              height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginBottom: 4,
            }}
          >
            <ApplePayLockup height={14} color="#000" />
          </button>

          {/* Pay with card button — secondary CTA, same height */}
          <button
            type="button"
            style={{
              width: '100%',
              background: '#1c1917',
              color: '#fff',
              border: 'none',
              borderRadius: 5,
              padding: 0,
              height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.005em',
            }}
          >Pay with card</button>
        </div>
      </div>

      {/* Invoice card */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid #e7e5e4',
        overflow: 'hidden',
        marginBottom: 14,
      }}>
        {/* INVOICE big light heading */}
        <div style={{ padding: '16px 14px 8px' }}>
          <h2 style={{
            margin: 0,
            fontSize: 22, fontWeight: 300, letterSpacing: '-0.01em',
            color: '#2977b7',
            textTransform: 'uppercase',
            fontFamily: 'inherit',
          }}>Invoice</h2>
        </div>

        {/* Company block — logo (with integrated wordmark) on the left,
            address on the right. Padding and proportions mirror the actual
            invoice screen layout. */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 14,
          padding: '14px 16px 16px',
        }}>
          {/* Bayshore Pool Co. logo — bold "B" monogram in a deep navy
              circle with a thin inner-ring "seal" detail. The B is carved
              in white; its two inner counters reveal a lighter pool-blue
              behind, with subtle wave ripples for the pool-service tie-in.
              Premium, badge-style mark designed to read confidently at
              any size. */}
          <div style={{
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 5,
          }}>
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="bayshore-circle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f4f7e" />
                  <stop offset="100%" stopColor="#0e3556" />
                </linearGradient>
                <linearGradient id="bayshore-counter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7fc4ec" />
                  <stop offset="100%" stopColor="#3b8fd1" />
                </linearGradient>
                {/* Clip to each B counter so the wave inside only shows
                    through the carved-out negative space */}
                <clipPath id="bayshore-counter-top">
                  <path d="M 41 32 L 56 32 C 61.4 32 65.5 36.1 65.5 41.5 C 65.5 46.9 61.4 51 56 51 L 41 51 Z" />
                </clipPath>
                <clipPath id="bayshore-counter-bottom">
                  <path d="M 41 55 L 58 55 C 63.8 55 68.5 59.6 68.5 65.5 C 68.5 71.4 63.8 76 58 76 L 41 76 Z" />
                </clipPath>
              </defs>

              {/* Outer circle with depth gradient */}
              <circle cx="50" cy="50" r="48" fill="url(#bayshore-circle)" />
              {/* Inner ring for the "seal" detail */}
              <circle cx="50" cy="50" r="44" fill="none"
                stroke="#ffffff" strokeWidth="0.8" opacity="0.18" />

              {/* B silhouette in white — single path with even-odd fill so
                  the two inner counters cut cleanly. */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="
                  M 30 22
                  L 56 22
                  C 65.4 22 73 29.6 73 39
                  C 73 43.8 71 48.2 67.7 51.4
                  C 72.4 54.3 75.5 59.5 75.5 65.5
                  C 75.5 75.2 67.7 83 58 83
                  L 30 83
                  Z
                  M 41 32
                  L 56 32
                  C 61.4 32 65.5 36.1 65.5 41.5
                  C 65.5 46.9 61.4 51 56 51
                  L 41 51
                  Z
                  M 41 55
                  L 58 55
                  C 63.8 55 68.5 59.6 68.5 65.5
                  C 68.5 71.4 63.8 76 58 76
                  L 41 76
                  Z
                "
                fill="#ffffff"
              />

              {/* Top counter — pool-blue fill with a thin wave ripple */}
              <g clipPath="url(#bayshore-counter-top)">
                <rect x="41" y="32" width="25" height="19" fill="url(#bayshore-counter)" />
                <path d="M 39 43 Q 47 39 53 43 T 67 43"
                  stroke="#ffffff" strokeWidth="1.1"
                  strokeLinecap="round" fill="none" opacity="0.7" />
              </g>

              {/* Bottom counter — pool-blue fill with a slightly bigger wave */}
              <g clipPath="url(#bayshore-counter-bottom)">
                <rect x="41" y="55" width="28" height="21" fill="url(#bayshore-counter)" />
                <path d="M 39 67 Q 49 62 56 67 T 71 67"
                  stroke="#ffffff" strokeWidth="1.2"
                  strokeLinecap="round" fill="none" opacity="0.75" />
              </g>
            </svg>
            {/* Integrated wordmark, stacked tight under the mark */}
            <div style={{
              fontSize: 9,
              fontWeight: 800,
              color: '#1c5b91',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}>BAYSHORE</div>
            <div style={{
              fontSize: 5.5,
              fontWeight: 600,
              color: '#1c5b91',
              letterSpacing: '0.34em',
              marginTop: -1,
              opacity: 0.75,
            }}>POOL CO.</div>
          </div>

          {/* Company info — header + address */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2, marginLeft: 4 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.005em',
              lineHeight: 1.2,
            }}>BAYSHORE POOL CO.</div>
            <div style={{
              fontSize: 10.5, color: '#78716c',
              lineHeight: 1.55, marginTop: 6,
            }}>
              <div>2210 Bayshore Blvd, Suite 4</div>
              <div>Tampa, FL 33606</div>
              <div>Phone: <span style={{ color: '#2977b7' }}>(813) 555-0142</span></div>
              <div>service@bayshorepool.co</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ padding: '10px 14px 14px' }}>
          <div style={{
            fontSize: 8, fontWeight: 700, color: '#a8a29e',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 4,
          }}>Bill To</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1c1917', letterSpacing: '-0.005em', lineHeight: 1.2 }}>Carter Holloway</div>
          <div style={{ fontSize: 10.5, color: '#78716c', lineHeight: 1.55, marginTop: 1 }}>
            <div>3204 Coquina Court</div>
            <div>Tampa, FL 33611</div>
            <div>carter.h@gmail.com</div>
            <div>(813) 555-0188</div>
          </div>
        </div>

        {/* Invoice meta row */}
        <div style={{
          padding: '10px 14px',
          display: 'flex', justifyContent: 'space-between',
        }}>
          {[
            { label: 'Invoice', value: 'INV - 36,308' },
            { label: 'Date', value: '2/21/2026' },
            { label: 'Due', value: '2/28/2026' },
          ].map((m) => (
            <div key={m.label}>
              <div style={{
                fontSize: 7.5, fontWeight: 700, color: '#1c1917',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>{m.label}</div>
              <div style={{ fontSize: 10, color: '#78716c', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* View / Hide details toggle. When collapsed, a soft white
            gradient fades down from the content above into the toggle —
            visual hint that there's more behind it. Matches the real app. */}
        <div style={{ position: 'relative' }}>
          {!detailsOpen && (
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: -36, left: 0, right: 0,
              height: 36,
              pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 75%, #ffffff 100%)',
            }} />
          )}
          <div style={{
            padding: '10px 0 8px',
            textAlign: 'center',
          }}>
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              aria-expanded={detailsOpen}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'transparent', border: 'none',
                color: '#2977b7', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                padding: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                style={{
                  transform: detailsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 220ms ease',
                }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              {detailsOpen ? 'Hide details' : 'View details'}
            </button>
          </div>
        </div>

        {/* Line item detail — only rendered when expanded. Matches the
            actual invoice's expand-row markup. */}
        {detailsOpen && (
          <div style={{
            padding: '12px 14px 14px',
          }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#1c1917',
              marginBottom: 4,
              letterSpacing: '-0.005em',
            }}>
              Weekly Pool Maintenance — March
            </div>
            <div style={{
              fontSize: 10.5, color: '#57534e', lineHeight: 1.5,
            }}>
              Four weekly visits this month. Each stop covers full water chemistry testing and balancing, surface and tile cleaning, basket and skimmer clearing, and a walk-around inspection of the pump, filter, and heater to catch issues before they grow.
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 8,
            }}>
              <span style={{ fontSize: 9.5, color: '#a8a29e' }}>1 × $174.00</span>
              <span style={{
                fontSize: 12, fontWeight: 600, color: '#1c1917',
                fontVariantNumeric: 'tabular-nums',
              }}>$174.00</span>
            </div>
          </div>
        )}

        {/* Totals */}
        <div style={{ padding: '10px 14px 14px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 11, color: '#57534e',
            padding: '3px 0',
          }}>
            <span>Subtotal</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>$174.00</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            fontWeight: 700,
            padding: '6px 0 0',
            marginTop: 4,
            borderTop: '1px solid #e7e5e4',
          }}>
            <span style={{ fontSize: 14, color: '#1c1917' }}>Total</span>
            <span style={{ fontSize: 16, color: '#1c1917', fontVariantNumeric: 'tabular-nums' }}>$174.00</span>
          </div>
          <div style={{
            fontSize: 9, color: '#78716c', fontStyle: 'italic',
            marginTop: 6,
          }}>Add 2.9% if paying by credit card.</div>
        </div>

        {/* Choose payment method button */}
        <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #f5f5f4' }}>
          <button
            type="button"
            onClick={onChoosePayment}
            style={{
              width: '100%',
              background: '#2977b7',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontSize: 12, fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.005em',
            }}
          >Choose payment method</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '14px 8px 16px',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 9, color: '#78716c',
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Payments securely processed by</span>
          <StripeWordmark height={10} />
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 9, color: '#a8a29e',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: '#78716c', fontWeight: 500 }}>Powered by PoolLogic</span>
          <span style={{ color: '#d6d3d1' }}>·</span>
          <span>Terms</span>
          <span style={{ color: '#d6d3d1' }}>·</span>
          <span>Privacy</span>
        </div>
      </div>
    </div>
  </div>
  );
};



// ---------------------------------------------------------------------------
// 4. Audit — trigger → step → a single card containing a stacked list of
//    flagged items (the audit's actual output).
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 4. Tech app — pool-side capture flow with an offline branch that re-merges
//    when signal returns. Shows: tech arrives → captures chemistry + photo →
//    saves locally if offline → syncs the moment signal returns.
// ---------------------------------------------------------------------------
// Tech app — phone-frame mockup with an INTERACTIVE service report
// inside. The screen scrolls inside a clipped phone viewport so visitors
// can browse the actual email the customer receives — Suncoast header,
// customer info, low-water warning, water chemistry table, etc.
const TechAppFlow = () => {
  return (
    <FlowShell maxWidth={460}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PhoneWithReport />
      </div>
    </FlowShell>
  );
};

// PhoneWithReport — a proportional phone (~290 x 600px, roughly 1:2 like an
// actual modern phone) containing a SCROLLABLE service-report email. The
// report content is rendered as React JSX matching the customer-facing
// email layout: black Suncoast header, customer hero card, low-water
// warning, water chemistry table, LSI index, chemicals added, tasks,
// equipment, footer. Users can scroll inside the phone with mouse / touch.
const PhoneWithReport = () => {
  // When the user taps the GPS Verify chip in the report, slide up an
  // in-phone map overlay showing the pinned customer address. Tap Done
  // on the map to return to the report.
  const [showMap, setShowMap] = React.useState(false);
  return (
    <div style={{
      width: 290,
      borderRadius: 38,
      padding: 7,
      background: 'linear-gradient(180deg, #1a1d24 0%, #0f1217 100%)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(15, 23, 42, 0.4), 0 14px 28px -16px rgba(15, 23, 42, 0.3)',
      position: 'relative',
    }}>
      {/* Screen */}
      <div style={{
        position: 'relative',
        height: 580,
        borderRadius: 32,
        background: '#fafafa',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Frosted overlay — sits above the scrolling content but below
            the notch/status bar. Uses backdrop-filter so content scrolling
            up under it gets blurred. A mask fades the overlay from solid
            at the top to transparent at the bottom edge, so the blur
            smoothly transitions into the un-blurred report. */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 44,
          zIndex: 9,
          pointerEvents: 'none',
          backdropFilter: 'blur(8px) saturate(140%)',
          WebkitBackdropFilter: 'blur(8px) saturate(140%)',
          background: 'linear-gradient(180deg, rgba(250,250,250,0.82) 0%, rgba(250,250,250,0.55) 60%, rgba(250,250,250,0) 100%)',
          maskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
        }} />

        {/* Notch */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 90, height: 22,
          background: '#0f1217',
          borderRadius: 999,
          zIndex: 10,
        }} />

        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 22px 0',
          fontSize: 11, color: '#0f0f0e',
          fontFamily: "'Geist', sans-serif",
          fontWeight: 600,
          zIndex: 11,
          pointerEvents: 'none',
        }}>
          <span><LiveStatusBarTime /></span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 10 }}>
            <span aria-hidden="true">●●●○</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>87%</span>
          </span>
        </div>

        {/* Scrollable report content */}
        <div
          className="phone-report-scroll hide-scrollbar"
          style={{
            position: 'absolute', inset: 0,
            paddingTop: 38,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <ServiceReportContent onOpenMap={() => setShowMap(true)} />
        </div>

        {/* Map overlay — slides up over the report when GPS Verify is
            tapped. Sits above scroll content but below the notch + status
            bar so the device chrome still reads as "the phone". */}
        <MapOverlay open={showMap} onClose={() => setShowMap(false)} />
      </div>
    </div>
  );
};

// ServiceReportContent — JSX rendition of the actual customer email,
// scaled down for the phone viewport but preserving the structure.
// Live time component for the iPhone status bar — shows the viewer's
// current local time (e.g. "9:42") and ticks every minute. Mounts on the
// client only; reads the browser's system clock, no permissions required.
const LiveStatusBarTime = () => {
  const formatTime = () => {
    const d = new Date();
    let hours = d.getHours();
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  const [time, setTime] = React.useState(formatTime);
  React.useEffect(() => {
    const tick = () => setTime(formatTime());
    // Sync to the next minute boundary so the displayed minute is accurate
    // (avoid a 59-second delay before the first tick).
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let interval;
    const initial = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, msToNextMinute);
    return () => {
      clearTimeout(initial);
      if (interval) clearInterval(interval);
    };
  }, []);
  return <>{time}</>;
};

// In-phone map overlay — slides up from the bottom when GPS Verify is
// tapped. Shows a stylized map with a centered pin at the customer's
// address. Pure CSS (no external tiles or API keys), so it works offline
// and ships zero extra weight.
const MapOverlay = ({ open, onClose }) => {
  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'absolute', inset: 0,
        zIndex: 12,
        background: '#e8eef3',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Real OpenStreetMap tiles via CartoDB Positron (clean light style,
          no API key, public free CDN). Center on the customer's lat/lon,
          render a 3×3 tile grid (768×768px) translated so the exact pin
          position sits at the center of the phone screen. */}
      {(() => {
        const lat = 27.8893;
        const lon = -82.4837;
        const zoom = 17;
        const n = 2 ** zoom;
        const TILE = 256;
        const xFloat = ((lon + 180) / 360) * n;
        const latRad = (lat * Math.PI) / 180;
        const yFloat = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
        const xTile = Math.floor(xFloat);
        const yTile = Math.floor(yFloat);
        const xPx = (xFloat - xTile) * TILE; // 0–256
        const yPx = (yFloat - yTile) * TILE;

        // Phone screen is 290px wide × 580px tall (less notch). We render a
        // 3×3 tile grid (768×768px) and translate so the pin's lat/lon
        // position lines up with the phone's center (145, 290).
        const phoneW = 290, phoneH = 580;
        const offsetX = phoneW / 2 - (TILE + xPx);
        const offsetY = phoneH / 2 - (TILE + yPx);

        const tiles = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const tx = xTile + dx;
            const ty = yTile + dy;
            const url = `https://a.basemaps.cartocdn.com/light_all/${zoom}/${tx}/${ty}.png`;
            tiles.push(
              <img
                key={`${tx}-${ty}`}
                src={url}
                alt=""
                aria-hidden="true"
                width={TILE} height={TILE}
                draggable={false}
                style={{
                  position: 'absolute',
                  left: offsetX + (dx + 1) * TILE,
                  top: offsetY + (dy + 1) * TILE,
                  width: TILE, height: TILE,
                  display: 'block',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            );
          }
        }
        return (
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: '#e8eef3',
            overflow: 'hidden',
          }}>
            {tiles}
            {/* Attribution — required by CartoDB / OSM */}
            <span style={{
              position: 'absolute', bottom: 4, right: 6,
              fontSize: 7.5, color: 'rgba(15,23,42,0.55)',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              background: 'rgba(255,255,255,0.6)',
              padding: '1px 4px',
              borderRadius: 3,
              pointerEvents: 'none',
            }}>© OpenStreetMap · CARTO</span>
          </div>
        );
      })()}

      {/* Top sheet — back button + address pill */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        paddingTop: 38,
        padding: '38px 14px 12px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to report"
          style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(15,23,42,0.08)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            padding: 0, flexShrink: 0,
            boxShadow: '0 1px 2px rgba(15,23,42,0.1)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f0f0e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(15,23,42,0.08)',
          borderRadius: 14,
          padding: '7px 11px',
          boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
        }}>
          <div style={{ fontSize: 10, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            GPS Verified
          </div>
          <div style={{ fontSize: 11.5, color: '#0f0f0e', fontWeight: 600, marginTop: 1, lineHeight: 1.2 }}>
            3204 Coquina Court
          </div>
          <div style={{ fontSize: 10.5, color: '#6b6b6b', marginTop: 1 }}>
            Tampa, FL 33611
          </div>
        </div>
      </div>

      {/* The pin — centered in the map area, with a pulsing ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
      }}>
        <style>{`
          @keyframes map-pin-ping {
            0%   { transform: scale(0.5); opacity: 0.7; }
            70%  { transform: scale(2.2); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          .map-pin-ring {
            position: absolute;
            left: 50%; top: 100%;
            width: 28px; height: 28px;
            margin-left: -14px;
            margin-top: -14px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.32);
            animation: map-pin-ping 2.2s ease-out infinite;
          }
        `}</style>
        <div className="map-pin-ring" />
        {/* Map pin SVG */}
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" aria-hidden="true"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(15,23,42,0.35))' }}
        >
          <path
            d="M16 1 C 8 1 2 7 2 15 C 2 26 16 41 16 41 C 16 41 30 26 30 15 C 30 7 24 1 16 1 Z"
            fill="#3B82F6"
            stroke="#1d4ed8"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="15" r="5" fill="#ffffff" />
        </svg>
      </div>

      {/* Bottom info pill — extra details */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14, right: 14,
        background: 'rgba(255,255,255,0.96)',
        border: '1px solid rgba(15,23,42,0.08)',
        borderRadius: 14,
        padding: '10px 12px',
        boxShadow: '0 6px 16px -8px rgba(15,23,42,0.2)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 10.5, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              Submission location
            </div>
            <div style={{
              fontSize: 11, color: '#0f0f0e', fontWeight: 600, marginTop: 2,
              fontFamily: "'Geist Mono', monospace",
              fontVariantNumeric: 'tabular-nums',
            }}>
              27.8893° N · 82.4837° W
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              background: '#0f0f0e',
              color: '#ffffff',
              border: 'none',
              fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >Done</button>
        </div>
      </div>
    </div>
  );
};

const ServiceReportContent = ({ onOpenMap }) => (
  <div style={{ background: '#fafafa', padding: '12px 10px 20px' }}>
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)',
      background: '#fff',
    }}>
      {/* Header — dark Suncoast block */}
      <div style={{
        background: '#111114', padding: '24px 18px 22px', textAlign: 'center',
      }}>
        <div style={{
          color: '#ffffff', fontSize: 14, fontWeight: 800, letterSpacing: '0.4px',
        }}>BAYSHORE POOL CO.</div>
        <div style={{
          marginTop: 4, color: '#737373', fontSize: 8.5, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '1.6px',
        }}>Service Report</div>
        <div style={{
          display: 'inline-block', marginTop: 12,
          background: '#000000', borderRadius: 14, padding: '5px 11px',
          border: '1px solid #2a2a29',
          color: '#ffffff', fontSize: 9, fontWeight: 500,
        }}>Thu, Feb 21 · 2:47 PM</div>
      </div>

      {/* Customer hero */}
      <div style={{ padding: '22px 18px 14px', background: '#fff', textAlign: 'center' }}>
        <div style={{ color: '#0f0f0e', fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>
          Carter Holloway
        </div>
        <div style={{ marginTop: 4, color: '#6b6b6b', fontSize: 10.5, lineHeight: 1.4 }}>
          3204 Coquina Court,<br/>Tampa, FL, 33611
        </div>
        <div style={{
          display: 'inline-flex', gap: 6, marginTop: 10,
        }}>
          <span style={{
            display: 'inline-block', padding: '3px 9px', borderRadius: 6,
            border: '1px solid #e7e5e4',
            color: '#78716c', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.2px',
          }}>Serviced by Jared</span>
          <button
            type="button"
            onClick={onOpenMap}
            style={{
              display: 'inline-block', padding: '3px 9px', borderRadius: 6,
              border: '1px solid #3B82F6',
              background: 'transparent',
              color: '#3B82F6', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >GPS Verify ↗</button>
        </div>
      </div>

      {/* Low water warning */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          background: '#EFF6FF', borderRadius: 12, border: '1px solid #BFDBFE',
          padding: '14px 14px',
        }}>
          <div style={{ color: '#1D4ED8', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
            💧 Low Water Level
          </div>
          <div style={{ color: '#1E3A5F', fontSize: 9.5, lineHeight: 1.55 }}>
            Your technician reported a low water level during today's service visit. Low water levels could potentially damage pool equipment and affect water quality.
          </div>
        </div>
      </div>

      {/* Water Chemistry */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ color: '#0f0f0e', fontSize: 11.5, fontWeight: 800 }}>Water Chemistry</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{
          borderRadius: 12, overflow: 'hidden', border: '1px solid #e7e5e4',
        }}>
          {[
            ['Free Chlorine', '5.8', 'ppm'],
            ['Total Chlorine', '3.1', 'ppm'],
            ['pH', '7.3', ''],
            ['Total Alkalinity', '98', 'ppm'],
            ['Salt', '2950', 'ppm'],
            ['Water Temp', '86', '°F'],
            ['Water Level', 'Low', ''],
          ].map(([label, val, unit], i, arr) => (
            <div key={label} style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto',
              alignItems: 'center', gap: 6,
              padding: '10px 14px',
              background: '#fdfdfc',
              borderBottom: i === arr.length - 1 ? 'none' : '1px solid #f0efed',
            }}>
              <span style={{ color: '#57534e', fontSize: 10.5, fontWeight: 500 }}>{label}</span>
              <span style={{
                color: '#0f0f0e', fontSize: 11.5, fontWeight: 700,
                fontVariantNumeric: 'tabular-nums', textAlign: 'right',
              }}>{val}</span>
              <span style={{
                color: '#a3a3a3', fontSize: 9, fontWeight: 500,
                minWidth: 22, textAlign: 'left',
              }}>{unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LSI card */}
      <div style={{ padding: '18px 16px 0' }}>
        <div style={{
          background: '#000', borderRadius: 12,
          padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            color: '#fff', fontSize: 9.5, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.7px',
          }}>LSI Index</span>
          <span>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>-0.02</span>
            <span style={{ color: '#10B981', fontSize: 9, fontWeight: 600, marginLeft: 5 }}>
              Balanced
            </span>
          </span>
        </div>
      </div>

      {/* Chemicals Added */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ color: '#0f0f0e', fontSize: 11.5, fontWeight: 800 }}>Chemicals Added</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{
          borderRadius: 12, overflow: 'hidden', border: '1px solid #e7e5e4',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            alignItems: 'center', gap: 6,
            padding: '10px 14px',
            background: '#fdfdfc',
          }}>
            <span style={{ color: '#57534e', fontSize: 10.5, fontWeight: 500 }}>Muriatic Acid (gal)</span>
            <span style={{
              color: '#0f0f0e', fontSize: 11.5, fontWeight: 700,
              fontVariantNumeric: 'tabular-nums', textAlign: 'right',
            }}>0.5</span>
            <span style={{ minWidth: 22 }} />
          </div>
        </div>
      </div>

      {/* Tasks Completed */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ color: '#0f0f0e', fontSize: 11.5, fontWeight: 800 }}>Tasks Completed</div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {['Skimmed debris', 'Emptied skimmer basket', 'Brushed surfaces'].map((task) => (
          <span key={task} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: '#fdfdfc', borderRadius: 7,
            padding: '5px 9px',
            fontSize: 10, fontWeight: 500, color: '#44403c',
          }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
            {task}
          </span>
        ))}
      </div>

      {/* Equipment Service */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ color: '#0f0f0e', fontSize: 11.5, fontWeight: 800 }}>Equipment Service</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: '#000', borderRadius: 12, padding: '8px 14px' }}>
          {['Salt Cell Cleaned'].map((label) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 0',
            }}>
              <span style={{ color: '#fff', fontSize: 10.5, fontWeight: 600 }}>{label}</span>
              <span style={{
                width: 17, height: 17, borderRadius: '50%',
                background: '#10B981', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800,
              }}>✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div style={{ padding: '20px 24px 8px' }}>
        <div style={{ color: '#0f0f0e', fontSize: 11.5, fontWeight: 800 }}>Photos</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop"
          alt="Pool service photo"
          loading="lazy"
          style={{
            width: '100%',
            display: 'block',
            borderRadius: 12,
            border: '1px solid #e7e5e4',
          }}
        />
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 22,
        background: '#111114', padding: '22px 18px 24px', textAlign: 'center',
      }}>
        <div style={{ color: '#ffffff', fontSize: 11, fontWeight: 700, letterSpacing: '0.3px' }}>
          BAYSHORE POOL CO.
        </div>
        <div style={{ marginTop: 8, color: '#a3a3a3', fontSize: 9.5, lineHeight: 1.6 }}>
          (813) 555-0142<br/>
          <span style={{ color: '#60A5FA' }}>service@bayshorepool.co</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', marginTop: 14,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: '#000', border: '1px solid #2a2a29', borderRadius: 8,
            padding: '7px 14px',
          }}>
            <span style={{ color: '#a3a3a3', fontSize: 9.5 }}>Questions?</span>
            <span style={{ color: '#60A5FA', fontSize: 9.5, fontWeight: 600 }}>Reply</span>
          </div>
        </div>
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px solid #262626',
          color: '#525252', fontSize: 8, letterSpacing: '0.4px',
        }}>Powered by PoolLogic</div>
      </div>
    </div>
  </div>
);

// Small condensed card used inside branched flows
const MiniStep = ({ label, desc, active = true, anchor = true, statusLabel }) => {
  const borderColor = active
    ? 'color-mix(in oklab, var(--accent) 35%, var(--line))'
    : 'var(--line)';
  const shadow = active
    ? '0 1px 0 rgba(15, 23, 42, .02), 0 10px 24px -22px color-mix(in oklab, var(--accent) 30%, rgba(15, 23, 42, .25))'
    : '0 1px 0 rgba(15, 23, 42, .02)';
  return (
    <div style={{ position: 'relative', opacity: active ? 1 : 0.5 }}>
      {active && statusLabel && (
        <div style={{ position: 'absolute', top: -10, right: 8, zIndex: 2 }}>
          <FlowPill tone="good">✓ {statusLabel}</FlowPill>
        </div>
      )}
      <div style={{
        background: 'var(--bg)',
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: shadow,
      }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600,
          color: active ? 'var(--ink)' : 'var(--ink-5)',
          letterSpacing: '-0.01em',
        }}>{label}</div>
        {desc && <div style={{
          marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--line-2)',
          fontSize: 11, color: 'var(--ink-5)',
          opacity: active ? 1 : 0.7,
        }}>{desc}</div>}
      </div>
    </div>
  );
};

const BranchLabel = ({ children, tone = 'neutral', active = true }) => {
  const t = tone === 'good'
    ? { bg: '#e7f6ec', fg: '#1f7a3a', bd: '#c8e8d2' }
    : { bg: 'var(--bg)', fg: 'var(--ink-5)', bd: 'var(--line)' };
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10.5, fontWeight: 500,
      padding: '2px 9px', borderRadius: 999,
      background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`,
      fontFamily: "'Geist', sans-serif", letterSpacing: '-0.005em',
      opacity: active ? 1 : 0.65,
      boxShadow: active ? '0 1px 0 rgba(15, 23, 42, .02)' : 'none',
    }}>{children}</span>
  );
};

const FlowStep = ({ kind, title, tag, desc, statusLabel, statusTone = 'good', active = true, anchor = true }) => {
  const iconBg = kind === 'trigger'
    ? 'color-mix(in oklab, var(--accent) 14%, white)'
    : kind === 'switch'
      ? 'color-mix(in oklab, #7c3aed 12%, white)'
      : 'color-mix(in oklab, var(--accent) 10%, white)';
  const iconFg = kind === 'switch'
    ? '#7c3aed'
    : 'color-mix(in oklab, var(--accent) 75%, black)';
  const icon = kind === 'trigger' ? '◎' : kind === 'switch' ? '⤧' : '▸';

  // active: brighter accent border + glow + status pill.
  // inactive: full ghost — muted border, no shadow, dimmed text, no decorations.
  const borderColor = active
    ? 'color-mix(in oklab, var(--accent) 35%, var(--line))'
    : 'var(--line)';
  const shadow = active
    ? '0 1px 0 rgba(15, 23, 42, .02), 0 12px 28px -22px color-mix(in oklab, var(--accent) 35%, rgba(15, 23, 42, .25))'
    : '0 1px 0 rgba(15, 23, 42, .02)';

  return (
    <div style={{ position: 'relative', opacity: active ? 1 : 0.5 }}>
      {/* status pill — sits to the upper-right of the card */}
      {active && statusLabel && (
        <div style={{ position: 'absolute', top: -10, right: 8, zIndex: 2 }}>
          <FlowPill tone={statusTone}>✓ {statusLabel}</FlowPill>
        </div>
      )}

      <div style={{
        background: 'var(--bg)',
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        padding: '12px 14px',
        boxShadow: shadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: iconBg, color: iconFg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600,
            opacity: active ? 1 : 0.55,
          }} aria-hidden="true">{icon}</div>
          <div style={{
            flex: 1, minWidth: 0,
            fontSize: 13.5, fontWeight: 600,
            color: active ? 'var(--ink)' : 'var(--ink-5)',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </div>
          {tag && (
            <span style={{
              fontSize: 10.5, color: 'var(--ink-5)',
              padding: '2px 7px', borderRadius: 5,
              background: 'var(--bg-muted)',
              fontFamily: "'Geist Mono', monospace", letterSpacing: '-0.005em',
              opacity: active ? 1 : 0.6,
            }}>{tag}</span>
          )}
        </div>
        {desc && (
          <div style={{
            marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line-2)',
            fontSize: 11.5, color: 'var(--ink-5)',
            opacity: active ? 1 : 0.7,
          }}>{desc}</div>
        )}
      </div>
    </div>
  );
};

const FlowPill = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: { bg: 'var(--bg-muted)', fg: 'var(--ink-3)', bd: 'var(--line)' },
    good: { bg: '#e7f6ec', fg: '#1f7a3a', bd: '#c8e8d2' },
    warn: { bg: '#fff4e0', fg: '#8a5a00', bd: '#f1e1bd' },
  }[tone];
  return (
    <span style={{
      display: 'inline-block', fontSize: 10.5, fontWeight: 500,
      padding: '2px 8px', borderRadius: 999,
      background: tones.bg, color: tones.fg,
      border: `1px solid ${tones.bd}`,
      fontFamily: "'Geist', sans-serif", letterSpacing: '-0.005em',
    }}>{children}</span>
  );
};

// ============================================================================
// Right-column side panels — small docked stack rendered against the dot grid.
// ============================================================================
const SidePanelItem = ({ label, dimmed, active }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 11px',
    background: active ? 'var(--bg)' : 'transparent',
    border: active ? '1px solid color-mix(in oklab, var(--accent) 22%, var(--line))' : '1px solid transparent',
    borderRadius: 8,
    fontSize: 12.5,
    color: dimmed ? 'var(--ink-6)' : active ? 'var(--ink)' : 'var(--ink-3)',
    fontWeight: active ? 600 : 500,
    boxShadow: active ? '0 1px 0 rgba(15, 23, 42, .02), 0 8px 18px -16px rgba(15, 23, 42, .25)' : 'none',
    opacity: dimmed ? 0.55 : 1,
  }}>
    <span aria-hidden="true" style={{
      width: 14, height: 14, borderRadius: 4,
      background: active
        ? 'color-mix(in oklab, var(--accent) 18%, white)'
        : 'color-mix(in oklab, var(--ink-6) 12%, white)',
      flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 5.727 3.742 6.9c.442.699.663 1.048.947 1.17a1 1 0 0 0 .778.007c.286-.118.512-.464.965-1.156L9 3"
          stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    {label}
  </div>
);

const SidePanelStack = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {items.map((it, i) => <SidePanelItem key={i} {...it} />)}
  </div>
);

const RoutingSidePanel = () => (
  // Customer record card — the new customer being added in the flow.
  // Modeled on Attio's detail cards: tight, monochrome, well-tuned pills.
  <RecordCard
    title="Carter Holloway"
    handle="1402 Bayshore Blvd, Tampa, FL"
    rows={[
      { icon: 'dollar',    label: 'Billing',    value: <><Pill tone="neutral">Active</Pill><Pill tone="neutral">Monthly</Pill><Pill tone="neutral">17th</Pill></> },
      { icon: 'dollar',    label: 'MRR',        value: <><span style={{ fontFamily: "'Geist Mono', monospace", fontVariantNumeric: 'tabular-nums' }}>$165</span><span style={{ color: 'var(--ink-5)', fontWeight: 500, marginLeft: 6 }}>/ mo</span></> },
      { icon: 'droplet',   label: 'Pool',       value: '18,000 gal · saltwater' },
      { icon: 'badge',     label: 'Filter',     value: <>Cartridge filter <span style={{ color: 'var(--ink-5)' }}>· #C200S</span></> },
      { icon: 'tag',       label: 'Notes',      value: 'Gate code 2933 if locked' },
      { icon: 'route',     label: 'Route',      value: 'Jared · Thu · stop #7', highlight: true },
    ]}
  />
);

// Refined pill — Attio-style palette. Each tone has its own carefully-tuned
// soft bg / saturated foreground combination. NOT monospace (sans-serif feels
// more "data tag" than "code"). Tight padding, 4px radius, no border by
// default — relies on bg/fg contrast for definition.
const Pill = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: { bg: '#f4f4f5', fg: '#3f3f46' },
    link:    { bg: '#eff6ff', fg: '#1d4ed8', underline: true },
    success: { bg: '#ecfdf5', fg: '#047857' },
    violet:  { bg: '#f5f3ff', fg: '#6d28d9' },
    orange:  { bg: '#fff7ed', fg: '#c2410c' },
    amber:   { bg: '#fffbeb', fg: '#b45309' },
  }[tone] || { bg: '#f4f4f5', fg: '#3f3f46' };
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 11, fontWeight: 500,
      padding: '2px 8px', borderRadius: 4,
      background: tones.bg, color: tones.fg,
      letterSpacing: '-0.005em',
      marginRight: 4,
      textDecoration: tones.underline ? 'underline' : 'none',
      textUnderlineOffset: '2px',
      textDecorationColor: tones.underline ? 'color-mix(in oklab, currentColor 30%, transparent)' : undefined,
    }}>{children}</span>
  );
};

// Detail card — Attio-style. Tight, refined, premium.
//   - Soft rounded avatar with subtle inner highlight + shadow
//   - Title + handle stack in the header
//   - Hairline dividers between attribute rows
//   - Route row highlighted as the primary outcome of the onboarding flow
//   - Compact icon + label + value tracking, generous breathing room
const RecordCard = ({ title, handle, avatar, rows }) => (
  <div style={{
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    borderRadius: 14,
    padding: '20px 20px 16px',
    boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 16px 36px -28px rgba(15, 23, 42, .28)',
    fontFamily: "'Geist', sans-serif",
  }}>
    {/* Header — refined avatar + name + handle */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      paddingBottom: 16, marginBottom: 8,
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: 'linear-gradient(180deg, #2a2d33 0%, #15171c 100%)',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: 12.5,
        flexShrink: 0,
        letterSpacing: '-0.02em',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(15, 23, 42, 0.15)',
      }}>{avatar || (title || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1.2 }}>{title}</div>
        {handle && (
          <div style={{ fontSize: 11.5, color: 'var(--ink-5)', marginTop: 3, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {handle}
          </div>
        )}
      </div>
    </div>

    {/* Attribute rows */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((r, i) => {
        const isHighlight = r.highlight;
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '88px 1fr', alignItems: 'center',
            gap: 10, padding: '10px 0',
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--line-2)',
            ...(isHighlight ? {
              padding: '12px 10px',
              margin: '4px -10px 0',
              background: 'color-mix(in oklab, var(--accent) 5%, transparent)',
              borderRadius: 8,
              borderBottom: 'none',
            } : {}),
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: 12.5,
              color: isHighlight ? 'color-mix(in oklab, var(--accent) 75%, black)' : 'var(--ink-5)',
              fontWeight: 500,
            }}>
              <RecordIcon name={r.icon} />
              {r.label}
            </div>
            <div style={{
              fontSize: 12.5,
              color: 'var(--ink)',
              fontWeight: 500,
              minWidth: 0,
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 4,
            }}>
              {r.value}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Small inline icons for record-card attribute rows. Subtle gray strokes,
// 13×13 box, 1.4px stroke — matches the Attio palette of quiet field icons.
const RecordIcon = ({ name }) => {
  const common = {
    width: 13, height: 13, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'var(--ink-6)',
    strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { flexShrink: 0 },
    'aria-hidden': true,
  };
  switch (name) {
    case 'building':
      return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="1.5" /><line x1="9" y1="8" x2="9.01" y2="8" /><line x1="15" y1="8" x2="15.01" y2="8" /><line x1="9" y1="13" x2="9.01" y2="13" /><line x1="15" y1="13" x2="15.01" y2="13" /><path d="M10 21v-4h4v4" /></svg>;
    case 'badge':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>;
    case 'map':
      return <svg {...common}><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2z" /><path d="M9 3v16M15 5v16" /></svg>;
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'droplet':
      return <svg {...common}><path d="M12 2.5C8 8 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-7-7-12.5z" /></svg>;
    case 'tag':
      return <svg {...common}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
    case 'route':
      return <svg {...common}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h7a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h7" /></svg>;
    case 'dollar':
      return <svg {...common}><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
    case 'user':
      return <svg {...common}><circle cx="12" cy="8.5" r="3.5" /><path d="M4.5 21c0-4 3.4-7 7.5-7s7.5 3 7.5 7" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9" /></svg>;
  }
};

// Chemical readings panel — vertical stack of cards, each showing the
// reading (big number stacked over the unit) in a colored chip on the
// left and the chemical name to the right.
//
// Selection animation: as the panel scrolls into and through the viewport,
// the card crossing the viewport's vertical-center "focus line" becomes
// the active one. Active = slides left by ~10px and dims neighbors. As
// you scroll further, the next card takes focus, sliding left while the
// previous one slides back. Reads like a carousel reacting to scroll.
const ReportsSidePanel = () => {
  const readings = [
    { name: 'Salinity',   value: '3,150', unit: 'ppm' },
    { name: 'Stabilizer', value: '38',    unit: 'ppm' },
    { name: 'Free Cl',    value: '2.8',   unit: 'ppm' },
    { name: 'pH',         value: '7.4',   unit: '' },
    { name: 'Alkalinity', value: '92',    unit: 'ppm' },
  ];

  // Scroll-driven selection: the row whose center is closest to the
  // viewport's vertical center is marked active. Active row gets the
  // bordered card treatment; others are flat list items.
  const containerRef = React.useRef(null);
  const rowRefs = React.useRef([]);
  const [activeIndex, setActiveIndex] = React.useState(2);

  React.useEffect(() => {
    const update = () => {
      const viewportCenter = window.innerHeight / 2;
      let best = -1;
      let bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const dist = Math.abs(rowCenter - viewportCenter);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      const c = containerRef.current;
      if (c) {
        const cRect = c.getBoundingClientRect();
        if (cRect.bottom < 0 || cRect.top > window.innerHeight) return;
      }
      if (best >= 0) setActiveIndex(best);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={containerRef} style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      fontFamily: "'Geist', sans-serif",
    }}>
      {readings.map((r, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            ref={(el) => { rowRefs.current[i] = el; }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: 10,
              padding: '8px 11px',
              background: isActive ? 'var(--bg)' : 'transparent',
              border: isActive
                ? '1px solid color-mix(in oklab, var(--accent) 22%, var(--line))'
                : '1px solid transparent',
              borderRadius: 8,
              boxShadow: isActive
                ? '0 1px 0 rgba(15, 23, 42, .02), 0 8px 18px -16px rgba(15, 23, 42, .25)'
                : 'none',
              transition: 'background 280ms ease, border-color 280ms ease, box-shadow 280ms ease',
            }}
          >
            <div style={{
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--ink)' : 'var(--ink-3)',
              minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {r.name}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 6,
              fontSize: 10.5,
              fontFamily: "'Geist Mono', monospace",
              color: isActive ? 'color-mix(in oklab, var(--accent) 75%, black)' : 'var(--ink-5)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.005em',
            }}>
              <span>{r.value}</span>
              {r.unit && <span style={{ opacity: 0.55 }}>{r.unit}</span>}
            </div>
          </div>
        );
      })}

      {/* Toggle card — alert setting that controls whether the office is
          notified about low water on this account. Sits below the readings
          stack as the "control" for what we just showed. */}
      <LowWaterToggle />
    </div>
  );
};

const LowWaterToggle = () => {
  const [on, setOn] = React.useState(true);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      style={{
        marginTop: 8,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        boxShadow: '0 1px 0 rgba(15, 23, 42, .02)',
        fontFamily: "'Geist', sans-serif",
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600,
          color: 'var(--ink)',
          letterSpacing: '-0.01em',
        }}>
          Low water warning
        </div>
        <div style={{
          marginTop: 2,
          fontSize: 11, color: 'var(--ink-5)', lineHeight: 1.3,
        }}>
          Notify office when surface drops below skimmer
        </div>
      </div>
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          width: 30, height: 18,
          borderRadius: 999,
          background: on
            ? 'color-mix(in oklab, var(--accent) 80%, transparent)'
            : 'var(--bg-muted)',
          border: on
            ? '1px solid color-mix(in oklab, var(--accent) 70%, transparent)'
            : '1px solid var(--line)',
          transition: 'background 200ms ease, border-color 200ms ease',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 1, left: 1,
          width: 14, height: 14,
          borderRadius: '50%',
          background: 'var(--bg)',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.2)',
          transform: on ? 'translateX(12px)' : 'translateX(0)',
          transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </span>
    </button>
  );
};

const BillingSidePanel = () => (
  // Billing settings panel — reinforces the "set it once, system handles
  // the rest" story from the section body. Shows the company-wide
  // automations: overdue reminders, late fees, card surcharge, autopay.
  <BillingSettingsPanel />
);

// Stylized settings card matching an Attio/Linear-style preferences panel.
// Each row is a setting: label + small description + control (toggle or
// numeric chip). One row is "active" with subtle accent highlighting to
// match the visual rhythm of the other right-side panels on the page.
const BillingSettingsPanel = () => {
  const [tab, setTab] = React.useState('company');

  // Refined toggle — bigger track, smoother thumb with depth shadow.
  const Toggle = ({ on }) => (
    <span aria-hidden="true" style={{
      display: 'inline-block',
      position: 'relative', flexShrink: 0,
      width: 32, height: 19, borderRadius: 999,
      background: on
        ? 'color-mix(in oklab, var(--accent) 78%, transparent)'
        : '#e7e5e4',
      border: on
        ? '1px solid color-mix(in oklab, var(--accent) 65%, transparent)'
        : '1px solid var(--line)',
      transition: 'background 200ms ease, border-color 200ms ease',
    }}>
      <span style={{
        display: 'block',
        position: 'absolute', top: 1.5,
        left: on ? 14 : 1.5,
        width: 14, height: 14, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(15,23,42,0.25), 0 0 0 0.5px rgba(15,23,42,0.04)',
        transition: 'left 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </span>
  );

  // Refined input-style chip — slightly raised, mono font.
  const ValueChip = ({ children }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px',
      borderRadius: 6,
      background: 'var(--bg)',
      border: '1px solid var(--line)',
      boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02)',
      fontFamily: "'Geist Mono', monospace",
      fontSize: 10.5, color: 'var(--ink-2)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );

  // Visa card mark — small badge with the Visa wordmark in white on a navy chip.
  const VisaBadge = () => (
    <span aria-hidden="true" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 30, height: 18,
      background: '#1a1f71',
      borderRadius: 4,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 1px 2px rgba(15,23,42,0.15)',
    }}>
      <span style={{
        fontFamily: "'Geist', sans-serif",
        fontSize: 9, fontWeight: 800, color: '#ffffff',
        letterSpacing: '0.04em',
        fontStyle: 'italic',
      }}>VISA</span>
    </span>
  );

  const companyRows = [
    {
      label: 'Overdue reminders',
      desc: 'Fire when an invoice tips past due',
      control: <Toggle on />,
    },
    {
      label: 'Late fee',
      desc: 'Added after grace period',
      control: (
        <span style={{ display: 'inline-flex', gap: 5 }}>
          <ValueChip>$25.00</ValueChip>
          <ValueChip>7 days</ValueChip>
        </span>
      ),
    },
    {
      label: 'Card surcharge',
      desc: 'Passes processor fee to customer',
      control: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <ValueChip>+2.9%</ValueChip>
          <Toggle on />
        </span>
      ),
    },
    {
      label: 'Accept checks',
      desc: 'Log mailed checks as paid',
      control: <Toggle on />,
    },
  ];

  const customerRows = [
    {
      label: 'Card on file',
      cardOnFile: true,
      desc: 'Autopay charges on the due date',
      control: <Toggle on />,
    },
    {
      label: 'Statement day',
      desc: "Customer's own service date",
      control: <ValueChip>Per customer</ValueChip>,
    },
    {
      label: 'Payment terms',
      desc: 'Days to pay before overdue',
      control: <ValueChip>Net 15</ValueChip>,
    },
    {
      label: 'Next invoice',
      desc: 'Auto-fires on the locked-in day',
      control: <ValueChip>Apr 17</ValueChip>,
    },
  ];

  const rows = tab === 'company' ? companyRows : customerRows;

  const TabButton = ({ id, label }) => {
    const active = tab === id;
    return (
      <button
        type="button"
        onClick={() => setTab(id)}
        style={{
          flex: 1,
          padding: '7px 10px',
          background: active
            ? 'var(--bg)'
            : 'transparent',
          border: 'none',
          borderRadius: 7,
          fontFamily: 'inherit',
          fontSize: 11.5,
          fontWeight: active ? 600 : 500,
          color: active ? 'var(--ink)' : 'var(--ink-5)',
          letterSpacing: '-0.005em',
          cursor: 'pointer',
          boxShadow: active
            ? '0 1px 0 rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.06)'
            : 'none',
          transition: 'background 180ms ease, color 180ms ease',
        }}
      >{label}</button>
    );
  };

  return (
    <div style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* Rows wrapper — bordered card with a header + tab strip + setting rows */}
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02), 0 10px 22px -18px rgba(15, 23, 42, 0.18)',
        overflow: 'hidden',
      }}>
        {/* Header row — title + subtitle on a soft neutral background that
            matches the tab strip below. */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '12px 12px',
          background: 'var(--bg-soft, #f7f8fa)',
        }}>
          <span aria-hidden="true" style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'color-mix(in oklab, var(--ink-6) 10%, white)',
            color: 'var(--ink-3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.015em',
              lineHeight: 1.2,
            }}>Billing settings</div>
            <div style={{
              fontSize: 10.5, color: 'var(--ink-5)',
              marginTop: 2, lineHeight: 1.3,
            }}>
              {tab === 'company' ? 'Company-wide · set once' : 'Per customer · override defaults'}
            </div>
          </div>
        </div>

        {/* Tab strip */}
        <div style={{
          display: 'flex', gap: 4,
          padding: '8px 8px 10px',
          background: 'var(--bg-soft, #f7f8fa)',
          borderTop: '1px solid var(--line-2)',
          borderBottom: '1px solid var(--line-2)',
        }}>
          <TabButton id="company"  label="Company-wide" />
          <TabButton id="customer" label="Per customer" />
        </div>

        {/* Setting rows */}
        {rows.map((r, i) => (
          <div key={`${tab}-${i}`} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            background: 'transparent',
            borderTop: i === 0 ? 'none' : '1px solid var(--line-2)',
            position: 'relative',
          }}>
            <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 9 }}>
              {r.cardOnFile && <VisaBadge />}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 6,
                  fontSize: 12.5, fontWeight: 500,
                  color: 'var(--ink-2)',
                  letterSpacing: '-0.005em',
                  lineHeight: 1.2,
                }}>
                  {r.label}
                  {r.cardOnFile && (
                    <span style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: 11,
                      color: 'var(--ink-5)',
                      letterSpacing: '0.04em',
                      fontVariantNumeric: 'tabular-nums',
                    }}>•••• 4242</span>
                  )}
                </div>
                <div style={{
                  fontSize: 10.5,
                  color: 'var(--ink-5)',
                  marginTop: 2, lineHeight: 1.35,
                }}>{r.desc}</div>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>{r.control}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Small roster showing per-customer billing schedule. Each row is its own
// "lockbox" — name on the left, cadence + day in mono on the right.
const CustomerBillingRoster = ({ rows }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {rows.map((r, i) => (
      <div key={i} style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 10,
        padding: '8px 11px',
        background: r.active ? 'var(--bg)' : 'transparent',
        border: r.active
          ? '1px solid color-mix(in oklab, var(--accent) 22%, var(--line))'
          : '1px solid transparent',
        borderRadius: 8,
        boxShadow: r.active
          ? '0 1px 0 rgba(15, 23, 42, .02), 0 8px 18px -16px rgba(15, 23, 42, .25)'
          : 'none',
        opacity: r.dimmed ? 0.55 : 1,
      }}>
        <div style={{
          fontSize: 12.5,
          fontWeight: r.active ? 600 : 500,
          color: r.active ? 'var(--ink)' : 'var(--ink-3)',
          minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {r.name}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10.5,
          fontFamily: "'Geist Mono', monospace",
          color: r.active ? 'color-mix(in oklab, var(--accent) 75%, black)' : 'var(--ink-5)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.005em',
        }}>
          <span>{r.cadence}</span>
          <span style={{ opacity: 0.45 }}>·</span>
          <span>{r.day}</span>
        </div>
      </div>
    ))}
  </div>
);

const TechAppSidePanel = () => (
  // Customer trust signals — the credibility cues baked into every report
  <SidePanelStack items={[
    { label: 'GPS-stamped at submission' },
    { label: 'Time-stamped submission' },
    { label: 'Technician signature' },
    { label: 'Photo evidence' },
    { label: 'Balanced LSI index' },
    { label: 'Branded for your company', dimmed: true },
    { label: 'One-tap reply to the office', dimmed: true },
  ]} />
);

// ============================================================================
// Decorative SVG elements that sit in the lower-right of the side column.
// ============================================================================
const CubesDecoration = () => {
  const stroke = 'color-mix(in oklab, var(--ink-5) 50%, transparent)';
  return (
    <svg width="110" height="100" viewBox="0 0 110 100" fill="none" aria-hidden="true">
      {/* back cube */}
      <g stroke={stroke} strokeWidth="1.2" fill="none">
        <path d="M 40 18 L 65 8 L 90 18 L 90 48 L 65 58 L 40 48 Z" />
        <path d="M 40 18 L 65 28 L 90 18" />
        <path d="M 65 28 L 65 58" />
      </g>
      {/* front cube */}
      <g stroke={stroke} strokeWidth="1.2" fill="var(--bg)">
        <path d="M 18 42 L 43 32 L 68 42 L 68 72 L 43 82 L 18 72 Z" />
        <path d="M 18 42 L 43 52 L 68 42" fill="none" />
        <path d="M 43 52 L 43 82" fill="none" />
      </g>
    </svg>
  );
};

const OrbitDecoration = () => {
  const stroke = 'color-mix(in oklab, var(--ink-5) 45%, transparent)';
  return (
    <svg width="120" height="110" viewBox="0 0 120 110" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="55" rx="48" ry="18" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 4" />
      <ellipse cx="60" cy="55" rx="48" ry="18" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 4" transform="rotate(60 60 55)" />
      <ellipse cx="60" cy="55" rx="48" ry="18" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 4" transform="rotate(-60 60 55)" />
      <circle cx="60" cy="55" r="10" stroke={stroke} strokeWidth="1.2" fill="var(--bg)" />
    </svg>
  );
};

// Route decoration — a dashed S-curve with three stop markers. A small
// accent dot travels smoothly along the path; the line behind it turns
// green as the dot passes, showing progress. Resets cleanly on each loop.
const RouteDecoration = () => {
  const stroke = 'color-mix(in oklab, var(--ink-5) 45%, transparent)';
  const stopStroke = 'color-mix(in oklab, var(--ink-5) 55%, transparent)';
  const accent = '#4aa873';
  const pathD = 'M 14 28 Q 40 28 50 50 Q 60 72 90 72 Q 116 72 106 96';

  return (
    <svg width="120" height="110" viewBox="0 0 120 110" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
      {/* Base route — dashed gray (always visible as a "track") */}
      <path
        d={pathD}
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="3 5"
        fill="none"
      />

      {/* Trailing green path — drawn from start to end as the dot moves,
          then fades out before the next loop. pathLength=1 lets us animate
          stroke-dashoffset from 1 to 0 to "draw" the line on. */}
      <path
        d={pathD}
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        pathLength="1"
        strokeDasharray="1 1"
        strokeDashoffset="1"
      >
        {/* draw the trail in sync with the dot's motion (5s), then fade it
            out cleanly before the next loop kicks off */}
        <animate
          attributeName="stroke-dashoffset"
          values="1;0;0;1"
          keyTimes="0;0.83;0.92;1"
          dur="6s"
          repeatCount="indefinite"
          calcMode="linear"
        />
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.85;0.95;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Three stop markers */}
      <circle cx="14" cy="28" r="4.5" fill="var(--bg)" stroke={stopStroke} strokeWidth="1.3" />
      <circle cx="50" cy="50" r="4.5" fill="var(--bg)" stroke={stopStroke} strokeWidth="1.3" />
      <circle cx="106" cy="96" r="4.5" fill="var(--bg)" stroke={stopStroke} strokeWidth="1.3" />

      {/* Traveling dot — smooth continuous motion from start to end, then
          a quick fade before looping. No staccato stop-and-go. */}
      <circle r="4" fill={accent} stroke="var(--bg)" strokeWidth="1.5">
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;0.83;1"
          keyPoints="0;1;1"
          path={pathD}
        />
        <animate
          attributeName="opacity"
          values="1;1;0;0;1"
          keyTimes="0;0.83;0.9;0.95;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

// ============================================================================
// Bulk messaging — flow + side panel + decoration for the row that
// demonstrates filtered audience + dynamic shortkeys in the composer.
// ============================================================================

// Shortkey chip — quiet inline token. No border, no transform, sits on the
// baseline so prose flows naturally around it (Notion-mention feel).
const ShortkeyChip = ({ children }) => (
  <span style={{
    display: 'inline',
    padding: '1px 5px',
    borderRadius: 3,
    background: 'color-mix(in oklab, var(--ink-6) 8%, white)',
    color: 'var(--ink-3)',
    fontFamily: "'Geist Mono', monospace",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  }}>{children}</span>
);

// Audience filter chip — all neutral now. Only the *value* carries weight;
// the label sits in muted ink. A small accent dot marks an active filter.
const FilterChip = ({ label, value, active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px',
    borderRadius: 6,
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    fontSize: 11.5,
    letterSpacing: '-0.005em',
    whiteSpace: 'nowrap',
  }}>
    {active && (
      <span aria-hidden="true" style={{
        width: 5, height: 5, borderRadius: '50%',
        background: 'color-mix(in oklab, var(--accent) 75%, transparent)',
        flexShrink: 0,
      }} />
    )}
    <span style={{ color: 'var(--ink-5)', fontWeight: 500 }}>{label}</span>
    <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{value}</span>
  </span>
);

// Small-caps zone label — quiet section heading reused throughout the card.
const ZoneLabel = ({ children, right }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  }}>
    <span style={{
      fontSize: 10, fontWeight: 600,
      color: 'var(--ink-5)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}>{children}</span>
    {right}
  </div>
);

// Attio-style filter tile — bare icon + label, no card, no border, no bg.
// All icons monochrome stroke at ink-3 weight, all labels equal weight.
// Attio doesn't differentiate "active" filters visually in this view; the
// `active` and `iconTone` props are accepted but currently unused so callers
// don't need to change.
// eslint-disable-next-line no-unused-vars
const FilterTile = ({ icon, label, active, iconTone }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--line)',
    borderRadius: 8,
    boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02), 0 6px 16px -12px rgba(15, 23, 42, 0.18)',
  }}>
    <span aria-hidden="true" style={{
      color: 'var(--ink-3)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{icon}</span>
    <span style={{
      fontSize: 13, fontWeight: 500,
      color: 'var(--ink)',
      letterSpacing: '-0.015em',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  </div>
);

// Inline filter icons — Attio-style monochrome stroke-only set. All
// rendered identically regardless of "active" state (Attio doesn't recolor
// these in the source reference — that was my misread).
const _Ic = {
  drop:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.5s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z" /></svg>,
  dollar:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M14.5 9c0-1.5-1.3-2.2-2.5-2.2-1.5 0-2.5.8-2.5 2 0 2.8 5 1.7 5 4.4 0 1.5-1.3 2.2-2.5 2.2-1.5 0-2.5-.8-2.5-2"/><line x1="12" y1="4.5" x2="12" y2="6.8"/><line x1="12" y1="17.2" x2="12" y2="19.5"/></svg>,
  calendar:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>,
  user:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>,
  pin:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s-7-7-7-13a7 7 0 1 1 14 0c0 6-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  flask:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 2v6L4 19a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3L15 8V2"/><line x1="7.5" y1="2" x2="16.5" y2="2"/></svg>,
};

const BulkMessageFlow = () => {
  // Attio-style filter grid — six bare tiles in a 3-col / 2-row layout.
  // No connector wires, no center node, no output cards. Just inputs.
  // Below: the slim composer card with the shortkey demo and send button.
  // Read top-to-bottom in two columns (Attio's pattern):
  //   Pool type      MRR
  //   Route day      City / Zip
  //   Technician     Sanitizer
  const filters = [
    { icon: _Ic.drop,     label: 'Pool type',  active: true,  iconTone: 'blue' },
    { icon: _Ic.dollar,   label: 'MRR',        active: true,  iconTone: 'orange' },
    { icon: _Ic.calendar, label: 'Route day',  active: false },
    { icon: _Ic.pin,      label: 'City / Zip', active: false },
    { icon: _Ic.user,     label: 'Technician', active: false },
    { icon: _Ic.flask,    label: 'Sanitizer',  active: false },
  ];

  return (
    <FlowShell maxWidth={560}>
      <div style={{
        position: 'relative',
        height: 580,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 24,
      }}>
      {/* Filter tiles — arranged on a soft oval so the cluster reads as
          a rounded constellation rather than a rigid 2×3 grid. */}
      <div style={{
        position: 'relative',
        height: 200,
        margin: '4px auto 12px',
        width: '78%',
        transform: 'scale(0.85)',
        transformOrigin: 'center',
      }}>
        {[
          { top:  '6%',  left: '10%' },  // Pool type   (top-left,  pulled in)
          { top:  '6%',  left: '64%' },  // MRR         (top-right, pulled in)
          { top: '42%',  left: '-4%' },  // Route day   (mid-left,  widest)
          { top: '42%',  left: '72%' },  // City / Zip  (mid-right, widest)
          { top: '78%',  left:  '8%' },  // Technician  (bot-left,  pulled in)
          { top: '78%',  left: '64%' },  // Sanitizer   (bot-right, pulled in)
        ].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos }}>
            <FilterTile {...filters[i]} />
          </div>
        ))}
        {/* Single vertical guide line — centered horizontally, drawn from
            the row of top chips straight down to the composer's top edge.
            Length picked so it reaches the composer through the 0.85
            constellation scale (~223 pre-scale ≈ 190 real px). */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 6 / 100 * 200 + 11,   // 23px — vertical center of top chip row
          left: '50%',
          transform: 'translateX(-0.5px)',
          width: 1,
          height: 223,
          background: 'color-mix(in oklab, var(--ink-6) 32%, transparent)',
          zIndex: 0,
        }} />
        {/* Horizontal guide rails — one per chip row (top, mid, bottom),
            fading to transparent at each end. Each rail sits at the
            vertical center of its row so it reads as a quiet seating line.
            top % matches the chip `top` anchors (6 / 42 / 78) and adds
            chip-half-height (11px) to land on the row's vertical center. */}
        {[
          { y: 6 / 100 * 200 + 11,  width: '23%' },    // top row
          { y: 42 / 100 * 200 + 11, width: '35.94%' }, // mid row (Route day / City) — wider
          { y: 78 / 100 * 200 + 11, width: '23%' },    // bottom row
        ].map((rail, i) => (
          <div key={`rail-${i}`} aria-hidden="true" style={{
            position: 'absolute',
            top: rail.y,
            left: '50%',
            transform: 'translate(-50%, -0.5px)',
            width: rail.width,
            height: 1,
            background: 'linear-gradient(to right, transparent, color-mix(in oklab, var(--ink-6) 32%, transparent) 30%, color-mix(in oklab, var(--ink-6) 32%, transparent) 70%, transparent)',
            zIndex: 0,
          }} />
        ))}
      </div>

      {/* Slim composer card — proves the "tokens become real values" point */}
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02), 0 16px 40px -28px rgba(15, 23, 42, 0.28)',
        overflow: 'hidden',
      }}>
        {/* Audience strip — a quiet header that anchors the message to its
            filtered list. Reads like an email "To:" row. */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 18px',
          borderBottom: '1px solid var(--line)',
          background: 'color-mix(in oklab, var(--ink-6) 3%, var(--bg))',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, color: 'var(--ink-4)',
            letterSpacing: '-0.005em',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: 'var(--ink-5)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>To</span>
            <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>47 customers</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 7px',
              borderRadius: 999,
              background: 'color-mix(in oklab, var(--ink-6) 8%, transparent)',
              color: 'var(--ink-3)',
              fontSize: 10, fontWeight: 600,
              letterSpacing: '-0.005em',
            }}>
              <span aria-hidden="true" style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'currentColor',
              }} />
              Liquid chlorine
            </span>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 500,
            color: 'var(--ink-5)',
            letterSpacing: '-0.005em',
          }}>Draft · auto-saved</span>
        </div>

        {/* Formatting toolbar — mirrors the actual composer's rich-text
            controls (bold / italic / underline / lists / size / source). */}
        {(() => {
          const ToolBtn = ({ title, children, last }) => (
            <button type="button" aria-label={title} title={title} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26,
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderRadius: 5,
              color: 'var(--ink-5)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginRight: last ? 0 : 1,
            }}>{children}</button>
          );
          const Divider = () => (
            <span aria-hidden="true" style={{
              width: 1, height: 18, background: 'var(--line)',
              margin: '0 6px',
            }} />
          );
          const iconProps = {
            width: 14, height: 14, viewBox: '0 0 24 24',
            fill: 'none', stroke: 'currentColor',
            strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
            'aria-hidden': true,
          };
          return (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 2,
              padding: '6px 10px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--bg)',
            }}>
              <ToolBtn title="Bold (Ctrl+B)">
                <svg {...iconProps} strokeWidth={2.5}>
                  <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
                </svg>
              </ToolBtn>
              <ToolBtn title="Italic (Ctrl+I)">
                <svg {...iconProps}>
                  <line x1="19" x2="10" y1="4" y2="4" />
                  <line x1="14" x2="5" y1="20" y2="20" />
                  <line x1="15" x2="9" y1="4" y2="20" />
                </svg>
              </ToolBtn>
              <ToolBtn title="Underline (Ctrl+U)">
                <svg {...iconProps}>
                  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                  <line x1="4" x2="20" y1="20" y2="20" />
                </svg>
              </ToolBtn>
              <Divider />
              <ToolBtn title="Bullet list">
                <svg {...iconProps}>
                  <path d="M3 5h.01" /><path d="M3 12h.01" /><path d="M3 19h.01" />
                  <path d="M8 5h13" /><path d="M8 12h13" /><path d="M8 19h13" />
                </svg>
              </ToolBtn>
              <ToolBtn title="Numbered list">
                <svg {...iconProps}>
                  <path d="M11 5h10" /><path d="M11 12h10" /><path d="M11 19h10" />
                  <path d="M4 4h1v5" /><path d="M4 9h2" />
                  <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
                </svg>
              </ToolBtn>
              <Divider />
              <button type="button" title="Font size" style={{
                display: 'inline-flex', alignItems: 'center', gap: 2,
                height: 26, padding: '0 6px',
                background: 'transparent',
                border: 'none',
                borderRadius: 5,
                color: 'var(--ink-5)',
                fontSize: 11,
                fontFamily: "'Geist Mono', monospace",
                cursor: 'pointer',
              }}>
                —
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div style={{ flex: 1 }} />
              <ToolBtn title="HTML source view" last>
                <svg {...iconProps}>
                  <path d="m16 18 6-6-6-6" />
                  <path d="m8 6-6 6 6 6" />
                </svg>
              </ToolBtn>
            </div>
          );
        })()}

        {/* Compose area */}
        <div style={{ padding: '16px 18px 14px' }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'var(--ink)',
            letterSpacing: '-0.018em',
            marginBottom: 10,
          }}>
            A small adjustment to your service rate
          </div>
          <p style={{
            margin: 0,
            fontSize: 12.5, color: 'var(--ink-2)',
            lineHeight: 1.6,
            letterSpacing: '-0.005em',
          }}>
            Hi <ShortkeyChip>{'{First Name}'}</ShortkeyChip>, starting Apr 15
            your <ShortkeyChip>{'{Route Day}'}</ShortkeyChip> weekly service
            will move to <span style={{ fontWeight: 600, color: 'var(--ink)' }}>$140 / mo</span>.
            Your <ShortkeyChip>{'{Stop #}'}</ShortkeyChip> slot stays exactly the same.
          </p>
        </div>

        {/* Footer — preview + send. Separated by a hairline so the two
            tasks ("see what one person gets" / "send to all") read as
            distinct affordances rather than running together. */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
          padding: '10px 14px 10px 18px',
          borderTop: '1px solid var(--line)',
          background: 'color-mix(in oklab, var(--ink-6) 2%, var(--bg))',
        }}>
          <span style={{
            fontSize: 11, color: 'var(--ink-4)',
            letterSpacing: '-0.005em',
            minWidth: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: 'var(--ink-5)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginRight: 7,
            }}>Preview</span>
            <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>
              "Hi Carter, starting Apr 15 your Thursday…"
            </span>
          </span>
          <button type="button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 13px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 12, fontWeight: 600,
            fontFamily: 'inherit',
            letterSpacing: '-0.005em',
            cursor: 'pointer',
            boxShadow: '0 1px 0 rgba(255, 255, 255, 0.18) inset, 0 1px 1px rgba(15, 23, 42, 0.04), 0 6px 14px -6px color-mix(in oklab, var(--accent) 50%, transparent)',
            flexShrink: 0,
          }}>
            Send to 47
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </FlowShell>
  );
};

// Side panel — recent campaigns log. Stripped header, no icons in rows.
// Only the most recent campaign gets a quiet accent dot.
const BulkMessageSidePanel = () => {
  const campaigns = [
    { title: 'Liquid chlorine · price increase', meta: '47 sent · 2 days ago', recent: true },
    { title: 'Memorial Day route shift',          meta: '312 sent · 1 week ago' },
    { title: 'Filter clean season reminder',      meta: '89 sent · 3 weeks ago' },
    { title: 'Hurricane Idalia — service paused', meta: '418 sent · 2 months ago' },
  ];
  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 0 rgba(15, 23, 42, 0.02), 0 10px 22px -18px rgba(15, 23, 42, 0.18)',
    }}>
      <div style={{
        padding: '13px 14px 11px',
        borderBottom: '1px solid var(--line-2)',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 600,
          color: 'var(--ink-5)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Recent campaigns</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {campaigns.map((c, i) => (
          <div key={c.title} style={{
            display: 'flex', alignItems: 'baseline', gap: 8,
            padding: '11px 14px',
            borderTop: i === 0 ? 'none' : '1px solid var(--line-2)',
          }}>
            <span aria-hidden="true" style={{
              width: 5, height: 5, borderRadius: '50%',
              background: c.recent
                ? 'color-mix(in oklab, var(--accent) 75%, transparent)'
                : 'transparent',
              flexShrink: 0,
              alignSelf: 'center',
            }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 500,
                color: 'var(--ink-2)', letterSpacing: '-0.005em',
                lineHeight: 1.3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{c.title}</div>
              <div style={{
                fontSize: 10.5,
                color: 'var(--ink-5)',
                marginTop: 2,
                fontVariantNumeric: 'tabular-nums',
              }}>{c.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Decoration — fanned envelope stack with a "47" badge on top, suggesting
// many personalized messages at once.
const BulkMessageDecoration = () => {
  const stroke = 'color-mix(in oklab, var(--ink-5) 50%, transparent)';
  return (
    <svg width="150" height="110" viewBox="0 0 150 110" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="env-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--ink-6) 4%, var(--bg))" />
        </linearGradient>
      </defs>

      {/* Back envelope — most rotated, faintest */}
      <g transform="translate(28 38) rotate(-14)" opacity="0.6">
        <rect x="0" y="0" width="58" height="38" rx="3"
          fill="url(#env-face)" stroke={stroke} strokeWidth="1" />
        <path d="M0 0 L29 22 L58 0" fill="none" stroke={stroke} strokeWidth="1" />
      </g>

      {/* Middle envelope */}
      <g transform="translate(42 30) rotate(-3)" opacity="0.85">
        <rect x="0" y="0" width="62" height="40" rx="3.5"
          fill="url(#env-face)" stroke={stroke} strokeWidth="1.1" />
        <path d="M0 0 L31 23 L62 0" fill="none" stroke={stroke} strokeWidth="1.1" />
      </g>

      {/* Top envelope — sharpest, with a small accent address chip */}
      <g transform="translate(36 46) rotate(8)" style={{ filter: 'drop-shadow(0 3px 10px rgba(15,23,42,0.08))' }}>
        <rect x="0" y="0" width="64" height="42" rx="3.5"
          fill="var(--bg)" stroke="color-mix(in oklab, var(--ink-5) 65%, transparent)" strokeWidth="1.2" />
        {/* Flap */}
        <path d="M0 0 L32 24 L64 0" fill="none"
          stroke="color-mix(in oklab, var(--ink-5) 65%, transparent)" strokeWidth="1.2" />
        {/* Address lines */}
        <line x1="8" y1="29" x2="34" y2="29" stroke="color-mix(in oklab, var(--ink-5) 30%, transparent)" strokeWidth="1.1" />
        <line x1="8" y1="34" x2="28" y2="34" stroke="color-mix(in oklab, var(--ink-5) 30%, transparent)" strokeWidth="1.1" />
        {/* Stamp / accent chip in top-right */}
        <rect x="49" y="5" width="10" height="8" rx="1.5"
          fill="color-mix(in oklab, var(--accent) 18%, white)"
          stroke="color-mix(in oklab, var(--accent) 35%, transparent)" strokeWidth="0.8" />
      </g>

      {/* 47 badge — floats above the top envelope */}
      <g transform="translate(94 32)">
        <circle cx="0" cy="0" r="14"
          fill="color-mix(in oklab, var(--accent) 85%, white)"
          stroke="color-mix(in oklab, var(--accent) 50%, black)" strokeWidth="0.5"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(15,23,42,0.18))' }}
        />
        <text x="0" y="4"
          textAnchor="middle"
          fontFamily="'Geist', sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="#fff"
          letterSpacing="-0.02em"
        >47</text>
      </g>
    </svg>
  );
};

// Stack-to-stack PAID animation: an unpaid stack on the left feeds
// invoices one at a time into a stamp zone (middle), where each gets a
// PAID stamp slammed onto it, then slides down-right to land on a "paid"
// stack. 6.6s loop, three invoices cycled, brief settle, then reset.
//
// Timing per invoice (1.8s each):
//   0.00–0.20: lift off unpaid stack (translateY -6px, scale 1.04)
//   0.20–0.70: slide right to stamp zone
//   0.70–0.95: pause briefly
//   0.95–1.05: PAID stamp slams down (separate keyframe)
//   1.05–1.55: slide down-right into paid stack
//   1.55–1.80: settle in paid stack, keep visible
const PaidStampsDecoration = () => {
  const stroke = 'color-mix(in oklab, var(--ink-5) 50%, transparent)';
  const inset = 'color-mix(in oklab, var(--ink-5) 22%, transparent)';
  const paidFg = '#1f7a3a';
  const paidBg = '#e7f6ec';
  const paidBd = '#c8e8d2';

  // Layout coords inside the 200×120 viewBox:
  //   Unpaid stack center ≈ x=28, paid stack center ≈ x=148
  //   Stamp zone center   ≈ x=92
  //   Invoices rest at their starting transform (translate(10 38)),
  //   CSS keyframes shift them by 64px to the stamp zone, then 120px to
  //   the paid stack.
  return (
    <>
      <style>{`
        @keyframes invoice-journey {
          0%        { transform: translate(0, 0) rotate(0deg); }
          /* Lift off the unpaid stack */
          4%        { transform: translate(0, -4px) rotate(-1.5deg); }
          /* Glide right through the stamp zone */
          14%       { transform: translate(64px, -5px) rotate(-1deg); }
          /* Settle at stamp zone */
          17%, 19%  { transform: translate(64px, 0) rotate(0deg); }
          /* Press down when stamp slams */
          20%       { transform: translate(64px, 2px) rotate(0deg); }
          21%       { transform: translate(64px, 0) rotate(0deg); }
          /* Lift again and glide onto paid stack */
          30%       { transform: translate(120px, -4px) rotate(2deg); }
          /* Drop onto paid stack */
          33%, 96%  { transform: translate(120px, 4px) rotate(2deg); }
          /* Brief invisible reset window */
          97%, 100% { transform: translate(120px, 4px) rotate(2deg); }
        }

        @keyframes invoice-visibility {
          0%, 96%   { opacity: 1; }
          97%, 100% { opacity: 0; }
        }

        @keyframes stamp-slam {
          0%, 17%   { opacity: 0; transform: scale(1.9) rotate(-18deg); }
          19%       { opacity: 1; transform: scale(0.85) rotate(-7deg); }
          20%       { opacity: 1; transform: scale(1.06) rotate(-7deg); }
          22%, 96%  { opacity: 1; transform: scale(1) rotate(-7deg); }
          97%, 100% { opacity: 0; transform: scale(1) rotate(-7deg); }
        }
        @keyframes stamp-slam-2 {
          0%, 17%   { opacity: 0; transform: scale(1.8) rotate(18deg); }
          19%       { opacity: 1; transform: scale(0.88) rotate(11deg); }
          20%       { opacity: 1; transform: scale(1.06) rotate(11deg); }
          22%, 96%  { opacity: 1; transform: scale(1) rotate(11deg); }
          97%, 100% { opacity: 0; transform: scale(1) rotate(11deg); }
        }
        @keyframes stamp-slam-3 {
          0%, 17%   { opacity: 0; transform: scale(1.7) rotate(-8deg); }
          19%       { opacity: 1; transform: scale(0.9) rotate(3deg); }
          20%       { opacity: 1; transform: scale(1.06) rotate(3deg); }
          22%, 96%  { opacity: 1; transform: scale(1) rotate(3deg); }
          97%, 100% { opacity: 0; transform: scale(1) rotate(3deg); }
        }

        .paid-journey {
          animation: invoice-journey 6.6s ease-in-out infinite,
                     invoice-visibility 6.6s linear infinite;
          transform-box: fill-box;
        }
        .paid-stamp {
          transform-box: fill-box;
          transform-origin: center;
        }
        .invoice-1 { animation-delay: 0s, 0s; }
        .invoice-2 { animation-delay: -4.4s, -4.4s; }
        .invoice-3 { animation-delay: -2.2s, -2.2s; }

        .stamp-1 { animation: stamp-slam 6.6s ease-out infinite; animation-delay: 0s; }
        .stamp-2 { animation: stamp-slam-2 6.6s ease-out infinite; animation-delay: -4.4s; }
        .stamp-3 { animation: stamp-slam-3 6.6s ease-out infinite; animation-delay: -2.2s; }
      `}</style>
      <svg width="200" height="120" viewBox="0 0 200 120" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
        {/* UNPAID STACK — base sheets that always sit behind the moving invoices */}
        <g opacity="0.55">
          <rect x="13" y="40" width="36" height="48" rx="3"
            fill="var(--bg)" stroke={stroke} strokeWidth="1" transform="rotate(-4 31 64)" />
          <rect x="11" y="42" width="36" height="48" rx="3"
            fill="var(--bg)" stroke={stroke} strokeWidth="1" transform="rotate(3 29 66)" />
        </g>
        {/* PAID STACK — base sheets accumulating on the right */}
        <g opacity="0.45">
          <rect x="132" y="46" width="38" height="50" rx="3"
            fill="var(--bg)" stroke={stroke} strokeWidth="1" transform="rotate(5 151 71)" />
          <rect x="130" y="44" width="38" height="50" rx="3"
            fill="var(--bg)" stroke={stroke} strokeWidth="1" transform="rotate(-3 149 69)" />
        </g>
        {/* INVOICE 1 — simple variant */}
        <g className="paid-journey invoice-1">
          <g transform="translate(10 38)">
            <rect x="0" y="0" width="38" height="48" rx="3.5"
              fill="var(--bg)" stroke={stroke} strokeWidth="1.1"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(15,23,42,0.06))' }}
            />
            <rect x="5" y="5" width="14" height="3" rx="1.5" fill={inset} />
            <line x1="5" y1="14" x2="30" y2="14" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="20" x2="26" y2="20" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="26" x2="32" y2="26" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="32" x2="28" y2="32" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="38" x2="33" y2="38" stroke="color-mix(in oklab, var(--ink-5) 40%, transparent)" strokeWidth="0.8" />
            <rect x="18" y="41" width="14" height="3" rx="1.5" fill="color-mix(in oklab, var(--ink-5) 60%, transparent)" />
            <g className="paid-stamp stamp-1" transform="translate(3 17)">
              <rect x="0" y="0" width="32" height="14" rx="3"
                fill={paidBg} stroke={paidBd} strokeWidth="1" />
              <text x="16" y="10"
                textAnchor="middle"
                fontFamily="'Geist', sans-serif"
                fontSize="8.5"
                fontWeight="800"
                fill={paidFg}
                letterSpacing="0.08em"
              >PAID</text>
            </g>
          </g>
        </g>

        {/* INVOICE 2 — accent header band */}
        <g className="paid-journey invoice-2">
          <g transform="translate(10 38)">
            <rect x="0" y="0" width="38" height="48" rx="3.5"
              fill="var(--bg)" stroke={stroke} strokeWidth="1.1"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(15,23,42,0.06))' }}
            />
            <rect x="0" y="0" width="38" height="9" rx="3.5"
              fill="color-mix(in oklab, var(--accent) 14%, white)" />
            <rect x="0" y="6" width="38" height="3"
              fill="color-mix(in oklab, var(--accent) 14%, white)" />
            <rect x="5" y="3" width="16" height="2.5" rx="1.25"
              fill="color-mix(in oklab, var(--accent) 70%, transparent)" />
            <line x1="5" y1="16" x2="32" y2="16" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="22" x2="28" y2="22" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="28" x2="30" y2="28" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="34" x2="32" y2="34" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="40" x2="33" y2="40" stroke="color-mix(in oklab, var(--ink-5) 40%, transparent)" strokeWidth="0.8" />
            <rect x="20" y="42.5" width="13" height="3" rx="1.5" fill="color-mix(in oklab, var(--ink-5) 70%, transparent)" />
            <g className="paid-stamp stamp-2" transform="translate(3 18)">
              <rect x="0" y="0" width="32" height="14" rx="3"
                fill={paidBg} stroke={paidBd} strokeWidth="1" />
              <text x="16" y="10"
                textAnchor="middle"
                fontFamily="'Geist', sans-serif"
                fontSize="8.5"
                fontWeight="800"
                fill={paidFg}
                letterSpacing="0.08em"
              >PAID</text>
            </g>
          </g>
        </g>

        {/* INVOICE 3 — logo-dot variant */}
        <g className="paid-journey invoice-3">
          <g transform="translate(10 38)">
            <rect x="0" y="0" width="38" height="48" rx="3.5"
              fill="var(--bg)" stroke={stroke} strokeWidth="1.1"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(15,23,42,0.06))' }}
            />
            <circle cx="9" cy="8" r="2.5" fill="color-mix(in oklab, var(--accent) 50%, transparent)" />
            <rect x="14" y="6.5" width="16" height="3" rx="1.5" fill={inset} />
            <line x1="5" y1="17" x2="30" y2="17" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="23" x2="32" y2="23" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="29" x2="26" y2="29" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="35" x2="30" y2="35" stroke={inset} strokeWidth="0.9" />
            <line x1="5" y1="41" x2="33" y2="41" stroke="color-mix(in oklab, var(--ink-5) 40%, transparent)" strokeWidth="0.8" />
            <rect x="19" y="43" width="14" height="3" rx="1.5" fill="color-mix(in oklab, var(--ink-5) 60%, transparent)" />
            <g className="paid-stamp stamp-3" transform="translate(3 18)">
              <rect x="0" y="0" width="32" height="14" rx="3"
                fill={paidBg} stroke={paidBd} strokeWidth="1" />
              <text x="16" y="10"
                textAnchor="middle"
                fontFamily="'Geist', sans-serif"
                fontSize="8.5"
                fontWeight="800"
                fill={paidFg}
                letterSpacing="0.08em"
              >PAID</text>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

// Stacked reports/envelopes — three sheets fanned in a near-isometric stack,
// the top one gently lifting on a 4s loop like a report being delivered.
const ReportsDecoration = () => {
  const stroke = 'color-mix(in oklab, var(--ink-5) 50%, transparent)';
  const inset = 'color-mix(in oklab, var(--ink-5) 22%, transparent)';
  return (
    <>
      <style>{`
        @keyframes reports-lift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-4px, -10px); }
        }
        @keyframes reports-shadow {
          0%, 100% { opacity: 0.55; transform: scaleX(1); }
          50%      { opacity: 0.30; transform: scaleX(0.85); }
        }
        .reports-top { animation: reports-lift 4s ease-in-out infinite; transform-origin: center; }
        .reports-top-shadow { animation: reports-shadow 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
      `}</style>
      <svg width="120" height="110" viewBox="0 0 120 110" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
        {/* back sheet — furthest, most rotated */}
        <g transform="translate(48 18) rotate(-12)">
          <rect x="0" y="0" width="46" height="58" rx="3" fill="var(--bg)" stroke={stroke} strokeWidth="1.2" />
          <line x1="8" y1="14" x2="38" y2="14" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="22" x2="34" y2="22" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="30" x2="38" y2="30" stroke={inset} strokeWidth="1" />
        </g>

        {/* middle sheet */}
        <g transform="translate(35 28) rotate(-3)">
          <rect x="0" y="0" width="46" height="58" rx="3" fill="var(--bg)" stroke={stroke} strokeWidth="1.2" />
          <line x1="8" y1="14" x2="38" y2="14" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="22" x2="34" y2="22" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="30" x2="38" y2="30" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="38" x2="36" y2="38" stroke={inset} strokeWidth="1" />
        </g>

        {/* drop shadow under the lifting top sheet */}
        <ellipse className="reports-top-shadow"
          cx="44" cy="92" rx="22" ry="3"
          fill="rgba(15, 23, 42, 0.18)" />

        {/* top sheet — animates with a gentle lift */}
        <g className="reports-top" transform="translate(22 38) rotate(6)">
          <rect x="0" y="0" width="46" height="58" rx="3" fill="var(--bg)" stroke={stroke} strokeWidth="1.2" />
          {/* header bar — accent color so the "active" sheet reads as
              the one being sent right now */}
          <rect x="8" y="10" width="20" height="3" rx="1.5"
            fill="color-mix(in oklab, var(--accent) 55%, transparent)" />
          <line x1="8" y1="20" x2="38" y2="20" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="27" x2="34" y2="27" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="34" x2="38" y2="34" stroke={inset} strokeWidth="1" />
          <line x1="8" y1="41" x2="30" y2="41" stroke={inset} strokeWidth="1" />
          {/* small green check seal in the corner */}
          <circle cx="36" cy="48" r="4.5"
            fill="#e7f6ec" stroke="#c8e8d2" strokeWidth="1" />
          <path d="M 34 48.2 L 35.3 49.5 L 38 47" stroke="var(--green, #1f7a3a)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    </>
  );
};


// "Built differently" — light surface, asymmetric bento, Tech App as hero.
const BuiltDifferently = () => {
  return (
    <section id="solutions" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg)',
      paddingBlock: 'clamp(80px, 10vw, 140px)',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(1100px 520px at 50% -10%, color-mix(in oklab, var(--accent) 5%, transparent), transparent 65%)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 820, margin: '0 auto 64px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 3.8vw, 52px)',
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>
            Six things we built<br />because they should exist.
          </h2>
          <p style={{
            marginTop: 20,
            fontSize: 16.5,
            lineHeight: 1.55,
            color: 'var(--ink-4)',
            maxWidth: 580,
            marginInline: 'auto',
            textWrap: 'balance',
          }}>
            You won't find these in Skimmer, Pooltrackrr, or whichever stack you're migrating off. We built them because every owner we talked to was working around their absence.
          </p>
        </div>

        {/* Asymmetric bento — Tech app HERO 7×2, satellites fill the rest */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: 'minmax(180px, auto)',
          gap: 14,
        }}>
          <TechAppCard />
          <FleetMapCard />
          <AutoBillingCard />
          <RoutingCard />
          <PermissionsCard />
          <FleetTrackerCard />
        </div>
      </div>
    </section>
  );
};

// — shared card chrome (light) — matches the Features bento family
const lightCardBase = (hero = false) => ({
  background: 'var(--bg)',
  border: '1px solid var(--line)',
  borderRadius: hero ? 20 : 16,
  padding: hero ? 32 : 24,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex', flexDirection: 'column',
  boxShadow: hero
    ? '0 1px 0 rgba(15, 23, 42, .02), 0 18px 40px -28px rgba(15, 23, 42, .14)'
    : '0 1px 0 rgba(15, 23, 42, .02), 0 10px 26px -22px rgba(15, 23, 42, .10)',
  transition: 'border-color .25s ease, transform .25s ease, box-shadow .25s ease',
});

// Subtle top edge highlight on light surface
const TopHighlight = () => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: '0 0 auto 0', height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)',
    pointerEvents: 'none',
  }} />
);

const Eyebrow = ({ children, hero = false }) => (
  <div style={{
    fontFamily: "'Geist Mono', monospace",
    fontSize: hero ? 11 : 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    fontWeight: 600,
    marginBottom: hero ? 16 : 14,
  }}>{children}</div>
);

const HeroTitle = ({ children }) => (
  <h3 style={{
    fontSize: 'clamp(24px, 2.4vw, 30px)',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    color: 'var(--ink)',
    lineHeight: 1.1,
    textWrap: 'balance',
  }}>{children}</h3>
);

const SatTitle = ({ children }) => (
  <h3 style={{
    fontSize: 19,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--ink)',
    lineHeight: 1.2,
    textWrap: 'balance',
  }}>{children}</h3>
);

const Body = ({ children, hero = false, max = 480 }) => (
  <p style={{
    marginTop: hero ? 14 : 10,
    fontSize: hero ? 15.5 : 13.5,
    lineHeight: 1.6,
    color: 'var(--ink-4)',
    maxWidth: max,
  }}>{children}</p>
);

// ── 01 · Tech app (HERO) ──
const TechAppCard = () => (
  <div style={{ ...lightCardBase(true), gridColumn: 'span 7', gridRow: 'span 2' }}>
    <TopHighlight />
    <Eyebrow hero>01 · The tech app</Eyebrow>
    <HeroTitle>The truck app, built like real software.</HeroTitle>
    <Body hero max={520}>
      Required fields stop reports from going out half-empty. Subject lines auto-flag low water before the customer notices. The pool profile drives live LSI, dose math, and pressure alerts — so a tech with one season runs the route like a ten-year vet.
    </Body>

    <div style={{
      marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
    }}>
      {[
        ['Required fields', 'Block submit until CYA, chlorine & photo are in.'],
        ['Smart subject lines', 'Auto-flag low water and out-of-range chemistry.'],
        ['Live LSI & dosing', 'Pool profile drives chemical math in real time.'],
        ['Pressure alerts', 'Ping the tech at +8 PSI over baseline.'],
      ].map(([k, v]) => (
        <div key={k} style={{
          background: 'var(--bg-soft)',
          border: '1px solid var(--line-2)',
          borderRadius: 12,
          padding: '13px 14px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '-0.005em' }}>{k}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-5)', marginTop: 4, lineHeight: 1.5 }}>{v}</div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 24 }}>
      <a href="/tech-app" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 13.5, fontWeight: 500,
        color: 'var(--ink)',
        background: 'var(--bg-soft)',
        border: '1px solid var(--line)',
        borderRadius: 999,
        padding: '9px 14px 9px 16px',
        textDecoration: 'none',
        transition: 'background .2s, border-color .2s',
      }}>
        See the tech app
        <span aria-hidden="true" style={{ fontSize: 14, color: 'var(--accent)' }}>→</span>
      </a>
    </div>
  </div>
);

// ── 02 · Fleet map ──
const FleetMapCard = () => {
  const techs = [
    { color: 'var(--accent)', label: 'Jamal', pins: [[64, 28], [76, 22], [82, 38], [72, 44], [88, 30]] },
    { color: 'var(--brand-green)', label: 'Marisol', pins: [[22, 42], [30, 50], [18, 56], [34, 40]] },
    { color: 'var(--brand-violet)', label: 'Theo', pins: [[26, 66], [36, 72], [42, 64]] },
    { color: 'var(--brand-pink)', label: 'Devon', pins: [[48, 78], [58, 80], [52, 86]] },
  ];
  return (
    <div style={{ ...lightCardBase(), gridColumn: 'span 5' }}>
      <TopHighlight />
      <Eyebrow>02 · Fleet map</Eyebrow>
      <SatTitle>Every stop, every tech, one map.</SatTitle>
      <Body>Color-code by technician, or pick a tech and color-code by day. The kind of optimization that comes from seeing the full picture at once.</Body>

      <div style={{ marginTop: 'auto', paddingTop: 18 }}>
        <div style={{
          background: 'var(--bg-soft)',
          border: '1px solid var(--line-2)',
          borderRadius: 12,
          padding: 14,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', aspectRatio: '5 / 3' }}>
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="60" stroke="#e4e4e7" strokeWidth="0.2" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#e4e4e7" strokeWidth="0.2" />
              ))}
            </svg>
            {techs.flatMap((t, ti) => t.pins.map(([x, y], pi) => (
              <div key={`${ti}-${pi}`} style={{
                position: 'absolute',
                left: `${x}%`, top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: 13, height: 13, borderRadius: '50%',
                background: t.color,
                border: '1.5px solid #fff',
                boxShadow: `0 0 0 3px color-mix(in oklab, ${t.color} 18%, transparent)`,
                fontSize: 7.5, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Geist Mono', monospace",
              }}>{pi + 1}</div>
            )))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {techs.map((t) => (
              <div key={t.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 999,
                fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 500,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 03 · Auto-billing ──
const AutoBillingCard = () => (
  <div style={{ ...lightCardBase(), gridColumn: 'span 5' }}>
    <TopHighlight />
    <Eyebrow>03 · Auto-billing</Eyebrow>
    <SatTitle>Bills on the day they signed up. Forever.</SatTitle>
    <Body>Sign a customer on the 21st, invoiced on the 21st — monthly, quarterly, or yearly. No proration, no calendar-month weirdness, no buttons to push.</Body>

    <div style={{ marginTop: 'auto', paddingTop: 18 }}>
      <div style={{
        background: 'var(--bg-soft)',
        border: '1px solid var(--line-2)',
        borderRadius: 12,
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10.5, fontFamily: "'Geist Mono', monospace", color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Anniversary</span>
          <span style={{ fontSize: 10.5, fontFamily: "'Geist Mono', monospace", color: 'var(--ink-5)' }}>The 21st · monthly</span>
        </div>
        {[
          ['Apr 21', 'Marisol Vega', '$165'],
          ['May 21', 'Marisol Vega', '$165'],
          ['Jun 21', 'Marisol Vega', '$165'],
        ].map(([d, n, a], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '56px 1fr auto', alignItems: 'center', gap: 12,
            padding: '7px 0', fontSize: 12.5,
          }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", color: 'var(--ink-5)', fontVariantNumeric: 'tabular-nums' }}>{d}</span>
            <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{n}</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontFamily: "'Geist Mono', monospace" }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 04 · Routing safety net ──
const RoutingCard = () => (
  <div style={{ ...lightCardBase(), gridColumn: 'span 4' }}>
    <TopHighlight />
    <Eyebrow>04 · Routing</Eyebrow>
    <SatTitle>A safety net so you never miss a customer.</SatTitle>
    <Body>Active customers without a tech assigned automatically land in an Unrouted queue. A persistent warning sits on the Customers page until every active customer is on a route.</Body>

    <div style={{ marginTop: 'auto', paddingTop: 18 }}>
      <div style={{
        background: 'color-mix(in oklab, var(--accent) 6%, var(--bg))',
        border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
        borderRadius: 12,
        padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          flexShrink: 0, width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent)',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>3 customers unrouted</div>
          <div style={{ fontSize: 11, color: 'var(--ink-5)', marginTop: 1 }}>Tap to assign · Customers page</div>
        </div>
        <span style={{ fontSize: 10.5, color: 'var(--accent)', fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>WARN</span>
      </div>
    </div>
  </div>
);

// ── 05 · Permissions ──
const PermissionsCard = () => (
  <div style={{ ...lightCardBase(), gridColumn: 'span 3' }}>
    <TopHighlight />
    <Eyebrow>05 · Permissions</Eyebrow>
    <SatTitle>Hide what they shouldn't see.</SatTitle>
    <Body>Per-tech visibility. Hide phone numbers, prices, payment info — anything.</Body>

    <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[
        ['Phone numbers', false],
        ['Pricing', false],
        ['Payment info', false],
        ['Service history', true],
      ].map(([label, on], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--bg-soft)',
          border: '1px solid var(--line-2)',
          borderRadius: 10,
          fontSize: 12, color: 'var(--ink-2)',
        }}>
          <span>{label}</span>
          <span style={{
            width: 24, height: 14, borderRadius: 999,
            background: on ? 'var(--accent)' : 'var(--line)',
            position: 'relative',
            transition: 'background .2s',
          }}>
            <span style={{
              position: 'absolute', top: 1.5, left: on ? 11 : 1.5,
              width: 11, height: 11, borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 2px rgba(0,0,0,.18)',
              transition: 'left .2s',
            }} />
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ── 06 · Fleet tracker ──
const FleetTrackerCard = () => (
  <div style={{ ...lightCardBase(), gridColumn: 'span 5' }}>
    <TopHighlight />
    <Eyebrow>06 · Fleet tracker</Eyebrow>
    <SatTitle>Your trucks, documented in the same app.</SatTitle>
    <Body>Interior and exterior photos, mileage, oil changes, service history — uploaded by the tech who's already in the app. No separate fleet tool, no paper logs.</Body>

    <div style={{ marginTop: 'auto', paddingTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{
        background: 'var(--bg-soft)',
        border: '1px solid var(--line-2)',
        borderRadius: 12,
        padding: 12,
      }}>
        <div style={{
          aspectRatio: '4 / 3',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 10,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,.4), transparent 60%)' }} />
          <div style={{
            position: 'absolute', bottom: 7, left: 9,
            fontSize: 9.5, fontFamily: "'Geist Mono', monospace",
            color: 'rgba(255,255,255,.95)',
            fontWeight: 500,
          }}>TRK-04 · Ford Transit</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            ['Miles', '84,213'],
            ['Last oil', 'Mar 12'],
            ['Service', 'Jun 9'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 9, fontFamily: "'Geist Mono', monospace", color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        background: 'var(--bg-soft)',
        border: '1px solid var(--line-2)',
        borderRadius: 12,
        padding: 12,
      }}>
        <div style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Recent</div>
        {[
          ['Apr 18', 'Tire rotation'],
          ['Apr 14', 'Oil change'],
          ['Apr 09', 'Interior photo'],
        ].map(([d, m], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '48px 1fr', gap: 8,
            padding: '5px 0', fontSize: 11.5,
          }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", color: 'var(--ink-5)' }}>{d}</span>
            <span style={{ color: 'var(--ink-3)' }}>{m}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);


// Deep-dive tabs — feature exploration without cluttering the bento grid above.
const DeepDive = () => {
  const tabs = [
  {
    id: 'routes',
    label: 'Routes',
    icon: <I.map />,
    headline: 'A route plan that re-optimizes overnight.',
    body: 'Drag a stop in, drag a tech out, and the schedule re-flows automatically. PoolLogic balances mileage, time-on-stop and customer windows so your trucks aren\'t crossing town twice.',
    bullets: [
    'Auto-optimization runs at 5 AM, every day',
    'Per-stop time tracking learns your actual minutes',
    'Skill-based assignment for renovations & repairs',
    'Drag-and-drop overrides — no menu diving'],

    stats: [
    ['38 min', 'saved per tech daily'],
    ['1,208', 'stops routed in seconds'],
    ['12+', 'trucks supported per shop']],

    preview: 'routes'
  },
  {
    id: 'reports',
    label: 'Service reports',
    icon: <I.droplet />,
    headline: 'Branded reports that send themselves.',
    body: 'Every photo, chemistry reading, and dosage your tech logs goes straight into a clean, branded service report — sent to the customer the moment a stop closes.',
    bullets: [
    'Customer-branded with your logo & colors',
    'Photos auto-attached from the on-truck app',
    'Chemistry trends visible per pool, over time',
    'Auto-alerts when readings drift out of range'],

    stats: [
    ['96%', 'attach rate vs. 41% paper'],
    ['0', 'extra clicks for the tech'],
    ['Live', 'chemistry trend graphs']],

    preview: 'reports'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <I.receipt />,
    headline: 'Invoices fire from the route, not the desk.',
    body: 'Recurring invoices send the moment a stop is complete. Cards on file charge automatically. ACH posts overnight. End-of-month becomes a non-event.',
    bullets: [
    'Per-stop invoicing on service completion',
    'Stripe & ACH built in; pass-through to QBO',
    'One-tap ticket → quote → invoice flow',
    'Auto-retries for failed cards with smart reminders'],

    stats: [
    ['11 days', 'faster cash on average'],
    ['$189', 'average invoice value'],
    ['1-tap', 'ticket-to-quote conversion']],

    preview: 'billing'
  },
  {
    id: 'audit',
    label: 'Service audit',
    icon: <I.shield />,
    headline: 'A 5 AM scan that catches what you can\'t.',
    body: 'Every night, PoolLogic checks every stop from the day before — flags missed visits, missing photos, chemistry drift, and stale equipment notes. You wake up to a list, not a fire.',
    bullets: [
    'Overnight audit across every stop, every truck',
    'Missed-stop, missing-photo, drift detection',
    'Auto-tickets for follow-ups & rechecks',
    'Per-tech quality score — visible to the team'],

    stats: [
    ['Every night', 'at 5 AM'],
    ['<1%', 'missed-stop rate after rollout'],
    ['Auto', 'follow-up ticket creation']],

    preview: 'audit'
  },
  {
    id: 'directory',
    label: 'Directory',
    icon: <I.customers />,
    headline: 'Search 10,000+ customers in under a second.',
    body: 'Every customer, pool, gate code, dog name and chemistry history — one ⌘K away. Routed and unrouted views. One tap from profile to ticket, quote, or invoice.',
    bullets: [
    '⌘K search across customers, pools & properties',
    'Routed + unrouted segmented views',
    'Custom fields for gate codes, pets, equipment',
    'One-tap profile → ticket → quote → invoice'],

    stats: [
    ['<1s', 'search across 10K customers'],
    ['1-tap', 'profile to ticket'],
    ['1,208', 'live customers in this demo']],

    preview: 'directory'
  }];


  const [active, setActive] = useState('routes');
  const tab = tabs.find((t) => t.id === active);

  return (
    <section className="section-divider" style={{ background: 'var(--bg-soft)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <h2>Look closer at what actually runs your day.</h2>
          <p style={{ marginTop: 16 }}>The bento above is the headline. Here's what each piece really does — pick a feature.</p>
        </div>

        {/* Tab strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          marginBottom: 36,
          borderBottom: '1px solid var(--line)',
          flexWrap: 'wrap'
        }}>
          {tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <button key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
                padding: '14px 20px',
                fontSize: 14.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--ink)' : 'var(--ink-4)',
                cursor: 'pointer',
                transition: 'all .15s'
              }}
              onMouseEnter={(e) => {if (!isActive) e.currentTarget.style.color = 'var(--ink-2)';}}
              onMouseLeave={(e) => {if (!isActive) e.currentTarget.style.color = 'var(--ink-4)';}}>
                
                <span style={{ display: 'inline-flex', color: isActive ? 'var(--accent)' : 'var(--ink-5)' }}>{t.icon}</span>
                {t.label}
              </button>);

          })}
        </div>

        {/* Active tab body */}
        <div key={tab.id} className="rise deep-dive-body" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 56,
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: 'clamp(24px, 3.4vw, 32px)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15 }}>{tab.headline}</h3>
            <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-3)' }}>{tab.body}</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tab.bullets.map((b) =>
              <li key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                  <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--brand-green)', color: '#fff', flexShrink: 0,
                  marginTop: 2
                }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 6" />
                    </svg>
                  </span>
                  {b}
                </li>
              )}
            </ul>

            <div className="deep-dive-stats" style={{ display: 'flex', gap: 32, marginTop: 32, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
              {tab.stats.map(([big, mid]) =>
              <div key={big}>
                  <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{big}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-5)', marginTop: 4 }}>{mid}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right preview — reuse existing mini cards */}
          <div className="deep-dive-preview" style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 30px 60px -30px rgba(15, 23, 42, .15), 0 8px 16px -8px rgba(15, 23, 42, .06)'
          }}>
            {tab.preview === 'routes' && <RouteCard />}
            {tab.preview === 'reports' && <ServiceReportCard />}
            {tab.preview === 'billing' && <InvoiceCard />}
            {tab.preview === 'audit' && <DashboardCard />}
            {tab.preview === 'directory' && <DirectoryMini />}
          </div>
        </div>
      </div>
    </section>);

};

// "How it works" - the day in 4 steps
const HowItWorks = () => {
  const steps = [
  { t: 'Plan the day', d: 'Routes optimize at 5 AM. Each tech wakes up to a clean stop list, photos of last visit, and any flags from the last service audit.', icon: <I.map /> },
  { t: 'Run the route', d: 'On-truck app works offline. Tap to start, snap chemistry photos, log parts. Customers get an ETA text without anyone lifting a finger.', icon: <I.phone /> },
  { t: 'Close out automatically', d: 'Service report sends. Invoice fires. Card on file is charged. The next day\'s route already knows what changed.', icon: <I.zap /> },
  { t: 'See what happened', d: 'Service audit catches missed stops and chemistry drift overnight. Route insight tells you which day, tech, or zip code is bleeding margin.', icon: <I.chart /> }];

  return (
    <section className="section-divider" style={{ background: 'var(--bg-soft)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 60 }}>
          <div>
            <h2>From route plan to deposit, without you in the loop.</h2>
            <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.55 }}>The fewer apps, sticky notes and group texts between you and a clean pool, the more pools you can serve. PoolLogic collapses the day into one flow.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {steps.map((s, i) =>
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '24px 0', borderTop: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--accent)' }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-5)' }}>0{i + 1}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 7, background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{s.t}</h3>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.6 }}>{s.d}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

// Stats / impact
const Stats = () =>
<section className="section-divider tight">
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {[
      ['11 days', 'faster cash collection', 'on average vs. month-end billing'],
      ['38 min', 'saved per tech per day', 'with automated route optimization'],
      ['96%', 'service report attach rate', 'up from 41% on paper or photos-via-text'],
      ['4,200+', 'pool businesses', 'from 1-truck shops to 80-route operations']].
      map(([big, mid, sub], i) =>
      <div key={i}>
            <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--ink)' }}>{big}</div>
            <div style={{ marginTop: 10, fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>{mid}</div>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--ink-5)', lineHeight: 1.5 }}>{sub}</div>
          </div>
      )}
      </div>
    </div>
  </section>;


// Testimonial — three-up wall, more credible than a single hero quote
const Testimonial = () => {
  const quotes = [
  { q: "We went from one truck and a Notes app to seven routes across two counties without hiring an office manager.", who: 'Hector Salazar', role: 'Owner, SunCoast Pool Co.', loc: 'St. Petersburg, FL', initials: 'HS', size: 'lg' },
  { q: "First close-of-month I didn't have to chase a single invoice. Money just landed.", who: 'Dana Park', role: 'GM, BlueWave Pools', loc: 'Jacksonville, FL', initials: 'DP', size: 'sm' },
  { q: "Service audit caught a bad chemistry reading on Tuesday. Customer never noticed there was an issue.", who: 'Jamal Ortiz', role: 'Lead tech, Crystal Pools', loc: 'Naples, FL', initials: 'JO', size: 'sm' }];

  return (
    <section className="section-divider">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          {/* Big quote */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 18, padding: 40, background: 'var(--bg-soft)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, color: 'var(--brand-orange)' }}>
              {[0, 1, 2, 3, 4].map((i) => <I.star key={i} />)}
            </div>
            <blockquote style={{ margin: 0, fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1.22, letterSpacing: '-0.005em', color: 'var(--ink)', flex: 1 }}>
              "We went from one truck and a Notes app to <em style={{ color: 'var(--accent)' }}>seven routes across two counties</em> without hiring an office manager."
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, color-mix(in oklab, var(--brand-blue) 60%, white), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>{quotes[0].initials}</div>
              <div>
                <div style={{ fontWeight: 500 }}>{quotes[0].who}</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-5)' }}>{quotes[0].role} · {quotes[0].loc}</div>
              </div>
            </div>
          </div>
          {/* Stack of two smaller quotes */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
            {quotes.slice(1).map((t, i) =>
            <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.45, color: 'var(--ink-2)', flex: 1 }}>"{t.q}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg, var(--brand-green), color-mix(in oklab, var(--brand-green) 65%, black))' : 'linear-gradient(135deg, var(--brand-orange), color-mix(in oklab, var(--brand-orange) 65%, black))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 13 }}>{t.initials}</div>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{t.who}</div>
                    <div style={{ color: 'var(--ink-5)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

// Pricing — Core/Insight/Vision tiers + Enterprise (coming soon).
// Every tier carries the same 0.5% platform fee on Stripe-processed payments;
// check/cash/external payments are always free.
const buildTiers = (annual) => [
{
  name: 'Core',
  price: 0,
  priceUnit: null,
  blurb: 'Everything you need to run the business. Free until you get paid.',
  features: [
    'Unlimited customers & technicians',
    'Routes, scheduling & on-truck app',
    'Service reports with photos & chemistry',
    'Recurring invoices & Stripe autopay',
    'Customer portal',
  ],
  cta: 'Get a demo',
  ctaHref: '/contact',
},
{
  name: 'Insight',
  price: annual ? 29 : 39,
  priceUnit: '/tech/mo',
  blurb: 'See exactly where time and gas are leaking.',
  features: [
    'Everything in Core',
    'Route insight scoring',
    'Daily service audit',
    'Operations dashboard',
    'Revenue & MRR analytics',
  ],
  cta: 'Get a demo',
  ctaHref: '/contact',
  popular: true,
},
{
  name: 'Vision',
  price: annual ? 59 : 79,
  priceUnit: '/tech/mo',
  blurb: 'Let the AI write the reports, schedule the calls, catch the drift.',
  features: [
    'Everything in Insight',
    'AI-drafted service reports',
    'AI document import (PDF / screenshot)',
    'Customer SMS (when shipped)',
    'Predictive chemistry alerts',
    'Priority support',
  ],
  cta: 'Get a demo',
  ctaHref: '/contact',
},
{
  name: 'Enterprise',
  price: null,
  priceUnit: null,
  blurb: 'Multi-region operations, custom roles, deep integrations.',
  features: [
    'Everything in Vision',
    'Multi-region routing',
    'Custom roles & approvals',
    'API + webhooks',
    'Dedicated success manager',
  ],
  cta: 'Coming soon',
  ctaHref: null,
}];

// Shared pricing cards — used on the homepage Pricing section and on /pricing.
// Owns its own annual/monthly state and toggle so it's drop-in anywhere.
const PricingCards = () => {
  const [annual, setAnnual] = useState(true);
  const tiers = buildTiers(annual);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div style={{
          position: 'relative',
          display: 'inline-flex', padding: 3,
          background: 'var(--bg-muted)',
          border: '1px solid var(--line)',
          borderRadius: 8, fontSize: 13,
        }}>
          <span aria-hidden="true" style={{
            position: 'absolute',
            top: 3, bottom: 3,
            left: annual ? '50%' : 3,
            width: 'calc(50% - 3px)',
            background: 'var(--bg)',
            borderRadius: 6,
            boxShadow: '0 1px 2px rgba(15, 23, 42, .06), 0 0 0 1px rgba(15, 23, 42, .04)',
            transition: 'left .22s cubic-bezier(.2,.8,.2,1)',
          }} />
          {[['Monthly', false], ['Annual', true]].map(([l, v]) =>
          <button key={l} onClick={() => setAnnual(v)} style={{
            position: 'relative',
            flex: 1,
            minWidth: 84,
            padding: '6px 16px',
            background: 'transparent',
            color: annual === v ? 'var(--ink)' : 'var(--ink-4)',
            border: 'none',
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 13,
            transition: 'color .15s',
            cursor: 'pointer',
            zIndex: 1,
          }}>{l}</button>
          )}
        </div>
      </div>

      <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {tiers.map((t) => {
        const isEnterprise = t.ctaHref === null;
        const popularBorder = 'color-mix(in oklab, var(--accent) 38%, var(--line))';
        return (
          <div key={t.name}
            onMouseEnter={(e) => { if (!t.popular && !isEnterprise) { e.currentTarget.style.borderColor = 'var(--ink-6)'; } }}
            onMouseLeave={(e) => { if (!t.popular && !isEnterprise) { e.currentTarget.style.borderColor = 'var(--line)'; } }}
            style={{
            border: t.popular ? `1.5px solid ${popularBorder}` : '1px solid var(--line)',
            borderRadius: 14,
            padding: '28px 22px',
            background: 'var(--bg)',
            position: 'relative',
            opacity: isEnterprise ? 0.85 : 1,
            display: 'flex', flexDirection: 'column',
            transition: 'border-color .2s ease'
          }}>
            {t.popular && (
              <div style={{
                alignSelf: 'flex-start',
                fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                color: 'color-mix(in oklab, var(--accent) 75%, black)',
                padding: '4px 10px', borderRadius: 999,
                marginBottom: 14,
              }}>Most popular</div>
            )}
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{t.name}</h3>

            <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8, minHeight: 44, flexWrap: 'wrap' }}>
              {t.price === 0 ?
              <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--ink)' }}>$0</span> :
              t.price === null ?
              <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink-4)' }}>Custom</span> :
              <>
                <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--ink)' }}>${t.price}</span>
                <span style={{ color: 'var(--ink-5)', fontSize: 13 }}>{t.priceUnit}</span>
                {annual && (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                    color: 'color-mix(in oklab, var(--accent) 75%, black)',
                    padding: '3px 8px', borderRadius: 999,
                    marginLeft: 2,
                  }}>Save 20%</span>
                )}
              </>
              }
            </div>

            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-5)', lineHeight: 1.55, minHeight: 56 }}>{t.blurb}</p>

            <div style={{ fontSize: 12, color: 'var(--ink-5)', marginTop: 8, marginBottom: 20, minHeight: 18 }}>
              {isEnterprise ? ' ' : <>+ 0.5% on Stripe payments</>}
            </div>

            {isEnterprise ?
            <div style={{ width: '100%', textAlign: 'center', padding: '11px 14px', borderRadius: 10, border: '1px dashed var(--line)', color: 'var(--ink-5)', fontSize: 14, fontWeight: 500, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.cta}</div> :
            <a href={t.ctaHref} className={`btn ${t.popular ? 'btn-accent' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>{t.cta}</a>
            }

            <div style={{ borderTop: '1px solid var(--line)', marginTop: 22, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.features.map((f) =>
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                <span style={{
                  display: 'inline-flex', flexShrink: 0,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                  color: 'var(--accent)',
                  alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                {f}
              </div>
              )}
            </div>
          </div>);
        })}
      </div>
    </>
  );
};

const Pricing = () => {
  return (
    <section className="section-divider" id="pricing">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 24px' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 34px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>Free to start. Pay only when you get paid.</h2>
          <p style={{ marginTop: 14, fontSize: 15, color: 'var(--ink-4)', lineHeight: 1.55, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Every tier includes a flat <strong style={{ color: 'var(--ink-2)' }}>0.5%</strong> platform fee on payments processed through Stripe. Check, cash, and external payments are always free.
          </p>
        </div>

        <PricingCards />
      </div>
    </section>);

};

// FAQ
const FAQ = () => {
  const [open, setOpen] = useState(0);
  const items = [
  { q: 'How long does setup take?', a: 'Setup is fast — as long as you have your customer info in some kind of document, you can usually be importing and have automated billing live within an hour. The quickest path is our provided spreadsheet template: many customers paste it into Claude or ChatGPT and have it fill in all of their customer information with no manual data entry. You can also upload a PDF or other document to our AI import, but it\'s limited to one document at a time — it can\'t stitch information together across multiple files.' },
  { q: 'Does it work without internet on the truck?', a: 'The technician app works entirely offline. Every stop and every report is cached on the device and syncs the moment reception comes back.' },
  { q: 'Will you migrate my data from Skimmer or Pooltrackr?', a: 'Free migration is included for every customer, on every tier. We\'ll handle importing all your customers and walk you through any questions you may have. The app is extremely intuitive — most teams are comfortable using it from day one.' },
  { q: 'Do you charge per stop, per service, or per text?', a: 'No per-stop, per-service, or per-text fees. Core is free — you only pay a flat 0.5% on payments processed through Stripe. Check, cash, and external payments are always free. Insight ($39/tech/mo) and Vision ($79/tech/mo) add features like service audits and AI reports. SMS isn\'t available yet — when it launches it\'ll be included on Vision with a fair-use limit so your number doesn\'t get flagged as spam.' },
  { q: 'What payment processors do you support?', a: 'Stripe. All payment processing in PoolLogic runs through Stripe — connect your Stripe account once and you\'re set.' }];

  return (
    <section id="faq" className="section-divider">
      <div id="faq-grid" className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60 }}>
        <div>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 34px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>Questions, before you start.</h2>
          <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-4)', maxWidth: 340 }}>
            Still wondering about something? We usually answer within an hour during US business hours.
          </p>
          <a href="mailto:support@poollogic.app" style={{
            marginTop: 20,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            fontSize: 14, fontWeight: 500, color: 'var(--ink-2)',
            textDecoration: 'none',
            transition: 'border-color .15s ease, background .15s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-6)'; e.currentTarget.style.background = 'var(--bg-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--bg)'; }}>
            Talk to a real human
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) =>
          <div key={i} style={{
            border: '1px solid var(--line)',
            borderRadius: 12,
            background: open === i ? 'var(--bg-soft)' : 'var(--bg)',
            transition: 'background .2s ease, border-color .2s ease',
            borderColor: open === i ? 'var(--ink-6)' : 'var(--line)',
            overflow: 'hidden',
          }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              background: 'transparent', border: 'none', padding: '14px 18px',
              fontSize: 15, fontWeight: 500, color: 'var(--ink)', textAlign: 'left',
              cursor: 'pointer',
            }}>
                <span>{it.q}</span>
                <span style={{
                  display: 'inline-flex', flexShrink: 0,
                  width: 24, height: 24, borderRadius: 6,
                  background: open === i ? 'var(--accent)' : 'var(--bg-muted)',
                  color: open === i ? '#fff' : 'var(--ink-4)',
                  alignItems: 'center', justifyContent: 'center',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform .2s ease, background .2s ease, color .2s ease',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 400 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
                <p style={{ padding: '0 18px 18px', fontSize: 14, lineHeight: 1.65, color: 'var(--ink-3)', margin: 0 }}>{it.a}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

// Migration / switching — closes the "I'm already on X" objection right before pricing.
// Visual hero is a faithful mock of the in-app Import Customers wizard.
const Migration = () => {
  return (
    <section id="switching" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="container">
        <div className="switching-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: 56, alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <h3 style={{ marginTop: 0, letterSpacing: '-0.03em', lineHeight: 1.1, fontSize: 'clamp(28px, 3.2vw, 42px)', fontWeight: 700 }}>
              Switch pool service software in hours, not weeks.
            </h3>
            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.5, maxWidth: 500, color: 'var(--ink-4)', fontWeight: 400 }}>
              Move your customer book, billing rules, and route history in one upload &mdash; CSV, PDF, even a screenshot. Most pool companies can be switched over to PoolLogic in a single afternoon, not a multi-week rollout like other softwares require.
            </p>

            <ol style={{ marginTop: 32, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
              ['Bring your list', 'CSV up to 16,000 customers, or let our AI extract data from a PDF or screenshot.'],
              ['Set billing rules', 'Set first invoice date, payment terms, and chemical billing.'],
              ['You’re live', 'Customers, routes, and automated invoicing is ready to go!']].
              map(([t, d], i) =>
              <li key={i} style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 18,
                alignItems: 'baseline'
              }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    letterSpacing: '0.1em',
                    minWidth: 18
                  }}>{String(i + 1).padStart(2, '0')}</span>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{t}</div>
                    <p style={{ marginTop: 4, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-4)', fontWeight: 400 }}>{d}</p>
                  </div>
                </li>
              )}
            </ol>

            <a href="#cta" style={{
              marginTop: 28,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 15, fontWeight: 600, color: 'var(--accent)',
              textDecoration: 'none',
              transition: 'gap .2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.gap = '12px'}
            onMouseLeave={(e) => e.currentTarget.style.gap = '8px'}>
              Start your migration
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          {/* Import Customers modal mock */}
          <ImportModalMock />
        </div>
      </div>
    </section>);

};

const ImportModalMock = () => {
  const [step, setStep] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);

  const TOTAL_ROWS = 107;

  const downloadTemplate = () => {
    const csv = '"first_name","last_name","email","cc_email","phone","street_address","city","state","zip_code","pool_type (Chlorine / Saltwater)","notes","mrr","billing_cycle (Monthly / Quarterly / Yearly)","technician","day_of_week (Monday-Sunday)","stop_order"\n' +
      '"Jane","Smith","jane@example.com","billing@example.com","(727) 867 5309","123 Maple St","Scottsdale","AZ","85251","","","150","Monthly","John Smith","Monday","1"\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poollogic-customer-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Column format guide — instructive placeholder values are italic + accent.
  const columns = [
  ['first_name', 'Jane', false],
  ['last_name', 'Smith', false],
  ['email', 'jane@example.com', false],
  ['cc_email', 'billing@example.com', false],
  ['phone', '(727) 867 5309', false],
  ['street_address', '123 Maple St', false],
  ['city', 'Phoenix', false],
  ['state', 'AZ', false],
  ['zip_code', '85251', false],
  ['pool_type', 'Chlorine or Saltwater — defaults to Unknown', true],
  ['notes', '—', false],
  ['mrr', '165', false],
  ['billing_cycle', 'Monthly, Quarterly, or Yearly', true]];

  // Fake customer rows for the preview step. Florida-flavored, plausibly fictional.
  const previewRows = [
  { first: 'Maria', last: 'Henderson', addr: '142 Palmetto Ln', city: 'Tampa', state: 'FL', zip: '33605', email: 'maria.h@gmail.com', phone: '(813) 555-0142', mrr: '135.00', billing: 'Monthly', tech: '—', day: '—', order: '—' },
  { first: 'David', last: 'Chen', addr: '88 Magnolia Ct', city: 'St. Petersburg', state: 'FL', zip: '33712', email: 'dchen88@gmail.com', phone: '(727) 555-0188', mrr: '115.00', billing: 'Monthly', tech: '—', day: '—', order: '—' },
  { first: 'Patricia', last: 'Brooks', addr: '4501 Bayshore Rd', city: 'Sarasota', state: 'FL', zip: '34231', email: 'pbrooks@outlook.com', phone: '(941) 555-4501', mrr: '165.00', billing: 'Monthly', tech: 'Sam Davis', day: 'Tuesday', order: '3' },
  { first: 'Marcus', last: 'Holloway', addr: '233 Live Oak Dr', city: 'Brandon', state: 'FL', zip: '33511', email: 'mholloway@yahoo.com', phone: '(813) 555-0233', mrr: '125.00', billing: 'Monthly', tech: 'Sam Davis', day: 'Tuesday', order: '5' },
  { first: 'Rachel', last: 'Kim', addr: '1789 Coral Way', city: 'Clearwater', state: 'FL', zip: '33756', email: 'rkim@gmail.com', phone: '(727) 555-1789', mrr: '145.00', billing: 'Monthly', tech: 'Mike Torres', day: 'Wednesday', order: '1' }];

  const subtitles = {
    1: 'Upload a CSV file to import customers in bulk.',
    2: `Review ${TOTAL_ROWS} customers before importing.`,
    3: `Done — ${TOTAL_ROWS} imported, 0 skipped.`,
    4: 'Configure billing settings for imported customers.'
  };

  return (
    <div style={{ maxWidth: 460, marginLeft: 'auto', marginRight: 0, width: '100%', position: 'relative', zoom: 0.85 }}>

      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-pop)',
        overflow: 'hidden',
        fontFamily: "'Geist', sans-serif",
        position: 'relative'
      }}>
        {/* Subtle green wash on header */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(180deg, color-mix(in oklab, var(--brand-green) 8%, transparent), transparent)',
          pointerEvents: 'none'
        }} />

        <div style={{ padding: 20, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--brand-green)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff'
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              color: 'var(--ink-4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0 }}>Import Customers</h3>
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--ink-5)', margin: '4px 0 0' }}>{subtitles[step]}</p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 7, marginTop: 14,
            visibility: (step === 1 || step === 2) ? 'visible' : 'hidden'
          }}>
              <span style={{
                width: 19, height: 19, borderRadius: '50%',
                background: step === 2 ? 'color-mix(in oklab, var(--brand-green) 25%, transparent)' : 'var(--brand-green)',
                color: step === 2 ? 'var(--brand-green)' : '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600
              }}>1</span>
              <span style={{ width: 26, height: 1, background: 'var(--line)' }} />
              <span style={{
                width: 19, height: 19, borderRadius: '50%',
                background: step >= 2 ? 'var(--brand-green)' : 'var(--bg-muted)',
                color: step >= 2 ? '#fff' : 'var(--ink-5)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600
              }}>2</span>
            </div>
        </div>

        <div style={{ height: 1, background: 'var(--line-2)', margin: '0 20px' }} />

        {/* ============== STEP 1 — UPLOAD ============== */}
        {step === 1 &&
        <div style={{ padding: 18, height: 410, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="upload-dropzone" style={{
            border: '1.5px dashed var(--line)',
            borderRadius: 12,
            padding: '26px 16px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
              <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="15" y2="17"/>
                </svg>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>Drop your file here, or click to browse</div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-5)' }}>CSV, PDF, or image &middot; 5 MB limit</div>

              <div style={{
              marginTop: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              flexWrap: 'wrap'
            }}>
                <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '5px 10px',
                background: 'var(--bg-muted)',
                borderRadius: 999,
                fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)',
                whiteSpace: 'nowrap'
              }}>
                  CSV up to 16,000 customers
                </span>
                <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 10px',
                background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
                borderRadius: 999,
                fontSize: 11.5, fontWeight: 600, color: 'var(--accent)',
                whiteSpace: 'nowrap'
              }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                    <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z"/>
                  </svg>
                  AI varies by document size &amp; format
                </span>
              </div>
            </div>

            {/* Column format guide */}
            <div style={{
            marginTop: 12,
            border: '1px solid var(--line)',
            borderRadius: 10,
            background: 'var(--bg)',
            overflow: 'hidden'
          }}>
              <div onClick={() => setGuideOpen((o) => !o)} style={{
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', userSelect: 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Column format guide
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: guideOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {guideOpen &&
              <div style={{ borderTop: '1px solid var(--line-2)', position: 'relative' }}>
                  <div className="hide-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{
                    borderCollapse: 'collapse',
                    width: 'max-content',
                    fontSize: 11,
                    fontFamily: "'Geist Mono', ui-monospace, monospace"
                  }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-soft)' }}>
                          {columns.map(([h]) =>
                        <th key={h} style={{
                          padding: '8px 12px',
                          textAlign: 'left',
                          color: 'var(--ink-2)',
                          fontWeight: 600,
                          borderRight: '1px solid var(--line-2)',
                          borderBottom: '1px solid var(--line-2)',
                          whiteSpace: 'nowrap'
                        }}>{h}</th>
                        )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {columns.map(([h, v, isPlaceholder]) =>
                        <td key={h} style={{
                          padding: '9px 12px',
                          color: isPlaceholder ? 'var(--accent)' : 'var(--ink-5)',
                          fontStyle: isPlaceholder ? 'italic' : 'normal',
                          borderRight: '1px solid var(--line-2)',
                          whiteSpace: 'nowrap'
                        }}>{v}</td>
                        )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0, width: 40,
                  background: 'linear-gradient(to right, transparent, var(--bg))',
                  pointerEvents: 'none'
                }} />
                </div>
              }
            </div>

            {!guideOpen &&
            <div style={{
              marginTop: 10,
              padding: '12px 14px',
              background: 'var(--bg-soft)',
              border: '1px solid var(--line-2)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Need a template?</div>
                <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--ink-5)' }}>Download a pre-formatted CSV with example data.</div>
              </div>
              <button
              type="button"
              onClick={downloadTemplate}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '6px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'border-color .15s ease, background .15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-6)'; e.currentTarget.style.background = 'var(--bg-soft)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--bg)'; }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download CSV Template
              </button>
            </div>
            }
          </div>
        }

        {/* ============== STEP 2 — PREVIEW ============== */}
        {step === 2 &&
        <div style={{ height: 410, display: 'flex', flexDirection: 'column' }}>
            {/* Header — table title + show all link */}
            <div style={{
            padding: '12px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12
          }}>
              <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 10.5, fontWeight: 600, color: 'var(--ink-5)',
              textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
                <span style={{ whiteSpace: 'nowrap' }}>{TOTAL_ROWS} customers &mdash; click any cell to edit</span>
                <span className="info-tooltip" tabIndex={0}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span className="info-bubble">
                    <strong>Active</strong> customers get a route stop and automated billing. Customers with a billing cycle and MRR are marked active by default. Inactive customers are still imported but won&rsquo;t receive routes or invoices until you activate them from their profile.
                  </span>
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Show all {TOTAL_ROWS}</span>
            </div>

            {/* Table container — bordered card around the scrollable table */}
            <div style={{
            margin: '0 18px 14px',
            border: '1px solid var(--line)',
            borderRadius: 10,
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="hide-scrollbar" style={{
            overflowX: 'auto', WebkitOverflowScrolling: 'touch',
            flex: 1, position: 'relative'
          }}>
              <table style={{ borderCollapse: 'collapse', width: 'max-content', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{
                    width: 44, minWidth: 44, maxWidth: 44, padding: '12px 0',
                    boxSizing: 'border-box', textAlign: 'center',
                    borderBottom: '1px solid var(--line-2)',
                    background: 'var(--bg)',
                    position: 'sticky', left: 0, zIndex: 3
                  }}></th>
                    <th style={{
                    padding: '12px 16px', textAlign: 'center',
                    fontSize: 10, fontWeight: 600, color: 'var(--ink-5)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid var(--line-2)',
                    borderRight: '1px solid var(--line-2)',
                    background: 'var(--bg-muted)',
                    whiteSpace: 'nowrap',
                    position: 'sticky', left: 44, zIndex: 2,
                    boxShadow: 'inset 1px 0 0 var(--line-2)'
                  }}>Active</th>
                    {['First Name', 'Last Name', 'Address', 'City', 'State', 'Zip', 'Email', 'Phone', 'MRR', 'Billing', 'Tech', 'Day', 'Order'].map((h) =>
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)',
                    borderBottom: '1px solid var(--line-2)',
                    borderRight: '1px solid var(--line-2)',
                    background: 'var(--bg-soft)',
                    whiteSpace: 'nowrap'
                  }}>{h}</th>
                  )}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, ri) =>
                <tr key={ri} className="preview-row" style={{ borderTop: ri > 0 ? '1px solid var(--line-2)' : 'none' }}>
                      <td style={{
                    width: 44, minWidth: 44, maxWidth: 44, padding: '14px 0', textAlign: 'center',
                    boxSizing: 'border-box',
                    background: 'var(--bg)',
                    position: 'sticky', left: 0, zIndex: 2
                  }}>
                        <span className="row-trash" style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ef4444', cursor: 'pointer'
                    }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6"/>
                            <path d="M14 11v6"/>
                          </svg>
                        </span>
                      </td>
                      <td style={{
                    padding: '14px 16px', textAlign: 'center',
                    borderRight: '1px solid var(--line-2)',
                    background: 'var(--bg-soft)',
                    position: 'sticky', left: 44, zIndex: 1,
                    boxShadow: 'inset 1px 0 0 var(--line-2)'
                  }}>
                        <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 18, height: 18,
                      background: 'var(--accent)', borderRadius: 5,
                      color: '#fff'
                    }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      </td>
                      {[
                    [row.first, false],
                    [row.last, false],
                    [row.addr, false],
                    [row.city, false],
                    [row.state, false],
                    [row.zip, false],
                    [row.email, false],
                    [row.phone, false],
                    [row.mrr, false],
                    [row.billing, true],
                    [row.tech, false],
                    [row.day, true],
                    [row.order, false]].
                    map(([val, isDropdown], ci) =>
                    <td key={ci} style={{
                      padding: '14px 16px',
                      fontSize: 13, color: 'var(--ink)',
                      borderRight: '1px solid var(--line-2)',
                      whiteSpace: 'nowrap'
                    }}>
                          {isDropdown ?
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              {val}
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                              </svg>
                            </span> :
                      val
                      }
                        </td>
                    )}
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            </div>

            {/* Footer — Back + Import */}
            <div style={{
            padding: '12px 18px',
            background: 'var(--bg-soft)',
            borderTop: '1px solid var(--line-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
              <span style={{ fontSize: 13, color: 'var(--ink-4)', fontWeight: 500, cursor: 'pointer' }}>Back</span>
              <div style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>Import {TOTAL_ROWS} customers</div>
            </div>
          </div>
        }

        {/* ============== STEP 3 — DONE ============== */}
        {step === 3 &&
        <div style={{ padding: 18, height: 410, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
              <div style={{
              padding: '22px 16px',
              textAlign: 'center',
              background: 'color-mix(in oklab, var(--brand-green) 6%, transparent)',
              border: '1px solid color-mix(in oklab, var(--brand-green) 30%, transparent)',
              borderRadius: 12
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'color-mix(in oklab, var(--brand-green) 85%, black)', marginTop: 6, lineHeight: 1 }}>{TOTAL_ROWS}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-green)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>Imported</div>
              </div>
              <div style={{
              padding: '22px 16px',
              textAlign: 'center',
              background: 'var(--bg-soft)',
              border: '1px solid var(--line)',
              borderRadius: 12
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1 }}>0</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>Skipped</div>
              </div>
            </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, paddingTop: 16 }}>
              <div style={{
              padding: '8px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: 'var(--ink-2)'
            }}>Done</div>
              <div onClick={() => setStep(4)} style={{
              padding: '8px 14px',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer'
            }}>Set up billing →</div>
            </div>
          </div>
        }

        {/* ============== STEP 4 — BILLING ============== */}
        {step === 4 &&
        <div style={{ padding: '14px 18px', height: 410, display: 'flex', flexDirection: 'column' }}>
            {/* Summary card */}
            <div style={{
            padding: '10px 12px',
            background: 'var(--bg-soft)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
              <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--brand-green)',
              flexShrink: 0
            }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-2)' }}>Set up billing</div>
                <div style={{ marginTop: 1, fontSize: 11, color: 'var(--ink-5)' }}>Configure billing settings for your imported customers.</div>
                <div style={{ marginTop: 3, fontSize: 10.5, fontWeight: 600, color: 'var(--brand-green)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {TOTAL_ROWS} active with billing
                </div>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                First Invoice Date
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px',
              border: '1px solid var(--line)',
              borderRadius: 7,
              fontSize: 12.5, color: 'var(--ink-2)'
            }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                05/01/2026
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Payment Terms</div>
              <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px',
              border: '1px solid var(--line)',
              borderRadius: 7,
              fontSize: 12.5, color: 'var(--ink-2)'
            }}>
                Net 30 — 30 days
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div style={{ marginTop: 3, fontSize: 11, color: 'var(--ink-5)' }}>Days after invoice is sent before payment is due</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  Chemical Charges
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 13, height: 13, border: '1.5px solid var(--line)', borderRadius: 3, background: 'var(--bg)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Add chemicals to invoice</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 16 }}>
              <div style={{
              padding: '8px 14px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: 'var(--ink-2)'
            }}>Skip</div>
              <div style={{
              padding: '8px 14px',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600
            }}>Apply</div>
            </div>
          </div>
        }
      </div>

      {/* Step indicator — 4 pills under the modal */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
        marginTop: 28
      }}>
        {[1, 2, 3, 4].map((n) =>
        <button
          key={n}
          onClick={() => setStep(n)}
          aria-label={`Go to step ${n}`}
          aria-current={step === n ? 'step' : undefined}
          style={{
            width: step === n ? 56 : 28, height: 6, borderRadius: 999,
            border: 'none', padding: 0,
            background: step === n ? 'var(--ink)' : 'var(--bg-muted)',
            cursor: 'pointer',
            transition: 'width .25s cubic-bezier(.2,.8,.2,1), background .2s ease'
          }} />
        )}
      </div>
    </div>);

};


// Final CTA — uses brand drop colors, more visual interest
const FinalCTA = () =>
<section style={{ paddingTop: 60, paddingBottom: 96 }}>
    <div className="container">
      <div className="final-cta-card" style={{
      position: 'relative',
      borderRadius: 20,
      padding: '56px 48px',
      background: 'radial-gradient(120% 100% at 0% 0%, #1C2B4A 0%, #132038 45%, #0A1628 100%)',
      color: 'white',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,.06)'
    }}>
        {/* Big drop watermark */}
        <svg style={{ position: 'absolute', right: -120, top: -80, opacity: 0.3 }} width="640" height="640" viewBox="0 0 1024 1024" fill="none">
          <defs>
            <linearGradient id="cta-drop" x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0" stopColor="#8BC0FF" stopOpacity="0.6" />
              <stop offset="0.55" stopOpacity="0.4" style={{ stopColor: 'var(--brand-blue)' }} />
              <stop offset="1" stopColor="#1D4ED8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M 490 180 C 490 180, 258 454.4, 258 640 a 232 232 0 0 0 464 0 C 722 454.4, 490 180, 490 180 Z" fill="url(#cta-drop)" />
        </svg>
        {/* Subtle grid */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }} width="100%" height="100%">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>

        <div style={{ position: 'relative', maxWidth: 680 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px', border: '1px solid rgba(255,255,255,.16)', borderRadius: 999, fontSize: 12.5, fontWeight: 500, letterSpacing: '0.01em', color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            <span style={{ display: 'inline-flex', width: 7, height: 7, borderRadius: '50%', background: 'var(--brand-green)', boxShadow: '0 0 0 4px color-mix(in oklab, var(--brand-green) 22%, transparent)' }}></span>
            Built for pool service businesses
          </span>
          <h2 style={{ color: 'white', fontSize: 'clamp(26px, 3.6vw, 40px)', marginTop: 16, letterSpacing: '-0.028em', lineHeight: 1.1 }}>Stop running your business between the route and the desk.</h2>
          <p style={{ marginTop: 16, fontSize: 15.5, color: 'rgba(255,255,255,.75)', lineHeight: 1.55, maxWidth: 520 }}>Bring your customers, routes, and invoices. We'll walk you through PoolLogic on your setup and have you running by the end of the week.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            <a href="/contact" className="btn btn-lg" style={{ background: 'white', color: '#0A1628', border: 'none', fontWeight: 600, textDecoration: 'none' }}>Get a demo<I.arrowR /></a>
          </div>
        </div>
      </div>
    </div>
  </section>;


const FooterLink = ({ label, href }) => (
  <a href={href} style={{
    fontSize: 13, lineHeight: 1.4,
    color: 'var(--ink-5)',
    textDecoration: 'none',
    transition: 'color .15s ease',
    width: 'fit-content',
  }}
    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink-2)'}
    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-5)'}>{label}</a>
);

// Link grid temporarily hidden until destinations are wired. Bottom bar still renders.
const Footer = () =>
<footer style={{ borderTop: '1px solid var(--line)', padding: '24px 0' }}>
    <div className="container footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-5)', gap: 16, flexWrap: 'wrap' }}>
      <span>© {new Date().getFullYear()} PoolLogic. All rights reserved.</span>
      <span>Made for pool pros, by pool pros.</span>
    </div>
  </footer>;

const _Footer = () =>
<footer style={{ borderTop: '1px solid var(--line)', padding: '56px 0 32px' }}>
    <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 32 }}>
      <div>
        <a href="/" aria-label="PoolLogic — home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Logo size={32} />
        </a>
        <p style={{ fontSize: 13, marginTop: 16, maxWidth: 280, lineHeight: 1.55, color: 'var(--ink-5)' }}>The operating system for pool service. Built in St. Petersburg, FL.</p>
        <div style={{
          marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 10px 6px 8px',
          background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 999,
          fontSize: 12, color: 'var(--ink-4)', fontWeight: 500,
        }}>
          <span style={{
            display: 'inline-flex', width: 8, height: 8, borderRadius: '50%',
            background: 'var(--brand-green)',
            boxShadow: '0 0 0 3px color-mix(in oklab, var(--brand-green) 22%, transparent)',
          }}/>
          All systems operational
        </div>
      </div>
      {[
    ['Product', [['Features', '#'], ['Pricing', '#'], ['Mobile app', '#'], ['Integrations', '#'], ['Changelog', '#']]],
    ['Company', [['About', '#'], ['Customers', '#'], ['Careers', '#'], ['Press', '#'], ['Contact', 'mailto:support@poollogic.app']]],
    ['Resources', [['Blog', '#'], ['Help center', '#'], ['Migration', '#'], ['Status', '#'], ['Security', '#']]],
    ['Legal', [['Terms', '/terms'], ['Privacy', '/privacy']]]].
    map(([title, links]) =>
    <div key={title}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {links.map(([label, href]) =>
        <FooterLink key={label} label={label} href={href} />
        )}
          </div>
        </div>
    )}
    </div>
    <div className="container footer-bottom" style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-5)', gap: 16, flexWrap: 'wrap' }}>
      <span>© {new Date().getFullYear()} PoolLogic. All rights reserved.</span>
      <span>Made for pool pros, by pool pros.</span>
    </div>
  </footer>;


export { Nav, Hero, Features, BuiltDifferently, HowItWorks, Stats, Testimonial, Migration, Pricing, PricingCards, FAQ, FinalCTA, Footer };
