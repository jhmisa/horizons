# Team → About merge, navbar entry, and country switcher polish

**Status:** Draft — pending user review
**Date:** 2026-05-23
**Scope:** `/about` page restructure, `/team` retirement, Navbar entry, CountrySwitcher redesign

## Goal

Three connected improvements to the public site:

1. Surface the team in the navbar — `/about` becomes the single "who we are" page; `/team` is retired and redirects to `/about`.
2. Bring the existing `/team` content (6 LIAs with licence numbers, 3 support team members) onto `/about` using the smaller card style already established by the `/about` team teaser.
3. Make the country switcher feel native to the Horizons button language — currently it's the only `rounded-full` outlined button on the site and reads as a generic widget.

## Non-goals

- No copy rewrites to the hero, founder paragraphs, stats, or regulator blurbs on `/about`. Those are out of scope for this change (the existing `TODO(joey)` comments stay until Joey supplies replacements separately).
- No new advisers added or removed. Order and licence numbers come straight from the current `app/team/page.tsx`.
- No content management surface — the team list stays a hardcoded array in `app/about/page.tsx`, same as today.
- No changes to AU or CA pages beyond the navbar link target. (`/team` already worked from both NZ and AU navbars; it will continue to, just via redirect to `/about`.)

## Routing & navbar

- Navbar label stays `"Our Team"` (not "About Us"). Friendlier for an immigration consultancy where trust comes from people.
- "Our Team" entry destination changes from `/team` → `/about`.
- `/team` URL → 308 redirect (Next.js emits 308 for `permanent: true`; semantically equivalent to a 301 for GET navigation) to `/about`. Implemented in `next.config.ts` via the `redirects()` function so it survives static export and works on Vercel.
- Footer link to `/team` (Footer.tsx:97) updated to `/about`.
- The orphan "Meet the full team" CTA inside `/about` (currently linking to `/team`) is removed — `/about` *is* the full team page now.

## /about page structure (after change)

```
1. Hero                       (unchanged)
2. Founder                    (unchanged)
3. By the numbers             (unchanged)
4. Regulated by               (unchanged)
5. Licensed Immigration Advisers   ← NEW (was /team)
6. Behind the scenes               ← NEW (was /team support section)
7. Final CTA                  (unchanged)
```

Sections 5 and 6 replace the current single "Team teaser" section (lines 264–307 of `app/about/page.tsx`).

### Section 5 — Licensed Immigration Advisers

