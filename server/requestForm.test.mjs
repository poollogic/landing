// node --test server/  (npm test)
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handleFormRequest, validate, LIMITS } from './requestForm.js';

// In-memory stand-in for the FORM_LIMITS KV namespace (TTL ignored).
const kvStore = () => {
  const m = new Map();
  return { get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); }, map: m };
};

let sent;
let turnstileOk;
let existingContact;
beforeEach(() => {
  sent = [];
  turnstileOk = true;
  existingContact = false;
  globalThis.fetch = async (url, init) => {
    if (String(url).includes('turnstile')) return new Response(JSON.stringify({ success: turnstileOk }));
    sent.push({ url: String(url), body: init.body ? JSON.parse(init.body) : null });
    if (existingContact && String(url).endsWith('/contacts')) return new Response('{"name":"conflict"}', { status: 409 });
    return new Response('{}', { status: 200 });
  };
});

const NOW = 1_800_000_000_000;
const env = (extra = {}) => ({ FORM_LIMITS: kvStore(), RESEND_API_KEY: 'k', NOTIFY_TO: 'owner@example.com', RESEND_AUDIENCE_ID: 'aud', ...extra });
const good = (over = {}) => ({
  kind: 'waitlist', name: 'Mike Rivera', business: 'Bayside Pool Co.', email: 'Mike@Example.com', phone: '(555) 010-0000',
  customers: '251–500', software: 'Skimmer', timing: 'In the next month', message: 'Hi', startedAt: NOW - 20_000, company_website: '', ...over,
});
const req = (body, { origin = 'https://poollogic.app', ip = '203.0.113.7' } = {}) => new Request('https://poollogic.app/api/request', {
  method: 'POST', headers: { origin, 'cf-connecting-ip': ip, 'content-type': 'application/json' }, body: JSON.stringify(body),
});
const call = async (body, e, opts) => { const r = await handleFormRequest(req(body, opts), e, NOW); return { status: r.status, data: await r.json() }; };

