import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { postBySlugForCountryQuery } from "@/lib/queries";
import type { Country } from "@/lib/config";
import type { Post } from "@/types/post";

const dateFormatter = new Intl.DateTimeFormat("en-NZ", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const portableComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(1200).fit("max").url();
      return (
        <Image
          src={url}
          alt={value.alt || ""}
          width={1200}
          height={800}
          className="my-6 rounded-2xl"
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-600 underline hover:text-brand-800"
      >
        {children}
      </a>
    ),
  },
};

export async function getPostForCountry(
  slug: string,
  country: Country
): Promise<Post | null> {
  return sanityClient.fetch<Post | null>(postBySlugForCountryQuery, {
    slug,
    country,
  });
}

export default async function BlogDetail({
  country,
  slug,
}: {
  country: Country;
  slug: string;
}) {
  const post = await getPostForCountry(slug, country);
  if (!post) notFound();

  const heroUrl = post.heroImage
    ? urlFor(post.heroImage).width(1600).height(900).fit("crop").url()
    : null;
  const dateLabel = dateFormatter.format(new Date(post.publishedAt));
  const pathPrefix = country === "nz" ? "" : `/${country}`;

  return (
    <>
      <header className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {post.category && (
            <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6">
              {post.category.toUpperCase()}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-brand-100 text-sm">
            <span>{dateLabel}</span>
            {post.author?.name && (
              <>
                <span aria-hidden="true">·</span>
                <span>By {post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {heroUrl && (
            <div className="mb-10 -mt-24 lg:-mt-28 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={heroUrl}
                alt={post.title}
                width={1600}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          {post.excerpt && (
            <p className="text-xl text-accent-700 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          {post.body && post.body.length > 0 ? (
            <article className="prose prose-slate max-w-none">
              <PortableText
                value={post.body}
                components={portableComponents}
              />
            </article>
          ) : (
            <p className="text-accent-500 italic">
              Full article body coming soon.
            </p>
          )}

          <div className="mt-16 pt-8 border-t border-slate-100">
            <Link
              href={`${pathPrefix}/blog`}
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800"
            >
              <i className="fa-solid fa-arrow-left" />
              Back to all posts
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
