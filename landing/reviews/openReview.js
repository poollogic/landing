// The review popup's only always-loaded code: a few lines app.jsx installs once, with VITE_REVIEWS=1.
// Any link to /reviews/write, on any page, opens the popup (ReviewDialog.jsx) over that page instead of
// going there. The popup and its styles load only then, warmed as the pointer or keyboard reaches such
// a link, so no page loads any of it up front.
import { isPopupClick, isWritePath } from './logic.js';

let dialog = null; // the popup's { open } once mounted
let mounting = null;

// A load that fails (a flaky connection, or a tab left open across a deploy, whose old file names are
// gone) is forgotten, so the next try starts over.
let loading = null;
const load = () => {
  loading ??= Promise.all([import('react'), import('react-dom/client'), import('./ReviewDialog.jsx')])
    .catch((err) => { loading = null; throw err; });
  return loading;
};

function mount() {
  mounting ??= load()
    .then(([React, { createRoot }, { default: ReviewDialog }]) => new Promise((resolve) => {
      const host = document.createElement('div');
      host.id = 'review-popup';
      document.body.appendChild(host);
      createRoot(host).render(React.createElement(ReviewDialog, { register: (api) => { dialog = api; resolve(api); } }));
    }))
    .catch((err) => { mounting = null; throw err; });
  return mounting;
}

/**
 * Opens the popup over the current page. `returning`: back from Google or Apple by a full page trip.
 * Resolves false if the popup couldn't load.
 */
export function openReview(options) {
  if (dialog) { dialog.open(options); return Promise.resolve(true); }
  return mount().then((api) => { api.open(options); return true; }, () => false);
}

/** True on the small Google / Apple window's page, which app.jsx renders instead of the site. */
export const isOAuthReturn = () => isWritePath(window.location.pathname)
  && new URLSearchParams(window.location.search).get('review') === 'oauth';

const linkOf = (target) => (target instanceof Element ? target.closest('a[href]') : null);

let installed = false;
export function installReviewLinks() {
  if (installed || isOAuthReturn()) return;
  installed = true;
  document.addEventListener('click', (e) => {
    const link = linkOf(e.target);
    if (!isPopupClick(e, link, window.location.origin)) return;
    e.preventDefault();
    // If the popup can't load, the link goes where it says: /reviews/write, a fresh page with it open.
    openReview().then((ok) => { if (!ok) window.location.assign(link.href); });
  });
  const warm = (e) => { if (isPopupClick({ button: 0 }, linkOf(e.target), window.location.origin)) load().catch(() => {}); };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);

  // /reviews/write itself (a shared link), or back from Google or Apple by a full page trip.
  const params = new URLSearchParams(window.location.search);
  if (isWritePath(window.location.pathname) || params.get('review') === 'open') openReview({ returning: true });
}
