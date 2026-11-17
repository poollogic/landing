import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { STAR, ago, safeHttps } from './logic.js';

export { ago };

// One review: stars and when, the review (plain text, clamped with Read more), then who wrote it, their
// company (linked to its website, https only, marked as user content) and the Verified user pill.
// Rendered only in the browser (the homepage section mounts it after load), so the relative date
// can't differ between server and client. Styles: reviews.css (.lr-card*).


export function Stars({ rating }) {
  return (
    <span className="lr-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={n <= rating ? 'is-on' : undefined}>
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

const since = (date) => {
  if (!date) return null;
  const d = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export default function ReviewCard({ review }) {
  const { rating, body, created_at: createdAt, reviewer_name: name, reviewer_role: role, company_name: company, city, state, customer_since: customerSince } = review;
  const href = safeHttps(review.website_url);
  const place = city && state ? `${city}, ${state}` : null;
  const sinceText = since(customerSince);

  // Read more only when the clamp actually hides something.
  const textRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || open) return undefined;
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, body]);

  return (
    <article className="lr-card">
      <div className="lr-card-top">
        <Stars rating={rating} />
        <time className="lr-when" dateTime={createdAt} title={new Date(createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}>{ago(createdAt)}</time>
      </div>

      <div className="lr-body">
        {/* Plain text only: React escapes it; line breaks the reviewer typed are kept (white-space). */}
        <p ref={textRef} className={`lr-text${open ? ' is-open' : ''}`}>{body}</p>
        {(clamped || open) && (
          <button type="button" className="lr-more" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <footer className="lr-card-foot">
        <div className="lr-who">
          <p className="lr-name">{name}{role ? `, ${role}` : ''}</p>
          {href ? (
            <a className="lr-company" href={href} target="_blank" rel="ugc noopener">
              {company}<ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p className="lr-company">{company}</p>
          )}
          {(place || sinceText) && (
            <p className="lr-meta">{[place, sinceText && `Customer since ${sinceText}`].filter(Boolean).join(' · ')}</p>
          )}
        </div>
        <span className="lr-verified"><BadgeCheck size={14} strokeWidth={2} aria-hidden="true" />Verified user</span>
      </footer>
    </article>
  );
}
