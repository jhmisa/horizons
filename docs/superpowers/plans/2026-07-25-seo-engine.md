# SEO Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the SEO engine from `docs/superpowers/specs/2026-07-25-seo-engine-design.md`: GSC connection, E-E-A-T schema, citation retrofit of live Q&As, keyword map, the `/horizons-seo` loop skill, and old-domain consolidation.

**Architecture:** One-time foundations (code + guided ops steps for Joey) followed by a recurring Claude Code skill that produces one content unit per cycle into Sanity. Schema components render JSON-LD server-side in the Next.js App Router; content operations go through the Sanity HTTP API using the existing `scripts/*.mjs` pattern.

**Tech Stack:** Next.js 15 App Router, TypeScript, Vitest + testing-library, Sanity (`@sanity/client`), Google Search Console, mcp-gsc MCP server.

**Facts already verified (do not re-derive):** Rowel Mercado IAA license `200900577`; IAA register entry `https://iaa.ewr.govt.nz/PublicRegister/View.aspx?adviserNumber=200900577`; LinkedIn `https://www.linkedin.com/in/rowel-mercado-1388883a/`; old Wix site `horizonsmigration.com` (Network Solutions, expires 2026-08-21, live Google Workspace MX — never touch MX records); 6 published Q&As have zero citation links; 1 stub Q&A ("what-is-the-skilled-migrant-visa", 1 block).

**NOT in this plan (waiting on Joey — see task list):** "since 2002", Manila office, Education NZ accreditation claims; domain renewal; who uses @horizonsmigration.com email.

---

### Task 1: GSC verification meta tag + sitemap submission (partly guided)

**Files:**
- Modify: `app/layout.tsx` (metadata export, after `manifest` key)

- [ ] **Step 1: Joey creates the GSC property (guided, human step)**

Tell Joey:
1. Open https://search.google.com/search-console → Add property → **URL prefix** → enter `https://www.horizonsimmigration.com` (URL-prefix, NOT Domain — Domain requires DNS edits at awebnz).
2. Choose the **HTML tag** verification method. Copy the `content="..."` value from the meta tag GSC shows (looks like `google-site-verification: content="AbC123..."`). Paste that value into this chat.
3. Do NOT click Verify yet — the tag must deploy first.

- [ ] **Step 2: Add the verification token to layout metadata**

In `app/layout.tsx`, add to the `metadata` object (replace `PASTE_TOKEN_FROM_JOEY`):

```typescript
  verification: {
    google: "PASTE_TOKEN_FROM_JOEY",
  },
```

- [ ] **Step 3: Verify the tag renders**

Run: `npm run dev` then `curl -s http://localhost:3000 | grep google-site-verification`
Expected: `<meta name="google-site-verification" content="..."/>`

- [ ] **Step 4: Commit and deploy**

```bash
git add app/layout.tsx
git commit -m "feat(seo): add Google Search Console verification meta tag"
```

Then Joey runs `/push-to-main` (deploys via Vercel), waits for deploy, clicks **Verify** in GSC.

- [ ] **Step 5: Submit sitemap (guided, human step)**

Tell Joey: in GSC left menu → Sitemaps → enter `sitemap.xml` → Submit. Expected status: "Success".

---

### Task 2: Citation retrofit of the 6 live Q&As

**Files:**
- Create: `scripts/add-qa-citations.mjs`

Official source URLs to cite (verify each returns HTTP 200 before use; if a URL 404s, find the current equivalent on the same domain and use that):

| Topic | URL |
|---|---|
| Student visa (fee-paying) | https://www.immigration.govt.nz/visas/fee-paying-student-visa/ |
| Partner of a student (work rights) | https://www.immigration.govt.nz/visas/partner-of-a-student-work-visa/ |
| Post Study Work Visa | https://www.immigration.govt.nz/visas/post-study-work-visa/ |
| Skilled Migrant Category | https://www.immigration.govt.nz/visas/skilled-migrant-category-resident-visa/ |
| AEWV | https://www.immigration.govt.nz/visas/accredited-employer-work-visa/ |
| Green List | https://www.immigration.govt.nz/roles-in-demand/green-list-roles/ |
| Funds & living costs for students | https://www.immigration.govt.nz/process-to-apply/medical-police-funds/ |
| Getting immigration advice / IAA | https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/getting-immigration-advice/ |
| IAA public register | https://iaa.ewr.govt.nz/PublicRegister/Search.aspx |
| NZQA qualification recognition | https://www.nzqa.govt.nz/qualifications-standards/international-qualifications/ |

