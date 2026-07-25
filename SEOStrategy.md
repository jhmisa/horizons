# SEO & Content Strategy

Long-term SEO and content strategy for the Horizons Immigration website. This file is the source of truth for **who we're writing for, what content we publish, and how Claude assists with it.** Update when strategy evolves.

## Goal

Rank well on **Google AND AI search engines** (Google AI Overviews, ChatGPT, Perplexity, etc.) for searches made by Filipinos seeking long-term residency in New Zealand.

## Target Audience

The audience is **Filipinos who want long-term residency in New Zealand**, in three sub-segments:

1. **Filipinos in the Philippines** — broad/exploratory searchers, no migration experience. Search terms tend to be wide ("how to migrate to New Zealand from Philippines", "AEWV for Filipinos").
2. **OFWs in non-English-speaking countries** — UAE, Saudi Arabia, Qatar, Kuwait, Hong Kong, Taiwan, Japan, Korea, Italy, Israel, Spain. Already abroad, frustrated by no PR pathway. **Higher search intent.** Search terms include their host country ("OFW migrate to New Zealand", "from Saudi to New Zealand work visa").
3. **Filipinos in English-speaking countries that block long-term settlement** — Singapore, Hong Kong. PR/citizenship nearly unattainable, international schooling expensive ($30k+ SGD/yr). Search terms include the friction they're feeling ("Singapore PR rejected what next", "Filipino in Singapore schooling for kids").

**Editorial through-line:** "Filipinos in countries that blocked their long-term future — no PR, no citizenship pathway, hard for the kids." NZ's counter-pitch: clear residency pathway, citizenship after ~5 years, free public schooling for residents' kids.

## Content Channels

| Channel | Role | Status |
|---|---|---|
| **YouTube** (embedded on horizonsimmigration.com) | Both the on-site embed (conversion) and the discovery channel (YouTube SEO + AI engine citations + Filipino YouTube viewing behavior). One upload, two channels of traffic. | Active. |

Q&A videos live on YouTube. We embed them via `react-lite-youtube-embed` on `/answers/[slug]` (private-by-default `youtube-nocookie.com` embed, thumbnail-only until clicked for Core Web Vitals). Each `qa`, `post`, and `successStory` Sanity document carries a `youtubeUrl` field.

## Content Types & Sanity Schemas

| Type | Sanity doc type | Schema source | Status |
|---|---|---|---|
| Q&A (with video) | `qa` | `sanity/schemas/qa.ts` | Deployed. Ready to populate. |
| Blog post | `post` | `sanity/schemas/post.ts` | Scaffolded. Needs `npx sanity deploy`. |
| Success story | `successStory` | `sanity/schemas/successStory.ts` | Scaffolded. Needs `npx sanity deploy`. |
| Adviser profile | `lia` | `sanity/schemas/lia.ts` | Deployed. 1 record: Rowel Mercado. |

## Writing Conventions

- **Language: English only.** No Taglish, no Tagalog. Audience reads/searches in English even when they speak Tagalog. (Tagalog content is explicitly deferred — may revisit later as a low-competition experiment.)
- **Tone: clear, direct, helpful.** No marketing fluff. No hype.
- **Q&A shape (good for both humans and AI search engines):**
  - Question as the heading.
  - **Direct answer in the first 1–2 sentences.** This is what AI Overviews and ChatGPT cite.
  - Then context, examples, headings (`h2`/`h3`), short paragraphs, lists where useful.
- **Accuracy:** Use correct visa names (AEWV, SMC, Partnership Resident, Green List, etc.). Never invent facts. If a transcript doesn't cover something, leave it out.
- **Citations are mandatory:** every visa fact, fee, or requirement links to the exact page on immigration.govt.nz / iaa.govt.nz that backs it (not the homepage). Applies to Q&As, blogs, and success stories.

## Phasing

- **Phase 1 (done):** Populated the initial Q&A library and started the blog backlog. Videos go on YouTube (public, with proper titles/descriptions/transcripts) and are embedded on-site. No formal SEO keyword research yet — but write in good Q&A shape from the start so we don't pay rework cost later.
- **Phase 2 (current, started 2026-07-25):** Keyword research pass. Edit existing Q&As + write blogs targeting specific keyword clusters. Connect Google Search Console. Decide on paid SEO tools (Ahrefs / SEMrush) if needed. Consider wiring up the YouTube Data API for automated description sync once volume justifies the OAuth setup. Run via the /horizons-seo skill (one content cycle per run; keyword map in docs/research/keyword-map.md).
- **Phase 3 (later):** Cross-post to YouTube Shorts / TikTok / IG Reels from the same source videos.

