// The review popup's only always-loaded code: a few lines app.jsx installs once, with VITE_REVIEWS=1.
// Any link to /reviews/write, on any page, opens the popup (ReviewDialog.jsx) over that page instead of
// going there. The popup, its styles and supabase-js load only then, warmed as the pointer or keyboard
// reaches such a link, so no page loads any of it up front.

const WRITE_PATH = /^\/reviews\/write\/?$/;

let dialog = null; // the popup's { open } once mounted
let mounting = null;

const load = () => Promise.all([import('react'), import('react-dom/client'), import('./ReviewDialog.jsx')]);

function mount() {
  mounting ??= load().then(([React, { createRoot }, { default: ReviewDialog }]) => new Promise((resolve) => {
    const host = document.createElement('div');
    host.id = 'review-popup';
    document.body.appendChild(host);
    createRoot(host).render(React.createElement(ReviewDialog, { register: (api) => { dialog = api; resolve(api); } }));
  }));
  return mounting;
}

/** Opens the popup over the current page. `returning`: back from Google or Apple by a full page trip. */
export function openReview(options) {
  if (dialog) dialog.open(options);
  else mount().then((api) => api.open(options));
}

const writeLink = (target) => {
  const a = target instanceof Element ? target.closest('a[href]') : null;
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return null;
  const url = new URL(a.href, window.location.href);
  return url.origin === window.location.origin && WRITE_PATH.test(url.pathname) ? a : null;
};

/** True on the small Google / Apple window's page, which app.jsx renders instead of the site. */
export const isOAuthReturn = () => WRITE_PATH.test(window.location.pathname)
  && new URLSearchParams(window.location.search).get('review') === 'oauth';

let installed = false;
export function installReviewLinks() {
  if (installed || isOAuthReturn()) return;
  installed = true;
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!writeLink(e.target)) return;
    e.preventDefault();
    openReview();
  });
  const warm = (e) => { if (writeLink(e.target)) load(); };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);

  // /reviews/write itself (a shared link), or back from Google or Apple by a full page trip.
  const params = new URLSearchParams(window.location.search);
  if (WRITE_PATH.test(window.location.pathname) || params.get('review') === 'open') openReview({ returning: true });
}