- [ ] **Step 1: Pull the 6 articles and identify claims**

Run:
```bash
curl -s "https://07g62s03.api.sanity.io/v2024-01-01/data/query/production?query=$(python3 -c "import urllib.parse; print(urllib.parse.quote('*[_type==\"qa\" && defined(article)]{_id, question, article}'))")" > tmp/qa-articles.json
```
Read `tmp/qa-articles.json`. For each article, list every factual visa claim (fund amounts, work rights, visa names, durations) and pick the matching URL from the table. If a claim can't be backed by a current official page, note it in the run summary for Joey instead of linking (do NOT link to a page that contradicts the article).

- [ ] **Step 2: Write the citation script**

Create `scripts/add-qa-citations.mjs`. It takes a JSON mapping file (`tmp/qa-citations.json`) of the form:

```json
[
  {
    "docId": "<qa _id>",
    "links": [
      { "blockKey": "<_key of block>", "phrase": "exact text to linkify", "href": "https://..." }
    ]
  }
]
```

Script content:

```javascript
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
);
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01", token: env.SANITY_API_TOKEN, useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 10);
const dryRun = process.argv.includes("--dry-run");
const mappings = JSON.parse(readFileSync(process.argv[2], "utf8"));

for (const { docId, links } of mappings) {
  const doc = await client.getDocument(docId);
  const article = structuredClone(doc.article);
  const applied = [];
  for (const { blockKey, phrase, href } of links) {
    const blk = article.find((b) => b._key === blockKey);
    if (!blk) { console.warn(`SKIP ${docId}: block ${blockKey} not found`); continue; }
    // find the span containing the phrase, split it into [before, linked, after]
    const idx = blk.children.findIndex((c) => c._type === "span" && c.text.includes(phrase));
    if (idx === -1) { console.warn(`SKIP ${docId}: phrase not found: ${phrase}`); continue; }
    const span = blk.children[idx];
    const [before, after] = [span.text.slice(0, span.text.indexOf(phrase)), span.text.slice(span.text.indexOf(phrase) + phrase.length)];
    const markKey = key();
    blk.markDefs = [...(blk.markDefs || []), { _type: "link", _key: markKey, href }];
    const repl = [];
    if (before) repl.push({ _type: "span", _key: key(), text: before, marks: span.marks || [] });
    repl.push({ _type: "span", _key: key(), text: phrase, marks: [...(span.marks || []), markKey] });
    if (after) repl.push({ _type: "span", _key: key(), text: after, marks: span.marks || [] });
    blk.children.splice(idx, 1, ...repl);
    applied.push(`${phrase} -> ${href}`);
  }
  if (dryRun) { console.log(`[dry-run] ${docId}:`); applied.forEach((a) => console.log("  " + a)); continue; }
  await client.patch(docId).set({ article }).commit();
  console.log(`✔ ${docId}: ${applied.length} links`);
}
```

- [ ] **Step 3: Build the mapping and dry-run**

Write `tmp/qa-citations.json` per Step 1's claim analysis (aim for 2–5 links per article; link the *first* mention of each concept only). Verify every href with `curl -s -o /dev/null -w "%{http_code}" <url>` → expect 200 (301 to an INZ page is also fine — use the final URL).

Run: `node scripts/add-qa-citations.mjs tmp/qa-citations.json --dry-run`
Expected: each doc lists its planned links, no warnings.

- [ ] **Step 4: Apply and verify**

Run: `node scripts/add-qa-citations.mjs tmp/qa-citations.json`
Then re-run the Step 1 curl and confirm `markDefs` now contain `link` entries with the expected hrefs.
Spot-check one page renders links: `curl -s http://localhost:3000/answers/<slug> | grep -c "immigration.govt.nz"` → ≥ 1.

- [ ] **Step 5: Commit + summary**

