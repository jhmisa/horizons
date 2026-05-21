import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Horizons Immigration",
  description:
    "The terms that govern your use of the Horizons Immigration website and consultancy services.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <>
      <header className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6">
            LEGAL
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-brand-100">Last updated: To be confirmed.</p>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article className="prose prose-slate max-w-none">
            <p className="text-lg text-accent-700 leading-relaxed">
              These Terms of Service govern your access to and use of the
              Horizons Immigration website and the consultancy services we
              provide. The full terms are being finalised by our legal team and
              will be published here shortly.
            </p>

            <h2>Acceptance of terms</h2>
            <p>
              By using this website or engaging us for consultancy services,
              you agree to these terms.
            </p>

            <h2>Services we provide</h2>
            <p>
              Horizons Immigration provides licensed immigration advice for
              clients seeking residency in New Zealand. Each engagement is
              governed by a separate service agreement that sets out the
              specific scope, fees, and obligations of both parties.
            </p>

            <h2>Payments and refunds</h2>
            <p>
              Consultation fees are payable in advance and are creditable
              toward our processing fee if you proceed. Refund eligibility is
              set out in the service agreement for each engagement.
            </p>

            <h2>Limitations of liability</h2>
            <p>
              We give our professional advice in good faith based on the
              information available at the time. Outcomes from Immigration New
              Zealand and other authorities are outside our control. We are
              not liable for changes in policy or application outcomes that
              fall outside our scope of representation.
            </p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of New Zealand.</p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms of Service can be sent to{" "}
              <a
                href="mailto:hello@horizons.nz"
                className="text-brand-600"
              >
                hello@horizons.nz
              </a>
              .
            </p>
          </article>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800"
            >
              <i className="fa-solid fa-arrow-left" />
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
