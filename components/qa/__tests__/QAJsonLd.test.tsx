import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QAJsonLd } from "../QAJsonLd";

const fakeQA = {
  question: "Am I eligible for the NZ Skilled Migrant visa?",
  slug: "am-i-eligible-for-the-nz-skilled-migrant-visa",
  country: "nz" as const,
  transcript: "Yes, you may be. The criteria are points-based...",
  publishedAt: "2026-05-01T00:00:00Z",
  liaName: "David Mitchell",
  thumbnailUrl: "https://i.ytimg.com/vi/ASbMvKQrHJ8/maxresdefault.jpg",
  videoWatchUrl: "https://www.youtube.com/watch?v=ASbMvKQrHJ8",
  videoEmbedUrl: "https://www.youtube-nocookie.com/embed/ASbMvKQrHJ8",
  siteUrl: "https://horizonsimmigration.com",
};

describe("QAJsonLd", () => {
  it("emits FAQPage, VideoObject, and Article JSON-LD", () => {
    const { container } = render(<QAJsonLd {...fakeQA} />);
    const scripts = container.querySelectorAll(
      "script[type='application/ld+json']"
    );
    expect(scripts).toHaveLength(3);

    const types = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent || "{}")["@type"]
    );
    expect(types).toContain("FAQPage");
    expect(types).toContain("VideoObject");
    expect(types).toContain("Article");
  });

  it("enriches the Article author with Rowel's credentials when liaName matches", () => {
    const { container } = render(
      <QAJsonLd {...fakeQA} liaName="Rowel Mercado" />
    );
    const article = Array.from(
      container.querySelectorAll("script[type='application/ld+json']")
    )
      .map((s) => JSON.parse(s.textContent || "{}"))
      .find((d) => d["@type"] === "Article");
    expect(article).toBeDefined();
    const author = article.author as Record<string, unknown>;
    expect(author["@type"]).toBe("Person");
    expect(author.sameAs).toContain(
      "https://www.linkedin.com/in/rowel-mercado-1388883a/"
    );
    expect(author.jobTitle).toContain("200900577");
  });
});
