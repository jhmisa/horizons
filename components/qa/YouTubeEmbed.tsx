"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

type Props = {
  videoId: string;
  title: string;
  poster?: "maxresdefault" | "hqdefault" | "sddefault" | "mqdefault" | "default";
};

export function YouTubeEmbed({
  videoId,
  title,
  poster = "maxresdefault",
}: Props) {
  return (
    <LiteYouTubeEmbed
      id={videoId}
      title={title}
      poster={poster}
      webp
      cookie={false}
      wrapperClass="yt-lite rounded-2xl overflow-hidden"
    />
  );
}
