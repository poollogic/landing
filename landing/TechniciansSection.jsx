import React, { useEffect, useRef } from 'react';
import SectionHeader from './SectionHeader.jsx';
import initPnPhones from './technicians/pnPhone.js';
import PN_ICONS from './technicians/pn-icons.html?raw';
import PN_PHONE_READINGS from './technicians/pn-phone-readings.html?raw';
import './technicians/pn-phone.css';
import './technicians.css';

// "Technicians on autopilot": between the Financial Watchdog (#collections) and Repairs (#repairs). The
// service report's first page (the readings) in a phone beside three points. The phone, its icons and
// its script are the approved design (poolnautics-service-report.html), copied unchanged into
// landing/technicians/ and placed as they are: the phone and its icons are in the pre-rendered HTML,
// and the script draws the rulers and works the controls once the page has hydrated. React never
// re-renders them, so the script's changes stay. The customer in the phone is fictional.
// Inter comes from the homepage's own @font-face (preview/preview.css).

export default function TechniciansSection() {
  const ref = useRef(null);
  useEffect(() => { initPnPhones(ref.current); }, []); // once per phone (it marks each one done)

  return (
    <section ref={ref} id="technicians" className="ta-section" aria-labelledby="technicians-heading">
      {/* The icons the phone draws with: a 0 × 0 sprite, as in the design file. */}
      <div dangerouslySetInnerHTML={{ __html: PN_ICONS }} />
      <div className="ta-inner">
        <SectionHeader
          id="technicians-heading"
          eyebrow="Technicians on autopilot"
          title="Service reports you never have to police."
          subtitle="Your techs get one simple app. You get proof every pool was serviced, the readings you require, and every mile logged."
          titleClassName="text-slate-900"
          subtitleClassName="text-slate-600"
        />

        <div className="ta-grid">
          <div className="ta-phone-col" dangerouslySetInnerHTML={{ __html: PN_PHONE_READINGS }} />

          <ul className="ta-list">
            <li>
              <h3>Reports they can’t fake</h3>
              <p>Every report is stamped with the phone’s GPS location the moment it’s sent. Photos come from the in-app camera only. No camera-roll uploads. At least one photo is required before a report will send, so your customer always sees the pool their tech just left. No more wondering if a stop really happened.</p>
            </li>
            <li>
              <h3>The readings you require</h3>
              <p>Pick which readings your techs have to test. Stabilizer isn’t a weekly test? Uncheck it. Skip a required one, and the tech has to explain why before the report will send. No more calls from customers asking where their reading went.</p>
            </li>
            <li>
              <h3>Mileage that logs itself</h3>
              <p>The phone’s GPS tracks every drive. When the route is done, your dashboard gets a stop-by-stop breakdown with the miles between each one. Accurate numbers for taxes and bookkeeping, no logbook.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
