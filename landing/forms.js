// Sends one of the site's forms to /api/request (functions/api/request.js →
// server/requestForm.js). Returns { ok, already } or { error, fields }.
export async function submitForm(kind, form, { startedAt, turnstileToken } = {}) {
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch('/api/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...data, kind, startedAt, turnstileToken, page: window.location.pathname + window.location.search }),
    });
    const out = await res.json().catch(() => ({}));
    if (res.ok && out.ok) return { ok: true, already: !!out.already };
    return { error: out.error || 'Something went wrong.', fields: out.fields || {} };
  } catch {
    return { error: 'Network error.', fields: {} };
  }
}
