import { groq } from "next-sanity";

export const publishedQAsQuery = groq`
  *[_type == "qa" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
    _id,
    question,
    slug,
    publishedAt,
    youtubeUrl,
    "lia": lia->{ name, photo }
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
    youtubeUrl,
    "lia": lia->{ _id, name, licenseNumber, photo, bio }
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
    youtubeUrl,
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

// -----------------------------------------------------------------------------
// Country-aware queries
// -----------------------------------------------------------------------------
// Filter rule: a piece of content shows on a country's page when
//   country == $country  OR  country == "global"
// $country is a visitor's country (`'nz' | 'au' | 'ca'`). `'global'` is a
// content tag only, not a visitor value.
//
// Existing queries above remain unchanged for backwards-compat. Task 4 will
// migrate pages to the queries below.

// --- Q&A ---------------------------------------------------------------------

export const publishedQAsForCountryQuery = groq`
  *[_type == "qa"
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")]
    | order(publishedAt desc) {
    _id,
    question,
    slug,
    publishedAt,
    youtubeUrl,
    country,
    "lia": lia->{ name, photo }
  }
`;

export const qaBySlugForCountryQuery = groq`
  *[_type == "qa"
    && slug.current == $slug
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")][0] {
    _id,
    question,
    slug,
    publishedAt,
    transcript,
    article,
    youtubeUrl,
    country,
    "lia": lia->{ _id, name, licenseNumber, photo, bio }
  }
`;

export const publishedQASlugsForCountryQuery = groq`
  *[_type == "qa"
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")].slug.current
`;

// --- Blog posts --------------------------------------------------------------

export const publishedPostsForCountryQuery = groq`
  *[_type == "post"
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")]
    | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    heroImage,
    youtubeUrl,
    country,
    "author": author->{ name }
  }
`;

export const homepageBlogCardsForCountryQuery = groq`
  *[_type == "post"
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")]
    | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    heroImage,
    country
  }
`;

export const postBySlugForCountryQuery = groq`
  *[_type == "post"
    && slug.current == $slug
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")][0] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    heroImage,
    body,
    youtubeUrl,
    country,
    "author": author->{ name, bio, photo }
  }
`;

export const publishedPostSlugsForCountryQuery = groq`
  *[_type == "post"
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")].slug.current
`;

// --- Success stories ---------------------------------------------------------
// AU/CA success-stories pages aren't being built yet. These queries exist so
// Task 4 can wire NZ pages to country-aware fetches explicitly — insurance
// against a future AU/CA story leaking onto the NZ page.

export const publishedSuccessStoriesForCountryQuery = groq`
  *[_type == "successStory"
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")]
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
    publishedAt,
    country
  }
`;

export const successStoryBySlugForCountryQuery = groq`
  *[_type == "successStory"
    && slug.current == $slug
    && defined(publishedAt) && publishedAt <= now()
    && (country == $country || country == "global")][0] {
    _id,
    clientFirstName,
    slug,
    originLocation,
    destination,
    visaCategory,
    summary,
    story,
    photo,
    youtubeUrl,
    publishedAt,
    country,
    "adviser": adviser->{ name, photo }
  }
`;
