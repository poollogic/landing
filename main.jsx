import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './app.jsx';

// If a page's code file fails to load (e.g. a deploy rolling out mid-visit),
// reload once instead of showing the error screen. The flag stops a loop.
window.addEventListener('vite:preloadError', (event) => {
  if (sessionStorage.getItem('pl-reloaded')) return;
  sessionStorage.setItem('pl-reloaded', '1');
  event.preventDefault();
  window.location.reload();
});
window.addEventListener('load', () => setTimeout(() => sessionStorage.removeItem('pl-reloaded'), 10000));

// A pre-rendered page (entry-server.jsx) arrives with its markup in #root: hydrate it. Every
// other route arrives empty and renders here.
const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
