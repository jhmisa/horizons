"use client";

import { useState } from "react";

export function TranscriptDisclosure({ transcript }: { transcript: string }) {
  const [open, setOpen] = useState(false);
  const paragraphs = transcript.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <section className="mt-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-semibold text-brand-600 hover:text-brand-800"
        aria-expanded={open}
      >
        {open ? "Hide transcript" : "Show transcript"}
      </button>
      {open && (
        <div className="mt-4 space-y-4 text-slate-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </section>
  );
}
