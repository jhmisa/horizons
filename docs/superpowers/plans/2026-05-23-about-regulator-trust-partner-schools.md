# About Page + Regulator Trust + Partner Schools — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/about`, a per-country regulator row in the Footer, and a Sanity-driven `/partner-schools` grid (NZ-only for v1), with content placeholders that block nav-linking until real copy lands.

**Architecture:** Hardcoded `.tsx` for About (matches `/team` pattern). Sanity schema + GROQ query for Partner Schools. Extend the existing `CountryConfig` flat fields with `regulatorVerifyUrl` + `regulatorVerifyLabel` rather than introducing a nested block (matches existing pattern). Footer reads the country cookie via the existing `getCountryConfig(country)` call.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind v4, Sanity, Vitest, @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-05-23-about-regulator-trust-partner-schools-design.md`

---

## Reference notes for the implementing engineer

- Tests use **Vitest** with `@testing-library/react`. Run via `npm test`. Run a single test file with `npx vitest run <path>`.
- Existing tests sit in `__tests__/` subdirectories next to source (see `components/qa/__tests__/QAJsonLd.test.tsx`).
- Sanity schemas live in `sanity/schemas/`, registered in `sanity/schemas/index.ts` as an object export.
- `lib/sanity.ts` exports `sanityClient` (CDN, `published` perspective) — use this for read queries.
- Per-country logic in Footer/Navbar reads from a `country` cookie. The existing helper is `getCountryConfig(country)` from `lib/config.ts`.
- **Regulator data already partially exists** in `CountryConfig` (`regulatorName`, `regulatorAbbr`, `regulatorUrl`). We're adding `regulatorVerifyUrl` and `regulatorVerifyLabel`.
- AU's `regulatorAbbr` is `"OMARA"` (the formal name); we'll display this as-is in the footer.
- Founder image is at `/public/images/Team/rowel-mercado.webp`. Other team headshots live in the same directory.
- Use `TODO(joey): ...` comments to flag placeholder content that must be replaced before nav-linking.

---

## File structure

**Create:**
- `sanity/schemas/partnerSchool.ts` — Sanity schema
- `app/about/page.tsx` — About page (server component, hardcoded copy)
- `app/about/__tests__/page.test.tsx` — About page tests
- `app/partner-schools/page.tsx` — Partner Schools page (server component, Sanity-driven)
- `app/partner-schools/__tests__/page.test.tsx` — Partner Schools tests
- `lib/__tests__/config.test.ts` — Config tests (new file)
- `components/layout/__tests__/Footer.test.tsx` — Footer tests (new file)
- `lib/partnerSchools.ts` — `getPartnerSchools()` query + `PartnerSchool` type

**Modify:**
- `sanity/schemas/index.ts` — register `partnerSchool`
- `lib/config.ts` — add `regulatorVerifyUrl` + `regulatorVerifyLabel` to `CountryConfig` and all three country configs
- `components/layout/Footer.tsx` — insert "Regulated by" row above bottom bar, add commented-out Partner Schools Quick Link
- `app/sitemap.ts` — add `/about` and `/partner-schools`

**Out of scope for this plan (separate follow-up commits after content lands):**
- Adding "About" to NZ + AU Navbars
- Uncommenting Partner Schools Footer Quick Link
- Splitting `/team` into per-country pages

---

## Task 1: Extend CountryConfig with regulator verify fields

**Files:**
- Modify: `lib/config.ts`
- Create: `lib/__tests__/config.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { COUNTRIES, getCountryConfig } from "../config";

