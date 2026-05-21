import { sanityClient } from "@/lib/sanity";
import { allGoogleReviewsQuery } from "@/lib/queries";
import type { GoogleReview } from "@/types/googleReview";
import { ReviewsCarouselClient } from "./ReviewsCarouselClient";

type Props = {
  heading?: string;
  subheading?: string;
  className?: string;
};

export async function GoogleReviewsCarousel({
  heading = "What our clients are saying",
  subheading,
  className = "",
}: Props) {
  const reviews = await sanityClient.fetch<GoogleReview[]>(
    allGoogleReviewsQuery
  );

  if (!reviews || reviews.length === 0) return null;

  const sub =
    subheading ??
    `Real stories from ${reviews.length} families we've helped move to New Zealand.`;

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold tracking-wide mb-4">
            <i className="fa-brands fa-google" aria-hidden="true" />
            GOOGLE REVIEWS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-accent">
            {heading}
          </h2>
          <p className="mt-2 text-sm text-accent-600">{sub}</p>
        </div>

        <ReviewsCarouselClient reviews={reviews} />
      </div>
    </section>
  );
}
