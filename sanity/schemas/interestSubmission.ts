import { defineField, defineType } from "sanity";

export const interestSubmission = defineType({
  name: "interestSubmission",
  title: "Interest submission",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description:
        "The country the visitor was expressing interest in.",
      options: {
        list: [
          { title: "New Zealand", value: "nz" },
          { title: "Australia", value: "au" },
          { title: "Canada", value: "ca" },
          { title: "Global", value: "global" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "string",
      description: "URL the visitor was on when they submitted.",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Converted", value: "converted" },
          { title: "Spam", value: "spam" },
        ],
        layout: "radio",
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "adminNotes",
      title: "Admin notes",
      type: "text",
      rows: 4,
      description: "Internal triage notes.",
    }),
  ],
  preview: {
    select: {
      email: "email",
      country: "country",
      status: "status",
    },
    prepare({ email, country, status }) {
      const countryLabel = (country || "").toString().toUpperCase();
      const subtitle =
        countryLabel && status
          ? `${countryLabel} • ${status}`
          : countryLabel || status || "";
      return { title: email || "(no email)", subtitle };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
