---
name: horizons-youtube
description: Process the latest YouTube upload on the Horizons channel — auto-fix it to Public + Education + Embeddable, ask Joey for the Descript transcript, generate a scannable Sanity Q&A article with mandatory h2 subheadings and bullet lists, and push polished title/description/tags to YouTube. Triggers on /horizons-youtube, "process the latest video", "make a Q&A from the latest upload", "the latest video on the channel needs an article", or when Joey shares a transcript without a URL.
---

# horizons-youtube workflow

## When to use

Trigger this skill whenever Joey:

- Says `/horizons-youtube`, "process the latest video", "make a Q&A from the latest upload", or similar.
- Pastes a Descript transcript with no URL (the skill will assume he means the latest upload).
- Asks you to set up an article and YouTube metadata for a video he just uploaded.

The skill assumes the video is already uploaded to the Horizons YouTube channel via Descript or manually. It does not upload videos itself.

## Workflow

### Step 1 — Detect the latest upload

Run:

```bash
node scripts/youtube-latest.mjs --count 1 --json
```

Parse the single-element JSON array. Surface a one-line summary to Joey:

> Found: `<title>` (videoId `<videoId>`, uploaded `<relative time>`). Privacy: `<privacyStatus>` · Category: `<categoryId>` (`<categoryLabel>`) · Embeddable: `<embeddable>`.

If the script fails with an auth error, tell Joey to run `node scripts/youtube-auth.mjs` and stop — do not invent a video ID.

### Step 2 — Silent pre-flight fix (no approval prompt)

The Horizons channel standard is **Public** visibility, **Education** category (27), and **embeddable on other sites**. Education is the right neighbourhood because Horizons content is advisory/explainer (LIAs explaining how the system works), not DIY tutorials. Embedding must be enabled because every Q&A page on `horizons.nz` embeds the YouTube video — if `embeddable` is `false`, the page renders a "Video unavailable — Playback on other websites has been disabled by the video owner" error instead of the video.

**Watch out for the private→public flip:** YouTube preserves a video's `embeddable` setting across privacy changes. A video uploaded as Private often has `embeddable: false` baked in, and that flag stays `false` even after you flip it to Public. Always check `embeddable` even when the privacy status is already correct.

Apply all three fixes automatically if any are off (batch them into one `youtube-update.mjs` call when possible — flags compose):

- If `privacyStatus !== "public"`: add `--privacy-status public`. Log: `→ flipped to Public.`
- If `categoryId !== "27"`: add `--category-id 27`. Log: `→ moved to Education.`
- If `embeddable !== true`: add `--embeddable true`. Log: `→ enabled embedding.`
- If all three already correct, log: `✓ Public + Education + Embeddable.`

Example combined call:

```bash
node scripts/youtube-update.mjs <videoId> --privacy-status public --category-id 27 --embeddable true
```

No dry-run, no approval prompt for these three fixes — Joey has standing approval for the universal channel defaults. This is separate from the title/description/tags push, which still requires approval (see Step 6).

### Step 3 — Ask only for what's missing

In most runs, the only missing input is the transcript. Ask with a single short line:

> Paste the Descript transcript →

If Joey supplies more inline (a working question, an LIA override, a custom slug), accept it. Otherwise:

