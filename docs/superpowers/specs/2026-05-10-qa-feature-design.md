# Q&A Video Library — Design Spec

**Date:** 2026-05-10
**Status:** Approved (pending user review of this written spec)
**Author:** Joey + Claude
**Target milestone:** v1

## Goal

Build a public, SEO-optimized video Q&A library for Horizons Immigration. Licensed Immigration Advisers (LIAs) record short videos answering common immigration questions. Public visitors discover these via Google, watch the answer, and convert through a "Book a Consultation" CTA on every page.

## Roles

- **Admin** (Joey): the only logged-in user. Authors LIAs, Q&As, and uploads videos through Sanity Studio.
- **LIA**: a content record only — name, license number, photo, bio. **LIAs do not log in.** They record videos offline and hand them to the admin.
- **Public visitor**: anonymous, no login.

## Architecture

Three external services, three responsibilities:

```
Public visitor → Next.js (Vercel) → Sanity (text content) + Mux (video)
                       ↓
                 /studio (embedded Sanity Studio for authoring)
```

- **Sanity** owns LIAs, Q&As, articles, transcripts. Provides the authoring UI (Studio) at `/studio`.
- **Mux** owns video — adaptive bitrate streaming, auto-thumbnails, auto-transcripts. Uploaded via the `sanity-plugin-mux-input` plugin (chunked upload, browser-side).
- **Next.js** owns public pages and renders everything server-side for SEO.

**Sanity Studio location:** Embedded at `/studio` in the Next.js app (single deployment, single domain). Admin auth via Sanity's magic-link email.

## Data model

### Document type: `lia`

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | e.g. "David Mitchell" |
| `licenseNumber` | string | yes | e.g. "201500123" |
| `photo` | image (with hotspot) | yes | Sanity handles cropping |
| `bio` | text (~200 chars) | yes | plain text, short paragraph |
| `archived` | boolean | default false | hides from new-Q&A dropdown; existing Q&As keep showing them |

### Document type: `qa`

| Field | Type | Required | Notes |
|---|---|---|---|
| `question` | string (single-line) | yes | the H1 of the public page |
| `slug` | slug (auto from question) | yes | URL segment, manually overridable |
| `lia` | reference → `lia` | yes | dropdown of non-archived LIAs |
| `video` | mux.video | yes | drag-and-drop in Studio |
| `transcript` | text (multi-line) | no | plain text, paragraph breaks preserved |
| `article` | array (Portable Text) | no | Sanity-native rich text — headings, lists, links, inline images |
| `publishedAt` | datetime | no | empty = draft; past = live; future = scheduled |

### Draft / publish strategy

Use the `publishedAt` field as the publish flag. Public queries filter `publishedAt <= now()`. This gives scheduling for free and is simpler than Sanity's built-in draft/published document pairs.

### Topics (deferred)

No `topic` document type in v1. Adding a `topic` reference field later is non-breaking — existing Q&As get null and a 5-line script can backfill.

## Public pages

### `/answers` — list page

- Server-rendered. Fetches all Q&As where `publishedAt <= now()`, sorted newest-first.
- 3-column grid on desktop, 1-column on mobile.
- Each card: Mux auto-thumbnail, question text, LIA name + small avatar.
- Card click → `/answers/[slug]`.
- No search/filter in v1.
- Page metadata: title "Immigration Questions, Answered | Horizons Immigration", descriptive meta description.

### `/answers/[slug]` — detail page (the SEO money page)

Layout (top to bottom):
1. Mux video player (`@mux/mux-player-react`, lazy-loaded)
2. Question as `<h1>`
3. LIA attribution block: photo (small circle), name, "Licensed Immigration Adviser", license number, short bio. **No link out** — keeps the visitor on the page.
4. Article body (if present) — Portable Text rendered via `@portabletext/react`, styled with Tailwind `prose` classes
5. Transcript (if present) — collapsed behind a "Show transcript" disclosure; rendered as plain text with paragraph breaks
6. Sticky "Book a Consultation" CTA — desktop = sticky right rail; mobile = sticky bottom bar after first scroll. Links to existing `/book` route.

**Server-rendering:** all content is in the initial HTML. No client-side data fetching.

**Structured data (JSON-LD `<script>` block in `<head>`):**
- `FAQPage` — question text + summary answer (helps Google FAQ rich results)
- `VideoObject` — Mux thumbnail URL, duration, upload date (helps video thumbnail in search results)
- `Article` — author = LIA, datePublished (helps authorship signals)

