"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { CROP_PROBLEM_CROPS, type CropProblemCrop } from "@/data/crop-curative-problems";

const GROUPS: { id: string; title: string; match: (c: CropProblemCrop) => boolean }[] = [
  {
    id: "cereals",
    title: "अनाज",
    match: (c) => ["paddy", "wheat", "maize"].includes(c.slug),
  },
  {
    id: "veg",
    title: "सब्ज़ी",
    match: (c) =>
      ["tomato", "potato", "onion", "chilli", "brinjal", "cauliflower", "bhindi", "cucumber"].includes(
        c.slug
      ),
  },
  {
    id: "cash",
    title: "नकदी · तिलहन",
    match: (c) => ["cotton", "sugarcane", "mustard", "soybean"].includes(c.slug),
  },
  {
    id: "spice",
    title: "मसाला",
    match: (c) => ["turmeric", "ginger", "garlic"].includes(c.slug),
  },
];

function CropTile({ crop }: { crop: CropProblemCrop }) {
  return (
    <AppLink
      href={`/crop-problems/${crop.slug}`}
      className="group relative overflow-hidden rounded-[22px] border border-emerald-900/10 bg-white/90 p-2.5 shadow-[0_14px_36px_-26px_rgba(4,120,87,0.55)] transition active:scale-[0.97]"
    >
      <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-400/15 blur-2xl transition group-hover:bg-emerald-400/25" />
      <span className="relative mx-auto block aspect-square w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-emerald-50 to-teal-50 ring-1 ring-emerald-900/8">
        <Image
          src={crop.image}
          alt={crop.nameHi}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="110px"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </span>
      <span className="relative mt-2 block text-center text-[12px] font-extrabold tracking-tight text-[#052e1c]">
        {crop.nameHi}
      </span>
      <span className="relative mt-0.5 block text-center text-[9px] font-bold uppercase tracking-wide text-emerald-900/40">
        {crop.problems.length} समस्या
      </span>
    </AppLink>
  );
}

/** Step 1 — crop picker */
export default function CropProblemsClient() {
  const used = new Set<string>();
  const sections = GROUPS.map((g) => {
    const items = CROP_PROBLEM_CROPS.filter((c) => g.match(c));
    items.forEach((c) => used.add(c.slug));
    return { ...g, items };
  }).filter((g) => g.items.length > 0);

  const leftover = CROP_PROBLEM_CROPS.filter((c) => !used.has(c.slug));
  if (leftover.length) {
    sections.push({ id: "more", title: "और फसल", match: () => true, items: leftover });
  }

  return (
    <ProblemFlowShell
      title="फसल चुनें"
      subtitle="फोटो वाली समस्या देखने के लिए फसल टैप करें"
      step={1}
      backHref="/"
    >
      <div className="mb-4 overflow-hidden rounded-[24px] border border-emerald-900/10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-4 text-white shadow-[0_20px_50px_-30px_rgba(4,47,26,0.7)]">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200/80">
          समस्या → इलाज
        </p>
        <p className="mt-1 font-display text-[22px] font-bold leading-tight">
          खेत में क्या दिख रहा है?
        </p>
        <p className="mt-1.5 text-[12px] font-medium text-emerald-100/80">
          फसल चुनें → फोटो मिलाएँ → दवा और घरेलू उपाय
        </p>
      </div>

      <div className="space-y-6 pb-6">
        {sections.map((section) => (
          <section key={section.id}>
            <div className="mb-2.5 flex items-center gap-2">
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-800/55">
                {section.title}
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-emerald-900/15 to-transparent" />
              <span className="text-[10px] font-bold text-emerald-900/35">{section.items.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {section.items.map((crop) => (
                <CropTile key={crop.slug} crop={crop} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </ProblemFlowShell>
  );
}
