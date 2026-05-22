import type { Metadata } from "next";
import ComingSoonShell from "@/components/pages/ComingSoonShell";
import { getCountryConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Horizons | Canada Migration Coming Soon",
  description: "Canada advisory launching soon. Be the first to know.",
  alternates: { canonical: "/ca" },
};

export default function Page() {
  const country = "ca" as const;
  const { displayName } = getCountryConfig(country);
  return <ComingSoonShell country={country} displayName={displayName} />;
}
