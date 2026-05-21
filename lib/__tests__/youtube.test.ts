import { describe, it, expect } from "vitest";
import {
  extractYouTubeId,
  youtubeThumbnail,
  youtubeWatchUrl,
  youtubeEmbedUrl,
} from "../youtube";

describe("extractYouTubeId", () => {
  it("parses standard watch URLs", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=ASbMvKQrHJ8")).toBe(
      "ASbMvKQrHJ8"
    );
  });

  it("parses short youtu.be URLs", () => {
    expect(extractYouTubeId("https://youtu.be/ASbMvKQrHJ8")).toBe(
      "ASbMvKQrHJ8"
    );
  });

  it("parses embed URLs", () => {
    expect(
      extractYouTubeId("https://www.youtube.com/embed/ASbMvKQrHJ8")
    ).toBe("ASbMvKQrHJ8");
  });

  it("parses shorts URLs", () => {
    expect(
      extractYouTubeId("https://www.youtube.com/shorts/ASbMvKQrHJ8")
    ).toBe("ASbMvKQrHJ8");
  });

  it("parses youtube-nocookie URLs", () => {
    expect(
      extractYouTubeId("https://www.youtube-nocookie.com/embed/ASbMvKQrHJ8")
    ).toBe("ASbMvKQrHJ8");
  });

  it("ignores extra query params and fragments", () => {
    expect(
      extractYouTubeId(
        "https://www.youtube.com/watch?v=ASbMvKQrHJ8&t=42s&feature=share"
      )
    ).toBe("ASbMvKQrHJ8");
    expect(
      extractYouTubeId("https://youtu.be/ASbMvKQrHJ8?si=xyz&t=10")
    ).toBe("ASbMvKQrHJ8");
  });

  it("tolerates leading/trailing whitespace", () => {
    expect(extractYouTubeId("  https://youtu.be/ASbMvKQrHJ8  ")).toBe(
      "ASbMvKQrHJ8"
    );
  });

  it("returns null for non-YouTube URLs", () => {
    expect(extractYouTubeId("https://vimeo.com/123456789")).toBeNull();
    expect(extractYouTubeId("https://example.com/watch?v=ASbMvKQrHJ8")).toBeNull();
  });

  it("returns null for missing or malformed input", () => {
    expect(extractYouTubeId("")).toBeNull();
    expect(extractYouTubeId("not a url")).toBeNull();
    expect(extractYouTubeId("https://www.youtube.com/watch")).toBeNull();
    expect(extractYouTubeId("https://www.youtube.com/watch?v=short")).toBeNull();
  });
});

describe("youtubeThumbnail", () => {
  it("returns maxres thumbnail by default", () => {
    expect(youtubeThumbnail("ASbMvKQrHJ8")).toBe(
      "https://i.ytimg.com/vi/ASbMvKQrHJ8/maxresdefault.jpg"
    );
  });

  it("returns hq thumbnail when quality='hq'", () => {
    expect(youtubeThumbnail("ASbMvKQrHJ8", "hq")).toBe(
      "https://i.ytimg.com/vi/ASbMvKQrHJ8/hqdefault.jpg"
    );
  });

  it("returns sd thumbnail when quality='sd'", () => {
    expect(youtubeThumbnail("ASbMvKQrHJ8", "sd")).toBe(
      "https://i.ytimg.com/vi/ASbMvKQrHJ8/sddefault.jpg"
    );
  });
});

describe("youtubeWatchUrl", () => {
  it("returns the canonical watch URL for an ID", () => {
    expect(youtubeWatchUrl("ASbMvKQrHJ8")).toBe(
      "https://www.youtube.com/watch?v=ASbMvKQrHJ8"
    );
  });
});

describe("youtubeEmbedUrl", () => {
  it("returns the no-cookie embed URL by default", () => {
    expect(youtubeEmbedUrl("ASbMvKQrHJ8")).toBe(
      "https://www.youtube-nocookie.com/embed/ASbMvKQrHJ8"
    );
  });
});
