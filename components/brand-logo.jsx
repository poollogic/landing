import React, { useMemo } from 'react';
import { NAME, NAME_PATH, TM_PATH, COLORS } from './brandName.js';

// The Poolnautics logo, as drawn in the brand files: poolnautics-logo_for-light-bg.svg, the
// no-tagline version the brand README says to use under ~250px wide (the nav's is ~150px). Its
// paths, colours and spacing are copied unchanged; only the file's metadata is left out.
//
// It's two SVGs, the mark and the name, so the nav can fold the mark away on scroll as it did the
// old drop. Both keep the file's coordinates: at rest the name sits exactly where the file puts it,
// level with the mark as drawn (a little above its centre), and once the mark folds away it centres
// in the nav. `height` is the mark's height in px; `compact` folds the mark and shrinks the name
// by 18/21, as the old nav shrank its 21px name to 18px.
//
// Wordmark is the name on its own, for the homepage's header (landing/Nav.jsx), at the same size
// as here by default. bg="dark" takes poolnautics-logo_for-dark-bg.svg's colours: the same paths in
// off-white, with a lighter gray ™.

// The mark's box in the file's units, with its 5.5 stroke (the name's is NAME, in brandName.js).
const MARK = { x: 8.25 * 2.40625, y: 2.25 * 2.40625, w: 47.5 * 2.40625, h: 59.5 * 2.40625 };
const GAP = NAME.x - (MARK.x + MARK.w);
const NAME_LIFT = (NAME.y + NAME.h / 2) - (MARK.y + MARK.h / 2); // < 0: above the mark's centre

const ARC_OUTER = 'M11 59 V26 A21 21 0 1 1 32 47';
const ARC_INNER = 'M20 48 V26 A12 12 0 1 1 32 38';

const HEADER_MARK = 40; // the mark's height in the site's header, px

export const Wordmark = ({ height = NAME.h * HEADER_MARK / MARK.h, bg = 'light', style }) => (
  <svg viewBox={`${NAME.x} ${NAME.y} ${NAME.w} ${NAME.h}`} aria-hidden="true" style={{
    display: 'block', flexShrink: 0, width: NAME.w * height / NAME.h, height, ...style,
  }}>
    <path d={NAME_PATH} fill={COLORS[bg].name} />
    <path d={TM_PATH} fill={COLORS[bg].tm} />
  </svg>
);

let __pnLogoCounter = 0;
const BrandLogo = ({ height = HEADER_MARK, compact = false }) => {
  const gradId = useMemo(() => `pn-logo-${++__pnLogoCounter}`, []);
  const scale = height / MARK.h;
  const nameScale = compact ? scale * 18 / 21 : scale;
  const ease = 'cubic-bezier(.4, 0, .2, 1)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: compact ? 0 : GAP * scale, transition: `gap .35s ${ease}` }}>
      <span style={{
        display: 'block', width: compact ? 0 : MARK.w * scale, height, overflow: 'hidden', flexShrink: 0,
        opacity: compact ? 0 : 1, transition: `width .35s ${ease}, opacity .2s ${ease}`,
      }}>
        <svg width={MARK.w * scale} height={height} viewBox={`${MARK.x} ${MARK.y} ${MARK.w} ${MARK.h}`} aria-hidden="true" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="10" y1="60" x2="58" y2="4">
              <stop offset="0" stopColor="#2563EB" />
              <stop offset="1" stopColor="#1A9CCB" />
            </linearGradient>
          </defs>
          <g transform="scale(2.40625)">
            <g fill="none" stroke={`url(#${gradId})`} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={ARC_OUTER} />
              <path d={ARC_INNER} />
            </g>
            <circle cx="32" cy="26" r="3.8" fill={`url(#${gradId})`} />
          </g>
        </svg>
      </span>
      <Wordmark height={NAME.h * nameScale} style={{
        transform: `translateY(${compact ? 0 : NAME_LIFT * scale}px)`,
        transition: `width .35s ${ease}, height .35s ${ease}, transform .35s ${ease}`,
      }} />
    </span>
  );
};

export default BrandLogo;