## Workflows

### Q&A Workflow — when Joey provides a transcript

**Joey provides:**
1. **YouTube URL** — Joey uploads the video to YouTube Studio first, then pastes the URL.
2. **Transcript from Descript.** Descript handles Filipino-accented English and Taglish reasonably; Joey corrects mistakes in the Descript editor before exporting.
3. **Question or topic** — rough is fine, Claude will polish.
4. **LIA reference** — default Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`) unless Joey says otherwise.

**Claude does** (full detail in `.claude/skills/qa-from-transcript/SKILL.md`):
1. Polish the question — clear, natural, the way someone would actually search it.
2. Generate slug from the question.
3. Build a JSON payload (`tmp/qa-draft-<slug>.json`) with the question, slug, youtubeUrl, liaId, transcript, and a PortableText `article` body.
4. Run `node scripts/create-qa-draft.mjs <file>` to create the draft in Sanity. **Always as a draft** — Joey publishes from Studio after review.
5. Save the raw transcript verbatim into the `transcript` field.
6. Write the `article` body as PortableText:
   - Direct answer in first 1–2 sentences.
   - Then context with headings, short paragraphs, lists where useful.
   - **No invented facts.** Only what's in the transcript, polished and reorganized for readability.
7. Output a separate **YouTube description block** for Joey to paste into YouTube Studio (hook + timestamps + link back to the Q&A page + book link + brief About).
8. Leave `publishedAt` empty. Joey sets it from Studio.

### Blog Workflow — when Joey provides a blog idea

**Joey provides:**
1. **Topic or rough idea.**
2. Optionally: target sub-audience (Philippines-based, OFW in UAE, Singapore-based, etc.).
3. Optionally: target visa or pathway.
4. Optionally: which LIA to attribute as author (default Rowel Mercado).

**Claude does (Phase 1, current):**
1. Propose a **title and outline** (hook, 3–6 sections, conclusion + CTA to a Q&A or to the consultation booking page).
2. Wait for Joey to confirm or adjust the outline.
3. Write the blog as PortableText in a `post` document, marked as draft.
4. Q&A-friendly structure: question-style headings, direct answer first, lists, examples.
5. Cross-link to relevant Q&As via the `relatedQAs` field.
6. Suggest hero image direction (do not auto-generate unless asked).
7. Write a meta-description-ready `excerpt` (150–160 chars).
8. Set author LIA. Leave `publishedAt` empty (= draft).
9. If a companion YouTube video exists, populate `youtubeUrl`.

**Claude does (Phase 2, future — adds these steps before writing):**
- Keyword research first (Google + YouTube autocomplete, SERP analysis of top-ranking competitors, optionally paid tools).
- Propose a target keyword cluster.
- Place primary keyword in: title, slug, H1, first paragraph, one H2, image alt text.
- Place LSI/related keywords throughout body naturally.

## Sanity references

- **Sanity project ID:** `07g62s03`
- **Sanity dataset:** `production`
- **Sanity workspace:** `horizons-studio`
- **Studio URL:** https://www.sanity.io/@ogeyySxqI/studio/au38jvffmsguvwbhyehqn93a/horizons-studio
- **Schema source:** `sanity/schemas/`
- **Existing LIAs:** Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`)
- **Sanity MCP:** Connected. Use `query_documents`, `create_documents_from_json`, etc. for content operations.

## Deferred / Future Decisions

- **Tagalog/Taglish content** — deferred. English only for now.
- **Paid SEO tools (Ahrefs/SEMrush)** — defer until Phase 2.
- **Categories/tags taxonomy on blog** — deferred until we know what cuts matter.
- **Frontend pages for `/blog` and `/success-stories`** — schemas are ready; frontend may still need build work.
- **`consentOnFile` boolean on success stories** — currently a description note; promote to a required field if legal/privacy needs increase.
- **YouTube Data API / OAuth** — deferred. Joey pastes the URL manually after upload, which is fine at current volume. Wire up later if we want Sanity-driven descriptions auto-pushed to YouTube.
- **YouTube Shorts / TikTok / IG Reels repurposing** — Phase 3.
