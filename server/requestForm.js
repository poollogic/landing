// The site's form handler: "Reserve your spot" (/reserve), demo requests and
// Partner Program applications (/contact). Runs as a Cloudflare Pages Function
// (functions/api/request.js). For each accepted request it emails the owner (Resend),
// sends the person a personal confirmation, and adds waitlist sign-ups to a Resend
// segment ("Waitlist") for later updates.
//
// Spam and abuse protection, in order:
//   1. Only POSTs from the site's own origin, with a small JSON body.
//   2. At most LIMITS.ipAttemptsPerHour tries per IP per hour (failed ones count).
//   3. A honeypot field and a "filled in too fast to be human" check (bots get a
//      silent success and nothing is sent).
//   4. Every field validated: length limits, an email check, and choices that must
//      match formOptions.js exactly.
//   5. Cloudflare Turnstile (invisible bot check), whenever TURNSTILE_SECRET_KEY is set.
//   6. After a send: that email can't send the same form again for LIMITS.emailLockDays
//      ("you're already on the list"), and that IP is locked for LIMITS.ipLockHours.
//      This also stops anyone using the auto-reply to email-bomb someone else.
//   7. A daily cap on sends across the whole site.
//
// Environment (Cloudflare Pages → Settings → Variables and Secrets / Bindings):
//   FORM_LIMITS           KV namespace binding (required): attempt counts and lockouts
//   RESEND_API_KEY        secret (required)
//   NOTIFY_TO             inbox that receives every request (required)
//   MAIL_FROM             e.g. "Jonathan Timms <jonathan@poollogic.app>" (a poollogic.app address)
//   REPLY_TO              where replies to the confirmation go (defaults to NOTIFY_TO)
//   RESEND_AUDIENCE_ID    optional: the Resend *segment* ID ("Waitlist") sign-ups are added to
//                         (Resend replaced audiences with segments; the variable keeps its name)
//   TURNSTILE_SECRET_KEY  secret: turns on the Turnstile check (strongly recommended)
//   ALLOWED_ORIGINS       optional, comma-separated (default: poollogic.app and www)
//   MAIL_DRY_RUN          "1" for local testing: logs emails instead of sending them

import { CUSTOMER_OPTIONS, SOFTWARE_OPTIONS, TIMING_OPTIONS, PLAN_OPTIONS } from '../formOptions.js';

export const LIMITS = {
  maxBodyBytes: 10_000,
  ipAttemptsPerHour: 5,
  ipLockHours: 12,
  emailLockDays: 30,
  dailySends: 150,
  minFillMs: 3_000, // a human takes longer than this to fill in the form
  maxFormAgeMs: 24 * 60 * 60_000, // a page left open longer than this must be reloaded
};

const DEFAULT_ORIGINS = ['https://poollogic.app', 'https://www.poollogic.app'];
const DEFAULT_FROM = 'Jonathan Timms <jonathan@poollogic.app>';
const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;

// ── Fields per form ────────────────────────────────────────────────────────
const text = (max, required = true) => ({ type: 'text', max, required });
const choice = (options, required = true) => ({ type: 'choice', options, required });
const COMMON = {
  name: text(100),
  business: text(150),
  email: { type: 'email', required: true },
  phone: { type: 'phone', required: false },
};
export const FORMS = {
  waitlist: {
    label: 'Spot request',
    fields: { ...COMMON, customers: choice(CUSTOMER_OPTIONS), software: choice(SOFTWARE_OPTIONS), timing: choice(TIMING_OPTIONS), message: text(2000, false) },
  },
  demo: {
    label: 'Demo request',
    fields: { ...COMMON, customers: choice(CUSTOMER_OPTIONS), plan: choice(PLAN_OPTIONS), message: text(2000, false) },
  },
  partner: {
    label: 'Partner application',
    fields: { ...COMMON, message: text(2000) },
  },
};

const FIELD_LABELS = {
  name: 'Name', business: 'Business', email: 'Email', phone: 'Phone', customers: 'Active customers',
  software: 'Current software', timing: 'Wants to switch', plan: 'Plan', message: 'Message',
};

