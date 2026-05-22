import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(5).max(150),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "Short summary shown on the blog listing. Also used as the page meta description (150-160 chars works best for Google).",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      options: {
        list: [
          { title: "New Zealand", value: "nz" },
          { title: "Australia", value: "au" },
          { title: "Canada", value: "ca" },
          { title: "Global", value: "global" },
        ],
        layout: "radio",
      },
      initialValue: "nz",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Shown as a tag on the card. Pick the closest match.",
      options: {
        list: [
          { title: "Eligibility", value: "Eligibility" },
          { title: "Process", value: "Process" },
          { title: "Policy Update", value: "Policy Update" },
          { title: "Lifestyle", value: "Lifestyle" },
          { title: "Tips", value: "Tips" },
          { title: "Comparison", value: "Comparison" },
        ],
      },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "lia" }],
      options: { filter: "archived != true" },
      description:
        "Optional. Leave blank to byline as 'Horizons Immigration'.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description:
        "Empty = draft. Past date = live. Future date = scheduled.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
      description: "Long-form article body. Notion-style editor.",
    }),
    defineField({
      name: "relatedQAs",
      title: "Related Q&As",
      type: "array",
      of: [{ type: "reference", to: [{ type: "qa" }] }],
      description:
        "Optional. Cross-link related Q&As at the bottom of the post.",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description:
        "Optional. Link to a related YouTube video, if one exists.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      country: "country",
      category: "category",
      media: "heroImage",
    },
    prepare({ title, country, category, media }) {
      const countryLabel = (country || "nz").toString().toUpperCase();
      const subtitle = category
        ? `${countryLabel} • ${category}`
        : countryLabel;
      return { title, subtitle, media };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