**Social previews:** Open Graph + Twitter Card meta tags use the Mux thumbnail.

### `/sitemap.xml`

Auto-generated. Includes every published Q&A and the `/answers` index. Submitted to Google Search Console post-launch (manual step).

## Authoring flow

### One-time setup

1. Create free Sanity account (admin's email).
2. Create free Mux account.
3. Add env vars to Vercel: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`.
4. Push schemas + `/studio` route. Vercel auto-deploys.
5. `your-site.com/studio` is live. Admin logs in via magic-link email.

### Day-to-day (adding a Q&A)

1. Go to `/studio`, navigate to Q&As → "Create new".
2. Type question; slug auto-fills.
3. Pick LIA from dropdown.
4. Drag .mp4 into the Video field. Chunked upload + Mux processing (~1-3 min).
5. (Optional) Paste transcript from Mux dashboard.
6. (Optional) Write rich-text article using slash commands (Sanity's Portable Text editor).
7. Set `publishedAt` to now (or leave empty for draft / set future for scheduled).
8. Publish.

### Editing / unpublishing / archiving

- **Edit:** open the Q&A, change fields, publish. Sanity keeps full revision history with per-field rollback.
- **Unpublish:** clear `publishedAt`.
- **Archive an LIA:** toggle their archived field. Removes from Q&A dropdown; existing Q&As unaffected.

### Programmatic editing (Claude-assisted)

The admin can ask Claude to:
- Generate Q&A drafts from transcripts or topic lists
- Bulk-import questions from CSV
- Re-attribute Q&As to a different LIA
- Run Sanity dataset migrations

This is done via the `@sanity/client` SDK and the `sanity` CLI. The only thing not scriptable is the video upload itself (browser-only chunked upload).

## Error handling and edge cases

| Scenario | Behavior |
|---|---|
| Video still processing when published | Sanity stores Mux asset ID immediately; public page shows "Video processing…" placeholder until Mux is ready |
| LIA archived after their Q&A is live | Existing Q&A keeps showing attribution; LIA only filtered from the dropdown for *new* Q&As |
| Q&A with no article body | Article section omitted from public page (no empty heading) |
| Q&A with no transcript | Transcript section omitted |
| Slug collision | Sanity Studio warns at publish; admin must edit slug |
| Q&A with `publishedAt` in the future | Hidden from `/answers` and `/sitemap.xml` until that time passes (ISR / on-demand revalidation handles this) |
| Mux video deleted manually outside the system | Public page shows fallback "Video unavailable" message |

## Testing

**Manual smoke test (post-deploy checklist):**
1. Create an LIA in Studio. Upload photo. Save.
2. Create a Q&A. Pick LIA. Upload short video. Set `publishedAt = now`. Publish.
3. Visit `/answers` — Q&A appears.
4. Click through to `/answers/[slug]` — video plays, LIA attribution shows, sticky CTA visible.
5. View page source — confirm JSON-LD blocks for FAQPage, VideoObject, Article.
6. Visit `/sitemap.xml` — Q&A URL is present.
7. Set `publishedAt` to future — confirm Q&A disappears from list and sitemap.

**Automated tests (v1 minimum):**
- Smoke test that `/answers` renders without error
- Smoke test that `/answers/[slug]` renders with a known fixture Q&A
- Snapshot test of the JSON-LD output for one fixture Q&A

No E2E tests in v1. Add when stakes warrant it.

## Out of scope (deferred to v2)

- Topics / categories
- Search and filter on `/answers`
- Related Q&As block on the detail page
- Email capture / newsletter
- Comments / reactions
- LIA login / multi-author workflows

## Open questions

None outstanding. All design choices approved through brainstorming.

## Key dependencies (for the implementation plan)

- `next-sanity` (Sanity Studio embedded in Next.js)
- `@sanity/client`, `@sanity/image-url`
- `@portabletext/react` (Portable Text → React)
- `sanity-plugin-mux-input` (Studio video upload)
- `@mux/mux-player-react` (public video playback)

## Success criteria

1. Admin can create an LIA and a Q&A end-to-end through `/studio` without writing code.
2. Published Q&As are server-rendered with full content + JSON-LD on `/answers/[slug]`.
3. `/sitemap.xml` includes all published Q&As.
4. Mobile and desktop CTA placement is functional.
5. The implementation builds, deploys to Vercel, and the existing site (homepage, blog, etc.) is unaffected.
