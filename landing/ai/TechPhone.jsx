import React from 'react';
import PhoneFrame from '../PhoneFrame.jsx';

// A technician's iPhone lock screen with Poolnautics push notifications: a new work order and a route
// change, the two things techs are told about whether the app is open or not. Drawn the way iOS 26
// draws it (dark mode): the padlock in the Dynamic Island, no time in the status bar (the clock is
// the time), the battery's percentage, a short date over a big clock, glass notifications with the
// app's icon (the drop and check on white), and the flashlight and camera buttons with filled glyphs.
// The job, stops and times are MOCK data. The shared iPhone frame (PhoneFrame.jsx) at its natural
// 262×586, so its size is fixed from the first render. Styles: ai.css (.ai-tp*).

const NOTIFICATIONS = [
  ['now', 'New work order', 'Heater swap at the McGill pool, added to today’s route.'],
  ['12m ago', 'Route updated', '2 stops moved to Thursday.'],
];

// SF Symbols-style glyphs: lock.fill, flashlight.off.fill, camera.fill, and the status bar's.
const LockGlyph = () => (
  <svg width="8" height="10" viewBox="0 0 12 15" aria-hidden="true">
    <path d="M3 6.5V4.6a3 3 0 0 1 6 0v1.9" fill="none" stroke="currentColor" strokeWidth="1.9" />
    <rect x="1" y="6.3" width="10" height="8.2" rx="2" fill="currentColor" />
  </svg>
);
const FlashlightGlyph = () => (
  <svg width="10" height="17" viewBox="0 0 13 22" aria-hidden="true">
    <path
      fillRule="evenodd"
      fill="currentColor"
      d="M1.4 0h10.2c.6 0 1.1.5 1.1 1.1v2.7c0 .5-.2 1-.5 1.4L9.7 8.3v12.2c0 .8-.7 1.5-1.5 1.5H4.8c-.8 0-1.5-.7-1.5-1.5V8.3L.8 5.2C.5 4.8.3 4.3.3 3.8V1.1C.3.5.8 0 1.4 0Zm5.1 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
    />
  </svg>
);
const CameraGlyph = () => (
  <svg width="18" height="14" viewBox="0 0 21 16" aria-hidden="true">
    <path
      fillRule="evenodd"
      fill="currentColor"
      d="M7.3 0h6.4c.5 0 .9.2 1.2.6l1.1 1.6h2.6c1.3 0 2.4 1.1 2.4 2.4v8.9c0 1.3-1.1 2.5-2.4 2.5H2.4C1.1 16 0 14.8 0 13.5V4.6c0-1.3 1.1-2.4 2.4-2.4H5L6.1.6c.3-.4.7-.6 1.2-.6Zm3.2 4.4a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Zm0 1.6a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4Z"
    />
  </svg>
);
const StatusBar = () => (
  <div className="ai-tp-sb" aria-hidden="true">
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" opacity=".35" />
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 2.6c2.2 0 4.2.8 5.7 2.2l1.2-1.3C13 1.7 10.6.7 8 .7S3 1.7 1.1 3.5l1.2 1.3C3.8 3.4 5.8 2.6 8 2.6Z" />
      <path d="M8 6.2c1.2 0 2.3.4 3.2 1.2l1.2-1.3C11.2 5 9.7 4.3 8 4.3S4.8 5 3.6 6.1l1.2 1.3C5.7 6.6 6.8 6.2 8 6.2Z" />
      <path d="M8 9.8 9.7 8a2.6 2.6 0 0 0-3.4 0L8 9.8Z" />
    </svg>
    {/* The battery with its percentage inside, as iOS shows it */}
    <svg width="27" height="13" viewBox="0 0 27 13">
      <rect x="0" y="0" width="24" height="13" rx="4" fill="currentColor" />
      <text x="12" y="10" textAnchor="middle" fontSize="10" fontWeight="700" fill="#000" fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif">79</text>
      <path d="M25.3 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity=".45" />
    </svg>
  </div>
);

export default function TechPhone() {
  return (
    <figure className="ai-tp" aria-label="Example: Poolnautics push notifications on a technician’s phone">
      <PhoneFrame className="bz-phone--embedded ai-tp-phone">
        <div className="ai-tp-screen">
          <StatusBar />
          <span className="ai-tp-lock" aria-hidden="true"><LockGlyph /></span>
          <div className="ai-tp-clock" aria-hidden="true">
            <span className="ai-tp-date">Tue Nov 3</span>
            <span className="ai-tp-time">9:41</span>
          </div>
          <ul className="ai-tp-notes">
            {NOTIFICATIONS.map(([when, title, body]) => (
              <li key={title} className="ai-tp-note">
                <span className="ai-tp-icon"><img src="/favicon.svg" width={22} height={22} loading="lazy" alt="" /></span>
                <span className="ai-tp-note-text">
                  <span className="ai-tp-note-top"><b>{title}</b><span>{when}</span></span>
                  <span>{body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="ai-tp-dock" aria-hidden="true">
            <span><FlashlightGlyph /></span>
            <span><CameraGlyph /></span>
          </div>
        </div>
      </PhoneFrame>
    </figure>
  );
}
