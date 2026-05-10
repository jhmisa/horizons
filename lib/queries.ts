import { groq } from "next-sanity";

export const publishedQAsQuery = groq`
  *[_type == "qa" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
    _id,
    question,
    slug,
    publishedAt,
    "lia": lia->{ name, photo },
    "video": { "asset": video.asset->{ playbackId, thumbTime } }
  }
`;

export const qaBySlugQuery = groq`
  *[_type == "qa" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
    _id,
    question,
    slug,
    publishedAt,
    transcript,
    article,
    "lia": lia->{ _id, name, licenseNumber, photo, bio },
    "video": { "asset": video.asset->{ playbackId, duration, thumbTime } }
  }
`;

export const publishedQASlugsQuery = groq`
  *[_type == "qa" && defined(publishedAt) && publishedAt <= now()].slug.current
`;
