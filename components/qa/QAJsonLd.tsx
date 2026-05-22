type Props = {
  question: string;
  slug: string;
  transcript?: string;
  publishedAt: string;
  liaName: string;
  // Optional: AU/CA Q&As may be text-only (no video).
  thumbnailUrl?: string;
  videoWatchUrl?: string;
  videoEmbedUrl?: string;
  siteUrl: string;
};

export function QAJsonLd({
  question,
  slug,
  transcript,
  publishedAt,
  liaName,
  thumbnailUrl,
  videoWatchUrl,
  videoEmbedUrl,
  siteUrl,
}: Props) {
  const url = `${siteUrl}/answers/${slug}`;
  const hasVideo = Boolean(thumbnailUrl && videoWatchUrl && videoEmbedUrl);
  const answerText =
    transcript?.slice(0, 500) ||
    (hasVideo
      ? `Watch ${liaName} answer this question.`
      : `Read ${liaName}'s answer to this question.`);

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answerText },
      },
    ],
  };

  const videoObject = hasVideo
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: question,
        description: answerText,
        thumbnailUrl: [thumbnailUrl],
        uploadDate: publishedAt,
        contentUrl: videoWatchUrl,
        embedUrl: videoEmbedUrl,
      }
    : null;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: question,
    datePublished: publishedAt,
    author: { "@type": "Person", name: liaName },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      {videoObject && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObject) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
    </>
  );
}
