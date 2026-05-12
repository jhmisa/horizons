import type { SanityImage } from "./post";

export type SuccessStoryCard = {
  _id: string;
  clientFirstName: string;
  slug: { current: string };
  originLocation?: string;
  destination?: string;
  visaCategory?: string;
  summary: string;
  photo?: SanityImage;
  youtubeUrl?: string;
  publishedAt: string;
};
