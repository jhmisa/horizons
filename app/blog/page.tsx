import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immigration Blog | Horizons Immigration",
  description:
    "Expert advice, policy updates, and practical tips to navigate your migration journey to New Zealand and Australia.",
};

const blogPosts = [
  {
    slug: "am-i-eligible-to-migrate-to-new-zealand",
    image:
      "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Eligibility",
    title: "Am I Eligible to Migrate to New Zealand?",
    excerpt:
      "Understanding the points system, skill shortages, and age requirements. A complete breakdown of current NZ visa criteria.",
    date: "Jan 15, 2026",
    author: "David Mitchell",
  },
  {
    slug: "nz-vs-australia-which-is-right-for-your-family",
    image:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Comparison",
    title: "NZ vs Australia: Which Is Right for Your Family?",
    excerpt:
      "Comparing cost of living, healthcare, education systems, and work-life balance between the two Down Under destinations.",
    date: "Jan 8, 2026",
    author: "James Okonkwo",
  },
  {
    slug: "what-does-a-licensed-immigration-adviser-do",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Process",
    title: "What Does a Licensed Immigration Adviser Actually Do?",
    excerpt:
      "Behind the scenes of an LIA's role. Why their regulatory status protects you and dramatically increases your chance of success.",
    date: "Dec 22, 2025",
    author: "Sarah Chen",
  },
  {
    slug: "skilled-migrant-category-2026-changes",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Policy Update",
    title: "Skilled Migrant Category: What Changed in 2026",
    excerpt:
      "A comprehensive breakdown of the latest policy updates to New Zealand's Skilled Migrant Category and what it means for applicants.",
    date: "Dec 10, 2025",
    author: "David Mitchell",
  },
  {
    slug: "preparing-your-family-for-life-in-new-zealand",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Lifestyle",
    title: "Preparing Your Family for Life in New Zealand",
    excerpt:
      "From schools and healthcare to housing and culture — everything you need to know to prepare your family for the big move.",
    date: "Nov 28, 2025",
    author: "Priya Sharma",
  },
  {
    slug: "top-5-mistakes-immigration-applicants-make",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Tips",
    title: "Top 5 Mistakes Immigration Applicants Make",
    excerpt:
      "Avoid these common pitfalls that delay or derail visa applications. Learn from the mistakes we've seen in 20 years of practice.",
    date: "Nov 15, 2025",
    author: "Tom Anderson",
  },
];

export default function BlogPage() {
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
            GUIDES &amp; INSIGHTS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Immigration Blog
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            Expert advice, policy updates, and practical tips to navigate your
            migration journey.
          </p>
        </div>
      </header>

      {/* Blog Grid */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl shadow-sm border border-accent-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-accent-400">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-accent mb-3 leading-snug hover:text-brand-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-accent-600 text-sm mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-accent-100">
                    <span className="text-xs text-accent-500">
                      By {post.author}
                    </span>
                    <span className="font-semibold text-accent text-sm flex items-center gap-2 hover:text-brand-600 transition-colors cursor-pointer group">
                      Read{" "}
                      <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
