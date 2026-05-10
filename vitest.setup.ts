// Provide fallback env vars so `sanity/env.ts` doesn't throw when test modules
// transitively import the Sanity client.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "test-project";
process.env.NEXT_PUBLIC_SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "test";
process.env.NEXT_PUBLIC_SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

import "@testing-library/jest-dom/vitest";
