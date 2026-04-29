// Landing page sections

const { useState, useEffect, useRef } = React;

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
        <Logo size={scrolled ? 28 : 38} gap={6} fontSize={scrolled ? 18 : 21} />
        <div className="nav-links" style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 14, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {['Product', 'Solutions', 'Pricing', 'Customers', 'Resources'].map((l) =>
          <a key={l} href="#" style={{ padding: '8px 14px', color: 'var(--ink-3)', borderRadius: 7 }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{l}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="#" className="nav-signin" style={{ fontSize: 14, color: 'var(--ink-3)', padding: '8px 12px' }}>Sign in</a>
          <button className="btn btn-primary btn-sm">Start free trial<I.arrowR /></button>
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
      <section style={{
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
            <div style={{ textAlign: (isCenter || isStacked) ? 'center' : 'left', maxWidth: isCenter ? 880 : 820, margin: (isCenter || isStacked) ? '0 auto' : 0, position: 'relative', zIndex: 1 }} className="rise">
              <HeroAuthorityStrip centered={isCenter || isStacked}/>
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
      <section style={{ paddingTop: 80, paddingBottom: 96, position: 'relative' }}>
        {/* Apple-style orange wash — bleeds ~280px above the section. The mask fades
            the top-third to transparent so there's no hard edge into the hero.
            Intensity dialed down on small viewports via .product-wash CSS rules. */}
        <div className="product-wash" />
        <div className="container">
          {/* Section intro — frames the demo and carries the SEO keyword */}
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <h2 style={{ marginTop: 0 }}>Pool service software where every answer is a few clicks away.</h2>

            <p style={{ fontSize: 17, color: 'var(--ink-4)', marginTop: 22, lineHeight: 1.55, maxWidth: 660, marginLeft: 'auto', marginRight: 'auto' }}>
              Whether your pool company services 100 customers a week or 15,000, finding what you need stays effortless. PoolLogic is pool service software built around how real pool companies work — customer management, billing &amp; invoicing, and route management without trimming a single feature your team relies on.
            </p>

            {/* Rhetorical question — single search field that types through scenarios one by one */}
            <div style={{
              marginTop: 36,
              display: 'flex', justifyContent: 'center',
            }}>
              <TypingSearchQuery queries={[
                'How many accounts does each technician manage?',
                'Who are my lowest paying customers?',
                'How much recurring revenue is each technician responsible for?',
              ]} />
            </div>

            {/* Kicker — divider lines flanking the answer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
              marginTop: 28,
            }}>
              <span style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(to right, transparent, var(--bg-muted))' }}/>
              <span style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                No searching. No spreadsheets. No math. Just answers.
              </span>
              <span style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(to left, transparent, var(--bg-muted))' }}/>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      <span style={{ flex: 1, fontSize: 15, color: 'var(--ink-3)', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip' }}>
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
    <div style={{
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
  const [head, setHead] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
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
  const containerRef = React.useRef(null);

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

const LogoStrip = () =>
<section className="tight" style={{ paddingTop: 8, paddingBottom: 56 }}>
    <div className="container">
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 28, fontWeight: 500 }}>
        Trusted by 4,200+ pool service businesses
      </div>
      <div className="logo-strip-grid" style={{
      display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 32, alignItems: 'center', justifyItems: 'center',
      opacity: 0.65
    }}>
        {['SunCoast Pools', 'BlueWave Co.', 'Crystal Pools', 'Aqua Pro', 'Splash Service', 'PoolHaus'].map((n, i) =>
      <div key={i} style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-4)', fontFamily: i % 2 ? 'Instrument Serif, serif' : 'Geist, sans-serif', fontStyle: i % 3 === 0 ? 'italic' : 'normal' }}>{n}</div>
      )}
      </div>
    </div>
  </section>;


// Features grid — bento-style
const Features = () => {
  return (
    <section className="section-divider">
      <div className="container">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="eyebrow"><span className="dot"></span>Everything in one place</span>
          <h2 style={{ marginTop: 14 }}>The operating system for pool service.</h2>
          <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.55 }}>From the customer directory to the truck, every part of your day flows through PoolLogic. No spreadsheets. No paper tickets. No double-entry.</p>
        </div>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
          {/* Big card — Routes */}
          <FeatureCard span={4} title="Routes that route themselves" body="Drag-and-drop optimization across stops, techs and trucks. Route insight scores every shift so you can see exactly where time and gas are leaking." icon={<I.map />}>
            <RouteCard />
          </FeatureCard>
          <FeatureCard span={2} title="Service reports your customers actually read" body="Auto-attached photos, water chemistry, tech notes — sent the moment a stop is closed." icon={<I.droplet />}>
            <ServiceReportCard />
          </FeatureCard>
          <FeatureCard span={2} title="Invoices on autopilot" body="Recurring billing fires after service, not after end-of-month. Get paid 11 days faster on average." icon={<I.receipt />}>
            <InvoiceCard />
          </FeatureCard>
          <FeatureCard span={2} title="Service audit, daily" body="Stops missed, photos missing, chemistry drift — surfaced before a customer notices." icon={<I.shield />}>
            <DashboardCard />
          </FeatureCard>
          <FeatureCard span={2} title="A directory that scales" body="Search 10,000+ customers in under a second. Routed and unrouted views. One-tap profile to ticket." icon={<I.customers />}>
            <DirectoryMini />
          </FeatureCard>
        </div>
      </div>
    </section>);

};

const FeatureCard = ({ span, title, body, icon, children }) =>
<div className="feature-card" style={{
  gridColumn: `span ${span}`,
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: 24,
  background: 'var(--bg)',
  display: 'flex', flexDirection: 'column',
  transition: 'all .2s'
}}
onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--ink-6)';e.currentTarget.style.transform = 'translateY(-2px)';}}
onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--line)';e.currentTarget.style.transform = 'none';}}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', marginBottom: 12 }}>
      <span style={{ display: 'inline-flex', width: 32, height: 32, borderRadius: 8, background: 'color-mix(in oklab, var(--accent) 12%, transparent)', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
    </div>
    <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</h3>
    <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-4)' }}>{body}</p>
    {children && <div style={{ marginTop: 20, flex: 1, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%' }}>{children}</div>
    </div>}
  </div>;


const DirectoryMini = () =>
<div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 10, overflow: 'hidden', fontFamily: "'Geist', sans-serif" }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid #f1f1f3', fontSize: 12, color: '#71717a' }}>
      <I.search /> Search 1,208 customers
      <span style={{ marginLeft: 'auto', fontFamily: 'Geist Mono, monospace', fontSize: 10, background: '#fafafa', border: '1px solid #e4e4e7', padding: '1px 5px', borderRadius: 4 }}>⌘K</span>
    </div>
    {[['Marisol V.', 'Thursday', 'var(--brand-green)'], ['Devon Marsh', 'Wednesday', 'var(--brand-teal)'], ['Kai Rasmussen', 'Monday', 'var(--brand-orange)']].map(([n, d, c], i) =>
  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: i < 2 ? '1px solid #f4f4f5' : 'none', fontSize: 13 }}>
        <span style={{ color: '#18181b' }}>{n}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#71717a', fontSize: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }}></span>{d}
        </span>
      </div>
  )}
  </div>;


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
          <span className="eyebrow"><span className="dot"></span>Deep dive</span>
          <h2 style={{ marginTop: 14 }}>Look closer at what actually runs your day.</h2>
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
            <span className="eyebrow"><span className="dot"></span>A day on PoolLogic</span>
            <h2 style={{ marginTop: 14 }}>From route plan to deposit, without you in the loop.</h2>
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