- Heading: `"Our IAA-licensed advisers"` (matches today's `/team` page heading).
- Eyebrow chip: `"Licensed Immigration Advisers"` (uppercase brand chip, matches current convention).
- Body line below heading: same copy used on `/team` today — "Every adviser is licensed by the Immigration Advisers Authority of New Zealand — the regulator that holds NZ immigration professionals to a strict code of conduct."
- Grid: `grid-cols-2 md:grid-cols-3` (2 × 3 on desktop, 3 × 2 on mobile). 6 cards, no orphans.
- Order: Jocelyn Ocampo, Joyce Maneja-Curiano, Lorna Caluag, Stephanie Feret, Tonet Cruz Jang, Trinity Lee (same order as `/team` today).
- Background: `bg-[#FAFAFA]` so it alternates against the white "By the numbers" section above it. (Founder uses `#FAFAFA`, Stats uses white, Regulators uses brand-900, then this section uses `#FAFAFA` — preserves the existing rhythm.)

### Section 6 — Behind the scenes

- Heading: `"The people behind the scenes"` (matches today's `/team` page heading).
- Eyebrow chip: `"Support Team"`.
- Body line: same as `/team` — "The team that keeps everything running — finance, operations, and making sure your journey is heard about by others like you."
- Grid: `grid-cols-2 md:grid-cols-3` (1 × 3 on desktop). 3 cards.
- Order: Marie Quintos, Issa Mercado, Paolo Quintos (same order as `/team` today).
- Background: white (so it alternates against the brand-900 final CTA below it).

## Adviser/support card design

Uses the **small** `/about`-teaser card geometry (not the larger `/team` card). One unified card component for both LIAs and support team — license badge slot is optional.

```
   ┌──────────────────────────┐
   │                          │
   │         [PHOTO]          │   aspect-square, object-cover, object-top
   │                          │
   ├──────────────────────────┤
   │     Jocelyn Ocampo       │   text-sm font-bold text-slate-900
   │ Licensed Immigration     │   text-xs text-brand-600
   │       Adviser            │
   │                          │
   │ ┌──────────────────────┐ │
   │ │ 🇳🇿 IAA No. 201001078│ │   licence chip (LIAs only)
   │ └──────────────────────┘ │
   └──────────────────────────┘
   rounded-2xl, bg-white, shadow-md, border-slate-100
```

- Container: `bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden` (same as current teaser).
- Image: `aspect-square` (unchanged from teaser), `object-cover object-top` so heads sit nicely. Preserve `objectPosition` override for Tonet Cruz Jang (`50% 35%`) — already in the data.
- Footer padding: `p-4` (slightly tighter than `/team`'s `p-6` to keep the compact teaser feel Joey called out).
- Name: `text-sm font-bold text-slate-900`.
- Role: `text-xs text-brand-600` (the role text wraps to 2–3 lines on the narrow card — that's fine, mirrors today's teaser).
- Licence chip (LIA cards only):
  - Wrapper: `mt-2 inline-flex items-center gap-1.5 py-1 px-2 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-[10px] font-medium leading-none`.
  - Flag: rendered as inline text emoji `🇳🇿` (no icon font, no SVG sprite — keeps it simple). Flag span is marked `aria-hidden="true"` because the visible "IAA No. NNN" text alongside already carries the semantic content; an `aria-label` on the flag would cause screen readers to announce the country name twice.
  - Body: `IAA No. {licence}` (drop "Licence" word — chip is already cramped, and the IAA prefix carries the meaning).
- Support cards skip the licence chip entirely. No flag, no badge.
- No hover lift on these small cards (the current teaser also has no hover state). Keeps the section calm next to the larger founder card above it.

### Why emoji flag instead of SVG

- Zero asset cost, no extra request.
- Render quality is solid on macOS, iOS, modern Windows, Android. Linux fallback degrades to "🇳🇿" letter glyphs which is still legible.
- We already use Font Awesome icons elsewhere; mixing in an emoji flag for a one-off "country of licence" signal is lighter than adding a flag sprite system.
- Future-proof for OMARA (🇦🇺) / CICC (🇨🇦) once those licences exist — same chip, different emoji.

## Country switcher redesign

### Trigger button

Move from the current `rounded-full` thin-grey outline to a **secondary-button** style that mirrors the "Meet the full team" CTA pattern. Sits next to "Book Session" in the desktop nav as a calmer companion button.

| | Before | After |
|---|---|---|
| Shape | `rounded-full` | `rounded-2xl` (matches all real buttons) |
| Border | `border-slate-200` | `border border-slate-200` |
| Background | transparent | `bg-white` |
| Shadow | none | `shadow-sm hover:shadow` |
| Icon | `fa-globe` (generic) | flag emoji of current country (🇳🇿 / 🇦🇺 / 🇨🇦) |
| Padding | `px-3 py-1.5` | `px-4 py-2` (matches CTA touch target) |
| Hover | colour change only | `hover:bg-brand-50 hover:border-brand-200`, subtle shadow lift |

```
   Desktop nav row (right side):

   How It Works   Our Team   FAQ   ┌──────────────────────────┐ ╔═══════════════╗
                                   │ 🇳🇿 New Zealand    ⌄    │ ║ Book Session  ║
                                   └──────────────────────────┘ ╚═══════════════╝
                                   white bg, slate border,       brand-600 bg,
                                   shadow-sm                     shadow-md
```

### Dropdown panel (desktop)

- Keep current panel shell (`rounded-2xl shadow-md border border-slate-100 overflow-hidden`), it already matches site language.
- Item rows:
  - Layout: flag + country name on the left, status icon on the right.
  - Active item: `bg-brand-50 text-brand-700 font-semibold`, right-side check icon (`fa-check text-brand-600`) replacing the current `CURRENT` text tag (the uppercase tag reads as system label noise).
  - Inactive item: `hover:bg-slate-50 hover:text-brand-600`.
- Touch target: `px-4 py-3` (was `px-4 py-2.5` — slightly taller for finger-friendliness).

```
   ┌────────────────────────────┐
   │ 🇳🇿  New Zealand        ✓ │   active (brand-50 bg)
   │ 🇦🇺  Australia            │
   │ 🇨🇦  Canada               │
   └────────────────────────────┘
```

### Mobile treatment

- Today: inside the hamburger menu, the country switcher renders the same trigger button which opens a nested floating dropdown — feels cramped and out-of-place inside a vertical menu.
- After: replace the dropdown-inside-hamburger with an inline, full-width country list under a small "Country" label. No second click. All three countries always visible while the menu is open.

```
   Mobile hamburger menu (open):
   ┌────────────────────────────────┐
   │ Country                        │
   │ ┌────────────────────────────┐ │
   │ │ 🇳🇿 New Zealand     Current│ │   active (brand-50 bg, brand-700 text)
   │ ├────────────────────────────┤ │
   │ │ 🇦🇺 Australia              │ │
   │ ├────────────────────────────┤ │
   │ │ 🇨🇦 Canada                 │ │
   │ └────────────────────────────┘ │
   │                                │
   │ Home                           │
   │ How It Works                   │
   │ Our Team                       │
   │ Success Stories                │
   │ FAQ                            │
   │ ┌────────────────────────────┐ │
   │ │       Book Session         │ │
   │ └────────────────────────────┘ │
   └────────────────────────────────┘
```

- Mobile-only word "Current" (full text, not just check icon) — kept for clarity since the row layout already gives plenty of horizontal space on mobile.
- Active row stays selectable but is a no-op (matches current behaviour: `if (target !== country)` early returns).

### Implementation notes

- `CountrySwitcher` becomes a controlled component with two render variants: a `variant="desktop"` (button + dropdown) and a `variant="mobile"` (inline list, no dropdown logic). The Navbar component selects the variant.
  - Alternative considered: keep one variant and switch behaviour via `sm:hidden`/`hidden sm:block` CSS. Rejected because the mobile list has different markup (no button, no popover state, no aria-haspopup) — cleanest to express as a separate render path rather than two parallel DOM trees with display toggles.
- Add a `flag` field to each entry in `countryConfig` (lib/config.ts): `flag: "🇳🇿"`, etc. Same emoji used in cards and switcher, so the source is canonical.
- Outside-click handler stays for the desktop variant only; mobile variant has no popover state.

## File changes

| File | Change |
|---|---|
| `app/about/page.tsx` | Replace `TEAM_TEASER` array + section 5 with full `ADVISERS` + `SUPPORT` arrays (sourced from `app/team/page.tsx` data). Render two sections (LIAs + Behind the scenes) using the new small-card component. Remove "Meet the full team" CTA. |
| `app/about/__tests__/page.test.tsx` | Remove the `expect(teamLink).toHaveAttribute("href", "/team")` assertion. Add assertions for the new sections (LIA count = 6, support count = 3, licence chip visible on LIA cards, no licence chip on support cards). |
| `app/team/page.tsx` | Delete. (No `app/team/__tests__/` exists, so no test deletion required.) |
| `next.config.ts` | Add `async redirects()` returning `[{ source: "/team", destination: "/about", permanent: true }]`. |
| `components/layout/Navbar.tsx` | Change both NZ and AU `innerLinks` entries from `{ href: "/team", label: "Our Team" }` to `{ href: "/about", label: "Our Team" }`. Update mobile render to use new mobile-variant CountrySwitcher (no nested dropdown). |
| `components/layout/Footer.tsx` | Change `/team` href on line 97 to `/about`. |
| `components/layout/__tests__/Footer.test.tsx` | Update assertions that match the previous `/team` link target to `/about`. |
| `components/layout/CountrySwitcher.tsx` | Restyle trigger button (rounded-2xl, white bg, shadow-sm, flag instead of globe icon). Restyle dropdown items (flag prefix, check icon for active instead of "CURRENT" tag). Add `variant` prop with `"desktop"` (default, current behaviour) and `"mobile"` (inline list, no popover). |
| `lib/config.ts` | Add `flag: string` field to `CountryConfig` interface, populate for nz/au/ca (`🇳🇿`/`🇦🇺`/`🇨🇦`). |

No CountrySwitcher or Navbar test files exist today; this change adds no new test files for them (covered indirectly by the `/about` and Footer test updates plus a manual smoke pass).

## Testing

- Unit tests stay snapshot-free; rely on the existing Testing Library assertions (`toBeInTheDocument`, `toHaveAttribute`).
- New assertions worth adding:
  - `/about` renders all 6 LIA names.
  - `/about` renders all 6 IAA licence numbers (verifies the flag/chip path).
  - `/about` renders all 3 support team names with no licence text on those cards.
  - Navbar "Our Team" link has `href="/about"` on both NZ and AU contexts.
  - Footer "Our Team" link has `href="/about"`.
  - CountrySwitcher desktop renders a single `<button>` trigger with current-country flag in its label.
  - CountrySwitcher mobile renders 3 inline buttons (one per country), no trigger.
- Manual smoke (post-implementation): visit `/team` and confirm 308 redirect to `/about`; open `/about` on mobile and confirm the team grid wraps 2-wide; toggle the country switcher on mobile and confirm 3 inline rows replace the dropdown.

## Risks / open questions

- **/team redirect SEO:** `/team` is in the current sitemap? Checked — it isn't (sitemap.ts only lists `/about`). So redirecting `/team` → `/about` won't strand any sitemap-advertised URL.
- **Existing inbound links:** any external content (Google search results, social posts) pointing at `/team` will land on `/about` via the 308 redirect (Next.js emits 308 for `permanent: true`; semantically equivalent to a 301 for GET navigation). Acceptable.
- **Tonet Cruz Jang's `objectPosition: "50% 35%"`** — preserve when moving the data. Cropping the photo from the top cuts off the face slightly otherwise.
- **Mobile emoji rendering on older Android / Linux** — accepted degradation; flag falls back to letter pair which is still readable. No spec change.

## Out of scope (deliberately)

- Rewriting founder paragraphs (still `TODO(joey)` in source).
- Rewriting hero subhead to acknowledge `/about` is now also the team page. Current copy ("For two decades, Horizons Immigration has guided families…") still works since it's about the practice, not specifically about the founder.
- Adding new advisers, support team members, or other countries.
- Adding licence badges for OMARA / CICC — none of the current team holds those licences yet. The chip component supports it via different flag + prefix when needed.
- Changes to `/team`-style hover lifts on the new small cards. Calm-by-default matches the teaser convention.
