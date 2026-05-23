import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity";
import type { Country } from "@/lib/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_COUNTRIES: readonly Country[] = ["nz", "au", "ca"] as const;

function isCountry(value: unknown): value is Country {
  return (
    typeof value === "string" &&
    (ALLOWED_COUNTRIES as readonly string[]).includes(value)
  );
}

function deriveCountryFromReferer(referer: string | null): Country {
  if (!referer) return "nz";
  try {
    const url = new URL(referer);
    const path = url.pathname;
    if (path === "/au" || path.startsWith("/au/")) return "au";
    if (path === "/ca" || path.startsWith("/ca/")) return "ca";
    return "nz";
  } catch {
    return "nz";
  }
}

export async function POST(req: Request) {
  let body: {
    name?: unknown;
    email?: unknown;
    question?: unknown;
    country?: unknown;
    _website?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Honeypot check first — silently accept bot submissions
  if (typeof body._website === "string" && body._website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { name, email, question } = body;

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Valid email required" },
      { status: 400 }
    );
  }
  if (
    typeof question !== "string" ||
    question.length < 10 ||
    question.length > 2000
  ) {
    return NextResponse.json(
      { ok: false, error: "Question must be 10–2000 characters" },
      { status: 400 }
    );
  }
  if (name !== undefined && (typeof name !== "string" || name.length > 100)) {
    return NextResponse.json(
      { ok: false, error: "Name must be 100 characters or fewer" },
      { status: 400 }
    );
  }

  // Country: explicit body wins; otherwise derive from referer; default 'nz'.
  // If body.country is present but invalid, reject — don't silently fall back.
  let country: Country;
  if (body.country !== undefined) {
    if (!isCountry(body.country)) {
      return NextResponse.json(
        { ok: false, error: "Invalid country" },
        { status: 400 }
      );
    }
    country = body.country;
  } else {
    country = deriveCountryFromReferer(req.headers.get("referer"));
  }

  const sourceUrl = req.headers.get("referer") || undefined;

  try {
    await sanityWriteClient.create({
      _type: "submittedQuestion",
      question,
      submitterEmail: email,
      submitterName: name || undefined,
      country,
      sourceUrl,
      submittedAt: new Date().toISOString(),
      status: "new",
    });
  } catch (err) {
    console.error("submit-question: sanity write failed", err);
    return NextResponse.json(
      { ok: false, error: "Server error, please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
