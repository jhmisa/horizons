import type { Metadata } from "next";
import Link from "next/link";
import { getPartnerSchools } from "@/lib/partnerSchools";

export const metadata: Metadata = {
  title: "Partner Schools | Horizons Immigration",
  description:
    "The educational institutions Horizons Immigration partners with to help Filipinos build a future through study-to-residence pathways in New Zealand.",
  alternates: { canonical: "/partner-schools" },
};

// Revalidate hourly so newly published schools show without a redeploy.
export const revalidate = 3600;

const HERO_SUBHEAD =
  "Horizons Immigration Consulting has years of successful partnerships with educational institutions. These are our highly valued partners, who can and will deliver your educational needs.";

export default async function PartnerSchoolsPage() {
  const schools = await getPartnerSchools("nz");

  return (
    <>
      {/* 1. Hero */}
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
            OUR PARTNER SCHOOLS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Educational institutions we trust to deliver your future
          </h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto fade-in-up delay-200">
            {HERO_SUBHEAD}
          </p>
        </div>
      </header>

      {/* 2. Schools grid */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {schools.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-2xl mx-auto">
              <p className="text-slate-600 text-lg">
                Our NZ partner schools will be listed here shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {schools.map((school) => (
                <article
                  key={school._id}
                  className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-32 bg-white flex items-center justify-center p-6 border-b border-slate-100">
                    <img
                      src={school.logoUrl}
                      alt={school.logoAlt}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      {school.name}
                    </h2>
                    {school.city ? (
                      <span className="inline-flex self-start items-center py-1 px-2.5 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-medium mb-4">
                        {school.city}
                      </span>
                    ) : null}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                      {school.blurb}
                    </p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors text-sm"
                    >
                      Visit school
                      <i
                        className="fa-solid fa-arrow-up-right-from-square text-xs"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Why partner schools matter */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
            Education-first pathway
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            Why we partner with schools
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            For most of our clients, the strongest pathway to permanent
            residence is through education. Studying with a trusted partner
            institution builds a credible visa profile, opens post-study work
            rights, and creates a real path to settling abroad. Our partner
            schools are institutions we trust to deliver on that promise.
          </p>
        </div>
      </section>

      {/* 4. Final CTA */}
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
            Ready to start your education pathway?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Watch the free masterclass to see how Horizons matches you with the
            right school for your visa pathway.
          </p>
          <Link
            href="/how-it-works#step-1"
            className="inline-block bg-white text-brand-900 hover:bg-[#FAFAFA] text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Watch the Masterclass &mdash; Free
          </Link>
        </div>
      </section>
    </>
  );
}
