import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { publishedQASlugsForCountryQuery } from "@/lib/queries";
import AnswerDetail, { getQAForCountry } from "@/components/pages/AnswerDetail";
import {
  extractYouTubeId,
  youtubeThumbnail,
} from "@/lib/youtube";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(
    publishedQASlugsForCountryQuery,
    { country: "au" }
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const qa = await getQAForCountry(slug, "au");
  if (!qa) return {};
  const videoId = extractYouTubeId(qa.youtubeUrl);
  const thumb = videoId ? youtubeThumbnail(videoId) : undefined;
  return {
    title: `${qa.question} | Horizons Immigration`,
    description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
    alternates: { canonical: `/au/answers/${slug}` },
    openGraph: {
      title: qa.question,
      description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
      images: thumb ? [thumb] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      images: thumb ? [thumb] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AnswerDetail country="au" slug={slug} />;
}
