import React from 'react';

// One section-header pattern for the homepage and /pricing: eyebrow, title,
// sub-copy, then var(--section-head-gap) before the section's content. Sizes
// and spacing live in landing.css (.section-head); colours come from each
// section through the *ClassName props.

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  as: Title = 'h2',
  id,
  className = '',
  eyebrowClassName = '',
  titleClassName = '',
  subtitleClassName = '',
}) {
  return (
    // Full class names (not built from `align`) so Tailwind keeps both rules.
    <div className={`section-head ${align === 'left' ? 'section-head--left' : 'section-head--center'} ${className}`}>
      {eyebrow && <p className={`section-eyebrow ${eyebrowClassName}`}>{eyebrow}</p>}
      <Title id={id} className={`section-title ${titleClassName}`}>{title}</Title>
      {subtitle && <p className={`section-sub ${subtitleClassName}`}>{subtitle}</p>}
    </div>
  );
}
