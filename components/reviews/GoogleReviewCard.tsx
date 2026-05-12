import type { GoogleReview } from "@/types/googleReview";

export function GoogleReviewCard({ review }: { review: GoogleReview }) {
  const stars = Math.max(0, Math.min(5, Math.round(review.rating)));

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
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

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-accent-700">
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      {review.googleReviewUrl && (
        <a
          href={review.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          Verify on Google
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
        </a>
      )}
    </article>
  );
}
