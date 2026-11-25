import React from 'react';
import './feature-phone.css';
import '../technicians/pn-phone-route.css';

// The Poolnautics phone on the Vision plan feature pages (/pool-service-mileage-tracking,
// /pool-service-fleet-management): the frame, island and status bar (feature-phone.css), the tech app's
// icons, and the top of its route screen (pn-phone-route.css). A picture: hidden from screen readers.

// The app's icons (lucide shapes, as lucide-react-native 0.468 in the tech app draws them), inline.
const PN = {
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  calculator: <><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" /></>,
  bell: <><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></>,
  gear: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
  circleCheck: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
  pin: <><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  ticket: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></>,
  cart: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>,
  plusSquare: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8M12 8v8" /></>,
  plus: <path d="M5 12h14M12 5v14" />,
  truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
  camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>,
  x: <path d="M18 6 6 18M6 6l12 12" />,
};

/** One of the app's icons. The phone's CSS sets the stroke (1.75); a different width goes in `style`. */
export const Ic = ({ name, size = 20, style }) => <svg width={size} height={size} viewBox="0 0 24 24" style={style}>{PN[name]}</svg>;

/** The phone: the frame, the island and the status bar at 9:41, around a screen of the tech app
 *  (`screen`: its class, e.g. "pn-route"). */
export function FeaturePhone({ screen, children }) {
  return (
    <div className="pn-phone fp-phone" aria-hidden="true">
      <div className={`pn-screen ${screen}`}>
        <div className="pn-island" />
        <div className="pn-status">
          <span>9:41</span>
          <span className="pn-status__right">
            <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx="1" /><rect x="5.2" y="5.5" width="3.2" height="6.5" rx="1" /><rect x="10.4" y="3" width="3.2" height="9" rx="1" /><rect x="15.6" y="0" width="3.2" height="12" rx="1" /></svg>
            <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.6c2.3 0 4.4.9 6 2.4.2.2.5.2.7 0l.9-.9c.2-.2.2-.5 0-.7C14.1 1.4 11.4.3 8.5.3S2.9 1.4.9 3.4c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0 1.6-1.5 3.7-2.4 6-2.4Zm0 3.9c1.3 0 2.4.5 3.3 1.3.2.2.5.2.7 0l.9-.9c.2-.2.2-.5 0-.7-1.3-1.2-3-2-4.9-2s-3.6.8-4.9 2c-.2.2-.2.5 0 .7l.9.9c.2.2.5.2.7 0 .9-.8 2-1.3 3.3-1.3Zm2.1 2.9c.2-.2.2-.5 0-.7-.6-.5-1.3-.8-2.1-.8s-1.5.3-2.1.8c-.2.2-.2.5 0 .7l1.7 1.8c.2.2.5.2.7 0l1.8-1.8Z" /></svg>
            <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.4" /><rect x="2" y="2" width="20" height="9" rx="2.5" /><path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" fillOpacity="0.45" /></svg>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** The top of the route screen (poolnautics-route-screen.html, pn-phone-route.css): the day and the tools,
 *  the greeting, today's progress and the map button. */
export function RouteTop({ name, done, total }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div className="pn-top">
      <div className="pn-daybar">
        <div className="pn-day"><b>Today</b><span>Nov 20</span><Ic name="chevronDown" size={16} /></div>
        <div className="pn-tools">
          <span><Ic name="calculator" /></span>
          {/* The bell's dot: something new since the list was last opened (the app's NotificationsBell). */}
          <span><span className="pn-bell"><Ic name="bell" /><i className="pn-bell-dot" /></span></span>
          <span><Ic name="gear" /></span>
        </div>
      </div>
      <div className="pn-greet">
        <div className="pn-greet__name">Hey, {name}</div>
        <div className="pn-synced"><Ic name="circleCheck" size={14} />Synced</div>
      </div>
      <div className="pn-card pn-progress">
        <div className="pn-progress__row">
          <div className="pn-progress__count"><b>{done}</b><i> / {total}</i> stops complete</div>
          <div className="pn-pct">{pct}%</div>
        </div>
        <div className="pn-track"><span style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="pn-button"><Ic name="pin" size={18} />Map This Route</div>
    </div>
  );
}
