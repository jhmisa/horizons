# Flexible Payment Page (/pay) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/pay` page from `docs/superpowers/specs/2026-08-03-flexible-payment-page-design.md` — a branded page sending existing clients to the flexible-amount Stripe Payment Link.

**Architecture:** Same zero-payment-code pattern as `/book`: a static page linking to a Stripe-hosted Payment Link. New fail-soft config accessor (`getFlexPaymentLink`) returns `null` when the env var is missing so the page degrades instead of crashing. Page is noindexed and omitted from the sitemap.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind (existing brand classes), vitest + @testing-library/react.

**Known values:**
- Payment Link URL (already created by Joey): `https://buy.stripe.com/14AcN49mb81e5Nxe2p5sA02`
- Env var name: `NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK`
- Fee message: the invoice total already includes the 4% card processing fee.
- Stripe link collects full name (required) + email (automatic). USD.

---

### Task 1: Config accessor + env vars

**Files:**
- Modify: `lib/config.ts` (after `getStripeLink`, ~line 160)
- Modify: `.env.local.example`
- Modify: `.env.local` (developer machine)

- [ ] **Step 1: Add the accessor to `lib/config.ts`**

Insert after the closing brace of `getStripeLink` (before the `sharedConfig` comment block):

```typescript
/**
 * Flexible-amount Stripe Payment Link for existing clients paying invoices
 * (any amount, USD). Fail-soft: returns null when unset so /pay can render a
 * fallback message instead of crashing — unlike the booking flow, this page
 * is only reached via direct links the team sends out.
 */
export function getFlexPaymentLink(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK || null;
}
```

- [ ] **Step 2: Add env var to both env files**

Append to `.env.local.example`:

```
NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK=
```

Append to `.env.local`:

```
NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK=https://buy.stripe.com/14AcN49mb81e5Nxe2p5sA02
```

- [ ] **Step 3: Commit**

```bash
git add lib/config.ts .env.local.example
git commit -m "feat(pay): flexible payment link config accessor"
```

(`.env.local` is gitignored — never commit it.)

---

### Task 2: PayPage component + /pay route (TDD)

**Files:**
- Create: `components/pages/PayPage.tsx`
- Create: `app/pay/page.tsx`
- Test: `app/pay/__tests__/page.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `app/pay/__tests__/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PayPage from "@/components/pages/PayPage";
import { metadata } from "../page";

const STRIPE_URL = "https://buy.stripe.com/test_flex123";

describe("PayPage", () => {
  it("renders the Make a Payment heading", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Make a Payment/i }),
    ).toBeInTheDocument();
  });

  it("renders the three instruction steps referencing the invoice email", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    expect(screen.getByText(/Find your amount/i)).toBeInTheDocument();
    expect(screen.getAllByText(/invoice email/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Enter the amount/i)).toBeInTheDocument();
  });

  it("explains the 4% fee is already included", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    expect(
      screen.getByText(/already includes the 4% card processing fee/i),
    ).toBeInTheDocument();
  });

  it("links the pay button to the Stripe payment link", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    const btn = screen.getByRole("link", { name: /Pay with Stripe/i });
    expect(btn).toHaveAttribute("href", STRIPE_URL);
  });

  it("cross-links to the booking page", () => {
    render(<PayPage stripeUrl={STRIPE_URL} />);
    const link = screen.getByRole("link", { name: /booking page/i });
    expect(link).toHaveAttribute("href", "/book");
  });

  it("shows a fallback instead of the pay button when the link is not configured", () => {
    render(<PayPage stripeUrl={null} />);
    expect(
      screen.getByText(/Payment link unavailable/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Pay with Stripe/i }),
    ).not.toBeInTheDocument();
  });
});

