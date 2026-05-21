import { defineField, defineType } from "sanity";

export const qa = defineType({
  name: "qa",
  title: "Q&A",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(5).max(250),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "question", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lia",
      title: "Licensed Immigration Adviser",
      type: "reference",
      to: [{ type: "lia" }],
      options: {
        filter: "archived != true",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description:
        "Paste the full YouTube URL for this Q&A (e.g. https://youtu.be/XXXXXXXXXXX).",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .custom((url?: string) => {
            if (!url) return true;
            try {
              const u = new URL(url);
              const host = u.hostname.replace(/^www\./, "");
              const youtubeHosts = [
                "youtube.com",
                "m.youtube.com",
                "youtu.be",
                "youtube-nocookie.com",
              ];
              if (!youtubeHosts.includes(host)) {
                return "Must be a YouTube URL (youtube.com, youtu.be, or youtube-nocookie.com).";
              }
              let id: string | null = null;
              if (host === "youtu.be") {
                id = u.pathname.replace(/^\//, "").split("/")[0] || null;
              } else if (u.pathname === "/watch") {
                id = u.searchParams.get("v");
              } else {
                const m = u.pathname.match(
                  /^\/(?:embed|shorts|v)\/([^/?#]+)/
                );
                if (m) id = m[1];
              }
              if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
                return "URL does not contain a valid 11-character YouTube video ID.";
              }
              return true;
            } catch {
              return "Invalid URL.";
            }
          }),
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "text",
      rows: 12,
      description: "Plain-text transcript. Paragraph breaks preserved.",
    }),
    defineField({
      name: "article",
      title: "Article body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
      description: "Long-form article (optional). Notion-style editor.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description:
        "Empty = draft. Past date = live. Future date = scheduled.",
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "lia.name", media: "lia.photo" },
  },
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
