import React, { useState, useEffect, useRef } from 'react';
import { I, Logo } from './icons.jsx';

// Recreates the PoolLogic Customer Directory shown in the brief screenshot.
// Used as the hero product visual and as fragments in feature sections.

const SidebarItem = ({ icon, label, active, badge }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '7px 10px',
    fontSize: 13,
    color: active ? 'var(--accent)' : 'var(--ink-4)',
    fontWeight: active ? 500 : 400,
    cursor: 'pointer',
  }}>
    <span style={{ display: 'inline-flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
    <span>{label}</span>
    {badge && <span style={{ marginLeft: 'auto', fontSize: 10, background: 'var(--bg-muted)', padding: '2px 6px', borderRadius: 4, color: 'var(--ink-5)' }}>{badge}</span>}
  </div>
);

const SidebarGroup = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    {title && <div style={{ fontSize: 11, color: 'var(--ink-6)', padding: '0 10px 8px', fontWeight: 500 }}>{title}</div>}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</div>
  </div>
);

// Dummy customer rows
const customers = [
  { name: 'Marisol Vega', addr: '2240 Bayshore Blvd, Tampa', phone: '(813) 555-0142', email: 'mvega@example.com', day: 'Thursday', mrr: '$120.00', dot: 'var(--brand-green)' },
  { name: 'Trevor Cline', addr: '418 Beachside Way, Clearwater', phone: '(727) 555-0188', email: 'tcline@example.com', day: 'Thursday', mrr: '$120.00', dot: 'var(--brand-green)' },
  { name: 'Priya Anand', addr: '1907 Palm Hammock Dr, Sarasota', phone: '(941) 555-0173', email: 'panand@example.com', day: 'Thursday', mrr: '$145.00', dot: 'var(--brand-green)' },
  { name: 'Devon Marsh', addr: '5512 Mangrove Ln, St. Petersburg', phone: '(727) 555-0119', email: 'dmarsh@example.com', day: 'Wednesday', mrr: '$145.00', dot: 'var(--brand-green)' },
  { name: 'Lena Okafor', addr: '3204 Coquina Ct, Naples', phone: '(239) 555-0156', email: 'lokafor@example.com', day: 'Thursday', mrr: '$125.00', dot: 'var(--brand-green)' },
  { name: 'Kai Rasmussen', addr: '8810 Tarpon Cove, Cape Coral', phone: '(239) 555-0107', email: 'krasmussen@example.com', day: 'Monday', mrr: '$140.00', dot: 'var(--brand-green)' },
];

// Customers assigned to Tyler Bennett — shown when his filter is active
const tylerCustomers = [
  { name: 'Bryce Hadley', addr: '8412 Sandpiper Cir, Tampa', phone: '(813) 555-0291', email: 'bhadley@example.com', day: 'Tuesday', mrr: '$135.00', dot: 'var(--brand-green)' },
  { name: 'Kira Velasquez', addr: '2301 Coastal Hwy, Clearwater', phone: '(727) 555-0167', email: 'kvelasquez@example.com', day: 'Tuesday', mrr: '$155.00', dot: 'var(--brand-green)' },
  { name: 'Owen Brennan', addr: '145 Saltgrass Ln, Tampa', phone: '(813) 555-0312', email: 'obrennan@example.com', day: 'Tuesday', mrr: '$120.00', dot: 'var(--brand-green)' },
  { name: 'Maya Chen', addr: '6720 Inlet Rd, Tampa', phone: '(813) 555-0184', email: 'mchen@example.com', day: 'Friday', mrr: '$140.00', dot: 'var(--brand-green)' },
  { name: 'Jasper Quinn', addr: '3018 Driftwood Way, Tampa', phone: '(813) 555-0259', email: 'jquinn@example.com', day: 'Friday', mrr: '$125.00', dot: 'var(--brand-green)' },
  { name: 'Ines Romero', addr: '9214 Reef Point Dr, Clearwater', phone: '(727) 555-0140', email: 'iromero@example.com', day: 'Tuesday', mrr: '$160.00', dot: 'var(--brand-green)' },
];

