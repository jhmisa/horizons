import type { Metadata } from "next";
import CountryHome from "@/components/pages/CountryHome";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Horizons Immigration | Expert Visa Pathways to New Zealand",
  description:
    "For 20 years, our Licensed Immigration Advisers have guided 6,500+ families to New Zealand with honest advice and a clear plan.",
  alternates: {
    canonical: "/",
    languages: {
      "en-NZ": "/",
      "en-AU": "/au",
      "en-CA": "/ca",
      "x-default": "/",
    },
  },
};

export default function Page() {
  return <CountryHome country="nz" />;
}
