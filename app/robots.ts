import type { MetadataRoute } from "next";
import { sharedConfig } from "@/lib/config";

const SITE_URL = sharedConfig.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
