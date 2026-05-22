import type { Metadata } from "next";
import AnswersIndex from "@/components/pages/AnswersIndex";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Immigration Questions, Answered | Horizons Immigration",
  description:
    "Watch short videos from our licensed immigration advisers answering common questions about migrating to New Zealand.",
  alternates: { canonical: "/answers" },
};

export default function Page() {
  return <AnswersIndex country="nz" />;
}
