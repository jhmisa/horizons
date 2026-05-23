import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Sets a `country` cookie based on the URL so server components
 * (e.g. Footer) can read the active country without inspecting the URL
 * themselves.
 *
 * Country-scoped paths set the cookie explicitly:
 *  - `/au` or `/au/...` => 'au'
 *  - `/ca` or `/ca/...` => 'ca'
 *  - any other NZ-scoped path (`/`, `/answers`, `/how-it-works`, ...) => 'nz'
 *
 * Truly shared paths (e.g. `/book`, `/team`, legal pages) do NOT touch the
 * cookie — so an AU visitor navigating from `/au` to `/book` keeps their
 * 'au' cookie, which `/book` reads to pick the right Stripe link.
 */
const SHARED_PREFIXES = [
  "/book",
  "/team",
  "/privacy-policy",
  "/terms-of-service",
  "/iaa-code-of-conduct",
  "/studio",
];

function isSharedPath(path: string): boolean {
  return SHARED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let country: "nz" | "au" | "ca" | null = null;
  if (path === "/au" || path.startsWith("/au/")) {
    country = "au";
  } else if (path === "/ca" || path.startsWith("/ca/")) {
    country = "ca";
  } else if (!isSharedPath(path)) {
    country = "nz";
  }

  const response = NextResponse.next();
  if (country) {
    response.cookies.set("country", country, {
      httpOnly: false, // readable from client JS
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static
     * - _next/image
     * - favicon, robots, sitemap, manifest
     * - public assets (anything with a dot in the last segment is a file)
     */
    "/((?!api|_next/static|_next/image|favicon|robots|sitemap|.*\\..*).*)",
  ],
};