/** Validates and cleans a submission. Returns { values } or { errors: { field: message } }. */
export function validate(kind, body) {
  const form = FORMS[kind];
  if (!form) return { errors: { kind: 'Unknown form.' } };
  const values = {};
  const errors = {};
  for (const [field, rule] of Object.entries(form.fields)) {
    const raw = body[field];
    const v = typeof raw === 'string' ? raw.replace(/\r\n?/g, '\n').trim() : '';
    if (!v) {
      if (rule.required) errors[field] = 'Required.';
      continue;
    }
    if (rule.type === 'text') {
      if (v.length > rule.max) errors[field] = `Keep it under ${rule.max} characters.`;
      // Single-line fields: no line breaks (they go into email subjects and headers).
      else values[field] = field === 'message' ? v : v.replace(/\s+/g, ' ');
    } else if (rule.type === 'email') {
      if (v.length > 254 || !EMAIL_RE.test(v)) errors[field] = 'Enter a valid email address.';
      else values[field] = v.toLowerCase();
    } else if (rule.type === 'phone') {
      if (v.length > 40 || !/^[0-9+().\-\s]+$/.test(v)) errors[field] = 'Enter a valid phone number.';
      else values[field] = v;
    } else if (rule.type === 'choice') {
      if (!rule.options.includes(v)) errors[field] = 'Pick one of the options.';
      else values[field] = v;
    }
  }
  return Object.keys(errors).length ? { errors } : { values };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const oneLine = (s, max = 120) => String(s).replace(/[\r\n]+/g, ' ').slice(0, max);
const firstName = (name) => oneLine(name).split(' ')[0];
// "Bayside Pool Co." + "." → "Bayside Pool Co." (no double full stop).
const endSentence = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

async function sha256(s) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function bump(kv, key, ttlSeconds) {
  const n = Number(await kv.get(key)) + 1;
  await kv.put(key, String(n), { expirationTtl: Math.max(60, ttlSeconds) });
  return n;
}

async function verifyTurnstile(secret, token, ip) {
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = await res.json();
    return out.success === true;
  } catch {
    return false;
  }
}

async function resend(env, path, payload, { quiet = false } = {}) {
  if (env.MAIL_DRY_RUN === '1') {
    console.log('[dry run] Resend', path, payload ? JSON.stringify(payload).slice(0, 500) : '');
    return { ok: true };
  }
  const res = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, ...(payload ? { 'content-type': 'application/json' } : {}) },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok && !quiet) console.error('Resend', path, res.status, (await res.text()).slice(0, 300));
  return { ok: res.ok };
}

// Waitlist sign-ups: create the contact in the segment, or, if they're already a
// contact, add the existing contact to the segment.
async function addToSegment(env, segmentId, values) {
  const [first, ...rest] = values.name.split(' ');
  const created = await resend(env, '/contacts', {
    email: values.email, first_name: first, last_name: rest.join(' '), unsubscribed: false, segments: [{ id: segmentId }],
  }, { quiet: true });
  if (!created.ok) await resend(env, `/contacts/${encodeURIComponent(values.email)}/segments/${segmentId}`);
}

// ── The emails ─────────────────────────────────────────────────────────────
function ownerEmail(kind, v, meta) {
  const lines = Object.keys(FORMS[kind].fields).filter((f) => v[f]).map((f) => `${FIELD_LABELS[f]}: ${v[f]}`);
  const textBody = `${FORMS[kind].label} from poollogic.app\n\n${lines.join('\n')}\n\nCountry: ${meta.country || 'unknown'}\nPage: ${meta.page || 'unknown'}\n\nReply to this email to answer ${firstName(v.name)} directly.`;
  const size = v.customers ? ` (${v.customers} customers)` : '';
  return {
    subject: oneLine(`${FORMS[kind].label}: ${v.business}${size}`, 150),
    text: textBody,
    html: `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1d1d1f"><p style="margin:0 0 12px"><strong>${escapeHtml(FORMS[kind].label)}</strong> from poollogic.app</p><table style="border-collapse:collapse">${Object.keys(FORMS[kind].fields).filter((f) => v[f]).map((f) => `<tr><td style="padding:3px 16px 3px 0;color:#6e6e73;vertical-align:top">${FIELD_LABELS[f]}</td><td style="padding:3px 0;white-space:pre-wrap">${escapeHtml(v[f])}</td></tr>`).join('')}</table><p style="margin:16px 0 0;color:#6e6e73;font-size:13px">Country: ${escapeHtml(meta.country || 'unknown')} · Page: ${escapeHtml(meta.page || 'unknown')}<br>Reply to this email to answer ${escapeHtml(firstName(v.name))} directly.</p></div>`,
  };
}

const CONFIRMATIONS = {
  waitlist: (v) => ({
    subject: oneLine(`You're on the list, ${firstName(v.name)}`),
    paragraphs: [
      `Hi ${firstName(v.name)},`,
      `Thanks for reserving a spot for ${endSentence(v.business)} We bring on new pool companies in small groups, so we're here to answer every question and make sure your setup, and your whole experience, is right from day one.`,
      `I read every request myself, and I'll reach out before your group opens to plan moving your customers over and walk you through everything.`,
      `In the meantime, if you have a question, just reply to this email. It comes straight to me.`,
    ],
  }),
  demo: (v) => ({
    subject: oneLine(`Thanks, ${firstName(v.name)}. We'll be in touch`),
    paragraphs: [
      `Hi ${firstName(v.name)},`,
      `Thanks for your interest in PoolLogic for ${endSentence(v.business)} I'll get back to you within one business day to set up a time to walk you through it on your own routes and customers.`,
      `If anything comes up before then, just reply to this email.`,
    ],
  }),
  partner: (v) => ({
    subject: 'We got your Partner Program application',
    paragraphs: [
      `Hi ${firstName(v.name)},`,
      `Thanks for applying to the PoolLogic Partner Program. I review every application myself and will reply within 3 business days.`,
      `If you have questions in the meantime, just reply to this email.`,
    ],
  }),
};

