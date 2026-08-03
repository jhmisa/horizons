/**
 * Per-country configuration for the Horizons website.
 *
 * Phase 1 of the multi-country expansion. NZ has real values; AU and CA
 * fall back to NZ's contact info (shared team, no AU/CA inboxes yet) but
 * have their own locale and Stripe payment link env vars.
 *
 * The legacy named exports at the bottom (STRIPE_PAYMENT_LINK, FACEBOOK_URL,
 * etc.) preserve back-compat with callers that haven't been migrated to the
 * country-aware helpers yet.
 */

export type Country = "nz" | "au" | "ca";

export const COUNTRIES: readonly Country[] = ["nz", "au", "ca"] as const;

export interface CountryConfig {
  code: Country;
  displayName: string;
  locale: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  googleReviewUrl: string;
  googleBusinessUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  /** Name of the env var holding this country's Stripe payment link. */
  stripePaymentLinkEnvVar: string;
  /** Full title of the licensed immigration adviser in this jurisdiction. */
  adviserTitle: string;
  /** Short-form abbreviation of the adviser title (LIA, RMA, RCIC). */
  adviserAbbr: string;
  /** Full name of the regulator that licenses advisers in this jurisdiction. */
  regulatorName: string;
  /** Short-form regulator abbreviation (IAA, OMARA, CICC). */
  regulatorAbbr: string;
  /** Public URL of the regulator (for future links from Footer / legal pages). */
  regulatorUrl: string;
  /** Deep-link to the regulator's adviser-search page so prospects can verify licence status. */
  regulatorVerifyUrl: string;
  /** Footer label that links to the verify page, e.g. "Verify our advisers". */
  regulatorVerifyLabel: string;
  /** Country flag as a Unicode emoji (used by CountrySwitcher and licence chips). */
  flag: string;
}

const NZ_PHONE = "+6492777162";
const NZ_PHONE_DISPLAY = "+64 9 277 7162";
const NZ_EMAIL = "hello@horizons.nz";
const NZ_ADDRESS = "East Auckland, New Zealand";
const NZ_GOOGLE_REVIEW_URL = "https://g.page/r/CQ4kDEI8MjTmEBM/review";
const NZ_GOOGLE_BUSINESS_URL = "https://share.google/V3QOVnyePnOEZRTnH";
const NZ_FACEBOOK_URL = "https://www.facebook.com/consulthorizons/";
const NZ_YOUTUBE_URL = "https://www.youtube.com/@Horizons_NZ";

export const countryConfig: Record<Country, CountryConfig> = {
  nz: {
    code: "nz",
    displayName: "New Zealand",
    locale: "en-NZ",
    phone: NZ_PHONE,
    phoneDisplay: NZ_PHONE_DISPLAY,
    email: NZ_EMAIL,
    address: NZ_ADDRESS,
    googleReviewUrl: NZ_GOOGLE_REVIEW_URL,
    googleBusinessUrl: NZ_GOOGLE_BUSINESS_URL,
    facebookUrl: NZ_FACEBOOK_URL,
    youtubeUrl: NZ_YOUTUBE_URL,
    stripePaymentLinkEnvVar: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_NZ",
    adviserTitle: "Licensed Immigration Adviser",
    adviserAbbr: "LIA",
    regulatorName: "Immigration Advisers Authority",
    regulatorAbbr: "IAA",
    regulatorUrl: "https://www.iaa.govt.nz",
    regulatorVerifyUrl: "https://www.iaa.govt.nz/for-people-needing-advice/find-a-licensed-immigration-adviser/",
    regulatorVerifyLabel: "Verify our advisers",
    flag: "🇳🇿",
  },
  au: {
    code: "au",
    displayName: "Australia",
    locale: "en-AU",
    // Shared team; no AU-specific contact info yet — fall back to NZ.
    phone: NZ_PHONE,
    phoneDisplay: NZ_PHONE_DISPLAY,
    email: NZ_EMAIL,
    address: NZ_ADDRESS,
    googleReviewUrl: NZ_GOOGLE_REVIEW_URL,
    googleBusinessUrl: NZ_GOOGLE_BUSINESS_URL,
    facebookUrl: NZ_FACEBOOK_URL,
    youtubeUrl: NZ_YOUTUBE_URL,
    stripePaymentLinkEnvVar: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AU",
    adviserTitle: "Registered Migration Agent",
    adviserAbbr: "RMA",
    regulatorName: "Office of the Migration Agents Registration Authority",
    regulatorAbbr: "OMARA",
    regulatorUrl: "https://www.mara.gov.au",
    regulatorVerifyUrl: "https://www.mara.gov.au/search-the-register-of-migration-agents",
    regulatorVerifyLabel: "Verify our agents",
    flag: "🇦🇺",
  },
  ca: {
    code: "ca",
    displayName: "Canada",
    locale: "en-CA",
    // Shared team; no CA-specific contact info yet — fall back to NZ.
    phone: NZ_PHONE,
    phoneDisplay: NZ_PHONE_DISPLAY,
    email: NZ_EMAIL,
    address: NZ_ADDRESS,
    googleReviewUrl: NZ_GOOGLE_REVIEW_URL,
    googleBusinessUrl: NZ_GOOGLE_BUSINESS_URL,
    facebookUrl: NZ_FACEBOOK_URL,
    youtubeUrl: NZ_YOUTUBE_URL,
    stripePaymentLinkEnvVar: "NEXT_PUBLIC_STRIPE_PAYMENT_LINK_CA",
    adviserTitle: "Regulated Canadian Immigration Consultant",
    adviserAbbr: "RCIC",
    regulatorName: "College of Immigration and Citizenship Consultants",
    regulatorAbbr: "CICC",
    regulatorUrl: "https://college-ic.ca",
    regulatorVerifyUrl: "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant?l=en-US",
    regulatorVerifyLabel: "Verify our consultants",
    flag: "🇨🇦",
  },
};

