// The AI, automations and integrations page (/ai-integrations): every number and list it
// shows, confirmed against the app 2026-10-31. Change a number here and the page, its FAQ
// and its search data all change with it. Claim nothing that isn't in this file.

export const AI_PLAN = 'Vision'; // AI, automations and integrations are all on this plan
export const TRIAL_DAYS = 30; // the trial includes everything in Vision
export const API_DOCS_URL = 'https://app.poollogic.app/docs/api';

// AI assistant connection (Poolnautics' built-in MCP server)
export const MCP_CLIENTS = ['Claude Code', 'Cursor', 'VS Code']; // plus any app that connects to an MCP server with a key
export const MCP_TOOL_COUNT = 30;
// Three levels that build on each other: each one adds to the one before.
export const ACCESS_LEVELS = [
  {
    key: 'read',
    name: 'Read only',
    tools: 15,
    summary: 'Looks things up. Changes nothing.',
    unlocks: [
      'Customers, invoices and quotes',
      'Accounts receivable by age: current, 1–30, 31–60, 61–90, 90+',
      'Visits with water readings, LSI and chemicals',
      'Requests and technicians',
      'Revenue by month, up to 24 months',
      'Settings and the webhook delivery log',
    ],
  },
  {
    key: 'change',
    name: 'Make changes',
    tools: 13,
    summary: 'Works the office queue, through the same code as your office screen.',
    unlocks: [
      'Open requests, move them and assign them',
      'Add notes, and dated customer notes',
      'Draft invoices, and turn an approved quote into a draft invoice',
      'Set up webhooks and the email sending address',
      'Propose price changes for an admin to approve, with Ask first on',
    ],
  },
  {
    key: 'send',
    name: 'Send to customers',
    tools: 2,
    summary: 'Emails invoices and quotes, inside hard limits.',
    unlocks: ['Email invoices to customers', 'Email quotes to customers'],
  },
];

// What no access level can ever do: these tools don't exist.
export const NEVER = [
  'Charge a card or bank account',
  'Refund a payment',
  'Record or void a payment',
  'Add charges',
  'Change a price on its own',
  'Change recurring services, discounts, late fees or autopay',
];
// "Ask first": the AI proposes new prices; an owner or admin approves in Poolnautics before anything
// changes. Confirmed against the app's ai/approvals branch 2026-10-31 (docs/ai-approvals.md):
// BUILT BUT NOT ON MAIN YET. Don't push this page until it ships.
export const PRICE_PROPOSALS = {
  setting: 'Settings › Integrations › AI assistants', // Price changes: Off / Ask first; off by default
  tools: 4, // propose_price_change, withdraw_proposal (Make changes); get_proposal, list_proposals
  maxChangePercent: 50, // per customer, per proposal
  expiresDays: 7, // a proposal no one decides
};
export const SEND_LIMITS = {
  maxInvoice: '$10,000', // drafts over this can't be sent by the AI
  emailsPerDay: 200, // customer emails per connection per 24 hours
  sendsPerDocument: 1, // per document per connection per 24 hours
};

