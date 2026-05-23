# About Page + Regulator Trust + Partner Schools — Design Spec

**Date:** 2026-05-23
**Status:** Approved, pending implementation plan
**Scope:** One design, shipped together. AU/CA partner-schools pages and per-school detail pages deferred.

---

## Goals

Add three things that work together as a single trust-and-credibility surface:

1. **`/about` page** — company-level story (founder + mission + stats + regulators + team teaser) that prospects click when vetting whether Horizons is legitimate.
2. **Regulator trust signals** — dedicated section on `/about` showing all three regulators (IAA / MARA / CICC) with verify-links, plus a per-country regulator badge in the site-wide Footer.
3. **`/partner-schools` page** — Sanity-managed grid of NZ partner educational institutions, supporting the education-first pathway thesis. AU/CA routes deferred until those partnerships are confirmed.

---

## Non-goals (deliberately deferred)

- AU/CA partner-schools pages (`/au/partner-schools`, `/ca/partner-schools`). Schema supports them; routes added when partnerships are confirmed.
- Individual per-school detail pages (`/partner-schools/[slug]`). Slug field reserved on the schema so this is a zero-migration future add.
- Regulator logos. Text-only treatment for v1 to dodge per-regulator brand-asset usage rules (MARA in particular has strict requirements).
- Splitting `/team` into per-country pages. Pre-existing problem (team is currently NZ-only-hardcoded). Not introduced by this work; addressed separately.
- Sanity-managed About copy. Hardcoded in the page file for v1, like `/team`. Can be migrated later if copy editing becomes frequent.

---

## Architecture

### Routes

| Route | Type | Country |
|---|---|---|
| `/about` | Global, hardcoded `.tsx` | All |
| `/partner-schools` | Global, Sanity-driven | NZ-filtered for v1 |

NZ-default-route convention matches existing `/team`, `/blog`, `/answers`, `/how-it-works`.

### Navigation

- **NZ nav** — add "About" between "Home" and "How It Works"
- **AU nav** — add "About" in same slot
- **CA nav** — unchanged (shell only)
- **Partner Schools** — NOT in top nav (keeps the booking funnel narrow). Linked from About page + Footer Quick Links column.

### Footer

