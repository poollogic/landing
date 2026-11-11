import React from 'react';

// /request-flow: blank on purpose. No nav, no footer, no content: an empty <main> to build on.
// Rendered in the browser (public/_redirects), marked noindex and left out of the sitemap until
// it has content (app.jsx ROUTE_META.requestFlow).

export default function RequestFlowPage() {
  return <main />;
}