// Pricing
const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const tiers = [
  { name: 'Starter', price: annual ? 39 : 49, blurb: 'For solo techs and 1-truck shops finding their feet.', features: ['Up to 80 customers', 'Routes, reports & invoicing', 'On-truck app', 'Email support'], cta: 'Start free trial' },
  { name: 'Vision', price: annual ? 89 : 109, blurb: 'For growing operations that need every day to add up.', features: ['Unlimited customers', 'Route insight + service audit', 'Recurring autopay & ACH', 'AI-drafted reports', 'Priority support'], cta: 'Start free trial', popular: true },
  { name: 'Fleet', price: annual ? 199 : 239, blurb: 'For multi-route, multi-tech, multi-region businesses.', features: ['Everything in Vision', 'Multi-region routing', 'Custom roles & approvals', 'API + webhooks', 'Dedicated success manager'], cta: 'Talk to sales' }];

  return (
    <section className="section-divider" id="pricing">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <span className="eyebrow"><span className="dot"></span>Pricing</span>
          <h2 style={{ marginTop: 14 }}>One flat price per truck. No per-stop nickel-and-diming.</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', padding: 4, background: 'var(--bg-muted)', borderRadius: 999, fontSize: 13 }}>
            {[['Monthly', false], ['Annual · save 20%', true]].map(([l, v]) =>
            <button key={l} onClick={() => setAnnual(v)} style={{
              padding: '7px 16px',
              background: annual === v ? 'var(--bg)' : 'transparent',
              color: annual === v ? 'var(--ink)' : 'var(--ink-5)',
              border: 'none',
              borderRadius: 999,
              fontWeight: 500,
              boxShadow: annual === v ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
              transition: 'all .15s'
            }}>{l}</button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {tiers.map((t) =>
          <div key={t.name} style={{
            border: t.popular ? '1.5px solid var(--accent)' : '1px solid var(--line)',
            borderRadius: 16,
            padding: 28,
            background: 'var(--bg)',
            position: 'relative',
            boxShadow: t.popular ? '0 20px 40px -20px color-mix(in oklab, var(--accent) 35%, transparent)' : 'none'
          }}>
              {t.popular && <div style={{ position: 'absolute', top: -11, left: 28, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--accent)', color: 'white', padding: '3px 10px', borderRadius: 999 }}>Most popular</div>}
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>{t.name}</h3>
              <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--ink-5)', lineHeight: 1.5, minHeight: 42 }}>{t.blurb}</p>
              <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)' }}>${t.price}</span>
                <span style={{ color: 'var(--ink-5)', fontSize: 14 }}>/truck/mo</span>
              </div>
              <button className={`btn ${t.popular ? 'btn-accent' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}>{t.cta}</button>
              <div style={{ borderTop: '1px solid var(--line)', marginTop: 22, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {t.features.map((f) =>
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--ink-3)' }}>
                    <span style={{ color: 'var(--accent)', marginTop: 2 }}><I.check /></span>{f}
                  </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

// FAQ
const FAQ = () => {
  const [open, setOpen] = useState(0);
  const items = [
  { q: 'How long does setup take?', a: 'Most shops are running their first route within an hour. Import customers from a CSV, QuickBooks, or your existing tool — we handle the mapping.' },
  { q: 'Does it work without internet on the truck?', a: 'Yes. The on-truck app stores stops, chemistry readings, and photos locally and syncs the moment you\'re back on signal. No service report ever gets lost.' },
  { q: 'Will you migrate my data from Skimmer or Pooltrackr?', a: 'Free migration is included on Vision and Fleet. Send us an export and we\'ll have your customers, routes, and recurring invoices live within 48 hours.' },
  { q: 'Do you charge per stop, per service, or per text?', a: 'No. PoolLogic is one flat price per truck — including unlimited customer texts, service reports, and invoices.' },
  { q: 'What payment processors do you support?', a: 'Stripe and ACH are built in. We also pass through to Square, QuickBooks Payments, and Authorize.net if you already have a relationship.' }];

  return (
    <section className="section-divider">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60 }}>
        <div>
          <span className="eyebrow"><span className="dot"></span>FAQ</span>
          <h2 style={{ marginTop: 14 }}>Questions, before you start.</h2>
          <p style={{ marginTop: 16 }}>Still wondering about something? <a href="#" style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: 3 }}>Talk to a real human</a> — usually answers within an hour during US business days.</p>
        </div>
        <div>
          {items.map((it, i) =>
          <div key={i} style={{ borderTop: '1px solid var(--line)', borderBottom: i === items.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'transparent', border: 'none', padding: '20px 0',
              fontSize: 17, fontWeight: 500, color: 'var(--ink)', textAlign: 'left'
            }}>
                {it.q}
                <span style={{ color: 'var(--ink-5)', transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .2s' }}><I.plus /></span>
              </button>
              <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
                <p style={{ paddingBottom: 20, fontSize: 15, lineHeight: 1.6, maxWidth: 580 }}>{it.a}</p>
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
    <section className="section-divider" id="switching">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: 56, alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <h2 style={{ marginTop: 0, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
              Switch in less time than it takes to do a <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.015em' }}>route</span>.
            </h2>
            <p style={{ marginTop: 22, fontSize: 17, lineHeight: 1.5, maxWidth: 500, color: 'var(--ink-4)', fontWeight: 400 }}>
              Move your full customer book over in one upload &mdash; CSV, PDF, or even a screenshot. We&rsquo;re proud to say we have the fastest setups in the pool software space.
            </p>

            <ol style={{ marginTop: 48, padding: 0, listStyle: 'none' }}>
              {[
              ['Bring your list', 'CSV up to 5,000 customers, or let our AI extract data from a PDF or screenshot.'],
              ['Set billing rules', 'First invoice date, card fees, chemical billing.'],
              ['You’re live', 'Routes, history, and invoices ready before your next stop.']].
              map(([t, d], i) =>
              <li key={i} style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr',
                gap: 24,
                padding: '22px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--line-2)',
                alignItems: 'baseline'
              }}>
                  <span style={{
                  fontSize: 11.5, fontWeight: 500,
                  color: 'var(--ink-5)',
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  letterSpacing: '0.06em'
                }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.015em' }}>{t}</div>
                    <p style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-4)', fontWeight: 400 }}>{d}</p>
                  </div>
                </li>
              )}
            </ol>

            <a href="#cta" style={{
              marginTop: 40,
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
  ['Maria Henderson', '142 Palmetto Ln, Tampa, FL', 'maria.h@gmail.com', '(813) 555-0142', 'Saltwater', '$135.00'],
  ['David Chen', '88 Magnolia Ct, St. Pete, FL', 'dchen88@gmail.com', '(727) 555-0188', 'Chlorine', '$115.00'],
  ['Patricia Brooks', '4501 Bayshore Rd, Sarasota', 'pbrooks@outlook.com', '(941) 555-4501', 'Saltwater', '$165.00'],
  ['Marcus Holloway', '233 Live Oak Dr, Brandon', 'mholloway@yahoo.com', '(813) 555-0233', 'Chlorine', '$125.00'],
  ['Rachel Kim', '1789 Coral Way, Clearwater', 'rkim@gmail.com', '(727) 555-1789', 'Saltwater', '$145.00']];

  const subtitles = {
    1: 'Upload a CSV file to import customers in bulk.',
    2: `Previewing up to 5 of ${TOTAL_ROWS} rows.`,
    3: `Done — ${TOTAL_ROWS} imported, 0 skipped.`,
    4: 'Configure billing settings for imported customers.'
  };

  return (
    <div style={{ maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      {/* Flash-card nav: prev/next arrows with step label */}
      <div style={{
        marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14
      }}>
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          aria-label="Previous step"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'var(--bg)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: step === 1 ? 'default' : 'pointer',
            opacity: step === 1 ? 0.35 : 1,
            transition: 'transform .15s ease, box-shadow .15s ease, background .15s',
            color: 'var(--ink-2)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, .04)',
            padding: 0
          }}
          onMouseEnter={(e) => { if (step !== 1) { e.currentTarget.style.transform = 'translateX(-2px)'; e.currentTarget.style.background = 'var(--bg-soft)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--bg)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 8,
          minWidth: 130, justifyContent: 'center'
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-2)' }}>
            {{ 1: 'Upload', 2: 'Preview', 3: 'Done', 4: 'Billing' }[step]}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-5)', fontFamily: "'Geist Mono', ui-monospace, monospace" }}>
            {step} / 4
          </span>
        </div>

        <button
          onClick={() => setStep((s) => Math.min(4, s + 1))}
          disabled={step === 4}
          aria-label="Next step"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'var(--bg)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: step === 4 ? 'default' : 'pointer',
            opacity: step === 4 ? 0.35 : 1,
            transition: 'transform .15s ease, box-shadow .15s ease, background .15s',
            color: 'var(--ink-2)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, .04)',
            padding: 0
          }}
          onMouseEnter={(e) => { if (step !== 4) { e.currentTarget.style.transform = 'translateX(2px)'; e.currentTarget.style.background = 'var(--bg-soft)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--bg)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

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

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14 }}>
            {[1, 2, 3, 4].map((n, i) =>
            <React.Fragment key={n}>
                {i > 0 && <span style={{ width: 26, height: 1, background: 'var(--line)' }} />}
                <span style={{
                width: 19, height: 19, borderRadius: '50%',
                background: step === n
                ? 'var(--brand-green)'
                : step > n
                ? 'color-mix(in oklab, var(--brand-green) 25%, transparent)'
                : 'var(--bg-muted)',
                color: step === n ? '#fff' : step > n ? 'var(--brand-green)' : 'var(--ink-5)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600
              }}>{n}</span>
              </React.Fragment>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--line-2)', margin: '0 20px' }} />

        {/* ============== STEP 1 — UPLOAD ============== */}
        {step === 1 &&
        <div style={{ padding: 20, minHeight: 360, display: 'flex', flexDirection: 'column' }}>
            <div style={{
            border: '1.5px dashed var(--line)',
            borderRadius: 12,
            padding: '26px 16px',
            textAlign: 'center'
          }}>
              <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--bg-muted)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12
            }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="15" y2="17"/>
                </svg>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>Drop your CSV here, or click to browse</div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-5)' }}>Max 5,000 rows &middot; 5 MB limit</div>

              <div style={{
              marginTop: 14,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 10px',
              background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
              border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
              borderRadius: 999,
              fontSize: 11.5, fontWeight: 600, color: 'var(--accent)',
              whiteSpace: 'nowrap'
            }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                  <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z"/>
                </svg>
                AI extract from PDF or screenshot
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
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
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
              <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 12px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
              whiteSpace: 'nowrap'
            }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download CSV Template
              </div>
            </div>
          </div>
        }

        {/* ============== STEP 2 — PREVIEW ============== */}
        {step === 2 &&
        <div style={{ padding: 20, minHeight: 360, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
              First 5 of {TOTAL_ROWS} rows
            </div>
            <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-soft)' }}>
                      {['Name', 'Address', 'Email', 'Phone', 'Pool Type', 'MRR'].map((h, i) =>
                    <th key={h} style={{
                      padding: '8px 12px',
                      textAlign: i === 5 ? 'right' : 'left',
                      color: 'var(--ink-5)',
                      fontWeight: 600,
                      borderBottom: '1px solid var(--line-2)',
                      whiteSpace: 'nowrap',
                      fontSize: 11
                    }}>{h}</th>
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, ri) =>
                  <tr key={ri} style={{ borderBottom: ri < previewRows.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                        {row.map((cell, ci) =>
                    <td key={ci} style={{
                      padding: '10px 12px',
                      color: ci === 0 ? 'var(--ink-2)' : 'var(--ink-4)',
                      fontWeight: ci === 0 ? 600 : 400,
                      textAlign: ci === 5 ? 'right' : 'left',
                      whiteSpace: 'nowrap',
                      maxWidth: ci === 1 || ci === 2 ? 140 : undefined,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{cell}</td>
                    )}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: 32,
              background: 'linear-gradient(to right, transparent, var(--bg))',
              pointerEvents: 'none'
            }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--ink-5)' }}>
              ...and {TOTAL_ROWS - previewRows.length} more rows
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16 }}>
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
        <div style={{ padding: 20, minHeight: 360, display: 'flex', flexDirection: 'column' }}>
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
        <div style={{ padding: 20, minHeight: 360, display: 'flex', flexDirection: 'column' }}>
            {/* Summary card */}
            <div style={{
            padding: '12px 14px',
            background: 'var(--bg-soft)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 12
          }}>
              <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--brand-green)',
              flexShrink: 0
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>Set up billing</div>
                <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--ink-5)' }}>Configure billing for the {TOTAL_ROWS} imported customers.</div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>First Invoice Date</div>
              <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px',
              border: '1px solid var(--line)',
              borderRadius: 8,
              fontSize: 13, color: 'var(--ink-2)'
            }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                05/01/2026
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Payment Terms</div>
              <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px',
              border: '1px solid var(--line)',
              borderRadius: 8,
              fontSize: 13, color: 'var(--ink-2)'
            }}>
                Net 30 — 30 days
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 12 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>CC Processing Fee</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 13, height: 13, border: '1.5px solid var(--line)', borderRadius: 3, background: 'var(--bg)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Pass 2% fee</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Chemical Charges</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 13, height: 13, border: '1.5px solid var(--line)', borderRadius: 3, background: 'var(--bg)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Add to invoice</span>
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
    </div>);

};


// Final CTA — uses brand drop colors, more visual interest
const FinalCTA = () =>
<section style={{ paddingTop: 60, paddingBottom: 96 }}>
    <div className="container">
      <div style={{
      position: 'relative',
      borderRadius: 24,
      padding: '80px 64px',
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', border: '1px solid rgba(255,255,255,.18)', borderRadius: 999, fontSize: 12, color: 'rgba(255,255,255,.85)', background: 'rgba(255,255,255,.04)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-green)' }}></span>
            14-day free trial · No credit card required
          </span>
          <h2 style={{ color: 'white', fontSize: 'clamp(36px, 4.4vw, 56px)', marginTop: 20, letterSpacing: '-0.03em', lineHeight: 1.05 }}>Stop running your business<br />between the route and the desk.</h2>
          <p style={{ marginTop: 22, fontSize: 18, color: 'rgba(255,255,255,.75)', lineHeight: 1.55, maxWidth: 560 }}>Bring your customers, routes, and invoices. We'll have you running by tomorrow morning — and we won't charge you a cent until you say so.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
            <button className="btn btn-lg" style={{ background: 'white', color: '#0A1628', border: 'none', fontWeight: 600 }}>Start free trial<I.arrowR /></button>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.06)', color: 'white', border: '1px solid rgba(255,255,255,.18)' }}>Book a 20-min demo</button>
          </div>
        </div>
      </div>
    </div>
  </section>;


const Footer = () =>
<footer style={{ borderTop: '1px solid var(--line)', padding: '48px 0 36px' }}>
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 32 }}>
      <div>
        <Logo size={32} />
        <p style={{ fontSize: 13, marginTop: 16, maxWidth: 280, lineHeight: 1.55 }}>The operating system for pool service. Built in St. Petersburg, FL.</p>
      </div>
      {[
    ['Product', ['Features', 'Pricing', 'Mobile app', 'Integrations', 'Changelog']],
    ['Company', ['About', 'Customers', 'Careers', 'Press', 'Contact']],
    ['Resources', ['Blog', 'Help center', 'Migration', 'Status', 'Security']],
    ['Legal', ['Terms', 'Privacy', 'DPA', 'Cookies']]].
    map(([title, links]) =>
    <div key={title}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>{title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {links.map((l) => <a key={l} href="#" style={{ fontSize: 13, color: 'var(--ink-5)' }}>{l}</a>)}
          </div>
        </div>
    )}
    </div>
    <div className="container" style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-5)' }}>
      <span>© 2026 PoolLogic, Inc.</span>
      <span>Made for pool pros, by pool pros.</span>
    </div>
  </footer>;


Object.assign(window, { Nav, Hero, LogoStrip, Features, HowItWorks, Stats, Testimonial, Migration, Pricing, FAQ, FinalCTA, Footer });