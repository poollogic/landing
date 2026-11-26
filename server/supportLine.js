// GET /api/support-line (functions/api/support-line.js): the direct support phone number and hours, for
// signed-in Poolnautics customers only (the "Customer support" card on /contact, landing/contact/).
//
// The number and hours live ONLY here, in the server's own settings (Cloudflare Pages → Settings →
// Variables and Secrets, as secrets): never in the site's code, its build or the page. This answers with
// them only when the request carries a valid sign-in (a Supabase access token from the site's sign-in,
// the same one the review popup uses) for an eligible account (isEligible), and refuses otherwise.
//
// Environment:
//   SUPPORT_PHONE     the number as people should see it, e.g. "(555) 123-4567" (secret)
//   SUPPORT_HOURS     e.g. "Mon–Fri, 8am–5pm ET" (secret; optional)
//   FORM_LIMITS       KV namespace binding (the forms' own, server/requestForm.js): request counts per IP
//   SUPABASE_URL, SUPABASE_ANON_KEY   optional; default to production's (public values)
//
// Answers, all with Cache-Control: private, no-store (never kept by Cloudflare or any shared cache):
//   200 { phone, tel, hours }   signed in, eligible, and the number is set
//   401  no sign-in, or one Supabase doesn't accept (expired, signed out, forged)
//   403  signed in, but not an eligible account
//   404  eligible, but SUPPORT_PHONE isn't set yet ("not configured")
//   405  anything but GET
//   429  too many requests from this IP
//   502/503  Supabase unreachable, or the rate-limit store missing
// No answer but the 200 carries the number, and nothing here logs it.

export const PROD_SUPABASE_URL = 'https://agxbzkvbnyuzmlogezwc.supabase.co';
export const PROD_SUPABASE_ANON_KEY = 'sb_publishable_mOm6SWnEv4KTMbWV-CuUVA_2yLDW8qY';
export const REQUESTS_PER_IP_PER_HOUR = 60;

const HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'private, no-store',
  'cdn-cache-control': 'no-store',
  vary: 'Authorization',
  'x-content-type-options': 'nosniff',
};
const json = (status, data, extra = {}) => new Response(JSON.stringify(data), { status, headers: { ...HEADERS, ...extra } });

/** Technician (phone-app) logins, as the app and the review popup name them (landing/reviews/logic.js). */
const PHONE_ONLY_ROLES = ['technician', 'repair_tech'];
const roleKey = (role) => String(role ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');

/**
 * Who may see the line: the one check. An office login (owner, admin, manager…) of a company that exists
 * in Poolnautics, trials included (the owner, Nov 26, 2026). Technician logins can't use the site's
 * sign-in by password (the app refuses them), so they're refused here too.
 */
export function isEligible(profile, organization) {
  return Boolean(profile?.organization_id && organization?.id && organization.id === profile.organization_id && !PHONE_ONLY_ROLES.includes(roleKey(profile.role)));
}

/** "(555) 123-4567" → "+15551234567"; a number that already starts with + keeps its country code. */
export function telHref(phone) {
  const digits = String(phone).replace(/[^\d]/g, '');
  if (String(phone).trim().startsWith('+')) return `tel:+${digits}`;
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

const bearer = (request) => {
  const m = /^Bearer\s+([A-Za-z0-9._~+/-]+=*)$/.exec(request.headers.get('authorization') ?? '');
  return m && m[1].length <= 8192 ? m[1] : null;
};

async function sha256(s) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Counts this IP's requests in the current hour. True while it's within the limit. */
async function withinLimit(kv, ip, now) {
  const key = `sl:${await sha256(`ip:${ip}`)}:${Math.floor(now / 3_600_000)}`;
  const n = Number(await kv.get(key)) + 1;
  await kv.put(key, String(n), { expirationTtl: 3600 + 60 });
  return n <= REQUESTS_PER_IP_PER_HOUR;
}

export async function handleSupportLine(request, env, { fetch: fetchImpl = fetch, now = Date.now() } = {}) {
  if (request.method !== 'GET') return json(405, { error: 'Method not allowed.' }, { allow: 'GET' });

  const kv = env.FORM_LIMITS;
  if (!kv) return json(503, { error: 'Not available right now.' });
  if (!(await withinLimit(kv, request.headers.get('cf-connecting-ip') || 'unknown', now))) {
    return json(429, { error: 'Too many requests. Try again later.' }, { 'retry-after': '3600' });
  }

  const token = bearer(request);
  if (!token) return json(401, { error: 'Sign in to see this.' });

  const base = (env.SUPABASE_URL || PROD_SUPABASE_URL).replace(/\/+$/, '');
  const apikey = env.SUPABASE_ANON_KEY || PROD_SUPABASE_ANON_KEY;
  const asUser = { apikey, authorization: `Bearer ${token}`, accept: 'application/json' };
  const get = async (path) => {
    try {
      return await fetchImpl(`${base}${path}`, { headers: asUser });
    } catch {
      return null;
    }
  };

  // 1. The sign-in itself, checked by Supabase (expired, signed out or forged tokens are refused there).
  const userRes = await get('/auth/v1/user');
  if (!userRes) return json(502, { error: 'Couldn’t check your sign-in. Try again.' });
  if (userRes.status === 401 || userRes.status === 403) return json(401, { error: 'Sign in to see this.' });
  if (!userRes.ok) return json(502, { error: 'Couldn’t check your sign-in. Try again.' });
  const user = await userRes.json().catch(() => null);
  if (!user?.id || !/^[0-9a-f-]{36}$/i.test(user.id)) return json(401, { error: 'Sign in to see this.' });

  // 2. Their profile and company, read as them (the database's own rules: their own rows only).
  const profileRes = await get(`/rest/v1/profiles?select=organization_id,role&id=eq.${user.id}&limit=1`);
  if (!profileRes) return json(502, { error: 'Couldn’t check your account. Try again.' });
  if (profileRes.status === 401) return json(401, { error: 'Sign in to see this.' });
  if (!profileRes.ok) return json(502, { error: 'Couldn’t check your account. Try again.' });
  const [profile] = (await profileRes.json().catch(() => [])) ?? [];
  let organization = null;
  if (profile?.organization_id && /^[0-9a-f-]{36}$/i.test(profile.organization_id)) {
    const orgRes = await get(`/rest/v1/organizations?select=id&id=eq.${profile.organization_id}&limit=1`);
    if (!orgRes || !orgRes.ok) return json(502, { error: 'Couldn’t check your account. Try again.' });
    [organization] = (await orgRes.json().catch(() => [])) ?? [];
  }
  if (!isEligible(profile, organization)) return json(403, { error: 'This sign-in isn’t a Poolnautics company account.' });

  // 3. The number, if it's been set.
  const phone = String(env.SUPPORT_PHONE ?? '').trim();
  if (!phone) return json(404, { error: 'not configured' });
  return json(200, { phone, tel: telHref(phone), hours: String(env.SUPPORT_HOURS ?? '').trim() });
}
