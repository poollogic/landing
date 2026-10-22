// PoolLogic plan prices — one list for /pricing and the Partner Program's examples.
//
// Price per month by active (not paused) customers: [customers, Insight, Vision].
// More than 2,500 active customers is priced individually. Paying yearly saves 25%
// (a year costs 9 months' price); /pricing works that out from these monthly prices.
export const BRACKETS = [
  ['0–100', 99, 159],
  ['101–250', 199, 319],
  ['251–500', 349, 559],
  ['501–1,000', 599, 959],
  ['1,001–1,500', 849, 1359],
  ['1,501–2,500', 1299, 2079],
];
