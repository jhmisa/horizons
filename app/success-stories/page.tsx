import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success Stories | Horizons Immigration",
  description:
    "Hear from families who successfully migrated to New Zealand and Australia with Horizons Immigration.",
};

const stories = [
  {
    name: "The Smith Family",
    origin: "South Africa",
    destination: "Auckland, New Zealand",
    category: "Skilled Migrant Category",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    quote:
      "Horizons made what felt impossible feel completely manageable. David and his team were with us every step of the way.",
    hasVideo: true,
  },
  {
    name: "Sarah M.",
    origin: "United Kingdom",
    destination: "Wellington, New Zealand",
    category: "Work to Residence Visa",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    quote:
      "Horizons made the complex simple. I was overwhelmed by the process until I found them. Now I'm living my dream in Wellington.",
    hasVideo: true,
  },
  {
    name: "The Chen Family",
    origin: "China",
    destination: "Christchurch, New Zealand",
    category: "Partner Sponsorship",
    image:
      "https://images.unsplash.com/photo-1543269664-56d74c65a6c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    quote:
      "We couldn't have done it without them. The attention to detail and genuine care for our family was extraordinary.",
    hasVideo: true,
  },
  {
    name: "The Okafor Family",
    origin: "Nigeria",
    destination: "Sydney, Australia",
    category: "Skilled Worker Visa",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    quote:
      "James understood exactly what we needed and guided us through the Australian immigration process flawlessly. Our children love their new school.",
    hasVideo: false,
  },
  {
    name: "Raj & Meena Patel",
    origin: "India",
    destination: "Auckland, New Zealand",
    category: "Skilled Migrant Category",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    quote:
      "After two failed attempts with other agents, Horizons got it right the first time. Their expertise is unmatched. We're so grateful.",
    hasVideo: false,
  },
  {
    name: "The Van der Berg Family",
    origin: "South Africa",
    destination: "Melbourne, Australia",
    category: "Employer Sponsored Visa",
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    quote:
      "From our first consultation to receiving the visa, Horizons was transparent about timelines, costs, and what to expect. No surprises.",
    hasVideo: false,
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      {/* Page Header */}
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

      {/* Stories Grid */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story.name}
                className="bg-white rounded-2xl shadow-md border border-accent-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-video bg-accent-100 relative cursor-pointer">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                  {story.hasVideo && (
                    <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/10 transition-colors">
                      <i className="fa-brands fa-youtube text-5xl text-red-600 opacity-90 group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-accent mb-1">
                    {story.name}
                  </h3>
                  <p className="text-sm text-accent-500 mb-4">
                    {story.origin} → {story.destination}
                  </p>
                  <blockquote className="text-accent-600 text-sm leading-relaxed italic border-l-4 border-brand-200 pl-4">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
