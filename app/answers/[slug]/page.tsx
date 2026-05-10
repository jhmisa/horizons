import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import {
  qaBySlugQuery,
  publishedQASlugsQuery,
} from "@/lib/queries";
import { LIAAttribution } from "@/components/qa/LIAAttribution";
import { QAVideoPlayer } from "@/components/qa/QAVideoPlayer";
import { TranscriptDisclosure } from "@/components/qa/TranscriptDisclosure";
import { StickyBookCTA } from "@/components/qa/StickyBookCTA";
import { QAArticle } from "@/components/qa/QAArticle";
import { QAJsonLd } from "@/components/qa/QAJsonLd";
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
  const thumb = `https://image.mux.com/${qa.video.asset.playbackId}/thumbnail.jpg?width=1200`;
  return {
    title: `${qa.question} | Horizons Immigration`,
    description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
    openGraph: {
      title: qa.question,
      description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
      images: [thumb],
      type: "article",
    },
    twitter: { card: "summary_large_image", images: [thumb] },
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

  const playbackId = qa.video.asset.playbackId;
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1200`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-32 lg:pb-12">
      <QAJsonLd
        question={qa.question}
        slug={qa.slug.current}
        transcript={qa.transcript}
        publishedAt={qa.publishedAt}
        liaName={qa.lia.name}
        thumbnailUrl={thumbnailUrl}
        videoDuration={qa.video.asset.duration}
        siteUrl={SITE_URL}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <QAVideoPlayer
            playbackId={playbackId}
            title={qa.question}
            poster={thumbnailUrl}
          />
          <h1 className="mt-8 text-3xl font-bold text-slate-900 sm:text-4xl">
            {qa.question}
          </h1>
          <div className="mt-6">
            <LIAAttribution lia={qa.lia} />
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
