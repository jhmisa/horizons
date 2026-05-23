import { defineField, defineType } from "sanity";

export const partnerSchool = defineType({
  name: "partnerSchool",
  title: "Partner School",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "School name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Reserved for future per-school detail pages.",
      type: "slug",
      options: { source: "name", maxLength: 96 },
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
        ],
        layout: "radio",
      },
      initialValue: "nz",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      description: "e.g. Auckland, Sydney, Toronto",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      title: "School website",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "blurb",
      title: "Short blurb",
      description: "1-2 lines, ~120 characters. Shows on the school card.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      description: "Lower numbers appear first. Default 100.",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      description: "Uncheck to draft a school without publishing it on the site.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "city",
      media: "logo",
    },
  },
});
