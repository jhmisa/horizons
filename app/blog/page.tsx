import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { publishedPostsQuery } from "@/lib/queries";
import type { PostCard } from "@/types/post";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Immigration Blog | Horizons Immigration",
  description:
    "Expert advice, policy updates, and practical tips to navigate your migration journey to New Zealand.",
};

const dateFormatter = new Intl.DateTimeFormat("en-NZ", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function BlogPage() {
  const posts = await sanityClient.fetch<PostCard[]>(publishedPostsQuery);

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

      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-accent-600">
              No posts published yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const imageUrl = post.heroImage
                  ? urlFor(post.heroImage).width(800).height(450).fit("crop").url()
                  : null;
                const dateLabel = dateFormatter.format(new Date(post.publishedAt));

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
                      <div className="flex items-center justify-between mb-3">
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
                        <p className="text-accent-600 text-sm mb-4 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-end pt-4 border-t border-accent-100">
                        <span className="font-semibold text-accent text-sm flex items-center gap-2 group-hover:text-brand-600 transition-colors">
                          Read
                          <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
