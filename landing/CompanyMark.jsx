import React, { useId } from 'react';

// The demo company's mark: a white "B" in a navy seal, its two counters
// showing pool-blue water with a wave. Lifted from the main site's invoice
// mockup (components/sections.jsx, the Bayshore Pool Co. logo). Ids are made
// unique so the mark can appear more than once on a page.

export default function CompanyMark({ size = 50, className }) {
  const id = useId().replace(/:/g, '');
  const circle = `${id}-circle`;
  const water = `${id}-water`;
  const top = `${id}-top`;
  const bottom = `${id}-bottom`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={circle} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f4f7e" />
          <stop offset="100%" stopColor="#0e3556" />
        </linearGradient>
        <linearGradient id={water} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fc4ec" />
          <stop offset="100%" stopColor="#3b8fd1" />
        </linearGradient>
        <clipPath id={top}>
          <path d="M 41 32 L 56 32 C 61.4 32 65.5 36.1 65.5 41.5 C 65.5 46.9 61.4 51 56 51 L 41 51 Z" />
        </clipPath>
        <clipPath id={bottom}>
          <path d="M 41 55 L 58 55 C 63.8 55 68.5 59.6 68.5 65.5 C 68.5 71.4 63.8 76 58 76 L 41 76 Z" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${circle})`} />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.18" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#ffffff"
        d="M 30 22 L 56 22 C 65.4 22 73 29.6 73 39 C 73 43.8 71 48.2 67.7 51.4 C 72.4 54.3 75.5 59.5 75.5 65.5 C 75.5 75.2 67.7 83 58 83 L 30 83 Z M 41 32 L 56 32 C 61.4 32 65.5 36.1 65.5 41.5 C 65.5 46.9 61.4 51 56 51 L 41 51 Z M 41 55 L 58 55 C 63.8 55 68.5 59.6 68.5 65.5 C 68.5 71.4 63.8 76 58 76 L 41 76 Z"
      />
      <g clipPath={`url(#${top})`}>
        <rect x="41" y="32" width="25" height="19" fill={`url(#${water})`} />
        <path d="M 39 43 Q 47 39 53 43 T 67 43" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
      <g clipPath={`url(#${bottom})`}>
        <rect x="41" y="55" width="28" height="21" fill={`url(#${water})`} />
        <path d="M 39 67 Q 49 62 56 67 T 71 67" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>
    </svg>
  );
}
