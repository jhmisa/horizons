---
name: qa-from-transcript
description: Turn a YouTube URL + title + Descript transcript into a draft Sanity `qa` document, a YouTube metadata bundle (title + description + tags), and an optional OAuth-authenticated push to YouTube. Triggers when Joey shares a YouTube link with a transcript, mentions Descript, or asks to "make a Q&A from this transcript."
---

# Q&A from transcript workflow

## When to use

Trigger this skill whenever Joey provides:

- A YouTube URL (any form: `youtube.com/watch?v=`, `youtu.be/`, etc.), AND
- A transcript (typically pasted from Descript), AND optionally
- A working question/topic, and/or LIA reference.

If only a transcript is provided without a URL, ask for the YouTube URL before proceeding — the YouTube video is the canonical content host.

## What to produce

Three artifacts, in order:

### 1. Draft Sanity Q&A document

Create a JSON payload at `tmp/qa-draft-<slug>.json` (create `tmp/` if missing; it should already be in `.gitignore` — if not, add it) with this shape:

```json
{
  "question": "<polished question>",
  "slug": "<derived from question>",
  "youtubeUrl": "<the YouTube URL Joey gave>",
  "liaId": "ab1d6c56-999e-4e5e-985e-cde4bb14416e",
  "transcript": "<raw transcript text, verbatim>",
  "article": [ /* PortableText blocks — see structure below */ ]
}
```

Then run: `node scripts/create-qa-draft.mjs tmp/qa-draft-<slug>.json`

The script creates a draft document in Sanity and prints the Studio URL. Tell Joey to review and publish from Studio.

### 2. YouTube metadata bundle

Produce three deliverables together — title, description, tags — for the same video. See "How to polish the inputs" below for the rules.

Save the description text to `tmp/yt-desc-<videoId>.txt` so it can be passed to the push script.

### 3. Push to YouTube (preferred) or output for paste

YouTube Data API v3 OAuth is set up (see project memory `project_youtube_oauth.md` or the scripts at `scripts/youtube-auth.mjs` and `scripts/youtube-update.mjs`). Use it.

**Always dry-run first**, then ask Joey to approve the diff before the real write:

```
node scripts/youtube-update.mjs <videoId> \
  --title "<title>" \
  --description-file tmp/yt-desc-<videoId>.txt \
  --tags "<comma,separated,tags>" \
  --dry-run
```

After Joey approves, re-run without `--dry-run`. Then run `--show` to verify the write landed.

If the push fails for any reason (token expired, network error, etc.), fall back to outputting the description as a markdown block headed **"Paste into YouTube Studio → Description:"** plus the title and tags so Joey can paste manually.

**Never push to YouTube without explicit Joey approval** of the dry-run diff — same principle as never publishing the Sanity draft directly.

## How to polish the inputs

Reference: editorial conventions live in `SEOStrategy.md` (root of repo). Re-read it if you haven't this session.

### Polishing the question

- Make it sound like how someone would actually search it (natural language, Google-style).
- Keep under ~120 characters.
- Title case is fine; sentence case is fine; don't yell.
- If Joey gave a rough version, polish — don't ask permission unless the topic is genuinely ambiguous.

### Generating the slug

Lowercase, hyphenated, drop punctuation, max 96 chars. The script will derive one from the question if you omit it, but you can override for SEO clarity.

### Writing the article body (PortableText)

The `article` field is the long-form answer that appears on the Q&A page below the video. Structure:

1. **First 1-2 sentences = the direct answer.** This is what AI Overviews / ChatGPT / Perplexity cite. Don't bury it.
2. Then context: short paragraphs (h2/h3 headings where useful), lists, examples.
3. Use correct visa names (AEWV, SMC, Partnership Resident, Green List, etc.).
4. **Never invent facts.** Only use information from the transcript. If something needs more context to make sense, write around it — don't fabricate.
5. End with a soft CTA pointing toward booking a consultation, framed as the next step ("If your situation matches this and you want a Licensed Immigration Adviser to look at it specifically, you can book a consultation here.").

PortableText shape per paragraph (add `_key` on every block and span — Sanity requires unique keys per array item):

