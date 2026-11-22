import React, { useEffect, useRef } from 'react';
import SectionHeader from './SectionHeader.jsx';
import { ArrowRight } from 'lucide-react';
import AppStoreBadge from './AppStoreBadge.jsx';
import initPnPhones from './technicians/pnPhone.js';
import PN_ICONS from './technicians/pn-icons.html?raw';
import PN_PHONE_READINGS from './technicians/pn-phone-readings.html?raw';
import './technicians/pn-phone.css';
import './technicians.css';

// "Technicians on autopilot": between the day timeline (#day) and the Financial Watchdog (#collections). The
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
          title="A pool service app with reports you never have to babysit."
          subtitle="Your techs get one simple app. You get proof every pool was serviced, the readings you require, and every mile logged."
          titleClassName="text-slate-900"
        />

        <div className="ta-grid">
          <div className="ta-phone-col" dangerouslySetInnerHTML={{ __html: PN_PHONE_READINGS }} />

          <div className="ta-copy">
            <ul className="ta-list">
              <li>
                <h3>Reports they can’t fake</h3>
                <p>Every report is stamped with the phone’s GPS location the moment it’s sent. Photos come from the in-app camera only, and at least one is required, so your customer always sees the pool their tech just left.</p>
              </li>
              <li>
                <h3>The readings you require</h3>
                <p>Pick which readings your techs have to test, and set your own ideal range for each. Anything outside it is flagged on the spot, and a skipped reading has to be explained before the report will send.</p>
              </li>
              <li>
                <h3>Mileage that logs itself</h3>
                <p>The phone’s GPS tracks every drive. Your dashboard gets a stop-by-stop breakdown with the miles between each one, ready for taxes and bookkeeping.</p>
              </li>
            </ul>
            {/* The app on the App Store, for the techs: they sign in with an invite from the office. */}
            <div className="ta-get">
              <AppStoreBadge />
              <p>
                Free on iPhone. Android coming soon. Your techs sign in with an invite from your office.
                <a className="ta-link" href="/tech-app">See the tech app<ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" /></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
