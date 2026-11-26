// shareImages.js and the PNGs scripts/share-images.mjs draws from it (public/og/). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { SHARE_IMAGES } from '../shareImages.js';
import { BRACKETS } from '../pricingPlans.js';
import { payoutRange } from '../partnerProgram.js';

const ROOT = new URL('..', import.meta.url).pathname;
// A PNG's size, from its IHDR chunk.
const pngSize = (file) => { const b = readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

test('every share image is drawn, 1200 × 630, each its own file', () => {
  const files = Object.values(SHARE_IMAGES).map((i) => i.file);
  assert.equal(new Set(files).size, files.length, 'two pages share a file');
  for (const f of [...files, 'pool-service-price-increases', 'how-to-raise-prices']) {
    const path = `${ROOT}public/og/${f}.png`;
    assert.ok(existsSync(path), `public/og/${f}.png is missing: run npm run og`);
    assert.deepEqual(pngSize(path), [1200, 630], `public/og/${f}.png`);
  }
});

test('every share image has alt text', () => {
  for (const [key, i] of Object.entries(SHARE_IMAGES)) assert.ok(i.alt?.length > 20, key);
});

// The images show prices: when a price changes, update shareImages.js and run npm run og to redraw them.
test('the /pricing image shows the plan prices in pricingPlans.js', () => {
  const [, insight, vision] = BRACKETS[0];
  const { prices, card, alt } = SHARE_IMAGES.pricing;
  assert.deepEqual(prices, { insight, vision }, 'pricingPlans.js prices changed: update shareImages.js pricing and run npm run og');
  const shown = card.filter((p) => p.row).map((p) => p.row.b);
  assert.deepEqual(shown, [`$${insight}/mo`, `$${vision}/mo`]);
  assert.match(alt, new RegExp(`\\$${insight} a month.*\\$${vision} a month`));
});

test('the /partners image shows the payout range in partnerProgram.js', () => {
  const shown = SHARE_IMAGES.partners.card.find((p) => p.n).n;
  assert.equal(shown, payoutRange(), 'partner payouts changed: update shareImages.js partners and run npm run og');
});
