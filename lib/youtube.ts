const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export function extractYouTubeId(
  input: string | null | undefined
): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  let candidate: string | null = null;

  if (url.hostname === "youtu.be") {
    candidate = url.pathname.replace(/^\//, "").split("/")[0] || null;
  } else if (url.pathname === "/watch") {
    candidate = url.searchParams.get("v");
  } else {
    const match = url.pathname.match(/^\/(?:embed|shorts|v)\/([^/?#]+)/);
    if (match) candidate = match[1];
  }

  if (candidate && YOUTUBE_ID_RE.test(candidate)) return candidate;
  return null;
}

export type ThumbnailQuality = "maxres" | "hq" | "sd";

export function youtubeThumbnail(
  videoId: string,
  quality: ThumbnailQuality = "maxres"
): string {
  const file =
    quality === "maxres"
      ? "maxresdefault.jpg"
      : quality === "hq"
        ? "hqdefault.jpg"
        : "sddefault.jpg";
  return `https://i.ytimg.com/vi/${videoId}/${file}`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
