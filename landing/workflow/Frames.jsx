import React from 'react';
import { Image } from 'lucide-react';

// The two screenshot frames on /workflow (styles: workflow.css, "Frames"). Each shows a
// labelled placeholder until it's given a screenshot. To swap one in, add the image's props to that
// placement, on the same line:
//
//   <PhoneFrame label="Tech app: new request" variant="light" width={190} />
//   <PhoneFrame label="Tech app: new request" variant="light" width={190} src="/screens/tech-new-request.webp" alt="…" />
//
// label    what the screen shows; the placeholder's text and accessible name (and the alt text if
//          no alt is given)
// variant  'dark' or 'light': the section it sits on
// src      the screenshot (WebP or AVIF). Without it, the placeholder
// alt      what the screenshot shows, for screen readers and search engines
// imageWidth, imageHeight  the screenshot file's own size in pixels (defaults: a phone screenshot,
//          1170 × 2532, and a desktop one, 1440 × 900). The frame fixes the box either way, so a
//          different size is cropped to fill it (object-fit: cover), never stretched or shifted.
// priority on the first screen: loads straight away, at high priority. Everywhere else, lazily.
//
// The screen is a fixed box before any image or font loads, so swapping in a screenshot never moves
// anything.

function Screen({ label, src, alt, imageWidth, imageHeight, priority }) {
  // Spelled out twice so scripts/seo-check.mjs can read each tag's loading.
  if (src && priority) {
    return <img className="rf-screen-img" src={src} alt={alt || label} width={imageWidth} height={imageHeight} decoding="async" fetchpriority="high" />;
  }
  if (src) {
    return <img className="rf-screen-img" src={src} alt={alt || label} width={imageWidth} height={imageHeight} decoding="async" loading="lazy" />;
  }
  return (
    <div className="rf-screen-placeholder" role="img" aria-label={`Screenshot placeholder: ${label}`}>
      <Image size={22} strokeWidth={1.6} aria-hidden="true" />
      <span aria-hidden="true">{label}</span>
    </div>
  );
}

/** A phone: the bezel, and the screen inside it. width: the phone's width, in px or any CSS length (its height follows). */
export function PhoneFrame({ label, variant = 'dark', width = 250, src, alt, imageWidth = 1170, imageHeight = 2532, priority = false, className = '' }) {
  return (
    <div className={`rf-phone rf-phone--${variant} ${className}`} style={{ '--rf-phone-w': typeof width === 'number' ? `${width}px` : width }}>
      <div className="rf-phone-screen">
        <Screen label={label} src={src} alt={alt} imageWidth={imageWidth} imageHeight={imageHeight} priority={priority} />
      </div>
    </div>
  );
}

/** A browser window: the top bar (three dots and an address field), and the page below it. height: px or any CSS length. */
export function BrowserFrame({ label, variant = 'light', height = 340, src, alt, imageWidth = 1440, imageHeight = 900, priority = false, className = '' }) {
  return (
    <div className={`rf-browser rf-browser--${variant} ${className}`} style={{ height }}>
      <div className="rf-browser-bar" aria-hidden="true">
        <span /><span /><span />
        <span className="rf-browser-url" />
      </div>
      <div className="rf-browser-screen">
        <Screen label={label} src={src} alt={alt} imageWidth={imageWidth} imageHeight={imageHeight} priority={priority} />
      </div>
    </div>
  );
}
