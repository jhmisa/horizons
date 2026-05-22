#!/usr/bin/env node
/**
 * backfill-country.mjs
 *
 * One-shot backfill that tags every existing qa / post / successStory /
 * submittedQuestion document with `country: 'nz'` if it does not yet
 * have a country value. Idempotent: documents that already have a
 * country are skipped.
 *
 * Usage:
 *   node scripts/backfill-country.mjs           # DRY RUN — no writes
 *   node scripts/backfill-country.mjs --apply   # actually patch documents
 *
 * Reads env from .env.local (matching the pattern used by other scripts in
 * this directory). Required vars:
 *   - SANITY_API_TOKEN
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET
 *   - NEXT_PUBLIC_SANITY_API_VERSION (optional; defaults to 2024-10-01)
 */

import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");
const DEFAULT_COUNTRY = "nz";
const TYPES = ["qa", "post", "successStory", "submittedQuestion"];

const fileEnv = existsSync(".env.local")
  ? Object.fromEntries(
      readFileSync(".env.local", "utf8")
        .split("\n")
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => {
          const i = l.indexOf("=");
          return [
            l.slice(0, i).trim(),
            l
              .slice(i + 1)
              .trim()
              .replace(/^["']|["']$/g, ""),
          ];
        })
    )
  : {};

const env = { ...fileEnv, ...process.env };

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set (via .env.local or environment)."
  );
  process.exit(1);
}
if (!token) {
  console.error(
    "ERROR: SANITY_API_TOKEN must be set (via .env.local or environment)."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

if (!APPLY) {
  console.log("DRY RUN — pass --apply to make changes");
} else {
  console.log("APPLY MODE — patches will be committed to Sanity");
}
console.log(
  `Project: ${projectId}  Dataset: ${dataset}  API version: ${apiVersion}`
);
console.log("");

const summary = {};

for (const type of TYPES) {
  // Fetch IDs of all documents of this type that are missing a country.
  // Sanity returns both published and draft (drafts.*) docs; the query
  // returns each by its actual document ID, which is what we patch.
  const ids = await client.fetch(
    `*[_type == $type && !defined(country)]._id`,
    { type }
  );

  summary[type] = { found: ids.length, patched: 0 };

  if (ids.length === 0) {
    console.log(`[${type}] no docs missing country — skipping`);
    continue;
  }

  const sample = ids.slice(0, 5);
  console.log(
    `[${type}] ${ids.length} doc(s) missing country. Sample IDs: ${sample.join(", ")}${ids.length > sample.length ? ", ..." : ""}`
  );

  if (!APPLY) continue;

  // Patch in chunks of 50 so we don't hit transaction-size limits on big datasets.
  const CHUNK = 50;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const tx = client.transaction();
    for (const id of chunk) {
      tx.patch(id, (p) =>
        p.setIfMissing({ country: DEFAULT_COUNTRY })
      );
    }
    const result = await tx.commit();
    summary[type].patched += result.results.length;
    console.log(
      `  [${type}] patched ${summary[type].patched}/${ids.length}`
    );
  }
}

console.log("");
if (APPLY) {
  const parts = TYPES.map(
    (t) => `${summary[t].patched} ${t} docs`
  ).join(", ");
  console.log(`Patched ${parts}.`);
} else {
  const parts = TYPES.map(
    (t) => `${summary[t].found} ${t} docs`
  ).join(", ");
  console.log(`Would patch ${parts} (re-run with --apply to commit).`);
}