function confirmationEmail(kind, v) {
  const { subject, paragraphs } = CONFIRMATIONS[kind](v);
  const signature = ['Jonathan Timms', 'Founder, PoolLogic', 'poollogic.app'];
  return {
    subject,
    text: `${paragraphs.join('\n\n')}\n\n${signature.join('\n')}`,
    html: `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1d1d1f;max-width:560px">${paragraphs.map((p) => `<p style="margin:0 0 14px">${escapeHtml(p)}</p>`).join('')}<p style="margin:22px 0 0">${signature.map(escapeHtml).join('<br>')}</p></div>`,
  };
}

// ── The handler ────────────────────────────────────────────────────────────
export async function handleFormRequest(request, env, now = Date.now()) {
  // 1. Origin and size
  const allowed = env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : DEFAULT_ORIGINS;
  const origin = request.headers.get('origin');
  if (!origin || !allowed.includes(origin)) return json(403, { error: 'Not allowed.' });
  if (Number(request.headers.get('content-length') || 0) > LIMITS.maxBodyBytes) return json(413, { error: 'That message is too long.' });
  const raw = await request.text();
  if (raw.length > LIMITS.maxBodyBytes) return json(413, { error: 'That message is too long.' });

  const kv = env.FORM_LIMITS;
  if (!kv || !env.RESEND_API_KEY || !env.NOTIFY_TO) {
    console.error('Form handler is not configured (FORM_LIMITS, RESEND_API_KEY, NOTIFY_TO).');
    return json(503, { error: 'Our form is having trouble right now.' });
  }

  // 2. Attempts per IP per hour (counts every try, valid or not)
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const ipKey = await sha256(`ip:${ip}`);
  if ((await bump(kv, `att:${ipKey}`, 3600)) > LIMITS.ipAttemptsPerHour) {
    return json(429, { error: 'Too many tries from your connection. Please wait an hour and try again.' });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Something went wrong. Please reload the page and try again.' });
  }
  const kind = typeof body.kind === 'string' ? body.kind : '';
  if (!FORMS[kind]) return json(400, { error: 'Something went wrong. Please reload the page and try again.' });

  // 3. Honeypot and fill time: look like a success to bots, send nothing.
  const startedAt = Number(body.startedAt);
  if (body.company_website) return json(200, { ok: true });
  if (!Number.isFinite(startedAt) || now - startedAt < LIMITS.minFillMs) return json(200, { ok: true });
  if (now - startedAt > LIMITS.maxFormAgeMs) return json(400, { error: 'This page has been open a while. Please reload it and try again.' });

  // 4. Fields
  const { values, errors } = validate(kind, body);
  if (errors) return json(422, { error: 'Please check the highlighted fields.', fields: errors });

  // 6a. Lockouts from earlier sends
  const emailKey = await sha256(`email:${kind}:${values.email}`);
  if (await kv.get(`sent:${emailKey}`)) return json(200, { ok: true, already: true });
  if (await kv.get(`ipsent:${ipKey}`)) {
    return json(429, { error: 'We already have a request from your connection. We’ll be in touch soon.' });
  }

  // 7. Daily cap across the site
  const dayKey = `day:${new Date(now).toISOString().slice(0, 10)}`;
  if (Number(await kv.get(dayKey)) >= LIMITS.dailySends) {
    return json(503, { error: 'We’re getting a lot of requests today. Please try again tomorrow.' });
  }

  // 5. Turnstile
  if (env.TURNSTILE_SECRET_KEY && !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, body.turnstileToken, ip))) {
    return json(403, { error: 'We couldn’t confirm you’re not a bot. Please reload the page and try again.' });
  }

  // Send: the owner's copy must go through; the confirmation and the list are best effort.
  const meta = { country: request.headers.get('cf-ipcountry'), page: typeof body.page === 'string' ? oneLine(body.page, 200) : '' };
  const from = env.MAIL_FROM || DEFAULT_FROM;
  const owner = ownerEmail(kind, values, meta);
  const notified = await resend(env, '/emails', { from, to: [env.NOTIFY_TO], reply_to: values.email, ...owner });
  if (!notified.ok) return json(502, { error: 'Something went wrong sending your request.' });

  const confirmation = confirmationEmail(kind, values);
  await resend(env, '/emails', { from, to: [values.email], reply_to: env.REPLY_TO || env.NOTIFY_TO, ...confirmation });
  if (kind === 'waitlist' && env.RESEND_AUDIENCE_ID) await addToSegment(env, env.RESEND_AUDIENCE_ID, values);

  // 6b. Lock this email and this IP, and count the send.
  await kv.put(`sent:${emailKey}`, '1', { expirationTtl: LIMITS.emailLockDays * 86400 });
  await kv.put(`ipsent:${ipKey}`, '1', { expirationTtl: LIMITS.ipLockHours * 3600 });
  await bump(kv, dayKey, 2 * 86400);

  return json(200, { ok: true });
}
