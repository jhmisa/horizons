import type { Metadata } from "next";
import HowItWorks from "@/components/pages/HowItWorks";

export const metadata: Metadata = {
  title: "How It Works | 3 Steps to New Zealand | Horizons Immigration",
  description:
    "Follow our transparent, proven 3-step path to secure your family's future in New Zealand.",
  alternates: { canonical: "/how-it-works" },
};

export default function Page() {
  return <HowItWorks country="nz" />;
}
