# Team → About merge, navbar entry, and country switcher polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the team in the navbar (`/team` retires, `/about` absorbs all team content), bring 6 LIAs + 3 support team onto `/about` using the small teaser card style with a 🇳🇿 IAA licence chip, and restyle the country switcher to match the site's secondary-button language with a full-width inline list on mobile.

**Architecture:** All work happens in the existing Next.js 14 App Router project. No new dependencies, no new routes — one redirect, one trigger-button restyle, one page restructure. The country flag is exposed through `countryConfig` (`lib/config.ts`) so the same source feeds both the switcher and any future use.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Vitest + React Testing Library, Font Awesome for icons.

**Spec:** [`docs/superpowers/specs/2026-05-23-team-merged-into-about-and-navbar-polish.md`](../specs/2026-05-23-team-merged-into-about-and-navbar-polish.md)

---

## File map

| File | Purpose of change |
|---|---|
| `lib/config.ts` | Add `flag: string` to `CountryConfig` interface, populate `🇳🇿/🇦🇺/🇨🇦` per country. Single source of truth for flags. |
| `next.config.ts` | Add async `redirects()` returning a permanent `/team` → `/about`. |
| `components/layout/Navbar.tsx` | Repoint `"Our Team"` link to `/about` in both NZ and AU `innerLinks`. Update mobile menu to render `CountrySwitcher` with `variant="mobile"`. |
| `components/layout/Footer.tsx` | Change `/team` href on line 97 to `/about`. |
| `components/layout/CountrySwitcher.tsx` | Trigger restyle (rounded-2xl secondary-button look, flag from config). Dropdown items get flag prefix + check icon for active. Add `variant` prop with `"desktop"` (default) and `"mobile"` (inline list, no popover). |
| `app/about/page.tsx` | Replace the existing `TEAM_TEASER` section (lines 264–307) with two new sections: 6 LIAs (small card + IAA chip with 🇳🇿) and 3 support team (same card, no chip). Add `ADVISERS` + `SUPPORT` arrays and a `TeamCard` component. Remove "Meet the full team" CTA. |
| `app/about/__tests__/page.test.tsx` | Replace the "renders a team teaser linking to /team" test with assertions for the new sections (6 LIA names, 6 IAA licence numbers, 3 support names). |
| `app/team/page.tsx` | Delete (no `app/team/__tests__/` exists, so nothing else to remove). |

---

## Task 1: Add `flag` field to country config

**Files:**
- Modify: `lib/config.ts`

- [ ] **Step 1: Add `flag` to the `CountryConfig` interface**

Open `lib/config.ts`. In the `CountryConfig` interface (currently ends with `regulatorVerifyLabel: string;` around line 46), add this field at the bottom of the interface:

```ts
  /** Country flag as a Unicode emoji (used by CountrySwitcher and licence chips). */
  flag: string;
```

- [ ] **Step 2: Populate `flag` for each country**

In the `countryConfig` object, add `flag: "🇳🇿",` to the `nz` entry (right after `regulatorVerifyLabel`), `flag: "🇦🇺",` to the `au` entry, and `flag: "🇨🇦",` to the `ca` entry.

- [ ] **Step 3: Run typecheck to verify**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). If this fails, fix the syntax and re-run.

- [ ] **Step 4: Commit**

```bash
git add lib/config.ts
git commit -m "feat(config): add country flag emoji to CountryConfig

Adds a flag field (🇳🇿/🇦🇺/🇨🇦) to each country so the CountrySwitcher
and the upcoming licence chip on team cards can pull from one source.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Add `/team` → `/about` redirect

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add async `redirects()` to the config**

Open `next.config.ts`. Currently it exports `nextConfig` with `allowedDevOrigins` and `images`. Add a `redirects` method between them so the final shape is:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
  ],
  async redirects() {
    return [
      {
        source: "/team",
        destination: "/about",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify the redirect manually with dev server**

Run: `npm run dev` (in background, or in another terminal)
Then in a separate terminal: `curl -I http://localhost:3000/team`
Expected: status `308 Permanent Redirect` (Next.js issues 308 by default for `permanent: true`) with `location: /about` header.

Stop the dev server after verifying.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(routes): redirect /team to /about (team merged into About page)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Repoint navbar "Our Team" link to /about

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Change both `/team` references in `innerLinks`**

