import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
  ],
  async redirects() {
    return [
      {
        source: "/team",
        destination: "/about",
        permanent: true,
      },
      // --- salvaged paths from old Wix site (horizonsmigration.com) ---
      { source: "/advisers", destination: "/about", permanent: true },
      { source: "/ourteam", destination: "/about", permanent: true },
      { source: "/whyhorizons", destination: "/about", permanent: true },
      { source: "/offices", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/book", permanent: true },
      { source: "/faqs", destination: "/answers", permanent: true },
      { source: "/testimonials", destination: "/success-stories", permanent: true },
      { source: "/testimonial2", destination: "/success-stories", permanent: true },
      { source: "/more-feedbacks", destination: "/success-stories", permanent: true },
      { source: "/photo-gallery", destination: "/success-stories", permanent: true },
      { source: "/fees", destination: "/book", permanent: true },
      { source: "/assessment", destination: "/book", permanent: true },
      { source: "/assessment-consultation-package", destination: "/book", permanent: true },
      { source: "/initial-evaluation-form", destination: "/book", permanent: true },
      { source: "/initial", destination: "/book", permanent: true },
      { source: "/hnz-partner-schools", destination: "/partner-schools", permanent: true },
      { source: "/study-nz", destination: "/how-it-works", permanent: true },
      { source: "/studentvisareq", destination: "/how-it-works", permanent: true },
      { source: "/life-in-new-zealand", destination: "/how-it-works", permanent: true },
      { source: "/immigration-services", destination: "/how-it-works", permanent: true },
      { source: "/types-of-visas", destination: "/how-it-works", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/copy-of-home", destination: "/", permanent: true },
      // Canada/Australia legacy promo pages
      { source: "/canada-ebook", destination: "/ca", permanent: true },
      { source: "/ca-promo", destination: "/ca", permanent: true },
      { source: "/promo-canada", destination: "/ca", permanent: true },
      { source: "/canada-webinar", destination: "/ca", permanent: true },
      { source: "/ca-webinar", destination: "/ca", permanent: true },
      { source: "/cad-promo", destination: "/ca", permanent: true },
      { source: "/cad-webinar", destination: "/ca", permanent: true },
      { source: "/aus-assessment-promo", destination: "/au", permanent: true },
      { source: "/ausstudentvisareq", destination: "/au", permanent: true },
      { source: "/aus-bank-promo", destination: "/au", permanent: true },
      // healthcare/nurse promos → how-it-works (no dedicated page yet)
      { source: "/nurse", destination: "/how-it-works", permanent: true },
      { source: "/nursetool", destination: "/how-it-works", permanent: true },
      { source: "/healthprofessionals", destination: "/how-it-works", permanent: true },
      { source: "/healthcareprofessionals", destination: "/how-it-works", permanent: true },
      { source: "/nz-hca", destination: "/how-it-works", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
