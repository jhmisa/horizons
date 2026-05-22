import type { Metadata } from "next";
import AnswersIndex from "@/components/pages/AnswersIndex";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Immigration Questions, Answered | Horizons Immigration",
  description:
    "Answers from licensed immigration advisers to common questions about migrating to Australia.",
  alternates: { canonical: "/au/answers" },
};

export default function Page() {
  return <AnswersIndex country="au" />;
}
