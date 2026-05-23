import Link from "next/link";
import type { Country } from "@/lib/config";

export function StickyBookCTA({ country }: { country: Country }) {
  const href = country === "nz" ? "/book" : `/${country}/book`;
  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Have your own question?
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900">
            Book a consultation
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Speak one-on-one with a licensed adviser.
          </p>
          <Link
            href={href}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-brand-800"
          >
            Book — $197
          </Link>
        </div>
      </aside>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-lg lg:hidden">
        <Link
          href={href}
          className="flex w-full items-center justify-center rounded-full bg-brand-600 px-5 py-3 font-semibold text-white"
        >
          Book a Consultation — $197
        </Link>
      </div>
    </>
  );
}
