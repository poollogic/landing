// The QuickBooks Online sync on the marketing pages (owner, 2026-11-22): hidden while it waits on
// Intuit's production approval, as there's no date for it. Every mention of the sync checks this:
// the billing page's section, plans-table row and two FAQ answers, /pricing's card and comparison
// row, and the homepage feature card (which also feeds the JSON-LD featureList). index.html's
// Insight offer description is plain text: add it back there by hand, after "run themselves; ", as
// "QuickBooks Online integration (coming soon); ".
//
// To bring them back as "coming soon": true. When the sync is live, also find each spot's
// "QuickBooks: flip to available" comment and drop the "coming soon" wording.
//
// Importing customers from a QuickBooks export isn't the sync: it works today and stays everywhere.
// The Terms and Privacy Policy describe the integration either way.
export const QUICKBOOKS_SYNC_SHOWN = false;
