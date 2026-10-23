// Choices on the site's forms (/reserve and /contact). Shared by the pages and by the
// server function that receives them (functions/api/request.js), which only accepts
// these exact values.
import { BRACKETS } from './pricingPlans.js';

// Active customers, by pricing bracket.
export const CUSTOMER_OPTIONS = [...BRACKETS.map(([customers]) => customers), 'More than 2,500'];

export const SOFTWARE_OPTIONS = [
  'Skimmer',
  'Pool Brain',
  'Pool Office Manager',
  'QuickBooks or spreadsheets',
  'Pen and paper',
  'Something else',
];

export const TIMING_OPTIONS = [
  'As soon as possible',
  'In the next month',
  'In 1–3 months',
  'Just looking for now',
];

export const PLAN_OPTIONS = ['Insight', 'Vision', 'Not sure yet — help me pick'];
