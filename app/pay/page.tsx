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
