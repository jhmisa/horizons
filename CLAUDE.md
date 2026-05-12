# Horizons Immigration Website

## Project Overview

Immigration consulting business website built with Next.js. Guides prospective clients through a 3-step process (Watch → Book → Proceed) to migrate to New Zealand or Australia.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity (blog posts, team members, success stories)
- **Payments:** Stripe Payment Link
- **Email:** Resend (notifications to team + client confirmations)
- **Deployment:** Vercel

## Project Structure

```
/app
  /page.tsx                     # Homepage
  /how-it-works/page.tsx        # 3-step process detail
  /book/page.tsx                # Booking via Stripe Payment Link ($197 = $190 + $7 fee)
  /team/page.tsx                # Team member profiles
  /blog/page.tsx                # Blog listing
  /blog/[slug]/page.tsx         # Individual blog post
  /success-stories/page.tsx     # Client testimonials
  /api/submit-question/route.ts # Receive Q&A submissions, write to Sanity
  /layout.tsx                   # Root layout (nav + footer)
/components
  /ui/                          # Reusable UI components (Button, Card, Badge, etc.)
  /layout/                      # Nav, Footer, MobileMenu
  /sections/                    # Page-specific section components
/lib
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
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=

# Resend
RESEND_API_KEY=
NOTIFICATION_EMAIL=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
```

## Key Business Logic

- **Booking:** Client pays $197 USD ($190 consultation fee + $7 payment processing fee) via Stripe Payment Link. Stripe captures email + name + phone. After payment, team emails a short follow-up form to gather situation details and schedule the consultation time.
- **Processing Fee:** Separate $2,000 USD payment triggered after consultation. The $190 (not the $197) is credited, so the remaining = $1,810.
- **CMS Content:** Blog posts, team members, and success stories are managed in Sanity Studio by non-technical team members.

## Content & SEO Workflows

**MUST READ before any work involving Sanity content (Q&A, blog posts, success stories), SEO research, or content publishing tasks: [`SEOStrategy.md`](./SEOStrategy.md).**

That file is the source of truth for:
- Target audience (Filipinos in PH and OFWs in countries that block long-term residency — Singapore, HK, UAE, Saudi, etc.)
- Workflows: what to do when given a Q&A transcript, what to do when given a blog idea
- Channel strategy (Mux primary on-site; YouTube deferred to Phase 3)
- Sanity schema status, conventions, and project IDs
- Phasing (Phase 1: populate Q&A backlog; Phase 2: SEO research; Phase 3: YouTube)

## Reference Files

- `SEOStrategy.md` — SEO + content strategy and Claude workflows for content
- `PRD.md` — Full product requirements document
- `index.html` — Original static homepage (design reference)
- `how-it-works.html` — Original static process page (design reference)