```bash
git add scripts/add-qa-citations.mjs
git commit -m "feat(seo): citation retrofit script for Q&A articles"
```
Post a summary to Joey: per Q&A, what got linked where + any unverifiable claims flagged. Also remind Joey that the stub Q&A `what-is-the-skilled-migrant-visa` (1 block, no real article) needs a full article — it maps to the Cluster 4 "Skilled Migrant Category points for Filipinos" keyword-map entry, so the loop will cover it.

---

### Task 3: E-E-A-T schema — Organization + Person site-wide

**Files:**
- Create: `components/seo/SiteJsonLd.tsx`
- Create: `components/seo/__tests__/SiteJsonLd.test.tsx`
- Create: `lib/adviser.ts`
- Modify: `app/layout.tsx` (render `<SiteJsonLd />` in `<body>`)
- Modify: `components/qa/QAJsonLd.tsx` (enrich Article author)
- Modify: `components/qa/__tests__/QAJsonLd.test.tsx` (author assertions)

- [ ] **Step 1: Create the adviser constants**

Create `lib/adviser.ts`:

```typescript
export const ROWEL = {
  name: "Rowel Mercado",
  jobTitle: "Licensed Immigration Adviser",
  licenseNumber: "200900577",
  iaaRegisterUrl:
    "https://iaa.ewr.govt.nz/PublicRegister/View.aspx?adviserNumber=200900577",
  linkedinUrl: "https://www.linkedin.com/in/rowel-mercado-1388883a/",
} as const;
```

- [ ] **Step 2: Write the failing test**

Create `components/seo/__tests__/SiteJsonLd.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SiteJsonLd } from "../SiteJsonLd";

function getJsonLd(container: HTMLElement): Record<string, unknown>[] {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.innerHTML));
}

describe("SiteJsonLd", () => {
  it("renders Organization schema with IAA credential", () => {
    const { container } = render(<SiteJsonLd siteUrl="https://www.horizonsimmigration.com" />);
    const org = getJsonLd(container).find((d) => d["@type"] === "Organization");
    expect(org).toBeDefined();
    expect(org!.name).toBe("Horizons Immigration Consulting");
    expect(JSON.stringify(org)).toContain("Immigration Advisers Authority");
  });

  it("renders Person schema for Rowel with sameAs to IAA register and LinkedIn", () => {
    const { container } = render(<SiteJsonLd siteUrl="https://www.horizonsimmigration.com" />);
    const person = getJsonLd(container).find((d) => d["@type"] === "Person");
    expect(person).toBeDefined();
    expect(person!.name).toBe("Rowel Mercado");
    const sameAs = person!.sameAs as string[];
    expect(sameAs).toContain(
      "https://iaa.ewr.govt.nz/PublicRegister/View.aspx?adviserNumber=200900577"
    );
    expect(sameAs).toContain("https://www.linkedin.com/in/rowel-mercado-1388883a/");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run components/seo`
Expected: FAIL — `Cannot find module '../SiteJsonLd'`

- [ ] **Step 4: Implement SiteJsonLd**

Create `components/seo/SiteJsonLd.tsx`:

```tsx
import { ROWEL } from "@/lib/adviser";

export function SiteJsonLd({ siteUrl }: { siteUrl: string }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Horizons Immigration Consulting",
    url: siteUrl,
    logo: `${siteUrl}/images/favicon/apple-touch-icon.png`,
    description:
      "Licensed Immigration Advisers helping Filipino families migrate to New Zealand.",
    memberOf: {
      "@type": "Organization",
      name: "Immigration Advisers Authority (IAA), New Zealand",
      url: "https://www.iaa.govt.nz/",
    },
    employee: { "@id": `${siteUrl}/#rowel` },
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#rowel`,
    name: ROWEL.name,
    jobTitle: `${ROWEL.jobTitle} (IAA #${ROWEL.licenseNumber})`,
    worksFor: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}/about`,
    sameAs: [ROWEL.iaaRegisterUrl, ROWEL.linkedinUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
    </>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/seo`
Expected: PASS (2 tests)

- [ ] **Step 6: Mount in layout**

In `app/layout.tsx`: add imports

```typescript
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
```

and inside `<body>` before `<Navbar />`:

```tsx
        <SiteJsonLd siteUrl={sharedConfig.siteUrl} />
```

Verify: `curl -s http://localhost:3000 | grep -o '"@type":"Organization"'` → match found.

- [ ] **Step 7: Enrich QAJsonLd Article author (TDD)**

