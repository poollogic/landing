import React, { useMemo } from 'react';

// Icon components — 1.75px stroke, round caps/joins.
// Sidebar nav icons follow the real app's design system: ghost fills (currentColor + fillOpacity 0.08-0.15)
// on enclosed shapes, solid accent dots (fill="currentColor" stroke="none" r=1.5).
const Icon = ({ children, size = 18, stroke = 1.75, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

// User's official PoolLogic mark — drop with checkmark badge, transparent bg
let __plDropCounter = 0;
const PoolDropIcon = ({ size = 28 }) => {
  const dropId = useMemo(() => `pl-drop-${++__plDropCounter}`, []);
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={dropId} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#8BC0FF" />
          <stop offset="0.55" style={{ stopColor: 'var(--brand-blue)' }} />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Water drop */}
      <path d="M 490 180 C 490 180, 258 454.4, 258 640 a 232 232 0 0 0 464 0 C 722 454.4, 490 180, 490 180 Z" fill={`url(#${dropId})`} />
      {/* Check badge */}
      <g transform="translate(720 720)">
        <circle r="170" fill="var(--bg, #fff)" />
        <circle r="148" style={{ fill: 'var(--brand-green)' }} />
        <path d="M -53.28 4 L -11.84 41.44 L 56.24 -38.48" fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// Icon is always rendered at REF_SIZE and scaled with CSS transform so size changes
// tween smoothly (SVG width/height attributes don't animate). The outer wrapper's
// width/height transition keeps the layout footprint in sync with the visual scale.
const Logo = ({ size = 28, plan, gap = 10, fontSize = 17, hideIcon = false }) => {
  const REF_SIZE = 40;
  const ease = 'cubic-bezier(.4, 0, .2, 1)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      gap: hideIcon ? 0 : gap,
      transition: `gap .35s ${ease}`,
    }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: hideIcon ? 0 : size,
        height: size,
        opacity: hideIcon ? 0 : 1,
        overflow: 'hidden',
        transition: `width .35s ${ease}, opacity .2s ${ease}`,
      }}>
        <span style={{
          display: 'block',
          transform: `scale(${size / REF_SIZE})`,
          transformOrigin: 'center',
          flexShrink: 0,
        }}>
          <PoolDropIcon size={REF_SIZE} />
        </span>
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontWeight: 600, fontSize, letterSpacing: '-0.02em', color: 'var(--ink)', whiteSpace: 'nowrap', transition: `font-size .35s ${ease}` }}>PoolLogic</span>
        {plan && <span style={{ fontSize: 11, color: 'var(--ink-5)', marginTop: 2, whiteSpace: 'nowrap' }}>{plan}</span>}
      </div>
    </div>
  );
};

