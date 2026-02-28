"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const timeSlots = [
    { id: "1", label: "Monday", time: "9:00 AM NZT" },
    { id: "2", label: "Monday", time: "1:00 PM NZT" },
    { id: "3", label: "Tuesday", time: "10:30 AM NZT" },
    { id: "4", label: "Tuesday", time: "3:00 PM NZT" },
    { id: "5", label: "Wednesday", time: "9:00 AM NZT" },
    { id: "6", label: "Wednesday", time: "1:00 PM NZT" },
    { id: "7", label: "Thursday", time: "10:00 AM NZT" },
    { id: "8", label: "Thursday", time: "2:00 PM NZT" },
    { id: "9", label: "Friday", time: "9:00 AM NZT" },
    { id: "10", label: "Friday", time: "12:00 PM NZT" },
  ];

  const toggleSlot = (id: string) => {
    setSelectedSlots((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Create Stripe Checkout session via /api/stripe/checkout
    alert(
      "This will redirect to Stripe Checkout for $190 USD. (Integration coming soon)"
    );
  };

  return (
    <>
      {/* Page Header */}
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-brand-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-2xl bg-brand-500/20 text-brand-100 border border-brand-400/30 text-sm font-semibold tracking-wide mb-6 fade-in-up">
            STEP 3: BOOK YOUR CONSULTATION
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 fade-in-up delay-100">
            Book Your LIA Consultation
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto fade-in-up delay-200">
            A one-on-one session with a Licensed Immigration Adviser. Select
            your preferred times and we&apos;ll confirm the appointment.
          </p>
        </div>
      </header>

      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-accent-100 p-8 md:p-10"
              >
                <h2 className="text-2xl font-bold text-accent mb-6">
                  Your Details
                </h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent"
                      placeholder="+64 21 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Brief note about your situation
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent resize-none"
                      placeholder="E.g., Software engineer, 5 years experience, family of 4, interested in NZ..."
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <h2 className="text-2xl font-bold text-accent mb-2">
                  Select 2–3 Preferred Times
                </h2>
                <p className="text-sm text-accent-500 mb-6">
                  Choose up to 3 slots. We&apos;ll confirm the final time via
                  email.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleSlot(slot.id)}
                      className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border-2 ${
                        selectedSlots.includes(slot.id)
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-accent-100 text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                      }`}
                    >
                      {slot.label}
                      <br />
                      <span className="text-xs text-accent-500">
                        {slot.time}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={selectedSlots.length < 2}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-lock" /> Pay $190 USD &amp;
                  Confirm
                </button>
                <p className="text-xs text-accent-400 mt-4 text-center">
                  Secure payment via Stripe. Your $190 is fully creditable toward
                  the processing fee.
                </p>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl text-white sticky top-28">
                <h3 className="text-2xl font-bold mb-2">
                  Expert Consultation
                </h3>
                <p className="text-brand-200 mb-6">
                  1-Hour Video Call with an LIA
                </p>

                <div className="border-t border-white/10 pt-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-magnifying-glass-chart text-brand-400 mt-1" />
                    <div>
                      <div className="font-semibold text-white text-sm">
                        In-Depth Profile Assessment
                      </div>
                      <div className="text-brand-300 text-xs">
                        Qualifications analyzed against current laws
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-map-location-dot text-brand-400 mt-1" />
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Your Optimal Pathway
                      </div>
                      <div className="text-brand-300 text-xs">
                        Highest probability route identified
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-comments text-brand-400 mt-1" />
                    <div>
                      <div className="font-semibold text-white text-sm">
                        Live Q&amp;A Session
                      </div>
                      <div className="text-brand-300 text-xs">
                        All your questions answered
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-200">Consultation Fee</span>
                    <span className="text-2xl font-extrabold">
                      $190{" "}
                      <span className="text-sm font-normal text-brand-300">
                        USD
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-brand-300 mt-2">
                    <i className="fa-solid fa-check text-green-400 mr-1" />{" "}
                    Fully creditable toward the $2,000 processing fee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
