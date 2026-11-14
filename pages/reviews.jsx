import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import '../landing/landing.css';
import '../landing/hero.css';
import '../landing/reviews/reviews.css';
import Nav from '../landing/Nav.jsx';
import ReviewCard from '../landing/reviews/ReviewCard.jsx';
import { reviewsPage } from '../landing/reviews/data.js';
import { PER_PAGE } from '../landing/reviews/config.js';
import { Footer } from '../components/site-chrome.jsx';

// /reviews (only with VITE_REVIEWS=1; app.jsx): every published review, newest first, PER_PAGE to a
// page, ?page=N. Rendered in the browser (not pre-rendered), so its relative dates are the visitor's.

const pageFromUrl = () => {
  const n = Number(new URLSearchParams(window.location.search).get('page'));
  return Number.isInteger(n) && n > 0 ? n : 1;
};

export default function ReviewsPage() {
  const [page] = useState(pageFromUrl);
  const [state, setState] = useState({ status: 'loading', rows: [], total: 0 });

  useEffect(() => {
    let live = true;
    reviewsPage(page, PER_PAGE)
      .then(({ rows, total }) => live && setState({ status: 'ready', rows, total }))
      .catch(() => live && setState({ status: 'error', rows: [], total: 0 }));
    return () => { live = false; };
  }, [page]);

  const pages = Math.max(1, Math.ceil(state.total / PER_PAGE));
  const link = (n) => (n === 1 ? '/reviews' : `/reviews?page=${n}`);

  return (
    <div className="mktg lr-page relative flex min-h-screen flex-col font-sans text-mktg-muted antialiased">
      <Nav />
      <main className="lr-page-main" aria-labelledby="reviews-page-title">
        <div className="lr-inner">
          <header className="lr-page-head">
            <p className="lr-page-eyebrow">Live from pool pros</p>
            <h1 id="reviews-page-title" className="lr-page-title">What pool pros say about Poolnautics</h1>
            <p className="lr-page-sub">Every review from a verified Poolnautics account, newest first, whatever the rating.</p>
            <a href="/reviews/write" className="hero-cta lr-page-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
              <span className="hero-cta-label">Write a review</span>
              <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </header>

          {state.status === 'loading' && <p className="lr-empty" role="status">Loading reviews…</p>}
          {state.status === 'error' && <p className="lr-empty" role="alert">The reviews couldn’t be loaded. Try again in a moment.</p>}
          {state.status === 'ready' && state.rows.length === 0 && <p className="lr-empty">No reviews here yet.</p>}
          {state.rows.length > 0 && (
            <div className="lr-grid">
              {state.rows.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}

          {state.status === 'ready' && pages > 1 && (
            <nav className="lr-pager" aria-label="Review pages">
              <a href={link(page - 1)} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined}>Newer</a>
              <span>Page {page} of {pages}</span>
              <a href={link(page + 1)} aria-disabled={page >= pages} tabIndex={page >= pages ? -1 : undefined}>Older</a>
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