describe("CountryConfig regulator verify fields", () => {
  it.each(COUNTRIES)("country %s has regulatorVerifyUrl and regulatorVerifyLabel", (country) => {
    const config = getCountryConfig(country);
    expect(config.regulatorVerifyUrl).toMatch(/^https:\/\//);
    expect(config.regulatorVerifyLabel).toMatch(/^Verify our /);
  });

  it("NZ uses IAA register search", () => {
    expect(getCountryConfig("nz").regulatorVerifyUrl).toContain("iaa.govt.nz");
  });

  it("AU uses MARA register search", () => {
    expect(getCountryConfig("au").regulatorVerifyUrl).toContain("mara.gov.au");
  });

  it("CA uses CICC register search", () => {
    expect(getCountryConfig("ca").regulatorVerifyUrl).toContain("college-ic.ca");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
npx vitest run lib/__tests__/config.test.ts
```

Expected: FAIL — `regulatorVerifyUrl` and `regulatorVerifyLabel` undefined on `CountryConfig`.

- [ ] **Step 3: Extend the CountryConfig interface**

In `lib/config.ts`, add two fields to the `CountryConfig` interface (after `regulatorUrl`, around line 40):

```ts
  /** Public URL of the regulator (for future links from Footer / legal pages). */
  regulatorUrl: string;
  /** Deep-link to the regulator's adviser-search page so prospects can verify license status. */
  regulatorVerifyUrl: string;
  /** Footer label that links to the verify page, e.g. "Verify our advisers". */
  regulatorVerifyLabel: string;
```

- [ ] **Step 4: Add field values to all three country configs**

In `lib/config.ts`, add the two new fields to each entry in `countryConfig`:

For NZ (add after `regulatorUrl: "https://www.iaa.govt.nz",` line):

```ts
    regulatorVerifyUrl: "https://www.iaa.govt.nz/for-people-needing-advice/find-a-licensed-immigration-adviser/",
    regulatorVerifyLabel: "Verify our advisers",
```

For AU (add after `regulatorUrl: "https://www.mara.gov.au",` line):

```ts
    regulatorVerifyUrl: "https://www.mara.gov.au/search-the-register-of-migration-agents",
    regulatorVerifyLabel: "Verify our agents",
```

For CA (add after `regulatorUrl: "https://college-ic.ca",` line):

```ts
    regulatorVerifyUrl: "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant?l=en-US",
    regulatorVerifyLabel: "Verify our consultants",
```

- [ ] **Step 5: Run the test and verify it passes**

```bash
npx vitest run lib/__tests__/config.test.ts
```

Expected: PASS — all 4 tests green.

- [ ] **Step 6: Run typecheck and full test suite**

```bash
npm run lint && npm test
```

Expected: no new errors. (Pre-existing test failures unrelated to this work are acceptable; flag them to Joey but do not fix here.)

- [ ] **Step 7: Commit**

```bash
git add lib/config.ts lib/__tests__/config.test.ts
git commit -m "feat(config): add regulator verify URLs and labels per country"
```

---

## Task 2: Add Partner Schools Sanity schema

**Files:**
- Create: `sanity/schemas/partnerSchool.ts`
- Modify: `sanity/schemas/index.ts`

- [ ] **Step 1: Create the schema file**

Create `sanity/schemas/partnerSchool.ts`:

```ts
import { defineField, defineType } from "sanity";

export const partnerSchool = defineType({
  name: "partnerSchool",
  title: "Partner School",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "School name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Reserved for future per-school detail pages.",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      options: {
        list: [
          { title: "New Zealand", value: "nz" },
          { title: "Australia", value: "au" },
          { title: "Canada", value: "ca" },
        ],
        layout: "radio",
      },
      initialValue: "nz",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      description: "e.g. Auckland, Sydney, Toronto",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      title: "School website",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "blurb",
      title: "Short blurb",
      description: "1-2 lines, ~120 characters. Shows on the school card.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      description: "Lower numbers appear first. Default 100.",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      description: "Uncheck to draft a school without publishing it on the site.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "city",
      media: "logo",
    },
  },
});
```

- [ ] **Step 2: Register the schema**

In `sanity/schemas/index.ts`, add the import and include in `schemaTypes`:

```ts
import { googleReview } from "./googleReview";
import { interestSubmission } from "./interestSubmission";
import { lia } from "./lia";
import { partnerSchool } from "./partnerSchool";
import { post } from "./post";
import { qa } from "./qa";
import { submittedQuestion } from "./submittedQuestion";
import { successStory } from "./successStory";

export const schemaTypes = [
  lia,
  qa,
  post,
  successStory,
  partnerSchool,
  googleReview,
  submittedQuestion,
  interestSubmission,
];
```

- [ ] **Step 3: Verify build still succeeds**

```bash
npm run build
```

Expected: build succeeds. (Sanity Studio will show "Partner School" in its sidebar after deploy or next `npm run dev` of `/studio`.)

- [ ] **Step 4: Commit**

```bash
git add sanity/schemas/partnerSchool.ts sanity/schemas/index.ts
git commit -m "feat(sanity): add partnerSchool schema"
```

---

## Task 3: Add getPartnerSchools query + types

**Files:**
- Create: `lib/partnerSchools.ts`

- [ ] **Step 1: Create the query module with types**

Create `lib/partnerSchools.ts`:

```ts
import { sanityClient } from "./sanity";
import type { Country } from "./config";

export interface PartnerSchool {
  _id: string;
  name: string;
  slug: string;
  country: Country;
  city: string | null;
  logoUrl: string;
  logoAlt: string;
  website: string;
  blurb: string;
  order: number;
}

const partnerSchoolsQuery = `
*[_type == "partnerSchool" && country == $country && isActive == true]
| order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  country,
  city,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  website,
  blurb,
  order
}
`;

export async function getPartnerSchools(country: Country): Promise<PartnerSchool[]> {
  return sanityClient.fetch<PartnerSchool[]>(partnerSchoolsQuery, { country });
}
```

- [ ] **Step 2: Verify typecheck succeeds**

```bash
npm run lint
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/partnerSchools.ts
git commit -m "feat(sanity): add getPartnerSchools query"
```

---

## Task 4: Footer "Regulated by" row tests

**Files:**
- Create: `components/layout/__tests__/Footer.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/layout/__tests__/Footer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Footer from "../Footer";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

function mockCountryCookie(value: string | undefined) {
  (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({
    get: (name: string) =>
      name === "country" && value ? { name: "country", value } : undefined,
  });
}

describe("Footer regulator row", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows IAA + 'Verify our advisers' for NZ", async () => {
    mockCountryCookie("nz");
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/Regulated by/i)).toBeInTheDocument();
    expect(screen.getByText(/IAA/)).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify our advisers/i,
    });
    expect(verifyLink).toHaveAttribute("href", expect.stringContaining("iaa.govt.nz"));
    expect(verifyLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(verifyLink).toHaveAttribute("target", "_blank");
  });

  it("shows OMARA + 'Verify our agents' for AU", async () => {
    mockCountryCookie("au");
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/OMARA/)).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify our agents/i,
    });
    expect(verifyLink).toHaveAttribute("href", expect.stringContaining("mara.gov.au"));
  });

  it("shows CICC + 'Verify our consultants' for CA", async () => {
    mockCountryCookie("ca");
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/CICC/)).toBeInTheDocument();
    const verifyLink = screen.getByRole("link", {
      name: /Verify our consultants/i,
    });
    expect(verifyLink).toHaveAttribute("href", expect.stringContaining("college-ic.ca"));
  });

  it("defaults to NZ when country cookie missing", async () => {
    mockCountryCookie(undefined);
    const ui = await Footer();
    render(ui);
    expect(screen.getByText(/IAA/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
npx vitest run components/layout/__tests__/Footer.test.tsx
```

Expected: FAIL — no "Regulated by" text in Footer yet.

---

## Task 5: Implement Footer "Regulated by" row + Partner Schools quick link

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Insert the Regulated By row above the Bottom Bar**

In `components/layout/Footer.tsx`, find the closing `</div>` of the 4-column grid (currently line 191, the `</div>` that closes `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">`).

After that closing `</div>` and BEFORE the `{/* Bottom Bar */}` comment, insert this block:

```tsx
        {/* Regulated By Row */}
        <div className="border-t border-accent-800 pt-6 pb-2 text-sm text-accent-300 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-3 text-center">
          <span>
            Regulated by{" "}
            <span className="font-semibold text-white">
              {config.regulatorAbbr}
            </span>
          </span>
          <span className="hidden sm:inline text-accent-500" aria-hidden="true">
            ·
          </span>
          <a
            href={config.regulatorVerifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-400 transition-colors inline-flex items-center gap-1"
          >
            {config.regulatorVerifyLabel}
            <i
              className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"
              aria-hidden="true"
            />
          </a>
        </div>

```

- [ ] **Step 2: Add commented-out Partner Schools Quick Link**

In `components/layout/Footer.tsx`, in the "Explore" column's `<ul>` (currently around lines 81-119), add a commented-out `<li>` at the END of the list (after the Blog link). The comment must include the launch-gate condition so a future reviewer understands why it's off:

```tsx
              <li>
                <Link
                  href="/blog"
                  className="hover:text-brand-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              {/*
                TODO(joey): Uncomment after publishing ≥3 NZ partner schools in Sanity.
                <li>
                  <Link href="/partner-schools" className="hover:text-brand-400 transition-colors">
                    Partner Schools
                  </Link>
                </li>
              */}
```

- [ ] **Step 3: Run the Footer tests and verify they pass**

```bash
npx vitest run components/layout/__tests__/Footer.test.tsx
```

Expected: PASS — all 4 tests green.

- [ ] **Step 4: Run the full test suite**

```bash
npm test
```

Expected: no new failures.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx components/layout/__tests__/Footer.test.tsx
git commit -m "feat(footer): add per-country regulator row + reserve partner-schools link"
```

---

## Task 6: About page tests

**Files:**
- Create: `app/about/__tests__/page.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/about/__tests__/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage, { metadata } from "../page";

describe("AboutPage", () => {
  it("renders the hero section", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Horizons|future|licensed/i }),
    ).toBeInTheDocument();
  });

  it("renders the founder section with Rowel and his IAA license", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Rowel Mercado/)).toBeInTheDocument();
    expect(screen.getByText(/200900577/)).toBeInTheDocument();
  });

  it("renders the by-the-numbers stats", () => {
    render(<AboutPage />);
    expect(screen.getByText(/6,500\+/)).toBeInTheDocument();
    expect(screen.getByText(/families/i)).toBeInTheDocument();
    expect(screen.getByText(/countries/i)).toBeInTheDocument();
  });

  it("renders the Regulated By section with all three regulators", () => {
    render(<AboutPage />);
    const iaaLink = screen.getByRole("link", { name: /IAA|Immigration Advisers Authority/i });
    const maraLink = screen.getByRole("link", { name: /MARA|OMARA|Migration Agents/i });
    const ciccLink = screen.getByRole("link", { name: /CICC|College of Immigration/i });
    expect(iaaLink).toHaveAttribute("href", expect.stringContaining("iaa.govt.nz"));
    expect(maraLink).toHaveAttribute("href", expect.stringContaining("mara.gov.au"));
    expect(ciccLink).toHaveAttribute("href", expect.stringContaining("college-ic.ca"));
    [iaaLink, maraLink, ciccLink].forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders a team teaser linking to /team", () => {
    render(<AboutPage />);
    const teamLink = screen.getByRole("link", { name: /Meet|team/i });
    expect(teamLink).toHaveAttribute("href", "/team");
  });

  it("renders a final CTA linking to /how-it-works#step-1", () => {
    render(<AboutPage />);
    const cta = screen.getByRole("link", { name: /Watch the Masterclass/i });
    expect(cta).toHaveAttribute("href", "/how-it-works#step-1");
  });

  it("exports correct metadata", () => {
    expect(metadata.title).toBe("About Us | Horizons Immigration");
    expect(metadata.alternates?.canonical).toBe("/about");
    expect(metadata.description).toMatch(/Rowel|Horizons|families/);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
npx vitest run app/about/__tests__/page.test.tsx
```

Expected: FAIL — `app/about/page.tsx` does not exist.

---

## Task 7: About page implementation

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create the About page**

Create `app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Horizons Immigration",
  description:
    "Founded by Rowel Mercado, Horizons Immigration has helped 6,500+ families migrate to New Zealand, Australia, and Canada. Regulated by IAA, MARA, and CICC.",
  alternates: { canonical: "/about" },
};

// TODO(joey): Replace placeholder copy below before adding About to the Nav.
// Items flagged with TODO(joey) need real content from Joey:
//   - Mission line in the hero
//   - Founder story paragraphs (3-4 short paragraphs)
//   - "years operating" stat — placeholder is 15+
const MISSION_LINE = "Helping Filipinos build their future, the licensed way.";
const MISSION_SUBHEAD =
  "For two decades, Horizons Immigration has guided families to New Zealand, Australia, and Canada — with honest advice, a clear plan, and only licensed advisers.";

// TODO(joey): rewrite founder paragraphs in Rowel's voice.
const FOUNDER_PARAGRAPHS: readonly string[] = [
  "Rowel Mercado founded Horizons Immigration in 2005 with one conviction: Filipino families deserve honest, licensed immigration advice — not the shortcuts and false promises that have hurt so many.",
  "As a Licensed Immigration Adviser (IAA Licence No. 200900577) and the founder of one of the largest Filipino-led immigration practices in New Zealand, Rowel built Horizons around a simple principle: every adviser on the team is licensed and accountable to a real regulator.",
  "Today the team helps families pursue residence pathways across three countries — New Zealand, Australia, and Canada — with education-first strategies that turn study into a long-term future.",
];

const STATS = [
  {
    value: "6,500+",
    label: "Families helped",
    context: "across NZ, AU, and CA",
  },
  {
    value: "20+",
    label: "Years operating",
    context: "founded in 2005",
  },
  {
    value: "3",
    label: "Countries served",
    context: "NZ · AU · CA",
  },
] as const;

const REGULATORS = [
  {
    abbr: "IAA",
    fullName: "Immigration Advisers Authority",
    country: "New Zealand",
    url: "https://www.iaa.govt.nz",
    verifyUrl:
      "https://www.iaa.govt.nz/for-people-needing-advice/find-a-licensed-immigration-adviser/",
    verifyLabel: "Verify our advisers",
    blurb:
      "The NZ government regulator that licenses immigration advisers and enforces their code of conduct.",
  },
  {
    abbr: "MARA",
    fullName: "Office of the Migration Agents Registration Authority",
    country: "Australia",
    url: "https://www.mara.gov.au",
    verifyUrl: "https://www.mara.gov.au/search-the-register-of-migration-agents",
    verifyLabel: "Verify our agents",
    blurb:
      "Australia's federal regulator for Registered Migration Agents, with a public register of every licensed agent.",
  },
  {
    abbr: "CICC",
    fullName: "College of Immigration and Citizenship Consultants",
    country: "Canada",
    url: "https://college-ic.ca",
    verifyUrl:
      "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant?l=en-US",
    verifyLabel: "Verify our consultants",
    blurb:
      "Canada's national regulator for Regulated Canadian Immigration Consultants (RCICs).",
  },
] as const;

const TEAM_TEASER = [
  {
    name: "Rowel Mercado",
    role: "Founder & Principal LIA",
    image: "/images/Team/rowel-mercado.webp",
  },
  {
    name: "Jocelyn Ocampo",
    role: "Licensed Immigration Adviser",
    image: "/images/Team/jocelyn-ocampo.webp",
  },
  {
    name: "Lorna Caluag",
    role: "Licensed Immigration Adviser",
    image: "/images/Team/lorna-caluag.webp",
  },
  {
    name: "Trinity Lee",
    role: "Licensed Immigration Adviser",
    image: "/images/Team/trinity-lee.webp",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            ABOUT HORIZONS IMMIGRATION
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            {MISSION_LINE}
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            {MISSION_SUBHEAD}
          </p>
        </div>
      </header>

      {/* 2. Founder */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase">
              Our Founder
            </span>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 h-80 md:h-auto overflow-hidden bg-slate-100">
              <img
                src="/images/Team/rowel-mercado.webp"
                alt="Rowel Mercado — Founder & Principal Licensed Immigration Adviser"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                Rowel Mercado
              </h2>
              <p className="text-brand-600 font-semibold text-lg mb-6">
                Founder &amp; Principal Licensed Immigration Adviser
              </p>
              <div className="space-y-4 text-slate-700 leading-relaxed mb-6">
                {FOUNDER_PARAGRAPHS.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 self-start py-1.5 px-3 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                IAA Licence No. 200900577
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. By-the-numbers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              By the numbers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Twenty years of helping families move forward
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center"
              >
                <div className="text-5xl font-extrabold text-brand-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500">{stat.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Regulated By */}
      <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6">
              REGULATED &amp; ACCOUNTABLE
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Verified by the immigration regulators in every country we serve
            </h2>
            <p className="text-brand-100 max-w-2xl mx-auto">
              Immigration is a regulated profession. Unlicensed &quot;agents&quot;
              cost families their savings and their dreams. Every Horizons
              adviser is licensed by the regulator in the country they advise on —
              verify any of them below.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REGULATORS.map((reg) => (
              <div
                key={reg.abbr}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col"
              >
                <div className="text-3xl font-extrabold text-white mb-1">
                  {reg.abbr}
                </div>
                <div className="text-sm text-brand-200 mb-3">
                  {reg.country}
                </div>
                <p className="text-sm text-brand-100 mb-6 flex-grow">
                  {reg.blurb}
                </p>
                <a
                  href={reg.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${reg.verifyLabel} on the ${reg.fullName} register`}
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-brand-300 transition-colors"
                >
                  {reg.verifyLabel}
                  <i
                    className="fa-solid fa-arrow-up-right-from-square text-xs"
                    aria-hidden="true"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team teaser */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              The team
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              The people behind your journey
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {TEAM_TEASER.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 bg-white text-brand-900 hover:bg-brand-50 font-bold py-3 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-200"
            >
              Meet the full team
              <i className="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 bg-brand-900 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Watch the free masterclass — see how the process works before you
            book a paid consultation.
          </p>
          <Link
            href="/how-it-works#step-1"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Watch the Masterclass &mdash; Free
          </Link>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run About page tests and verify they pass**

```bash
npx vitest run app/about/__tests__/page.test.tsx
```

Expected: PASS — all 7 tests green.

- [ ] **Step 3: Build to confirm no Next.js errors**

```bash
npm run build
```

Expected: build succeeds with `/about` listed in the route output.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/about/__tests__/page.test.tsx
git commit -m "feat(about): add /about page with founder, stats, regulators, team teaser"
```

---

## Task 8: Partner Schools page tests

**Files:**
- Create: `app/partner-schools/__tests__/page.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/partner-schools/__tests__/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PartnerSchool } from "@/lib/partnerSchools";

vi.mock("@/lib/partnerSchools", () => ({
  getPartnerSchools: vi.fn(),
}));

import { getPartnerSchools } from "@/lib/partnerSchools";
import PartnerSchoolsPage, { metadata } from "../page";

const mockSchool = (overrides: Partial<PartnerSchool> = {}): PartnerSchool => ({
  _id: "school-1",
  name: "Auckland University of Technology",
  slug: "auckland-university-of-technology",
  country: "nz",
  city: "Auckland",
  logoUrl: "https://cdn.sanity.io/aut-logo.png",
  logoAlt: "AUT logo",
  website: "https://www.aut.ac.nz",
  blurb: "World-class research university with strong pathways for international students.",
  order: 10,
  ...overrides,
});

describe("PartnerSchoolsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero section", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    expect(
      screen.getByRole("heading", { level: 1, name: /partner schools|educational/i }),
    ).toBeInTheDocument();
  });

  it("renders a card per school returned by Sanity", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([
      mockSchool({ _id: "a", name: "School A", slug: "school-a" }),
      mockSchool({ _id: "b", name: "School B", slug: "school-b" }),
    ]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    expect(screen.getByText("School A")).toBeInTheDocument();
    expect(screen.getByText("School B")).toBeInTheDocument();
  });

  it("school cards link to the school website with safe external attributes", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([
      mockSchool({ website: "https://example-school.ac.nz" }),
    ]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    const visitLink = screen.getByRole("link", { name: /visit school/i });
    expect(visitLink).toHaveAttribute("href", "https://example-school.ac.nz");
    expect(visitLink).toHaveAttribute("target", "_blank");
    expect(visitLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the empty state when no schools are returned", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    expect(
      screen.getByText(/partner schools will be listed here shortly/i),
    ).toBeInTheDocument();
  });

  it("filters by NZ (passes 'nz' to getPartnerSchools)", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    await PartnerSchoolsPage();
    expect(getPartnerSchools).toHaveBeenCalledWith("nz");
  });

  it("renders the final CTA linking to /how-it-works#step-1", async () => {
    (getPartnerSchools as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ui = await PartnerSchoolsPage();
    render(ui);
    const cta = screen.getByRole("link", { name: /Watch the Masterclass/i });
    expect(cta).toHaveAttribute("href", "/how-it-works#step-1");
  });

  it("exports correct metadata", () => {
    expect(metadata.title).toBe("Partner Schools | Horizons Immigration");
    expect(metadata.alternates?.canonical).toBe("/partner-schools");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
npx vitest run app/partner-schools/__tests__/page.test.tsx
```

Expected: FAIL — `app/partner-schools/page.tsx` does not exist.

---

## Task 9: Partner Schools page implementation

**Files:**
- Create: `app/partner-schools/page.tsx`

- [ ] **Step 1: Create the Partner Schools page**

Create `app/partner-schools/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPartnerSchools } from "@/lib/partnerSchools";

export const metadata: Metadata = {
  title: "Partner Schools | Horizons Immigration",
  description:
    "The educational institutions Horizons Immigration partners with to help Filipinos build a future through study-to-residence pathways in New Zealand.",
  alternates: { canonical: "/partner-schools" },
};

// Revalidate hourly so newly published schools show without a redeploy.
export const revalidate = 3600;

const HERO_SUBHEAD =
  "Horizons Immigration Consulting has years of successful partnerships with educational institutions. These are our highly valued partners, who can and will deliver your educational needs.";

export default async function PartnerSchoolsPage() {
  const schools = await getPartnerSchools("nz");

  return (
    <>
      {/* 1. Hero */}
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            OUR PARTNER SCHOOLS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Educational institutions we trust to deliver your future
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto fade-in-up delay-200">
            {HERO_SUBHEAD}
          </p>
        </div>
      </header>

      {/* 2. Schools grid */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {schools.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-2xl mx-auto">
              <p className="text-slate-600 text-lg">
                Our NZ partner schools will be listed here shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {schools.map((school) => (
                <article
                  key={school._id}
                  className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-32 bg-white flex items-center justify-center p-6 border-b border-slate-100">
                    <img
                      src={school.logoUrl}
                      alt={school.logoAlt}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      {school.name}
                    </h2>
                    {school.city ? (
                      <span className="inline-flex self-start items-center py-1 px-2.5 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-medium mb-4">
                        {school.city}
                      </span>
                    ) : null}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                      {school.blurb}
                    </p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors text-sm"
                    >
                      Visit school
                      <i
                        className="fa-solid fa-arrow-up-right-from-square text-xs"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Why partner schools matter */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
            Education-first pathway
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            Why we partner with schools
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            For most of our clients, the strongest pathway to permanent
            residence is through education. Studying with a trusted partner
            institution builds a credible visa profile, opens post-study work
            rights, and creates a real path to settling abroad. Our partner
            schools are institutions we trust to deliver on that promise.
          </p>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-24 bg-brand-900 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to start your education pathway?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Watch the free masterclass to see how Horizons matches you with the
            right school for your visa pathway.
          </p>
          <Link
            href="/how-it-works#step-1"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Watch the Masterclass &mdash; Free
          </Link>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run Partner Schools tests and verify they pass**

```bash
npx vitest run app/partner-schools/__tests__/page.test.tsx
```

Expected: PASS — all 7 tests green.

- [ ] **Step 3: Build to confirm no Next.js errors**

```bash
npm run build
```

Expected: build succeeds with `/partner-schools` listed in the route output.

- [ ] **Step 4: Commit**

```bash
git add app/partner-schools/page.tsx app/partner-schools/__tests__/page.test.tsx lib/partnerSchools.ts
git commit -m "feat(partner-schools): add /partner-schools page with Sanity-driven grid"
```

---

## Task 10: Add /about and /partner-schools to the sitemap

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Read the current sitemap to find the insertion point**

```bash
cat app/sitemap.ts
```

Identify the array of routes (looks like an array of objects with `url`, `lastModified`, `changeFrequency`, `priority`).

- [ ] **Step 2: Add the two new routes**

In `app/sitemap.ts`, add two entries to the routes array. Place them alongside the other top-level NZ routes like `/team` and `/how-it-works`. Use the existing entries' shape as a template — match `changeFrequency` and `priority` to whatever sibling routes (`/team`, `/how-it-works`) use.

Example shape (adapt to match the file's actual style — DON'T blindly paste if the existing entries differ):

```ts
{
  url: `${siteUrl}/about`,
  lastModified: new Date(),
  changeFrequency: "yearly",
  priority: 0.7,
},
{
  url: `${siteUrl}/partner-schools`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.6,
},
```

- [ ] **Step 3: Build and verify the sitemap output includes both routes**

```bash
npm run build
```

Then check the generated sitemap. In Next.js App Router, `app/sitemap.ts` is built into a route at `/sitemap.xml`. Either run `npm run start` and `curl http://localhost:3000/sitemap.xml | grep -E "about|partner-schools"` or inspect the built output in `.next/server/app/`.

Expected: both `/about` and `/partner-schools` appear in the sitemap XML.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(seo): add /about and /partner-schools to sitemap"
```

---

## Task 11: Manual smoke test

**Files:** none (manual)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Visit /about and verify all 6 sections render**

Open `http://localhost:3000/about` in the browser. Confirm:
- Hero with mission statement
- Founder section with Rowel's photo + license badge
- Stats (6,500+ / 20+ / 3)
- Regulated By section with 3 cards, each "Verify our X" link opens regulator's site in new tab
- Team teaser grid + "Meet the full team" button → goes to `/team`
- Final CTA → goes to `/how-it-works#step-1`

Also resize to mobile width — layout should stack cleanly.

- [ ] **Step 3: Visit /partner-schools and verify empty state renders**

Open `http://localhost:3000/partner-schools`. Since no schools are published yet, you should see:
- Hero with the partner-schools subhead
- Empty state: "Our NZ partner schools will be listed here shortly."
- "Why we partner with schools" section
- Final CTA

- [ ] **Step 4: Verify Footer regulator row swaps per country**

In the browser DevTools, manually set the `country` cookie and reload to verify the footer text changes:

```js
document.cookie = "country=nz; path=/"   // → "Regulated by IAA · Verify our advisers"
document.cookie = "country=au; path=/"   // → "Regulated by OMARA · Verify our agents"
document.cookie = "country=ca; path=/"   // → "Regulated by CICC · Verify our consultants"
```

Each verify link should open the correct regulator's adviser-search page in a new tab.

- [ ] **Step 5: Verify About and Partner Schools are NOT in the top nav**

Navbar should look unchanged. Footer Quick Links column should NOT show Partner Schools yet (it's commented out — uncomment is part of the launch-gate follow-up commit, not this plan).

- [ ] **Step 6: Add a test partner school in Sanity Studio (optional)**

Open `http://localhost:3000/studio`, create a Partner School with `isActive: true`, country `nz`, and confirm it appears on `/partner-schools` after the ISR window (or `npm run build && npm start` to bypass dev caching).

Then either delete it or set `isActive: false` so the page returns to the empty state before any push.

---

## Task 12: Final pre-merge verification

**Files:** none

- [ ] **Step 1: Run the full test suite**

```bash
npm test
```

Expected: all tests pass. Any pre-existing failures unrelated to this work should be flagged to Joey, not fixed here.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Run a production build**

```bash
npm run build
```

Expected: succeeds. `/about` and `/partner-schools` appear in the route summary.

- [ ] **Step 4: Print the launch-gate checklist for Joey**

The plan does not push to main. Hand off this checklist:

```
Launch gate — must complete before:
  1. Adding "About" to NZ + AU Navbars (separate commit)
  2. Uncommenting Partner Schools link in Footer Explore column (separate commit)

Gate items:
  [ ] Replace TODO(joey) placeholders in app/about/page.tsx:
      - MISSION_LINE (hero h1)
      - MISSION_SUBHEAD
      - FOUNDER_PARAGRAPHS (rewrite in Rowel's voice)
      - Confirm STATS values (especially "20+ years operating" — verify founding year)
  [ ] Publish ≥3 NZ partner schools in Sanity Studio with logos, blurbs, websites
  [ ] Manual smoke on production preview — visit /about + /partner-schools on mobile + desktop
  [ ] Verify each regulator verify-URL still works (URLs occasionally change)
```

---

## Out-of-scope follow-up commits (do NOT include in this plan's PR)

After Joey confirms the launch-gate items above, two tiny commits are needed to make the new pages reachable:

**Follow-up A: Add About to Navbar**
- In `components/layout/Navbar.tsx`, add `{ href: "/about", label: "About" }` to the `innerLinks` arrays for both `nz` and `au` (between "Home" and "How It Works"). CA stays unchanged.

**Follow-up B: Uncomment Partner Schools Footer link**
- In `components/layout/Footer.tsx`, remove the `{/* ... */}` wrapper around the Partner Schools `<li>` in the Explore column.

These are NOT part of this plan's commits because they create public entry points to pages that still have placeholder content.

---

## Self-review

**Spec coverage:**
- ✅ `/about` page with 6 sections — Tasks 6-7
- ✅ Regulator trust section on About — Task 7 (REGULATORS array, Section 4)
- ✅ Per-country Footer regulator row — Tasks 4-5
- ✅ `/partner-schools` page (NZ-only, Sanity-driven) — Tasks 2-3, 8-9
- ✅ Sanity `partnerSchool` schema — Task 2
- ✅ Tests for all four areas (config, footer, about, partner-schools) — Tasks 1, 4, 6, 8
- ✅ Sitemap — Task 10
- ✅ Launch-gate decoupling (no Nav/Footer entry points yet) — documented in Task 11 + out-of-scope section
- ✅ Placeholder strategy — TODO(joey) markers in About page

**Plan deviations from spec:**
- Spec described a nested `regulator` block on `CountryConfig`. Existing code uses flat `regulator*` fields. Plan extends the flat pattern instead, with `regulatorVerifyUrl` + `regulatorVerifyLabel`. Behaviorally identical, matches existing pattern.
- Spec said the Footer regulator row should swap to "MARA" for AU. Existing `regulatorAbbr` is `"OMARA"` (formal name). Plan uses the existing value as-is rather than introducing a separate "friendly name" field. Tests assert "OMARA" appears.

**Placeholder scan:** No "TBD" or "implement later" steps. All code is complete. Content placeholders in the About page are explicitly marked with `TODO(joey)` and gated by the launch-gate checklist.

**Type consistency:** `PartnerSchool` type defined once in `lib/partnerSchools.ts` and re-imported in the page test. `Country` type already exists in `lib/config.ts` and is used consistently.
