// scripts/csp.mjs: the Content-Security-Policy the build writes into dist/_headers. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPolicy, inlineHandlerHashes, inlineScriptHashes } from './csp.mjs';

const sha = (t) => `'sha256-${createHash('sha256').update(t, 'utf8').digest('base64')}'`;
const directive = (policy, name) => policy.split('; ').find((d) => d.startsWith(`${name} `)) ?? '';

test('inline scripts are allowed by the hash of their exact text', () => {
  const html = '<head><script>(function(){var R=1})()</script><script type="module">import "/a.js"</script></head>';
  assert.deepEqual([...inlineScriptHashes(html)].sort(), [sha('(function(){var R=1})()'), sha('import "/a.js"')].sort());
});

test('scripts with a src, JSON-LD and other data blocks are not inline code', () => {
  const html = '<script src="/assets/x.js"></script><script type="application/ld+json">{"@type":"Org"}</script><script type="text/plain">x</script><script></script>';
  assert.equal(inlineScriptHashes(html).size, 0);
});

test('inline handlers are hashed as the browser reads them, entities decoded', () => {
  const html = `<link rel="stylesheet" href="/a.css" media="print" onload="this.media='all'"><img onerror='a(&quot;b&quot;)'>`;
  assert.deepEqual([...inlineHandlerHashes(html)].sort(), [sha("this.media='all'"), sha('a("b")')].sort());
});

test('the policy: own scripts and the build\'s hashes only; handlers only with unsafe-hashes', () => {
  const p = buildPolicy({ hashes: new Set([sha('x')]), handlers: new Set([sha('y')]), supabase: 'https://ref.supabase.co' });
  const script = directive(p, 'script-src');
  assert.match(script, /^script-src 'self' /);
  assert.ok(script.includes(sha('x')) && script.includes(`'unsafe-hashes' ${sha('y')}`));
  assert.ok(!script.includes("'unsafe-inline'") && !script.includes("'unsafe-eval'"));
  assert.ok(!buildPolicy({ hashes: new Set() }).includes('unsafe-hashes'));
});

test('connections: the site, its Supabase, the app\'s sign-in, Turnstile and analytics, nothing else', () => {
  const p = buildPolicy({ hashes: new Set(), supabase: 'https://ref.supabase.co', signin: 'https://app.example.com/api/auth/signin' });
  assert.equal(directive(p, 'connect-src'),
    "connect-src 'self' https://ref.supabase.co https://app.example.com https://challenges.cloudflare.com https://cloudflareinsights.com");
  // With no sign-in address given, the production app's.
  assert.match(directive(buildPolicy({ hashes: new Set() }), 'connect-src'), /https:\/\/app\.poolnautics\.app/);
});

test('framing, plugins, base and form targets are locked down', () => {
  const p = buildPolicy({ hashes: new Set() });
  for (const d of ["object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'", 'frame-src https://challenges.cloudflare.com']) {
    assert.ok(p.includes(d), d);
  }
});
