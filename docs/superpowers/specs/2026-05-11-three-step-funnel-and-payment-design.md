# Three-Step Funnel + Stripe Payment Link Integration — Design Spec

**Date:** 2026-05-11
**Status:** Approved (pending user review of this written spec)
**Author:** Joey + Claude
**Target milestone:** v1

## Goal

Coordinated change with three parts:

1. **Reduce the public funnel from 4 steps to 3 steps.** Watch → Test → Book → Proceed becomes Watch → Book → Proceed. Eligibility test is removed from the funnel and the page is deleted.
2. **Switch the `/book` page to a momentum-first single Pay button** using a Stripe Payment Link, replacing the current (non-functional) form-based architecture.
3. **Add a "Submit your question" form on the `/answers` (Q&A) page.** Submissions land in Sanity Studio as a new `submittedQuestion` doc type for review.

The motivation is conversion-focused: remove friction (eligibility quiz, time-slot scheduling form) so visitors who are ready to commit can pay immediately while motivation is high. The Q&A submit form turns visitors with unanswered questions into a queue of content ideas.

## Pricing model

- Customer pays **$197 USD total** = $190 consultation fee + $7 payment processing fee.
- Horizons receives **$190 net**. The $7 covers Stripe's card processing cost (passed transparently to the customer).
- On the second-stage processing fee ($2,000), the **$190 (not the $197) is credited**, so net-to-proceed = **$1,810**.
- The breakdown is shown as a transparent line-item table on `/book` and the how-it-works Step 2 card.

NZ legal note: surcharging the actual card-acceptance cost is legal in NZ as long as the surcharge does not exceed actual cost of acceptance. $7 on $190 = ~3.7%, at the upper edge of typical international card costs. If effective Stripe cost ever drops below 3.7%, the surcharge should come down to stay compliant.

## Section 1 — Three-step funnel + eligibility test removal

### Files modified

| File | Change |
|---|---|
| `app/page.tsx` | "Four Simple Steps" → "Three Simple Steps". Step grid 4 → 3 cards (remove "Test"). Renumber 1, 2, 3. CTA "Explore the Full 4-Step Process" → "Explore the Full 3-Step Process". Final CTA section copy + destination changes (see below). |
| `app/how-it-works/page.tsx` | Metadata "4 Steps" → "3 Steps". H1 "Four Simple Steps" → "Three Simple Steps". STEP 2 (Test) section deleted entirely. STEP 3 (Book) renumbered to STEP 2 — copy updated per Section 2. STEP 4 (Proceed) renumbered to STEP 3. Internal "Step 4" / "See Step 4" references → "Step 3". Final CTA copy + destination changes. |
| `components/layout/Navbar.tsx` | Mobile menu "Check Eligibility" CTA (line 115–120) replaced with "Book Session" → `/book`. |
| `components/layout/Footer.tsx` | Remove `/eligibility-test` link (line 100). |
| `app/team/page.tsx` | Remove any `/eligibility-test` CTAs. Replace with `/book` or `/how-it-works` per page context. |
| `app/success-stories/page.tsx` | Remove any `/eligibility-test` CTAs. Replace with `/book` or `/how-it-works` per page context. |
| `app/sitemap.ts` | Remove `/eligibility-test` entry. |
| `CLAUDE.md` | Update Project Structure (drop `/eligibility-test`), update Key Business Logic (remove eligibility-test bullet, update pricing to reflect $190 + $7 model). |
| `PRD.md` | Add note at top: "Updated 2026-05-11: funnel reduced to 3 steps, eligibility test removed, payment switched to Stripe Payment Link with $190 + $7 processing fee model." Body left as historical record. |

### Files deleted

- `app/eligibility-test/` directory (contains `page.tsx`)

### Destination updates

- **Homepage hero CTA "Book Session"** — keep pointing to `/how-it-works` (visitors learn before paying).
- **Homepage final CTA section** ("Your family's next chapter is waiting" + "Check My Eligibility — Free"):
  - New copy: *"Start your journey today. Watch the masterclass and see if New Zealand is the right fit for your family."*
  - Button: "Watch the Masterclass" → `/how-it-works#step-1`
- **how-it-works final CTA** ("Ready to take Step 1?" + "Take the Eligibility Test"):
  - New copy: *"Ready to start?"*
  - Button: "Watch the Masterclass" → `#step-1` (scroll to top)

### New step copy

**Homepage step grid (3 cards):**

| # | Title | Description |
|---|---|---|
| 1 | Watch | Start with our short masterclass that explains everything — what it takes to migrate to New Zealand, how the process works, and why having the right pathway matters. |
| 2 | Book | Ready to go deeper? Book a one-on-one consultation with a Licensed Immigration Adviser for $197 USD ($190 fee + $7 payment processing). They'll study your background and craft a tailored plan. |
| 3 | Proceed | If you decide to move forward with Horizons, your $190 consultation fee is credited toward the $2,000 USD processing fee. No wasted money. No hidden costs. |

**how-it-works Step 2 (Book) section copy:**

