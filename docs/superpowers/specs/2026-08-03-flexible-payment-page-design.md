# Flexible Payment Page (/pay) — Design Spec

**Date:** 2026-08-03
**Status:** Approved design, pending implementation plan

## Purpose

Existing clients owe amounts beyond the fixed $197 consultation (service fees, downpayments toward the $2,000 processing fee, etc.). The team's process: they email the client an invoice with a **pre-computed total** (4% card processing fee already included) and a payment link. The client opens the link and pays that exact amount.

This adds a branded `/pay` page + a flexible-amount Stripe Payment Link. The fixed $197 `/book` flow is unchanged.

## Decisions (from Joey, 2026-08-03)

- Dedicated **/pay** page, with a cross-link to `/book` for people who landed on the wrong page.
- **No calculator** — the invoice email already states the exact total to pay.
- Fee: **4%, paid by the customer**, pre-computed by the team into the invoice total. The page only reminds the client that the invoice amount already includes it.
- Capture **name + email**: email is collected automatically by Stripe checkout; "Client full name" is a required custom field on the Payment Link.
- **USD only.**
- **No minimum amount** on the link — Joey wants to run a small live test transaction first. (Stripe's absolute floor of $0.50 USD applies regardless.) A minimum can be added in the Stripe dashboard later without code changes.

## Architecture

Same pattern as the existing $197 flow: Stripe hosts all payment processing via a Payment Link; the site only renders a branded page with a button. **No payment code, no secret keys, no webhooks.**

### 1. Stripe Payment Link (dashboard, guided — Joey does this with Claude's step-by-step help)

- Type: "Customers choose what to pay", currency USD, no preset/minimum (beyond Stripe's floor).
- Required custom field: "Client full name" (text).
- Email: collected automatically by Stripe checkout.
- After-payment: Stripe's default confirmation page (consistent with the $197 link's current behavior).

### 2. `/pay` page (`app/pay/page.tsx` + `components/pages/PayPage.tsx`)

Visual language mirrors `/book` (dark `brand-900` header with dot pattern, white cards, `rounded-2xl`, existing button styles):

- **Header:** "Make a Payment" — subline: "For existing Horizons clients paying an invoice."
- **Instruction card (3 steps):**
  1. Find the total in the invoice email we sent you.
  2. Click "Pay with Stripe" below.
  3. On the Stripe page, enter that exact amount, your full name, and your email.
- **Primary button:** "Pay with Stripe" → the flexible Payment Link (new tab not required; same-tab like /book).
- **Fee note:** "The amount in your invoice already includes the 4% card processing fee — pay exactly what's shown."
- **Trust elements:** "Secure payment via Stripe." Licensed Immigration Adviser line (Rowel Mercado, IAA #200900577) consistent with sitewide E-E-A-T work.
- **Cross-link banner:** "Booking your first consultation instead? Go to the booking page →" → `/book`.
- **If the env var is missing:** page still renders but the button is replaced with "Payment link unavailable — please use the link in your invoice email." (Same fail-soft philosophy as the existing config fallback; do not crash the page.)

### 3. Config

- New env var `NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK` (single link, not per-country — flexible payments are client-specific, not country-funnel-specific).
- Added to `.env.local.example`, `.env.local`, and Vercel project env (Joey adds in Vercel dashboard or Claude guides).
- Accessor in `lib/config.ts` following the existing `getStripeLink` pattern.

### 4. SEO hygiene

- `robots: { index: false, follow: false }` in the page metadata — this page is for direct-linked existing clients only.
- Excluded from `app/sitemap.ts` (static pages are listed explicitly there; simply don't add it).

## Out of scope (YAGNI)

- Payment history/reconciliation on the site (Stripe dashboard + invoice emails are the source of truth).
- Auto-added fees, amount prefill, or server-side checkout sessions.
- NZD/PHP currencies, per-country links.
- Client login/portal.
- `client_reference_id` tagging (the $197 link appends it for funnel attribution; /pay is not a funnel page — the name field + email cover reconciliation).

## Testing

- Unit: PayPage renders the three steps, fee note, Stripe button with the env-var href, /book cross-link, and the fail-soft state when the env var is absent (vitest + testing-library, matching `app/about/__tests__` patterns).
- Manual: Joey runs a small live transaction (e.g. $1) end-to-end to confirm money lands and the name/email appear in the Stripe dashboard.
