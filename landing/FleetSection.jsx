import React from 'react';
import SectionHeader from './SectionHeader.jsx';
import './fleet.css';

// "Fleet on autopilot": between Repairs (#repairs) and Instant Migration (#switching). Three still
// cards from the app (a week's mileage, the trucks' check-ins, one day's trips) above four points.
// The cards are real tables and a list, not working UI: nothing in them is a control, and nothing
// moves or waits on JavaScript. Names, addresses and numbers are demo data; the totals add up
// (Michael's Tuesday is the day card's 13 trips, and the hero dashboard's oil-change alert is his truck).

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MILEAGE = [
  { name: 'Michael', days: ['41.2', '38.7', '36.4', '44.1', '39.9', null, null], total: '200.3' },
  { name: 'Gabriel', days: ['29.6', '33.0', '27.8', '31.5', '30.2', null, null], total: '152.1' },
  { name: 'Justin', days: [null, '22.4', '25.1', '19.7', '21.0', null, null], total: '88.2' },
];

const TRUCKS = [
  { name: 'Michael', truck: 'Nissan Frontier', checkIn: 'Today', reading: '70,612 miles', oil: '388 miles left', alert: true },
  { name: 'Gabriel', truck: 'Chevy Silverado', checkIn: '6d ago', reading: '48,930 miles', oil: '3,070 miles left' },
  { name: 'Justin', truck: 'Toyota Tacoma', checkIn: '2d ago', reading: '112,404 miles', oil: '1,596 miles left' },
];

const TRIPS = [
  ['1182 Laurel Ct', '2214 Bayview Dr', '8:04 AM–8:12 AM', '3.4'],
  ['2214 Bayview Dr', '87 Harbor Ln', '8:41 AM–8:49 AM', '2.1'],
  ['87 Harbor Ln', '560 Palmetto Ave', '9:17 AM–9:26 AM', '5.8'],
  ['560 Palmetto Ave', '19 Sandpiper Way', '10:02 AM–10:09 AM', '1.9'],
  ['19 Sandpiper Way', '402 Gulfview Blvd', '10:31 AM–10:40 AM', '2.6'],
  ['402 Gulfview Blvd', '75 Marlin Ct', '11:02 AM–11:10 AM', '1.2'],
  ['75 Marlin Ct', '930 Cypress Ave', '11:34 AM–11:43 AM', '3.3'],
  ['930 Cypress Ave', '948 Cypress Ave', '12:01 PM–12:08 PM', '0.9'],
  ['948 Cypress Ave', '1410 Heron Pl', '12:52 PM–1:03 PM', '4.2'],
  ['1410 Heron Pl', '26 Driftwood Ln', '1:41 PM–1:49 PM', '2.7'],
  ['26 Driftwood Ln', '3301 Seabreeze Dr', '2:26 PM–2:37 PM', '3.9'],
  ['3301 Seabreeze Dr', '715 Mangrove Ct', '3:12 PM–3:22 PM', '3.6'],
  ['715 Mangrove Ct', '31 Osprey Way', '4:29 PM–4:38 PM', '3.1'],
];

const POINTS = [
  {
    title: 'Check-ins on your schedule',
    body: 'Weekly, every two weeks or monthly. Each tech enters the odometer and the oil change sticker, and you see how many miles each truck has left.',
  },
  {
    title: 'First stop to last stop',
    body: 'Tracking starts at the first stop of the day and ends at the last, so the commute stays out of the log.',
  },
  {
    title: 'Logged as stops are completed',
    body: 'Miles are recorded the moment a tech completes a stop, and the day’s log is closed out that evening.',
  },
  {
    title: 'Ready for your accountant',
    body: 'Export stop-to-stop mileage with dates. Leave out a trip or correct the miles first if you need to.',
  },
];

const CardHead = ({ id, title, meta }) => (
  <div className="fl-card-head">
    <p id={`${id}-title`} className="fl-card-title">{title}</p>
    <p id={`${id}-meta`} className="fl-card-meta">{meta}</p>
  </div>
);

