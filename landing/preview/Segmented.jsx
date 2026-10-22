import React from 'react';

/**
 * ui/SegmentedControl.tsx, drawn at rest. Shared by the hero's dashboard
 * preview and the Billing section's laptop (BillingScrollMorph.jsx). Its
 * colours come from the preview theme (.theme-scope.light / .dark).
 */
export default function Segmented({ options, value }) {
  return (
    <div className="pl-seg" aria-hidden="true">
      {options.map((o, i) => {
        const prev = options[i - 1];
        const divider = i > 0 && o !== value && prev !== value;
        return (
          <React.Fragment key={o}>
            {i > 0 && <span className="pl-seg-divider" style={{ opacity: divider ? 1 : 0 }} />}
            <span className={`pl-seg-item${o === value ? ' is-active' : ''}`}>{o}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
