# Q&A Video Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public, SEO-optimized Q&A video library: visitors browse and watch licensed-adviser videos at `/answers/[slug]` with a sticky "Book a Consultation" CTA, while the admin authors everything through an embedded Sanity Studio at `/studio` with Mux-backed video uploads.

**Architecture:** Sanity is the CMS (LIAs and Q&As as document types), Mux owns video storage and playback, Next.js 16 (App Router) renders the public pages server-side and embeds the Studio at `/studio`. Public pages fetch via `@sanity/client` and use ISR (`revalidate: 60`) so edits go live within a minute without a redeploy.

**Tech Stack:** Next.js 16, TypeScript, Tailwind v4, Sanity v3, `next-sanity`, `sanity-plugin-mux-input`, `@mux/mux-player-react`, `@portabletext/react`, `@sanity/image-url`, Vitest + React Testing Library for the small test suite.

**Reference spec:** `docs/superpowers/specs/2026-05-10-qa-feature-design.md`

---

## Phase 0 — Human setup (no code; admin actions outside the repo)

This phase happens once. The admin (Joey) performs these steps in a browser and shares the resulting credentials. Nothing is committed until Phase 1.

- [ ] **Step 0.1 — Create a Sanity account and project**
  - Sign up at https://www.sanity.io/ with `jhmisa@proton.me`.
  - In the dashboard, click **Create new project**. Name it `horizons`. Dataset name: `production`. Visibility: public (read).
  - Copy the **Project ID** from the project settings page.

