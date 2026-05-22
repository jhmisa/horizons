import type { Metadata } from "next";
import CountryHome from "@/components/pages/CountryHome";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Horizons | Migrate to Australia",
  description:
    "Expert migration guidance for Filipino families and OFWs moving to Australia. Built on 20+ years of helping families settle abroad.",
  alternates: { canonical: "/au" },
};

export default function Page() {
  return <CountryHome country="au" />;
}
