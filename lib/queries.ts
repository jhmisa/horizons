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

export const publishedPostsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    heroImage,
    "author": author->{ name }
  }
`;

export const homepageBlogCardsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    heroImage
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    heroImage,
    body,
    youtubeUrl,
    "author": author->{ name, bio, photo }
  }
`;

export const publishedPostSlugsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()].slug.current
`;

export const publishedSuccessStoriesQuery = groq`
  *[_type == "successStory" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
    _id,
    clientFirstName,
    slug,
    originLocation,
    destination,
    visaCategory,
    summary,
    photo,
    youtubeUrl,
    publishedAt
  }
`;

export const featuredGoogleReviewsQuery = groq`
  *[_type == "googleReview" && defined(publishedAt) && publishedAt <= now() && featured == true]
    | order(reviewDate desc) [0...5] {
    _id,
    authorName,
    rating,
    quote,
    reviewDate,
    googleReviewUrl,
    clientCountry
  }
`;

export const allGoogleReviewsQuery = groq`
  *[_type == "googleReview" && defined(publishedAt) && publishedAt <= now()]
    | order(reviewDate desc) {
    _id,
    authorName,
    rating,
    quote,
    reviewDate,
    googleReviewUrl,
    clientCountry
  }
`;
