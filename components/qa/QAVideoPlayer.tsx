"use client";

import MuxPlayer from "@mux/mux-player-react";

type Props = {
  playbackId: string;
  title: string;
  poster?: string;
};

export function QAVideoPlayer({ playbackId, title, poster }: Props) {
  if (!playbackId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        Video processing…
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={poster}
      metadata={{ video_title: title }}
      accentColor="#0284c7"
      className="aspect-video w-full overflow-hidden rounded-2xl"
    />
  );
}