// Tyler's lowest-paying customers — surfaced when the user sorts by MRR ascending.
// Frame this as "candidates to renegotiate or churn" — realistic pool company evaluation.
const tylerCustomersLowMrr = [
  { name: 'Dario Mendez', addr: '4118 Sago Palm Dr, Brandon', phone: '(813) 555-0204', email: 'dmendez@example.com', day: 'Tuesday', mrr: '$92.00', dot: 'var(--brand-green)' },
  { name: 'Imani Brooks', addr: '627 Magnolia Bend, Riverview', phone: '(813) 555-0177', email: 'ibrooks@example.com', day: 'Friday', mrr: '$95.00', dot: 'var(--brand-green)' },
  { name: 'Pete Donovan', addr: '8830 Autumn Glen Ct, Wesley Chapel', phone: '(813) 555-0269', email: 'pdonovan@example.com', day: 'Tuesday', mrr: '$98.50', dot: 'var(--brand-green)' },
  { name: 'Nadia Schaffer', addr: '207 Lakeview Ter, Lutz', phone: '(813) 555-0331', email: 'nschaffer@example.com', day: 'Friday', mrr: '$99.00', dot: 'var(--brand-green)' },
  { name: 'Roan Calloway', addr: '4516 Cedar Bend Way, Land O Lakes', phone: '(813) 555-0148', email: 'rcalloway@example.com', day: 'Tuesday', mrr: '$102.00', dot: 'var(--brand-green)' },
  { name: 'June Hattori', addr: '3025 Sunward Cir, New Tampa', phone: '(813) 555-0285', email: 'jhattori@example.com', day: 'Friday', mrr: '$104.50', dot: 'var(--brand-green)' },
];

