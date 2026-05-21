import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import {
  qaBySlugQuery,
  publishedQASlugsQuery,
} from "@/lib/queries";
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
import type { QA } from "@/types/qa";

export const revalidate = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://horizonsimmigration.com";

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(publishedQASlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const qa = await sanityClient.fetch<QA | null>(qaBySlugQuery, { slug });
  if (!qa) return {};
  const videoId = extractYouTubeId(qa.youtubeUrl);
  const thumb = videoId ? youtubeThumbnail(videoId) : undefined;
  return {
    title: `${qa.question} | Horizons Immigration`,
    description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
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

export default async function QAPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const qa = await sanityClient.fetch<QA | null>(qaBySlugQuery, { slug });
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
