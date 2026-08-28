import Link from "next/link";
import { getCountryConfig, type Country } from "@/lib/config";

interface ThreeStepsToNewLifeProps {
  country: Country;
}

function howItWorksHref(country: Country): string {
  if (country === "au") return "/au/how-it-works";
  // /ca/how-it-works doesn't exist yet — route CA visitors straight to booking.
  if (country === "ca") return "/ca/book";
  return "/how-it-works";
}

function ctaLabel(country: Country): string {
  return country === "ca"
    ? "Book Your Canada Consultation"
    : "Explore the Full 3-Step Process";
}

export default function ThreeStepsToNewLife({ country }: ThreeStepsToNewLifeProps) {
  const { displayName, adviserTitle } = getCountryConfig(country);
  const href = howItWorksHref(country);
  const label = ctaLabel(country);

  const steps = [
    {
      num: 1,
      icon: "fa-circle-play",
      title: "Watch",
      desc: `Start with our short masterclass that explains everything — what it takes to migrate to ${displayName}, how the process works, and why having the right pathway matters.`,
    },
    {
      num: 2,
      icon: "fa-calendar-check",
      iconPrefix: "fa-regular",
      title: "Book",
      desc: `Ready to go deeper? Book a one-on-one consultation with a ${adviserTitle} for $197 USD ($190 fee + $7 payment processing). They'll study your background and craft a tailored plan.`,
    },
    {
      num: 3,
      icon: "fa-plane-departure",
      title: "Proceed",
      desc: "If you decide to move forward with Horizons, your $190 consultation fee is credited toward the $2,300 USD processing fee. No wasted money. No hidden costs.",
    },
  ] as const;

  return (
    <section id="how-it-works" className="py-20 bg-[#FAFAFA] border-t border-accent-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
            Three Simple Steps to Your New Life
          </h2>
          <p className="text-lg text-accent-600">
            We&apos;ve streamlined the complex immigration process into a
            straightforward, transparent journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-8 shadow-md border border-accent-100 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-400 font-bold text-xl border-4 border-white group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                {step.num}
              </div>
              <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 text-2xl mb-6">
                <i
                  className={`${("iconPrefix" in step && step.iconPrefix) || "fa-solid"} ${step.icon}`}
                />
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">
                {step.title}
              </h3>
              <p className="text-accent-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href={href}
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {label} <i className="fa-solid fa-arrow-right ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