- New "Regulated by [Regulator]  ·  Verify our [advisers|agents|consultants] →" row inserted above the existing legal-links row (privacy / terms / IAA code of conduct).
- Row swaps per country using the same cookie-based mechanism Footer already uses for `config.email` / `config.phone`.
- New Footer Quick Link to `/partner-schools` in the existing Quick Links column (commented out until launch gate #3 passes).

### Launch gating (decoupled from page launch)

Routes can ship to production without being in Nav (route exists, no public entry point). Entry-point links are gated separately so we can merge the structure now, fill content async, and ship entry points in a tiny follow-up commit.

- About → added to Nav only after real founder copy + mission + stats are filled in
- Partner Schools → uncommented in Footer only after ≥3 real NZ schools are published in Sanity

---

## About page (`app/about/page.tsx`)

Hardcoded server component, follows `app/team/page.tsx` pattern exactly. Six sections, alternating dark/light bands.

| # | Section | Background | Notes |
|---|---|---|---|
| 1 | Hero with mission | `bg-brand-900` (dark) | Eyebrow tag, H1 mission, subhead mentioning NZ + AU + CA |
| 2 | Founder (Rowel) | `bg-[#FAFAFA]` | Reuses Team page founder-card pattern. Image left, copy right. 3-4 paragraphs. IAA license badge. Image: `/public/images/Team/rowel-mercado.webp` |
| 3 | By-the-numbers stats | `bg-white` | 3-column stat grid. Initial values: `6,500+ families`, `15+ years operating` (TODO: confirm), `3 countries served` |
| 4 | Regulated by | `bg-brand-900` (dark) | Eyebrow, H2, short paragraph on why regulation matters, then 3-card grid of regulators |
| 5 | Team teaser | `bg-[#FAFAFA]` | Mini-grid of 3-4 team headshots (Rowel + others from existing Team data file). CTA → `/team` |
| 6 | Final CTA | `bg-brand-900` (dark) | Mirrors existing pattern from Team / How-It-Works. Button → `/how-it-works#step-1` |

### Regulated-by card content (Section 4)

| Country | Regulator | URL | Verify label |
|---|---|---|---|
| New Zealand | **IAA** (Immigration Advisers Authority of New Zealand) | `https://www.iaa.govt.nz` | "Verify our advisers →" |
| Australia | **MARA** (Office of the Migration Agents Registration Authority) | `https://www.mara.gov.au` | "Verify our agents →" |
| Canada | **CICC** (College of Immigration and Citizenship Consultants) | `https://college-ic.ca` | "Verify our consultants →" |

`verifyUrl` field on each regulator points to the regulator's adviser-search page where possible. Implementation plan will identify the exact deep-link per regulator.

### Metadata

```ts
{
  title: "About Us | Horizons Immigration",
  description: "Founded by Rowel Mercado, Horizons Immigration has helped 6,500+ families migrate to New Zealand, Australia, and Canada. Regulated by IAA, MARA, and CICC.",
  alternates: { canonical: "/about" },
}
```

### Content sourcing

Hardcoded in the `.tsx` file as TypeScript constants — matches `app/team/page.tsx`. Edits = code change + deploy (acceptable cadence for an About page).

---

## Partner Schools page (`app/partner-schools/page.tsx`)

Server component, Sanity-driven, ISR.

### Sanity schema (`sanity/schemas/partnerSchool.ts`)

```ts
{
  name: "partnerSchool",
  fields: [
    name: string (required),
    slug: slug (required, source: name),       // reserved for future detail pages
    country: string (required, enum: 'nz' | 'au' | 'ca'),
    city: string,                              // e.g. "Auckland"
    logo: image (required, with alt text),
    website: url (required),
    blurb: text (1-2 lines, ~120 char soft limit),
    order: number,                             // manual sort, lower = earlier
    isActive: boolean (default true),          // lets you draft without publishing
  ]
}
```

Add to `sanity/schemas/index.ts`. New GROQ query in `lib/sanity.ts`:

```ts
getPartnerSchools(country: Country): Promise<PartnerSchool[]>
// *[_type == "partnerSchool" && country == $country && isActive == true]
// | order(order asc, name asc)
```

### Page structure

| # | Section | Background | Notes |
|---|---|---|---|
| 1 | Hero | `bg-brand-900` (dark) | Eyebrow "OUR PARTNER SCHOOLS", H1, subhead drawn from Joey's copy: *"Horizons Immigration Consulting has years of successful partnerships with educational institutions. These are our highly valued partners, who can and will deliver your educational needs."* |
| 2 | Schools grid | `bg-[#FAFAFA]` | Responsive grid: 1 → 2 → 3 cols. Cards: logo (`object-contain`, ~120px fixed height), name, city tag, blurb, "Visit school →" link (`target="_blank"` + `rel="noopener noreferrer"`). Empty-state if no schools returned. |
| 3 | Why partner schools matter | `bg-white` | 2-3 sentences tying partner schools to education-first pathway and stronger visa applications. |
| 4 | Final CTA | `bg-brand-900` (dark) | Same pattern as About / Team / How-It-Works. → `/how-it-works#step-1` |

### Empty-state behavior

If `getPartnerSchools('nz')` returns `[]`, the grid section renders: *"Our NZ partner schools will be listed here shortly."* Page does not 404 — the structure stays visible.

### Metadata

```ts
{
  title: "Partner Schools | Horizons Immigration",
  description: "The educational institutions Horizons Immigration partners with to help Filipinos build a future through study-to-residence pathways in New Zealand.",
  alternates: { canonical: "/partner-schools" },
}
```

### Studio seed

1-2 example schools created with `isActive: false` so the Sanity Studio UI has a reference shape — but nothing renders on the live page.

---

## Footer regulator section

### `lib/config.ts` — extend country config

Add a `regulator` block to each country in `countryConfig`:

```ts
regulator: {
  shortName: "IAA",  // or "MARA" | "CICC"
  fullName: "Immigration Advisers Authority of New Zealand",
  country: "New Zealand",
  url: "https://www.iaa.govt.nz",
  verifyUrl: string,        // deep-link to regulator's adviser-search page
  verifyLabel: "Verify our advisers →",
}
```

### Footer markup (`components/layout/Footer.tsx`)

New row inserted between the existing 4-column grid block and the existing legal-links row (privacy / terms / IAA code of conduct):

```
+---------------------------------------------------------------+
| Regulated by  [Regulator name]  ·  Verify our advisers →      |
+---------------------------------------------------------------+
```

- Single line on desktop, stacked on mobile
- `text-sm`, regulator name styled as the verify link
- Subtle top border (`border-t border-accent-800`) above the row
- External link: `target="_blank"`, `rel="noopener noreferrer"`
- Whole row swaps automatically based on country cookie (same `getCountryConfig(country)` call already used in Footer)

### No logos in v1

Text-only treatment. Verifying brand-asset usage rules per regulator (MARA's are strict) is its own scope. Text citation reads as more credible than a marketing badge and avoids legal risk for v1.

---

## Testing

Vitest, alongside source files. Matches existing repo pattern.

| File | Coverage |
|---|---|
| `app/about/__tests__/page.test.tsx` | All 6 sections render; regulator cards have correct verify URLs (IAA/MARA/CICC); CTA link points to `/how-it-works#step-1`; metadata canonical is `/about` |
| `app/partner-schools/__tests__/page.test.tsx` | Renders schools from mocked Sanity query; empty-state fires when `[]`; only `isActive: true` + `country: 'nz'` schools render; external links have `rel="noopener noreferrer"` |
| `lib/__tests__/config.test.ts` | Extended — each country's `regulator` block has required fields (1 test per country) |
| `components/layout/__tests__/Footer.test.tsx` | Footer renders correct regulator name + verify URL based on country cookie value (3 tests, one per country) |

---

## Launch gate

Blocks pushing to main:

1. All tests pass + `npm run build` succeeds
2. About page placeholders replaced with real founder copy, mission line picked, stats confirmed
3. ≥3 real NZ partner schools published in Sanity (with logos)
4. Manual smoke: switch country cookie between nz/au/ca, confirm Footer regulator swaps correctly
5. Manual smoke: visit `/about` and `/partner-schools` on mobile + desktop

Nav additions (About) and Footer Quick Link (Partner Schools) ship as tiny follow-up commits gated on #2 and #3 respectively.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Placeholder copy ships live | Pages are not added to Nav until copy is real. No public entry point until launch gates pass. |
| Wrong regulator verify-URL deep links | Implementation plan identifies exact URLs per regulator; tests assert them. If a regulator's search page URL changes, only one constant changes in `lib/config.ts`. |
| MARA / CICC brand-asset usage violation | Avoided by using text-only treatment in v1. Logos deferred. |
| NZ school list is empty at launch | Empty-state renders a friendly message; page doesn't 404. Footer Quick Link stays commented out until ≥3 schools published. |
| Founder story copy isn't ready | I draft v1 from existing Team page metadata + PRD context; Joey edits before nav-linking. |

---

## Open questions deferred to implementation plan

- Exact verify-URL deep links for IAA / MARA / CICC adviser-search pages
- Final mission-statement copy (I'll propose 2-3 options for Joey to pick from)
- Final stats (years operating in particular — TODO confirm)
- Initial NZ partner school list (Joey provides)
