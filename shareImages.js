// Each page's share image (og:image and twitter:image), 1200 × 630, keyed like app.jsx's ROUTE_META, which
// takes `ogImage` and `ogImageAlt` from here (scripts/prerender.mjs writes them into the served <head>).
//
// The PNGs in public/og/ are drawn from these entries by one shared template: `npm run og` (scripts/
// share-images.mjs) renders every one in headless Chrome with the site's Satoshi and the Poolnautics
// wordmark, and stops if any text is clipped. Change an entry here, then run it again and commit the PNGs.
// From the share-image reference (poolnautics-share-images-v3.html, Nov 25, 2026): its layout, copy and
// numbers. The headlines are the images' own, not the pages' titles or og:titles.
//
// Not here: /pool-service-price-increases and /guides/how-to-raise-prices, which have their own images
// (app.jsx), and pages without an entry, which keep the site's /og-image.png (index.html).
//
// An entry: `file` (public/og/<file>.png), `alt` (og:image:alt: what the image says), `headline` and `sub`
// (left), and either `label` (a text-only image: a small label above a bigger headline, no card) or
// `card`, a list of parts drawn top to bottom in the white card on the right:
//   { k }                      small grey heading           { n, mid }   big figure (mid: a size smaller)
//   { sub }                    grey line under the figure   { bar, green } progress bar, % full
//   { row: { icon, text, small, b, pill } }  a line; icon 'tick' or a number chip; ends in bold b or a pill
//   { foot: [left, right] }    the line under a divider     { btn }      a dark button
//   { who, right }             who's speaking               { bubble, from: 'you' | 'ai' }  a chat bubble

