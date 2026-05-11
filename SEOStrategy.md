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
| **Mux** (embedded on horizonsmigration.com) | Conversion channel. Visitors stay on our site. Our domain owns the video signal. | Active. |
| **YouTube** (separate uploads) | Discovery channel. YouTube SEO + AI engine citations + Filipino YouTube viewing behavior. | **Deferred to Phase 3.** Schema has optional `youtubeUrl` field ready. |

Each `qa` and `post` document has a `youtubeUrl` field that stays empty until Phase 3.

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

## Phasing

- **Phase 1 (current):** Populate Q&A from existing video backlog. Get inventory in. No formal SEO keyword research yet — but write in good Q&A shape from the start so we don't pay rework cost later.
- **Phase 2 (later):** Keyword research pass. Edit existing Q&As + write blogs targeting specific keyword clusters. Connect Google Search Console. Decide on paid SEO tools (Ahrefs / SEMrush) if needed.
- **Phase 3 (later):** YouTube uploads. Fill in `youtubeUrl` on each Q&A and post. Cut YouTube Shorts / TikTok / IG Reels from the same source videos.

## Workflows

### Q&A Workflow — when Joey sends a Q&A transcript

**Joey provides:**
1. **Mux asset ID** (or uploads to Mux first; Claude can list current Mux assets via the Mux MCP and Joey picks).
2. **Transcript from CapCut.** *Not Mux auto-transcription* — Mux does not support Tagalog/Filipino (verified May 2026). CapCut handles Taglish words and lets Joey correct mistakes in the editor before exporting.
3. **Question or topic** — rough is fine, Claude will polish.
4. **LIA reference** — default Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`) unless Joey says otherwise.

**Claude does:**
1. Polish the question — clear, natural, the way someone would actually search it.
2. Generate slug (auto from question via Sanity).
3. Create Sanity `qa` document **as a draft** (Joey publishes from Studio after review). Never publish directly unless Joey explicitly says to.
4. Save raw transcript verbatim into the `transcript` field.
5. Rewrite transcript into `article` body as structured PortableText:
   - Direct answer in first 1–2 sentences.
   - Then context with headings, short paragraphs, lists where useful.
   - **No invented facts.** Only what's in the transcript, polished and reorganized for readability.
6. Reference the Mux asset (`video` field) and LIA (`lia` field).
7. Set `publishedAt` if Joey provides a date; otherwise leave empty.
8. Leave `youtubeUrl` empty (Phase 3).

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
9. Leave `youtubeUrl` empty (Phase 3).

**Claude does (Phase 2, future — adds these steps before writing):**
- Keyword research first (Google + YouTube autocomplete, SERP analysis of top-ranking competitors, optionally paid tools).
- Propose a target keyword cluster.
- Place primary keyword in: title, slug, H1, first paragraph, one H2, image alt text.
- Place LSI/related keywords throughout body naturally.

## Sanity / Mux references

- **Sanity project ID:** `07g62s03`
- **Sanity dataset:** `production`
- **Sanity workspace:** `horizons-studio`
- **Studio URL:** https://www.sanity.io/@ogeyySxqI/studio/au38jvffmsguvwbhyehqn93a/horizons-studio
- **Schema source:** `sanity/schemas/`
- **Existing LIAs:** Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`)
- **Mux MCP:** Connected. Use it to list/inspect Mux assets when matching videos to Q&As.
- **Sanity MCP:** Connected. Use `query_documents`, `create_documents_from_json`, etc. for content operations.

## Deferred / Future Decisions

- **Tagalog/Taglish content** — deferred. English only for now.
- **Paid SEO tools (Ahrefs/SEMrush)** — defer until Phase 2.
- **Google Search Console** — recommend connecting before Phase 2 starts.
- **Categories/tags taxonomy on blog** — deferred until we know what cuts matter.
- **Frontend pages for `/blog` and `/success-stories`** — schemas are ready; frontend may still need build work.
- **`consentOnFile` boolean on success stories** — currently a description note; promote to a required field if legal/privacy needs increase.
- **YouTube Shorts / TikTok / IG Reels repurposing** — Phase 3.
