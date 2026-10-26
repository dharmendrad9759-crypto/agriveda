"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblemCrop } from "@/data/crop-curative-problems";
import { notFound } from "next/navigation";
import { Camera } from "lucide-react";

function tagTone(tag: string) {
  if (/कीट|इल्ली|मक्खी|माइट|थ्रिप्स|फुदका|सुंडी/i.test(tag)) {
    return "bg-amber-400 text-amber-950 font-black";
  }
  if (/वायरस|मोज़ेक/i.test(tag)) {
    return "bg-rose-400 text-white font-black";
  }
  if (/जीवाणु|बैक्टीर/i.test(tag)) {
    return "bg-sky-400 text-sky-950 font-black";
  }
  return "bg-emerald-400 text-emerald-950 font-black";
}

type FilterType = "all" | "pest" | "disease" | "yellow";

export function getCleanHindiTitle(nameHi: string): string {
  if (!nameHi) return "";
  // Strip any parentheses containing English/Latin letters, e.g. " (Fall Armyworm - FAW)"
  let clean = nameHi.replace(/\s*\([^)]*[A-Za-z][^)]*\)/g, "").trim();
  clean = clean.replace(/[-–—/]\s*[A-Za-z0-9\s&+/._-]+\s*$/g, "").trim();
  return clean || nameHi;
}

/** Step 2 — visual photo problem grid */
export default function CropProblemGalleryClient({ cropSlug }: { cropSlug: string }) {
  const crop = getCropProblemCrop(cropSlug);
  if (!crop) notFound();

  return (
    <ProblemFlowShell
      title="समस्या चुनें"
      step={2}
      backHref="/crop-problems"
      rightSlot={
        <span className="flex max-w-[8.5rem] items-center gap-1.5 overflow-hidden rounded-2xl border border-emerald-900/15 bg-white px-2 py-1 shadow-xs">
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-xl">
            <Image src={crop.image} alt="" fill className="object-cover" sizes="28px" />
          </span>
          <span className="min-w-0 truncate text-[11px] font-black text-emerald-950">
            {crop.nameHi}
          </span>
        </span>
      }
    >
      {/* Grid of visual cards without duplicate headers, search or circle numbers */}
      <div className="grid grid-cols-2 gap-3 pb-6">
        {crop.problems.map((p) => {
          const cleanTitle = getCleanHindiTitle(p.nameHi);
          return (
            <AppLink
              key={p.id}
              href={`/crop-problems/${crop.slug}/${p.id}`}
              className="group relative overflow-hidden rounded-[22px] border border-emerald-900/10 bg-white shadow-[0_16px_40px_-28px_rgba(4,120,87,0.5)] active:scale-[0.98] transition"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-emerald-50">
                <Image
                  src={p.image}
                  alt={cleanTitle || p.nameHi}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="50vw"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[9.5px] shadow ${tagTone(
                    p.tagHi
                  )}`}
                >
                  {p.tagHi}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="text-[13px] font-extrabold leading-snug text-white drop-shadow">
                    {cleanTitle || p.nameHi}
                  </p>
                  {p.nameEn ? (
                    <p className="mt-0.5 text-[10.5px] font-semibold text-white/85 line-clamp-1">
                      {p.nameEn}
                    </p>
                  ) : null}
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-1.5 py-0.5 text-[8.5px] font-bold text-white shadow-2xs">
                    सटीक दवा व डोज़ देखें →
                  </span>
                </div>
              </div>
            </AppLink>
          );
        })}
      </div>

      {/* Floating 1-tap AI Doctor Banner */}
      <div className="mb-6 rounded-2xl border border-teal-500/25 bg-gradient-to-r from-teal-900 to-emerald-950 p-3.5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black">खेत में कुछ अलग दिख रहा है?</p>
              <p className="text-[10px] text-teal-200">पत्ते या कीट का फोटो खींचकर 5 सेकंड में सटीक रिपोर्ट पाएँ</p>
            </div>
          </div>
          <AppLink
            href="/ai-doctor"
            className="shrink-0 rounded-xl bg-teal-500 px-3 py-2 text-xs font-black text-teal-950 active:scale-95 shadow-xs"
          >
            फोटो लें 📷
          </AppLink>
        </div>
      </div>
    </ProblemFlowShell>
  );
}