export default function FleetSection() {
  return (
    <section id="fleet" className="fl-section" aria-labelledby="fleet-heading">
      <div className="fl-inner">
        <SectionHeader
          id="fleet-heading"
          eyebrow="Fleet on autopilot"
          title="Every mile logged. Every oil change caught."
          subtitle="Mileage tracks itself from the first stop of the day to the last. Pick a truck check-in schedule once, and your techs check in from their app. You do nothing."
          titleClassName="text-slate-900"
        />

        <div className="fl-panels">
          <div className="fl-left">
            <div className="fl-card fl-mileage">
              <CardHead id="fl-mileage" title="Mileage" meta="Oct 12 – 18, 2026" />
              <table className="fl-table" aria-labelledby="fl-mileage-title fl-mileage-meta">
                <thead>
                  <tr>
                    <th scope="col">Technician</th>
                    {DAYS.map((d) => <th key={d} scope="col">{d}</th>)}
                    <th scope="col">Miles</th>
                  </tr>
                </thead>
                <tbody>
                  {MILEAGE.map((row) => (
                    <tr key={row.name}>
                      <th scope="row">{row.name}</th>
                      {row.days.map((mi, i) => (
                        <td key={DAYS[i]}>
                          {mi === null ? <span className="fl-none">—</span>
                            : row.name === 'Michael' && DAYS[i] === 'Tue' ? <span className="fl-selected">{mi}</span>
                              : mi}
                        </td>
                      ))}
                      <td className="fl-total">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="fl-card fl-trucks">
              <CardHead id="fl-trucks" title="Trucks" meta="Check-ins due every 2 weeks" />
              <table className="fl-table" aria-labelledby="fl-trucks-title fl-trucks-meta">
                <thead>
                  <tr>
                    <th scope="col">Technician</th>
                    <th scope="col">Truck</th>
                    <th scope="col">Mileage</th>
                    <th scope="col">Oil change</th>
                  </tr>
                </thead>
                <tbody>
                  {TRUCKS.map((t) => (
                    <tr key={t.name}>
                      {/* On phones the Truck column is hidden and the truck shows under the name instead. */}
                      <th scope="row">{t.name}<span className="fl-truck-sub">{t.truck}</span></th>
                      <td>{t.truck}</td>
                      <td>
                        <span className="fl-checkin">{t.checkIn}</span>
                        <span className="fl-reading">{t.reading}</span>
                      </td>
                      <td><span className={`fl-pill${t.alert ? ' fl-pill--alert' : ''}`}>{t.oil}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* From 900px it's as tall as the left column, and the trips scroll between its header and footer. */}
          <div className="fl-day-slot">
            <div className="fl-card fl-day">
              <CardHead id="fl-day" title="Michael, Tuesday, October 13, 2026" meta="38.7 mi · 14 stops" />
              <div className="fl-trips" tabIndex={0} role="region" aria-label="Michael’s trips on Tuesday, October 13, 2026">
                {/* role="list": Safari drops a list's semantics once its markers are styled away. */}
                <ol className="fl-trip-list" role="list">
                  {TRIPS.map(([from, to, time, mi], i) => (
                    <li key={from} className="fl-trip">
                      <span className="fl-trip-left">
                        <span className="fl-trip-n" aria-hidden="true">{i + 1}</span>
                        <span className="fl-trip-text">
                          <span className="fl-trip-route">{from} → {to}</span>
                          <span className="fl-trip-time">Pool service · {time}</span>
                        </span>
                      </span>
                      <span className="fl-trip-mi">{mi} mi</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="fl-day-foot">
                <span>Day total · <strong>38.7 mi</strong></span>
                <span className="fl-export"><span aria-hidden="true">↓ </span>Export</span>
              </div>
            </div>
          </div>
        </div>

        <ul className="fl-points">
          {POINTS.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
