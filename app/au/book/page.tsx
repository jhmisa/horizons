import type { Metadata } from "next";
import BookPage from "@/components/pages/BookPage";

export const metadata: Metadata = {
  title: "Book Your Australia Consultation | Horizons Immigration",
  description:
    "Book a 1-hour video consultation to map your pathway to Australia. $190 fee + $7 payment processing = $197 USD. Fully creditable toward processing.",
  alternates: { canonical: "/au/book" },
};

export default function AUBookPage() {
  return <BookPage country="au" />;
}