test('a good waitlist request: owner email, confirmation, contact in the Waitlist segment', async () => {
  const { status, data } = await call(good(), env());
  assert.equal(status, 200);
  assert.deepEqual(data, { ok: true });
  assert.equal(sent.length, 3);
  assert.deepEqual(sent[0].body.to, ['owner@example.com']);
  assert.equal(sent[0].body.reply_to, 'mike@example.com');
  assert.match(sent[0].body.subject, /Spot request: Bayside Pool Co\. \(251–500 customers\)/);
  assert.deepEqual(sent[1].body.to, ['mike@example.com']);
  assert.match(sent[1].body.subject, /You're on the list, Mike/);
  assert.match(sent[2].url, /api\.resend\.com\/contacts$/);
  assert.deepEqual(sent[2].body.segments, [{ id: 'aud' }]);
  assert.equal(sent[2].body.email, 'mike@example.com');
});

test('an existing contact is added to the Waitlist segment instead', async () => {
  existingContact = true;
  assert.equal((await call(good(), env())).status, 200);
  assert.match(sent[3].url, /\/contacts\/mike%40example\.com\/segments\/aud$/);
  assert.equal(sent[3].body, null);
});

test('rejects other origins and missing origin', async () => {
  assert.equal((await call(good(), env(), { origin: 'https://evil.example' })).status, 403);
  assert.equal(sent.length, 0);
});

test('honeypot and too-fast submissions look successful but send nothing', async () => {
  assert.deepEqual((await call(good({ company_website: 'http://spam' }), env())).data, { ok: true });
  assert.deepEqual((await call(good({ startedAt: NOW - 500 }), env())).data, { ok: true });
  assert.equal(sent.length, 0);
});

test('validation: bad email, unknown choice, missing field, overlong text', async () => {
  const r = await call(good({ email: 'nope', customers: '9 million', business: '' , message: 'x'.repeat(2001) }), env());
  assert.equal(r.status, 422);
  assert.deepEqual(Object.keys(r.data.fields).sort(), ['business', 'customers', 'email', 'message']);
  assert.equal(sent.length, 0);
});

test('waitlist: current software and timing are optional, but must be real choices when given', async () => {
  const ok = await call(good({ software: '', timing: '' }), env());
  assert.equal(ok.status, 200);
  assert.ok(!sent[0].body.text.includes('Current software'));
  assert.equal(validate('waitlist', good({ software: 'Made up' })).errors.software, 'Pick one of the options.');
});

test('line breaks are stripped from single-line fields (no header injection)', () => {
  const { values } = validate('waitlist', good({ business: 'Evil\r\nBcc: x@y.z' }));
  assert.equal(values.business, 'Evil Bcc: x@y.z');
});

test('after a send, the same email is "already on the list" and nothing is re-sent', async () => {
  const e = env();
  await call(good(), e);
  sent = [];
  const again = await call(good(), e, { ip: '198.51.100.9' }); // different IP, same email
  assert.deepEqual(again.data, { ok: true, already: true });
  assert.equal(sent.length, 0);
});

test('after a send, the same IP is locked for other emails', async () => {
  const e = env();
  await call(good(), e);
  sent = [];
  const other = await call(good({ email: 'someone.else@example.com' }), e);
  assert.equal(other.status, 429);
  assert.equal(sent.length, 0);
});

test('attempts per IP per hour are capped, failed ones included', async () => {
  const e = env();
  for (let i = 0; i < LIMITS.ipAttemptsPerHour; i++) assert.equal((await call(good({ email: 'bad' }), e)).status, 422);
  assert.equal((await call(good(), e)).status, 429);
  assert.equal(sent.length, 0);
});

test('Turnstile is enforced when its secret is set', async () => {
  turnstileOk = false;
  assert.equal((await call(good({ turnstileToken: 't' }), env({ TURNSTILE_SECRET_KEY: 's' }))).status, 403);
  assert.equal(sent.length, 0);
  turnstileOk = true;
  assert.equal((await call(good({ turnstileToken: 't' }), env({ TURNSTILE_SECRET_KEY: 's' }))).status, 200);
});

test('daily cap across the site', async () => {
  const e = env();
  e.FORM_LIMITS.map.set(`day:${new Date(NOW).toISOString().slice(0, 10)}`, String(LIMITS.dailySends));
  assert.equal((await call(good(), e)).status, 503);
  assert.equal(sent.length, 0);
});

test('fails closed when not configured', async () => {
  assert.equal((await call(good(), env({ RESEND_API_KEY: undefined }))).status, 503);
  assert.equal((await call(good(), { NOTIFY_TO: 'x@y.z', RESEND_API_KEY: 'k' })).status, 503);
});

test('if the owner email fails, nothing is locked and the person can retry', async () => {
  const e = env();
  globalThis.fetch = async () => new Response('down', { status: 500 });
  assert.equal((await call(good(), e)).status, 502);
  assert.equal([...e.FORM_LIMITS.map.keys()].filter((k) => k.startsWith('sent:') || k.startsWith('ipsent:')).length, 0);
});

test('HTML in fields is escaped in the emails', async () => {
  await call(good({ name: '<b>Mike</b> R', message: '<script>x</script>' }), env());
  assert.ok(!sent[0].body.html.includes('<script>'));
  assert.ok(sent[0].body.html.includes('&lt;script&gt;'));
});

test('no double full stop after a business name ending in "."', async () => {
  await call(good(), env());
  assert.match(sent[1].body.text, /spot for Bayside Pool Co\. We bring/);
});

test('demo and partner forms validate their own fields', () => {
  assert.ok(validate('demo', { ...good(), kind: 'demo', plan: 'Vision' }).values);
  assert.ok(validate('partner', { ...good(), kind: 'partner', message: '' }).errors.message);
});
