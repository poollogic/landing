// Landing page sections

import React, { useState, useEffect, useRef } from 'react';
import { Logo, I } from './icons.jsx';
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
          {['Product', 'Solutions', 'Pricing', 'Customers', 'Resources'].map((l) =>
          <a key={l} href="#" style={{ padding: '8px 14px', color: 'var(--ink-3)', borderRadius: 7 }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{l}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="https://portal.poollogic.app" className="nav-signin" style={{ fontSize: 14, color: 'var(--ink-3)', padding: '8px 12px' }}>Sign in</a>
          <a href="https://portal.poollogic.app" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Start free trial<I.arrowR /></a>
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

      {/* Big product screenshot — separate from hero so it sits below the fold */}
      {!isSplit &&
      <section className="product-section" style={{ paddingTop: 80, paddingBottom: 96, position: 'relative' }}>
        {/* Apple-style orange wash — bleeds ~280px above the section. The mask fades
            the top-third to transparent so there's no hard edge into the hero.
            Intensity dialed down on small viewports via .product-wash CSS rules. */}
        <div className="product-wash" />
        <div className="container">
          {/* Section intro — section header + two parallel claims, then the demo */}
          <div className="product-intro" style={{ maxWidth: 980, margin: '0 auto 56px' }}>
            <h2 style={{ marginTop: 0, textAlign: 'center', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
              Pool service software where every answer is a few clicks away.
            </h2>

            <div className="intro-cols" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 48, marginTop: 36,
              maxWidth: 880, marginLeft: 'auto', marginRight: 'auto',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Built for any size
                </div>
                <p style={{ marginTop: 10, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.55 }}>
                  From 100 customers to 15,000, finding what you need stays a few keystrokes away. Every customer, every invoice, every photo — searchable instantly.
                </p>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Never a tradeoff
                </div>
                <p style={{ marginTop: 10, fontSize: 16, color: 'var(--ink-4)', lineHeight: 1.55 }}>
                  Customer management, billing &amp; invoicing, route planning, service audits — every feature your team relies on lives in one place, built around how real pool companies work.
                </p>
              </div>
            </div>

            {/* Rhetorical question — single search field that types through scenarios one by one */}
            <div style={{
              marginTop: 40,
              display: 'flex', justifyContent: 'center',
            }}>
              <TypingSearchQuery queries={[
                'How many accounts does each technician manage?',
                'Who are my lowest paying customers?',
                'How much recurring revenue is each technician responsible for?',
              ]} />
            </div>

            {/* Kicker — divider lines flanking the answer */}
            <div className="intro-kicker" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
              marginTop: 24,
            }}>
              <span className="intro-kicker-rule" style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(to right, transparent, var(--bg-muted))' }}/>
              <span className="intro-kicker-text" style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                No searching. No spreadsheets. No math. Just answers.
              </span>
              <span className="intro-kicker-rule" style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(to left, transparent, var(--bg-muted))' }}/>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', zoom: 0.85 }}>
            <ProductShowcase />
          </div>
        </div>
      </section>
      }
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
    <button className="btn btn-primary btn-lg">Start 14-day free trial<I.arrowR /></button>
    <button className="btn btn-outline btn-lg">Watch 2-min tour</button>
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
  // Three buckets so the trio always reads as: [trial terms] · [product truth] · [outcome]
  // Phrases trimmed to keep slot widths compact.
  const pools = [
  ['No credit card needed', 'Cancel any time', '14-day free trial', 'Setup in 10 minutes'],
  ['6 nav tabs, not 23', 'Works offline', 'Photos & readings baked in', 'Tickets → quotes in 1 tap'],
  ['Paid 11 days faster', 'Reports clients read', 'Auto chemistry alerts', 'Quotes auto-route to techs']];


  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, [paused]);

  const Check = () =>
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 18, height: 18, borderRadius: '50%',
    background: 'var(--brand-green)', color: '#fff', flexShrink: 0
  }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 6" />
      </svg>
    </span>;


  // A single slot — current phrase rolls in from the right, previous rolls out to the left
  const Slot = ({ pool, offset }) => {
    const i = (tick + offset) % pool.length;
    const prevIRef = useRef(i);
    const isFirstRef = useRef(true);
    const outI = isFirstRef.current ? null : prevIRef.current;

    useEffect(() => {
      isFirstRef.current = false;
      prevIRef.current = i;
    }, [i]);

    const longest = pool.reduce((a, b) => a.length >= b.length ? a : b);

    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 13.5, color: 'var(--ink-3)',
        whiteSpace: 'nowrap'
      }}>
        <Check />
        <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', verticalAlign: 'middle' }}>
          {/* invisible sizer keeps the slot width stable across phrase changes */}
          <span aria-hidden="true" style={{ display: 'block', visibility: 'hidden' }}>{longest}</span>
          {outI !== null && (
            <span
              key={`out-${i}`}
              style={{
                position: 'absolute', inset: 0,
                animation: 'hp-slide-out .55s cubic-bezier(.32,.72,.18,1) forwards'
              }}>
              {pool[outI]}
            </span>
          )}
          <span
            key={`in-${i}`}
            style={{
              position: 'absolute', inset: 0,
              animation: 'hp-slide-in .55s cubic-bezier(.32,.72,.18,1) forwards'
            }}>
            {pool[i]}
          </span>
        </span>
      </span>);

  };

  return (
    <div
      className="hero-proof"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        marginTop: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'flex-start',
        flexWrap: 'wrap',
        rowGap: 10
      }}>

      <Slot pool={pools[0]} offset={0} />
      <span className="hero-proof-sep" style={{ width: 1, height: 14, background: 'var(--line)', margin: '0 18px', display: 'inline-block' }} />
      <Slot pool={pools[1]} offset={1} />
      <span className="hero-proof-sep" style={{ width: 1, height: 14, background: 'var(--line)', margin: '0 18px', display: 'inline-block' }} />
      <Slot pool={pools[2]} offset={2} />
      <style>{`
        /* full-width slide: text actually exits the slot, not a tiny shift + fade */
        @keyframes hp-slide-in {
          0%   { opacity: 0; transform: translateX(100%); }
          15%  { opacity: 0.4; }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes hp-slide-out {
          0%   { opacity: 1; transform: translateX(0); }
          85%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateX(-100%); }
        }
      `}</style>
    </div>);

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
  const [width, setWidth] = useState(compact ? 560 : 1100);
  const containerRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      if (w > 0) {
        setWidth(compact ? Math.min(640, w) : Math.min(1140, w));
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
      maxWidth: compact ? 640 : 1140,
      height: 660 * scale,
      position: 'relative'
    }}>
      <PoolLogicApp scale={scale} />
    </div>);

};

