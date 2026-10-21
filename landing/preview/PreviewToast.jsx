import React from 'react';
import { Check } from 'lucide-react';
import { usePreviewTheme } from './previewTheme.js';

// The billing-run toast, floating over the dashboard preview's top-right
// corner. A child of .mockup-holder, not of the preview (which clips), and
// themed from the same state as the preview's theme toggle.

export default function PreviewToast() {
  const theme = usePreviewTheme();
  return (
    <div className="pl-toast" data-theme={theme} role="status">
      <span className="pl-toast-check" aria-hidden="true"><Check size={12} strokeWidth={3.2} /></span>
      <div className="pl-toast-body">
        <div className="pl-toast-title">
          <span className="pl-toast-name">163 invoices sent</span>
          <span className="pl-toast-sep"> · </span>
          <span className="pl-toast-amount">$48,930</span>
        </div>
        <div className="pl-toast-detail">
          <span>Recurring billing run</span> · <span>just now</span>
        </div>
      </div>
    </div>
  );
}
