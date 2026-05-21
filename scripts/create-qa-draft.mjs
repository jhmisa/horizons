#!/usr/bin/env node
/**
 * Create a published `qa` document in Sanity from a JSON payload.
 *
 * Default behavior: publishes immediately with `publishedAt` set to "now" so
 * the Q&A goes live on the site. Pass `"publish": false` in the JSON payload
 * to create as a draft for manual review in Studio instead.
 *
 * (The script name retains "-draft" for backwards compatibility with the
 * earlier convention; the default behavior is now publish-on-create.)
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
 *   "publishedAt": "2026-05-21T00:00:00Z", // optional; defaults to now if publishing
 *   "publish": true                        // optional; default true. false = create as draft
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

const publish = payload.publish !== false;

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

const id = randomUUID();
const doc = {
  _id: publish ? id : `drafts.${id}`,
  _type: "qa",
  question: payload.question,
  slug: { _type: "slug", current: slug },
  lia: { _type: "reference", _ref: payload.liaId },
  youtubeUrl: payload.youtubeUrl,
  transcript: payload.transcript,
  article: payload.article,
  publishedAt: payload.publishedAt || (publish ? new Date().toISOString() : undefined),
};

const result = await client.create(doc);
console.log(`Created ${publish ? "published" : "draft"} qa document:`);
console.log(`  _id: ${result._id}`);
console.log(`  slug: ${result.slug.current}`);
console.log(`  publishedAt: ${result.publishedAt || "(not set)"}`);
console.log(
  `  Open in Studio: https://www.sanity.io/@ogeyySxqI/studio/au38jvffmsguvwbhyehqn93a/horizons-studio/structure/qa;${result._id}`
);
if (publish) {
  console.log(`  Live URL (after ~60s ISR): https://horizons.nz/answers/${result.slug.current}`);
}
