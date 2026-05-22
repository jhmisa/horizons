import Link from "next/link";
import type { Country } from "@/lib/config";

export default function HowItWorks({ country }: { country: Country }) {
  if (country === "au") {
    return <AustraliaHowItWorks />;
  }

  return (
    <>
      {/* PAGE HEADER */}
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            YOUR ROADMAP TO NEW ZEALAND
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Three Simple Steps to <br className="hidden md:block" /> Your New
            Life
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            We&apos;ve taken the stress and confusion out of immigration. Follow
            this transparent, proven path to secure your family&apos;s future in
            New Zealand.
          </p>
        </div>
      </header>

      {/* STEP 1: WATCH */}
      <section id="step-1" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 text-2xl font-bold mb-6">
                1
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
                Start with the Masterclass.
              </h2>
              <p className="text-lg text-accent-600 mb-6 leading-relaxed">
                We believe your family deserves clarity before making such a big decision. In this short, straightforward masterclass, you&apos;ll learn what it truly takes to migrate to New Zealand, how the visa system actually works, and why choosing the right pathway from the start can shape your long-term success.
              </p>
              <ul className="space-y-4 text-accent-600 font-medium mb-8">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1" />{" "}
                  The current immigration landscape in New Zealand
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1" /> The
                  role of a Licensed Immigration Adviser — and why it matters
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1" /> Realistic
                  costs and timelines, so you can plan with confidence
                </li>
              </ul>
              <p className="text-lg font-medium text-accent">
                Start with understanding. Move forward with certainty.
              </p>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative w-full aspect-video rounded-2xl shadow-2xl overflow-hidden bg-accent-950 border border-accent-100 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1510251197878-a2e6d2cb590c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-4xl shadow-xl transform group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-play ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: BOOK */}
      <section
        id="step-2"
        className="py-20 lg:py-24 bg-[#FAFAFA] border-t border-accent-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 text-2xl font-bold mb-6">
                2
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
                Book Your LIA Consultation.
              </h2>
              <p className="text-lg text-accent-600 mb-6 leading-relaxed">
                Ready to go deeper? Book a one-on-one session with a Licensed
                Immigration Adviser. They will study your background and craft a
                tailored plan — not a one-size-fits-all template.
              </p>

              <div className="space-y-6 mt-8">
                {[
                  {
                    icon: "fa-magnifying-glass-chart",
                    title: "In-Depth Profile Assessment",
                    desc: "We analyze your qualifications against current immigration laws.",
                  },
                  {
                    icon: "fa-map-location-dot",
                    title: "Your Optimal Pathway",
                    desc: "We identify the route with the highest probability of approval.",
                  },
                  {
                    icon: "fa-comments",
                    title: "Live Q&A",
                    desc: "Get definitive answers to all your specific questions from a licensed professional.",
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                      <i className={`fa-solid ${feature.icon}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-accent text-lg">
                        {feature.title}
                      </h4>
                      <p className="text-accent-600 text-sm mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
              {/* Booking Card */}
              <div className="bg-accent-950 rounded-3xl p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/30 rounded-2xl blur-3xl -mr-20 -mt-20" />

                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      Expert Consultation
                    </h3>
                    <p className="text-brand-200">
                      1-Hour Video Call with an LIA
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm mb-6">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-brand-200">Consultation Fee</dt>
                        <dd className="font-semibold text-white">$190 USD</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-brand-200">
                          Payment Processing Fee
                        </dt>
                        <dd className="font-semibold text-white">$7 USD</dd>
                      </div>
                      <div className="flex justify-between border-t border-white/20 pt-2 mt-2">
                        <dt className="font-bold text-white">Total</dt>
                        <dd className="text-2xl font-extrabold text-white">
                          $197 USD
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-xs text-brand-300">
                      $190 credited toward your $2,000 processing fee if you
                      proceed → only $1,810 due to complete.
                    </p>
                  </div>

                  <p className="text-sm text-brand-200 mb-4">
                    Already watched the masterclass and checked our FAQ?
                    {" "}
                    <Link
                      href="/answers"
                      className="underline hover:text-white"
                    >
                      Browse FAQ
                    </Link>
                    {" · "}
                    <Link
                      href="#step-1"
                      className="underline hover:text-white"
                    >
                      Watch Masterclass
                    </Link>
                  </p>

                  <Link
                    href="/book"
                    className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-lock" /> Pay $197 USD — Book My
                    Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: PROCEED */}
      <section
        id="step-3"
        className="py-20 lg:py-24 bg-brand-50 border-t border-brand-100 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              {/* Pricing Graphic */}
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-brand-100">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl text-2xl mb-6 mx-auto">
                  <i className="fa-solid fa-handshake" />
                </div>
                <h3 className="text-2xl font-bold text-center text-accent mb-8">
                  The Horizons Guarantee
                </h3>

                <div className="space-y-6">
                  {/* Step A */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent-100 text-accent-500 font-bold text-sm shrink-0">
                      A
                    </div>
                    <div className="flex-1 bg-[#FAFAFA] p-4 rounded border border-accent-100">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-accent">
                          Consultation Fee
                        </h4>
                        <span className="font-bold text-brand-600">$190</span>
                      </div>
                      <p className="text-xs text-accent-500">
                        Paid upfront for Step 2.
                      </p>
                    </div>
                  </div>

                  {/* Step B */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent-100 text-accent-500 font-bold text-sm shrink-0">
                      B
                    </div>
                    <div className="flex-1 bg-[#FAFAFA] p-4 rounded border border-accent-100">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-accent">
                          Full Processing Fee
                        </h4>
                        <span className="font-bold text-accent-500">$2,000</span>
                      </div>
                      <p className="text-xs text-accent-500">
                        Total cost of LIA services.
                      </p>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-green-500 text-white shrink-0">
                      <i className="fa-solid fa-check" />
                    </div>
                    <div className="flex-1 bg-green-50 p-4 rounded border border-green-200">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-green-900">
                          You Pay to Proceed
                        </h4>
                        <span className="font-extrabold text-green-700 text-lg">
                          $1,810
                        </span>
                      </div>
                      <p className="text-xs text-green-700">
                        The $190 is fully credited back.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 text-2xl font-bold mb-6">
                3
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
                Proceed with No Surprises.
              </h2>
              <p className="text-lg text-accent-600 mb-6 leading-relaxed">
                If, after your consultation, you decide to move forward with
                Horizons, your $190 consultation fee is completely credited
                toward the $2,000 USD processing fee.
              </p>
              <p className="text-lg text-accent-600 mb-8 leading-relaxed">
                No wasted money. No hidden costs. Just complete transparency
                from day one. You know exactly what you&apos;re paying for:
                end-to-end representation by a Licensed Immigration Adviser.
              </p>
              <ul className="space-y-4 text-accent-600 font-medium">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-shield text-brand-500 mt-1" /> Full
                  document preparation and review
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-shield text-brand-500 mt-1" />{" "}
                  Direct liaison with Immigration NZ
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-shield text-brand-500 mt-1" />{" "}
                  Ongoing support until a decision is reached
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-brand-900 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Begin with the masterclass and see if New Zealand is the right fit
            for your family.
          </p>
          <Link
            href="#step-1"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Watch the Masterclass
          </Link>
        </div>
      </section>
    </>
  );
}

function AustraliaHowItWorks() {
  return (
    <>
      {/* PAGE HEADER */}
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            HOW IT WORKS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Your Path to Australia, in 3 Steps
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            Watch. Book. Proceed. The same proven process that has guided
            thousands of families abroad — now for Australia migration.
          </p>
        </div>
      </header>

      {/* STEP 1: WATCH */}
      <section id="step-1" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 text-2xl font-bold mb-6">
                1
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
                Step 1 — Watch the Masterclass
              </h2>
              <p className="text-lg text-accent-600 mb-6 leading-relaxed">
                Our free masterclass walks you through what it takes to migrate
                to Australia: pathways, common pitfalls, and what to prepare. No
                commitment, just clarity.
              </p>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-center p-8 border border-slate-200">
                <div>
                  <p className="text-slate-600 font-medium">
                    Australia Masterclass coming soon.
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    For now, book a consultation and we&apos;ll personalize the
                    pathway walkthrough for you.
                  </p>
                  <Link
                    href="/book"
                    className="inline-block mt-4 px-5 py-2 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
                  >
                    Book a Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: BOOK */}
      <section
        id="step-2"
        className="py-20 lg:py-24 bg-[#FAFAFA] border-t border-accent-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 text-2xl font-bold mb-6">
                2
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
                Step 2 — Book a 1-on-1 Consultation
              </h2>
              <p className="text-lg text-accent-600 mb-6 leading-relaxed">
                Book a 1-hour video consultation with our team. We&apos;ll
                review your situation in detail, map your most viable Australia
                pathway, and answer your specific questions.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
              <div className="bg-accent-950 rounded-3xl p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/30 rounded-2xl blur-3xl -mr-20 -mt-20" />

                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      Australia Consultation
                    </h3>
                    <p className="text-brand-200">
                      1-Hour Video Call with our team
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm mb-6">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-brand-200">Consultation Fee</dt>
                        <dd className="font-semibold text-white">$190 USD</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-brand-200">
                          Payment Processing Fee
                        </dt>
                        <dd className="font-semibold text-white">$7 USD</dd>
                      </div>
                      <div className="flex justify-between border-t border-white/20 pt-2 mt-2">
                        <dt className="font-bold text-white">Total</dt>
                        <dd className="text-2xl font-extrabold text-white">
                          $197 USD
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-xs text-brand-300">
                      Your $190 is fully credited toward your full service fee
                      if you choose to proceed.
                    </p>
                  </div>

                  <Link
                    href="/book"
                    className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-lock" /> Book My Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: PROCEED */}
      <section
        id="step-3"
        className="py-20 lg:py-24 bg-brand-50 border-t border-brand-100 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 text-2xl font-bold mb-6">
            3
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">
            Step 3 — Proceed with Confidence
          </h2>
          <p className="text-lg text-accent-600 mb-6 leading-relaxed">
            Once you decide to engage us, we handle visa selection, document
            preparation, and lodgement with the Department of Home Affairs. The
            $190 you&apos;ve paid is credited — only $1,810 USD remains to
            complete the full service.
          </p>
          <p className="text-lg text-accent font-medium">
            Direct liaison with Australian immigration authorities. Personal,
            expert, end-to-end.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-brand-900 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to start your Australia journey?
          </h2>
          <Link
            href="/book"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Book My Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
