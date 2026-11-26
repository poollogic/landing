import test from 'node:test';
import assert from 'node:assert/strict';
import { REQUESTS_PER_IP_PER_HOUR, handleSupportLine, isEligible, telHref } from './supportLine.js';

const NUMBER = '(555) 867-5309';
const USER = '11111111-1111-4111-8111-111111111111';
const ORG = '22222222-2222-4222-8222-222222222222';

const memoryKv = () => {
  const m = new Map();
  return { get: async (k) => m.get(k) ?? null, put: async (k, v) => { m.set(k, v); } };
};

/** A stand-in Supabase: `good` is the one token it accepts; `profile` / `org` are what it holds. */
function fakeSupabase({ good = 'good.token.sig', profile = { organization_id: ORG, role: 'owner' }, org = { id: ORG }, down = false } = {}) {
  const calls = [];
  const fetch = async (url, { headers }) => {
    calls.push(url);
    if (down) throw new Error('offline');
    const ok = headers.authorization === `Bearer ${good}`;
    const u = new URL(url);
    if (u.pathname === '/auth/v1/user') return ok ? Response.json({ id: USER }) : Response.json({ msg: 'bad jwt' }, { status: 401 });
    if (!ok) return Response.json({ message: 'JWT expired' }, { status: 401 });
    if (u.pathname === '/rest/v1/profiles') return Response.json(profile ? [profile] : []);
    if (u.pathname === '/rest/v1/organizations') return Response.json(org ? [org] : []);
    return new Response('?', { status: 500 });
  };
  return { fetch, calls };
}

const req = (token, { method = 'GET', ip = '203.0.113.9' } = {}) => new Request('https://getpoolnautics.com/api/support-line', {
  method,
  headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), 'cf-connecting-ip': ip },
});
const env = (extra = {}) => ({ FORM_LIMITS: memoryKv(), SUPPORT_PHONE: NUMBER, SUPPORT_HOURS: 'Mon–Fri, 8am–5pm ET', ...extra });

async function call(token, { envExtra, sb, ...opts } = {}) {
  const s = sb ?? fakeSupabase();
  const res = await handleSupportLine(req(token, opts), env(envExtra), { fetch: s.fetch });
  const text = await res.text();
  return { res, text, body: JSON.parse(text) };
}

const privateHeaders = (res) => {
  assert.equal(res.headers.get('cache-control'), 'private, no-store');
  assert.equal(res.headers.get('cdn-cache-control'), 'no-store');
  assert.match(res.headers.get('vary'), /Authorization/);
};

test('eligible office login gets the number, privately', async () => {
  const { res, body } = await call('good.token.sig');
  assert.equal(res.status, 200);
  assert.deepEqual(body, { phone: NUMBER, tel: 'tel:+15558675309', hours: 'Mon–Fri, 8am–5pm ET' });
  privateHeaders(res);
});

test('no sign-in: 401, no number', async () => {
  const { res, text } = await call(null);
  assert.equal(res.status, 401);
  assert.ok(!text.includes('867'));
  privateHeaders(res);
});

test('expired, signed-out or forged token: 401, no number', async () => {
  for (const t of ['expired.token.sig', 'forged', 'a.b.c']) {
    const { res, text } = await call(t);
    assert.equal(res.status, 401, t);
    assert.ok(!text.includes('867'));
  }
});

test('malformed Authorization header is treated as no sign-in', async () => {
  const s = fakeSupabase();
  const r = new Request('https://x/api/support-line', { headers: { authorization: 'Bearer good token "x"' } });
  const res = await handleSupportLine(r, env(), { fetch: s.fetch });
  assert.equal(res.status, 401);
  assert.equal(s.calls.length, 0);
});

test('signed in without a company, or with a missing company: 403', async () => {
  for (const sb of [fakeSupabase({ profile: null }), fakeSupabase({ profile: { organization_id: null, role: 'owner' } }), fakeSupabase({ org: null })]) {
    const { res, text } = await call('good.token.sig', { sb });
    assert.equal(res.status, 403);
    assert.ok(!text.includes('867'));
    privateHeaders(res);
  }
});

test('technician login: 403', async () => {
  for (const role of ['technician', 'Repair Tech', 'repair-tech']) {
    const { res } = await call('good.token.sig', { sb: fakeSupabase({ profile: { organization_id: ORG, role } }) });
    assert.equal(res.status, 403, role);
  }
});

test('trial and paying companies alike: the check reads no plan', () => {
  assert.equal(isEligible({ organization_id: ORG, role: 'admin' }, { id: ORG }), true);
  assert.equal(isEligible({ organization_id: ORG, role: 'manager' }, { id: ORG }), true);
  assert.equal(isEligible({ organization_id: ORG, role: 'owner' }, { id: 'someone-else' }), false);
});

test('number not set yet: 404 "not configured", after the sign-in checks', async () => {
  const unset = await call('good.token.sig', { envExtra: { SUPPORT_PHONE: '', SUPPORT_HOURS: '' } });
  assert.equal(unset.res.status, 404);
  assert.deepEqual(unset.body, { error: 'not configured' });
  const signedOut = await call(null, { envExtra: { SUPPORT_PHONE: '' } });
  assert.equal(signedOut.res.status, 401);
});

test('only GET', async () => {
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const { res } = await call('good.token.sig', { method });
    assert.equal(res.status, 405);
  }
});

test('rate limited per IP per hour', async () => {
  const kv = memoryKv();
  const s = fakeSupabase();
  let last;
  for (let i = 0; i <= REQUESTS_PER_IP_PER_HOUR; i += 1) last = await handleSupportLine(req('good.token.sig'), env({ FORM_LIMITS: kv }), { fetch: s.fetch, now: 0 });
  assert.equal(last.status, 429);
  assert.ok(!(await last.text()).includes('867'));
  const otherIp = await handleSupportLine(req('good.token.sig', { ip: '198.51.100.1' }), env({ FORM_LIMITS: kv }), { fetch: s.fetch, now: 0 });
  assert.equal(otherIp.status, 200);
  const nextHour = await handleSupportLine(req('good.token.sig'), env({ FORM_LIMITS: kv }), { fetch: s.fetch, now: 3_600_000 });
  assert.equal(nextHour.status, 200);
});

test('Supabase down or no rate-limit store: refuses, no number', async () => {
  const down = await call('good.token.sig', { sb: fakeSupabase({ down: true }) });
  assert.equal(down.res.status, 502);
  assert.ok(!down.text.includes('867'));
  const noKv = await handleSupportLine(req('good.token.sig'), { SUPPORT_PHONE: NUMBER }, { fetch: fakeSupabase().fetch });
  assert.equal(noKv.status, 503);
});

test('telHref', () => {
  assert.equal(telHref('(727) 555-0100'), 'tel:+17275550100');
  assert.equal(telHref('+44 20 7946 0000'), 'tel:+442079460000');
  assert.equal(telHref('1-727-555-0100'), 'tel:+17275550100');
});
