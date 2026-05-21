import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Team | Horizons Immigration",
  description:
    "Meet the Licensed Immigration Advisers and support team at Horizons Immigration NZ — IAA-licensed advisers who have helped 6,500+ families migrate to New Zealand.",
  alternates: { canonical: "/team" },
};

type LIA = {
  name: string;
  licence: string;
  image: string;
  objectPosition?: string;
};

type SupportMember = {
  name: string;
  role: string;
  image: string;
};

const founder = {
  name: "Rowel Mercado",
  role: "Founder & Principal Licensed Immigration Adviser",
  licence: "200900577",
  image: "/images/Team/rowel-mercado.webp",
};

const advisers: LIA[] = [
  {
    name: "Jocelyn Ocampo",
    licence: "201001078",
    image: "/images/Team/jocelyn-ocampo.webp",
  },
  {
    name: "Joyce Maneja-Curiano",
    licence: "202400363",
    image: "/images/Team/joyce-maneja-curiano.webp",
  },
  {
    name: "Lorna Caluag",
    licence: "201900427",
    image: "/images/Team/lorna-caluag.webp",
  },
  {
    name: "Stephanie Feret",
    licence: "201700294",
    image: "/images/Team/stephanie-feret.webp",
  },
  {
    name: "Tonet Cruz Jang",
    licence: "201601367",
    image: "/images/Team/tonet-cruz-jang.webp",
    objectPosition: "50% 35%",
  },
  {
    name: "Trinity Lee",
    licence: "201701299",
    image: "/images/Team/trinity-lee.webp",
  },
];

const support: SupportMember[] = [
  {
    name: "Marie Quintos",
    role: "Office Manager",
    image: "/images/Team/marie-quintos.webp",
  },
  {
    name: "Issa Mercado",
    role: "Admin & Finance",
    image: "/images/Team/issa-mercado.webp",
  },
  {
    name: "Paolo Quintos",
    role: "Marketing Officer",
    image: "/images/Team/paolo-quintos.webp",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Page Header */}
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
            THE PEOPLE BEHIND YOUR JOURNEY
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Meet the Team
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            IAA-licensed advisers and a support team dedicated to making your
            New Zealand immigration journey as smooth as possible.
          </p>
        </div>
      </header>

      {/* Founder Hero */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase">
              Founder
            </span>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 h-80 md:h-auto overflow-hidden bg-slate-100">
              <img
                src={founder.image}
                alt={`${founder.name} — ${founder.role}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                {founder.name}
              </h2>
              <p className="text-brand-600 font-semibold text-lg mb-4">
                {founder.role}
              </p>
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
                IAA Licence No. {founder.licence}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Licensed Immigration Advisers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              Licensed Immigration Advisers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Our IAA-licensed advisers
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every adviser is licensed by the Immigration Advisers Authority
              of New Zealand &mdash; the regulator that holds NZ immigration
              professionals to a strict code of conduct.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisers.map((member) => (
              <div
                key={member.licence}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-72 overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={`${member.name} — Licensed Immigration Adviser`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: member.objectPosition ?? "50% 0%" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 font-semibold text-sm mb-4">
                    Licensed Immigration Adviser
                  </p>
                  <div className="inline-flex items-center gap-2 py-1 px-2.5 rounded-full bg-brand-50 border border-brand-100 text-brand-800 text-xs font-medium">
                    IAA Licence No. {member.licence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
              Support Team
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              The people behind the scenes
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The team that keeps everything running &mdash; finance,
              operations, and making sure your journey is heard about by others
              like you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {support.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-72 overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 font-semibold text-sm">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            Ready to work with our team?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Start with our free masterclass to see how the process works, then
            we&apos;ll match you with the right adviser for your situation.
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