const PoolLogicApp = ({ scale = 1, dimmedRows = 0, page = 'customers', animate = true }) => {
  // Animation step machine (17 phases):
  //  0 idle
  //  1 cursor → Filters btn
  //  2 click Filters
  //  3 linger (panel opening)
  //  4 cursor → All cities pill
  //  5 click All cities (cities dropdown opens)
  //  6 hold (cities dropdown visible — no selection)
  //  7 cursor → All techs pill (cities dropdown closes)
  //  8 click All techs (techs dropdown opens)
  //  9 cursor glides smoothly down to Tyler
  // 10 click Tyler
  // 11 ✓ on Tyler (brief)
  // 12 dropdown closes, filtered state visible
  // 13 cursor → MRR header
  // 14 click MRR (arrow flips to single down)
  // 15 table re-sorts ascending — lowest-paying customers surface
  // 16 hold (let the viewer absorb the "candidates to renegotiate" frame)
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);

  // Lazy-start: don't run the cursor demo until the component is actually visible.
  // Once it's been seen, leave inView=true so the loop keeps running uninterrupted.
  useEffect(() => {
    if (!animate || page !== 'customers') return;
    const node = rootRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.25 });
    obs.observe(node);
    return () => obs.disconnect();
  }, [animate, page]);

  useEffect(() => {
    if (!animate || page !== 'customers' || !inView) return;
    const durations = [2000, 1100, 400, 1200, 900, 500, 1100, 900, 500, 1400, 350, 550, 1300, 1100, 400, 350, 6000];
    let timer;
    const tick = (s) => {
      setStep(s);
      timer = setTimeout(() => tick((s + 1) % 17), durations[s]);
    };
    tick(0);
    return () => clearTimeout(timer);
  }, [animate, page, inView]);

  const filtersOpen = step >= 2 && step <= 16;
  const citiesDropdownOpen = step >= 5 && step <= 6;
  const techsDropdownOpen = step >= 8 && step <= 11;
  const filterBtnPressed = step === 2;
  const citiesBtnPressed = step === 5;
  const techsBtnPressed = step === 8;
  const techItemPressed = step === 10;
  const mrrBtnPressed = step === 14;
  const cursorVisible = step >= 1 && step <= 15;
  const techFilterActive = step >= 12;
  const mrrSortActive = step >= 15;

  // Cursor TARGET coords (where the cursor is heading)
  let targetX, targetY;
  if (step >= 1 && step <= 3) {
    targetX = 778; targetY = 235;       // Filters button
  } else if (step >= 4 && step <= 6) {
    targetX = 637; targetY = 295;       // All cities pill (open + hold)
  } else if (step === 7 || step === 8) {
    targetX = 542; targetY = 295;       // All techs pill
  } else if (step >= 9 && step <= 11) {
    targetX = 542; targetY = 520;       // Tyler (smooth descent through items)
  } else if (step === 12) {
    targetX = 760; targetY = 365;       // visible transit toward MRR — cursor drifts during dropdown close
  } else if (step >= 13 && step <= 15) {
    targetX = 1010; targetY = 380;      // MRR column header
  } else {
    targetX = 560; targetY = 460;       // off (idle / rest)
  }

  // Curved + minimum-jerk cursor trajectory. Each hop follows a quadratic bezier whose
  // control point sits perpendicular to the straight line — gives the path a gentle arc
  // like a real arm sweep. Easing uses a minimum-jerk profile (slower start/finish, fast
  // middle) which is closer to how human muscles actually move than a symmetric cubic.
  // Endpoints are exact, so click locations don't drift.
  const [cursorVisualX, setCursorVisualX] = useState(560);
  const [cursorVisualY, setCursorVisualY] = useState(470);
  const positionRef = useRef({ x: 560, y: 470 });
  const moveRef = useRef({ fromX: 560, fromY: 470, toX: 560, toY: 470, cpX: 560, cpY: 470, startTime: 0, duration: 1 });
  const arcSignRef = useRef(1);

  // Whenever the target changes, snapshot the cursor's CURRENT visual position as the new
  // movement's starting point, then schedule a fresh easing run toward the new target.
  useEffect(() => {
    const fromX = positionRef.current.x;
    const fromY = positionRef.current.y;
    const dx = targetX - fromX;
    const dy = targetY - fromY;
    const dist = Math.hypot(dx, dy);
    const duration = dist < 1 ? 80 : Math.max(320, Math.min(1400, 240 + dist * 1.7));
    // Arc magnitude scales with distance but is capped so short hops stay nearly straight.
    const arcMag = Math.min(38, dist * 0.10);
    // Perpendicular unit vector to the straight-line path.
    const perpX = dist > 0.001 ? -dy / dist : 0;
    const perpY = dist > 0.001 ? dx / dist : 0;
    // Alternate the arc direction so the cursor doesn't always curve the same way.
    arcSignRef.current *= -1;
    const cpX = (fromX + targetX) / 2 + perpX * arcMag * arcSignRef.current;
    const cpY = (fromY + targetY) / 2 + perpY * arcMag * arcSignRef.current;
    moveRef.current = { fromX, fromY, toX: targetX, toY: targetY, cpX, cpY, startTime: performance.now(), duration };
  }, [targetX, targetY]);

  useEffect(() => {
    let frameId;
    const tick = () => {
      const m = moveRef.current;
      const elapsed = performance.now() - m.startTime;
      const t = Math.min(1, elapsed / m.duration);
      // Minimum-jerk easing: t³(10 − 15t + 6t²). Smoother than cubic in/out and matches
      // the speed profile of a human arm reaching for a target.
      const eased = t * t * t * (10 - 15 * t + 6 * t * t);
      // Quadratic bezier through the control point — endpoints stay exact.
      const inv = 1 - eased;
      const x = inv * inv * m.fromX + 2 * inv * eased * m.cpX + eased * eased * m.toX;
      const y = inv * inv * m.fromY + 2 * inv * eased * m.cpY + eased * eased * m.toY;
      positionRef.current = { x, y };
      setCursorVisualX(x);
      setCursorVisualY(y);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Hover index derived from cursor's REAL rendered y (so the blue highlight tracks the cursor).
  // Dropdown's first item top = app y 327; each item is ~31 tall.
  let hoveredIndex = null;
  if (techsDropdownOpen && cursorVisualX >= 488 && cursorVisualX <= 688) {
    const offset = cursorVisualY - 322;
    if (offset >= 0) {
      const idx = Math.floor(offset / 31);
      if (idx >= 0 && idx < 16) hoveredIndex = idx;
    }
  }

  // Persistent ✓ — defaults to "All techs", jumps to Tyler after the click
  const selectedIndex = step === 8 ? 6 : 0;
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;

  return (
    <div ref={rootRef} style={{
      width: 1100,
      height: 660,
      background: '#fff',
      border: '1px solid #e4e4e7',
      borderRadius: 14,
      overflow: 'hidden',
      display: 'flex',
      transformOrigin: 'top left',
      transform: `scale(${scale})`,
      boxShadow: 'var(--shadow-screen)',
      fontFamily: "'Geist', sans-serif",
      color: '#09090b',
      position: 'relative',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: '#fafafa',
        borderRight: '1px solid #e4e4e7',
        padding: '16px 12px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '4px 6px 18px', marginBottom: 14, display: 'flex', alignItems: 'center' }}>
          <Logo size={22} gap={6} fontSize={14} />
        </div>
        <SidebarGroup>
          <SidebarItem icon={<I.dashboard/>} label="Dashboard" />
          <SidebarItem icon={<I.ops/>} label="Operations" />
          <SidebarItem icon={<I.route/>} label="Route insight" />
          <SidebarItem icon={<I.audit/>} label="Service audit" />
        </SidebarGroup>
        <SidebarGroup title="Customers & money">
          <SidebarItem icon={<I.customers/>} label="Customers" active={page === 'customers'} />
          <SidebarItem icon={<I.billing/>} label="Billing & invoicing" />
          <SidebarItem icon={<I.parts/>} label="Services & parts" />
        </SidebarGroup>
        <SidebarGroup title="Shortcuts">
          <SidebarItem icon={<I.userPlus/>} label="New customer" />
          <SidebarItem icon={<I.funnel/>} label="Filter service" />
          <SidebarItem icon={<I.ticket/>} label="Create ticket" />
          <SidebarItem icon={<I.estimate/>} label="Create estimate" />
          <SidebarItem icon={<I.payment/>} label="Record payment" />
        </SidebarGroup>
        <SidebarGroup title="Team">
          <SidebarItem icon={<I.staff/>} label="Staff" />
        </SidebarGroup>
        <div style={{ marginTop: 'auto' }}>
          <SidebarItem icon={<I.settings/>} label="Settings" />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 22px', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12, color: '#71717a',
            width: 240,
          }}>
            <I.search/>
            <span>Quick search...</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, background: '#fff', border: '1px solid #e4e4e7', padding: '1px 5px', borderRadius: 4, fontFamily: 'Geist Mono, monospace' }}>⌘K</span>
          </div>
          <button style={{ height: 30, padding: '0 12px', fontSize: 12, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 7, color: '#3f3f46' }}>Feedback</button>
          <button style={{ height: 30, padding: '0 10px', fontSize: 12, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 7, color: '#3f3f46', display: 'inline-flex', alignItems: 'center', gap: 6 }}><I.sparkle/> Ask</button>
          <div style={{ position: 'relative' }}>
            <I.bell/>
            <span style={{ position: 'absolute', top: -4, right: -6, background: '#ef4444', color: 'white', fontSize: 9, padding: '1px 5px', borderRadius: 8, fontWeight: 600 }}>2</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, color-mix(in oklab, var(--brand-orange) 60%, white), var(--brand-orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 12 }}>JS</div>
        </div>

        {/* Page content */}
        <div style={{ padding: '36px 40px', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: 500, marginBottom: 8 }}>Customers</div>
          <h1 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.025em', margin: 0 }}>Directory</h1>
          <p style={{ color: '#71717a', marginTop: 8, fontSize: 14, maxWidth: 380 }}>{techFilterActive ? '76' : '1,208'} results — search, filter, and open a profile to view or edit customers information.</p>

          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 26, flexWrap: 'nowrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', border: '1px solid #e4e4e7', borderRadius: 999, fontSize: 11.5, flexShrink: 0, whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-green)' }}></span>
              Routed <span style={{ color: '#71717a', marginLeft: 4 }}>1,202</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', border: '1px solid #e4e4e7', borderRadius: 999, fontSize: 11.5, flexShrink: 0, whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a1a1aa' }}></span>
              Unrouted <span style={{ color: '#71717a', marginLeft: 4 }}>6</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Search with / shortcut indicator */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                height: 30, padding: '0 12px',
                border: '1px solid #e4e4e7',
                borderRadius: 999,
                fontSize: 11.5, color: '#a1a1aa',
                width: 200,
                flexShrink: 0,
                background: '#fff',
              }}>
                <span style={{ display: 'inline-flex', color: '#a1a1aa' }}><I.search size={14}/></span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search name, address…</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 16, height: 16,
                  padding: '0 4px',
                  border: '1px solid #e4e4e7',
                  borderRadius: 4,
                  background: '#fafafa',
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: 9.5, color: '#71717a',
                  lineHeight: 1,
                }}>/</span>
              </div>

              {/* Filters button — gets a "1" badge once a filter is active */}
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 11px',
                fontSize: 11.5, fontWeight: 500,
                background: (filtersOpen || techFilterActive) ? 'var(--accent-soft)' : '#fff',
                border: `1px solid ${(filtersOpen || techFilterActive) ? '#bfdbfe' : '#e4e4e7'}`,
                color: (filtersOpen || techFilterActive) ? 'var(--accent)' : '#18181b',
                borderRadius: 8,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transform: filterBtnPressed ? 'scale(0.96)' : 'scale(1)',
                transition: 'all .15s ease',
              }}>
                <I.filter size={14}/>
                Filters
                {techFilterActive && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 15, height: 15,
                    background: 'var(--accent)', color: 'white',
                    borderRadius: 999,
                    fontSize: 9.5, fontWeight: 600,
                    padding: '0 4px',
                    marginLeft: 1,
                  }}>1</span>
                )}
              </button>

              {/* Actions */}
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 11px',
                fontSize: 11.5, fontWeight: 500,
                background: '#fff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                color: '#18181b',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                Actions
                <span style={{ color: '#a1a1aa', display: 'inline-flex' }}><I.chevD/></span>
              </button>

              {/* New customer (primary CTA) */}
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 13px',
                fontSize: 11.5, fontWeight: 500,
                background: 'var(--accent)', color: 'white',
                border: '1px solid var(--accent)',
                borderRadius: 8,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(37, 99, 235, .25)',
              }}>
                <I.plus size={14}/>
                New customer
              </button>
            </div>
          </div>

          {/* Filters panel — slides in when the simulated cursor clicks "Filters" */}
          <div style={{
            maxHeight: filtersOpen ? 80 : 0,
            opacity: filtersOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height .35s cubic-bezier(.4,.0,.2,1), opacity .25s ease, margin-top .35s ease',
            marginTop: filtersOpen ? 14 : 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'nowrap',
              fontSize: 11.5, color: '#18181b',
              background: '#f7f7f8',
              border: '1px solid #f1f1f3',
              borderRadius: 12,
              padding: '8px 10px',
            }}>
              {[
                { icon: <I.filter size={13}/>, label: 'All' },
                { icon: <I.droplet size={13}/>, label: 'All types' },
                { icon: <I.person size={13}/>, label: 'All techs' },
                {
                  icon: (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: 'All cities'
                },
              ].map((f, i) => {
                const isTechs = f.label === 'All techs';
                const isCities = f.label === 'All cities';
                const pressed = (isTechs && techsBtnPressed) || (isCities && citiesBtnPressed);
                // Blue tint only while the dropdown is open (mid-interaction press state).
                // Once a tech is selected the pill returns to neutral, just like the real app —
                // the "filter applied" state lives in the Active Filters row below.
                const active = (isTechs && techsDropdownOpen) || (isCities && citiesDropdownOpen);
                const displayLabel = isTechs && techFilterActive ? 'Tyler Bennett' : f.label;
                return (
                  <div key={i} style={{ position: (isTechs || isCities) ? 'relative' : 'static' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      height: 30, padding: '0 11px',
                      background: active ? 'var(--accent-soft)' : '#fff',
                      border: `1px solid ${active ? '#bfdbfe' : '#e4e4e7'}`,
                      borderRadius: 8,
                      color: active ? 'var(--accent)' : '#18181b',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transform: pressed ? 'scale(0.96)' : 'scale(1)',
                      transition: 'all .15s ease',
                    }}>
                      <span style={{ color: active ? 'var(--accent)' : '#71717a', display: 'inline-flex' }}>{f.icon}</span>
                      <span>{displayLabel}</span>
                      <span style={{ marginLeft: 1, color: active ? 'var(--accent)' : '#a1a1aa', display: 'inline-flex' }}><I.chevD/></span>
                    </div>

                  </div>
                );
              })}
              <span style={{ marginLeft: 4, color: '#52525b', fontWeight: 500, whiteSpace: 'nowrap' }}>MRR</span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 30, padding: '0 11px',
                background: '#fff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                flex: 1,
                minWidth: 80,
              }}>
                <span style={{ color: '#a1a1aa' }}>$</span>
                <span style={{ color: '#a1a1aa' }}>Min</span>
              </div>
              <span style={{ color: '#71717a' }}>to</span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                height: 30, padding: '0 11px',
                background: '#fff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                flex: 1,
                minWidth: 80,
              }}>
                <span style={{ color: '#a1a1aa' }}>$</span>
                <span style={{ color: '#a1a1aa' }}>Max</span>
              </div>

              {/* Clear button — appears once a filter is applied */}
              <div style={{
                display: techFilterActive ? 'inline-flex' : 'none',
                alignItems: 'center', gap: 5,
                height: 30, padding: '0 11px',
                background: '#fff',
                border: '1px solid #e4e4e7',
                borderRadius: 8,
                color: '#52525b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                <span style={{ display: 'inline-flex', color: '#a1a1aa' }}><I.x size={13}/></span>
                Clear
              </div>
            </div>
          </div>

          {/* Active filters bar — shown when a filter has been committed */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11.5,
            maxHeight: techFilterActive ? 28 : 0,
            opacity: techFilterActive ? 1 : 0,
            marginTop: techFilterActive ? 14 : 0,
            overflow: 'hidden',
            transition: 'max-height .3s ease, opacity .25s ease, margin-top .3s ease',
          }}>
            <span style={{ color: '#71717a' }}>Active filters:</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#f4f4f5', color: '#18181b',
              padding: '2px 10px', borderRadius: 999, fontWeight: 600,
              fontSize: 11,
            }}>
              76 results
              <span style={{ color: '#a1a1aa', fontWeight: 400 }}>·</span>
              <span style={{ color: 'var(--brand-green)' }}>$10,584.00</span>
              <span style={{ color: '#71717a', fontWeight: 400 }}>/mo</span>
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
              border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
              color: 'var(--accent)',
              padding: '2px 10px', borderRadius: 999, fontWeight: 500,
              fontSize: 11,
            }}>
              <span style={{ display: 'inline-flex', color: 'var(--accent)' }}><I.person size={11}/></span>
              Tyler Bennett
              <span style={{ display: 'inline-flex', cursor: 'pointer', color: '#18181b' }}><I.x size={11} stroke={1.75}/></span>
            </span>
          </div>

          {/* macOS-style vibrancy techs dropdown — positioned absolutely so it can extend past the filter panel */}
          <div style={{
            position: 'absolute',
            top: 275, left: 268,
            minWidth: 200,
            maxHeight: 280,
            overflowY: 'auto',
            background: 'rgba(38, 38, 42, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: 10,
            padding: 5,
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.34), 0 4px 12px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(3px) saturate(180%)',
            WebkitBackdropFilter: 'blur(3px) saturate(180%)',
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.95)',
            zIndex: 15,
            opacity: techsDropdownOpen ? 1 : 0,
            transform: techsDropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.98)',
            transformOrigin: 'top left',
            pointerEvents: techsDropdownOpen ? 'auto' : 'none',
            transition: 'opacity .18s ease, transform .18s cubic-bezier(.4,0,.2,1)',
          }}>
            {[
              'All techs',
              'Unassigned',
              'Jonathan Timms',
              'CJ Nyger',
              'Warren Holder',
              'Carlos Mendoza',
              'Tyler Bennett',
              'Marcus Webb',
              'Diego Ramirez',
              'Sam Pettigrew',
              'Andre Foster',
              'Lucas Brennan',
              'Rico Ortega',
              'Devon Khoury',
              'Ryan Halverson',
              'Trent Mackenzie',
            ].map((label, j) => {
              const isActive = j === activeIndex;
              const isSelected = j === selectedIndex;
              const isPressed = techItemPressed && j === hoveredIndex;
              return (
                <div key={j} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px',
                  borderRadius: 5,
                  background: isActive ? '#0a84ff' : 'transparent',
                  color: 'rgba(255, 255, 255, 0.95)',
                  whiteSpace: 'nowrap',
                  transform: isPressed ? 'scale(0.97)' : 'scale(1)',
                  transition: 'background .12s ease, transform .12s ease',
                }}>
                  <span style={{ width: 12, fontSize: 11, display: 'inline-flex', justifyContent: 'center' }}>
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Cities dropdown — same vibrancy glass as techs, no selection logic (briefly opens then closes) */}
          <div style={{
            position: 'absolute',
            top: 275, left: 363,
            minWidth: 200,
            maxHeight: 280,
            overflowY: 'auto',
            background: 'rgba(38, 38, 42, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: 10,
            padding: 5,
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.34), 0 4px 12px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(3px) saturate(180%)',
            WebkitBackdropFilter: 'blur(3px) saturate(180%)',
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.95)',
            zIndex: 15,
            opacity: citiesDropdownOpen ? 1 : 0,
            transform: citiesDropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.98)',
            transformOrigin: 'top left',
            pointerEvents: citiesDropdownOpen ? 'auto' : 'none',
            transition: 'opacity .18s ease, transform .18s cubic-bezier(.4,0,.2,1)',
          }}>
            {[
              'All cities',
              'Belleair Beach',
              'Clearwater',
              'Dunedin',
              'Largo',
              'Madeira Beach',
              'Palm Harbor',
              'Redington Beach',
              'Seminole',
              'St Petersburg',
              'Tampa',
              'Tarpon Springs',
              'Treasure Island',
            ].map((label, j) => (
              <div key={j} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px',
                borderRadius: 5,
                background: j === 0 ? '#0a84ff' : 'transparent',
                color: 'rgba(255, 255, 255, 0.95)',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ width: 12, fontSize: 11, display: 'inline-flex', justifyContent: 'center' }}>
                  {j === 0 ? '✓' : ''}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ marginTop: 22, border: '1px solid #f1f1f3', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.6fr 1fr 0.8fr', padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid #f1f1f3', fontSize: 10, letterSpacing: '0.06em', color: '#71717a', fontWeight: 500, textTransform: 'uppercase' }}>
              <div>Customer</div>
              <div>Contact</div>
              <div>Scheduled</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, letterSpacing: '0.06em' }}>
                  MRR
                  {mrrSortActive ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"/>
                      <path d="m6 13 6 6 6-6"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                      <path d="m3 8 4-4 4 4"/>
                      <path d="M7 4v16"/>
                      <path d="m21 16-4 4-4-4"/>
                      <path d="M17 20V4"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <div key={mrrSortActive ? 'sorted' : (techFilterActive ? 'tech' : 'all')} style={{ animation: 'rows-reflow .45s cubic-bezier(.32,.72,.18,1)' }}>
            {(mrrSortActive ? tylerCustomersLowMrr : techFilterActive ? tylerCustomers : customers).map((c, i, arr) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2.2fr 1.6fr 1fr 0.8fr',
                alignItems: 'center',
                padding: '11px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid #f4f4f5' : 'none',
                fontSize: 11.5,
                opacity: i >= arr.length - dimmedRows ? 0.45 : 1,
              }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: '#a1a1aa' }}> — {c.addr}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ color: '#3f3f46' }}>{c.phone}</span>
                  <span style={{ color: 'var(--brand-blue)', fontSize: 11 }}>{c.email}</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#3f3f46' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }}></span>
                  {c.day}
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#18181b', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 7 }}>
                  {c.mrr}
                  <span style={{ color: '#a1a1aa' }}><I.chevR/></span>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </main>

      {/* Animated cursor — position driven by JS rAF interpolation so the highlight stays in sync */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        transform: `translate(${cursorVisualX}px, ${cursorVisualY}px) scale(${(filterBtnPressed || techsBtnPressed || techItemPressed || mrrBtnPressed) ? 0.9 : 1})`,
        opacity: cursorVisible ? 1 : 0,
        transition: 'opacity .35s ease, scale .12s ease',
        pointerEvents: 'none',
        zIndex: 20,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.25))',
      }}>
        <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
          <path d="M3 2.5L18.5 11.5L11.8 13.4L8.6 19.8L3 2.5Z" fill="#09090b" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
        {/* Click ripple — fires on any press step */}
        {(filterBtnPressed || techsBtnPressed || techItemPressed || mrrBtnPressed) && (
          <span key={step} style={{
            position: 'absolute',
            top: 6, left: 6,
            width: 18, height: 18,
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            opacity: 0.8,
            animation: 'cursor-ripple .4s ease-out forwards',
          }}/>
        )}
      </div>

      <style>{`
        @keyframes cursor-ripple {
          from { transform: scale(0.4); opacity: 0.8; }
          to   { transform: scale(2.2); opacity: 0; }
        }
        @keyframes rows-reflow {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Smaller fragments used in feature cards

const RouteCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: 18, fontFamily: "'Geist', sans-serif", color: '#09090b' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: 500 }}>Tuesday route</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>South Tampa · 14 stops</div>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--brand-green)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 999, fontWeight: 500 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-green)' }}></span>
        Optimized · 38 min saved
      </div>
    </div>
    {/* tiny map visual */}
    <div style={{
      position: 'relative',
      height: 150,
      borderRadius: 9,
      background: 'linear-gradient(180deg, #f0f9ff, #e0f2fe)',
      overflow: 'hidden',
      border: '1px solid #e0f2fe',
    }}>
      <svg viewBox="0 0 400 150" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#bae6fd" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="400" height="150" fill="url(#grid)"/>
        <path d="M 20 120 Q 80 60, 140 80 T 260 50 T 380 90" strokeWidth="2" fill="none" strokeDasharray="0" style={{ stroke: 'var(--brand-teal)' }} />
        <path d="M 20 120 Q 80 60, 140 80 T 260 50 T 380 90" strokeWidth="6" fill="none" opacity="0.15" style={{ stroke: 'var(--brand-teal)' }} />
        {[
          [20, 120], [70, 92], [140, 80], [200, 60], [260, 50], [320, 70], [380, 90]
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="6" fill="white" strokeWidth="2" style={{ stroke: 'var(--brand-teal)' }}/>
            <text x={p[0]} y={p[1] + 3} fontSize="8" textAnchor="middle" fontWeight="600" style={{ fill: 'color-mix(in oklab, var(--brand-teal) 70%, black)' }}>{i + 1}</text>
          </g>
        ))}
      </svg>
    </div>
    <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 12 }}>
      <div><span style={{ color: '#71717a' }}>Drive time</span> <span style={{ fontWeight: 600, marginLeft: 4 }}>1h 42m</span></div>
      <div><span style={{ color: '#71717a' }}>Distance</span> <span style={{ fontWeight: 600, marginLeft: 4 }}>38.2 mi</span></div>
      <div><span style={{ color: '#71717a' }}>ETA</span> <span style={{ fontWeight: 600, marginLeft: 4 }}>4:14 PM</span></div>
    </div>
  </div>
);

const InvoiceCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: 18, fontFamily: "'Geist', sans-serif", color: '#09090b' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: 500 }}>Invoice INV-1042</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>Marisol Vega</div>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--brand-green)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 999, fontWeight: 500 }}>
        <I.check/> Paid · auto
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
      {[
        ['Weekly service · April', '$120.00'],
        ['Chlorine tablets (2)', '$28.00'],
        ['Filter cleaning', '$45.00'],
      ].map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #f1f1f3' }}>
          <span style={{ color: '#3f3f46' }}>{row[0]}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{row[1]}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, fontWeight: 600, fontSize: 14 }}>
        <span>Total charged</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>$193.00</span>
      </div>
    </div>
    <div style={{ marginTop: 14, padding: 10, background: '#fafafa', borderRadius: 8, fontSize: 11.5, color: '#71717a', display: 'flex', alignItems: 'center', gap: 8 }}>
      <I.zap/> Sent automatically when route stop completed · Apr 18 · 4:42 PM
    </div>
  </div>
);

const ServiceReportCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: 18, fontFamily: "'Geist', sans-serif", color: '#09090b' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: 500 }}>Service report</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>3204 Coquina Ct, Naples</div>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: 'linear-gradient(135deg, color-mix(in oklab, var(--brand-teal) 60%, white), var(--brand-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><I.droplet/></div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
      {[
        ['pH', '7.4', 'var(--brand-green)'],
        ['Chlorine', '2.8', 'var(--brand-green)'],
        ['Alkalinity', '92', 'var(--brand-orange)'],
      ].map(([label, val, color], i) => (
        <div key={i} style={{ background: '#fafafa', borderRadius: 8, padding: 10, border: '1px solid #f1f1f3' }}>
          <div style={{ fontSize: 10.5, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}></span>
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ width: 56, height: 40, borderRadius: 6, background: `linear-gradient(135deg, hsl(${190 + i*8}, 70%, ${75 - i*3}%), hsl(${200 + i*5}, 80%, ${55 - i*4}%))`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.4), transparent)' }}/>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 12, fontSize: 12, color: '#71717a' }}>
      <span style={{ color: '#3f3f46', fontWeight: 500 }}>Tech notes:</span> Skimmed surface, brushed walls, vacuumed floor. Added 1lb stabilizer.
    </div>
  </div>
);

const DashboardCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 12, padding: 18, fontFamily: "'Geist', sans-serif", color: '#09090b' }}>
    <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a1a1aa', fontWeight: 500 }}>This month</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
      <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>$14,820</span>
      <span style={{ fontSize: 12, color: 'var(--brand-green)', display: 'inline-flex', alignItems: 'center', gap: 2 }}><I.arrowUp/> 12.4%</span>
    </div>
    <div style={{ marginTop: 14, height: 80, position: 'relative' }}>
      <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopOpacity="0.25" style={{ stopColor: 'var(--brand-teal)' }}/>
            <stop offset="100%" stopOpacity="0" style={{ stopColor: 'var(--brand-teal)' }}/>
          </linearGradient>
        </defs>
        <path d="M 0 60 L 30 55 L 60 50 L 90 52 L 120 40 L 150 38 L 180 30 L 210 32 L 240 22 L 270 18 L 300 12 L 300 80 L 0 80 Z" fill="url(#area)"/>
        <path d="M 0 60 L 30 55 L 60 50 L 90 52 L 120 40 L 150 38 L 180 30 L 210 32 L 240 22 L 270 18 L 300 12" strokeWidth="2" fill="none" style={{ stroke: 'var(--brand-teal)' }}/>
      </svg>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa', marginTop: 4 }}>
      <span>Apr 1</span><span>Apr 14</span><span>Apr 28</span>
    </div>
  </div>
);

export { PoolLogicApp, RouteCard, InvoiceCard, ServiceReportCard, DashboardCard };
