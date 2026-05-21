import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { publishedSuccessStoriesQuery } from "@/lib/queries";
import { GoogleReviewsStrip } from "@/components/reviews/GoogleReviewsStrip";
import type { SuccessStoryCard } from "@/types/successStory";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Success Stories | Horizons Immigration",
  description:
    "Hear from families who successfully migrated to New Zealand with Horizons Immigration.",
};

export default async function SuccessStoriesPage() {
  const stories = await sanityClient.fetch<SuccessStoryCard[]>(
    publishedSuccessStoriesQuery
  );

  return (
    <>
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            REAL FAMILIES, REAL RESULTS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Success Stories
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            Hear directly from families who have successfully made the move with
            Horizons.
          </p>
        </div>
      </header>

      <GoogleReviewsStrip
        heading="What clients say on Google"
        subheading="Quick public reviews. Scroll past for in-depth case studies below."
      />

      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-accent">
              In-depth case studies
            </h2>
            <p className="mt-2 text-sm text-accent-600">
              Full journeys from first consultation to visa approval.
            </p>
          </div>

          {stories.length === 0 ? (
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-accent-100 p-10 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                <i className="fa-solid fa-users text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-2">
                Stories coming soon
              </h3>
              <p className="text-accent-600 text-sm leading-relaxed">
                We&rsquo;re putting together full case studies from real families
                we&rsquo;ve helped migrate. Check back shortly &mdash; or watch
                the free masterclass below to see how the process works.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => {
                const photoUrl = story.photo
                  ? urlFor(story.photo).width(800).height(450).fit("crop").url()
                  : null;
                const hasVideo = Boolean(story.youtubeUrl);

                return (
                  <article
                    key={story._id}
                    className="bg-white rounded-2xl shadow-md border border-accent-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <a
                      href={story.youtubeUrl || undefined}
                      target={story.youtubeUrl ? "_blank" : undefined}
                      rel={story.youtubeUrl ? "noopener noreferrer" : undefined}
                      className={`aspect-video bg-gradient-to-br from-brand-100 to-brand-50 relative block ${
                        story.youtubeUrl ? "cursor-pointer" : ""
                      }`}
                    >
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={story.clientFirstName}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-300">
                          <i className="fa-solid fa-users text-5xl" />
                        </div>
                      )}
                      {hasVideo && (
                        <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/10 transition-colors">
                          <i className="fa-brands fa-youtube text-5xl text-red-600 opacity-90 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </a>
                    <div className="p-6 flex-1 flex flex-col">
                      {story.visaCategory && (
                        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
                          {story.visaCategory}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-accent mb-1">
                        {story.clientFirstName}
                      </h3>
                      {(story.originLocation || story.destination) && (
                        <p className="text-sm text-accent-500 mb-4">
                          {story.originLocation}
                          {story.originLocation && story.destination && " → "}
                          {story.destination}
                        </p>
                      )}
                      <blockquote className="text-accent-600 text-sm leading-relaxed italic border-l-4 border-brand-200 pl-4">
                        &ldquo;{story.summary}&rdquo;
                      </blockquote>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-brand-900 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Your story could be next.
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Watch our free masterclass and start your journey today.
          </p>
          <Link
            href="/how-it-works#step-1"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Watch the Masterclass — Free
          </Link>
        </div>
      </section>
    </>
  );
}
