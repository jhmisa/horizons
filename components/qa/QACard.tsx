import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/image";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import type { Country } from "@/lib/config";
import type { QACardData } from "@/types/qa";

export function QACard({ qa, country }: { qa: QACardData; country: Country }) {
  const videoId = extractYouTubeId(qa.youtubeUrl);
  const thumbUrl = videoId ? youtubeThumbnail(videoId, "hq") : null;
  const avatarUrl = urlFor(qa.lia.photo).width(64).height(64).fit("crop").url();
  const pathPrefix = country === "nz" ? "" : `/${country}`;

  return (
    <Link
      href={`${pathPrefix}/answers/${qa.slug.current}`}
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt=""
            width={480}
            height={360}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-400">
            <i className="fa-regular fa-comment-dots text-5xl" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-3 text-base font-semibold text-slate-900 group-hover:text-brand-800">
          {qa.question}
        </h3>
        <div className="mt-4 flex items-center gap-2">
          <Image
            src={avatarUrl}
            alt={qa.lia.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm text-slate-600">{qa.lia.name}</span>
        </div>
      </div>
    </Link>
  );
}