/**
 * Look up a country's config. Throws if the country isn't a valid Country —
 * defensive only; type-safe callers should never trigger this.
 */
export function getCountryConfig(country: Country): CountryConfig {
  const config = countryConfig[country];
  if (!config) {
    throw new Error(
      `Unknown country: ${String(country)}. Expected one of: ${COUNTRIES.join(", ")}`,
    );
  }
  return config;
}

/**
 * Resolve the Stripe payment link for a country. Tries the per-country env var
 * (e.g. NEXT_PUBLIC_STRIPE_PAYMENT_LINK_AU) first, then falls back to the
 * legacy single env var NEXT_PUBLIC_STRIPE_PAYMENT_LINK. Throws if neither is
 * set so deployment misconfiguration fails loudly at call-time.
 */
export function getStripeLink(country: Country): string {
  const config = getCountryConfig(country);
  const perCountry = process.env[config.stripePaymentLinkEnvVar];
  if (perCountry) return perCountry;

  const legacy = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  if (legacy) return legacy;

  throw new Error(
    `Missing Stripe payment link for country "${country}". Set either ${config.stripePaymentLinkEnvVar} or NEXT_PUBLIC_STRIPE_PAYMENT_LINK.`,
  );
}

/**
 * Flexible-amount Stripe Payment Link for existing clients paying invoices
 * (any amount, USD). Fail-soft: returns null when unset so /pay can render a
 * fallback message instead of crashing — unlike the booking flow, this page
 * is only reached via direct links the team sends out.
 */
export function getFlexPaymentLink(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_FLEX_PAYMENT_LINK || null;
}

/**
 * Site-wide config not tied to a specific country.
 * siteUrl falls back to https://www.horizons.nz so the build doesn't break
 * when NEXT_PUBLIC_SITE_URL isn't set (e.g. local dev, preview deploys).
 */
export const sharedConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.horizons.nz",
} as const;

// ---------------------------------------------------------------------------
// Backwards-compatibility aliases
// ---------------------------------------------------------------------------
// These resolve at module load (same blast radius as before) so callers that
// import the old names keep working until they're migrated to country-aware
// helpers in a later task.

/**
 * @deprecated Use `getStripeLink('nz')` instead. Kept for backwards
 * compatibility with callers not yet updated to country-aware booking.
 */
export const STRIPE_PAYMENT_LINK: string = getStripeLink("nz");

export const GOOGLE_REVIEW_URL: string = countryConfig.nz.googleReviewUrl;
export const GOOGLE_BUSINESS_URL: string = countryConfig.nz.googleBusinessUrl;
export const FACEBOOK_URL: string = countryConfig.nz.facebookUrl;
export const YOUTUBE_URL: string = countryConfig.nz.youtubeUrl;
