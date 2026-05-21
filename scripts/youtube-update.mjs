#!/usr/bin/env node
/**
 * Update a YouTube video's metadata via the YouTube Data API v3.
 *
 * Reuses the refresh token saved by scripts/youtube-auth.mjs.
 *
 * Usage:
 *   node scripts/youtube-update.mjs <videoId> [flags]
 *
 * Flags (all optional — supply only what you want to change):
 *   --title "New title"
 *   --description "Inline description"
 *   --description-file path/to/desc.md   (overrides --description)
 *   --tags "tag one,tag two,tag three"   (comma-separated)
 *   --category-id 27                     (default: keep current)
 *   --thumbnail path/to/image.jpg        (sets custom thumbnail; JPG/PNG, <2MB)
 *   --dry-run                            (fetch + show diff but don't write)
 *   --show                               (just print current metadata and exit)
 *
 * Notes:
 *   YouTube requires snippet.categoryId on every update, so the script fetches
 *   current metadata first and merges your changes into it.
 */
import { readFileSync, existsSync, createReadStream } from "node:fs";
import { google } from "googleapis";

const CRED_PATH = ".youtube-credentials/client_secret.json";
const TOKEN_PATH = ".youtube-credentials/token.json";

function parseArgs(argv) {
  const args = { _: [], flags: {}, bools: new Set() };
  const boolFlags = new Set(["dry-run", "show"]);
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (boolFlags.has(key)) {
        args.bools.add(key);
      } else {
        args.flags[key] = argv[++i];
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

const args = parseArgs(process.argv);
const videoId = args._[0];

if (!videoId) {
  console.error("Usage: node scripts/youtube-update.mjs <videoId> [flags]");
  console.error("Run with no flags + --show to just inspect current metadata.");
  process.exit(1);
}

if (!existsSync(CRED_PATH) || !existsSync(TOKEN_PATH)) {
  console.error(`Missing ${CRED_PATH} or ${TOKEN_PATH}.`);
  console.error(`Run: node scripts/youtube-auth.mjs first.`);
  process.exit(1);
}

const { installed } = JSON.parse(readFileSync(CRED_PATH, "utf8"));
const tokens = JSON.parse(readFileSync(TOKEN_PATH, "utf8"));

const oauth2 = new google.auth.OAuth2(
  installed.client_id,
  installed.client_secret
);
oauth2.setCredentials(tokens);

const youtube = google.youtube({ version: "v3", auth: oauth2 });

const currentResp = await youtube.videos.list({
  part: ["snippet", "status"],
  id: [videoId],
});

const video = currentResp.data.items?.[0];
if (!video) {
  console.error(`Video ${videoId} not found, or your account can't see it.`);
  console.error(`Confirm the ID and that you authorized the channel that owns it.`);
  process.exit(1);
}

const current = video.snippet;
console.log(`\nCurrent metadata for ${videoId}:`);
console.log(`  Title:       ${current.title}`);
console.log(`  Channel:     ${current.channelTitle}`);
console.log(`  Category ID: ${current.categoryId}`);
console.log(`  Tags:        ${(current.tags || []).join(", ") || "(none)"}`);
console.log(`  Description: ${(current.description || "").slice(0, 80)}${
  (current.description || "").length > 80 ? "..." : ""
}`);

if (args.bools.has("show")) {
  process.exit(0);
}

const newSnippet = { ...current };

if (args.flags.title) newSnippet.title = args.flags.title;

if (args.flags["description-file"]) {
  newSnippet.description = readFileSync(args.flags["description-file"], "utf8");
} else if (args.flags.description) {
  newSnippet.description = args.flags.description;
}

if (args.flags.tags) {
  newSnippet.tags = args.flags.tags.split(",").map((t) => t.trim()).filter(Boolean);
}

if (args.flags["category-id"]) newSnippet.categoryId = args.flags["category-id"];

const changed = Object.keys(args.flags).filter((k) =>
  ["title", "description", "description-file", "tags", "category-id"].includes(k)
);
const willUpload = Boolean(args.flags.thumbnail);

if (changed.length === 0 && !willUpload) {
  console.log(`\nNo changes requested. Use --title / --description / --tags / --thumbnail / --show.`);
  process.exit(0);
}

console.log(`\nProposed changes: ${changed.join(", ") || "(metadata unchanged)"}${
  willUpload ? `; thumbnail: ${args.flags.thumbnail}` : ""
}`);

if (args.bools.has("dry-run")) {
  console.log(`\n[dry-run] Skipping write.`);
  process.exit(0);
}

if (changed.length > 0) {
  await youtube.videos.update({
    part: ["snippet"],
    requestBody: { id: videoId, snippet: newSnippet },
  });
  console.log(`Metadata updated.`);
}

if (willUpload) {
  await youtube.thumbnails.set({
    videoId,
    media: { body: createReadStream(args.flags.thumbnail) },
  });
  console.log(`Thumbnail uploaded.`);
}

console.log(`Done.`);
