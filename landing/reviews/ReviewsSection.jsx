import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../SectionHeader.jsx';

// "Live from pool pros": between Fleet on autopilot (#fleet) and Instant Migration (#switching), only
// with VITE_REVIEWS=1 (BelowFold.jsx). The three newest published reviews, or nothing at all while
// there are fewer than three. Nothing is in the pre-rendered homepage: it renders nothing on the server
// and on the first render, then loads the reviews, their cards and their stylesheet after the page has
// loaded, so the flag-off build ships none of it. Styles: reviews.css; type and spacing: home-roles.css.

export default function ReviewsSection() {
  const [loaded, setLoaded] = useState(null); // { reviews, ReviewCard }

  useEffect(() => {
    let live = true;
    Promise.all([import('./data.js'), import('./ReviewCard.jsx'), import('./reviews.css')])
      .then(([data, card]) => data.newestReviews(3).then((reviews) => {
        if (live && reviews.length >= 3) setLoaded({ reviews, ReviewCard: card.default });
      }))
      .catch(() => {}); // no reviews section rather than a broken one
    return () => { live = false; };
  }, []);

  if (!loaded) return null;
  const { reviews, ReviewCard } = loaded;
  return (
    <section id="reviews" className="lr-section" aria-labelledby="reviews-heading">
      <div className="lr-inner">
        <SectionHeader
          id="reviews-heading"
          eyebrow="Live from pool pros"
          title="Use Poolnautics? Tell the industry what you think."
          subtitle="Share your honest review and it goes live right here, with your company name and a link to your website. Show customers and other pool pros that you run your business seriously."
          titleClassName="lr-title"
        />
        <div className="lr-head-cta">
          <a href="/reviews/write" className="hero-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
            <span className="hero-cta-label">Write a review</span>
            <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <p className="lr-fine">Reviews from verified Poolnautics accounts publish instantly. Every reviewer gets a featured listing, whatever the rating.</p>
        </div>

        <div className="lr-grid">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
        <p className="lr-all"><a href="/reviews">See all reviews</a></p>
      </div>
    </section>
  );
}