export const SHARE_IMAGES = {
  home: {
    file: 'home',
    headline: 'Software to run and grow your pool business.',
    sub: 'Billing, routes and service reports on autopilot.',
    card: [
      { row: { icon: 'tick', text: 'Billing on autopilot' } },
      { row: { icon: 'tick', text: 'Routes & scheduling' } },
      { row: { icon: 'tick', text: 'Service reports with GPS' } },
      { row: { icon: 'tick', text: 'Repairs on autopilot' } },
    ],
    alt: 'Poolnautics. Software to run and grow your pool business. Billing, routes and service reports on autopilot. Billing on autopilot, routes and scheduling, service reports with GPS, repairs on autopilot.',
  },
  // The plan prices (pricingPlans.js BRACKETS, first row) are drawn into this image: when they change,
  // change them here too and run `npm run og` again to regenerate public/og/pricing.png. A test
  // (scripts/share-images.test.mjs) fails while these and BRACKETS disagree.
  pricing: {
    file: 'pricing',
    headline: 'Scale your route, not your overhead.',
    sub: 'Unlimited technicians on every plan.',
    card: [
      { k: 'Plans' },
      { row: { text: 'Insight', small: 'from', b: '$49/mo' } },
      { row: { text: 'Vision', small: 'from', b: '$79/mo' } },
      { foot: ['Free for 30 days', 'No credit card'] },
    ],
    prices: { insight: 49, vision: 79 }, // what the card shows, for the test above
    alt: 'Poolnautics pricing. Scale your route, not your overhead. Unlimited technicians on every plan. Insight from $49 a month, Vision from $79 a month. Free for 30 days, no credit card.',
  },
  workflow: {
    file: 'workflow',
    headline: 'Repairs that run from request to paid.',
    sub: 'The work order writes itself.',
    card: [
      { row: { icon: 1, text: 'You send', b: '$125 invoice' } },
      { row: { icon: 2, text: 'Customer pays', pill: 'Paid' } },
      { row: { icon: 3, text: 'Work order', b: 'To Gabriel' } },
      { row: { icon: 4, text: 'Job complete', pill: 'Done' } },
    ],
    alt: 'Repairs that run from request to paid. The work order writes itself. 1, you send a $125 invoice. 2, the customer pays. 3, the work order goes to Gabriel. 4, job complete.',
  },
  billing: {
    file: 'pool-service-billing',
    headline: 'Pool service billing that runs itself.',
    sub: 'Invoices, autopay and late payers, handled.',
    card: [
      { k: 'December invoice' },
      { n: '$140.00' },
      { sub: 'Sent on their billing day. Card charged on autopay.' },
      { foot: ['Dana Whitfield', { pill: 'Paid' }] },
    ],
    alt: 'Pool service billing that runs itself. Invoices, autopay and late payers, handled. A December invoice for $140.00, sent on the customer’s billing day and charged on autopay: Dana Whitfield, paid.',
  },
  routeSoftware: {
    file: 'pool-route-software',
    headline: 'Routes that keep every stop on schedule.',
    sub: 'A technician, a day and a place in the route for every pool.',
    card: [
      { k: 'Justin’s route, Friday' },
      { row: { icon: 'tick', text: 'Elena Ortiz', small: 'Reported' } },
      { row: { icon: 4, text: 'Sam Whitaker', small: 'Next stop' } },
      { row: { icon: 5, text: 'Nora Castillo' } },
      { foot: ['3 of 17 stops done'] },
    ],
    alt: 'Routes that keep every stop on schedule. A technician, a day and a place in the route for every pool. Justin’s route on Friday: Elena Ortiz reported, Sam Whitaker the next stop, then Nora Castillo. 3 of 17 stops done.',
  },
  mileage: {
    file: 'pool-service-mileage-tracking',
    headline: 'Mileage tracking that logs itself.',
    sub: 'Every mile between stops, measured by GPS.',
    card: [
      { k: 'This week' },
      { n: '327.6 mi' },
      { sub: 'Justin’s route, logged stop by stop.' },
      { foot: ['Today', '64.6 mi'] },
    ],
    alt: 'Mileage tracking that logs itself. Every mile between stops, measured by GPS. This week: 327.6 miles on Justin’s route, logged stop by stop. Today: 64.6 miles.',
  },
  fleet: {
    file: 'pool-service-fleet-management',
    headline: 'A fleet that keeps itself up to date.',
    sub: 'Oil changes, odometers and documents from one check-in.',
    card: [
      { k: 'Next oil change' },
      { n: '888 mi left' },
      { bar: 83.9 },
      { foot: ['Odometer', '70,612'] },
    ],
    alt: 'A fleet that keeps itself up to date. Oil changes, odometers and documents from one check-in. Next oil change: 888 miles left. Odometer 70,612.',
  },
  aiIntegrations: {
    file: 'ai-and-automations',
    headline: 'Automation that handles the routine.',
    sub: 'Lead follow-ups, overdue reminders and failed-payment links.',
    card: [
      { k: 'DE filter clean, $185.00' },
      { row: { icon: 'tick', text: 'Quote approved', small: '9:02 AM, by the customer' } },
      { row: { icon: 'tick', text: 'Work order created', small: '9:02 AM, automatic' } },
    ],
    alt: 'Automation that handles the routine. Lead follow-ups, overdue reminders and failed-payment links. A $185.00 DE filter clean: quote approved by the customer at 9:02 AM, work order created automatically at 9:02 AM.',
  },
  claude: {
    file: 'claude',
    headline: 'The Poolnautics connector for Claude.',
    sub: 'Send quotes, chase late invoices and check routes, inside limits you set.',
    card: [
      { who: 'You', right: true },
      { bubble: 'Who’s overdue this month?', from: 'you' },
      { who: 'Claude' },
      { bubble: '3 customers. Want me to send reminders?', from: 'ai' },
    ],
    alt: 'The Poolnautics connector for Claude. Send quotes, chase late invoices and check routes, inside limits you set. You ask: who’s overdue this month? Claude answers: 3 customers. Want me to send reminders?',
  },
  techApp: {
    file: 'tech-app',
    headline: 'The technician app, built for the truck.',
    sub: 'Routes, chemistry logging and GPS-verified reports.',
    card: [
      { k: 'Hey, Justin' },
      { n: '3/17' },
      { sub: 'stops done today' },
      { bar: 18, green: true },
      { btn: 'Map This Route' },
    ],
    alt: 'The Poolnautics technician app, built for the truck. Routes, chemistry logging and GPS-verified reports. Hey, Justin: 3 of 17 stops done today, with a Map This Route button.',
  },
  partners: {
    file: 'partners',
    headline: 'Get paid when pool pros switch.',
    sub: 'The Poolnautics Partner Program.',
    card: [
      { k: 'For every company you refer' },
      { n: '$200–$4,500', mid: true },
      { sub: 'A flat amount per company, set by its plan and size.' },
    ],
    alt: 'Get paid when pool pros switch. The Poolnautics Partner Program. For every company you refer: $200 to $4,500, a flat amount per company, set by its plan and size.',
  },
  contact: {
    file: 'contact',
    label: 'Contact',
    headline: 'Talk to our team.',
    sub: 'Questions about Poolnautics? We’re here to help.',
    alt: 'Contact Poolnautics. Talk to our team. Questions about Poolnautics? We’re here to help.',
  },
  partnerKit: {
    file: 'partners-kit',
    label: 'Partner program',
    headline: 'Partner kit',
    sub: 'The exact words to use on each platform.',
    alt: 'Poolnautics Partner Program: partner kit. The exact words to use on each platform.',
  },
  partnerTerms: {
    file: 'partners-terms',
    label: 'Partner program',
    headline: 'Partner Program Terms',
    alt: 'Poolnautics Partner Program Terms.',
  },
  // The second guide (/guides/how-to-start-a-pool-cleaning-business, Nov 27, 2026), laid out as the first
  // guide's own image (/og/how-to-raise-prices.png): the guide's title and a figure from its calculator, at
  // the page's defaults (50 pools at $160, $65 a pool in costs).
  guideStartBusiness: {
    file: 'how-to-start-a-pool-cleaning-business',
    headline: 'How to start a pool cleaning business.',
    sub: 'A free guide for new pool pros.',
    card: [
      { k: 'Left for you' },
      { n: '$4,750' },
      { sub: 'a month, from $8,000 in billing.' },
      { foot: ['50 pools', '$160 a month each'] },
    ],
    alt: 'How to start a pool cleaning business. A free guide for new pool pros. Left for you: $4,750 a month, from $8,000 in billing. 50 pools at $160 a month each.',
  },
  // The third guide (/guides/how-to-choose-pool-service-software, Nov 27, 2026), laid out as the first
  // guide's own image: the guide's title and its rule of thumb, from the hero's small card.
  guideChooseSoftware: {
    file: 'how-to-choose-pool-service-software',
    headline: 'How to choose pool service software.',
    sub: 'A free buyer’s guide for pool companies.',
    card: [
      { k: 'Software budget' },
      { n: 'About 1%' },
      { sub: 'of your monthly recurring billing.' },
      { foot: ['7 questions to ask', 'Trial checklist'] },
    ],
    alt: 'How to choose pool service software. A free buyer’s guide for pool companies. Software budget: about 1% of your monthly recurring billing. Seven questions to ask and a trial checklist.',
  },
  // The fourth guide (/guides/how-to-find-out-if-a-pool-tech-is-stealing-chemicals, Nov 28, 2026), laid out
  // as the other guides': its question and the hero card's example (240 gal bought, 148 logged).
  guideChemicals: {
    file: 'how-to-find-out-if-a-pool-tech-is-stealing-chemicals',
    headline: 'Is your pool tech stealing chemicals?',
    sub: 'A free 5-step guide for pool companies.',
    card: [
      { k: 'Not on any report' },
      { n: '92 gal' },
      { sub: 'of liquid chlorine in 4 weeks.' },
      { foot: ['240 gal bought', '148 gal logged'] },
    ],
    alt: 'Is your pool tech stealing chemicals? A free 5-step guide for pool companies. Not on any report: 92 gallons of liquid chlorine in 4 weeks. 240 gallons bought, 148 gallons logged.',
  },
  // The fifth guide (/guides/pool-stabilizer-cyanuric-acid, Nov 28, 2026), laid out as the other guides': its
  // topic and the page's target range (Part 2).
  guideStabilizer: {
    file: 'pool-stabilizer-cyanuric-acid',
    headline: 'Pool stabilizer: the right level.',
    sub: 'How to test it, raise it and lower it.',
    card: [
      { k: 'Ideal for outdoor pools' },
      { n: '40 to 50 ppm', mid: true },
      { sub: 'of stabilizer (cyanuric acid).' },
      { foot: ['30 is acceptable', 'Salt: 60 to 80'] },
    ],
    alt: 'Pool stabilizer: the right level. How to test it, raise it and lower it. Ideal for outdoor pools: 40 to 50 ppm of stabilizer (cyanuric acid). 30 is acceptable, salt pools 60 to 80.',
  },
  // The guides' index (/guides, Nov 27, 2026): text only, like the legal pages'.
  guides: {
    file: 'guides',
    label: 'Guides',
    headline: 'Guides for pool service companies',
    sub: 'Starting a pool cleaning business, choosing software and raising prices.',
    alt: 'Poolnautics guides: guides for pool service companies. Starting a pool cleaning business, choosing software and raising prices.',
  },
  technicianTerms: {
    file: 'technician-terms',
    label: 'Legal',
    headline: 'Technician App Terms',
    alt: 'Poolnautics legal: Technician App Terms.',
  },
  terms: {
    file: 'terms',
    label: 'Legal',
    headline: 'Terms of Service',
    alt: 'Poolnautics legal: Terms of Service.',
  },
  privacy: {
    file: 'privacy',
    label: 'Legal',
    headline: 'Privacy Policy',
    alt: 'Poolnautics legal: Privacy Policy.',
  },
  deleteAccount: {
    file: 'delete-account',
    label: 'Account',
    headline: 'Delete your Poolnautics account',
    alt: 'Poolnautics account: delete your Poolnautics account.',
  },
};

/** ROUTE_META's share-image fields for a page with an entry here. */
export const shareImage = (key) => ({ ogImage: `/og/${SHARE_IMAGES[key].file}.png`, ogImageAlt: SHARE_IMAGES[key].alt });
