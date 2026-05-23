import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Sets a `country` cookie based on the URL prefix so server components
 * (e.g. Footer) can read the active country without inspecting the URL
 * themselves.
 *
 * - `/au` or `/au/...` => 'au'
 * - `/ca` or `/ca/...` => 'ca'
 * - anything else => 'nz'
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let country: "nz" | "au" | "ca" = "nz";
  if (path === "/au" || path.startsWith("/au/")) {
    country = "au";
  } else if (path === "/ca" || path.startsWith("/ca/")) {
    country = "ca";
  }

  const response = NextResponse.next();
  response.cookies.set("country", country, {
    httpOnly: false, // readable from client JS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
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
