import type { PortableTextBlock } from "@portabletext/react";

export type LIA = {
  _id: string;
  name: string;
  licenseNumber: string;
  photo: { asset: { _ref: string } };
  bio: string;
};

export type QA = {
  _id: string;
  question: string;
  slug: { current: string };
  lia: LIA;
  // Optional: AU/CA Q&As may be text-only (no video).
  youtubeUrl?: string | null;
  transcript?: string;
  article?: PortableTextBlock[];
  publishedAt: string;
};

export type QACardData = Pick<
  QA,
  "_id" | "question" | "slug" | "publishedAt" | "youtubeUrl"
> & {
  lia: Pick<LIA, "name" | "photo">;
};