- Default LIA: Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`).
- Default question: derive from the YouTube title (strip the `| SEO modifier` suffix if present; polish into a natural-language question).
- Default slug: derive from the question (lowercase, hyphenated, max 96 chars).

If the YouTube title is already perfect and Joey has no preference, don't re-ask.

### Step 4 — Generate the Sanity Q&A article

Create a JSON payload at `tmp/qa-draft-<slug>.json` (create `tmp/` if missing — it's gitignored) with this shape:

```json
{
  "question": "<polished question>",
  "slug": "<derived from question>",
  "youtubeUrl": "https://youtu.be/<videoId>",
  "liaId": "ab1d6c56-999e-4e5e-985e-cde4bb14416e",
  "transcript": "<raw Descript transcript, verbatim>",
  "article": [ /* PortableText blocks — see structure rules below */ ]
}
```

Then run:

```bash
node scripts/create-qa-draft.mjs tmp/qa-draft-<slug>.json
```

The script creates a **published** Q&A document (publish-on-create is the default). The Q&A goes live at `/answers/<slug>` within ~60 seconds (ISR cache).

#### REQUIRED article structure — every article must hit all of these

1. **Direct answer first** — first 1–2 sentences, no heading. This is what AI Overviews / ChatGPT / Perplexity quote. Don't bury it.
2. **At least 2 h2 subheadings** — split the article into scannable sections. Each h2 should frame a question the section answers, not a generic label.
   - GOOD: `## How we decide who studies and who works`
   - GOOD: `## Why the working partner often unlocks residency`
   - BAD: `## Background`, `## More info`, `## Details`
3. **At least one list** (bulleted or numbered) — for steps, options, considerations, or examples. If the transcript enumerates anything, render it as a list. Lists are what makes a long-form article scannable.
4. **Short paragraphs** — max 3 sentences per block. If a paragraph runs longer, split it into two.
5. **Soft CTA at end** pointing to booking, framed as the next step ("If your situation matches this and you want a Licensed Immigration Adviser to look at it specifically, you can book a consultation here.").

#### Self-check before emitting JSON

Scan the article array you're about to write:

- Count blocks with `"style": "h2"`. Is it ≥ 2? If not, restructure — pick subheadings that match the natural pivots in the transcript.
- Count blocks with `"listItem": "bullet"` or `"listItem": "number"`. Is it ≥ 1? If not, find something worth listing (steps, criteria, examples) and convert it.
- If either check fails, do not ship a wall of text. Fix the structure first, then emit.

#### Portable Text block shape

Every block and span needs a unique `_key`:

```json
{
  "_type": "block",
  "_key": "b1",
  "style": "normal",
  "children": [{ "_type": "span", "_key": "s1", "text": "..." }]
}
```

For an `h2`: `"style": "h2"`. For an `h3`: `"style": "h3"`.

For a list item, set `"listItem": "bullet"` (or `"number"`) and `"level": 1`:

```json
{
  "_type": "block",
  "_key": "b5",
  "style": "normal",
  "listItem": "bullet",
  "level": 1,
  "children": [{ "_type": "span", "_key": "s5", "text": "Engineering, healthcare, IT — common but not the only fields in demand." }]
}
```

#### Worked example — what GOOD output looks like

Topic: "Husband or wife — who should be the student visa applicant?" The transcript covers (a) CV review to identify the stronger working partner, (b) the working partner being the path to residence via Green List, (c) what to do if one partner specifically wants to study.

