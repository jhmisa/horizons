# Horizons Immigration — Product Requirements Document

## Overview

Horizons Immigration is a Licensed Immigration Advisory business based in East Auckland, New Zealand. The website serves as the primary client acquisition funnel, guiding prospective immigrants through a transparent 4-step process toward migrating to New Zealand or Australia.

**Goal:** Create an easy-to-understand website that clearly explains the migration process and converts visitors into booked consultations.

---

## Brand Identity

- **Company:** Horizons Immigration
- **Tagline:** Expert Immigration Advisers
- **Established:** 2005 (20+ years of service)
- **Location:** East Auckland, New Zealand
- **Contact:** info@horizonsmigration.com | +64 (0) 9 000 0000
- **Social:** Facebook (12.5k+ Likes), YouTube, Instagram
- **Credentials:** Licensed Immigration Advisers, regulated by the Immigration Advisers Authority (IAA)
- **Stats:** 850+ successful migrations, 4.7★ Google Reviews (142 reviews)

---

## Design System

### Colors (Brand Palette)
| Token | Hex | Usage |
|-------|-----|-------|
| brand-50 | #f0f9ff | Light backgrounds, icon backgrounds |
| brand-100 | #e0f2fe | Subtle highlights, badges |
| brand-500 | #0ea5e9 | Accent, icons, links |
| brand-600 | #0284c7 | Primary buttons, CTA, active nav |
| brand-800 | #075985 | Hover states, dark accents |
| brand-900 | #0c4a6e | Dark sections (Why LIA, Final CTA) |

### Typography
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Weights:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- **Base:** text-slate-800 on bg-slate-50

### Components
- **Buttons:** Rounded-full, brand-600 bg, shadow, hover lift (-translate-y)
- **Cards:** Rounded-2xl, white bg, shadow-md, border border-slate-100
- **Sections:** Alternating bg-white / bg-slate-50 / bg-brand-900 (dark)
- **Animations:** fade-in-up (0.8s ease-out), staggered delays (100ms, 200ms, 300ms)
- **Icons:** FontAwesome 6.4.0

---

## Pages & Features

### 1. Homepage (`/`)

**Purpose:** Landing page that hooks visitors with the value proposition and funnels them to How It Works.

**Sections (top to bottom):**

1. **Navigation** (shared)
   - Fixed/sticky, white/95 backdrop-blur
   - Logo: Globe icon + "Horizons." text
   - Links: Home, How It Works, Why an LIA?, Success Stories
   - CTA button: "Check Eligibility" (rounded-full, brand-600)
   - Mobile: hamburger menu

2. **Hero Section**
   - Background: Full-width image with dark overlay
   - Badge: "EXPERT IMMIGRATION ADVISERS"
   - Headline: "You've Been Dreaming About This. Let's Make It Real."
   - Subtext: Value proposition about 20 years, Licensed Advisers, honest advice
   - Social proof badges: Google 4.7★ rating, Facebook 12.5k+ Likes
   - **Video embed** (right column on desktop): Short explainer video about the migration process
   - **Primary CTA:** "See If You Qualify — It Takes 2 Minutes" → links to How It Works

3. **Trust Bar** (overlapping hero bottom)
   - 4 stats in glass-morphism card: 20 Years, 850+ Migrations, Licensed, 4.7★ Google Reviews

4. **Four Simple Steps Preview**
   - Heading: "Four Simple Steps to Your New Life"
   - 4 cards (Watch, Test, Book, Proceed) with icons, step numbers, descriptions
   - CTA: "Explore the Full 4-Step Process" → /how-it-works

5. **Why a Licensed Immigration Adviser** (`#why-lia`)
   - Dark section (brand-900)
   - Heading: "Getting There Is Only Half the Story"
   - Explanation of LIA role, legal requirements, IAA regulation
   - Image card with "Registered & Licensed" overlay
   - Floating "100% Legal Representation" badge