In `components/qa/__tests__/QAJsonLd.test.tsx`, add a test (follow the existing test file's render/props pattern — reuse its existing minimal props):

```tsx
  it("gives the Article author a sameAs pointing at the IAA register when the author is Rowel", () => {
    // render with liaName="Rowel Mercado" plus the file's existing required props
    // find the Article JSON-LD blob, then:
    // expect(article.author["@type"]).toBe("Person");
    // expect(article.author.sameAs).toContain("https://iaa.ewr.govt.nz/PublicRegister/View.aspx?adviserNumber=200900577");
  });
```

(Write it as real code against the existing props in that file — the comment lines above show the assertions to make.)

Run `npx vitest run components/qa` → new test FAILS.

In `components/qa/QAJsonLd.tsx`, add import `import { ROWEL } from "@/lib/adviser";` and replace the `article` author line:

```typescript
    author:
      liaName === ROWEL.name
        ? {
            "@type": "Person",
            name: ROWEL.name,
            jobTitle: `${ROWEL.jobTitle} (IAA #${ROWEL.licenseNumber})`,
            sameAs: [ROWEL.iaaRegisterUrl, ROWEL.linkedinUrl],
          }
        : { "@type": "Person", name: liaName },
```

Run `npx vitest run` → ALL tests PASS.

- [ ] **Step 8: Display the license number on the About page**

Find the About page component: `grep -rn "Rowel" app/about components/pages | head`. In the component that renders Rowel's profile card, ensure his title line reads exactly:

```
Licensed Immigration Adviser — IAA #200900577
```

and that it links to his IAA register entry (`ROWEL.iaaRegisterUrl` from `lib/adviser.ts`) with `target="_blank" rel="noopener noreferrer"`. If the page already shows a license number, verify it matches `200900577` and add the register link if missing. Note: adviser data may come from Sanity (`lia` schema) — if so, check whether the `lia` document has a license field; if the number lives in Sanity, update the document (Rowel `ab1d6c56-999e-4e5e-985e-cde4bb14416e`) instead of hardcoding, and render the register link in the component.

Verify: `curl -s http://localhost:3000/about | grep -o "200900577"` → match found.

- [ ] **Step 9: Commit**

```bash
git add lib/adviser.ts components/seo app/layout.tsx components/qa
git add -A app/about components/pages
git commit -m "feat(seo): Organization + Person JSON-LD with IAA credentials (E-E-A-T)"
```

---

### Task 4: Keyword map + SEO log files

**Files:**
- Create: `docs/research/keyword-map.md`
- Create: `docs/research/seo-log.md`

- [ ] **Step 1: Create the keyword map**

Create `docs/research/keyword-map.md` with exactly this content (statuses all start `todo`; the loop skill updates them):

```markdown
# Keyword Map — Horizons Immigration

Status values: todo → drafted → published → ranking. Updated by the /horizons-seo loop.
Source: research pass 2026-07-25 (free-tool based; no volume numbers — priority is by competition × conversion).

## Cluster 1: Trust & scam-avoidance (LOW competition, HIGHEST conversion — our structural advantage)
| Keyword / topic | Format | Status |
|---|---|---|
| how to spot fake NZ job offers / verify DMW agency | pillar-ish blog | todo |
| is direct hire to New Zealand legal for Filipinos (OEC/DMW + AEWV) | blog + video | todo |
| how to check if an adviser is IAA-licensed | Q&A video | todo |
| immigration adviser vs lawyer vs recruiter vs "consultant" | blog | todo |
| is New Zealand a no-placement-fee country | Q&A | todo |
| licensed immigration adviser fees — is it worth it | blog (transparent pricing) | todo |
| what happens if my NZ visa is declined | Q&A | todo |

## Cluster 2: Country-exit pages (unique content only — never templated)
| Keyword / topic | Competition | Status |
|---|---|---|
| apply to NZ from Saudi/Qatar/Kuwait as an OFW | near-zero | todo |
| HK domestic helper → NZ caregiver pathway | zero | todo |
| Singapore PR rejected? Your NZ Plan B | low (bridge angle) | todo |
| NZ work visa from Dubai/UAE | medium | todo |

## Cluster 3: Occupations (job-lens entry; bridge job → visa)
| Keyword / topic | Notes | Status |
|---|---|---|
| caregiver → Care Workforce Work-to-Residence guide | biggest gap; 75% of NZ care-visa holders are Indian/Filipino | todo |
| nurses → Green List Tier 1 / Straight to Residence | OET schools already compete | todo |
| welder / electrician NZ visa pathway | RecruitNZ actively hires Filipinos | todo |
| truck driver NZ pathway | POEA job boards list these | todo |
| engineers / IT | later | todo |

## Cluster 4: Visa explainers (medium competition; INZ owns top spots — win the "for Filipinos" angle)
| Keyword / topic | Status |
|---|---|
| AEWV requirements for Filipinos | todo |
| Philippines Special Work Visa explainer (real visa, thin SERP) | todo |
| NZ Green List occupations for Filipinos | todo |
| Skilled Migrant Category points for Filipinos | todo |
| Care Workforce Work to Residence explained | todo |

## Cluster 5: Adviser-selection (decision stage)
| Keyword / topic | Status |
|---|---|
| licensed immigration adviser NZ for Filipinos | todo |
| immigration consultant NZ legit | todo |
| IAA licensed adviser Philippines | todo |

## Cluster 6: Awareness (HIGH competition — lowest priority, write last)
| Keyword / topic | Status |
|---|---|
| how to migrate to New Zealand from Philippines (PILLAR PAGE — write early as cluster hub) | todo |
| NZ vs Australia vs Canada for OFW | todo |
| cost of living NZ for Filipino family | todo |

## PAA-style questions (feed the Q&A video pipeline)
How can a Filipino migrate to New Zealand? · How much money do I need to migrate to NZ from the Philippines? · Can I go to NZ without an agency? · Is direct hiring to New Zealand legal for Filipinos? · Do I need a DMW/POEA agency for a New Zealand job? · Is New Zealand a no-placement-fee country? · What is the AEWV and how do I qualify? · What jobs are on the NZ Green List? · Can Filipino nurses get residency straight away in NZ? · How do caregivers qualify for NZ residence? · What is the OEC and do I need it? · Can I apply for an NZ visa while working in Dubai/Saudi/Qatar? · Can a domestic helper in Hong Kong apply for an NZ work visa? · My Singapore PR was rejected — can I move to NZ instead? · Can I bring my family on an AEWV? · What English test score do I need? · How long does an NZ work visa take from the Philippines? · How do I know if an NZ immigration consultant is legit? · What's the difference between an immigration adviser and a lawyer? · How do I check if an adviser is IAA-licensed? · How much does a licensed immigration adviser cost — is it worth it? · What happens if my NZ visa is declined? · Can I convert a visit visa to a work visa in NZ? · NZ vs Australia vs Canada — which is easier for Filipinos? · What is the Philippines Special Work Visa? · Are there NZ jobs for welders/truck drivers from the Philippines?

## Priority order for the loop
1. Pillar page (Cluster 6, first item) — the hub everything links to
2. Cluster 1 top-to-bottom
3. Cluster 2 (Saudi/Qatar/Kuwait, then HK helper, then SG bridge)
4. Cluster 3 (caregiver first)
5. Clusters 4–5 interleaved
```

- [ ] **Step 2: Create the log**

Create `docs/research/seo-log.md`:

```markdown
# SEO Loop Log

One entry per /horizons-seo cycle. Newest first.

<!-- entry format:
## YYYY-MM-DD — cycle N (content|review)
- Target: <keyword / topic>
- Produced: <Sanity draft id / video brief / map re-prioritization>
- GSC signals used: <none | notes>
- Next suggested target: <topic>
-->
```

- [ ] **Step 3: Commit**

```bash
git add docs/research/keyword-map.md docs/research/seo-log.md
git commit -m "docs(seo): keyword map + loop log seeded from 2026-07-25 research"
```

---

### Task 5: The /horizons-seo loop skill

**Files:**
- Create: `.claude/skills/horizons-seo/SKILL.md`

- [ ] **Step 1: Write the skill**

Create `.claude/skills/horizons-seo/SKILL.md`:

```markdown
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
```

- [ ] **Step 2: Smoke-test the skill file**

Run: `head -5 .claude/skills/horizons-seo/SKILL.md`
Expected: frontmatter with `name: horizons-seo`. Then invoke `/horizons-seo` once in a fresh session and confirm it reads the keyword map and proposes the pillar page as cycle 1. Do NOT let it write a full draft during the smoke test unless Joey wants one.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/horizons-seo/SKILL.md
git commit -m "feat(seo): /horizons-seo loop skill — one content cycle per run"
```

---

### Task 6: mcp-gsc install (guided; can trail everything else)

**Files:**
- Modify: `.mcp.json` (create if absent)

- [ ] **Step 1: Google Cloud service account (guided, human step)**

Walk Joey through: console.cloud.google.com → create project `horizons-seo` → enable "Google Search Console API" → IAM → Service Accounts → create `gsc-reader` → create JSON key → download to `~/.config/horizons/gsc-service-account.json` (NOT in the repo). Then in GSC: Settings → Users and permissions → Add user → the service account email → Full access.

- [ ] **Step 2: Register the MCP server**

Add to `.mcp.json` at repo root (create the file if it doesn't exist; if it exists, merge the `gsc` key into `mcpServers`):

```json
{
  "mcpServers": {
    "gsc": {
      "command": "uvx",
      "args": ["mcp-gsc"],
      "env": {
        "GSC_CREDENTIALS_PATH": "/Users/joeymisa/.config/horizons/gsc-service-account.json"
      }
    }
  }
}
```

Note: check https://github.com/AminForou/mcp-gsc README at execution time for the current install command; if `uvx mcp-gsc` isn't the published entrypoint, use the README's exact command instead.

- [ ] **Step 3: Verify**

Restart Claude Code session; run a GSC MCP tool (e.g. list properties). Expected: returns the `horizonsimmigration.com` property. (Data will be sparse until GSC has collected for a few weeks — that's fine.)

- [ ] **Step 4: Commit**

```bash
git add .mcp.json
git commit -m "chore(seo): register mcp-gsc server for Search Console data"
```

---

### Task 7: Old-domain redirect map in next.config

**Files:**
- Modify: `next.config.ts` (extend `redirects()`)

These fire for old-Wix paths (arriving via the domain-level redirect in Task 8) AND protect against stale deep links. All `permanent: true`.

- [ ] **Step 1: Add redirects**

In `next.config.ts`, extend the returned array in `redirects()` (keep the existing `/team` entry):

```typescript
      // --- salvaged paths from old Wix site (horizonsmigration.com) ---
      { source: "/advisers", destination: "/about", permanent: true },
      { source: "/ourteam", destination: "/about", permanent: true },
      { source: "/whyhorizons", destination: "/about", permanent: true },
      { source: "/offices", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/book", permanent: true },
      { source: "/faqs", destination: "/answers", permanent: true },
      { source: "/testimonials", destination: "/success-stories", permanent: true },
      { source: "/testimonial2", destination: "/success-stories", permanent: true },
      { source: "/more-feedbacks", destination: "/success-stories", permanent: true },
      { source: "/photo-gallery", destination: "/success-stories", permanent: true },
      { source: "/fees", destination: "/book", permanent: true },
      { source: "/assessment", destination: "/book", permanent: true },
      { source: "/assessment-consultation-package", destination: "/book", permanent: true },
      { source: "/initial-evaluation-form", destination: "/book", permanent: true },
      { source: "/initial", destination: "/book", permanent: true },
      { source: "/hnz-partner-schools", destination: "/partner-schools", permanent: true },
      { source: "/study-nz", destination: "/how-it-works", permanent: true },
      { source: "/studentvisareq", destination: "/how-it-works", permanent: true },
      { source: "/life-in-new-zealand", destination: "/how-it-works", permanent: true },
      { source: "/immigration-services", destination: "/how-it-works", permanent: true },
      { source: "/types-of-visas", destination: "/how-it-works", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/copy-of-home", destination: "/", permanent: true },
      // Canada/Australia legacy promo pages
      { source: "/canada-ebook", destination: "/ca", permanent: true },
      { source: "/ca-promo", destination: "/ca", permanent: true },
      { source: "/promo-canada", destination: "/ca", permanent: true },
      { source: "/canada-webinar", destination: "/ca", permanent: true },
      { source: "/ca-webinar", destination: "/ca", permanent: true },
      { source: "/cad-promo", destination: "/ca", permanent: true },
      { source: "/cad-webinar", destination: "/ca", permanent: true },
      { source: "/aus-assessment-promo", destination: "/au", permanent: true },
      { source: "/ausstudentvisareq", destination: "/au", permanent: true },
      { source: "/aus-bank-promo", destination: "/au", permanent: true },
      // healthcare/nurse promos → how-it-works (no dedicated page yet)
      { source: "/nurse", destination: "/how-it-works", permanent: true },
      { source: "/nursetool", destination: "/how-it-works", permanent: true },
      { source: "/healthprofessionals", destination: "/how-it-works", permanent: true },
      { source: "/healthcareprofessionals", destination: "/how-it-works", permanent: true },
      { source: "/nz-hca", destination: "/how-it-works", permanent: true },
```

(Anything not listed will 404 on the new domain — acceptable for dead promo/payment pages.)

- [ ] **Step 2: Verify**

Run: `npm run dev` then:
```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/advisers
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/faqs
```
Expected: `308 http://localhost:3000/about` and `308 http://localhost:3000/answers`.

- [ ] **Step 3: Build check + commit**

Run: `npm run build` → succeeds.

```bash
git add next.config.ts
git commit -m "feat(seo): redirect map for legacy Wix-site paths ahead of domain consolidation"
```

---

### Task 8: Domain cutover (guided, human steps — BLOCKED until Joey renews the domain)

**Pre-conditions (Joey):** domain renewed at Network Solutions (expires 2026-08-21!); confirmed who uses @horizonsmigration.com email.

- [ ] **Step 1: Add old domain to Vercel (guided)**

Vercel dashboard → Horizons project → Settings → Domains → add `horizonsmigration.com` and `www.horizonsmigration.com` → set both to **Redirect to** `www.horizonsimmigration.com` (permanent 308). Vercel shows the required DNS records (A `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for www — use whatever values Vercel displays).

- [ ] **Step 2: Repoint web DNS in Wix (guided)**

Wix dashboard → Domains → horizonsmigration.com → Manage DNS records: set apex A record and www CNAME to the values from Step 1. **Do not touch MX or TXT records** (live Google Workspace email).

- [ ] **Step 3: Verify cutover**

After DNS propagation (~1h):
```bash
curl -sI "https://www.horizonsmigration.com/advisers" | head -3
```
Expected: `HTTP/2 308` with `location: https://www.horizonsimmigration.com/advisers` (which then 308s to `/about`). Email check: Joey sends a test mail to an @horizonsmigration.com address → arrives.

- [ ] **Step 4: GSC Change of Address (guided)**

In GSC: add `horizonsmigration.com` as a property (Domain property needs a DNS TXT record via Wix DNS — allowed, TXT for verification doesn't affect mail; or use URL-prefix + the fact it now redirects — if verification is impossible because the site redirects, use the DNS TXT method). Then old property → Settings → Change of Address → select the new property → submit.

---

### Task 9: SEOStrategy.md update

**Files:**
- Modify: `SEOStrategy.md`

- [ ] **Step 1: Apply edits**

1. In `## Phasing`, change Phase 1 line to past tense and mark Phase 2: `**Phase 2 (current, started 2026-07-25):** ...` and add to the Phase 2 bullet: `Run via the /horizons-seo skill (one content cycle per run; keyword map in docs/research/keyword-map.md).`
2. In `## Writing Conventions`, add:
   ```markdown
   - **Citations are mandatory:** every visa fact, fee, or requirement links to the exact page on immigration.govt.nz / iaa.govt.nz that backs it (not the homepage). Applies to Q&As, blogs, and success stories.
   ```
3. Fix the domain typo: replace `horizonsmigration.com` with `horizonsimmigration.com` in the Content Channels section (line ~23).
4. In `## Deferred / Future Decisions`, remove the "Google Search Console — recommend connecting" line (done in Task 1).

- [ ] **Step 2: Commit**

```bash
git add SEOStrategy.md
git commit -m "docs(seo): mark Phase 2 active, add citation convention, fix domain typo"
```

---

## Task order & dependencies

1 (GSC tag) → deploy → anything. 2, 3, 4, 5, 7, 9 are independent of each other; do in numeric order. 6 requires Task 1 verified. 8 is blocked on Joey (renewal + email answer) and requires 7 deployed first.
