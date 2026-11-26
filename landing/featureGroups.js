// What Poolnautics does, in eight groups: the single source for the homepage's feature card
// (FeatureCard.jsx, under the pain cards in OnePlatformSection.jsx) and for the featureList of the
// SoftwareApplication JSON-LD (#software in index.html, written in at build time by vite.config.js).
// Plain data, no JSX: vite.config.js imports it too. Order matters, of the groups and of each group's
// features. A link is an in-page section id (#collections …) or a page (billing's goes to /pool-service-billing);
// a group may have two (an array).

import { QUICKBOOKS_SYNC_SHOWN } from './quickbooksSync.js';

export const FEATURE_GROUPS = [
  {
    id: 'billing',
    name: 'Billing & payments',
    desc: 'Invoices go out and cards get charged without you lifting a finger.',
    features: [
      'Automated recurring billing',
      'Card fees passed on to customers',
      'Credit card & bank autopay',
      'One-click invoices',
      'Chemicals added to invoices',
      'Invoices printed & mailed for you',
      // QuickBooks: flip to available when Intuit approves production keys; hidden for now (quickbooksSync.js).
      ...(QUICKBOOKS_SYNC_SHOWN ? ['QuickBooks Online integration (coming soon)'] : []),
    ],
    link: { label: 'See the pool billing software', href: '/pool-service-billing' },
  },
  {
    id: 'paid',
    name: 'Getting paid',
    desc: 'Reminders, late fees and pauses follow your rules automatically.',
    features: [
      'Automatic late fees',
      'Automatic overdue reminders',
      'Failed-card retries & update links',
      'Automatic pause for non-payers',
      '“Vanishing Discount” price adjuster',
    ],
    link: { label: 'See how collections work', href: '#collections' },
  },
  {
    id: 'routes',
    name: 'Routes & technicians',
    desc: 'One simple app for your techs, and proof every pool was serviced.',
    features: [
      'Drag-and-drop routing',
      'Offline technician app',
      'GPS-stamped service reports',
      'Required photos & readings',
      'Chemical dosing calculator',
      'Unlimited technicians & office staff',
    ],
    link: [
      { label: 'See the technician app', href: '/tech-app' },
      { label: 'See the route and scheduling software', href: '/pool-route-software' },
    ],
  },
  {
    id: 'repairs',
    name: 'Repairs & work orders',
    desc: 'From a tech’s request to a paid invoice, without the phone tag.',
    features: [
      'Repair requests from the field',
      'Quotes & estimates',
      'One-tap customer approval',
      'Work orders',
      'Services & parts catalog',
      'Filter service tracker',
    ],
    link: { label: 'See how repairs work', href: '#repairs' },
  },
  {
    id: 'fleet',
    name: 'Fleet',
    desc: 'Every mile logged and every oil change caught.',
    features: [
      'GPS mileage tracking',
      'Truck check-ins',
      'Oil change reminders',
      'Vehicle documents & expirations',
      'Mileage export for taxes',
    ],
    link: { label: 'See fleet tracking', href: '/pool-service-fleet-management' },
  },
  {
    id: 'comms',
    name: 'Customer communication',
    desc: 'Text and email your customers from your own number and domain.',
    features: [
      'Texting from your business number',
      'Bulk email & announcements',
      'Emails sent from your own domain',
      'Automated lead follow-ups',
      'Customer payment portal',
    ],
    link: null,
  },
  {
    id: 'ai',
    name: 'Automation & AI',
    desc: 'Built-in automations, plus your own AI connected to your data.',
    features: [
      'Built-in automations',
      'Connect ChatGPT, Claude or Grok',
      'API & webhooks',
    ],
    link: { label: 'See AI & automations', href: '/ai-and-automations' },
  },
  {
    id: 'reports',
    name: 'Reports & business tools',
    desc: 'Know what every stop costs and what your route is worth.',
    features: [
      'Cost per visit for every pool',
      'Team performance & service audit',
      'Tax summary & data export',
      'Route handover tool',
      'Free migration from other software',
    ],
    link: { label: 'See route transfers', href: '#routes' },
  },
];

/** Every feature, in order: the JSON-LD featureList. */
export const FEATURE_LIST = FEATURE_GROUPS.flatMap((g) => g.features);
