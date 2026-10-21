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

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/landing.jsx', './pages/pricing.jsx', './landing/**/*.{js,jsx}'],
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
