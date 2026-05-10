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
