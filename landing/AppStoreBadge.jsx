import React from 'react';

// The technician app on the App Store, linked with Apple's own black "Download on the App Store" badge
// (public/app-store-badge.svg, from Apple's marketing tools, unchanged: Apple asks for the badge as the
// link, not plain text, at least 40px tall, with clear space around it). The app is for a company's
// technicians: they sign in with an invite from their office, so the copy beside it says so.
// Used on /tech-app (hero and closing), the homepage's technician section and the site footer.

export const APP_STORE_ID = '6829012346';
export const APP_STORE_URL = `https://apps.apple.com/us/app/id${APP_STORE_ID}`;
const RATIO = 119.66407 / 40; // the badge's own width : height

/** height: 40 (Apple's minimum) or more. priority: in the first screen (loads at once, not lazily). */
export default function AppStoreBadge({ height = 40, priority = false, className = '' }) {
  const width = Math.round(height * RATIO * 100) / 100;
  return (
    <a href={APP_STORE_URL} className={`app-store-badge ${className}`}>
      {priority
        ? <img src="/app-store-badge.svg" alt="Download on the App Store" width={width} height={height} decoding="async" fetchpriority="high" />
        : <img src="/app-store-badge.svg" alt="Download on the App Store" width={width} height={height} decoding="async" loading="lazy" />}
    </a>
  );
}