```
Book Your LIA Consultation

Ready to go deeper? Get personalized advice from a Licensed
Immigration Adviser — your specific situation, your visa pathway,
your timeline.

  ✓ In-Depth Profile Assessment
  ✓ Your Optimal Pathway
  ✓ Live Q&A with your LIA

Already watched the masterclass and checked our Q&A?
[Browse Q&A →]   [Watch the Masterclass ↑]

   [ 🔒 Pay $197 USD — Book My Consultation ]
```

(Replaces the time-slot picker + "Schedule My Consultation" button currently in the booking card.)

## Section 2 — `/book` page redesign + Stripe Payment Link plumbing

### New page layout

- Hero (kept, brand-900 dark): "STEP 2: BOOK YOUR CONSULTATION" / "Book Your LIA Consultation" / subtext.
- Main content area, single column, centered, max-w-3xl:
  - **Three value props** moved from sidebar to centered main content: In-Depth Profile Assessment, Your Optimal Pathway, Live Q&A with your LIA.
  - **Pricing breakdown card** (centered, max-w-xl, card style):

    ```
    Expert Consultation — 1-Hour Video Call

      Consultation Fee              $190 USD
      Payment Processing Fee          $7 USD
      ───────────────────────────────────────
      Total                         $197 USD

      $190 credited toward your $2,000 processing fee
      if you proceed → only $1,810 due to complete

      [ 🔒 Pay $197 USD — Book My Consultation ]

      Secure payment via Stripe
    ```

  - **What happens next** section (light bg, 4 numbered steps):
    1. You pay securely via Stripe
    2. You get a confirmation email instantly
    3. We email you a short form to share your situation and pick a time
    4. Your LIA video call (1 hour)

### Pay button behavior

- Same-tab redirect to Stripe Payment Link (standard checkout flow). Stripe handles the success page.
- Same Pay button copy + same link is used on the how-it-works Step 2 booking card.

### Files modified

| File | Change |
|---|---|
| `app/book/page.tsx` | **Full rewrite.** Remove `useState` form state, the form, time slot picker, sidebar layout. New single-column layout per above. Pay button uses `STRIPE_PAYMENT_LINK` from `lib/config.ts`. Page becomes a server component (no client state needed). |
| `app/how-it-works/page.tsx` | Step 2 booking card: remove time slot picker, show pricing breakdown table, replace "Schedule My Consultation" with "Pay $197 USD — Book My Consultation". Add "Already watched the masterclass and checked our Q&A?" line with `/answers` and `#step-1` links. |
| `components/qa/StickyBookCTA.tsx` | Update CTA label "Book — $190" / "Book a Consultation — $190" → "Book Consultation — $197". Link still goes to `/book` (single source of truth). |
| `app/page.tsx` | Step 2 (Book) card description references "$197 USD ($190 fee + $7 payment processing)" per new step copy table above. |
| `CLAUDE.md` | Add `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` to env vars section. Update Key Business Logic: pricing is now $197 customer total ($190 fee + $7 payment processing); $190 credited toward $2,000 processing fee = $1,810 net. |

### Files added

| File | Purpose |
|---|---|
| `lib/config.ts` | Exports `STRIPE_PAYMENT_LINK` constant. Reads `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` env var. Throws clear error at boot time if missing. |

### Env vars added

| Var | Value | Where set |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | `https://buy.stripe.com/5kQfZgdCr3KY3FpaQd5sA01` | `.env.local` for dev; Vercel env for production |

### Out-of-code tasks (Stripe dashboard)

- ✓ Phone number custom field — already configured (verified via screenshot).
- ✓ Pricing — already $197 (matches the customer total).
- 〇 (Recommended) Add custom success page text: *"Payment confirmed. Check your email — we'll send you a short form to pick your consultation time and share your situation within the next hour."*
- 〇 (Optional) Set custom success URL pointing to a thank-you page on horizonsmigration.com (skipped for v1; Stripe default success page is sufficient).

## Section 3 — Q&A submit-question feature

### UI placement on `/answers`

Inline form section below the existing Q&A grid. Heading: *"Don't see your question?"* Subhead: *"Send it to us. If it's a question others may have too, we'll answer it in a future video."* Form submit shows inline success message (no page redirect).

### Form fields (visible to user)

| Field | Required | Notes |
|---|---|---|
| Your name | no | Plain text input |
| Your email | yes | Email input, validated |
| Your question | yes | Textarea, 4–6 rows |

Below the form: *"We'll only use your email to follow up on your question. No spam, ever."*

### Hidden field (honeypot)

A CSS-hidden `<input name="_website">` field. Real users don't fill it; bots auto-fill all inputs. API silently rejects any submission with this field non-empty (returns success to fool the bot).

### On successful submission

Inline replacement of the form:
> ✓ Got it! We'll review your question. If it's a fit, you'll see it answered in a future Q&A video here.

### New schema: `submittedQuestion`