describe("metadata", () => {
  it("is noindexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/pay`
Expected: FAIL — cannot resolve `@/components/pages/PayPage` / `../page`.

- [ ] **Step 3: Create `components/pages/PayPage.tsx`**

```tsx
import Link from "next/link";

const STEPS = [
  {
    num: 1,
    title: "Find your amount",
    desc: "Open the invoice email we sent you — it shows the exact USD total to pay.",
  },
  {
    num: 2,
    title: "Click Pay with Stripe",
    desc: "You'll be taken to our secure Stripe payment page.",
  },
  {
    num: 3,
    title: "Enter the amount",
    desc: "Type the exact amount from your invoice, plus your full name and email address, then pay.",
  },
];

export default function PayPage({ stripeUrl }: { stripeUrl: string | null }) {
  return (
    <>
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            FOR EXISTING CLIENTS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Make a Payment
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            Pay an invoice from Horizons Immigration in USD — enter the exact
            amount from your invoice email.
          </p>
        </div>
      </header>

      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 lg:p-10">
            <ol className="space-y-6 mb-8">
              {STEPS.map((step) => (
                <li key={step.num} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h2 className="font-bold text-accent text-lg">
                      {step.title}
                    </h2>
                    <p className="text-accent-600 text-sm mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-sm text-accent-600 bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8">
              <i className="fa-solid fa-circle-info text-brand-600 mr-2" />
              The amount in your invoice already includes the 4% card
              processing fee — pay exactly what&rsquo;s shown.
            </p>

            {stripeUrl ? (
              <a
                href={stripeUrl}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-lock" /> Pay with Stripe
              </a>
            ) : (
              <p className="text-center text-accent-600 font-medium py-4">
                Payment link unavailable — please use the link in your invoice
                email.
              </p>
            )}

            <p className="text-center text-sm text-accent-500 mt-4">
              Secure payment via Stripe.
            </p>
          </div>

          <p className="text-center text-sm text-accent-500 mt-8">
            Licensed Immigration Adviser: Rowel Mercado — IAA #200900577
          </p>

          <div className="mt-10 bg-brand-900 rounded-2xl p-6 text-center">
            <p className="text-brand-100">
              Booking your first consultation instead?{" "}
              <Link
                href="/book"
                className="text-white font-bold underline hover:text-brand-100"
              >
                Go to the booking page →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Create `app/pay/page.tsx`**

```tsx
import type { Metadata } from "next";
import PayPage from "@/components/pages/PayPage";
import { getFlexPaymentLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Make a Payment | Horizons Immigration",
  description:
    "Pay a Horizons Immigration invoice securely via Stripe. Enter the exact USD amount from your invoice email.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pay" },
};

export default function Page() {
  return <PayPage stripeUrl={getFlexPaymentLink()} />;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run app/pay`
Expected: PASS (7 tests).

Run the full suite: `npx vitest run` — everything green.

- [ ] **Step 6: Sitemap check (no change expected)**

Run: `grep -n "pay" app/sitemap.ts`
Expected: no `/pay` entry (static pages are listed explicitly; we simply don't add it). If the sitemap enumerates routes dynamically in a way that would include `/pay`, exclude it and note the change.

- [ ] **Step 7: Browser + build verification**

With the dev server on port 3000 (`npm run dev` if not running):

```bash
curl -s http://localhost:3000/pay | grep -o "Make a Payment\|buy.stripe.com/14AcN49mb81e5Nxe2p5sA02\|noindex" | sort | uniq -c
```

Expected: all three present (the Stripe URL comes from `.env.local`; `noindex` appears in the robots meta tag).

Run: `npm run build`
Expected: compiles successfully; `/pay` listed in the route output.

- [ ] **Step 8: Commit**

```bash
git add components/pages/PayPage.tsx app/pay
git commit -m "feat(pay): /pay page for flexible-amount client payments via Stripe"
```

---

### Task 3: Vercel env var + deploy + live test (guided, human steps)

- [ ] **Step 1: Add the env var in Vercel (Joey, guided)**

Vercel dashboard → Horizons project → Settings → Environment Variables → Add:
- Key: `NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK`
- Value: `https://buy.stripe.com/14AcN49mb81e5Nxe2p5sA02`
- Environments: Production (Preview optional)

- [ ] **Step 2: Deploy**

Joey says "push to main" (push-to-main skill: version bump, push, Vercel auto-deploys). The env var takes effect on this new build.

- [ ] **Step 3: Live smoke test (Joey)**

1. Open `https://www.horizonsimmigration.com/pay` — page renders, button present.
2. Click through and make a **small test payment** (e.g. $1) with a real card, entering a name + email.
3. Verify in the Stripe dashboard: the payment appears with the name and email attached.
4. Optionally refund the test payment from the Stripe dashboard (Payments → select → Refund).

---

## Self-review notes

- Spec coverage: page content/fallback (Task 2), config (Task 1), noindex + sitemap (Task 2 Steps 4/6), Stripe link already created, Vercel + live test (Task 3). Fee calculator intentionally absent per spec.
- Type consistency: `getFlexPaymentLink(): string | null` matches `PayPage`'s `stripeUrl: string | null` prop.
