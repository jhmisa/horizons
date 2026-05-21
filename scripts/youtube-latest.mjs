#!/usr/bin/env node
/**
 * Fetch the latest uploads on the authenticated YouTube channel.
 *
 * Reuses the refresh token saved by scripts/youtube-auth.mjs.
 *
 * Usage:
 *   node scripts/youtube-latest.mjs [--count 1] [--json]
 *
 * Flags:
 *   --count <n>   Number of recent uploads to return (default: 1, max: 50).
 *   --json        Emit a JSON array instead of the default human-readable table.
 *
 * Behavior:
 *   1. channels.list(mine=true, part=contentDetails)
 *      → uploads playlist ID
 *   2. playlistItems.list(playlistId, part=contentDetails,snippet)
 *      → recent video IDs in upload order
 *   3. videos.list(id=<comma-joined>, part=snippet,status)
 *      → title, description, tags, categoryId, publishedAt, privacyStatus
 *
 * Default output (one line per video):
 *   <videoId>  <relTime>  privacy=<status>  cat=<id> (<label>)  <title>
 *
 * --json output: array of objects with full metadata, consumable by skills.
 */
import { readFileSync, existsSync } from "node:fs";
import { google } from "googleapis";

const CRED_PATH = ".youtube-credentials/client_secret.json";
const TOKEN_PATH = ".youtube-credentials/token.json";

// Small lookup for the categories Horizons cares about. Falls back to "id N"
// for anything not in the map. No need to call videoCategories.list at runtime.
const CATEGORY_LABELS = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "19": "Travel & Events",
  "20": "Gaming",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
};

function parseArgs(argv) {
  const args = { flags: {}, bools: new Set() };
  const boolFlags = new Set(["json"]);
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    if (boolFlags.has(key)) {
      args.bools.add(key);
    } else {
      args.flags[key] = argv[++i];
    }
  }
  return args;
}

function relTime(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

const args = parseArgs(process.argv);
const count = Math.max(1, Math.min(50, parseInt(args.flags.count ?? "1", 10) || 1));
const asJson = args.bools.has("json");

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

const channelResp = await youtube.channels.list({
  part: ["contentDetails", "snippet"],
  mine: true,
});

const channel = channelResp.data.items?.[0];
const uploadsPlaylistId =
  channel?.contentDetails?.relatedPlaylists?.uploads;

if (!uploadsPlaylistId) {
  console.error(
    "Could not resolve the authenticated channel's uploads playlist. " +
      "Confirm the OAuth token belongs to a channel with at least one upload."
  );
  process.exit(1);
}

const itemsResp = await youtube.playlistItems.list({
  part: ["snippet", "contentDetails"],
  playlistId: uploadsPlaylistId,
  maxResults: count,
});

const videoIds = (itemsResp.data.items ?? [])
  .map((i) => i.contentDetails?.videoId)
  .filter(Boolean);

if (videoIds.length === 0) {
  if (asJson) {
    console.log("[]");
  } else {
    console.error("No uploads found on this channel.");
  }
  process.exit(0);
}

const videosResp = await youtube.videos.list({
  part: ["snippet", "status"],
  id: videoIds,
});

const videos = videosResp.data.items ?? [];

// Preserve the upload order from playlistItems (videos.list may reorder).
const orderedVideos = videoIds
  .map((id) => videos.find((v) => v.id === id))
  .filter(Boolean);

const rows = orderedVideos.map((v) => {
  const categoryId = v.snippet?.categoryId ?? "";
  return {
    videoId: v.id,
    title: v.snippet?.title ?? "",
    publishedAt: v.snippet?.publishedAt ?? "",
    privacyStatus: v.status?.privacyStatus ?? "",
    embeddable: v.status?.embeddable ?? null,
    categoryId,
    categoryLabel: CATEGORY_LABELS[categoryId] ?? `id ${categoryId}`,
    description: v.snippet?.description ?? "",
    tags: v.snippet?.tags ?? [],
  };
});

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  for (const r of rows) {
    console.log(
      `${r.videoId}  ${relTime(r.publishedAt).padEnd(8)}  privacy=${r.privacyStatus.padEnd(8)}  embed=${String(r.embeddable).padEnd(5)}  cat=${r.categoryId.padEnd(3)} (${r.categoryLabel})  ${r.title}`
    );
  }
}
