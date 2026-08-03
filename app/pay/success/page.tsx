import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Received | Horizons Immigration",
  description: "Your payment to Horizons Immigration was successful.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pay/success" },
};

const NEXT_STEPS = [
  {
    num: 1,
    text: "A receipt from Stripe is on its way to your email.",
  },
  {
    num: 2,
    text: "Our team will match your payment to your invoice and confirm by email.",
  },
  {
    num: 3,
    text: "Questions? Just reply to your invoice email.",
  },
];

export default function PaySuccessPage() {
  return (
    <>
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center text-green-400 text-3xl fade-in-up">
            <i className="fa-solid fa-check" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Payment received — thank you!
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            Your payment to Horizons Immigration was successful.
          </p>
        </div>
      </header>

      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-accent mb-6">
              What happens next
            </h2>
            <ol className="space-y-6 mb-10">
              {NEXT_STEPS.map((step) => (
                <li key={step.num} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
                    {step.num}
                  </div>
                  <p className="text-accent-600 pt-2">{step.text}</p>
                </li>
              ))}
            </ol>

            <Link
              href="/"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Back to home
            </Link>
          </div>

          <p className="text-center text-sm text-accent-500 mt-8">
            Licensed Immigration Adviser: Rowel Mercado — IAA #200900577
          </p>
        </div>
      </section>
    </>
  );
}
