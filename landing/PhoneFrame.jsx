import React from 'react';
import './phone.css';

// The shared iPhone frame: the Billing section's phone (BillingMockups.jsx) and, on
// phones, the hero's dashboard preview. Frame, screen, Dynamic Island and home
// indicator; styles in phone.css. Natural size 262×586 (screen 244×568); callers
// scale it with CSS zoom.

/** Signal, wifi and battery, in the current text colour. */
export const StatusIcons = () => (
  <span className="bz-sb-icons">
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
      <path d="M8 2.6c2.2 0 4.2.8 5.7 2.2l1.2-1.3C13 1.7 10.6.7 8 .7S3 1.7 1.1 3.5l1.2 1.3C3.8 3.4 5.8 2.6 8 2.6Z" />
      <path d="M8 6.2c1.2 0 2.3.4 3.2 1.2l1.2-1.3C11.2 5 9.7 4.3 8 4.3S4.8 5 3.6 6.1l1.2 1.3C5.7 6.6 6.8 6.2 8 6.2Z" />
      <path d="M8 9.8 9.7 8a2.6 2.6 0 0 0-3.4 0L8 9.8Z" />
    </svg>
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
      <rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity=".4" />
      <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
      <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity=".45" />
    </svg>
  </span>
);

/**
 * statusBar: 'light' (white, for dark screens) or 'dark' (black, for light screens) draws
 * the 9:41 status bar over the screen; leave it out when the screen draws its own.
 */
export default function PhoneFrame({ children, className = '', statusBar }) {
  return (
    <div className={`bz-phone ${className}`}>
      <div className="bz-screen">
        {children}
        {statusBar && (
          <div className={`bz-statusbar-overlay is-${statusBar}`} aria-hidden="true">
            <span className="bz-sb-time">9:41</span>
            <StatusIcons />
          </div>
        )}
        <span className="bz-island" aria-hidden="true" />
        <span className="bz-home" aria-hidden="true" />
      </div>
    </div>
  );
}
