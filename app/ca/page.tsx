import type { Metadata } from "next";
import CountryHome from "@/components/pages/CountryHome";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Horizons | Migrate to Canada",
  description:
    "Expert immigration guidance for Filipino families and OFWs moving to Canada. Built on 20+ years of helping families settle abroad.",
  alternates: {
    canonical: "/ca",
    languages: {
      "en-NZ": "/",
      "en-AU": "/au",
      "en-CA": "/ca",
      "x-default": "/",
    },
  },
};

export default function Page() {
  return <CountryHome country="ca" />;
}
