"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblemCrop } from "@/data/crop-curative-problems";
import { notFound } from "next/navigation";

function tagTone(tag: string) {
  if (/कीट|इल्ली|मक्खी|माइट|थ्रिप्स|फुदका/i.test(tag)) {
    return "bg-amber-400 text-amber-950";
  }
  if (/वायरस|मोज़ेक/i.test(tag)) {
    return "bg-rose-300 text-rose-950";
  }
  if (/जीवाणु|बैक्टीर/i.test(tag)) {
    return "bg-sky-300 text-sky-950";
  }
  return "bg-emerald-300 text-emerald-950";
}

/** Step 2 — photo problem grid */
export default function CropProblemGalleryClient({ cropSlug }: { cropSlug: string }) {
  const crop = getCropProblemCrop(cropSlug);
  if (!crop) notFound();

  return (
    <ProblemFlowShell
      title="समस्या चुनें"
      subtitle={`${crop.nameHi} की खेत वाली तस्वीर से मिलाएँ`}
      step={2}
      backHref="/crop-problems"
      rightSlot={
        <span className="flex max-w-[7.5rem] items-center gap-1.5 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white px-2 py-1.5 shadow-sm">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl">
            <Image src={crop.image} alt="" fill className="object-cover" sizes="32px" />
          </span>
          <span className="min-w-0 truncate text-[11px] font-extrabold text-emerald-950">
            {crop.nameHi}
          </span>
        </span>
      }
    >
      <div className="mb-4 rounded-[22px] border border-emerald-900/10 bg-white/80 px-3.5 py-3 shadow-[0_12px_30px_-24px_rgba(4,120,87,0.45)] backdrop-blur-sm">
        <p className="text-[12px] font-bold text-emerald-950">
          {crop.emoji} {crop.nameHi} · {crop.problems.length} समस्याएँ
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-emerald-900/50">
          जो फोटो आपके खेत जैसी लगे — उसी पर टैप करें
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6">
        {crop.problems.map((p, idx) => (
          <AppLink
            key={p.id}
            href={`/crop-problems/${crop.slug}/${p.id}`}
            className="group relative overflow-hidden rounded-[22px] border border-emerald-900/10 bg-white shadow-[0_16px_40px_-28px_rgba(4,120,87,0.5)] active:scale-[0.98]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-emerald-50">
              <Image
                src={p.image}
                alt={p.nameHi}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="50vw"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <span
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold shadow ${tagTone(p.tagHi)}`}
              >
                {p.tagHi}
              </span>
              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/35 text-[10px] font-black text-white backdrop-blur-sm">
                {idx + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <p className="text-[13px] font-extrabold leading-snug text-white drop-shadow">
                  {p.nameHi}
                </p>
                {p.nameEn ? (
                  <p className="mt-0.5 text-[10px] font-semibold text-white/75">{p.nameEn}</p>
                ) : null}
              </div>
            </div>
          </AppLink>
        ))}
      </div>
    </ProblemFlowShell>
  );
}
