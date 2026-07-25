---
name: horizons-seo
description: One SEO content cycle for horizonsimmigration.com — pick next keyword target, research with free tools, produce a Sanity blog draft or video-Q&A brief, log the cycle. Run directly or via /loop. Triggers on /horizons-seo, "next SEO piece", "run the SEO loop".
---

# Horizons SEO Loop — one cycle per invocation

**Read first:** `SEOStrategy.md` (conventions), `docs/research/keyword-map.md` (targets), `docs/research/seo-log.md` (history — determines cycle number).

## Cycle type
Count prior entries in seo-log.md. Every 4th cycle is a **review cycle**; otherwise **content cycle**.

## Review cycle (every 4th)
1. Pull GSC data via mcp-gsc if available (queries with impressions, positions 8–30 = striking distance). If mcp-gsc is not configured or GSC has <4 weeks of data, note "GSC immature" and skip to 3.
2. Re-order keyword-map.md priorities: promote topics where GSC shows impressions; mark `published` items appearing in GSC as `ranking`.
3. Audit last 3 published pieces: internal links present? citations resolve (curl each href → 200)?
4. Log the cycle. STOP — no content this cycle.

## Content cycle
1. **Pick target:** first `todo` item per the Priority order section of keyword-map.md. Confirm choice with Joey ONLY if the top item requires his input (e.g. real client stories for a country page); otherwise proceed.
2. **Research (free tools only):**
   - Google Suggest: `curl "https://suggestqueries.google.com/complete/search?client=firefox&q=<seed>"` — run for 3–5 seed variations, collect question phrasings.
   - WebSearch the target keyword; read the top 3 ranking pages; note their gaps (what a Filipino audience needs that they miss).
   - Collect the exact official source URLs (immigration.govt.nz / iaa.govt.nz) for every fact the piece will state. Verify each with curl → 200.
3. **Format decision:** if the topic is on the PAA question list or is trust/personal (scam stories, adviser legitimacy) → produce a **video-Q&A brief** for Rowel (question, 5–8 talking points, target keyword, suggested title) and post it in chat + log it. Otherwise → **blog draft**.
4. **Blog draft** (follow SEOStrategy.md Blog Workflow, Phase 2 rules):
   - Question-style H2s; direct 40–60 word answer under the first heading.
   - Primary keyword in: title, slug, first paragraph, one H2.
   - Every visa fact links to its exact official source page (markDefs link annotations).
   - Internal links: ≥2 related Q&As/posts + the pillar page (once it exists).
   - Write into Sanity as a `post` draft (author Rowel `ab1d6c56-999e-4e5e-985e-cde4bb14416e`, publishedAt empty, excerpt 150–160 chars). Use the `scripts/create-qa-draft.mjs` client pattern.
5. **Update state:** set the target's status to `drafted` in keyword-map.md; append a seo-log.md entry; tell Joey what was produced and the suggested next target.

## Hard rules
- No invented facts. Anything not verifiable on an official page gets cut or flagged to Joey.
- English only. No hype. Country pages need genuinely unique content — if you can't make it unique, pick a different target and tell Joey why.
- Drafts are never auto-published.

## Pacing (when run via /loop dynamic mode)
After a cycle completes, if run under /loop: schedule the next wake-up 3–4 days out (Joey's capacity is 1–2 pieces/week). Joey can stop the loop at any time.
