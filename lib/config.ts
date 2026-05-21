const STRIPE_PAYMENT_LINK_RAW = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

if (!STRIPE_PAYMENT_LINK_RAW) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_STRIPE_PAYMENT_LINK"
  );
}

export const STRIPE_PAYMENT_LINK: string = STRIPE_PAYMENT_LINK_RAW;

export const GOOGLE_REVIEW_URL: string =
  "https://g.page/r/CQ4kDEI8MjTmEBM/review";
