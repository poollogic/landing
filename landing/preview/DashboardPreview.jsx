import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import './preview.css';
import PreviewSidebar from './PreviewSidebar.jsx';
import PreviewPanel from './PreviewPanel.jsx';
import { transitionPreviewTheme, usePreviewTheme } from './previewTheme.js';

// Interactive, single-screen preview of the PoolLogic dashboard for the
// landing hero. A picture with a few live controls: the account chip and the
// Dark mode switch in its menu, and the (look-only) Sanitizer dropdown. The
// theme is also set from the toggle under the preview (PreviewThemeUnder).

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
    <section className={`theme-scope ${theme} pl-preview`} aria-label="PoolLogic dashboard preview">
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

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'light', label: 'Light', Icon: Sun },
];

/** lg and up: "Preview in  [Dark | Light]", centred under the preview (a child of .mockup-holder). */
export function PreviewThemeUnder() {
  const theme = usePreviewTheme();
  return (
    <div className="pl-theme-under" data-theme={theme}>
      <span className="pl-theme-under-label" aria-hidden="true">Preview in</span>
      <div className="pl-theme-under-seg" role="radiogroup" aria-label="Preview theme">
        {THEME_OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={theme === value}
            data-value={value}
            onClick={() => transitionPreviewTheme(value)}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
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