// Sidebar icons (matching the screenshot's visual language)
const I = {
  // Dashboard — house with door cutout
  dashboard: () => <Icon><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.08"/><polyline points="9 22 9 13 15 13 15 22"/></Icon>,
  // Operations — checklist with top-line check
  ops: () => <Icon><polyline points="4 7 6.5 9.5 10 6"/><line x1="13" y1="7.5" x2="21" y2="7.5"/><line x1="4" y1="12.5" x2="21" y2="12.5"/><line x1="4" y1="17.5" x2="21" y2="17.5"/></Icon>,
  // Route insight — two staggered pins joined by a line
  route: () => <Icon><path d="M7.5 3.5a3.5 3.5 0 0 0-3.5 3.5c0 2.6 3.5 6.5 3.5 6.5s3.5-3.9 3.5-6.5a3.5 3.5 0 0 0-3.5-3.5z" fill="currentColor" fillOpacity="0.1"/><circle cx="7.5" cy="7" r="1.5" fill="currentColor" stroke="none" fillOpacity="0.35"/><path d="M16.5 8.5a3.5 3.5 0 0 0-3.5 3.5c0 2.6 3.5 6.5 3.5 6.5s3.5-3.9 3.5-6.5a3.5 3.5 0 0 0-3.5-3.5z" fill="currentColor" fillOpacity="0.1"/><circle cx="16.5" cy="12" r="1.5" fill="currentColor" stroke="none" fillOpacity="0.35"/><line x1="7.5" y1="15" x2="16.5" y2="19.5"/></Icon>,
  // Service audit — line graph with axes + data points
  audit: () => <Icon><line x1="4" y1="3" x2="4" y2="20"/><line x1="4" y1="20" x2="21" y2="20"/><path d="M4 17 C7 17 8 10 12 10 C15 10 15 14 18 13 C19.5 12.5 20 11 21 10" fill="none"/><circle cx="4" cy="17" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="13" r="1.5" fill="currentColor" stroke="none"/><circle cx="21" cy="10" r="1.5" fill="currentColor" stroke="none"/></Icon>,
  // Customers — single person bust
  customers: () => <Icon><circle cx="12" cy="8.5" r="3.5" fill="currentColor" fillOpacity="0.1"/><path d="M4.5 21c0-4 3.4-7 7.5-7s7.5 3 7.5 7"/></Icon>,
  // Billing — wallet/card with chip dot
  billing: () => <Icon><rect x="3" y="7.5" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.07"/><path d="M3 11h18"/><circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none"/></Icon>,
  // Services & parts — flat 2D price tag
  parts: () => <Icon><path d="M12.5 3H7a2 2 0 0 0-2 2v5.5l9.5 9.5a2 2 0 0 0 2.83 0l4.17-4.17a2 2 0 0 0 0-2.83z" fill="currentColor" fillOpacity="0.08"/><circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none"/></Icon>,
  // Create ticket — clipboard
  ticket: () => <Icon><rect x="8.5" y="2.5" width="7" height="2.5" rx="1"/><rect x="4" y="4" width="16" height="17.5" rx="2" fill="currentColor" fillOpacity="0.08"/><line x1="7.5" y1="10" x2="16.5" y2="10"/><line x1="7.5" y1="13.5" x2="16.5" y2="13.5"/><line x1="7.5" y1="17" x2="12.5" y2="17"/></Icon>,
  // New customer — person bust + plus mark (no badge ring)
  userPlus: () => <Icon><circle cx="10" cy="9" r="3.5" fill="currentColor" fillOpacity="0.1"/><path d="M3.5 21c0-4 2.9-6.5 6.5-6.5 1.2 0 2.3.3 3.3.8"/><line x1="18" y1="5" x2="18" y2="11"/><line x1="15" y1="8" x2="21" y2="8"/></Icon>,
  // Filter service — pool canister filter (port + dome + ribbed body + base plinth)
  funnel: () => <Icon><rect x="10.5" y="2" width="3" height="2" rx="0.75"/><path d="M6.5 9.5 C6.5 5 17.5 5 17.5 9.5 L17.5 10.5 L6.5 10.5 Z" fill="currentColor" fillOpacity="0.15" stroke="none"/><path d="M6.5 10.5 C6.5 5 17.5 5 17.5 10.5" fill="none"/><line x1="7.5" y1="11.5" x2="16.5" y2="11.5"/><rect x="8.5" y="12" width="7" height="8" rx="0.5" fill="currentColor" fillOpacity="0.08"/><path d="M6 20 L5 22 L19 22 L18 20 Z" fill="currentColor" fillOpacity="0.15" stroke="none"/><path d="M18 20 L19 22 M6 20 L5 22"/></Icon>,
  // Create estimate — folded-corner document with content lines
  estimate: () => <Icon><path d="M14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5z" fill="currentColor" fillOpacity="0.08"/><polyline points="14.5 3 14.5 8.5 20 8.5"/><line x1="7.5" y1="12.5" x2="16.5" y2="12.5"/><line x1="7.5" y1="15.5" x2="16.5" y2="15.5"/><line x1="7.5" y1="18.5" x2="12.5" y2="18.5"/></Icon>,
  // Record payment — check inside circle
  payment: () => <Icon><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08"/><path d="M9 12l2 2 4-4"/></Icon>,
  // Staff — primary person + partial second-person head/shoulders
  staff: () => <Icon><path d="M17 7a3 3 0 0 1 0 5"/><path d="M19.5 20c0-2.5-1.5-4.5-3.5-5.5"/><circle cx="10" cy="8.5" r="3.5" fill="currentColor" fillOpacity="0.1"/><path d="M3.5 21c0-4 2.9-6.5 6.5-6.5s6.5 2.5 6.5 6.5"/></Icon>,
  // Settings — sliders with solid handles
  settings: () => <Icon><line x1="4" y1="7" x2="20" y2="7"/><circle cx="15" cy="7" r="1.5" fill="currentColor" stroke="none"/><line x1="4" y1="12.5" x2="20" y2="12.5"/><circle cx="9" cy="12.5" r="1.5" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="16" cy="18" r="1.5" fill="currentColor" stroke="none"/></Icon>,
  search: (props) => <Icon {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>,
  bell: () => <Icon><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>,
  // Filter (sliders) — used by top-right Filters button and "All" filter chip
  filter: (props) => <Icon {...props}><line x1="4" y1="7" x2="20" y2="7"/><circle cx="15" cy="7" r="1.5" fill="currentColor" stroke="none"/><line x1="4" y1="12.5" x2="20" y2="12.5"/><circle cx="9" cy="12.5" r="1.5" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="16" cy="18" r="1.5" fill="currentColor" stroke="none"/></Icon>,
  // Single person — techs filter pill
  person: (props) => <Icon {...props}><circle cx="12" cy="8.5" r="3.5" fill="currentColor" fillOpacity="0.1"/><path d="M4.5 21c0-4 3.4-7 7.5-7s7.5 3 7.5 7"/></Icon>,
  plus: (props) => <Icon {...props}><path d="M12 5v14M5 12h14"/></Icon>,
  chevR: () => <Icon size={14}><path d="M9 6l6 6-6 6"/></Icon>,
  chevD: () => <Icon size={14}><path d="M6 9l6 6 6-6"/></Icon>,
  arrowR: () => <Icon><path d="M5 12h14M13 5l7 7-7 7"/></Icon>,
  check: () => <Icon><path d="M5 12l5 5L20 6"/></Icon>,
  zap: () => <Icon><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></Icon>,
  shield: () => <Icon><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/></Icon>,
  clock: () => <Icon><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  phone: () => <Icon><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.9 19.9 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.7 2z"/></Icon>,
  map: () => <Icon><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2z"/><path d="M9 3v16M15 5v16"/></Icon>,
  receipt: () => <Icon><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/></Icon>,
  chart: () => <Icon><path d="M3 21h18"/><rect x="6" y="13" width="3" height="6" rx=".5"/><rect x="11" y="9" width="3" height="10" rx=".5"/><rect x="16" y="5" width="3" height="14" rx=".5"/></Icon>,
  droplet: (props) => <Icon {...props}><path d="M12 2.5C8 8 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-7-7-12.5z"/></Icon>,
  sparkle: () => <Icon><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 4l.6 1.6L21 6l-1.4.4L19 8l-.6-1.6L17 6l1.4-.4z"/></Icon>,
  star: () => <Icon><path d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.5l6.3-.9z"/></Icon>,
  qr: () => <Icon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 21h7M17 17h0"/></Icon>,
  arrowUp: () => <Icon size={14}><path d="M7 14l5-5 5 5"/></Icon>,
  arrowDown: () => <Icon size={14}><path d="M7 10l5 5 5-5"/></Icon>,
  x: (props) => <Icon {...props}><path d="M6 6l12 12M18 6L6 18"/></Icon>,
  menu: () => <Icon><path d="M4 7h16M4 12h16M4 17h16"/></Icon>,
};

export { Icon, PoolDropIcon, Logo, I };
