import React from 'react';
import {
  Bell, ChevronsUpDown, CreditCard, FileText, Keyboard, LayoutDashboard, LogOut, Moon, Package,
  Plus, Route, Search, Settings, Ticket, User, UserCog, Users,
} from 'lucide-react';
import { IDENTITY } from './data.js';

// The app's desktop rail (poollogic-web-app: Sidebar.tsx SidebarRail,
// sidebar/SidebarWorkspace, SidebarNewMenu, SidebarAccount, navItem.ts) with
// a made-up account. Shared by the hero's dashboard preview and the Billing
// section's laptop (BillingScrollMorph.jsx).
//   active      the highlighted nav item (the hero: Dashboard)
//   decorative  no live controls: the account chip is a picture, with no menu
//               or Dark mode switch (the laptop). Otherwise only the chip, its
//               menu and the switch are live; the rest is aria-hidden.

const ICON = { size: 16, strokeWidth: 1.25, absoluteStrokeWidth: true, 'aria-hidden': true };

/** nav/NavIcons.tsx InvoiceIcon, outline, at the rail's 16px / 1.25 stroke. */
const InvoiceIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.875} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2.5" />
    <rect x="7.5" y="5.5" width="4.5" height="3.5" rx="1" />
    <path d="M7.5 13h9M7.5 16.5h9M13 19.5h3.5" />
  </svg>
);

/** SidebarControl.tsx's panel glyph, pinned. */
const PanelIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1.5" y="2" width="13" height="12" rx="2" />
    <line x1="8.5" y1="2" x2="8.5" y2="14" />
  </svg>
);

const NAV = [
  { label: 'Operations', items: [['Dashboard', LayoutDashboard], ['Requests', Ticket], ['Customers', Users], ['Routes', Route], ['Staff', UserCog], ['Settings', Settings]] },
  { label: 'Money', items: [['Invoices', null], ['Payments', CreditCard]] },
  { label: 'Catalog', items: [['Services & Parts', Package]] },
];

export default function PreviewSidebar({ menuOpen, onToggleMenu, flash, chipRef, menuRef, switchRef, dark, onThemeChange, active = 'Dashboard', decorative = false }) {
  return (
    <aside className="pl-rail" aria-hidden={decorative || undefined}>
      <div className="pl-rail-top" aria-hidden="true">
        <div className="pl-workspace">{IDENTITY.company}</div>
        <div className="pl-rail-actions">
          <div className="pl-new"><Plus {...ICON} /><span>New</span></div>
          <div className="pl-rail-icon"><Search {...ICON} /></div>
          <div className="pl-rail-icon"><Bell {...ICON} /></div>
        </div>
      </div>

      <div className="pl-nav" aria-hidden="true">
        {NAV.map((group) => (
          <div key={group.label} className="pl-nav-group">
            <div className="pl-nav-label">{group.label}</div>
            {group.items.map(([label, Icon]) => (
              <div key={label} className={`pl-nav-item${label === active ? ' is-active' : ''}`}>
                <span className="pl-nav-icon">{Icon ? <Icon {...ICON} /> : <InvoiceIcon />}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {decorative ? (
        <div className="pl-rail-foot">
          <div className="pl-account">
            <span className="pl-avatar"><User size={14} strokeWidth={2} /></span>
            <span className="pl-account-text">
              <span className="pl-account-name">{IDENTITY.name}</span>
              <span className="pl-account-company">{IDENTITY.company}</span>
            </span>
            <ChevronsUpDown size={14} strokeWidth={1.75} className="pl-account-chevrons" />
          </div>
          <div className="pl-rail-control"><PanelIcon /></div>
        </div>
      ) : (
      <div className="pl-rail-foot">
        <button
          ref={chipRef}
          type="button"
          className={`pl-account pl-live${flash ? ' is-flash' : ''}`}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="pl-account-menu"
          aria-label={`Account menu, ${IDENTITY.name}`}
          onClick={onToggleMenu}
        >
          <span className="pl-avatar" aria-hidden="true"><User size={14} strokeWidth={2} /></span>
          <span className="pl-account-text" aria-hidden="true">
            <span className="pl-account-name">{IDENTITY.name}</span>
            <span className="pl-account-company">{IDENTITY.company}</span>
          </span>
          <ChevronsUpDown size={14} strokeWidth={1.75} className="pl-account-chevrons" aria-hidden="true" />
        </button>
        <div className="pl-rail-control" aria-hidden="true"><PanelIcon /></div>

        {/* After the chip, so Tab goes chip → switch. Positioned above it in CSS. */}
        <div
          id="pl-account-menu"
          ref={menuRef}
          className="pl-menu pl-live"
          data-state={menuOpen ? 'open' : 'closed'}
          role="group"
          aria-label="Account menu"
        >
          <div className="pl-menu-who" aria-hidden="true">
            <div className="pl-menu-company">{IDENTITY.company}</div>
            <div className="pl-menu-name">{IDENTITY.name}</div>
            <div className="pl-menu-email">{IDENTITY.email}</div>
          </div>
          <div className="pl-menu-divider" />
          <div className="pl-menu-row" aria-hidden="true"><FileText size={16} strokeWidth={1.75} /><span className="pl-menu-row-label">Docs</span></div>
          <div className="pl-menu-row" aria-hidden="true"><Keyboard size={16} strokeWidth={1.75} /><span className="pl-menu-row-label">Keyboard shortcuts</span></div>
          {/* ThemeToggle.tsx: the whole row toggles; the switch toggles itself. */}
          <div className="pl-menu-row is-toggle" onClick={() => onThemeChange(!dark)}>
            <Moon size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="pl-menu-row-label" aria-hidden="true">Dark mode</span>
            <button
              ref={switchRef}
              type="button"
              role="switch"
              aria-checked={dark}
              aria-label="Preview PoolLogic in dark mode"
              className="pl-switch"
              onClick={(e) => { e.stopPropagation(); onThemeChange(!dark); }}
            >
              <span className="pl-switch-knob" />
            </button>
          </div>
          <div className="pl-menu-divider" />
          <div className="pl-menu-row" aria-hidden="true"><LogOut size={16} strokeWidth={1.75} /><span className="pl-menu-row-label">Log out</span></div>
          <div className="pl-menu-powered" aria-hidden="true">Powered by PoolLogic</div>
        </div>
      </div>
      )}
    </aside>
  );
}
