import React, { useRef } from 'react';

/**
 * ui/SegmentedControl.tsx. Shared by the dashboard preview (the hero and #collections) and the
 * Billing section's laptop (BillingScrollMorph.jsx). Its colours come from the preview theme
 * (.theme-scope.light / .dark).
 *
 * Without `onChange` it's a picture: drawn at rest and hidden from screen readers. With it, it's a
 * live radio group (pl-live, so it takes the pointer inside the otherwise inert preview): a press
 * picks a segment, and the arrow keys move the choice, as the app's does.
 */
export default function Segmented({ options, value, onChange, label }) {
  const refs = useRef([]);
  const live = typeof onChange === 'function';

  const onKey = (e, i) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + options.length) % options.length;
    onChange(options[next]);
    refs.current[next]?.focus();
  };

  return (
    <div
      className={`pl-seg${live ? ' pl-live' : ''}`}
      role={live ? 'radiogroup' : undefined}
      aria-label={live ? label : undefined}
      aria-hidden={live ? undefined : 'true'}
    >
      {options.map((o, i) => {
        const prev = options[i - 1];
        const divider = i > 0 && o !== value && prev !== value;
        const on = o === value;
        return (
          <React.Fragment key={o}>
            {i > 0 && <span className={`pl-seg-divider${divider ? '' : ' is-hidden'}`} aria-hidden="true" />}
            {live ? (
              <button
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                className={`pl-seg-item${on ? ' is-active' : ''}`}
                onClick={() => onChange(o)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {o}
              </button>
            ) : (
              <span className={`pl-seg-item${on ? ' is-active' : ''}`}>{o}</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