// Features grid — bento-style
const Features = () => {
  return (
    <section className="section-divider" style={{ position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '0 0 auto 0', height: 420, zIndex: -1, pointerEvents: 'none',
        background: 'radial-gradient(900px 320px at 50% 0%, color-mix(in oklab, var(--accent) 4%, transparent), transparent 70%)',
      }} />
      <div className="container">
        <div style={{ maxWidth: 760, margin: '0 auto 64px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(30px, 3.4vw, 44px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--ink)',
            textWrap: 'balance',
          }}>
            One system for every part of the route.
          </h2>
          <p style={{
            marginTop: 18,
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--ink-4)',
            maxWidth: 620,
            marginInline: 'auto',
            textWrap: 'balance',
          }}>
            PoolLogic replaces the patchwork of spreadsheets, paper tickets, and three different apps your techs swipe between every stop. Quote, route, service, report, bill — one record, one source of truth, from the first call to the autopay receipt.
          </p>
        </div>

        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: 'minmax(220px, auto)',
          gap: 14,
        }}>
          <FeatureCard
            span={8} rowSpan={2}
            title="A route plan that re-optimizes overnight."
            body="Drop a stop, swap a tech, mark a pool closed — PoolLogic re-flows the day around it. The optimizer learns your actual time-on-stop, balances mileage against customer windows, and re-runs at 5 AM so every tech opens the app to a route already built."
            footnote="Auto-runs nightly · learns per-tech minutes · supports 12+ trucks">
            <RouteCard />
          </FeatureCard>
          <FeatureCard
            span={4} rowSpan={2}
            title="Reports your customers actually open."
            body="The moment a stop closes, a branded report goes out — chemistry, dosages, photos, tech notes. No end-of-month digest, no chasing, no doubt the pool was serviced."
            footnote="96% open rate · auto-sent on stop close">
            <ServiceReportCard />
          </FeatureCard>
          <FeatureCard
            span={5}
            title="Invoices that fire themselves."
            body="Recurring billing triggers on service completion, not the 30th. Cards on file, Stripe-backed, with a customer portal — so you stop being your own collections department."
            footnote="11 days faster on average">
            <InvoiceCard />
          </FeatureCard>
          <FeatureCard
            span={4}
            title="Catches what the day missed."
            body="An overnight audit surfaces stops missed, photos absent, and chemistry drifting toward out-of-range — before a customer ever notices."
            footnote="Runs every night · zero setup">
            <DashboardCard />
          </FeatureCard>
          <FeatureCard
            span={3}
            title="10,000 customers, one keystroke."
            body="Search by name, address, route, or pool type. One tap from profile to ticket."
            footnote="⌘K from anywhere">
            <DirectoryMini />
          </FeatureCard>
        </div>
      </div>
    </section>);

};

