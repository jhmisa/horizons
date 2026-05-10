import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/image";
import type { QACardData } from "@/types/qa";

export function QACard({ qa }: { qa: QACardData }) {
  const thumbUrl = `https://image.mux.com/${qa.video.asset.playbackId}/thumbnail.jpg?width=640${
    qa.video.asset.thumbTime ? `&time=${qa.video.asset.thumbTime}` : ""
  }`;
  const avatarUrl = urlFor(qa.lia.photo).width(64).height(64).fit("crop").url();

  return (
    <Link
      href={`/answers/${qa.slug.current}`}
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={thumbUrl}
          alt=""
          width={640}
          height={360}
          className="h-full w-full object-cover"
        />
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