```json
{
  "_type": "block",
  "_key": "b1",
  "style": "normal",
  "children": [{ "_type": "span", "_key": "s1", "text": "..." }]
}
```

For h2: `"style": "h2"`. For h3: `"style": "h3"`. For lists, use `"listItem": "bullet"` or `"number"`.

### The transcript field

Save the **raw transcript verbatim** in `transcript`. Don't summarize it. Preserve paragraph breaks. The site exposes this via a disclosure component for users who want to read along.

### Polishing the YouTube title

Two-part pattern: `<the question, near-verbatim> | <SEO modifier for audience and topic>`. Keep the question on the left — that's what AI search engines and Google quote. Use the right side for audience/keyword reach ("Filipino Couples", "OFW", country names, the specific visa type).

Total must fit YouTube's **100-character** limit. If the question is already 80+ chars, skip the suffix.

### Writing the YouTube description

Save to `tmp/yt-desc-<videoId>.txt`. Must contain, in order:

- A 1-2 sentence hook (rephrased from the direct answer, written for YouTube viewers not site visitors — punchier, more curiosity-driven).
- 3-5 bullet "Topics covered" lines describing what the video discusses. Only include real timestamps if Joey gave them; otherwise use unnumbered bullets.
- A link to the Q&A page: `https://horizons.nz/answers/<slug>`
- A link to book a consultation: `https://horizons.nz/book`
- A short "About Horizons" paragraph (1-2 sentences) on what the channel is for.

Use the canonical domain **`horizons.nz`** — not `horizonsmigration.com`, not `horizonsimmigration.com`.

### Generating YouTube tags

Tags are a minor ranking signal in modern YouTube. Their real job is:

- **Disambiguation** — telling YouTube which "X" you mean (e.g. "student visa" → New Zealand).
- **Synonym coverage** — catching how users might phrase the search differently than the title.

Rules:

- **Tag the topic, not the audience.** Audience descriptors like "Filipino" / "OFW" / "Filipinos in NZ" belong in the **title** and **thumbnail**, not in tags. Audience tags on a topic-focused video can hurt watch-time signals when uninterested searchers click through and bounce.
- **Cover question-phrasing variants** — if the title is "Husband or Wife: Who Should Be the Student Visa Applicant?", tag the way someone would *type* it: "husband or wife student visa", "partner of student visa", "NZ student visa for couples".
- **Use substantive visa names** the video actually discusses ("Green List NZ", "Straight to Residence NZ", "AEWV", "Partnership Resident"). Never tag visa names the transcript doesn't mention.
- **Include the brand tag** "Horizons NZ" to help YouTube cluster channel content.
- **Tagalog-audio videos: ~70% English / 30% Tagalog tag mix.** When the video's spoken language is Tagalog or Taglish, add 3-5 Tagalog phrasings of the topic alongside the English tags. Tagalog-speaking searchers often type their query in Tagalog even when discovering English-titled content. Examples: `magkano lumipat sa New Zealand`, `ipon para lumipat sa New Zealand`, `pera para sa NZ`. This is a deliberate exception to SEOStrategy.md's "English only" rule, which applies to written content (articles, descriptions) — not to YouTube discovery tags on Tagalog-language videos.
- Aim for **10-14 tags total** for Tagalog-audio videos (to fit the 70/30 mix), or **8-12 tags** for English-only-audio videos. YouTube enforces a 500-character total limit across all tags.

## Defaults

- **LIA:** Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`) unless Joey specifies otherwise.
- **publishedAt:** Leave empty. Joey publishes from Studio after review. Never publish directly from this skill.
- **Domain:** `horizons.nz` — for all user-facing links in descriptions and articles.

## Verification

Before reporting done:

1. Confirm the script printed a valid `drafts.*` `_id` for the Sanity Q&A.
2. Confirm the question, slug, youtubeUrl, transcript, and article fields are all present in the JSON.
3. Confirm the article begins with a direct answer in the first 1-2 sentences.
4. Print the Studio URL the script returned so Joey can open it in one click.
5. If YouTube push was approved: run `node scripts/youtube-update.mjs <videoId> --show` and confirm title, tags, and description start match what was pushed.
