import { sanityClient } from "@/lib/sanity";
import { publishedQAsForCountryQuery } from "@/lib/queries";
import { QACard } from "@/components/qa/QACard";
import { SubmitQuestionForm } from "@/components/qa/SubmitQuestionForm";
import type { Country } from "@/lib/config";
import type { QACardData } from "@/types/qa";

export default async function AnswersIndex({ country }: { country: Country }) {
  const qas = await sanityClient.fetch<QACardData[]>(
    publishedQAsForCountryQuery,
    { country }
  );

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900">
          Immigration questions, answered by licensed advisers
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Short videos from our team on common visa questions for New Zealand.
        </p>
      </header>

      {qas.length === 0 ? (
        <p className="text-slate-600">
          No Q&amp;As published yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {qas.map((qa) => (
            <QACard key={qa._id} qa={qa} />
          ))}
        </div>
      )}

      <section className="mt-20 max-w-2xl mx-auto">
        <SubmitQuestionForm />
      </section>
    </main>
  );
}