const FeatureCard = ({ span, rowSpan = 1, eyebrow, title, body, footnote, children }) =>
<div className="feature-card" style={{
  gridColumn: `span ${span}`,
  gridRow: `span ${rowSpan}`,
  border: '1px solid var(--line)',
  borderRadius: 16,
  background: 'var(--bg)',
  boxShadow: '0 1px 0 rgba(15, 23, 42, .02), 0 10px 26px -22px rgba(15, 23, 42, .12)',
  display: 'flex', flexDirection: 'column',
  transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--accent) 22%, var(--line))'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(15, 23, 42, .02), 0 20px 32px -22px rgba(15, 23, 42, .18)'; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(15, 23, 42, .02), 0 10px 26px -22px rgba(15, 23, 42, .12)'; }}>
    {/* subtle top highlight — Linear/Vercel trick */}
    <div aria-hidden="true" style={{
      position: 'absolute', inset: '0 0 auto 0', height: 1, zIndex: 1,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)',
    }} />
    <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column' }}>
      {eyebrow && <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        fontWeight: 500,
      }}>{eyebrow}</span>}
      <h3 style={{
        fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em',
        color: 'var(--ink)', lineHeight: 1.2, marginTop: 10,
        textWrap: 'balance',
      }}>{title}</h3>
      <p style={{
        marginTop: 10, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-4)',
        maxWidth: 460,
      }}>{body}</p>
      {footnote && <div style={{
        marginTop: 12, fontSize: 11, color: 'var(--ink-5)',
        fontFamily: "'Geist Mono', monospace", letterSpacing: '-0.005em',
      }}>{footnote}</div>}
    </div>
    {children && <div style={{ marginTop: 18, flex: 1, display: 'flex', alignItems: 'flex-end', padding: '0 24px 24px' }}>
      <div style={{ width: '100%' }}>{children}</div>
    </div>}
  </div>;


