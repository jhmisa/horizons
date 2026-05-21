import Link from "next/link";
import type { Metadata } from "next";
import { STRIPE_PAYMENT_LINK } from "@/lib/config";

export const metadata: Metadata = {
  title: "Book Your LIA Consultation | Horizons Immigration",
  description:
    "Book a 1-hour video consultation with a Licensed Immigration Adviser. $190 fee + $7 payment processing = $197 USD. Fully creditable toward processing.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      {/* Page Header */}
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            STEP 2: BOOK YOUR CONSULTATION
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Book Your LIA Consultation
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            One-on-one session with a Licensed Immigration Adviser. Pay $197
            USD and we&apos;ll handle the rest.
          </p>
        </div>
      </header>

      {/* What's included + Pricing */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* Left: What's included */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-accent mb-8">
                What&apos;s included
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: "fa-file-lines",
                    title: "Extensive Written Report",
                    desc: "Your best pathway to New Zealand, documented in detail.",
                  },
                  {
                    icon: "fa-list-check",
                    title: "Step-by-Step Walkthrough",
                    desc: "Your LIA explains the report's findings, section by section.",
                  },
                  {
                    icon: "fa-comments",
                    title: "Live Q&A",
                    desc: "Time set aside for your specific questions.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
                      <i className={`fa-solid ${feature.icon}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-accent">{feature.title}</h3>
                      <p className="text-sm text-accent-600 mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Pricing & Pay */}
            <div className="bg-accent-950 rounded-3xl p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/30 rounded-2xl blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Expert Consultation</h3>
                <p className="text-brand-200 mb-6">
                  1-Hour Video Call with an LIA
                </p>

                <dl className="space-y-3 mb-6 bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <div className="flex justify-between text-sm">
                    <dt className="text-brand-100">Consultation Fee</dt>
                    <dd className="font-semibold text-white">$190 USD</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-brand-100">Payment Processing Fee</dt>
                    <dd className="font-semibold text-white">$7 USD</dd>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-3 mt-3">
                    <dt className="font-bold text-white">Total</dt>
                    <dd className="text-3xl font-extrabold text-white">
                      $197 USD
                    </dd>
                  </div>
                </dl>

                <p className="text-xs text-brand-300 mb-6">
                  <i className="fa-solid fa-check text-green-400 mr-1" /> $190
                  credited toward your $2,000 processing fee if you proceed →
                  only $1,810 due to complete.
                </p>

                <a
                  href={STRIPE_PAYMENT_LINK}
                  className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-lock" /> Pay $197 USD — Book My
                  Consultation
                </a>
                <p className="text-xs text-brand-300 mt-4 text-center">
                  Secure payment via Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-16 bg-[#FAFAFA] border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-accent text-center mb-10">
            What happens next
          </h2>
          <ol className="space-y-6">
            {[
              {
                num: 1,
                title: "You pay securely via Stripe",
                desc: "Card or Apple Pay. Takes about 30 seconds.",
              },
              {
                num: 2,
                title: "You get a confirmation email instantly",
                desc: "Receipt from Stripe with your payment details.",
              },
              {
                num: 3,
                title: "We email you a short form",
                desc: "Tell us about your situation and pick a time that works for you.",
              },
              {
                num: 4,
                title: "Your LIA video call (1 hour)",
                desc: "One-on-one with a Licensed Immigration Adviser.",
              },
            ].map((item) => (
              <li key={item.num} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-accent text-lg">{item.title}</h3>
                  <p className="text-accent-600 text-sm mt-1">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center text-sm text-accent-500">
            Questions before you book?{" "}
            <Link
              href="/answers"
              className="text-brand-600 font-semibold hover:text-brand-800"
            >
              Browse our FAQ page →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
