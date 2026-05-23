import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";
import { sharedConfig } from "@/lib/config";
import { groq } from "next-sanity";

const SITE_URL = sharedConfig.siteUrl;

type CountryTag = "nz" | "au" | "ca" | "global";

interface SitemapDoc {
  slug: string;
  publishedAt: string;
  country: CountryTag | null;
}

interface SitemapStoryDoc {
  slug: string;
  publishedAt: string;
}

interface SitemapQueryResult {
  qas: SitemapDoc[];
  posts: SitemapDoc[];
  stories: SitemapStoryDoc[];
}

const sitemapQuery = groq`{
  "qas": *[_type == "qa" && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current,
    publishedAt,
    country
  },
  "posts": *[_type == "post" && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current,
    publishedAt,
    country
  },
  "stories": *[_type == "successStory" && defined(publishedAt) && publishedAt <= now() && country == "nz"] {
    "slug": slug.current,
    publishedAt
  }
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { qas, posts, stories } =
    await sanityClient.fetch<SitemapQueryResult>(sitemapQuery);

  const staticUrls: MetadataRoute.Sitemap = [
    // NZ (root) static URLs
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/answers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/success-stories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/book`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.7 },

    // AU static URLs
    { url: `${SITE_URL}/au`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/au/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/au/answers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/au/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/au/book`, changeFrequency: "monthly", priority: 0.8 },

    // CA static URLs
    { url: `${SITE_URL}/ca`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ca/book`, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Build dynamic URLs from Sanity content.
  // Filter rule: a piece of content shows on a country's page when its
  // country tag matches that country OR is "global". So global-tagged content
  // gets mirrored to BOTH the NZ and AU URL lists (intentional — accurately
  // reflects what's actually reachable on each country's site).
  //
  // Content tagged country:"ca" is intentionally NOT emitted: /ca is a
  // shell page with no /ca/answers/[slug] or /ca/blog/[slug] routes. When
  // CA routes ship, extend the loops below to mirror ca content the same
  // way au is handled today.
  const qaUrls: MetadataRoute.Sitemap = [];
  for (const qa of qas) {
    const country = qa.country ?? "global";
    const lastModified = new Date(qa.publishedAt);
    if (country === "nz" || country === "global") {
      qaUrls.push({
        url: `${SITE_URL}/answers/${qa.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    if (country === "au" || country === "global") {
      qaUrls.push({
        url: `${SITE_URL}/au/answers/${qa.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  const postUrls: MetadataRoute.Sitemap = [];
  for (const post of posts) {
    const country = post.country ?? "global";
    const lastModified = new Date(post.publishedAt);
    if (country === "nz" || country === "global") {
      postUrls.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    if (country === "au" || country === "global") {
      postUrls.push({
        url: `${SITE_URL}/au/blog/${post.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  const storyUrls: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${SITE_URL}/success-stories/${story.slug}`,
    lastModified: new Date(story.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticUrls, ...qaUrls, ...postUrls, ...storyUrls];
}
