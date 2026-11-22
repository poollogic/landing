import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import './preview.css';
import PreviewSidebar from './PreviewSidebar.jsx';
import PreviewPanel from './PreviewPanel.jsx';
import { transitionPreviewTheme, usePreviewTheme } from './previewTheme.js';

// THE dashboard preview: the app's shell (rail and panel) with its dashboard, shared by the hero and
// #collections (RevenueSection.jsx), so the two can't drift. A picture with a few live controls: the
// account chip and the Dark mode switch in its menu, the Trends row's range switch, the Cost per
// visit pool dropdown and the charts' hover (PreviewPanel.jsx). Below lg the theme is also set from
// the toggle above it (PreviewThemeToggle).
//
// Options, for #collections (the hero uses none):
//   browserBar  false: no browser toolbar over the screen
//   theme       'dark' | 'light': this one, whatever the visitor chose for the hero
//   staticRail  the rail as a picture: no account menu, so no Dark mode switch
//   active      the rail's highlighted item (Dashboard)
//   banner      the billing banner over the stat cards ({ open }); see PreviewPanel
//   stage       laid out for a stage that scales it to its width (preview.css .pl-preview--stage)
//   children    the panel in place of the dashboard (LateInvoicesView.jsx)
//   liveDate    the header's date is today's, on the visitor's clock (the hero; see PreviewPanel)

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

export default function DashboardPreview({ browserBar = true, theme: fixedTheme, staticRail = false, active = 'Dashboard', banner, stage = false, liveDate = false, children }) {
  const sharedTheme = usePreviewTheme();
  const theme = fixedTheme ?? sharedTheme;
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
    <section className={`theme-scope ${theme} pl-preview${stage ? ' pl-preview--stage' : ''}`} aria-label="Poolnautics dashboard preview">
      {browserBar && <BrowserBar />}
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
          active={active}
          decorative={staticRail}
        />
        <div className="pl-main">
          {children ?? <PreviewPanel banner={banner} liveDate={liveDate} />}
        </div>
      </div>
    </section>
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
