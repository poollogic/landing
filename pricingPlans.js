// Poolnautics plan prices — one list for /pricing and the Partner Program's examples.
//
// Price per month by active (not paused) customers: [customers, Insight, Vision].
// More than 2,500 active customers is priced individually. Paying yearly saves 25% on every bracket
// (a year costs 9 months' price); /pricing works that out from these monthly prices.
// The first bracket (up to 50, from Nov 26, 2026) is the starter: no white-glove migration (the importer
// is still free) and no Partner Program payout (partnerProgram.js). The app's billing must charge the same
// brackets: change both together.
// The /pricing share image (public/og/pricing.png) shows the first row's prices ("$49/mo", "$79/mo"):
// when they change, update shareImages.js and run `npm run og` to regenerate it (npm test fails until then).
export const BRACKETS = [
  ['0–50', 49, 79],
  ['51–150', 99, 159], // up to 150 from Nov 26, 2026 (was 100): more customers for the same price
  ['151–250', 199, 319],
  ['251–500', 349, 559],
  ['501–1,000', 599, 959],
  ['1,001–1,500', 849, 1359],
  ['1,501–2,500', 1299, 2079],
];
// The starter bracket: what isn't included there.
export const STARTER = BRACKETS[0][0];
