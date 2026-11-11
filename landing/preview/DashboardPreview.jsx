import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import './preview.css';
import PreviewSidebar from './PreviewSidebar.jsx';
import PreviewPanel from './PreviewPanel.jsx';
import { transitionPreviewTheme, usePreviewTheme } from './previewTheme.js';

// Interactive, single-screen preview of the Poolnautics dashboard for the
// landing hero. A picture with a few live controls: the account chip and the
// Dark mode switch in its menu, and the (look-only) Sanitizer dropdown. The
// theme is also set from the floating pill (PreviewThemePill) and, below lg, the toggle above it.

// The toolbar's icons: lucide's drawings, inline, so the toolbar adds no shared icon module (and so
// no request) to the page's chunks.
const BAR_ICONS = {
  panel: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></>,
  back: <path d="m15 18-6-6 6-6" />,
  forward: <path d="m9 18 6-6-6-6" />,
  lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  reload: <><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></>,
  share: <><path d="M12 2v13" /><path d="m16 6-4-4-4 4" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /></>,
  plus: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
  tabs: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
};
const BarIcon = ({ name, size = 14, strokeWidth = 1.75, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {BAR_ICONS[name]}
  </svg>
);

/**
 * lg and up: the browser's toolbar across the top of the laptop's screen (laptop.css). Decoration:
 * hidden from screen readers, and display:none below lg, where there's no laptop.
 */
function BrowserBar() {
  return (
    <div className="pl-browserbar" aria-hidden="true">
      <div className="pl-bb-group">
        <span className="pl-bb-lights"><i /><i /><i /></span>
        <BarIcon name="panel" />
        <span className="pl-bb-dim"><BarIcon name="back" /><BarIcon name="forward" /></span>
      </div>
      <div className="pl-bb-address">
        <BarIcon name="lock" size={10} strokeWidth={2} />
        {/* Drawn from the attribute (laptop.css), so it isn't text on the page for crawlers. */}
        <span className="pl-bb-url" data-url="poolnautics.app" />
        <BarIcon name="reload" className="pl-bb-reload" size={11} strokeWidth={2} />
      </div>
      <div className="pl-bb-group pl-bb-right">
        <BarIcon name="share" />
        <BarIcon name="plus" />
        <BarIcon name="tabs" />
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  const theme = usePreviewTheme();
  const chipRef = useRef(null);
  const menuRef = useRef(null);
  const switchRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // The account menu opens from its chip; an outside press or Escape closes it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target) || chipRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (menuRef.current?.contains(document.activeElement)) chipRef.current?.focus();
      setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <section className={`theme-scope ${theme} pl-preview`} aria-label="Poolnautics dashboard preview">
      <BrowserBar />
      <div className="pl-frame">
        <PreviewSidebar
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((v) => !v)}
          flash={false}
          chipRef={chipRef}
          menuRef={menuRef}
          switchRef={switchRef}
          dark={theme === 'dark'}
          onThemeChange={(dark) => transitionPreviewTheme(dark ? 'dark' : 'light')}
        />
        <div className="pl-main">
          <PreviewPanel />
        </div>
      </div>
    </section>
  );
}

/**
 * lg and up: a floating pill at the foot of the window, offering the other theme, while the dashboard
 * fills the screen (its top above 40% of the window's height and its bottom below 80%). After the
 * first switch it folds to its icon, and opens again on hover. A portal into the page's root
 * (.mktg), so the hero's transforms don't move it; rendered in the browser only (Hero.jsx).
 */
export function PreviewThemePill({ mockupRef }) {
  const theme = usePreviewTheme();
  const [shown, setShown] = useState(false);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    const el = mockupRef.current;
    if (!el) return undefined;
    let raf = 0;
    const check = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      setShown(r.top < h * 0.4 && r.bottom > h * 0.8);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
    schedule(); // the first check a frame after mount, not mid-load
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [mockupRef]);

  const dark = theme === 'dark';
  const next = dark ? 'light' : 'dark';
  const Icon = dark ? Sun : Moon;
  const root = mockupRef.current?.closest('.mktg') ?? document.body;
  return createPortal(
    <div className={`pl-theme-pill${shown ? ' is-shown' : ''}${used ? ' is-used' : ''}`} data-theme={theme}>
      <span className="pl-theme-pill-label">{dark ? 'Not a dark mode person?' : 'Miss the dark?'}</span>
      <button
        type="button"
        aria-label={`Switch the preview to ${next}`}
        onClick={() => { setUsed(true); transitionPreviewTheme(next); }}
      >
        <Icon className="pl-theme-pill-icon" size={15} strokeWidth={2} aria-hidden="true" />
        <span className="pl-theme-pill-text" aria-hidden="true">Switch to {next}</span>
      </button>
    </div>,
    root,
  );
}

/** Below lg, where the rail (and its account menu) is hidden: Dark / Light above the preview. */
export function PreviewThemeToggle() {
  const theme = usePreviewTheme();
  const options = [
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'light', label: 'Light', Icon: Sun },
  ];
  return (
    <div className="pl-theme-toggle" role="radiogroup" aria-label="Preview theme">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => transitionPreviewTheme(value)}
        >
          <Icon size={14} strokeWidth={2} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
