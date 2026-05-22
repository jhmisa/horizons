import type { Metadata } from "next";
import HowItWorks from "@/components/pages/HowItWorks";

export const metadata: Metadata = {
  title: "How It Works | 3 Steps to Australia | Horizons Immigration",
  description:
    "Watch, book, proceed. Our proven 3-step path to migrate your family to Australia with expert guidance.",
  alternates: { canonical: "/au/how-it-works" },
};

export default function Page() {
  return <HowItWorks country="au" />;
}