Open `components/layout/Navbar.tsx`. There are two occurrences of `{ href: "/team", label: "Our Team" },` — one inside the NZ `innerLinks` block (around line 33) and one inside the AU block (around line 41). Change both to:

```tsx
      { href: "/about", label: "Our Team" },
```

- [ ] **Step 2: Run lint to verify the file still compiles**

Run: `npm run lint`
Expected: PASS (no errors related to Navbar.tsx).

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat(nav): point 'Our Team' link to /about

Label stays 'Our Team' (friendlier than 'About'). The /about page now
holds the full team content; /team redirects to /about.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Repoint footer "Our Team" link to /about

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Change the `/team` href in the footer nav list**

Open `components/layout/Footer.tsx` around line 97. The existing `<Link href="/team" ...>` becomes:

```tsx
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-400 transition-colors"
                >
                  Our Team
                </Link>
              </li>
```

- [ ] **Step 2: Verify existing Footer tests still pass**

Run: `npm test -- components/layout/__tests__/Footer.test.tsx`
Expected: PASS. The Footer tests only assert on the regulator row, not on the `/team` link, so no test update is needed.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(footer): point 'Our Team' link to /about

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Restyle CountrySwitcher trigger and dropdown items

**Files:**
- Modify: `components/layout/CountrySwitcher.tsx`

- [ ] **Step 1: Replace the trigger button markup**

Open `components/layout/CountrySwitcher.tsx`. The trigger button currently starts on line 67 (`<button type="button" onClick={() => setOpen((v) => !v)} ...>`). Replace the entire `<button>` element (the trigger, not the dropdown items) with:

```tsx
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-accent-700 font-semibold text-sm shadow-sm hover:bg-brand-50 hover:border-brand-200 hover:shadow transition-all"
      >
        <span aria-label={current.displayName}>{current.flag}</span>
        <span>{current.displayName}</span>
        <i
          className={`fa-solid fa-chevron-down text-xs transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
```

Note: this drops the `fa-globe` icon entirely (replaced by the country flag) and changes shape from `rounded-full` to `rounded-2xl` to match the site's button language.

- [ ] **Step 2: Replace the dropdown item markup**

The dropdown items currently start around line 91 with `<button key={c} type="button" role="option" ...>`. Replace the entire item button with:

```tsx
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(c)}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-3 transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-accent-700 hover:bg-slate-50 hover:text-brand-600"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span aria-label={cfg.displayName}>{cfg.flag}</span>
                  <span>{cfg.displayName}</span>
                </span>
                {isActive && (
                  <i
                    className="fa-solid fa-check text-brand-600 text-xs"
                    aria-hidden="true"
                  />
                )}
              </button>
```

Note: the previous `<span>CURRENT</span>` uppercase tag is gone; an `fa-check` icon replaces it. Padding bumps from `py-2.5` to `py-3` for friendlier touch targets.

- [ ] **Step 3: Smoke check in dev server**

Run: `npm run dev`
Visit `http://localhost:3000` and click the country switcher in the navbar. Verify:
- Trigger has white background, `rounded-2xl` shape, soft shadow, flag emoji.
- Dropdown opens; rows show flag + name; active row has the brand-50 background and a brand-600 check icon on the right.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/layout/CountrySwitcher.tsx
git commit -m "feat(nav): restyle CountrySwitcher to match site button language

Trigger moves from rounded-full thin-grey outline to rounded-2xl
secondary-button style (white bg, slate border, soft shadow), with the
country flag replacing the generic globe icon. Dropdown items get a
flag prefix and a check icon for the active row, dropping the
'CURRENT' text tag.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Add `variant="mobile"` inline-list render path to CountrySwitcher

**Files:**
- Modify: `components/layout/CountrySwitcher.tsx`
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Add the `variant` prop to the interface**

In `components/layout/CountrySwitcher.tsx`, update the `CountrySwitcherProps` interface (currently around lines 29–32) to:

```ts
interface CountrySwitcherProps {
  /** Optional onSelect callback (used by the mobile menu to close itself). */
  onSelect?: () => void;
  /**
   * - `"desktop"` (default): trigger button + popover dropdown.
   * - `"mobile"`: inline always-visible list with a "Country" label.
   *   Used inside the hamburger menu so the dropdown doesn't nest in a
   *   vertical menu (it felt cramped before).
   */
  variant?: "desktop" | "mobile";
}
```

