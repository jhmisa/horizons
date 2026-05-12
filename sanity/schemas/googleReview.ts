import { defineField, defineType } from "sanity";

export const googleReview = defineType({
  name: "googleReview",
  title: "Google review",
  type: "document",
  fields: [
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      description: "Name as it appears on the original Google review.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Star rating, 1-5.",
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 6,
      description:
        "The review body. You may lightly trim or tidy formatting, but do not change meaning.",
      validation: (rule) => rule.required().max(1200),
    }),
    defineField({
      name: "reviewDate",
      title: "Review date",
      type: "date",
      description: "When the review was originally posted on Google.",
    }),
    defineField({
      name: "googleReviewUrl",
      title: "Google review URL",
      type: "url",
      description:
        "Optional. Deep link back to the original review on Google so visitors can verify it.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "clientCountry",
      title: "Client country",
      type: "string",
      description:
        "Optional. Shown as a small tag on the card. e.g. 'Philippines', 'UAE'.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "When true, this review appears in the homepage trust strip (top 5 by review date).",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description:
        "Empty = draft (hidden). Past date = live. Future date = scheduled.",
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "quote",
      rating: "rating",
    },
    prepare({ title, subtitle, rating }) {
      const stars = "★".repeat(rating ?? 0).padEnd(5, "☆");
      return {
        title: `${title} — ${stars}`,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Newest review first",
      name: "reviewDateDesc",
      by: [{ field: "reviewDate", direction: "desc" }],
    },
  ],
});
