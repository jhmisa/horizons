import Image from "next/image";
import { urlFor } from "@/lib/image";
import type { LIA } from "@/types/qa";

export function LIAAttribution({ lia }: { lia: LIA }) {
  const photoUrl = urlFor(lia.photo).width(128).height(128).fit("crop").url();

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <Image
        src={photoUrl}
        alt={lia.name}
        width={64}
        height={64}
        className="h-16 w-16 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-slate-900">{lia.name}</p>
        <p className="text-sm text-slate-600">Licensed Immigration Adviser</p>
        <p className="text-sm text-slate-500">License #{lia.licenseNumber}</p>
        <p className="mt-2 text-sm text-slate-700">{lia.bio}</p>
      </div>
    </div>
  );
}
