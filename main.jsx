import React from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