```json
[
  {
    "_type": "block", "_key": "b1", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s1",
      "text": "When both spouses are graduates, the student visa applicant should be the one whose partner has the stronger pathway to a New Zealand residence visa through work — not whoever simply wants to study. The decision is about which combination of student + working partner gives the family the clearest route to residency."
    }]
  },
  {
    "_type": "block", "_key": "b2", "style": "h2",
    "children": [{ "_type": "span", "_key": "s2", "text": "How we decide who studies and who works" }]
  },
  {
    "_type": "block", "_key": "b3", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s3",
      "text": "The first step is reviewing both partners' CVs. We look at qualifications and work experience to identify which spouse has skills New Zealand actively needs. The partner with the stronger job-market profile becomes the working partner; the other becomes the student visa applicant and the principal applicant for the rest of the family."
    }]
  },
  {
    "_type": "block", "_key": "b4", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s4",
      "text": "Common in-demand fields include:"
    }]
  },
  {
    "_type": "block", "_key": "b5", "style": "normal", "listItem": "bullet", "level": 1,
    "children": [{ "_type": "span", "_key": "s5", "text": "Engineering" }]
  },
  {
    "_type": "block", "_key": "b6", "style": "normal", "listItem": "bullet", "level": 1,
    "children": [{ "_type": "span", "_key": "s6", "text": "Healthcare" }]
  },
  {
    "_type": "block", "_key": "b7", "style": "normal", "listItem": "bullet", "level": 1,
    "children": [{ "_type": "span", "_key": "s7", "text": "IT" }]
  },
  {
    "_type": "block", "_key": "b8", "style": "normal", "listItem": "bullet", "level": 1,
    "children": [{ "_type": "span", "_key": "s8", "text": "Trades and construction roles on the Green List" }]
  },
  {
    "_type": "block", "_key": "b9", "style": "h2",
    "children": [{ "_type": "span", "_key": "s9", "text": "Why the working partner often unlocks residency" }]
  },
  {
    "_type": "block", "_key": "b10", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s10",
      "text": "While one partner studies, the other looks for work. If they land a job on the Green List — particularly a Straight to Residence role — the family may be able to apply for a residence visa before the student even finishes their course."
    }]
  },
  {
    "_type": "block", "_key": "b11", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s11",
      "text": "That's why the upfront assessment matters. Picking the wrong spouse to study can lock a family into a pathway that doesn't lead to residency, even if the student visa itself gets approved."
    }]
  },
  {
    "_type": "block", "_key": "b12", "style": "h2",
    "children": [{ "_type": "span", "_key": "s12", "text": "What if one partner specifically wants to be the student?" }]
  },
  {
    "_type": "block", "_key": "b13", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s13",
      "text": "Sometimes the decision isn't clean. A spouse may have their heart set on a particular course. The question then shifts: does that course actually lead somewhere? Not every qualification opens a residence pathway."
    }]
  },
  {
    "_type": "block", "_key": "b14", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s14",
      "text": "The right course matters, and so does what comes after it. The choice should never be just \"whoever wants to study, studies.\" It should be whether the studying partner has a credible pathway to residence on the other side."
    }]
  },
  {
    "_type": "block", "_key": "b15", "style": "normal",
    "children": [{
      "_type": "span", "_key": "s15",
      "text": "If you and your spouse are weighing this decision and want a Licensed Immigration Adviser to look at both situations specifically, you can book a consultation here."
    }]
  }
]
```

That's 3 h2 sections, 1 bullet list, short paragraphs, direct answer up top, soft CTA at the bottom. Structure first, then prose.

#### Editorial rules for the article body

- Use correct visa names (AEWV, SMC, Partnership Resident, Green List, Straight to Residence, etc.). Don't invent.
- **Never invent facts.** Only use information from the transcript. If something needs more context to make sense, write around it — don't fabricate.
- Use the canonical domain **`horizons.nz`** in any inline links.

#### The transcript field

Save the **raw Descript transcript verbatim** in `transcript`. Don't summarize, don't fix typos beyond obvious transcription glitches, don't reorder. The site exposes this via a disclosure component for users who want to read along.

### Step 5 — Generate YouTube title, description, tags

Reference: editorial conventions live in `SEOStrategy.md` (repo root). Re-read it if you haven't this session.

#### Title

Two-part pattern: `<the question, near-verbatim> | <SEO modifier for audience and topic>`. Keep the question on the left — that's what AI search engines and Google quote. Use the right side for audience/keyword reach ("Filipino Couples", "OFW", country names, the specific visa type).

Total must fit YouTube's **100-character** limit. If the question is already 80+ chars, skip the suffix.

#### Description

Save to `tmp/yt-desc-<videoId>.txt`. Must contain, in order:

- A 1–2 sentence hook (rephrased from the direct answer; punchier, more curiosity-driven than the article opener).
- 3–5 bullet "Topics covered" lines describing what the video discusses. Only include real timestamps if Joey gave them; otherwise use unnumbered bullets.
- A link to the Q&A page: `https://horizons.nz/answers/<slug>`
- A link to book a consultation: `https://horizons.nz/book`
- A short "About Horizons" paragraph (1–2 sentences).

Use the canonical domain **`horizons.nz`** — not `horizonsmigration.com`, not `horizonsimmigration.com`.

