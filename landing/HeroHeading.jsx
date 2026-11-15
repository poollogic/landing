import React from 'react';

// The compact hero's heading: an optional eyebrow, the h1 and the paragraph under it. Shared by
// /reserve (ReserveCard.jsx's ReserveIntro), /ai-and-automations and /tech-app, so their headline and
// paragraph are always the same markup and size (hero.css, "Compact hero type"). No wrapper: the
// pieces sit directly in the page's copy column.
export default function HeroHeading({ id, eyebrow, title, children }) {
  return (
    <>
      {eyebrow && <p className="hero-eyebrow">{eyebrow}</p>}
      <h1 id={id} className="hero-title">{title}</h1>
      <p className="hero-sub">{children}</p>
    </>
  );
}
