import type { PortableTextBlock } from "@portabletext/react";

export type LIA = {
  _id: string;
  name: string;
  licenseNumber: string;
  photo: { asset: { _ref: string } };
  bio: string;
};

export type MuxVideo = {
  asset: {
    _ref: string;
    playbackId: string;
    duration: number;
    thumbTime?: number;
  };
};

export type QA = {
  _id: string;
  question: string;
  slug: { current: string };
  lia: LIA;
  video: MuxVideo;
  transcript?: string;
  article?: PortableTextBlock[];
  publishedAt: string;
};

export type QACardData = Pick<QA, "_id" | "question" | "slug" | "publishedAt"> & {
  lia: Pick<LIA, "name" | "photo">;
  video: { asset: { playbackId: string; thumbTime?: number } };
};
