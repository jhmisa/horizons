# SEO Engine — Design Spec

**Date:** 2026-07-25
**Status:** Approved design, pending implementation plan
**Goal:** Rank horizonsimmigration.com on Google and AI search surfaces (AI Overviews, ChatGPT, Perplexity) for queries by Filipinos abroad seeking a Licensed Immigration Adviser for New Zealand migration. Kicks off Phase 2 of `SEOStrategy.md`.

## Constraints (from Joey)

- **Tools:** Free only. GSC + Google Suggest + People Also Ask + manual SERP review. No Ahrefs/SEMrush/DataForSEO.
- **Capacity:** 1–2 content pieces per week.
- **Loop output:** Each cycle produces a brief + full Sanity draft (blog) or a video-topic recommendation (Q&A).
- **Review:** Blog drafts land in Sanity as drafts; Joey reviews in Studio. Citation retrofits to existing published Q&As patch live documents directly (additive-only changes).

## Architecture

Two parts: **one-time foundations** (a–e) and a **recurring loop skill** (`/horizons-seo`) Joey can run via `/loop` or invoke directly.

### Foundations (one-time)

**a. Google Search Console connection**
- Meta-tag verification (no DNS changes needed — DNS lives at awebnz): add `google-site-verification` meta tag to `app/layout.tsx`, deploy, verify in GSC UI. Claude guides Joey through browser steps.
- Submit existing sitemap (`app/sitemap.ts` output).
- Do this first: data accumulates from day one; loop has useful GSC data in ~4–6 weeks.

**b. mcp-gsc MCP server** ([AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc))
- Gives the loop programmatic access to query/position data ("striking distance" queries at position 8–30).
- Requires Google Cloud service-account key; Claude walks Joey through setup.

