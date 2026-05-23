import type { Metadata } from "next";
import BookPage from "@/components/pages/BookPage";

export const metadata: Metadata = {
  title: "Book Your LIA Consultation | Horizons Immigration",
  description:
    "Book a 1-hour video consultation with a Licensed Immigration Adviser. $190 fee + $7 payment processing = $197 USD. Fully creditable toward processing.",
  alternates: { canonical: "/book" },
};

export default function NZBookPage() {
  return <BookPage country="nz" />;
}
