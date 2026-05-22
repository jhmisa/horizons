import { defineField, defineType } from "sanity";

export const successStory = defineType({
  name: "successStory",
  title: "Success story",
  type: "document",
  fields: [
    defineField({
      name: "clientFirstName",
      title: "Client first name",
      type: "string",
      description:
        "First name only for privacy. Use 'Anonymous' if the client did not consent to being named.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "clientFirstName", maxLength: 96 },
      validation: (rule) => rule.required(),
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
      name: "originLocation",
      title: "Origin location",
      type: "string",
      description:
        "Where the client was based before migrating. e.g. 'Manila, Philippines' or 'OFW in Dubai, UAE'.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "destination",
      title: "Destination",
      type: "string",
      description:
        "Specific city/region the client settled in, e.g. 'Auckland, NZ' or 'Melbourne, AU'.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "visaCategory",
      title: "Visa category",
      type: "string",
      description:
        "e.g. 'Skilled Migrant Category', 'AEWV', 'Partnership Resident'.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "Short pull-quote shown on the listing page. Also used as the meta description.",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description: "Optional. Only use with explicit client consent.",
    }),
    defineField({
      name: "story",
      title: "Story",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
      description: "Long-form story body. Notion-style editor.",
    }),
    defineField({
      name: "adviser",
      title: "Adviser",
      type: "reference",
      to: [{ type: "lia" }],
      options: { filter: "archived != true" },
      description:
        "Optional. The LIA who handled this case. Leave blank to keep attribution at the brand level.",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description:
        "Optional. If set, the card overlays a play icon and links to the YouTube video.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
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
    select: {
      title: "clientFirstName",
      country: "country",
      visaCategory: "visaCategory",
      media: "photo",
    },
    prepare({ title, country, visaCategory, media }) {
      const countryLabel = (country || "nz").toString().toUpperCase();
      const subtitle = visaCategory
        ? `${countryLabel} • ${visaCategory}`
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
