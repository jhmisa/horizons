#!/usr/bin/env node
/**
 * Create a draft `qa` document in Sanity from a JSON payload.
 *
 * Usage: node scripts/create-qa-draft.mjs path/to/qa.json
 *
 * Expected JSON shape:
 * {
 *   "question": "Polished question?",
 *   "slug": "polished-question",          // optional; falls back to slugifying question
 *   "youtubeUrl": "https://youtu.be/XXXXXXXXXXX",
 *   "transcript": "Raw transcript text...",
 *   "article": [ ...PortableText blocks ], // optional
 *   "liaId": "ab1d6c56-999e-4e5e-985e-cde4bb14416e",
 *   "publishedAt": "2026-05-21T00:00:00Z"  // optional; empty = draft
 * }
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/create-qa-draft.mjs path/to/qa.json");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l.slice(i + 1).trim().replace(/^["']|["']$/g, ""),
      ];
    })
);

const payload = JSON.parse(readFileSync(filePath, "utf8"));

if (!payload.question) throw new Error("Missing required field: question");
if (!payload.youtubeUrl) throw new Error("Missing required field: youtubeUrl");
if (!payload.liaId) throw new Error("Missing required field: liaId");

const slug =
  payload.slug ||
  payload.question
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 96);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01",
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

const doc = {
  _id: `drafts.${randomUUID()}`,
  _type: "qa",
  question: payload.question,
  slug: { _type: "slug", current: slug },
  lia: { _type: "reference", _ref: payload.liaId },
  youtubeUrl: payload.youtubeUrl,
  transcript: payload.transcript,
  article: payload.article,
  publishedAt: payload.publishedAt,
};

const result = await client.create(doc);
console.log(`Created draft qa document:`);
console.log(`  _id: ${result._id}`);
console.log(`  slug: ${result.slug.current}`);
console.log(
  `  Open in Studio: https://www.sanity.io/@ogeyySxqI/studio/au38jvffmsguvwbhyehqn93a/horizons-studio/structure/qa;${result._id}`
);