**c. E-E-A-T hardening (one PR)**
Immigration is YMYL; anonymous content effectively cannot rank. Add:
- `Organization` schema sitewide including IAA licensing credentials.
- `Person` schema for Rowel Mercado: title "Licensed Immigration Adviser", license `200900577`, `sameAs` → [IAA register entry](https://iaa.ewr.govt.nz/PublicRegister/View.aspx?adviserNumber=200900577), [LinkedIn](https://www.linkedin.com/in/rowel-mercado-1388883a/).
- `Article` schema (author, dateModified) on Q&A and blog pages.
- `VideoObject` schema on pages with YouTube embeds (transcript already on page — keep).
- Author byline on articles linking to adviser profile page displaying the license number.
- Off-spec but noted: Rowel updates LinkedIn headline to "Licensed Immigration Adviser (IAA #200900577) — Horizons New Zealand Immigration" (Joey is asking him). Old Weebly site + ZoomInfo entity cleanup deferred.

**d. Keyword map** (`docs/research/keyword-map.md`)
Seeded from 2026-07-25 research. Six clusters, each entry tracked `todo → drafted → published → ranking`:
1. **Trust/scam-avoidance** (low competition, highest conversion — structural advantage as licensed adviser): "verify NZ job offer legit", "is direct hire to New Zealand legal", "how to check IAA register", "DMW licensed agency New Zealand".
2. **Country-exit pages**: Saudi/Qatar/Kuwait OFW (near-zero competition), HK domestic helper → NZ caregiver (zero competition), "Singapore PR rejected → NZ Plan B", UAE/Dubai (medium competition).
3. **Occupations** (job-lens entry, bridge to visa): caregivers (biggest gap), nurses, welders/electricians, truck drivers, engineers, IT.
4. **Visa explainers**: AEWV, Green List, SMC, Care Workforce Work-to-Residence, Philippines Special Work Visa (real visa, thin SERP).
5. **Adviser-selection**: "adviser vs lawyer vs recruiter", "adviser fees worth it", "immigration consultant NZ legit".
6. **Awareness** (high volume, high competition — lowest priority): "how to migrate to NZ from Philippines", "NZ vs Australia for OFW".

Top-10 first-mover topics and ~26 PAA-style questions from research included in the map.

**e. Citation retrofit of existing Q&As**
- 6 published Q&A articles have zero citation links today; 1 stub ("What is the Skilled Migrant visa?") flagged for a full article.
- For each article: identify every factual visa claim, link the exact backing INZ/IAA/NZQA page via PortableText `markDefs`, patch live Sanity documents via API (additive-only).
- If a claim can't be backed by a current official page (e.g. outdated fund amount), flag to Joey instead of linking — accuracy fix, not linking fix.
- Post-run: summary to Joey of what got linked where.

**f. Domain consolidation (discovered during design)**
- Two live sites exist: `horizonsimmigration.com` (new, Next.js/Vercel) and `horizonsmigration.com` (old Wix site, still live, currently what Google indexes for the brand). The split divides brand authority and backlinks.
- **URGENT: old domain registration (Network Solutions) expires 2026-08-21.** Renew + auto-renew first, keep indefinitely.
- **Live Google Workspace email on the old domain** (MX → aspmx.l.google.com). Redirect the website only; never touch MX. Joey to confirm who uses @horizonsmigration.com addresses.
- Plan: in Wix DNS panel, repoint apex A + www CNAME to Vercel (MX untouched) → add both old hostnames to the Vercel project as permanent redirects to horizonsimmigration.com → explicit path mappings in next.config for valuable old pages (`/advisers|/ourteam|/whyhorizons`→`/about`, `/faqs`→`/answers`, `/testimonials|/more-feedbacks`→`/success-stories`, `/fees`+payment pages→`/book`, `/hnz-partner-schools`→`/partner-schools`, CA/AU promos→`/ca`|`/au`, rest→home). Old sitemap had ~70 URLs, mostly dead promos.
- After both domains verified in GSC: submit **Change of Address** to accelerate rank transfer.
- Fix `horizonsmigration.com` typo in SEOStrategy.md. Related deferred cleanup: old Weebly site (hnzimmigration.weebly.com), ZoomInfo entry pointing at horizonsnz.co.nz.

### Loop skill (`.claude/skills/horizons-seo/`)

Each cycle = one unit of work:
1. **GSC check** (via mcp-gsc): movements, striking-distance queries. Gracefully skipped while GSC data is immature.
2. **Pick target** from keyword map (priority: trust cluster → country pages → occupations, adjusted by GSC signals).
3. **Free research**: Google Suggest endpoint (`suggestqueries.google.com`), People Also Ask, read top-3 ranking pages for the target.
4. **Produce**: content brief + full blog draft into Sanity (`post` doc, draft) per Blog Workflow in SEOStrategy.md — or, if topic suits video, a video-Q&A recommendation for Rowel (question, talking points, target keyword) feeding the horizons-youtube pipeline.
5. **Internal links**: every draft links to 2+ related pieces and to the pillar page.
6. **Log** cycle to `docs/research/seo-log.md` (target, actions, next suggestion).

**Review mode:** every ~4th cycle, no content — instead pull GSC data, re-prioritize the keyword map, note wins/losses in the log.

**Pacing:** Joey runs `/loop` in dynamic mode or invokes the skill directly; one cycle per run, matched to 1–2 pieces/week. Start/stop is entirely Joey's.

### Content rules (baked into the skill; also apply to qa-from-transcript workflow)

- Answer-first shape: question as H2 → 40–60 word direct answer → detail with bullets/tables.
- **Citations mandatory:** every visa fact, fee, or requirement links to the *exact* INZ/IAA page backing it (Princeton GEO study: citations/statistics lift AI-answer visibility up to ~40%; also a conversion signal for a scam-wary audience).
- No invented facts. English only. Clear, direct tone (per SEOStrategy.md).
- Cluster discipline: pillar page "How to migrate to NZ as a Filipino" written early; all content interlinks within its cluster.
- Country pages only with genuinely unique content (exit rules, real client stories, country-specific FAQs) — never templated near-duplicates (doorway-page risk).

### Deliberately skipped

llms.txt (Google doesn't support it; zero citation correlation), paid SEO tools, Tagalog content, keyword-density optimization, bulk AI page generation, changes to the existing horizons-youtube skill (this loop complements it by suggesting which questions to film).

## Success criteria

- GSC impressions + average position for trust-cluster queries, reviewed monthly in loop review mode.
- Expectations: measurable impressions in 6–8 weeks; meaningful clicks in 3–4 months. Decision-stage cluster is winnable — competitors are thin, dated brochure sites.

## Implementation order

1. Foundation a (GSC) — unblocks data accumulation immediately.
2. Foundation e (citation retrofit) — immediate E-E-A-T lift on live content.
3. Foundation c (E-E-A-T PR) — schema + author surfaces.
4. Foundation d (keyword map) — from existing research output.
5. Loop skill build.
6. Foundation b (mcp-gsc) — can trail; loop degrades gracefully without it.
7. Foundation f (domain consolidation) — as soon as Joey confirms Wix access; independent of the rest.
8. Update `SEOStrategy.md`: mark Phase 2 active, add citation-links convention, fix domain typo.
