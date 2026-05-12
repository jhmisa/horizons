import { sanityClient } from "@/lib/sanity";
import { featuredGoogleReviewsQuery } from "@/lib/queries";
import type { GoogleReview } from "@/types/googleReview";
import { GoogleReviewCard } from "./GoogleReviewCard";

type Props = {
  heading?: string;
  subheading?: string;
  className?: string;
};

export async function GoogleReviewsStrip({
  heading = "Trusted by families on Google",
  subheading = "Real reviews from clients who&apos;ve worked with us.",
  className = "",
}: Props) {
  const reviews = await sanityClient.fetch<GoogleReview[]>(
    featuredGoogleReviewsQuery
  );

  if (!reviews || reviews.length === 0) return null;

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
          <p
            className="mt-2 text-sm text-accent-600"
            dangerouslySetInnerHTML={{ __html: subheading }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <GoogleReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
