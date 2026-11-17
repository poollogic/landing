// landing/reviews/logic.js. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MESSAGES, ago, cleanedAddress, isPhoneOnly, isPopupClick, isWritePath, oauthErrorMessage, safeHttps, totalFromContentRange,
} from './logic.js';

test('safeHttps: https addresses only; a bare domain stays as typed', () => {
  assert.equal(safeHttps('https://example.com'), 'https://example.com');
  assert.equal(safeHttps('https://example.com/'), 'https://example.com');
  assert.equal(safeHttps('https://Example.com/path?q=1'), 'https://example.com/path?q=1');
  for (const bad of ['http://example.com', 'javascript:alert(1)', 'data:text/html,x', 'https://localhost', 'example.com', '', null, 42]) {
    assert.equal(safeHttps(bad), null, String(bad));
  }
});

test('isPhoneOnly: technicians and repair techs, however the role is written', () => {
  for (const r of ['Technician', 'technician', 'Repair_Tech', 'repair tech', 'Repair-Tech']) assert.ok(isPhoneOnly(r), r);
  for (const r of ['Admin', 'Manager', 'Sales', null, undefined, '']) assert.ok(!isPhoneOnly(r), String(r));
});

test('oauthErrorMessage: plain words for each refusal, from the query or the hash', () => {
  assert.equal(oauthErrorMessage('?code=abc'), null);
  assert.equal(oauthErrorMessage('?error=access_denied&error_code=signup_disabled&error_description=Signups+not+allowed'), MESSAGES.noAccount);
  assert.equal(oauthErrorMessage('', '#error=access_denied'), MESSAGES.oauthCancelled);
  assert.equal(oauthErrorMessage('?error=server_error&error_description=boom'), MESSAGES.oauthFailed);
});

test('cleanedAddress: drops what a sign-in left; keeps the rest; /reviews/write becomes /reviews', () => {
  assert.equal(cleanedAddress('https://x.com/pricing?review=open&code=1&rid=2&plan=pro#faq'), '/pricing?plan=pro#faq');
  assert.equal(cleanedAddress('https://x.com/reviews/write?review=open'), '/reviews');
  assert.equal(cleanedAddress('https://x.com/?error=access_denied#error=x'), '/');
});

test('isWritePath', () => {
  assert.ok(isWritePath('/reviews/write') && isWritePath('/reviews/write/'));
  assert.ok(!isWritePath('/reviews') && !isWritePath('/reviews/write/x'));
});

test('isPopupClick: only a plain left click on a same-site link to /reviews/write in this tab', () => {
  const origin = 'https://getpoolnautics.com';
  const click = { button: 0 };
  const link = (href, extra = {}) => ({ href, target: '', download: '', ...extra });
  assert.ok(isPopupClick(click, link('/reviews/write'), origin));
  assert.ok(isPopupClick(click, link('https://getpoolnautics.com/reviews/write/'), origin));
  assert.ok(!isPopupClick(click, link('https://evil.example/reviews/write'), origin));
  assert.ok(!isPopupClick(click, link('/reviews'), origin));
  assert.ok(!isPopupClick(click, link('/reviews/write', { target: '_blank' }), origin));
  assert.ok(!isPopupClick(click, link('/reviews/write', { download: 'x' }), origin));
  for (const k of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) assert.ok(!isPopupClick({ button: 0, [k]: true }, link('/reviews/write'), origin), k);
  assert.ok(!isPopupClick({ button: 1 }, link('/reviews/write'), origin));
  assert.ok(!isPopupClick(click, null, origin));
});

test('ago: relative time, and nothing for a bad date', () => {
  const now = Date.parse('2026-11-17T12:00:00Z');
  assert.equal(ago('2026-11-14T12:00:00Z', now), '3 days ago');
  assert.equal(ago('2026-11-17T12:00:00Z', now), 'now');
  assert.equal(ago('not a date', now), '');
});

test('totalFromContentRange', () => {
  assert.equal(totalFromContentRange('0-11/37'), 37);
  assert.equal(totalFromContentRange('*/0'), 0);
  assert.equal(totalFromContentRange(null), null);
});
