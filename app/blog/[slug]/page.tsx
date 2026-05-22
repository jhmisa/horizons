import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { publishedPostSlugsForCountryQuery } from "@/lib/queries";
import BlogDetail, { getPostForCountry } from "@/components/pages/BlogDetail";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(
    publishedPostSlugsForCountryQuery,
    { country: "nz" }
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostForCountry(slug, "nz");
  if (!post) return {};
  return {
    title: `${post.title} | Horizons Immigration`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogDetail country="nz" slug={slug} />;
}
