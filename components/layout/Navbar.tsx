"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
          >
            <i className="fa-solid fa-earth-oceania text-brand-600 text-3xl group-hover:scale-110 transition-transform" />
            <span className="font-bold text-2xl tracking-tight text-accent group-hover:text-brand-600 transition-colors">
              Horizons<span className="text-brand-600">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-accent-700 hover:text-brand-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className="text-accent-700 hover:text-brand-600 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/team"
              className="text-accent-700 hover:text-brand-600 font-medium transition-colors"
            >
              Our Team
            </Link>
            <Link
              href="/success-stories"
              className="text-accent-700 hover:text-brand-600 font-medium transition-colors"
            >
              Success Stories
            </Link>
            <Link
              href="/answers"
              className="text-accent-700 hover:text-brand-600 font-medium transition-colors"
            >
              Q&amp;A
            </Link>
            <Link
              href="/how-it-works"
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
              <Link
                href="/"
                className="text-accent-700 hover:text-brand-600 font-medium transition-colors px-2"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/how-it-works"
                className="text-accent-700 hover:text-brand-600 font-medium transition-colors px-2"
                onClick={() => setMobileOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/team"
                className="text-accent-700 hover:text-brand-600 font-medium transition-colors px-2"
                onClick={() => setMobileOpen(false)}
              >
                Our Team
              </Link>
              <Link
                href="/success-stories"
                className="text-accent-700 hover:text-brand-600 font-medium transition-colors px-2"
                onClick={() => setMobileOpen(false)}
              >
                Success Stories
              </Link>
              <Link
                href="/answers"
                className="text-accent-700 hover:text-brand-600 font-medium transition-colors px-2"
                onClick={() => setMobileOpen(false)}
              >
                Q&amp;A
              </Link>
              <Link
                href="/how-it-works"
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