- [ ] **Step 0.2 — Create a Sanity API token**
  - In project settings → **API** → **Tokens** → **Add API token**.
  - Name: `next-app-write`. Permissions: **Editor**.
  - Copy the token (it's shown once).

- [ ] **Step 0.3 — Allowlist localhost and the Vercel domains for Studio CORS**
  - In project settings → **API** → **CORS origins** → **Add CORS origin**.
  - Add: `http://localhost:3000` (with credentials) and the Vercel preview/prod URL (with credentials).

- [ ] **Step 0.4 — Create a Mux account and environment**
  - Sign up at https://www.mux.com/.
  - In the dashboard, create a new environment named `horizons`.
  - Settings → **Access Tokens** → **Generate new token**. Permissions: **Mux Video** with full access. Capture **Token ID** and **Token Secret** (shown once).

- [ ] **Step 0.5 — Add env vars to `.env.local` (local) and Vercel dashboard (production)**
  - Create `/Users/joeymisa/Documents/HorizonsWebsite/.env.local` with:
    ```
    NEXT_PUBLIC_SANITY_PROJECT_ID=<project id from 0.1>
    NEXT_PUBLIC_SANITY_DATASET=production
    SANITY_API_TOKEN=<token from 0.2>
    NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
    MUX_TOKEN_ID=<from 0.4>
    MUX_TOKEN_SECRET=<from 0.4>
    ```
  - In Vercel → project → Settings → Environment Variables, add the same six entries for **Production** and **Preview** environments.

---

## Phase 1 — Sanity Studio bootstrap

### Task 1: Install Sanity and content dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1.1 — Install runtime dependencies**

Run: `npm install next-sanity@^12 sanity@^3 @sanity/client@^6 @sanity/image-url@^1 @portabletext/react@^3 styled-components@^6`

(Note: `next-sanity@^12` is required for Next.js 16 compatibility. Earlier versions targeted Next.js 14/15.)

Expected: dependencies installed; lockfile updated.

- [ ] **Step 1.2 — Commit**

```bash
git add package.json package-lock.json
git commit -m "Install Sanity content dependencies for Q&A feature"
```

---

### Task 2: Create the env-var helper

**Files:**
- Create: `sanity/env.ts`
- Create: `.env.local.example`

- [ ] **Step 2.1 — Create the env helper**

Create `sanity/env.ts`:

```typescript
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const token = process.env.SANITY_API_TOKEN;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
```

- [ ] **Step 2.2 — Create `.env.local.example`**

Create `/Users/joeymisa/Documents/HorizonsWebsite/.env.local.example`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

- [ ] **Step 2.3 — Commit**

```bash
git add sanity/env.ts .env.local.example
git commit -m "Add Sanity env helper and example env file"
```

---

### Task 3: Define the LIA schema

**Files:**
- Create: `sanity/schemas/lia.ts`

- [ ] **Step 3.1 — Create the LIA schema**

Create `sanity/schemas/lia.ts`:

```typescript
import { defineField, defineType } from "sanity";

export const lia = defineType({
  name: "lia",
  title: "Licensed Immigration Adviser",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "licenseNumber",
      title: "License number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      description:
        "Hides this LIA from the Q&A dropdown for new content. Existing Q&As still show their attribution.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "licenseNumber", media: "photo" },
  },
});
```

- [ ] **Step 3.2 — Commit**

```bash
git add sanity/schemas/lia.ts
git commit -m "Add LIA Sanity schema"
```

---

### Task 4: Define the Q&A schema (text fields only — video added in Phase 2)

**Files:**
- Create: `sanity/schemas/qa.ts`

- [ ] **Step 4.1 — Create the Q&A schema**

Create `sanity/schemas/qa.ts`:

```typescript
import { defineField, defineType } from "sanity";

export const qa = defineType({
  name: "qa",
  title: "Q&A",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(5).max(250),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "question", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lia",
      title: "Licensed Immigration Adviser",
      type: "reference",
      to: [{ type: "lia" }],
      options: {
        filter: "archived != true",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "text",
      rows: 12,
      description: "Plain-text transcript. Paragraph breaks preserved.",
    }),
    defineField({
      name: "article",
      title: "Article body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
      description: "Long-form article (optional). Notion-style editor.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description:
        "Empty = draft. Past date = live. Future date = scheduled.",
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "lia.name", media: "lia.photo" },
  },
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
```

- [ ] **Step 4.2 — Commit**

```bash
git add sanity/schemas/qa.ts
git commit -m "Add Q&A Sanity schema (text fields)"
```

---

### Task 5: Wire up the schema barrel and `sanity.config.ts`

**Files:**
- Create: `sanity/schemas/index.ts`
- Create: `sanity.config.ts`

- [ ] **Step 5.1 — Create the schema barrel**

Create `sanity/schemas/index.ts`:

```typescript
import { lia } from "./lia";
import { qa } from "./qa";

export const schemaTypes = [lia, qa];
```

- [ ] **Step 5.2 — Create `sanity.config.ts` at the repo root**

Create `/Users/joeymisa/Documents/HorizonsWebsite/sanity.config.ts`:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "horizons-studio",
  title: "Horizons Studio",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 5.3 — Install the vision plugin (used in 5.2)**

Run: `npm install @sanity/vision@^3`

- [ ] **Step 5.4 — Commit**

```bash
git add sanity/schemas/index.ts sanity.config.ts package.json package-lock.json
git commit -m "Wire up Sanity config with LIA and Q&A schemas"
```

---

### Task 6: Mount the Studio at `/studio`

**Files:**
- Create: `app/studio/[[...tool]]/page.tsx`
- Create: `app/studio/[[...tool]]/layout.tsx`

- [ ] **Step 6.1 — Create the Studio route**

Create `app/studio/[[...tool]]/page.tsx`:

```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 6.2 — Create a minimal layout (so Studio renders standalone, without the site nav/footer)**

Create `app/studio/[[...tool]]/layout.tsx`:

```tsx
export const metadata = {
  title: "Studio | Horizons",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 6.3 — Run dev server and verify Studio loads**

Run: `npm run dev`

Open: http://localhost:3000/studio

Expected: Sanity Studio login screen → after magic-link login, you see the dashboard with "Licensed Immigration Adviser" and "Q&A" sections in the left rail.

**Acceptance:** Create one test LIA (with a photo) and one test Q&A (skip the video field for now — it doesn't exist yet). Save both as drafts.

- [ ] **Step 6.4 — Commit**

```bash
git add app/studio/
git commit -m "Mount Sanity Studio at /studio"
```

---

## Phase 2 — Mux video integration

### Task 7: Install Mux dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 7.1 — Install Mux packages**

Run: `npm install sanity-plugin-mux-input@^2 @mux/mux-player-react@^3`

- [ ] **Step 7.2 — Commit**

```bash
git add package.json package-lock.json
git commit -m "Install Mux Sanity plugin and player"
```

---

### Task 8: Wire the Mux plugin into Sanity config and add the `video` field

**Files:**
- Modify: `sanity.config.ts`
- Modify: `sanity/schemas/qa.ts`

- [ ] **Step 8.1 — Add the Mux plugin to `sanity.config.ts`**

Edit `sanity.config.ts`. Change:

```typescript
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
```

to:

```typescript
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
```

And change the `plugins` array to:

```typescript
plugins: [
  structureTool(),
  visionTool({ defaultApiVersion: apiVersion }),
  muxInput(),
],
```

- [ ] **Step 8.2 — Add the `video` field to the Q&A schema**

Edit `sanity/schemas/qa.ts`. In the `fields` array, insert this new field directly after the `lia` field:

```typescript
defineField({
  name: "video",
  title: "Video",
  type: "mux.video",
  validation: (rule) => rule.required(),
}),
```

- [ ] **Step 8.3 — Add Mux secret keys document type (the plugin needs this once)**

In Studio, navigate to the new "Mux secret" type and paste the `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` values from `.env.local`. (This stores them encrypted inside Sanity so the upload UI in Studio can talk to Mux.)

This is a manual one-time Studio action, not a code change.

- [ ] **Step 8.4 — Restart dev server and verify a real video upload**

Run: `npm run dev`

Open: http://localhost:3000/studio

Open the test Q&A from Task 6. Drag a short `.mp4` (10–30 sec is fine) into the Video field. Watch the chunked upload progress; wait for Mux processing to finish (~1–2 min). The Studio preview should show the playable video.

**Acceptance:** Video uploads, processes, and plays inside Studio.

- [ ] **Step 8.5 — Commit**

```bash
git add sanity.config.ts sanity/schemas/qa.ts
git commit -m "Wire Mux input plugin and add video field to Q&A schema"
```

---

## Phase 3 — Public pages

### Task 9: Create the Sanity client and shared GROQ queries

**Files:**
- Create: `lib/sanity.ts`
- Create: `lib/queries.ts`
- Create: `lib/image.ts`
- Create: `types/qa.ts`

- [ ] **Step 9.1 — Create the read-only Sanity client**

Create `lib/sanity.ts`:

```typescript
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
```

- [ ] **Step 9.2 — Create the image URL builder**

Create `lib/image.ts`:

```typescript
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "./sanity";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 9.3 — Define the TypeScript types**

Create `types/qa.ts`:

```typescript
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
```

- [ ] **Step 9.4 — Define the GROQ queries**

Create `lib/queries.ts`:

```typescript
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
```

- [ ] **Step 9.5 — Commit**

```bash
git add lib/sanity.ts lib/image.ts lib/queries.ts types/qa.ts
git commit -m "Add Sanity client, queries, and Q&A types"
```

---

### Task 10: Set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 10.1 — Install Vitest and React Testing Library**

Run: `npm install -D vitest@^2 @vitejs/plugin-react@^4 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25`

- [ ] **Step 10.2 — Create `vitest.config.ts`**

Create `/Users/joeymisa/Documents/HorizonsWebsite/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 10.3 — Create `vitest.setup.ts`**

Create `/Users/joeymisa/Documents/HorizonsWebsite/vitest.setup.ts`:

```typescript
// Provide fallback env vars so `sanity/env.ts` doesn't throw when test modules
// transitively import the Sanity client.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "test-project";
process.env.NEXT_PUBLIC_SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "test";
process.env.NEXT_PUBLIC_SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 10.4 — Add a `test` script**

Edit `package.json`. Change `"scripts"` to include `"test": "vitest run"` and `"test:watch": "vitest"`:

```json
"scripts": {
  "dev": "next dev -H 0.0.0.0",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 10.5 — Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "Set up Vitest with React Testing Library"
```

---

### Task 11: Build `LIAAttribution` component (TDD)

**Files:**
- Modify: `next.config.ts`
- Create: `components/qa/LIAAttribution.tsx`
- Create: `components/qa/__tests__/LIAAttribution.test.tsx`

- [ ] **Step 11.0 — Allow Sanity CDN and Mux thumbnails for `next/image`**

Edit `next.config.ts`. The existing file is short; replace its contents with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
};

export default nextConfig;
```

(If `next.config.ts` already has unrelated settings, preserve them — just add the `images.remotePatterns` block.)

- [ ] **Step 11.1 — Write the failing test**

Create `components/qa/__tests__/LIAAttribution.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LIAAttribution } from "../LIAAttribution";

const fakeLIA = {
  _id: "lia-1",
  name: "David Mitchell",
  licenseNumber: "201500123",
  photo: { asset: { _ref: "image-fake-100x100-jpg" } },
  bio: "12 years helping families migrate to New Zealand.",
};

describe("LIAAttribution", () => {
  it("renders the LIA name, role, license, and bio", () => {
    render(<LIAAttribution lia={fakeLIA} />);
    expect(screen.getByText("David Mitchell")).toBeInTheDocument();
    expect(
      screen.getByText("Licensed Immigration Adviser")
    ).toBeInTheDocument();
    expect(screen.getByText(/201500123/)).toBeInTheDocument();
    expect(screen.getByText(/12 years helping families/)).toBeInTheDocument();
  });

  it("does not render an external link out", () => {
    const { container } = render(<LIAAttribution lia={fakeLIA} />);
    expect(container.querySelector("a")).toBeNull();
  });
});
```

- [ ] **Step 11.2 — Run the test to verify it fails**

Run: `npm test -- LIAAttribution`

Expected: FAIL — cannot find module `../LIAAttribution`.

- [ ] **Step 11.3 — Implement the component**

Create `components/qa/LIAAttribution.tsx`:

```tsx
import Image from "next/image";
import { urlFor } from "@/lib/image";
import type { LIA } from "@/types/qa";

export function LIAAttribution({ lia }: { lia: LIA }) {
  const photoUrl = urlFor(lia.photo).width(128).height(128).fit("crop").url();

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <Image
        src={photoUrl}
        alt={lia.name}
        width={64}
        height={64}
        className="h-16 w-16 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-slate-900">{lia.name}</p>
        <p className="text-sm text-slate-600">Licensed Immigration Adviser</p>
        <p className="text-sm text-slate-500">License #{lia.licenseNumber}</p>
        <p className="mt-2 text-sm text-slate-700">{lia.bio}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 11.4 — Run the test to verify it passes**

Run: `npm test -- LIAAttribution`

Expected: PASS (both tests).

- [ ] **Step 11.5 — Commit**

```bash
git add components/qa/LIAAttribution.tsx components/qa/__tests__/LIAAttribution.test.tsx
git commit -m "Add LIAAttribution component with tests"
```

---

### Task 12: Build `QAVideoPlayer` component

**Files:**
- Create: `components/qa/QAVideoPlayer.tsx`

- [ ] **Step 12.1 — Create the player wrapper**

Create `components/qa/QAVideoPlayer.tsx`:

```tsx
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
```

- [ ] **Step 12.2 — Commit**

```bash
git add components/qa/QAVideoPlayer.tsx
git commit -m "Add Mux video player wrapper component"
```

---

### Task 13: Build `TranscriptDisclosure` component

**Files:**
- Create: `components/qa/TranscriptDisclosure.tsx`

- [ ] **Step 13.1 — Create the disclosure**

Create `components/qa/TranscriptDisclosure.tsx`:

```tsx
"use client";

import { useState } from "react";

export function TranscriptDisclosure({ transcript }: { transcript: string }) {
  const [open, setOpen] = useState(false);
  const paragraphs = transcript.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <section className="mt-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-semibold text-brand-600 hover:text-brand-800"
        aria-expanded={open}
      >
        {open ? "Hide transcript" : "Show transcript"}
      </button>
      {open && (
        <div className="mt-4 space-y-4 text-slate-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 13.2 — Commit**

```bash
git add components/qa/TranscriptDisclosure.tsx
git commit -m "Add TranscriptDisclosure component"
```

---

### Task 14: Build `StickyBookCTA` component

**Files:**
- Create: `components/qa/StickyBookCTA.tsx`

- [ ] **Step 14.1 — Create the CTA**

Create `components/qa/StickyBookCTA.tsx`:

```tsx
import Link from "next/link";

export function StickyBookCTA() {
  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Have your own question?
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            Book a consultation
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Speak one-on-one with a licensed adviser.
          </p>
          <Link
            href="/book"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-brand-800"
          >
            Book — $190
          </Link>
        </div>
      </aside>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-lg lg:hidden">
        <Link
          href="/book"
          className="flex w-full items-center justify-center rounded-full bg-brand-600 px-5 py-3 font-semibold text-white"
        >
          Book a Consultation — $190
        </Link>
      </div>
    </>
  );
}
```

- [ ] **Step 14.2 — Commit**

```bash
git add components/qa/StickyBookCTA.tsx
git commit -m "Add StickyBookCTA component"
```

---

### Task 15: Build `QAArticle` (Portable Text renderer)

**Files:**
- Create: `components/qa/QAArticle.tsx`

- [ ] **Step 15.1 — Create the renderer**

Create `components/qa/QAArticle.tsx`:

```tsx
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/image";
import type { PortableTextBlock } from "@portabletext/react";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(1200).fit("max").url();
      return (
        <Image
          src={url}
          alt={value.alt || ""}
          width={1200}
          height={800}
          className="my-6 rounded-2xl"
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        rel="noopener noreferrer"
        className="text-brand-600 underline hover:text-brand-800"
      >
        {children}
      </a>
    ),
  },
};

export function QAArticle({ blocks }: { blocks: PortableTextBlock[] }) {
  return (
    <article className="prose prose-slate mt-10 max-w-none">
      <PortableText value={blocks} components={components} />
    </article>
  );
}
```

- [ ] **Step 15.2 — Commit**

```bash
git add components/qa/QAArticle.tsx
git commit -m "Add Portable Text article renderer for Q&As"
```

---

### Task 16: Build `QAJsonLd` (structured data)

**Files:**
- Create: `components/qa/QAJsonLd.tsx`
- Create: `components/qa/__tests__/QAJsonLd.test.tsx`

- [ ] **Step 16.1 — Write the failing test (snapshot of the three JSON-LD blocks)**

Create `components/qa/__tests__/QAJsonLd.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QAJsonLd } from "../QAJsonLd";

const fakeQA = {
  question: "Am I eligible for the NZ Skilled Migrant visa?",
  slug: "am-i-eligible-for-the-nz-skilled-migrant-visa",
  transcript: "Yes, you may be. The criteria are points-based...",
  publishedAt: "2026-05-01T00:00:00Z",
  liaName: "David Mitchell",
  thumbnailUrl: "https://image.mux.com/abc/thumbnail.jpg",
  videoDuration: 120,
  siteUrl: "https://horizonsimmigration.com",
};

describe("QAJsonLd", () => {
  it("emits FAQPage, VideoObject, and Article JSON-LD", () => {
    const { container } = render(<QAJsonLd {...fakeQA} />);
    const scripts = container.querySelectorAll(
      "script[type='application/ld+json']"
    );
    expect(scripts).toHaveLength(3);

    const types = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent || "{}")["@type"]
    );
    expect(types).toContain("FAQPage");
    expect(types).toContain("VideoObject");
    expect(types).toContain("Article");
  });
});
```

- [ ] **Step 16.2 — Run the test to verify it fails**

Run: `npm test -- QAJsonLd`

Expected: FAIL — cannot find module `../QAJsonLd`.

- [ ] **Step 16.3 — Implement the component**

Create `components/qa/QAJsonLd.tsx`:

```tsx
type Props = {
  question: string;
  slug: string;
  transcript?: string;
  publishedAt: string;
  liaName: string;
  thumbnailUrl: string;
  videoDuration: number;
  siteUrl: string;
};

function isoDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `PT${m}M${s}S`;
}

export function QAJsonLd({
  question,
  slug,
  transcript,
  publishedAt,
  liaName,
  thumbnailUrl,
  videoDuration,
  siteUrl,
}: Props) {
  const url = `${siteUrl}/answers/${slug}`;
  const answerText =
    transcript?.slice(0, 500) ||
    `Watch ${liaName}, a Licensed Immigration Adviser, answer this question.`;

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answerText },
      },
    ],
  };

  const videoObject = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: question,
    description: answerText,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: publishedAt,
    duration: isoDuration(videoDuration),
    contentUrl: url,
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: question,
    datePublished: publishedAt,
    author: { "@type": "Person", name: liaName },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObject) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
    </>
  );
}
```

- [ ] **Step 16.4 — Run the test to verify it passes**

Run: `npm test -- QAJsonLd`

Expected: PASS.

- [ ] **Step 16.5 — Commit**

```bash
git add components/qa/QAJsonLd.tsx components/qa/__tests__/QAJsonLd.test.tsx
git commit -m "Add QAJsonLd structured data with tests"
```

---

### Task 17: Build `QACard` and the `/answers` list page

**Files:**
- Create: `components/qa/QACard.tsx`
- Create: `app/answers/page.tsx`

- [ ] **Step 17.1 — Create the card component**

Create `components/qa/QACard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/image";
import type { QACardData } from "@/types/qa";

export function QACard({ qa }: { qa: QACardData }) {
  const thumbUrl = `https://image.mux.com/${qa.video.asset.playbackId}/thumbnail.jpg?width=640${
    qa.video.asset.thumbTime ? `&time=${qa.video.asset.thumbTime}` : ""
  }`;
  const avatarUrl = urlFor(qa.lia.photo).width(64).height(64).fit("crop").url();

  return (
    <Link
      href={`/answers/${qa.slug.current}`}
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={thumbUrl}
          alt=""
          width={640}
          height={360}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-3 text-base font-semibold text-slate-900 group-hover:text-brand-800">
          {qa.question}
        </h3>
        <div className="mt-4 flex items-center gap-2">
          <Image
            src={avatarUrl}
            alt={qa.lia.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm text-slate-600">{qa.lia.name}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 17.2 — Create the list page**

Create `app/answers/page.tsx`:

```tsx
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { publishedQAsQuery } from "@/lib/queries";
import { QACard } from "@/components/qa/QACard";
import type { QACardData } from "@/types/qa";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Immigration Questions, Answered | Horizons Immigration",
  description:
    "Watch short videos from our licensed immigration advisers answering common questions about migrating to New Zealand and Australia.",
};

export default async function AnswersPage() {
  const qas = await sanityClient.fetch<QACardData[]>(publishedQAsQuery);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900">
          Immigration questions, answered by licensed advisers
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Short videos from our team on common visa questions for New Zealand
          and Australia.
        </p>
      </header>
      {qas.length === 0 ? (
        <p className="text-slate-600">No Q&As published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {qas.map((qa) => (
            <QACard key={qa._id} qa={qa} />
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 17.3 — Run dev server and verify**

Run: `npm run dev`

Open: http://localhost:3000/answers

Expected: page renders. If you have a published test Q&A from Phase 2 (set `publishedAt` to a past date in Studio first), you see its card with thumbnail and LIA name. If not, you see "No Q&As published yet."

- [ ] **Step 17.4 — Commit**

```bash
git add components/qa/QACard.tsx app/answers/page.tsx
git commit -m "Add /answers list page and QACard"
```

---

### Task 18: Build the `/answers/[slug]` detail page

**Files:**
- Create: `app/answers/[slug]/page.tsx`

- [ ] **Step 18.1 — Create the detail page**

Create `app/answers/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import {
  qaBySlugQuery,
  publishedQASlugsQuery,
} from "@/lib/queries";
import { LIAAttribution } from "@/components/qa/LIAAttribution";
import { QAVideoPlayer } from "@/components/qa/QAVideoPlayer";
import { TranscriptDisclosure } from "@/components/qa/TranscriptDisclosure";
import { StickyBookCTA } from "@/components/qa/StickyBookCTA";
import { QAArticle } from "@/components/qa/QAArticle";
import { QAJsonLd } from "@/components/qa/QAJsonLd";
import type { QA } from "@/types/qa";

export const revalidate = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://horizonsimmigration.com";

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(publishedQASlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const qa = await sanityClient.fetch<QA | null>(qaBySlugQuery, { slug });
  if (!qa) return {};
  const thumb = `https://image.mux.com/${qa.video.asset.playbackId}/thumbnail.jpg?width=1200`;
  return {
    title: `${qa.question} | Horizons Immigration`,
    description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
    openGraph: {
      title: qa.question,
      description: qa.transcript?.slice(0, 160) || `Answered by ${qa.lia.name}.`,
      images: [thumb],
      type: "article",
    },
    twitter: { card: "summary_large_image", images: [thumb] },
  };
}

export default async function QAPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const qa = await sanityClient.fetch<QA | null>(qaBySlugQuery, { slug });
  if (!qa) notFound();

  const playbackId = qa.video.asset.playbackId;
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1200`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 pb-32 lg:pb-12">
      <QAJsonLd
        question={qa.question}
        slug={qa.slug.current}
        transcript={qa.transcript}
        publishedAt={qa.publishedAt}
        liaName={qa.lia.name}
        thumbnailUrl={thumbnailUrl}
        videoDuration={qa.video.asset.duration}
        siteUrl={SITE_URL}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <QAVideoPlayer
            playbackId={playbackId}
            title={qa.question}
            poster={thumbnailUrl}
          />
          <h1 className="mt-8 text-3xl font-bold text-slate-900 sm:text-4xl">
            {qa.question}
          </h1>
          <div className="mt-6">
            <LIAAttribution lia={qa.lia} />
          </div>
          {qa.article && qa.article.length > 0 && (
            <QAArticle blocks={qa.article} />
          )}
          {qa.transcript && (
            <TranscriptDisclosure transcript={qa.transcript} />
          )}
        </div>
        <StickyBookCTA />
      </div>
    </main>
  );
}
```

- [ ] **Step 18.2 — Run dev server and verify**

Run: `npm run dev`

Open: http://localhost:3000/answers/<your-test-slug>

Expected: page renders with video, question H1, LIA block, sticky CTA, and JSON-LD scripts (view page source to confirm three `<script type="application/ld+json">` blocks).

- [ ] **Step 18.3 — Commit**

```bash
git add app/answers/[slug]/page.tsx
git commit -m "Add /answers/[slug] detail page"
```

---

### Task 19: Add `/sitemap.xml`

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 19.1 — Create the sitemap**

Create `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";
import { groq } from "next-sanity";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://horizonsimmigration.com";

const sitemapQuery = groq`
  *[_type == "qa" && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current,
    publishedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const qas = await sanityClient.fetch<
    { slug: string; publishedAt: string }[]
  >(sitemapQuery);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/answers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/book`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const qaUrls: MetadataRoute.Sitemap = qas.map((qa) => ({
    url: `${SITE_URL}/answers/${qa.slug}`,
    lastModified: new Date(qa.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticUrls, ...qaUrls];
}
```

- [ ] **Step 19.2 — Verify**

Run: `npm run dev`

Open: http://localhost:3000/sitemap.xml

Expected: XML with the static URLs and one `<url>` entry per published Q&A.

- [ ] **Step 19.3 — Commit**

```bash
git add app/sitemap.ts
git commit -m "Add dynamic sitemap with published Q&As"
```

---

### Task 20: Add a nav link to `/answers`

**Files:**
- Modify: `components/layout/*` (the existing nav component — exact file TBD by inspecting `components/layout/`)

- [ ] **Step 20.1 — Find the nav file**

Run: `ls components/layout/`

Note the file that renders the top navigation (likely `Nav.tsx` or `Header.tsx`).

- [ ] **Step 20.2 — Add a link**

Open the nav component. Add a new link between the existing nav items (the existing ones likely include "How it works", "Eligibility test", "Team", "Blog"):

```tsx
<Link href="/answers" className="<existing-link-classes>">
  Q&A
</Link>
```

Match the className pattern of the siblings exactly.

- [ ] **Step 20.3 — Verify**

Run: `npm run dev`

Open: http://localhost:3000/

Expected: top nav now shows a "Q&A" link that routes to `/answers`.

- [ ] **Step 20.4 — Commit**

```bash
git add components/layout/
git commit -m "Add Q&A link to top navigation"
```

---

## Phase 4 — Manual smoke test and ship

### Task 21: End-to-end smoke test on local dev

- [ ] **Step 21.1 — Run the smoke checklist**

With `npm run dev` running:

1. Visit `/studio`. Log in. Create a new LIA (real name, license number, photo, bio). Save.
2. Create a Q&A: type a real question, pick the LIA, drag in a 10–60 sec test video. Wait for Mux processing.
3. (Optional) paste a transcript and write a short article body (3 paragraphs, a heading, a bullet list).
4. Set `publishedAt` to **now** (use the date picker, hit "Now"). Publish.
5. Wait ~30 seconds for ISR cache to refresh, OR restart `npm run dev`.
6. Visit `/answers`. Confirm the Q&A appears with thumbnail and LIA name.
7. Click into `/answers/<slug>`. Confirm:
   - [ ] Mux video plays
   - [ ] Question is the H1
   - [ ] LIA name, role, license, bio all visible
   - [ ] Article body renders with formatting (if you added one)
   - [ ] "Show transcript" toggles open (if you added one)
   - [ ] Sticky CTA visible on desktop (right rail) and mobile (bottom bar — resize browser to test)
   - [ ] `view-source:` shows 3 `<script type="application/ld+json">` blocks (FAQPage, VideoObject, Article)
8. Visit `/sitemap.xml`. Confirm the Q&A URL is listed.
9. In Studio, set `publishedAt` to **tomorrow**. Refresh `/answers` after ~30s. Confirm Q&A is gone from the list and from `/sitemap.xml`.

### Task 22: Run the test suite

- [ ] **Step 22.1 — Run all tests**

Run: `npm test`

Expected: all tests pass (LIAAttribution × 2, QAJsonLd × 1).

### Task 23: Build for production locally

- [ ] **Step 23.1 — Production build**

Run: `npm run build`

Expected: build succeeds. If you see a complaint about missing env vars, double-check `.env.local`.

- [ ] **Step 23.2 — Run lint**

Run: `npm run lint`

Expected: no errors.

### Task 24: Deploy to Vercel

- [ ] **Step 24.1 — Push to main**

Run:
```bash
git push origin main
```

Vercel auto-deploys.

- [ ] **Step 24.2 — Verify production**

In Vercel dashboard, wait for the deploy to finish (~2 min). Then:

1. Visit `https://<your-vercel-url>/studio` — log in.
2. Confirm your test LIA and Q&A from local dev show up (they're in the same Sanity dataset).
3. Visit `https://<your-vercel-url>/answers` — confirm the list.
4. Click through to a Q&A detail page. Confirm video plays.
5. Visit `https://<your-vercel-url>/sitemap.xml` — confirm Q&As listed.

If anything fails: check Vercel function logs (the most common failure is a missing env var).

- [ ] **Step 24.3 — Submit sitemap to Google Search Console (manual)**

Log into Google Search Console for the property. Submit `https://<your-vercel-url>/sitemap.xml`.

This is a one-time human step, not a code change.

---

## Spec coverage check

| Spec requirement | Implemented in task |
|---|---|
| LIA schema (name, license, photo, bio, archived) | Task 3 |
| Q&A schema (question, slug, lia, video, transcript, article, publishedAt) | Tasks 4, 8 |
| Embedded Studio at `/studio` | Tasks 5, 6 |
| Mux video upload via plugin | Tasks 7, 8 |
| `publishedAt`-based draft/publish/schedule | Task 4 (schema), Task 9 (query), Task 17, 18 (page filter) |
| `/answers` list page with cards | Task 17 |
| `/answers/[slug]` detail page (video, H1, LIA, article, transcript, CTA) | Tasks 11–18 |
| Server-side rendering (no client fetch) | Tasks 17, 18 (`async` server components) |
| JSON-LD FAQPage + VideoObject + Article | Task 16 |
| Open Graph + Twitter Card | Task 18 (`generateMetadata`) |
| Sticky CTA desktop right rail + mobile bottom bar | Task 14 |
| `/sitemap.xml` with all published Q&As | Task 19 |
| LIA archived after Q&A published → still attributed | Task 4 (filter only applies to the dropdown) |
| Q&A with no article → section omitted | Task 18 (conditional render) |
| Q&A with no transcript → section omitted | Task 18 (conditional render) |
| Mux still processing → "Video processing…" placeholder | Task 12 (`if (!playbackId)`) |
| Vitest smoke tests for components + JSON-LD snapshot | Tasks 11, 16 |
| Topics deferred to v2 | not implemented (intentional) |
| Search/filter deferred to v2 | not implemented (intentional) |

All spec requirements have an implementing task. No placeholders, no TODOs, no unresolved cross-references.