- [ ] **Step 2: Destructure `variant` with a default**

In the component signature, change:

```tsx
export default function CountrySwitcher({ onSelect }: CountrySwitcherProps) {
```

to:

```tsx
export default function CountrySwitcher({
  onSelect,
  variant = "desktop",
}: CountrySwitcherProps) {
```

- [ ] **Step 3: Add an early-return for the mobile variant**

After the `handleSelect` function (currently ends around line 63 with `};`) and before the `return (` of the desktop variant, add this early return:

```tsx
  if (variant === "mobile") {
    return (
      <div>
        <div className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-2 px-1">
          Country
        </div>
        <div
          role="listbox"
          className="rounded-2xl border border-slate-200 overflow-hidden bg-white"
        >
          {COUNTRIES.map((c, i) => {
            const cfg = countryConfig[c];
            const isActive = c === country;
            return (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(c)}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-3 transition-colors ${
                  i > 0 ? "border-t border-slate-200" : ""
                } ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-accent-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span aria-label={cfg.displayName}>{cfg.flag}</span>
                  <span>{cfg.displayName}</span>
                </span>
                {isActive && (
                  <span className="text-xs uppercase tracking-wider text-brand-500">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
```

The mobile variant uses the word "Current" (full text) instead of a check icon because the row layout has plenty of horizontal space and the explicit word reads cleaner on a smaller screen.

- [ ] **Step 4: Update Navbar mobile menu to use the mobile variant**

Open `components/layout/Navbar.tsx`. The mobile menu currently wraps the CountrySwitcher in a div around lines 101–103:

```tsx
              <div className="px-2">
                <CountrySwitcher onSelect={() => setMobileOpen(false)} />
              </div>
```

Replace that block with:

```tsx
              <div className="px-2">
                <CountrySwitcher
                  variant="mobile"
                  onSelect={() => setMobileOpen(false)}
                />
              </div>
```

- [ ] **Step 5: Smoke check on mobile viewport**

Run: `npm run dev`
Open Chrome DevTools, set viewport to a mobile size (e.g. iPhone 12), reload `http://localhost:3000`, tap the hamburger. Verify:
- Inside the open menu, a "Country" label appears above a rounded card with three inline rows (NZ / AU / CA).
- Active country has brand-50 background and the right-side "Current" word.
- Tapping a non-active country closes the menu and navigates.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add components/layout/CountrySwitcher.tsx components/layout/Navbar.tsx
git commit -m "feat(nav): inline country list inside mobile hamburger menu

Adds a 'mobile' variant to CountrySwitcher that renders the three
countries as a full-width inline list (no nested dropdown). The mobile
menu now uses it so the country picker stops feeling cramped inside the
vertical menu.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Update /about tests for the new team sections (TDD: write tests first)

**Files:**
- Modify: `app/about/__tests__/page.test.tsx`

- [ ] **Step 1: Remove the "team teaser links to /team" assertion**

Open `app/about/__tests__/page.test.tsx`. Delete the entire test block (lines 40–44):

```tsx
  it("renders a team teaser linking to /team", () => {
    render(<AboutPage />);
    const teamLink = screen.getByRole("link", { name: /Meet|team/i });
    expect(teamLink).toHaveAttribute("href", "/team");
  });
```

- [ ] **Step 2: Add new tests for LIA section + support team + licence chips**

Insert these three new tests at the same spot you removed the old one (before the "renders a final CTA" test):

```tsx
  it("renders all six Licensed Immigration Advisers", () => {
    render(<AboutPage />);
    const names = [
      "Jocelyn Ocampo",
      "Joyce Maneja-Curiano",
      "Lorna Caluag",
      "Stephanie Feret",
      "Tonet Cruz Jang",
      "Trinity Lee",
    ];
    for (const name of names) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders an IAA licence number for each adviser", () => {
    render(<AboutPage />);
    const licences = [
      "201001078",
      "202400363",
      "201900427",
      "201700294",
      "201601367",
      "201701299",
    ];
    for (const licence of licences) {
      expect(screen.getByText(new RegExp(licence))).toBeInTheDocument();
    }
  });

  it("renders the three behind-the-scenes support team members", () => {
    render(<AboutPage />);
    expect(screen.getByText("Marie Quintos")).toBeInTheDocument();
    expect(screen.getByText("Issa Mercado")).toBeInTheDocument();
    expect(screen.getByText("Paolo Quintos")).toBeInTheDocument();
    expect(screen.getByText("Office Manager")).toBeInTheDocument();
    expect(screen.getByText("Admin & Finance")).toBeInTheDocument();
    expect(screen.getByText("Marketing Officer")).toBeInTheDocument();
  });
```

