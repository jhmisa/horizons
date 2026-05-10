type Props = {
  question: string;
  slug: string;
  transcript?: string;
  publishedAt: string;
  liaName: string;
  thumbnailUrl: string;
  videoDuration: number;
  siteUrl: string;
};

function isoDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `PT${m}M${s}S`;
}

export function QAJsonLd({
  question,
  slug,
  transcript,
  publishedAt,
  liaName,
  thumbnailUrl,
  videoDuration,
  siteUrl,
}: Props) {
  const url = `${siteUrl}/answers/${slug}`;
  const answerText =
    transcript?.slice(0, 500) ||
    `Watch ${liaName}, a Licensed Immigration Adviser, answer this question.`;

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

  const videoObject = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: question,
    description: answerText,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: publishedAt,
    duration: isoDuration(videoDuration),
    contentUrl: url,
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObject) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
    </>
  );
}