#### Tags

Tags are a minor ranking signal in modern YouTube. Their real job is disambiguation and synonym coverage. Rules:

- **Tag the topic, not the audience.** Audience descriptors like "Filipino" / "OFW" / "Filipinos in NZ" belong in the **title** and **thumbnail**, not in tags.
- **Cover question-phrasing variants** — tag the way someone would type the question, not just the title.
- **Use substantive visa names** the video actually discusses ("Green List NZ", "Straight to Residence NZ", "AEWV", "Partnership Resident"). Never tag visa names the transcript doesn't mention.
- **Include the brand tag** "Horizons NZ".
- **Tagalog-audio videos: ~70% English / 30% Tagalog tag mix.** When the video's spoken language is Tagalog or Taglish, add 3–5 Tagalog phrasings alongside the English tags (e.g., `magkano lumipat sa New Zealand`, `ipon para sa NZ`). This is a deliberate exception to SEOStrategy.md's "English only" rule, which applies to written content only.
- Aim for **10–14 tags total** for Tagalog-audio videos, or **8–12 tags** for English-only-audio videos. YouTube enforces a 500-char total cap across all tags.

### Step 6 — Push YouTube metadata (dry-run + approval gate)

The title/description/tags push **still requires Joey's explicit approval** (separate from the silent privacy/category fixes in Step 2). Always dry-run first:

```bash
node scripts/youtube-update.mjs <videoId> \
  --title "<title>" \
  --description-file tmp/yt-desc-<videoId>.txt \
  --tags "<comma,separated,tags>" \
  --dry-run
```

Show Joey the proposed diff. Wait for explicit "go". Then re-run without `--dry-run`. Then run with `--show` to confirm the write landed.

If the push fails (token expired, network error, quota), fall back to outputting:

- **Title:** as a single line
- **Description:** as a markdown code block headed `Paste into YouTube Studio → Description:`
- **Tags:** as a comma-separated single line

…so Joey can paste manually.

**Never push to YouTube without explicit Joey approval** of the dry-run diff — same principle as never publishing the Sanity draft directly.

### Step 7 — Verify

Before reporting done:

1. Confirm `create-qa-draft.mjs` printed a non-`drafts.` `_id` for the Sanity Q&A.
2. Confirm the article array contains ≥ 2 `style: "h2"` blocks and ≥ 1 `listItem: "bullet"` (or `"number"`) block.
3. Confirm the article begins with the direct answer in the first 1–2 sentences (no heading on the first block).
4. Print the live URL (`https://horizons.nz/answers/<slug>`) for Joey to open after the ~60s ISR refresh.
5. If YouTube push was approved: run `node scripts/youtube-update.mjs <videoId> --show` and confirm the title, tags, and description start match what was pushed.
6. Log a one-line summary of the run:
   > Done. Q&A live at `<url>`. YouTube: title/description/tags pushed. Privacy: public · Category: 27 (Education) · Embeddable: true.

## Defaults

- **LIA:** Rowel Mercado (`ab1d6c56-999e-4e5e-985e-cde4bb14416e`) unless Joey specifies otherwise.
- **publishedAt:** Don't set in JSON — the script defaults to "now" when publishing. Q&A goes live immediately. (Joey trusts this skill to ship without a review step; see memory `feedback_qa_auto_publish.md`.)
- **Privacy:** `public`. Auto-fixed silently.
- **Category:** `27` (Education). Auto-fixed silently.
- **Embeddable:** `true`. Auto-fixed silently. Required so the YouTube embed plays on `/answers/<slug>` pages.
- **Domain:** `horizons.nz` — for all user-facing links in descriptions and articles.

## Notes

- This skill replaces the older `qa-from-transcript` skill, which required Joey to paste the YouTube URL + title every run and didn't enforce article structure or channel defaults.
- The `tmp/` directory is gitignored. Don't commit anything there.
- The privacy + category auto-fix is **the only** silent YouTube write this skill does. All title/description/tags changes still go through the dry-run + approval gate.
