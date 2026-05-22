import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_COUNTRIES = new Set(["nz", "au", "ca"]);

export async function POST(req: Request) {
  let body: {
    email?: unknown;
    name?: unknown;
    country?: unknown;
    sourceUrl?: unknown;
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

  // Honeypot check — silently accept bot submissions
  if (typeof body._website === "string" && body._website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const { email, name, country, sourceUrl: bodySourceUrl } = body;

  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json(
      { ok: false, error: "Valid email required" },
      { status: 400 }
    );
  }

  if (typeof country !== "string" || !VALID_COUNTRIES.has(country)) {
    return NextResponse.json(
      { ok: false, error: "Invalid country" },
      { status: 400 }
    );
  }

  if (name !== undefined && (typeof name !== "string" || name.length > 120)) {
    return NextResponse.json(
      { ok: false, error: "Name must be 120 characters or fewer" },
      { status: 400 }
    );
  }

  const sourceUrl =
    typeof bodySourceUrl === "string" && bodySourceUrl.length > 0
      ? bodySourceUrl
      : req.headers.get("referer") || undefined;

  try {
    await sanityWriteClient.create({
      _type: "interestSubmission",
      email,
      ...(typeof name === "string" && name.length > 0 ? { name } : {}),
      country,
      ...(sourceUrl ? { sourceUrl } : {}),
      submittedAt: new Date().toISOString(),
      status: "new",
    });
  } catch (err) {
    console.error("submit-interest:", err);
    return NextResponse.json(
      { ok: false, error: "Server error, please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
