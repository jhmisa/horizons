import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { sharedConfig } from "@/lib/config";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(sharedConfig.siteUrl),
  title: "Horizons Immigration | Expert Visa Pathways to New Zealand",
  description:
    "For 20 years, our Licensed Immigration Advisers have guided 6,500+ families to New Zealand with honest advice and a clear plan.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: "/images/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className={`${plusJakarta.variable} font-sans text-accent antialiased bg-[#FAFAFA]`}
      >
        <SiteJsonLd siteUrl={sharedConfig.siteUrl} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
