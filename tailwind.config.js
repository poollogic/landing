import plugin from 'tailwindcss/plugin';

// Tailwind is used only by the homepage and /pricing. Its CSS is imported by
// pages/landing.jsx and pages/pricing.jsx, so it loads with those routes alone
// and never touches the rest of the site.

// Marketing palette — single source of truth. Exposed both as Tailwind colors
// (bg-mktg-base, text-mktg-muted, bg-mktg-accent/20, …) and as --mktg-* CSS
// variables for any hand-written CSS.
const MKTG = {
  'bg-base': '#0F172A', // Midnight Slate — primary canvas
  'bg-page': '#111318', // page behind the hero — matches the app's panel fill
  'bg-surface': '#1E293B', // feature cards & floating elements
  'text-primary': '#FFFFFF', // H1–H3 and primary CTA text only
  'text-muted': '#94A3B8', // all body copy
  accent: '#2563EB', // primary CTAs & accent lines only
  'accent-hover': '#1D4ED8',
};
const MKTG_GLOW = '0 0 80px -20px rgba(37, 99, 235, 0.25)';

// The homepage's type and spacing roles, as utilities over the tokens on :root (index.html), so a
// class like text-statement or py-section-pad-y resolves to the same variables as the CSS does.
const v = (name) => `var(--${name})`;
const ROLE_TYPE = {
  'hero-title': [v('hero-title-size'), { lineHeight: v('hero-title-leading'), fontWeight: v('hero-title-weight') }],
  statement: [v('statement-size'), { lineHeight: v('statement-leading'), letterSpacing: v('statement-tracking'), fontWeight: v('statement-weight') }],
  'section-title': [v('section-title-size'), { lineHeight: v('section-title-leading'), letterSpacing: v('section-title-tracking'), fontWeight: v('section-title-weight') }],
  closing: [v('closing-size'), { lineHeight: v('closing-leading'), letterSpacing: v('closing-tracking'), fontWeight: v('closing-weight') }],
  subhead: [v('subhead-size'), { lineHeight: v('subhead-leading'), letterSpacing: v('subhead-tracking'), fontWeight: v('subhead-weight') }],
  'card-title': [v('card-title-size'), { fontWeight: v('card-title-weight') }],
  eyebrow: [v('eyebrow-size'), { fontWeight: v('eyebrow-weight') }],
  label: [v('label-size'), { lineHeight: v('label-leading'), fontWeight: v('label-weight') }],
};
const ROLES = ['hero-title', 'statement', 'section-title', 'closing', 'subhead', 'card-title', 'eyebrow', 'label'];

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/landing.jsx', './pages/pricing.jsx', './pages/reserve.jsx', './pages/ai-integrations.jsx', './pages/workflow.jsx', './landing/**/*.{js,jsx}'],
  corePlugins: {
    // index.html already defines a global `.container`; avoid the collision.
    container: false,
  },
  theme: {
    extend: {
      colors: {
        mktg: {
          base: MKTG['bg-base'],
          page: MKTG['bg-page'],
          surface: MKTG['bg-surface'],
          primary: MKTG['text-primary'],
          muted: MKTG['text-muted'],
          accent: MKTG.accent,
          'accent-hover': MKTG['accent-hover'],
        },
        'subhead-on-light': v('subhead-on-light'),
        'subhead-on-dark': v('subhead-on-dark'),
        'eyebrow-on-light': v('eyebrow-on-light'),
        'eyebrow-on-dark': v('eyebrow-on-dark'),
      },
      fontFamily: {
        sans: ['Satoshi', '"Satoshi Fallback"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        geist: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      // Marketing type scale (used across /pricing's top section).
      fontSize: {
        badge: ['11px', '16px'],
        caption: ['12px', '16px'],
        meta: ['14px', '20px'],
        body: ['16px', '24px'],
        lead: ['18px', '28px'],
        title: ['20px', '28px'],
        display: ['44px', '1'],
        ...ROLE_TYPE,
      },
      fontWeight: {
        regular: v('fw-regular'),
        medium: v('fw-medium'),
        semibold: v('fw-semibold'),
        bold: v('fw-bold'),
        ...Object.fromEntries(ROLES.map((r) => [r, v(`${r}-weight`)])),
      },
      spacing: {
        'section-pad-y': v('section-pad-y'),
        'head-to-content': v('head-to-content'),
        'eyebrow-to-title': v('eyebrow-to-title'),
        'title-to-subhead': v('title-to-subhead'),
      },
      // Match the app: rounded-md = buttons, rounded-lg = feature cards.
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        'mktg-glow': MKTG_GLOW,
      },
      transitionTimingFunction: {
        mktg: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'mktg-fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'mktg-fade-up': 'mktg-fade-up 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          ...Object.fromEntries(Object.entries(MKTG).map(([k, v]) => [`--mktg-${k}`, v])),
          '--mktg-glow': MKTG_GLOW,
        },
      });
    }),
  ],
};
