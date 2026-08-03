import Link from "next/link";

const STEPS = [
  {
    num: 1,
    title: "Find your amount",
    desc: "Open the invoice email we sent you — it shows the exact USD total to pay.",
  },
  {
    num: 2,
    title: "Click Pay with Stripe",
    desc: "You'll be taken to our secure Stripe payment page.",
  },
  {
    num: 3,
    title: "Enter the amount",
    desc: "Type the exact amount from your invoice, plus your full name and email address, then pay.",
  },
];

export default function PayPage({ stripeUrl }: { stripeUrl: string | null }) {
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
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            FOR EXISTING CLIENTS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Make a Payment
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            Pay an invoice from Horizons Immigration in USD — enter the exact
            amount from your invoice email.
          </p>
        </div>
      </header>

      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 lg:p-10">
            <ol className="space-y-6 mb-8">
              {STEPS.map((step) => (
                <li key={step.num} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h2 className="font-bold text-accent text-lg">
                      {step.title}
                    </h2>
                    <p className="text-accent-600 text-sm mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-sm text-accent-600 bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8">
              <i className="fa-solid fa-circle-info text-brand-600 mr-2" />
              The amount in your invoice already includes the 4% card
              processing fee — pay exactly what&rsquo;s shown.
            </p>

            {stripeUrl ? (
              <a
                href={stripeUrl}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-lock" /> Pay with Stripe
              </a>
            ) : (
              <p className="text-center text-accent-600 font-medium py-4">
                Payment link unavailable — please use the link in your invoice
                email.
              </p>
            )}

            <p className="text-center text-sm text-accent-500 mt-4">
              Secure payment via Stripe.
            </p>
          </div>

          <p className="text-center text-sm text-accent-500 mt-8">
            Licensed Immigration Adviser: Rowel Mercado — IAA #200900577
          </p>

          <div className="mt-10 bg-brand-900 rounded-2xl p-6 text-center">
            <p className="text-brand-100">
              Booking your first consultation instead?{" "}
              <Link
                href="/book"
                className="text-white font-bold underline hover:text-brand-100"
              >
                Go to the booking page →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
