import { getCountryConfig, type Country } from "@/lib/config";

interface WhyItMattersProps {
  country: Country;
}

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function indefiniteArticle(word: string): string {
  return VOWELS.has(word[0]?.toLowerCase() ?? "") ? "an" : "a";
}

export default function WhyItMatters({ country }: WhyItMattersProps) {
  const { displayName, adviserTitle, adviserAbbr, regulatorName, regulatorAbbr } =
    getCountryConfig(country);
  const adviserArticle = indefiniteArticle(adviserAbbr);

  return (
    <section
      id="why-lia"
      className="py-24 bg-brand-900 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-800/30 rounded-full blur-3xl -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="text-brand-300 font-semibold tracking-wider uppercase text-sm mb-3 block">
            Why It Matters
          </span>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white max-w-3xl mx-auto">
            Getting There Is Only the Beginning
          </h2>
        </div>

        {/* Unified content card */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* Image column */}
            <div className="relative min-h-[320px] lg:min-h-full order-2 lg:order-1">
              <img
                src="/images/Rowel-zoom-meeting-consultation.png"
                alt="Horizons Immigration Consultation"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent-950/90 to-transparent p-6 pt-20">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-shield-halved text-brand-400 text-2xl" />
                  <div>
                    <div className="font-bold text-white">
                      Registered &amp; Licensed
                    </div>
                    <div className="text-xs text-brand-200">
                      Guaranteed Professional Standards
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="p-8 lg:p-12 xl:p-14 order-1 lg:order-2">
              <div className="space-y-5 text-brand-100 text-[17px] leading-relaxed">
                <p>
                  Anyone can help you complete forms. But forming the best strategy for your case — the one that protects your family&apos;s future and gives you the strongest chance of approval — takes real expertise.
                </p>
                <p>
                  Choosing the right visa pathway isn&apos;t paperwork. It&apos;s positioning. It&apos;s timing. It&apos;s knowing which options strengthen your case — and which ones put it at risk.
                </p>
                <p className="text-white font-semibold">
                  In {displayName}, only a {adviserTitle} can legally provide that level of advice.
                </p>
                <p>
                  At Horizons, every consultation is with {adviserArticle} {adviserAbbr}. We assess your qualifications, experience, family circumstances, and long-term goals — then build a strategy designed for approval, not guesswork.
                </p>
                <p>
                  Because there&apos;s a big difference between simply arriving in {displayName}… and arriving with a plan to build a life there.
                </p>
              </div>

              {/* Bottom trust strip */}
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 text-green-400 w-10 h-10 rounded-xl flex items-center justify-center text-lg">
                    <i className="fa-solid fa-check" />
                  </div>
                  <div className="font-bold text-white text-sm">
                    100% Legal Representation
                  </div>
                </div>
                <div className="text-sm text-brand-200 border-l border-brand-700 pl-4">
                  Strictly regulated by the <br />
                  <strong className="text-white">
                    {regulatorName} ({regulatorAbbr})
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
