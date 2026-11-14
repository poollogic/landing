// Made-up reviews for the dev server only (VITE_REVIEWS_MOCK=1, config.js). Obviously fake: the
// companies are example names on example.com addresses. Never shipped (the import is dev-only).

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString();

export const MOCK_REVIEWS = [
  {
    id: 'mock-1', rating: 5, created_at: daysAgo(3), customer_since: '2026-03-01',
    body: 'SAMPLE REVIEW. Billing runs itself now. I used to spend Sunday nights on invoices; now I look at the dashboard on Monday and most of it is already paid.',
    reviewer_name: 'Sample Owner', reviewer_role: 'Owner', company_name: 'Example Pool Co. (sample)', website_url: 'https://example.com', city: 'Tampa', state: 'FL',
  },
  {
    id: 'mock-2', rating: 4, created_at: daysAgo(9), customer_since: '2025-11-01',
    body: 'SAMPLE REVIEW. The route app is the first one my techs did not complain about. Readings, photos, done. I would like a monthly mileage export, which I have asked for in the private box.',
    reviewer_name: 'Test Manager', reviewer_role: 'Office manager', company_name: 'Placeholder Pools LLC (sample)', website_url: 'https://example.org', city: 'Albuquerque', state: 'NM',
  },
  {
    id: 'mock-3', rating: 3, created_at: daysAgo(21), customer_since: '2026-06-01',
    body: 'SAMPLE REVIEW. A long one, to try the clamp. Switching took an afternoon. Late fees and pauses follow the rules I set, which means I no longer have the awkward call. The repair flow took a week to get used to, because quotes and invoices are separate and my office was used to doing both by hand. Once it clicked, it was faster. Support answered the same day every time I wrote. I still want more control over which day a route starts on, and a way to print a week of routes at once for the trucks. Three stars for now; I expect to raise it.',
    reviewer_name: 'Demo Tech Lead', reviewer_role: null, company_name: 'Fake Blue Water Service (sample)', website_url: null, city: null, state: null,
  },
  {
    id: 'mock-4', rating: 5, created_at: daysAgo(40), customer_since: '2026-01-01',
    body: 'SAMPLE REVIEW. Every mile is logged without anyone thinking about it, and the oil change reminders already saved one truck.',
    reviewer_name: 'Example Person', reviewer_role: 'Owner', company_name: 'Test Aquatics (sample)', website_url: 'https://example.net', city: 'Mesa', state: 'AZ',
  },
];
