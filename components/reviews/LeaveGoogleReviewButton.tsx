import { GOOGLE_REVIEW_URL } from "@/lib/config";

type Props = {
  className?: string;
};

export function LeaveGoogleReviewButton({ className = "" }: Props) {
  return (
    <div className={`mt-8 flex justify-center ${className}`}>
      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand-700 border border-brand-200 text-sm font-semibold shadow-sm hover:bg-brand-50 hover:border-brand-300 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <i className="fa-brands fa-google" aria-hidden="true" />
        Leave us a Google review
        <i
          className="fa-solid fa-arrow-up-right-from-square text-xs opacity-70"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