- [ ] **Step 3: Run the tests — expect new ones to FAIL**

Run: `npm test -- app/about/__tests__/page.test.tsx`
Expected: the three new tests FAIL (the page hasn't been restructured yet — `Joyce Maneja-Curiano`, the support team, and the new licence numbers aren't rendered). The "team teaser" test is removed so it can't fail. Existing tests for hero, founder, stats, regulators, CTA, metadata should still PASS.

Do NOT commit yet — the next task is the implementation that makes these tests pass.

---

## Task 8: Restructure /about — replace teaser with LIAs + Behind the scenes

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Replace the `TEAM_TEASER` array with `ADVISERS` and `SUPPORT`**

Open `app/about/page.tsx`. Delete the existing `TEAM_TEASER` array (currently lines 80–101). In its place, add these two arrays:

```tsx
type Adviser = {
  name: string;
  licence: string;
  image: string;
  /** Optional CSS object-position override for off-center crops. */
  objectPosition?: string;
};

type Support = {
  name: string;
  role: string;
  image: string;
};

const ADVISERS: Adviser[] = [
  {
    name: "Jocelyn Ocampo",
    licence: "201001078",
    image: "/images/Team/jocelyn-ocampo.webp",
  },
  {
    name: "Joyce Maneja-Curiano",
    licence: "202400363",
    image: "/images/Team/joyce-maneja-curiano.webp",
  },
  {
    name: "Lorna Caluag",
    licence: "201900427",
    image: "/images/Team/lorna-caluag.webp",
  },
  {
    name: "Stephanie Feret",
    licence: "201700294",
    image: "/images/Team/stephanie-feret.webp",
  },
  {
    name: "Tonet Cruz Jang",
    licence: "201601367",
    image: "/images/Team/tonet-cruz-jang.webp",
    objectPosition: "50% 35%",
  },
  {
    name: "Trinity Lee",
    licence: "201701299",
    image: "/images/Team/trinity-lee.webp",
  },
];

const SUPPORT: Support[] = [
  {
    name: "Marie Quintos",
    role: "Office Manager",
    image: "/images/Team/marie-quintos.webp",
  },
  {
    name: "Issa Mercado",
    role: "Admin & Finance",
    image: "/images/Team/issa-mercado.webp",
  },
  {
    name: "Paolo Quintos",
    role: "Marketing Officer",
    image: "/images/Team/paolo-quintos.webp",
  },
];
```

- [ ] **Step 2: Replace the team-teaser section markup**

In `app/about/page.tsx`, find the team-teaser section currently spanning lines 264–307 (it starts with `{/* 5. Team teaser */}` and includes the `Meet the full team` link). Delete that entire section and replace it with these two sections:

```tsx
      {/* 5. Licensed Immigration Advisers */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              Licensed Immigration Advisers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Our IAA-licensed advisers
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every adviser is licensed by the Immigration Advisers Authority
              of New Zealand &mdash; the regulator that holds NZ immigration
              professionals to a strict code of conduct.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {ADVISERS.map((member) => (
              <div
                key={member.licence}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={`${member.name} — Licensed Immigration Adviser`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: member.objectPosition ?? "50% 0%" }}
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 text-xs mb-2">
                    Licensed Immigration Adviser
                  </p>
                  <div className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-[10px] font-medium leading-none">
                    <span aria-label="New Zealand">🇳🇿</span>
                    <span>IAA No. {member.licence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Behind the scenes */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              Support Team
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              The people behind the scenes
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The team that keeps everything running &mdash; finance,
              operations, and making sure your journey is heard about by others
              like you.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {SUPPORT.map((member) => (
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
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
```

Section 6 keeps a white background to alternate against the `#FAFAFA` LIA section above and the `brand-900` final CTA below it.

