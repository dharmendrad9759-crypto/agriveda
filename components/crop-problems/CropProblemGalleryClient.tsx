"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblemCrop } from "@/data/crop-curative-problems";
import { notFound } from "next/navigation";

/** Step 2 — photo problem grid */
export default function CropProblemGalleryClient({ cropSlug }: { cropSlug: string }) {
  const crop = getCropProblemCrop(cropSlug);
  if (!crop) notFound();

  return (
    <ProblemFlowShell
      title="समस्या चुनें"
      step={2}
      backHref="/crop-problems"
      rightSlot={
        <span className="rounded-full bg-[#E8F5EE] px-2.5 py-1 text-[11px] font-black text-[#0B5C3B]">
          {crop.emoji} {crop.nameHi}
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {crop.problems.map((p) => (
          <AppLink
            key={p.id}
            href={`/crop-problems/${crop.slug}/${p.id}`}
            className="overflow-hidden rounded-[18px] border border-[#D8E8DE] bg-white shadow-[0_8px_22px_-14px_rgba(11,92,59,0.45)] active:scale-[0.98]"
          >
            <div className="relative aspect-[1/1] bg-[#EAF7EF]">
              <Image src={p.image} alt={p.nameHi} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="min-h-[52px] px-2 py-2.5">
              <p className="text-center text-[12px] font-black leading-snug text-[#0B3D28]">
                {p.nameHi}
              </p>
            </div>
          </AppLink>
        ))}
      </div>
    </ProblemFlowShell>
  );
}
