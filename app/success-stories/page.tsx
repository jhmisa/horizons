import type { Metadata } from "next";
import SuccessStoriesIndex from "@/components/pages/SuccessStoriesIndex";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Success Stories | Horizons Immigration",
  description:
    "Hear from families who successfully migrated to New Zealand with Horizons Immigration.",
  alternates: { canonical: "/success-stories" },
};

export default function Page() {
  return <SuccessStoriesIndex country="nz" />;
}
