import { defineField, defineType } from "sanity";

export const lia = defineType({
  name: "lia",
  title: "Licensed Immigration Adviser",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "licenseNumber",
      title: "License number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      description:
        "Hides this LIA from the Q&A dropdown for new content. Existing Q&As still show their attribution.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "licenseNumber", media: "photo" },
  },
});
