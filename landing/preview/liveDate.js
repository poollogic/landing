import { useSyncExternalStore } from 'react';

// Today's date on the visitor's clock, for the homepage hero's dashboards (HeroPhoneDash's header and
// "Next billing", the desktop preview's subtitle). Read in the browser only: the pre-rendered page has
// no date (null on the server and while React takes it over), and the date shows once the page runs.
// Day and month names are spelled here, not by Intl, so every browser writes them the same way.

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const subscribe = () => () => {};
// A number (yyyymmdd), so React sees the same snapshot on every read of the same day.
const todayKey = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

const fromKey = (key) => new Date(Math.floor(key / 10000), Math.floor(key / 100) % 100 - 1, key % 100);
const short = (d) => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;

/** null on the server; in the browser { weekday: 'Saturday', short: 'Nov 21', long: 'Saturday, November 21, 2026', tomorrow: 'Nov 22' }. */
export default function useLiveDate() {
  const key = useSyncExternalStore(subscribe, todayKey, () => null);
  if (key == null) return null;
  const d = fromKey(key);
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return {
    weekday: DAYS[d.getDay()],
    short: short(d),
    long: `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    tomorrow: short(next),
  };
}
