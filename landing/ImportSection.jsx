import React from 'react';
import ImportDemo from './ImportDemo.jsx';
import './import.css';

// Section 4: instant migration. Copy, the looping import demo and a closing
// line. Route acquisition follows in its own section (RouteSection.jsx).

export default function ImportSection() {
  return (
    <section id="switching" className="im-section section bg-white" aria-labelledby="import-heading">
      <div className="container text-center">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">Instant migration</p>
        <h2 id="import-heading" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
          The fastest way to switch pool software.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
          Drop in your Skimmer or QuickBooks export and your whole customer list is in, mapped and billing-ready in under
          2 minutes. No migration calls. No waiting on support. And once you’re here, adding a new customer takes seconds.
        </p>

        <div className="im-demo-slot">
          <ImportDemo />
        </div>

        <div className="im-closing">
          <p className="im-closing-a">Every step is streamlined so you spend less time on setup and more time on the route.</p>
          <p className="im-closing-b">One of the quickest customer onboarding processes in the pool industry.</p>
        </div>
      </div>
    </section>
  );
}
