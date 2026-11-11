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
    check();
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
