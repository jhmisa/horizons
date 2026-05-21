import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";
import { groq } from "next-sanity";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.horizons.nz";

const sitemapQuery = groq`
  *[_type == "qa" && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current,
    publishedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const qas = await sanityClient.fetch<
    { slug: string; publishedAt: string }[]
  >(sitemapQuery);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/answers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/book`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const qaUrls: MetadataRoute.Sitemap = qas.map((qa) => ({
    url: `${SITE_URL}/answers/${qa.slug}`,
    lastModified: new Date(qa.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticUrls, ...qaUrls];
}
