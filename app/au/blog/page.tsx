import type { Metadata } from "next";
import BlogIndex from "@/components/pages/BlogIndex";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Immigration Blog | Horizons Immigration",
  description:
    "Expert advice, policy updates, and practical tips to navigate your migration journey to Australia.",
  alternates: { canonical: "/au/blog" },
};

export default function Page() {
  return <BlogIndex country="au" />;
}
