import { defineField, defineType } from "sanity";

export const submittedQuestion = defineType({
  name: "submittedQuestion",
  title: "Submitted Question",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(10).max(2000),
    }),
    defineField({
      name: "submitterEmail",
      title: "Submitter email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "submitterName",
      title: "Submitter name",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description:
        "Auto-captured from the page where the form was submitted.",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In progress", value: "in-progress" },
          { title: "Answered", value: "answered" },
          { title: "Spam", value: "spam" },
        ],
        layout: "dropdown",
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "adminNotes",
      title: "Admin notes",
      type: "text",
      rows: 3,
      description: "Internal triage notes.",
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "submitterEmail" },
  },
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
