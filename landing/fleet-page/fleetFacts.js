// /pool-service-fleet-management's numbers (pages/fleet-management.jsx). Demo data, consistent with itself
// and with the homepage's fleet section (landing/FleetSection.jsx): the miles left, the hero card's bars and
// counts, and the oil change track's zones and marker are all worked out here from the mileages, never typed
// in, so changing a truck moves everything with it.

// The product's rules (the app's help guide, Settings › Fleet).
export const OIL_SOON_MILES = 500; // "Oil change soon": within 500 miles of due; the reminder goes then
export const OIL_EVERY = 5000; // how often these trucks' oil is changed ("Oil change every")

// The three trucks: odometer at the latest check-in, and the mileage the next oil change is due at.
export const TRUCKS = [
  { driver: 'Michael', truck: 'Nissan Frontier', odometer: 70612, oilDue: 71000, checkedIn: 'today' }, // 388 left
  { driver: 'Justin', truck: 'Toyota Tacoma', odometer: 112404, oilDue: 114000, checkedIn: '2 days ago' }, // 1,596 left
  { driver: 'Gabriel', truck: 'Chevy Silverado', odometer: 48930, oilDue: 52000, checkedIn: '6 days ago' }, // 3,070 left
];
export const CHECKINS_DUE = 0; // the hero card's first count: nobody's check-in is overdue

export const milesLeft = (t) => t.oilDue - t.odometer;
/** "due" at or past the oil change, "soon" within OIL_SOON_MILES of it, otherwise "ok" (the app's oilState). */
export const oilState = (t) => (milesLeft(t) <= 0 ? 'due' : milesLeft(t) <= OIL_SOON_MILES ? 'soon' : 'ok');
/** How far through its oil change a truck is, 0–100 (the hero card's bars). */
export const oilProgress = (t) => Math.min(100, Math.max(0, Math.round(((OIL_EVERY - milesLeft(t)) / OIL_EVERY) * 100)));
export const OIL_SOON_COUNT = TRUCKS.filter((t) => oilState(t) === 'soon').length; // 1
export const OIL_DUE_COUNT = TRUCKS.filter((t) => oilState(t) === 'due').length; // 0

// The oil change track: Michael's truck. The bar runs from the last oil change to OIL_SOON_MILES past due.
export const TRACK_TRUCK = TRUCKS[0];
export const TRACK_CHANGED = TRACK_TRUCK.oilDue - OIL_EVERY; // 66,000
export const TRACK_SOON = TRACK_TRUCK.oilDue - OIL_SOON_MILES; // 70,500
export const TRACK_END = TRACK_TRUCK.oilDue + OIL_SOON_MILES; // 71,500
/** A mileage's place along the track, in % (70,500 → 81.8, 71,000 → 90.9, 70,612 → 83.9). */
export const trackPct = (miles) => ((Math.min(Math.max(miles, TRACK_CHANGED), TRACK_END) - TRACK_CHANGED) / (TRACK_END - TRACK_CHANGED)) * 100;

// The check-in phone: Michael's previous reading, a week before this one (the "Last … mi" beside the
// odometer field): this one less the mileage page's 325 miles a week (mileageFacts.js).
export const PREVIOUS_READING = TRACK_TRUCK.odometer - 325; // 70,287
// The route behind the check-in sheet, finished: the mileage page's 17-stop day.
export const ROUTE_STOPS = 17;
