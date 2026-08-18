"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";

/** Step 1 — crop picker */
export default function CropProblemsClient() {
  return (
    <ProblemFlowShell title="फसल चुनें" step={1} backHref="/">
      <div className="grid grid-cols-3 gap-3 pb-4">
        {CROP_PROBLEM_CROPS.map((crop) => (
          <AppLink
            key={crop.slug}
            href={`/crop-problems/${crop.slug}`}
            className="relative flex flex-col items-center gap-2 rounded-[18px] border border-[#D8E8DE] bg-white p-3 shadow-[0_6px_18px_-12px_rgba(11,92,59,0.4)] active:scale-[0.97]"
          >
            <span className="relative h-[76px] w-[76px] overflow-hidden rounded-full border-[3px] border-[#B7E0C6] bg-[#F3F8F4] shadow-inner">
              <Image src={crop.image} alt={crop.nameHi} fill className="object-cover" sizes="76px" />
            </span>
            <span className="text-center text-[12px] font-black text-[#0B3D28]">{crop.nameHi}</span>
          </AppLink>
        ))}
      </div>
    </ProblemFlowShell>
  );
}