| Field | Type | Required | Notes |
|---|---|---|---|
| `question` | text | yes | 10–2000 chars. Studio doc title (preview). |
| `submitterEmail` | string | yes | Email format. Studio subtitle. |
| `submitterName` | string | no | ≤100 chars. |
| `sourceUrl` | url | no | API auto-captures from `Referer` header (e.g., `/answers` or `/answers/[slug]`). |
| `submittedAt` | datetime | yes | API sets to `new Date().toISOString()`. |
| `status` | string (list: `new`, `in-progress`, `answered`, `spam`) | yes | Default `new`. Joey changes in Studio when triaging. |
| `adminNotes` | text | no | Joey's internal notes during triage. |

Schema also has `orderings: [{ name: "submittedAtDesc", title: "Newest first", by: [{ field: "submittedAt", direction: "desc" }] }]`.

### Files added

| File | Purpose |
|---|---|
| `sanity/schemas/submittedQuestion.ts` | New schema definition |
| `components/qa/SubmitQuestionForm.tsx` | Client component: form UI, honeypot field, fetch to API, success/error states |
| `app/api/submit-question/route.ts` | POST handler: validate → honeypot check → write to Sanity |

### Files modified

| File | Change |
|---|---|
| `sanity/schemas/index.ts` | Register `submittedQuestion` |
| `lib/sanity.ts` | Add `sanityWriteClient` (server-side write client, uses existing `SANITY_API_TOKEN`, `useCdn: false`, no `perspective`). The existing read-only `sanityClient` stays as is. |
| `app/answers/page.tsx` | Render `<SubmitQuestionForm />` below the Q&A grid (and below the empty-state "No Q&As published yet" message too — submission should work either way). |

### API route flow (`POST /api/submit-question`)

1. Parse JSON body: `{ name?, email, question, _website }`.
2. **Honeypot check first:** if `_website` is non-empty, return `{ ok: true }` with status 200 (silently fool the bot — they retry less).
3. Validate:
   - `email` matches a basic email regex.
   - `question` is a string of 10–2000 chars.
   - `name` (if present) is a string ≤100 chars.
   - On any validation failure → return `{ ok: false, error: "..." }` with status 400.
4. Capture `sourceUrl` from request `Referer` header (may be absent — that's fine, store null).
5. Call `sanityWriteClient.create({ _type: "submittedQuestion", question, submitterEmail: email, submitterName: name || undefined, sourceUrl: referer || undefined, submittedAt: new Date().toISOString(), status: "new" })`.
6. Return `{ ok: true }` with status 200.
7. On Sanity write error → log server-side, return `{ ok: false, error: "Server error, please try again." }` with status 500.

### Bot defense

- **Honeypot field** (CSS-hidden input named `_website`) — catches ~80%+ of basic spam bots.
- **No rate limiting in v1.** If spam becomes a problem, add Upstash Redis rate-limit by IP later (~30 min add).
- **No CAPTCHA.** Cloudflare Turnstile is a 5-min add if needed later.

### Out-of-code tasks (Sanity dashboard)

- ⚠ **Verify `SANITY_API_TOKEN` has Editor (write) permission.** It's currently used only for read in `lib/sanity.ts`, so it may have been created read-only. Sanity Manage → API → Tokens → check role. If read-only, regenerate or create a new token with Editor role. Update `.env.local` and Vercel env var.

## Consolidated file impact

**Added (4 source files + 1 spec file = 5):**
- `lib/config.ts`
- `sanity/schemas/submittedQuestion.ts`
- `components/qa/SubmitQuestionForm.tsx`
- `app/api/submit-question/route.ts`
- `docs/superpowers/specs/2026-05-11-three-step-funnel-and-payment-design.md` (this file)

**Modified (14):**
- `app/page.tsx`
- `app/how-it-works/page.tsx`
- `app/book/page.tsx`
- `app/team/page.tsx`
- `app/success-stories/page.tsx`
- `app/answers/page.tsx`
- `app/sitemap.ts`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `components/qa/StickyBookCTA.tsx`
- `lib/sanity.ts`
- `sanity/schemas/index.ts`
- `CLAUDE.md`
- `PRD.md`

**Deleted (1 file in 1 directory):**
- `app/eligibility-test/page.tsx` (and the `app/eligibility-test/` directory itself)

## Out of scope (future work)

- Phase 2 SEO research and keyword-driven content edits (covered in `SEOStrategy.md`).
- Email notification to Joey when a new question is submitted (could be added later via Resend).
- Rate limiting on `/api/submit-question` (Upstash Redis, IP-based).
- CAPTCHA layer (Cloudflare Turnstile) on the submit form.
- Dedicated `/thank-you` page after Stripe payment (vs Stripe's default success page).
- Sanity Studio: custom "Submitted Questions" view that filters by `status == "new"` for triage.
- 301 redirect from `/eligibility-test` to `/how-it-works` (only worth doing if specific external inbound links are known to exist).

## Migration / rollout notes

- The `/eligibility-test` deletion is a hard delete. Any external inbound links will 404 after deploy. Google will drop the URL within weeks. If you discover specific external links to it later, add a Vercel rewrite redirecting to `/how-it-works`.
- The Stripe Payment Link is shared via env var — production deploy requires `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` to be set in Vercel.
- `/api/submit-question` will fail until the `SANITY_API_TOKEN` has write permission. Verify before deploy.