- [ ] **Step 3: Remove the now-unused `Link` import (if applicable)**

After the changes above, `Link` may no longer be referenced in `app/about/page.tsx` (the "Meet the full team" link used it, and the final CTA also uses it). Check the file: if `Link` is still used by the final CTA (`<Link href="/how-it-works#step-1" ...>`), keep the import. If not, remove `import Link from "next/link";` to silence the unused-import lint warning.

(In practice, the final CTA still uses `Link`, so the import stays.)

- [ ] **Step 4: Run the about-page tests — they should now PASS**

Run: `npm test -- app/about/__tests__/page.test.tsx`
Expected: all tests PASS (the three new ones from Task 7 + all the pre-existing ones).

- [ ] **Step 5: Smoke check the page in dev**

Run: `npm run dev`
Visit `http://localhost:3000/about` and verify:
- Section 5 shows 6 LIA cards in a 3-col grid on desktop, 2-col on mobile.
- Each LIA card has a small `🇳🇿 IAA No. NNNNNNNNN` chip below the role.
- Section 6 shows 3 support cards in the same small style, no chip.
- No "Meet the full team" link anywhere on the page.

Stop the dev server.

- [ ] **Step 6: Commit (Tasks 7 + 8 together since they're a TDD pair)**

```bash
git add app/about/__tests__/page.test.tsx app/about/page.tsx
git commit -m "feat(about): merge /team content onto /about with NZ-flag licence chips

Replaces the 4-up team teaser with two sections: 6 Licensed Immigration
Advisers in a 3-col grid (small card + 🇳🇿 IAA licence chip) and 3
'behind the scenes' support team members in the same card style. Drops
the 'Meet the full team' CTA since /about is now the team page.

Tests cover all 6 LIA names + licence numbers and all 3 support names
with their roles.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Delete the /team page

**Files:**
- Delete: `app/team/page.tsx`

- [ ] **Step 1: Delete the file**

Run: `rm app/team/page.tsx`

Also remove the now-empty directory:

Run: `rmdir app/team 2>/dev/null || true`

(The directory may not be empty if there's anything else inside — the command silently no-ops in that case.)

- [ ] **Step 2: Verify the redirect still works**

Run: `npm run dev`
In another terminal: `curl -I http://localhost:3000/team`
Expected: status `308` redirect to `/about` (from the `next.config.ts` redirect, not from a stale route).

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add -A app/team
git commit -m "chore(team): remove /team page now that /about absorbs the content

The /team URL still resolves via the 308 redirect in next.config.ts so
no inbound link or saved bookmark breaks.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: ALL tests PASS. If any fail, fix the underlying issue (don't skip).

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors. Warnings unrelated to this change are fine.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds, no TypeScript errors. Look for any "Page not found" warnings related to `/team` (there shouldn't be any since the redirect handles it).

- [ ] **Step 4: Manual smoke pass in dev server**

Run: `npm run dev` and exercise the following in a browser:

| Check | How | Expected |
|---|---|---|
| Navbar "Our Team" link | Click "Our Team" from any page | Lands on `/about` |
| `/team` redirect | Visit `http://localhost:3000/team` directly | Browser redirected to `/about` |
| Country switcher (desktop) | Click the country pill in the navbar | rounded-2xl trigger, dropdown opens with flag rows + check icon on active |
| Country switcher (mobile) | Open Chrome DevTools mobile viewport, tap hamburger | "Country" label + inline 3-row list with active row showing "Current" |
| /about LIA section | Scroll to "Our IAA-licensed advisers" | 6 cards in 3-col grid (desktop), each with NZ flag + IAA chip |
| /about support section | Scroll to "The people behind the scenes" | 3 cards in 3-col grid (desktop), no licence chip |
| Footer "Our Team" link | Click "Our Team" in footer | Lands on `/about` |

Stop the dev server.

- [ ] **Step 5: No commit needed**

This task is verification only. If everything passes, the work is done.

---

## Out of scope (per spec)

- Founder paragraph rewrite (`TODO(joey)` in source stays).
- Hero subhead rewrite to acknowledge `/about` is now the team page.
- New advisers / new countries.
- OMARA / CICC licence chips — the component is already flag-agnostic via `countryConfig`, so this is a future change.
