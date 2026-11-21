// /recurring-billing's example month, in one place so its pictures agree: the hero calendar's dots
// (BillingCalendar.jsx), the settings card's rate (BillingSetup.jsx) and the "That same month, added
// up" totals (PaymentAutomation.jsx). All of it is an example, not real data.

/** Customers billed on each day, the 1st to the 28th: a dot each in the hero calendar. */
export const DOTS = [2, 1, 3, 0, 1, 2, 1, 4, 2, 1, 3, 0, 2, 3, 1, 2, 0, 3, 1, 2, 1, 4, 1, 0, 2, 3, 1, 2];

/** The page's monthly rate, in dollars ($145 / month, Dana's weekly pool service). */
export const RATE = 145;

/** Customers with no email on file, whose invoices are printed and mailed. */
export const MAILED = 2;

export const CUSTOMERS = DOTS.reduce((a, n) => a + n, 0); // 48
export const EMAILED = CUSTOMERS - MAILED; // 46
export const BILLED = CUSTOMERS * RATE; // $6,960
