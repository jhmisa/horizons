import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Horizons Immigration",
  description:
    "How Horizons Immigration collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-brand-100">Last updated: To be confirmed.</p>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article className="prose prose-slate max-w-none">
            <p className="text-lg text-accent-700 leading-relaxed">
              This Privacy Policy explains how Horizons Immigration collects,
              uses, stores, and protects your personal information. Full policy
              content is being finalised by our legal team and will be
              published here shortly.
            </p>

            <h2>What we collect</h2>
            <p>
              When you book a consultation or contact us, we collect the
              information you provide (such as your name, email address, phone
              number, and any details relevant to your immigration enquiry).
            </p>

            <h2>How we use your information</h2>
            <p>
              We use your information to provide immigration advisory services,
              respond to your enquiries, process payments, and keep you
              informed about your case.
            </p>

            <h2>Sharing your information</h2>
            <p>
              We do not sell your personal information. We may share relevant
              information with Immigration New Zealand and other government
              bodies as required to advance your application.
            </p>

            <h2>Your rights</h2>
            <p>
              You have the right to access, correct, or request deletion of the
              personal information we hold about you. Contact us at the email
              address below to exercise these rights.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this Privacy Policy can be sent to{" "}
              <a
                href="mailto:info@horizonsmigration.com"
                className="text-brand-600"
              >
                info@horizonsmigration.com
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