// "Built differently" — light surface, asymmetric bento, Tech App as hero.
const BuiltDifferently = () => {
  return (
    <section style={{
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


const DirectoryMini = () => {
  const rows = [
    ['MV', 'Marisol Vega', 'Thu'],
    ['DM', 'Devon Marsh', 'Wed'],
    ['KR', 'Kai Rasmussen', 'Mon'],
    ['PA', 'Priya Anand', 'Tue'],
    ['TA', 'Theo Albright', 'Fri'],
  ];
  return (
    <div style={{
      background: 'linear-gradient(180deg, #fbfbfc 0%, #ffffff 100%)',
      border: '1px solid #ececef',
      borderRadius: 12,
      overflow: 'hidden',
      fontFamily: "'Geist', sans-serif",
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 14px',
        fontSize: 11.5, color: '#a1a1aa',
      }}>
        <I.search />
        <span style={{ flex: 1, color: '#71717a' }}>Search 1,208 customers</span>
        <span style={{
          fontFamily: 'Geist Mono, monospace', fontSize: 9.5,
          color: '#a1a1aa',
          padding: '1px 5px',
          border: '1px solid #ececef',
          borderRadius: 4,
        }}>⌘K</span>
      </div>
      {rows.map(([initials, name, day], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '22px 1fr auto',
          alignItems: 'center', gap: 10,
          padding: '7px 14px',
          fontSize: 12,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'color-mix(in oklab, var(--accent) 8%, #fff)',
            color: 'color-mix(in oklab, var(--accent) 75%, black)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9.5, fontWeight: 600, letterSpacing: '0.02em',
            fontFamily: "'Geist Mono', monospace",
          }}>{initials}</div>
          <span style={{ color: '#18181b', fontWeight: 500 }}>{name}</span>
          <span style={{ color: '#a1a1aa', fontSize: 10.5, fontFamily: "'Geist Mono', monospace" }}>{day}</span>
        </div>
      ))}
    </div>
  );
};


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
const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const tiers = [
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
      'Card surcharge built in — pass card fees to customers, free',
    ],
    cta: 'Get started',
    ctaHref: 'https://portal.poollogic.app',
  },
  {
    name: 'Insight',
    price: annual ? 15 : 19,
    priceUnit: '/tech/mo',
    blurb: 'See exactly where time and gas are leaking.',
    features: [
      'Everything in Core',
      'Route insight scoring',
      'Daily service audit',
      'Operations dashboard',
      'Revenue & MRR analytics',
    ],
    cta: 'Start free trial',
    ctaHref: 'https://portal.poollogic.app',
    popular: true,
  },
  {
    name: 'Vision',
    price: annual ? 31 : 39,
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
    cta: 'Start free trial',
    ctaHref: 'https://portal.poollogic.app',
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

          <div style={{
            margin: '18px auto 0', maxWidth: 560,
            padding: '10px 14px',
            background: 'color-mix(in oklab, var(--brand-green) 8%, var(--bg))',
            border: '1px solid color-mix(in oklab, var(--brand-green) 24%, transparent)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 10,
            textAlign: 'left',
            fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5,
          }}>
            <span style={{
              display: 'inline-flex', width: 22, height: 22,
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--brand-green)', color: '#fff',
              borderRadius: '50%', flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>Charge customers a credit card fee — built in, free.</strong>{' '}
              <span style={{ color: 'var(--ink-4)' }}>Some competitors charge $1/invoice. We don't.</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{
            position: 'relative',
            display: 'inline-flex', padding: 4,
            background: 'var(--bg-muted)',
            border: '1px solid var(--line-2)',
            borderRadius: 999, fontSize: 13,
          }}>
            <span aria-hidden="true" style={{
              position: 'absolute',
              top: 4, bottom: 4,
              left: annual ? 'calc(50% - 2px)' : 4,
              right: annual ? 4 : 'calc(50% - 2px)',
              background: 'var(--bg)',
              borderRadius: 999,
              boxShadow: '0 1px 3px rgba(15, 23, 42, .08), 0 1px 0 rgba(255,255,255,.6) inset',
              transition: 'left .25s cubic-bezier(.2,.8,.2,1), right .25s cubic-bezier(.2,.8,.2,1)',
            }} />
            {[['Monthly', false], ['Annual · save 20%', true]].map(([l, v]) =>
            <button key={l} onClick={() => setAnnual(v)} style={{
              position: 'relative',
              padding: '8px 18px',
              background: 'transparent',
              color: annual === v ? 'var(--ink)' : 'var(--ink-5)',
              border: 'none',
              borderRadius: 999,
              fontWeight: 500,
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
          return (
            <div key={t.name}
              onMouseEnter={(e) => { if (!t.popular && !isEnterprise) { e.currentTarget.style.borderColor = 'var(--ink-6)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px -18px rgba(15, 23, 42, .14)'; } }}
              onMouseLeave={(e) => { if (!t.popular && !isEnterprise) { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 23, 42, .03)'; } }}
              style={{
              border: t.popular ? '1.5px solid var(--accent)' : '1px solid var(--line)',
              borderRadius: 14,
              padding: 20,
              background: t.popular ? 'linear-gradient(180deg, color-mix(in oklab, var(--accent) 5%, var(--bg)) 0%, var(--bg) 55%)' : 'var(--bg)',
              position: 'relative',
              boxShadow: t.popular ? '0 24px 48px -24px color-mix(in oklab, var(--accent) 42%, transparent), 0 1px 0 rgba(255,255,255,.6) inset' : '0 1px 2px rgba(15, 23, 42, .03)',
              opacity: isEnterprise ? 0.85 : 1,
              display: 'flex', flexDirection: 'column',
              transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease'
            }}>
              {t.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--accent)', color: 'white', padding: '5px 14px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 12px -4px color-mix(in oklab, var(--accent) 45%, transparent)' }}>Most popular</div>}
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>{t.name}</h3>
              <p style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-5)', lineHeight: 1.5, minHeight: 58 }}>{t.blurb}</p>

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 6, minHeight: 56 }}>
                {t.price === 0 ?
                <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)' }}>Free</span> :
                t.price === null ?
                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink-4)' }}>Custom</span> :
                <>
                  <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)' }}>${t.price}</span>
                  <span style={{ color: 'var(--ink-5)', fontSize: 13 }}>{t.priceUnit}</span>
                </>
                }
              </div>

              <div style={{ fontSize: 12, color: 'var(--ink-5)', marginBottom: 16, minHeight: 18 }}>
                {isEnterprise ? ' ' : <>+ 0.5% on Stripe payments</>}
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
  { q: 'Do you charge per stop, per service, or per text?', a: 'No per-stop, per-service, or per-text fees. Core is free — you only pay a flat 0.5% on payments processed through Stripe. Check, cash, and external payments are always free. Insight ($19/tech/mo) and Vision ($39/tech/mo) add features like service audits and AI reports. SMS isn\'t available yet — when it launches it\'ll be included on Vision with a fair-use limit so your number doesn\'t get flagged as spam.' },
  { q: 'What payment processors do you support?', a: 'Stripe. All payment processing in PoolLogic runs through Stripe — connect your Stripe account once and you\'re set.' }];

  return (
    <section className="section-divider">
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
              ['Set billing rules', 'Set first invoice date, payment terms, optional credit card fees & chemical billing.'],
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  CC Processing Fee
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 13, height: 13, border: '1.5px solid var(--line)', borderRadius: 3, background: 'var(--bg)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Pass 2.9% fee</span>
                </div>
                <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--accent)', fontWeight: 500, cursor: 'pointer' }}>Change rate</div>
              </div>
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
            14-day free trial · No credit card required
          </span>
          <h2 style={{ color: 'white', fontSize: 'clamp(26px, 3.6vw, 40px)', marginTop: 16, letterSpacing: '-0.028em', lineHeight: 1.1 }}>Stop running your business between the route and the desk.</h2>
          <p style={{ marginTop: 16, fontSize: 15.5, color: 'rgba(255,255,255,.75)', lineHeight: 1.55, maxWidth: 520 }}>Bring your customers, routes, and invoices. We'll have you running by tomorrow morning — and we won't charge you a cent until you say so.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            <a href="https://portal.poollogic.app" className="btn btn-lg" style={{ background: 'white', color: '#0A1628', border: 'none', fontWeight: 600, textDecoration: 'none' }}>Start free trial<I.arrowR /></a>
            <a href="mailto:support@poollogic.app?subject=PoolLogic%20demo%20request" className="btn btn-lg" style={{ background: 'rgba(255,255,255,.06)', color: 'white', border: '1px solid rgba(255,255,255,.18)', textDecoration: 'none' }}>Book a 20-min demo</a>
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

const Footer = () => null; // temporarily hidden — restore by removing this line
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


export { Nav, Hero, Features, BuiltDifferently, HowItWorks, Stats, Testimonial, Migration, Pricing, FAQ, FinalCTA, Footer };