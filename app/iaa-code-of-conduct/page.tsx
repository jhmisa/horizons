import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IAA Code of Conduct | Horizons Immigration",
  description:
    "Horizons Immigration is bound by the Immigration Advisers Authority (IAA) Code of Conduct.",
};

export default function IAACodeOfConductPage() {
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
            REGULATORY
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            IAA Code of Conduct
          </h1>
          <p className="text-brand-100">
            Our regulatory obligations as Licensed Immigration Advisers.
          </p>
        </div>
      </header>

      <main className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article className="prose prose-slate max-w-none">
            <p className="text-lg text-accent-700 leading-relaxed">
              Horizons Immigration is a licensed firm under the Immigration
              Advisers Authority (IAA) of New Zealand. Every adviser on our
              team is bound by the IAA&apos;s Licensed Immigration Advisers Code
              of Conduct.
            </p>

            <h2>What the Code of Conduct covers</h2>
            <p>
              The Code sets out the professional standards we are required to
              meet, including:
            </p>
            <ul>
              <li>Acting in your best interests with diligence and honesty.</li>
              <li>
                Communicating clearly about visa pathways, costs, timelines,
                and risks.
              </li>
              <li>
                Maintaining confidentiality of your personal information and
                case details.
              </li>
              <li>
                Holding client funds separately in a trust account, where
                applicable.
              </li>
              <li>Avoiding conflicts of interest.</li>
              <li>
                Providing written agreements before any work begins so the
                scope and fees are clear up front.
              </li>
            </ul>

            <h2>The full Code</h2>
            <p>
              You can read the complete Licensed Immigration Advisers Code of
              Conduct on the IAA&apos;s official website. We will include the
              link here shortly.
            </p>

            <h2>Complaints</h2>
            <p>
              If you are unhappy with the service you receive from us, our
              first step is to resolve it directly. If we cannot, you have the
              right to file a formal complaint with the IAA.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about our regulatory obligations can be sent to{" "}
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
