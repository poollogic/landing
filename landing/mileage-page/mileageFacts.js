// /pool-service-mileage-tracking's numbers (pages/mileage-tracking.jsx). Demo data, consistent with each
// other: the derived figures are worked out here from their inputs, never typed in, so they can't drift.

// The IRS standard mileage rate. When it changes, change these two lines: the headline ("76¢"), the
// three-number card's deduction and the note under it all follow.
export const IRS_RATE_CENTS = 76; // cents a mile
export const IRS_RATE_SINCE = 'July 1, 2026';

// "Why it matters": three trucks, 325 miles a week each, 52 weeks.
export const TRUCKS = 3; // the card's label says "Three trucks"
export const MILES_PER_TRUCK_WEEK = 325;
export const WEEKS = 52;
export const FLEET_MILES_WEEK = TRUCKS * MILES_PER_TRUCK_WEEK; // 975
export const FLEET_MILES_YEAR = FLEET_MILES_WEEK * WEEKS; // 50,700
export const DEDUCTION_DOLLARS = Math.round((FLEET_MILES_YEAR * IRS_RATE_CENTS) / 100); // $38,532

// The hero's route card: Justin's Friday. Legs in tenths of a mile, so the sum is exact.
export const ROUTE_STOPS = 17;
export const ROUTE_LEGS_TENTHS = [24, 9, 613]; // 2.4, 0.9, then 61.3 across the 13 stops before the last
export const ROUTE_TODAY_TENTHS = ROUTE_LEGS_TENTHS.reduce((a, b) => a + b, 0); // 64.6
export const ROUTE_WEEK_TENTHS = 3276; // 327.6, Monday to Friday
// The week strip's bars (px), Monday to Friday. Illustrative, not to scale from zero.
export const WEEK_BARS = [['M', 15], ['T', 20], ['W', 17], ['T', 19], ['F', 16]];

// Truck check-ins: Justin's GPS log against his truck's odometer photos, Nov 9 to 20.
export const ROUTE_DAYS = 10; // weekdays Nov 9–20: 10 route days × 17 stops = 170 stops
export const GPS_LOG_TENTHS = 6523; // 652.3 mi
export const ODOMETER_START = 111712; // photo, Nov 6
export const ODOMETER_END = 112404; // photo, Nov 20
export const ODOMETER_MILES = ODOMETER_END - ODOMETER_START; // 692
export const CHECKIN_GAP_TENTHS = ODOMETER_MILES * 10 - GPS_LOG_TENTHS; // 39.7

/** 50700 → "50,700" (no Intl, so the server and the browser always write the same thing). */
export const thousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** Tenths of a mile → "64.6". */
export const tenths = (t) => `${thousands(Math.floor(t / 10))}.${t % 10}`;
