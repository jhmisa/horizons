import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  asset: { _ref: string };
  alt?: string;
};

export type PostCard = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  publishedAt: string;
  heroImage?: SanityImage;
  author?: { name: string };
};

export type Post = PostCard & {
  body?: PortableTextBlock[];
  youtubeUrl?: string;
  author?: {
    name: string;
    bio?: string;
    photo?: SanityImage;
  };
};
