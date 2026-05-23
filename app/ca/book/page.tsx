import type { Metadata } from "next";
import BookPage from "@/components/pages/BookPage";

export const metadata: Metadata = {
  title: "Book Your Canada Consultation | Horizons Immigration",
  description:
    "Book a 1-hour video consultation to map your pathway to Canada. $190 fee + $7 payment processing = $197 USD. Fully creditable toward processing.",
  alternates: { canonical: "/ca/book" },
};

export default function CABookPage() {
  return <BookPage country="ca" />;
}
