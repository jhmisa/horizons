# Horizons Immigration Website

## Project Overview

Immigration consulting business website built with Next.js. Guides prospective clients through a 4-step process (Watch → Test → Book → Proceed) to migrate to New Zealand or Australia.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity (blog posts, team members, success stories)
- **Payments:** Stripe (Checkout Sessions + Webhooks)
- **Email:** Resend (notifications to team + client confirmations)
- **Data:** Google Sheets API (eligibility test results)
- **Deployment:** Vercel

## Project Structure

```
/app
  /page.tsx                     # Homepage
  /how-it-works/page.tsx        # 4-step process detail
  /eligibility-test/page.tsx    # Interactive quiz
  /book/page.tsx                # Booking + Stripe payment ($190)
  /team/page.tsx                # Team member profiles
  /blog/page.tsx                # Blog listing
  /blog/[slug]/page.tsx         # Individual blog post
  /success-stories/page.tsx     # Client testimonials
  /api/stripe/checkout/route.ts # Create Stripe Checkout session
  /api/stripe/webhook/route.ts  # Handle Stripe webhook events
  /api/eligibility/submit/route.ts # Save to Google Sheets + send email
  /layout.tsx                   # Root layout (nav + footer)
/components
  /ui/                          # Reusable UI components (Button, Card, Badge, etc.)
  /layout/                      # Nav, Footer, MobileMenu
  /sections/                    # Page-specific section components
/lib
  /stripe.ts                    # Stripe client config
  /sheets.ts                    # Google Sheets API helper
  /sanity.ts                    # Sanity client + queries
  /resend.ts                    # Email sending helper
/sanity
  /schemas/                     # Sanity content type schemas
```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Design System

### Brand Colors
- `brand-50`: #f0f9ff — Light backgrounds
- `brand-100`: #e0f2fe — Subtle highlights
- `brand-500`: #0ea5e9 — Accents, icons
- `brand-600`: #0284c7 — Primary CTA, buttons
- `brand-800`: #075985 — Hover states
- `brand-900`: #0c4a6e — Dark sections

### Typography
- Font: Plus Jakarta Sans (weights: 300-800)
- Body text: text-slate-800 on bg-slate-50

### Component Patterns
- Buttons: `rounded-full`, `bg-brand-600`, shadow, hover lift
- Cards: `rounded-2xl`, white bg, `shadow-md`, `border border-slate-100`
- Dark sections: `bg-brand-900` with dot-pattern overlay
- Animations: `fade-in-up` (0.8s) with staggered delays

## Environment Variables

```
# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=

# Resend
RESEND_API_KEY=
NOTIFICATION_EMAIL=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
```

## Key Business Logic

- **Eligibility Test:** Multi-step quiz (~2 min). Results saved to Google Sheets + email sent to team via Resend.
- **Booking:** Client selects 2-3 preferred time slots + pays $190 via Stripe Checkout. Team confirms final time via email.
- **Processing Fee:** Separate $2,000 Stripe Checkout (triggered after consultation). The $190 is credited, so remaining = $1,810.
- **CMS Content:** Blog posts, team members, and success stories are managed in Sanity Studio by non-technical team members.

## Reference Files

- `PRD.md` — Full product requirements document
- `index.html` — Original static homepage (design reference)
- `how-it-works.html` — Original static process page (design reference)
