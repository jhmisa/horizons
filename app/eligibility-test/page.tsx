"use client";

import { useState } from "react";
import Link from "next/link";

interface QuestionOption {
  label: string;
  value: string;
  emoji?: string;
}

interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    id: "destination",
    question: "Which country are you hoping to move to?",
    options: [
      { label: "New Zealand", value: "nz", emoji: "🇳🇿" },
      { label: "Australia", value: "au", emoji: "🇦🇺" },
      { label: "I'm open to both", value: "both", emoji: "🌏" },
    ],
  },
  {
    id: "age",
    question: "What is your age range?",
    options: [
      { label: "Under 30", value: "under-30" },
      { label: "30–39", value: "30-39" },
      { label: "40–49", value: "40-49" },
      { label: "50 or older", value: "50-plus" },
    ],
  },
  {
    id: "education",
    question: "What is your highest level of education?",
    options: [
      { label: "High school diploma", value: "high-school" },
      { label: "Trade certificate / Diploma", value: "trade" },
      { label: "Bachelor's degree", value: "bachelors" },
      { label: "Master's or higher", value: "masters" },
    ],
  },
  {
    id: "experience",
    question: "How many years of skilled work experience do you have?",
    options: [
      { label: "Less than 2 years", value: "0-2" },
      { label: "2–5 years", value: "2-5" },
      { label: "5–10 years", value: "5-10" },
      { label: "10+ years", value: "10-plus" },
    ],
  },
  {
    id: "field",
    question: "What is your primary occupation field?",
    options: [
      { label: "IT / Engineering / Science", value: "stem" },
      { label: "Healthcare / Medical", value: "healthcare" },
      { label: "Trades (Construction, Electrical, etc.)", value: "trades" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "english",
    question: "What is your English proficiency level?",
    options: [
      { label: "Native speaker", value: "native" },
      { label: "Fluent (IELTS 7+)", value: "fluent" },
      { label: "Competent (IELTS 5–6.5)", value: "competent" },
      { label: "Basic or below", value: "basic" },
    ],
  },
  {
    id: "family",
    question: "Will family members be included in your application?",
    options: [
      { label: "Just me", value: "single" },
      { label: "Me and my partner", value: "partner" },
      { label: "Family with children", value: "family" },
    ],
  },
];

function getResult(answers: Record<string, string>) {
  let score = 0;

  // Age scoring
  if (answers.age === "under-30" || answers.age === "30-39") score += 3;
  else if (answers.age === "40-49") score += 1;

  // Education
  if (answers.education === "masters") score += 3;
  else if (answers.education === "bachelors") score += 2;
  else if (answers.education === "trade") score += 1;

  // Experience
  if (answers.experience === "10-plus") score += 3;
  else if (answers.experience === "5-10") score += 2;
  else if (answers.experience === "2-5") score += 1;

  // Field
  if (answers.field === "stem" || answers.field === "healthcare") score += 2;
  else if (answers.field === "trades") score += 1;

  // English
  if (answers.english === "native" || answers.english === "fluent") score += 2;
  else if (answers.english === "competent") score += 1;

  if (score >= 10) {
    return {
      level: "Strong",
      color: "green",
      message:
        "Based on your responses, you appear to have a strong eligibility profile. Multiple visa pathways may be available to you.",
    };
  } else if (score >= 6) {
    return {
      level: "Moderate",
      color: "brand",
      message:
        "Based on your responses, you likely have viable pathways available. A consultation with an LIA can identify the best route for your specific situation.",
    };
  } else {
    return {
      level: "Needs Review",
      color: "amber",
      message:
        "Based on your responses, your situation may require a more tailored approach. An LIA consultation can explore alternative pathways and strategies.",
    };
  }
}

export default function EligibilityTestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (currentStep < totalSteps - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/eligibility/submit
    setSubmitted(true);
  };

  const result = getResult(answers);

  if (showResults) {
    return (
      <section className="pt-32 pb-20 lg:pt-40 min-h-screen bg-[#FAFAFA]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-accent-100 p-8 md:p-12">
            {/* Result Header */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
                  result.color === "green"
                    ? "bg-green-100 text-green-600"
                    : result.color === "brand"
                      ? "bg-brand-100 text-brand-600"
                      : "bg-amber-100 text-amber-600"
                } text-3xl`}
              >
                <i
                  className={`fa-solid ${result.color === "green" ? "fa-circle-check" : result.color === "brand" ? "fa-chart-line" : "fa-magnifying-glass"}`}
                />
              </div>
              <h2 className="text-3xl font-bold text-accent mb-2">
                Eligibility: {result.level}
              </h2>
              <p className="text-lg text-accent-600 leading-relaxed">
                {result.message}
              </p>
            </div>

            <div className="border-t border-accent-100 pt-8">
              {!submitted ? (
                <>
                  <h3 className="text-xl font-bold text-accent mb-2">
                    Get your detailed results
                  </h3>
                  <p className="text-accent-600 text-sm mb-6">
                    Enter your details below and we&apos;ll send you a full
                    breakdown of your recommended pathways.
                  </p>
                  <form
                    onSubmit={handleSubmitContact}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-accent-100 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-accent"
                    />
                    <button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-md"
                    >
                      Get My Results{" "}
                      <i className="fa-solid fa-arrow-right ml-2" />
                    </button>
                  </form>
                  <p className="text-xs text-accent-400 mt-4 text-center">
                    <i className="fa-solid fa-lock mr-1" /> Your data is 100%
                    confidential. We never share your information.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    <i className="fa-solid fa-check" />
                  </div>
                  <h3 className="text-xl font-bold text-accent mb-2">
                    Results sent!
                  </h3>
                  <p className="text-accent-600 mb-8">
                    Check your email for a detailed breakdown of your recommended
                    pathways.
                  </p>
                  <Link
                    href="/book"
                    className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg"
                  >
                    Book Your Consultation — $190{" "}
                    <i className="fa-solid fa-arrow-right ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <section className="pt-32 pb-20 lg:pt-40 min-h-screen bg-[#FAFAFA]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-accent-100 p-8 md:p-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-accent-400 tracking-wider uppercase">
              Free Eligibility Test
            </span>
            <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-2xl">
              <i className="fa-regular fa-clock mr-1" /> ~2 Mins
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-accent-50 rounded-2xl h-2 mb-8">
            <div
              className="bg-brand-600 h-2 rounded-2xl transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-accent-400 mb-6">
            Question {currentStep + 1} of {totalSteps}
          </p>

          {/* Question */}
          <h2 className="text-2xl font-bold text-accent mb-8">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(currentQuestion.id, option.value)}
                className={`w-full flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all text-left group ${
                  answers[currentQuestion.id] === option.value
                    ? "border-brand-500 bg-brand-50"
                    : "border-accent-100 hover:border-brand-500 hover:bg-brand-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {option.emoji && (
                    <span className="text-2xl">{option.emoji}</span>
                  )}
                  <span className="font-bold text-accent text-lg group-hover:text-brand-700">
                    {option.label}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-2xl border-2 shrink-0 ${
                    answers[currentQuestion.id] === option.value
                      ? "border-brand-500 bg-brand-500"
                      : "border-accent-200 group-hover:border-brand-500"
                  }`}
                >
                  {answers[currentQuestion.id] === option.value && (
                    <i className="fa-solid fa-check text-white text-xs flex items-center justify-center h-full" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Back Button */}
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="mt-6 text-accent-500 hover:text-brand-600 font-medium text-sm transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2" /> Back
            </button>
          )}
        </div>

        <p className="text-xs text-accent-400 mt-6 text-center">
          <i className="fa-solid fa-lock mr-1" /> 100% Confidential. Your data
          is never shared with third parties.
        </p>
      </div>
    </section>
  );
}
