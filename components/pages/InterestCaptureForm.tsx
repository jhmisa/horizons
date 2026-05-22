"use client";

import { useState } from "react";
import type { Country } from "@/lib/config";

type Status = "idle" | "submitting" | "success" | "error";

export default function InterestCaptureForm({
  country,
  displayName,
}: {
  country: Country;
  displayName: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          country,
          sourceUrl:
            typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (res.status === 201) {
        setStatus("success");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white shadow-lg p-8 max-w-md mx-auto text-center">
        <div className="text-brand-600 text-4xl mb-3" aria-hidden="true">
          <i className="fa-solid fa-circle-check" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Thanks! We&apos;ll be in touch when we launch.
        </h3>
        <p className="text-sm text-slate-600">
          We&apos;ll only email you about our {displayName} launch.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-lg p-8 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
        Get notified when we launch
      </h3>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          maxLength={254}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={120}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        {/* Honeypot */}
        <input
          type="text"
          name="_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-full py-3 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Notify me"}
        </button>
        <p className="text-xs text-slate-500 text-center">
          We&apos;ll only email you about our {displayName} launch.
        </p>
        {status === "error" && (
          <p className="text-sm text-red-600 text-center">
            Something went wrong. Please try again or email{" "}
            <a href="mailto:hello@horizons.nz" className="underline">
              hello@horizons.nz
            </a>
            .
          </p>
        )}
        <p className="text-xs text-slate-500 text-center pt-2">
          <a
            href="/privacy-policy"
            className="text-xs text-slate-500 underline"
          >
            Privacy policy
          </a>
        </p>
      </form>
    </div>
  );
}
