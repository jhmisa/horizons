import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01",
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const PUBLISHED_AT = "2026-05-21T00:00:00Z";

const reviews = [
  { authorName: "Je B", rating: 5, reviewDate: "2026-04-30",
    quote: "Highly recommended! Awesome team and we had outstanding experience from start to finish. Definitely use their services again in the future." },
  { authorName: "Allan Mojica", rating: 5, reviewDate: "2026-03-05",
    quote: "A huge thank you to the team at Horizons Immigration Consulting NZ! Dealing with immigration is never easy, but they treated my case with such care and patience. No question was too small, and their communication was top-notch. If you want an adviser who actually listens and delivers results, look no further." },
  { authorName: "Perry Fajardo", rating: 5, reviewDate: "2026-03-12",
    quote: "Horizon Immigration Consulting provides a great service to help with immigration advice. They have helped us immensely with immigration advice since we moved to New Zealand. Very professional and highly recommended!" },
  { authorName: "aldames lasay", rating: 5, reviewDate: "2026-03-19",
    quote: "I had a very positive experience with the service of Horizon Immigration Consulting. The team was professional, knowledgeable, and very supportive throughout the entire process. They explained every step clearly and ensured that all my documents were complete and properly submitted. Thanks a million!" },
  { authorName: "mary grace cruz", rating: 5, reviewDate: "2026-04-09",
    quote: "The whole experience was amazing. The people were very accomodating. I like to thank each and everyone who had helped me and my family for the whole procedure." },
  { authorName: "Danilo Cruz", rating: 5, reviewDate: "2026-04-09",
    quote: "As to Horizon services: Satisfied!" },
  { authorName: "Alanna", rating: 5, reviewDate: "2026-04-23",
    quote: "I want to express my sincere gratitude to Horizon Immigration Consulting for their incredible support with our visa application. Managing the filing process was overwhelming but their team —made the entire process feel manageable. The team was meticulous in reviewing our documentation and consistently addressed our inquiries within a 24-hours. Thanks to their expertise and attention to detail. If you're looking for a reliable and professional team to handle your immigration needs, I highly recommend them!" },
  { authorName: "Daisy Jhoy Purio", rating: 5, reviewDate: "2026-04-23",
    quote: "Horizons immigration did a wonderful job with my visa application as well as my husbands. I'm recommending them to everyone I bump into who needs assistance with their visa. They take care of their clients beyond visa needs. They checked on us during the Middle East political issue." },
  { authorName: "Anna Erica Samson", rating: 5, reviewDate: "2026-04-30",
    quote: "I had a very positive experience with Horizon Immigration Consulting. Their team is very accommodating and approachable, which made the whole process much less stressful. They take the time to clearly answer all questions, explain every step in detail, and guide you throughout the entire process. I really appreciated their professionalism and willingness to assist whenever needed. I felt supported and well-informed from start to finish. I highly recommend their services to anyone looking for reliable and helpful immigration assistance." },
  { authorName: "Ivy Karen Bautista", rating: 5, reviewDate: "2026-04-30",
    quote: "I highly recommend Horizons Immigration. The journey of my son from student visa to working visa is incredibly amazing. Ms. Stephanie is very patient in guiding us and making sure we get the best service the company has to offer. They play a big part on the success and better future that my son is experiencing right now in NZ. My family is acknowledging their services as we continue to get their service to process our visit visa and employment to nursing. It was all a success for us. I would like to acknowledge the whole team; Ms Jamie, Ms Carmen and Ms Win for always making sure we comply with our requirements. They gave us exceptional service." },
];

const tx = client.transaction();
for (const r of reviews) {
  tx.create({
    _type: "googleReview",
    ...r,
    featured: false,
    publishedAt: PUBLISHED_AT,
  });
}

const result = await tx.commit();
console.log(`Created ${result.results.length} googleReview documents:`);
for (const r of result.results) {
  console.log(`  ${r.id} — ${r.operation}`);
}
