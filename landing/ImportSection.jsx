import React from 'react';
import ImportDemo from './ImportDemo.jsx';
import SectionHeader from './SectionHeader.jsx';
import './import.css';

// Section 4: instant migration, on dark. Copy, the looping import demo (a white card, unchanged on the
// dark ground), a closing line and a link to the switching page. Route acquisition follows in its own
// section (RouteSection.jsx).

export default function ImportSection() {
  return (
    <section id="switching" className="im-section" aria-labelledby="import-heading">
      <div className="container text-center">
        <SectionHeader
          id="import-heading"
          eyebrow="Instant migration"
          title="The fastest way to switch pool software."
          subtitle="Switching pool service software shouldn’t take weeks. Drop in your Skimmer or QuickBooks export and your whole customer list is in, mapped and billing-ready in under 2 minutes. No migration calls. No waiting on support. And once you’re here, adding a new customer takes seconds."
        />

        <div className="im-demo-slot">
          <ImportDemo />
        </div>

        <div className="im-closing">
          <p className="im-closing-a">Every step is streamlined so you spend less time on setup and more time on the route.</p>
          <p className="im-closing-b">One of the quickest customer onboarding processes in the pool industry.</p>
          <a href="/switch-pool-service-software" className="im-closing-link">See how switching works</a>
        </div>
      </div>
    </section>
  );
}