6. **Social Proof / Success Stories** (`#success-stories`)
   - Heading: "Trusted by Hundreds of Families Since 2005"
   - 3 video testimonial cards (thumbnail + YouTube play button + caption)
   - Google Reviews widget (4.7/5, 142 reviews, sample quote)
   - Facebook community stats (12,500+ members)
   - Link: "Read More Success Stories" → /success-stories

7. **Blog Preview**
   - Heading: "Guides & Insights from Our Team"
   - 3 latest blog post cards (image, category tag, title, excerpt, "Read Article" link)
   - "View All Articles" link → /blog

8. **Final CTA** (`#eligibility`)
   - Dark section (brand-900) with dot pattern background
   - Heading: "Your family's next chapter is waiting."
   - CTA: "Check My Eligibility — Free" → /eligibility-test
   - Trust note: "100% Confidential. Results delivered instantly."

9. **Footer** (shared)
   - Brand logo + tagline
   - Social links (Facebook, YouTube, Instagram)
   - Explore links: Home, About Us, How It Works, Meet the Team, Migrate to NZ, Migrate to AU, Success Stories
   - Resources links: Free Eligibility Test, Why Use an LIA?, Immigration Blog, FAQ
   - Contact: Address, email, phone
   - Bottom bar: Copyright, Privacy Policy, Terms of Service, IAA Code of Conduct

---

### 2. How It Works (`/how-it-works`)

**Purpose:** Detailed breakdown of the 4-step client journey. This is the core conversion page.

**Sections:**

1. **Page Header**
   - Dark section (brand-900) with dot pattern
   - Badge: "YOUR ROADMAP TO DOWN UNDER"
   - Heading: "Four Simple Steps to Your New Life"
   - Subtext about transparent, proven path

2. **Step 1: Watch** (`#step-1`)
   - Left: Step number, heading "Start with the Masterclass.", description, checklist
   - Right: Video player (large, rounded, play button overlay)
   - Checklist items:
     - Current immigration landscape in NZ & AU
     - The role of a Licensed Immigration Adviser
     - What to expect regarding costs and timelines

3. **Step 2: Test** (`#step-2`)
   - Left: Interactive quiz mockup UI (country selection: NZ / Australia / Both)
   - Right: Step number, heading "Take the Eligibility Test.", description, privacy note
   - Quiz features: "Free Evaluation" badge, "2 Mins" indicator
   - CTA: "Start My Eligibility Test" → /eligibility-test

4. **Step 3: Book** (`#step-3`)
   - Left: Step number, heading "Book Your LIA Consultation.", description, 3 feature cards
   - Right: Dark booking card with:
     - "Expert Consultation" heading
     - Price: $190 USD
     - "Fully creditable (See Step 4)" note
     - Time slot selector (2-3 preferred slots)
     - CTA: "Schedule My Consultation"
   - Features listed:
     - In-Depth Profile Assessment
     - Your Optimal Pathway
     - Live Q&A

5. **Step 4: Proceed** (`#step-4`)
   - Left: Pricing timeline graphic showing:
     - A: Consultation Fee — $190
     - B: Full Processing Fee — $2,000
     - Result: You Pay to Proceed — $1,810 (the $190 is fully credited)
   - Right: Step number, heading "Proceed with No Surprises.", description
   - Included services:
     - Full document preparation and review
     - Direct liaison with Immigration NZ/Australia
     - Ongoing support until a decision is reached

6. **Final CTA**
   - "Ready to take Step 1?"
   - CTA: "Take the Eligibility Test" → /eligibility-test

7. **Footer** (shared)

---

### 3. Eligibility Test (`/eligibility-test`)

**Purpose:** 2-minute interactive quiz that assesses the visitor's eligibility and captures their information.

