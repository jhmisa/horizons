---
name: qa-from-transcript
description: Turn a YouTube URL + title + Descript transcript into a draft Sanity `qa` document and a paste-ready YouTube description. Triggers when Joey shares a YouTube link with a transcript, mentions Descript, or asks to "make a Q&A from this transcript."
---

# Q&A from transcript workflow

## When to use

Trigger this skill whenever Joey provides:

- A YouTube URL (any form: `youtube.com/watch?v=`, `youtu.be/`, etc.), AND
- A transcript (typically pasted from Descript), AND optionally
- A working question/topic, and/or LIA reference.

If only a transcript is provided without a URL, ask for the YouTube URL before proceeding — the YouTube video is the canonical content host.

## What to produce

Two artifacts, in order:

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

### 2. YouTube description block

After the Sanity draft is created, output a separate markdown block headed **"Paste into YouTube Studio → Description:"** that Joey can copy into the video's YouTube description. It should contain:

- A 1-2 sentence hook (rephrased from the direct answer, written for YouTube viewers not site visitors).
- 3-5 bullet timestamps if the transcript has natural section breaks.
- A link back to the Q&A page on horizonsmigration.com.
- A link to book a consultation: https://horizonsmigration.com/book
- A short "About Horizons" paragraph (1-2 sentences) on what the channel is for.

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

PortableText shape per paragraph:

```json
{
  "_type": "block",
  "style": "normal",
  "children": [{ "_type": "span", "text": "..." }]
}
```

For h2: `"style": "h2"`. For h3: `"style": "h3"`. For lists, use `"listItem": "bullet"` or `"number"`.

### The transcript field

Save the **raw transcript verbatim** in `transcript`. Don't summarize it. Preserve paragraph breaks. The site exposes this via a disclosure component for users who want to read along.

## Defaults

- **LIA:** Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`) unless Joey specifies otherwise.
- **publishedAt:** Leave empty. Joey publishes from Studio after review. Never publish directly from this skill.

## Verification

Before reporting done:

1. Confirm the script printed a valid `drafts.*` `_id`.
2. Confirm the question, slug, youtubeUrl, transcript, and article fields are all present in the JSON.
3. Confirm the article begins with a direct answer in the first 1-2 sentences.
4. Print the Studio URL the script returned so Joey can open it in one click.
