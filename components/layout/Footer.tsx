import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-accent-950 text-accent-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Social */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-6 cursor-pointer group"
            >
              <i className="fa-solid fa-earth-oceania text-brand-500 text-3xl group-hover:scale-110 transition-transform" />
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-brand-100 transition-colors">
                Horizons<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-accent-300 mb-8 leading-relaxed">
              For 20 years, our Licensed Immigration Advisers have guided
              hundreds of families to New Zealand and Australia with honest
              advice and a clear plan.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-accent-900 flex items-center justify-center text-accent-300 hover:text-white hover:bg-brand-600 transition-all"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-accent-900 flex items-center justify-center text-accent-300 hover:text-white hover:bg-brand-600 transition-all"
              >
                <i className="fa-brands fa-youtube" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-accent-900 flex items-center justify-center text-accent-300 hover:text-white hover:bg-brand-600 transition-all"
              >
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-brand-400 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-brand-400 transition-colors"
                >
                  Meet the Team
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="hover:text-brand-400 transition-colors"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-brand-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/eligibility-test"
                  className="hover:text-brand-400 transition-colors"
                >
                  Free Eligibility Test
                </Link>
              </li>
              <li>
                <Link
                  href="/#why-lia"
                  className="hover:text-brand-400 transition-colors"
                >
                  Why Use an LIA?
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-brand-400 transition-colors"
                >
                  Immigration Blog
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-brand-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-brand-500" />
                <span>
                  East Auckland,
                  <br />
                  New Zealand
                </span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-brand-500" />
                <a
                  href="mailto:info@horizonsmigration.com"
                  className="hover:text-brand-400 transition-colors"
                >
                  info@horizonsmigration.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-brand-500" />
                <a
                  href="tel:+6492777162"
                  className="hover:text-brand-400 transition-colors"
                >
                  +64 9 277 7162
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-accent-400 border-t border-accent-800 pt-8 mt-4">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Horizons Immigration. All rights
            reserved. Licensed Immigration Advisers.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              IAA Code of Conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