**Requirements:**
- Multi-step form (quiz-style), approximately 8-12 questions
- Questions cover: target country, nationality, age, education level, work experience (years + field), English proficiency, family situation, financial readiness
- Progress bar showing completion
- On submit:
  - Show results on-screen (recommended pathway + eligibility indication)
  - Save all answers to **Google Sheets** via Google Sheets API (service account)
  - Send **email notification** to team via Resend (new submission alert)
- Columns in Google Sheet: timestamp, name, email, phone, all answers, recommended pathway, score
- CTA after results: "Book Your Consultation" → /book
- Privacy note: "100% Confidential"

---

### 4. Book Consultation (`/book`)

**Purpose:** Collect preferred time slots and payment for the $190 consultation.

**Requirements:**
- Client info form: name, email, phone, brief note about their situation
- Custom date/time picker: client selects 2-3 preferred time slots
- **Stripe Checkout** for $190 USD payment
- On successful payment:
  - Redirect to confirmation/thank-you page
  - Email notification to team (via Resend) with client info + preferred slots
  - Confirmation email to client
- Team manually confirms final appointment time via email

---

### 5. Team Page (`/team`)

**Purpose:** Build trust by showcasing the team of Licensed Immigration Advisers.

**Requirements:**
- Team member cards: photo, name, title/role, short bio
- Content managed via **Sanity CMS**
- Responsive grid layout (1 col mobile, 2 col tablet, 3-4 col desktop)

---

### 6. Blog (`/blog` and `/blog/[slug]`)

**Purpose:** SEO content and education. Builds authority and trust.

**Requirements:**

**Listing page (`/blog`):**
- Grid of blog post cards (image, category, title, excerpt, date, "Read Article" link)
- Category/tag filtering
- Pagination or load more

**Post page (`/blog/[slug]`):**
- Full rich-text content (headings, images, lists, links, etc.)
- Author info
- Category tags
- Related posts at bottom
- SEO metadata (title, description, Open Graph image)

**Content managed via Sanity CMS.** Schema:
- Title, slug, excerpt, body (rich text), featured image, category, author, published date

---

### 7. Success Stories (`/success-stories`)

**Purpose:** Social proof through real client testimonials.

**Requirements:**
- Testimonial cards with: client name/family, country of origin, visa category, quote/story, optional video embed
- Content managed via **Sanity CMS**
- Mix of video and text testimonials

---

## Integrations

### Stripe
- **$190 consultation booking** — Stripe Checkout session via Next.js API route
- **$2,000 processing fee** — Separate Stripe Checkout session (triggered after consultation)
- Webhook handler at `/api/stripe/webhook` for payment confirmation
- Success/cancel redirect pages
- Test mode for development

### Google Sheets
- Service account authentication
- API route at `/api/eligibility/submit` to append rows
- Sheet columns: timestamp, name, email, phone, answers (JSON), recommended pathway, score

### Resend (Email)
- New eligibility test submission → email to team
- New booking + payment confirmed → email to team (with client info + preferred time slots)
- Booking confirmation → email to client

### Sanity CMS
- Content types: Blog Post, Team Member, Success Story
- Sanity Studio for non-technical content management
- Integration via `next-sanity` package
- Image hosting via Sanity CDN

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Payments | Stripe (Checkout + Webhooks) |
| CMS | Sanity (blog, team, success stories) |
| Email | Resend |
| Data Storage | Google Sheets API (eligibility results) |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Icons | FontAwesome 6 or Lucide React |
| Deployment | Vercel |

---

## Costs

| Service | Free Tier | Paid (if needed) |
|---------|-----------|-------------------|
| Sanity CMS | 100K API req/mo, 10GB bandwidth, 3 users | $15/user/mo |
| Resend | 100 emails/day, 3K/month | $20/mo for 50K |
| Stripe | No monthly fee | 2.9% + $0.30 per transaction |
| Google Sheets API | Free | Free |
| Vercel | Generous free tier | $20/mo Pro |
| Next.js / Tailwind | Open source | Free |

**Total recurring cost at launch: $0/month** (beyond Stripe transaction fees)
