import Link from "next/link";
import type { Office } from "@/lib/offices";

export interface SpotlightPerson {
  name: string;
  title: string;
  /** Path under /public. Use /images/Team/placeholder.svg until a real photo arrives. */
  image: string;
  blurb: string;
}

/**
 * Country-page section introducing the adviser who handles that country,
 * with an optional office card. Replaces the old "Be one of our first
 * clients" block on /au and /ca.
 */
export default function AdviserSpotlight({
  eyebrow,
  heading,
  person,
  office,
  bookHref,
}: {
  eyebrow: string;
  heading: string;
  person: SpotlightPerson;
  office?: Office;
  bookHref: string;
}) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-800 text-xs font-bold tracking-wider uppercase mb-4">
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-accent">
            {heading}
          </h2>
        </div>

        <div
          className={`grid grid-cols-1 gap-8 items-stretch ${
            office ? "md:grid-cols-5" : "max-w-xl mx-auto"
          }`}
        >
          {/* Adviser card */}
          <div className={`bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col sm:flex-row md:flex-col lg:flex-row ${office ? "md:col-span-3" : ""}`}>
            <div className="sm:w-48 md:w-full lg:w-48 shrink-0 aspect-square bg-slate-100">
              <img
                src={person.image}
                alt={`${person.name}, ${person.title}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "50% 0%" }}
              />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-accent mb-1">
                {person.name}
              </h3>
              <p className="text-brand-600 text-sm font-semibold mb-3">
                {person.title}
              </p>
              <p className="text-accent-600 text-sm leading-relaxed mb-5">
                {person.blurb}
              </p>
              <Link
                href={bookHref}
                className="self-start inline-flex items-center gap-2 whitespace-nowrap bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md hover:-translate-y-0.5"
              >
                Book a Consultation
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>

          {/* Office card */}
          {office && (
            <div className="md:col-span-2 bg-[#FAFAFA] rounded-2xl border border-slate-100 p-8 flex flex-col justify-center">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 text-xl mb-5">
                <i className="fa-solid fa-building" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-3">
                Our {office.label.split(",")[0]} office
              </h3>
              <a
                href={office.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 leading-relaxed mb-4 hover:text-brand-600 transition-colors"
              >
                {office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </a>
              <p className="text-accent-600 text-sm">
                <i className="fa-solid fa-phone text-brand-500 mr-2" />
                Tel:{" "}
                <a href={office.tel.href} className="hover:text-brand-600">
                  {office.tel.display}
                </a>
              </p>
              <p className="text-accent-600 text-sm mt-1">
                <i className="fa-solid fa-mobile-screen text-brand-500 mr-2" />
                Mobile:{" "}
                <a href={office.mobile.href} className="hover:text-brand-600">
                  {office.mobile.display}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
