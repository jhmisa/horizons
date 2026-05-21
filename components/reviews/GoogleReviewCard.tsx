"use client";

import { useState } from "react";
import type { GoogleReview } from "@/types/googleReview";

const LONG_QUOTE_THRESHOLD = 220;

type Props = {
  review: GoogleReview;
  onExpandChange?: (expanded: boolean) => void;
};

export function GoogleReviewCard({ review, onExpandChange }: Props) {
  const stars = Math.max(0, Math.min(5, Math.round(review.rating)));
  const isLong = review.quote.length > LONG_QUOTE_THRESHOLD;
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      onExpandChange?.(next);
      return next;
    });
  };

  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <i className="fa-brands fa-google" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold leading-tight text-accent">
              {review.authorName}
            </p>
            {review.clientCountry && (
              <p className="text-xs text-accent-500">{review.clientCountry}</p>
            )}
          </div>
        </div>
        <div
          className="flex items-center gap-0.5 text-amber-400"
          aria-label={`${stars} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <i
              key={i}
              className={`fa-solid fa-star text-sm ${
                i < stars ? "" : "text-slate-200"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </header>

      <blockquote
        className={`mt-4 text-sm leading-relaxed text-accent-700 ${
          isLong && !expanded ? "line-clamp-4" : ""
        }`}
      >
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      {isLong && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 self-start text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          {expanded ? "Show less" : "Read more"}
          <i
            className={`fa-solid ${
              expanded ? "fa-chevron-up" : "fa-chevron-down"
            } text-[10px]`}
            aria-hidden="true"
          />
        </button>
      )}

      {review.googleReviewUrl && (
        <a
          href={review.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 self-start text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          Verify on Google
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
        </a>
      )}
    </article>
  );
}
