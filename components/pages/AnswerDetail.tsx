import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { qaBySlugForCountryQuery } from "@/lib/queries";
import { LIAAttribution } from "@/components/qa/LIAAttribution";
import { YouTubeEmbed } from "@/components/qa/YouTubeEmbed";
import { TranscriptDisclosure } from "@/components/qa/TranscriptDisclosure";
import { StickyBookCTA } from "@/components/qa/StickyBookCTA";
import { QAArticle } from "@/components/qa/QAArticle";
import { QAJsonLd } from "@/components/qa/QAJsonLd";
import {
  extractYouTubeId,
  youtubeEmbedUrl,
  youtubeThumbnail,
  youtubeWatchUrl,
} from "@/lib/youtube";
import type { Country } from "@/lib/config";
import type { QA } from "@/types/qa";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.horizons.nz";

export async function getQAForCountry(
  slug: string,
  country: Country
): Promise<QA | null> {
  return sanityClient.fetch<QA | null>(qaBySlugForCountryQuery, {
    slug,
    country,
  });
}

export default async function AnswerDetail({
  country,
  slug,
}: {
  country: Country;
  slug: string;
}) {
  const qa = await getQAForCountry(slug, country);
  if (!qa) notFound();

  const videoId = extractYouTubeId(qa.youtubeUrl);
  if (!videoId) notFound();
  const thumbnailUrl = youtubeThumbnail(videoId);

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-32 lg:pb-12">
      <QAJsonLd
        question={qa.question}
        slug={qa.slug.current}
        transcript={qa.transcript}
        publishedAt={qa.publishedAt}
        liaName={qa.lia.name}
        thumbnailUrl={thumbnailUrl}
        videoWatchUrl={youtubeWatchUrl(videoId)}
        videoEmbedUrl={youtubeEmbedUrl(videoId)}
        siteUrl={SITE_URL}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {qa.question}
          </h1>
          <div className="mt-6">
            <LIAAttribution lia={qa.lia} />
          </div>
          <div className="mt-8">
            <YouTubeEmbed videoId={videoId} title={qa.question} />
          </div>
          {qa.article && qa.article.length > 0 && (
            <QAArticle blocks={qa.article} />
          )}
          {qa.transcript && (
            <TranscriptDisclosure transcript={qa.transcript} />
          )}
        </div>
        <StickyBookCTA />
      </div>
    </main>
  );
}
