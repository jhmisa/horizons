import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { homepageBlogCardsForCountryQuery } from "@/lib/queries";
import { GoogleReviewsStrip } from "@/components/reviews/GoogleReviewsStrip";
import { GoogleReviewsCarousel } from "@/components/reviews/GoogleReviewsCarousel";
import { YouTubeEmbed } from "@/components/qa/YouTubeEmbed";
import type { Country } from "@/lib/config";
import type { PostCard } from "@/types/post";

const dateFormatter = new Intl.DateTimeFormat("en-NZ", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function CountryHome({ country }: { country: Country }) {
  const homepagePosts = await sanityClient.fetch<PostCard[]>(
    homepageBlogCardsForCountryQuery,
    { country }
  );

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-900">
        {/* Solid Color Background */}
        <div className="absolute inset-0 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center text-center lg:text-left text-white">
            {/* Left Column: Text */}
            <div>
              <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
                EXPERT IMMIGRATION ADVISERS
              </span>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 leading-tight fade-in-up delay-100">
                1-on-1 Guidance from Licensed Immigration Experts.
              </h1>
              <p className="mt-4 text-lg md:text-xl text-accent-200 mb-6 leading-relaxed fade-in-up delay-200">
                Creating personalized pathways for families for over 20 years.
              </p>

              {/* Social Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 mb-10 fade-in-up delay-200">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg cursor-default">
                  <i className="fa-brands fa-google text-white" />
                  <div className="flex text-yellow-400 text-xs">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star-half-stroke" />
                  </div>
                  <span className="text-white text-sm font-bold">4.7</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg cursor-default">
                  <i className="fa-brands fa-facebook text-blue-400" />
                  <span className="text-white text-sm font-bold">
                    12.5k+ Likes
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 fade-in-up delay-300">
                <Link
                  href="/how-it-works"
                  className="bg-white hover:bg-slate-50 text-brand-600 text-lg font-bold py-4 px-8 rounded-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Book Session
                  <i className="fa-solid fa-arrow-right" />
                </Link>
                <a
                  href="#how-it-works"
                  className="bg-white/10 hover:bg-white/20 text-white text-lg font-bold py-4 px-8 rounded-2xl transition-all border-2 border-white/30 hover:border-white/50 flex items-center justify-center gap-2"
                >
                  Learn More
                  <i className="fa-solid fa-chevron-down" />
                </a>
              </div>
            </div>

            {/* Right Column: Video */}
            <div className="fade-in-up delay-300 relative mt-10 lg:mt-0">
              <div className="relative w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-white/10 bg-accent-950">
                <YouTubeEmbed
                  videoId="ASbMvKQrHJ8"
                  title="Horizons Immigration Consulting"
                />
              </div>
              <div className="absolute -inset-10 bg-brand-500/20 blur-3xl rounded-2xl -z-10 pointer-events-none hidden lg:block" />
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="relative z-10 mt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 fade-in-up delay-300">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-6 px-4 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/20">
              <div className="flex flex-col items-center px-4">
                <i className="fa-solid fa-calendar-check text-2xl text-brand-400 mb-2" />
                <span className="font-bold text-white text-lg">20 Years</span>
                <span className="text-accent-200 text-xs uppercase tracking-wider mt-1">
                  Of Service
                </span>
              </div>
              <div className="flex flex-col items-center px-4">
                <i className="fa-solid fa-plane-arrival text-2xl text-brand-400 mb-2" />
                <span className="font-bold text-white text-lg">6,500+</span>
                <span className="text-accent-200 text-xs uppercase tracking-wider mt-1">
                  Successful Migrations
                </span>
              </div>
              <div className="flex flex-col items-center px-4">
                <i className="fa-solid fa-id-card-clip text-2xl text-brand-400 mb-2" />
                <span className="font-bold text-white text-lg">Licensed</span>
                <span className="text-accent-200 text-xs uppercase tracking-wider mt-1">
                  Immigration Advisers
                </span>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="flex gap-1 text-yellow-400 mb-2 text-xl">
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star-half-stroke" />
                </div>
                <span className="font-bold text-white text-lg">4.7★</span>
                <span className="text-accent-200 text-xs uppercase tracking-wider mt-1">
                  Google Reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsCarousel
        heading="Trusted by 6,500+ Families Since 2005"
        subheading="Don't just take our word for it. Hear directly from the families who have successfully made the move with Horizons."
      />

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#FAFAFA] border-t border-accent-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
              Three Simple Steps to Your New Life
            </h2>
            <p className="text-lg text-accent-600">
              We&apos;ve streamlined the complex immigration process into a
              straightforward, transparent journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: 1,
                icon: "fa-circle-play",
                title: "Watch",
                desc: "Start with our short masterclass that explains everything — what it takes to migrate to New Zealand, how the process works, and why having the right pathway matters.",
              },
              {
                num: 2,
                icon: "fa-calendar-check",
                title: "Book",
                desc: "Ready to go deeper? Book a one-on-one consultation with a Licensed Immigration Adviser for $197 USD ($190 fee + $7 payment processing). They'll study your background and craft a tailored plan.",
                iconPrefix: "fa-regular",
              },
              {
                num: 3,
                icon: "fa-plane-departure",
                title: "Proceed",
                desc: "If you decide to move forward with Horizons, your $190 consultation fee is credited toward the $2,000 USD processing fee. No wasted money. No hidden costs.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-8 shadow-md border border-accent-100 relative group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-400 font-bold text-xl border-4 border-white group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                  {step.num}
                </div>
                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 text-2xl mb-6">
                  <i
                    className={`${step.iconPrefix || "fa-solid"} ${step.icon}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-accent mb-3">
                  {step.title}
                </h3>
                <p className="text-accent-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/how-it-works"
              className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore the Full 3-Step Process{" "}
              <i className="fa-solid fa-arrow-right ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY A LICENSED IMMIGRATION ADVISER */}
      <section
        id="why-lia"
        className="py-24 bg-brand-900 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-800/30 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="text-brand-300 font-semibold tracking-wider uppercase text-sm mb-3 block">
              Why It Matters
            </span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white max-w-3xl mx-auto">
              Getting There Is Only the Beginning
            </h2>
          </div>

          {/* Unified content card */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
              {/* Image column */}
              <div className="relative min-h-[320px] lg:min-h-full order-2 lg:order-1">
                <img
                  src="/images/Rowel-zoom-meeting-consultation.png"
                  alt="Horizons Immigration Consultation"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent-950/90 to-transparent p-6 pt-20">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-shield-halved text-brand-400 text-2xl" />
                    <div>
                      <div className="font-bold text-white">
                        Registered &amp; Licensed
                      </div>
                      <div className="text-xs text-brand-200">
                        Guaranteed Professional Standards
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text column */}
              <div className="p-8 lg:p-12 xl:p-14 order-1 lg:order-2">
                <div className="space-y-5 text-brand-100 text-[17px] leading-relaxed">
                  <p>
                    Anyone can help you complete forms. But forming the best strategy for your case — the one that protects your family&apos;s future and gives you the strongest chance of approval — takes real expertise.
                  </p>
                  <p>
                    Choosing the right visa pathway isn&apos;t paperwork. It&apos;s positioning. It&apos;s timing. It&apos;s knowing which options strengthen your case — and which ones put it at risk.
                  </p>
                  <p className="text-white font-semibold">
                    In New Zealand, only a Licensed Immigration Adviser can legally provide that level of advice.
                  </p>
                  <p>
                    At Horizons, every consultation is with an LIA. We assess your qualifications, experience, family circumstances, and long-term goals — then build a strategy designed for approval, not guesswork.
                  </p>
                  <p>
                    Because there&apos;s a big difference between simply arriving in New Zealand… and arriving with a plan to build a life there.
                  </p>
                </div>

                {/* Bottom trust strip */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 text-green-400 w-10 h-10 rounded-xl flex items-center justify-center text-lg">
                      <i className="fa-solid fa-check" />
                    </div>
                    <div className="font-bold text-white text-sm">
                      100% Legal Representation
                    </div>
                  </div>
                  <div className="text-sm text-brand-200 border-l border-brand-700 pl-4">
                    Strictly regulated by the <br />
                    <strong className="text-white">
                      Immigration Advisers Authority (IAA)
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsStrip />

      {/* BLOG PREVIEW SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
                Guides &amp; Insights from Our Team
              </h2>
              <p className="text-lg text-accent-600 max-w-2xl">
                Expert advice, policy updates, and practical tips to navigate
                your migration journey.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              View All Articles{" "}
              <i className="fa-solid fa-arrow-right text-sm" />
            </Link>
          </div>

          {homepagePosts.length === 0 ? (
            <p className="text-center text-accent-600">
              Articles coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homepagePosts.map((post) => {
                const imageUrl = post.heroImage
                  ? urlFor(post.heroImage)
                      .width(800)
                      .height(450)
                      .fit("crop")
                      .url()
                  : null;
                const dateLabel = dateFormatter.format(
                  new Date(post.publishedAt)
                );

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group bg-white rounded-2xl shadow-sm border border-accent-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <div className="h-48 overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-300">
                          <i className="fa-solid fa-newspaper text-5xl" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        {post.category && (
                          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                            {post.category}
                          </span>
                        )}
                        <span className="text-xs text-accent-400 ml-auto">
                          {dateLabel}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-accent mb-3 leading-snug group-hover:text-brand-600 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-accent-600 text-sm mb-6 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="font-semibold text-accent text-sm flex items-center gap-2 group-hover:text-brand-600 transition-colors">
                        Read Article
                        <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              View All Articles{" "}
              <i className="fa-solid fa-arrow-right text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section
        id="get-started"
        className="py-24 bg-brand-900 text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Your family&apos;s next chapter is waiting.
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Start your journey today. Watch the masterclass and see if New
            Zealand is the right fit for your family.
          </p>
          <Link
            href="/how-it-works#step-1"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Watch the Masterclass
          </Link>
          <p className="text-brand-300 text-sm mt-6">
            <i className="fa-solid fa-lock mr-1" /> Free. No signup required.
          </p>
        </div>
      </section>
    </>
  );
}
