"use client";

import { useState } from "react";
import type { Country } from "@/lib/config";

type Status = "idle" | "submitting" | "success" | "error";

export function SubmitQuestionForm({ country }: { country: Country }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/submit-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          question,
          country,
          _website: website,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">
          ✓ Got it! We&apos;ll review your question.
        </p>
        <p className="mt-2 text-sm text-green-700">
          If it&apos;s a fit, you&apos;ll see it answered in a future Q&amp;A
          video here.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-slate-900">
        Don&apos;t see your question?
      </h2>
      <p className="mt-2 text-slate-600">
        Send it to us. If it&apos;s a question others may have too, we&apos;ll
        answer it in a future video.
      </p>

      {/* Honeypot — hidden from real users, bots fill it in */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Website
          <input
            type="text"
            name="_website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="sq-name"
            className="block text-sm font-semibold text-slate-700"
          >
            Your name (optional)
          </label>
          <input
            id="sq-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="sq-email"
            className="block text-sm font-semibold text-slate-700"
          >
            Your email *
          </label>
          <input
            id="sq-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="sq-question"
            className="block text-sm font-semibold text-slate-700"
          >
            Your question *
          </label>
          <textarea
            id="sq-question"
            required
            rows={5}
            minLength={10}
            maxLength={2000}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow hover:bg-brand-800 disabled:bg-slate-300"
      >
        {status === "submitting" ? "Sending…" : "Send Question"}
      </button>

      <p className="mt-4 text-xs text-slate-500">
        We&apos;ll only use your email to follow up on your question. No spam,
        ever.
      </p>
    </form>
  );
}
