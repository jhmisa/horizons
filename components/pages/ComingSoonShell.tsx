import Link from "next/link";
import type { Country } from "@/lib/config";
import InterestCaptureForm from "@/components/pages/InterestCaptureForm";

export default function ComingSoonShell({
  country,
  displayName,
}: {
  country: Country;
  displayName: string;
}) {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-900">
        <div className="absolute inset-0 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            {displayName.toUpperCase()} ADVISORY — LAUNCHING SOON
          </span>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 leading-tight fade-in-up delay-100">
            Bringing Horizons to {displayName}.
            <br />
            Soon.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-accent-200 mb-10 leading-relaxed max-w-2xl mx-auto fade-in-up delay-200">
            For 20 years we&apos;ve helped Filipino families settle abroad.{" "}
            {displayName} advisory is on the way — be the first to know when we
            launch.
          </p>

          <div className="fade-in-up delay-300">
            <InterestCaptureForm country={country} displayName={displayName} />
          </div>
        </div>
      </section>

      {/* WHY THIS COUNTRY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 text-center mb-12">
            Why {displayName}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="rounded-2xl bg-white shadow-md border border-slate-100 p-6">
              <div className="text-brand-600 text-3xl mb-4" aria-hidden="true">
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Post-Graduation Work Permit pathway
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Graduates of Canadian institutions can earn PGWP rights tied to
                field-of-study. Recent 2025/2026 policy changes restricted this
                to PGWP-eligible CIP-coded programs — choosing the right program
                matters more than ever.
              </p>
            </article>
            <article className="rounded-2xl bg-white shadow-md border border-slate-100 p-6">
              <div className="text-brand-600 text-3xl mb-4" aria-hidden="true">
                <i className="fa-solid fa-id-card" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Permanent residence via Express Entry
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Canada&apos;s points-based federal program offers a clear,
                competitive pathway with strong appeal for Filipino skilled
                workers seeking long-term settlement.
              </p>
            </article>
            <article className="rounded-2xl bg-white shadow-md border border-slate-100 p-6">
              <div className="text-brand-600 text-3xl mb-4" aria-hidden="true">
                <i className="fa-solid fa-people-roof" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Family-friendly settlement
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Canada&apos;s social services, public healthcare, and an
                established Filipino-Canadian community make it a welcoming
                place to put down roots with your family.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* LIVE ELSEWHERE */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-700 mb-6 text-lg">
            Looking to migrate now? We&apos;re live in:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link
              href="/"
              className="rounded-2xl bg-brand-50 border border-brand-100 p-6 hover:bg-brand-100 transition-colors flex items-center justify-center gap-2 text-brand-800 font-bold text-lg"
            >
              New Zealand
              <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link
              href="/au"
              className="rounded-2xl bg-brand-50 border border-brand-100 p-6 hover:bg-brand-100 transition-colors flex items-center justify-center gap-2 text-brand-800 font-bold text-lg"
            >
              Australia
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
