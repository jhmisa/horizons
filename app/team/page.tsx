import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Team | Horizons Immigration",
  description:
    "Meet the Licensed Immigration Advisers at Horizons who have helped 6,500+ families migrate to New Zealand.",
};

const teamMembers = [
  {
    name: "David Mitchell",
    role: "Founder & Principal LIA",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    bio: "With over 20 years of experience in New Zealand immigration, David founded Horizons to provide honest, transparent pathways for families worldwide. He holds a full licence from the Immigration Advisers Authority.",
  },
  {
    name: "Sarah Chen",
    role: "Senior Immigration Adviser",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    bio: "Sarah specializes in Skilled Migrant and Work to Residence visas. Having migrated to NZ herself, she understands the journey firsthand and has helped over 200 families make the move.",
  },
  {
    name: "Priya Sharma",
    role: "Client Success Manager",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    bio: "Priya ensures every client's journey is smooth from first consultation to final visa decision. She coordinates between advisers and clients, keeping everything on track and stress-free.",
  },
  {
    name: "Tom Anderson",
    role: "Immigration Adviser — NZ",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    bio: "Tom is an expert in family-category visas and partner sponsorship applications. His attention to detail and thorough preparation have earned him a 98% approval rate.",
  },
  {
    name: "Maria Santos",
    role: "Document & Compliance Specialist",
    image:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    bio: "Maria manages all document preparation and compliance checks. She ensures every application is complete, accurate, and meets the latest regulatory requirements before submission.",
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
            Licensed professionals dedicated to making your immigration journey
            as smooth as possible.
          </p>
        </div>
      </header>

      {/* Team Grid */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-md border border-accent-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-accent mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 font-semibold text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-accent-600 text-sm leading-relaxed">
                    {member.bio}
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
            Watch the Masterclass — Free
          </Link>
        </div>
      </section>
    </>
  );
}
