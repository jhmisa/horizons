import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Horizons Immigration",
  description:
    "Founded by Rowel Mercado, Horizons Immigration has helped 6,500+ families migrate to New Zealand, Australia, and Canada. Regulated by IAA, MARA, and CICC.",
  alternates: { canonical: "/about" },
};

// TODO(joey): Replace placeholder copy below before adding About to the Nav.
// Items flagged with TODO(joey) need real content from Joey:
//   - Mission line in the hero
//   - Founder story paragraphs (3-4 short paragraphs)
//   - "years operating" stat — placeholder is 15+
const MISSION_LINE = "Helping Filipinos build their future, the licensed way.";
const MISSION_SUBHEAD =
  "For two decades, Horizons Immigration has guided families to New Zealand, Australia, and Canada — with honest advice, a clear plan, and only licensed advisers.";

// TODO(joey): rewrite founder paragraphs in Rowel's voice.
const FOUNDER_PARAGRAPHS: readonly string[] = [
  "Rowel Mercado founded Horizons Immigration in 2005 with one conviction: Filipino families deserve honest, licensed immigration advice — not the shortcuts and false promises that have hurt so many.",
  "As a Licensed Immigration Adviser (IAA Licence No. 200900577) and the founder of one of the largest Filipino-led immigration practices in New Zealand, Rowel built Horizons around a simple principle: every adviser on the team is licensed and accountable to a real regulator.",
  "Today the team helps families pursue residence pathways across three countries — New Zealand, Australia, and Canada — with education-first strategies that turn study into a long-term future.",
];

const STATS = [
  {
    value: "6,500+",
    label: "Families helped",
    context: "across NZ, AU, and CA",
  },
  {
    value: "20+",
    label: "Years operating",
    context: "founded in 2005",
  },
  {
    value: "3",
    label: "Countries served",
    context: "NZ · AU · CA",
  },
] as const;

const REGULATORS = [
  {
    abbr: "IAA",
    fullName: "Immigration Advisers Authority",
    country: "New Zealand",
    url: "https://www.iaa.govt.nz",
    verifyUrl:
      "https://www.iaa.govt.nz/for-people-needing-advice/find-a-licensed-immigration-adviser/",
    verifyLabel: "Verify our advisers",
    blurb:
      "The NZ government regulator that licenses immigration advisers and enforces their code of conduct.",
  },
  {
    abbr: "MARA",
    fullName: "Office of the Migration Agents Registration Authority",
    country: "Australia",
    url: "https://www.mara.gov.au",
    verifyUrl: "https://www.mara.gov.au/search-the-register-of-migration-agents",
    verifyLabel: "Verify our agents",
    blurb:
      "Australia's federal regulator for Registered Migration Agents, with a public register of every licensed agent.",
  },
  {
    abbr: "CICC",
    fullName: "College of Immigration and Citizenship Consultants",
    country: "Canada",
    url: "https://college-ic.ca",
    verifyUrl:
      "https://college-ic.ca/protecting-the-public/find-an-immigration-consultant?l=en-US",
    verifyLabel: "Verify our consultants",
    blurb:
      "Canada's national regulator for Regulated Canadian Immigration Consultants (RCICs).",
  },
] as const;

const TEAM_TEASER = [
  {
    name: "Rowel Mercado",
    role: "Founder & Principal LIA",
    image: "/images/Team/rowel-mercado.webp",
  },
  {
    name: "Jocelyn Ocampo",
    role: "Licensed Immigration Adviser",
    image: "/images/Team/jocelyn-ocampo.webp",
  },
  {
    name: "Lorna Caluag",
    role: "Licensed Immigration Adviser",
    image: "/images/Team/lorna-caluag.webp",
  },
  {
    name: "Trinity Lee",
    role: "Licensed Immigration Adviser",
    image: "/images/Team/trinity-lee.webp",
  },
];

export default function AboutPage() {
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
            ABOUT HORIZONS IMMIGRATION
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            {MISSION_LINE}
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            {MISSION_SUBHEAD}
          </p>
        </div>
      </header>

      {/* 2. Founder */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase">
              Our Founder
            </span>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 h-80 md:h-auto overflow-hidden bg-slate-100">
              <img
                src="/images/Team/rowel-mercado.webp"
                alt="Rowel Mercado — Founder & Principal Licensed Immigration Adviser"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                Rowel Mercado
              </h2>
              <p className="text-brand-600 font-semibold text-lg mb-6">
                Founder &amp; Principal Licensed Immigration Adviser
              </p>
              <div className="space-y-4 text-slate-700 leading-relaxed mb-6">
                {FOUNDER_PARAGRAPHS.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 self-start py-1.5 px-3 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                IAA Licence No. 200900577
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. By-the-numbers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              By the numbers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Twenty years of helping families move forward
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center"
              >
                <div className="text-5xl font-extrabold text-brand-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500">{stat.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Regulated By */}
      <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6">
              REGULATED &amp; ACCOUNTABLE
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Verified by the immigration regulators in every country we serve
            </h2>
            <p className="text-brand-100 max-w-2xl mx-auto">
              Immigration is a regulated profession. Unlicensed &quot;agents&quot;
              cost families their savings and their dreams. Every Horizons
              adviser is licensed by the regulator in the country they advise on —
              verify any of them below.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REGULATORS.map((reg) => (
              <div
                key={reg.abbr}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col"
              >
                <div className="text-3xl font-extrabold text-white mb-1">
                  {reg.abbr}
                </div>
                <div className="text-sm text-brand-200 mb-3">
                  {reg.country}
                </div>
                <p className="text-sm text-brand-100 mb-6 flex-grow">
                  {reg.blurb}
                </p>
                <a
                  href={reg.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${reg.verifyLabel} on the ${reg.fullName} register`}
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-brand-300 transition-colors"
                >
                  {reg.verifyLabel}
                  <i
                    className="fa-solid fa-arrow-up-right-from-square text-xs"
                    aria-hidden="true"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team teaser */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              The team
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              The people behind your journey
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {TEAM_TEASER.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 bg-white text-brand-900 hover:bg-brand-50 font-bold py-3 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-200"
            >
              Meet the full team
              <i className="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
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
            Ready to start your journey?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Watch the free masterclass — see how the process works before you
            book a paid consultation.
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