// Webhooks out
export const WEBHOOK_GROUPS = [
  ['Customers, leads and requests', ['customer.created', 'customer.updated', 'lead.created', 'request.created', 'request.updated', 'request.status_changed', 'request.completed']],
  ['Estimates', ['estimate.sent', 'estimate.approved']],
  ['Visits', ['visit.completed']],
  ['Payments', ['payment.received', 'payment.failed']],
  ['Service', ['service.paused', 'service.resumed']],
  ['Equipment', ['filter.replaced', 'salt_cell.cleaned']],
];
export const WEBHOOK_EVENTS = WEBHOOK_GROUPS.flatMap(([, events]) => events); // 16, plus a test ping
export const WEBHOOK_SIGNATURE_HEADER = 'PoolLogic-Signature';
export const WEBHOOK_MAX_AGE_MIN = 5; // reject anything older
export const WEBHOOK_RETRIES = { attempts: 7, hours: 21 }; // then marked failed
export const WEBHOOK_LIMIT = 25; // per company
// The real sample payload (the app's own example).
export const SAMPLE_PAYLOAD = {
  id: 'evt_3f9a1c2e7b4d4e0f9a8b7c6d5e4f3a2b',
  event: 'visit.completed',
  api_version: '2026-10-08',
  timestamp: '2026-10-08T15:20:01.000Z',
  data: {
    customer: { full_name: 'Jane Smith', city: 'Tampa', state: 'FL' },
    technician_name: 'Mike Ross',
    visited_at: '2026-10-08T14:12:40.000Z',
    serviced: true,
    readings: { ph: 7.6, free_chlorine: 3, total_alkalinity: 90, cya: 50, calcium_hardness: 280, salt: 3200, phosphate: null },
    lsi: -0.1,
    shocked: false,
    chemicals_added: [{ name: 'Liquid chlorine', amount: 1, unit: 'gal' }],
    notes: 'Brushed walls, emptied baskets.',
    photo_count: 2,
  },
};

// Automations
export const TRIGGER_COUNT = 18;
export const TRIGGER_EXAMPLES = [
  'A new lead comes in',
  'A job is completed',
  'An estimate is sent',
  'An estimate isn’t approved after 2–14\u00a0days',
  'An estimate is approved',
  'An invoice is overdue (1–60\u00a0days)',
  'A payment fails',
  'A payment comes in',
  'A customer is added',
  'A pool is serviced',
  'A new customer’s first visit is done',
  'A filter is replaced',
  'A filter clean is due',
  'A salt cell is cleaned',
  'Service is paused',
  'Service is resumed',
];
export const ACTIONS = [
  'Text from your own number',
  'Send an email',
  'Notify the office in Poolnautics',
  'Send the job’s invoice',
  'Post to Slack',
  'Send a signed Poolnautics webhook',
  'Make a custom HTTP request',
];
export const AUTOMATION_LIMITS = { actions: 5, waitDays: 30, conditions: 10 };
export const RECIPE_COUNT = 40;
export const RECIPES = [
  { title: 'Text new leads back in 90 seconds', when: 'A new lead comes in' },
  { title: 'Text the update-card link when a payment fails', when: 'A payment fails' },
  { title: 'Ask for a Google review when a job is done', when: 'A job is completed' },
  { title: 'Follow up on an estimate that isn’t approved', when: 'An estimate isn’t approved' },
  { title: 'Alert the office when phosphate is high', when: 'A pool is serviced' },
  { title: 'Tell a customer their pool was shocked', when: 'A pool is serviced' },
];

// Texting and team tools
export const SMS_PROVIDERS = ['Quo', 'Twilio', 'Telnyx', 'Dialpad'];
export const BULK = { emails: '10,000', texts: '2,000', textHours: '8 AM–8 PM' };

// Leads in, through each company's lead link
export const LEAD_ROUTES = [
  ['Jotform, Typeform and Webflow forms', 'post to it directly'],
  ['Google Ads lead forms', 'post to it natively'],
  ['Facebook and Instagram lead ads', 'through Zapier, Make or LeadsBridge'],
  ['Wix, Squarespace and WordPress', 'through Zapier'],
  ['Any tool that can post to a link', 'works as is'],
];
export const LEAD_SOURCES = ['Website', 'Facebook', 'Google', 'Angi', 'Thumbtack', 'Yelp', 'Nextdoor', 'HomeAdvisor', 'Referral'];

// Inbound API
export const API_MAX_POST = '64 KB';

// The technician app: no AI, on purpose. Push confirmed by the owner 2026-10-31.
export const TECH_APP = [
  'Push notifications when their route changes or they get a new work order, whether the app is open or not, including changes your AI assistant makes.',
  'A bell in the app with every notification, for anything they missed.',
  'A clean route and chemistry log: stops in order, readings, chemicals and photos.',
  'Reports stamped with the phone’s GPS the moment they’re sent, with photos from the app’s own camera.',
  'Works without signal. Everything sends when it’s back.',
];
