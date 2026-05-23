"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CountrySwitcher, {
  getCurrentCountryFromPathname,
} from "./CountrySwitcher";

interface NavLink {
  href: string;
  label: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const country = getCurrentCountryFromPathname(pathname);

  const prefix = country === "nz" ? "" : `/${country}`;
  const homeHref = country === "nz" ? "/" : `/${country}`;
  const bookHref = `${prefix}/how-it-works`;

  // Build the inner nav links based on active country.
  // - NZ: full menu
  // - AU: full menu minus Success Stories (no /au/success-stories route)
  // - CA: shell only — no inner links
  let innerLinks: NavLink[] = [];
  if (country === "nz") {
    innerLinks = [
      { href: "/", label: "Home" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "Our Team" },
      { href: "/success-stories", label: "Success Stories" },
      { href: "/answers", label: "FAQ" },
    ];
  } else if (country === "au") {
    innerLinks = [
      { href: "/au", label: "Home" },
      { href: "/au/how-it-works", label: "How It Works" },
      { href: "/about", label: "Our Team" },
      { href: "/au/answers", label: "FAQ" },
    ];
  }
  // CA: innerLinks stays empty.

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href={homeHref}
            className="flex-shrink-0 flex items-center cursor-pointer group"
            aria-label="Horizons home"
          >
            <img
              src="/images/horizons-logo-navy.svg"
              alt="Horizons"
              width={192}
              height={56}
              className="h-12 w-auto sm:h-14 transition-transform group-hover:scale-[1.03]"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {innerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-accent-700 hover:text-brand-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <CountrySwitcher />
            <Link
              href={bookHref}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Book Session
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-accent-700 hover:text-brand-600 transition-colors"
            aria-label="Toggle menu"
          >
            <i
              className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"} text-2xl`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 border-t border-slate-100">
            <div className="flex flex-col space-y-4 pt-4">
              <div className="px-2">
                <CountrySwitcher
                  variant="mobile"
                  onSelect={() => setMobileOpen(false)}
                />
              </div>
              {innerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-accent-700 hover:text-brand-600 font-medium transition-colors px-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={bookHref}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-2xl font-semibold transition-all shadow-md text-center"
                onClick={() => setMobileOpen(false)}
              >
                Book Session
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
