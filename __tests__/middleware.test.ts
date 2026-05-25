// @vitest-environment node
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

function makeRequest(pathname: string, cookieHeader?: string): NextRequest {
  const headers = new Headers();
  if (cookieHeader) headers.set("cookie", cookieHeader);
  return new NextRequest(new URL(`https://example.com${pathname}`), { headers });
}

describe("middleware country cookie", () => {
  it("sets country=au on both request and response cookies for /au", () => {
    const request = makeRequest("/au");
    const response = middleware(request);
    // Request mutation is what fixes the Footer-lags-one-render bug.
    expect(request.cookies.get("country")?.value).toBe("au");
    // Response cookie is what the browser persists for future requests.
    expect(response.cookies.get("country")?.value).toBe("au");
  });

  it("sets country=ca on both request and response cookies for /ca", () => {
    const request = makeRequest("/ca");
    const response = middleware(request);
    expect(request.cookies.get("country")?.value).toBe("ca");
    expect(response.cookies.get("country")?.value).toBe("ca");
  });

  it("sets country=nz on both request and response cookies for /", () => {
    const request = makeRequest("/");
    const response = middleware(request);
    expect(request.cookies.get("country")?.value).toBe("nz");
    expect(response.cookies.get("country")?.value).toBe("nz");
  });

  it("overwrites a stale browser cookie when switching countries", () => {
    // User was on NZ (browser has country=nz) and navigates to /au.
    // Middleware must overwrite the request cookie so server components
    // on THIS render see 'au', not the stale 'nz'.
    const request = makeRequest("/au", "country=nz");
    const response = middleware(request);
    expect(request.cookies.get("country")?.value).toBe("au");
    expect(response.cookies.get("country")?.value).toBe("au");
  });

  it("leaves the country cookie untouched on shared paths like /book", () => {
    const request = makeRequest("/book", "country=au");
    const response = middleware(request);
    // Browser-sent cookie is preserved; middleware does NOT clobber to 'nz'.
    expect(request.cookies.get("country")?.value).toBe("au");
    expect(response.cookies.get("country")).toBeUndefined();
  });

  it("leaves the country cookie untouched on /book when no cookie was sent", () => {
    const request = makeRequest("/book");
    const response = middleware(request);
    expect(request.cookies.get("country")).toBeUndefined();
    expect(response.cookies.get("country")).toBeUndefined();
  });
});
