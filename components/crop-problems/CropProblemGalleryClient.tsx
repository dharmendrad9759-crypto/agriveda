"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { getCropProblemCrop } from "@/data/crop-curative-problems";
import { notFound } from "next/navigation";
import { Search, Camera, Sparkles, Filter } from "lucide-react";

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

/** Step 2 — visual photo problem grid */
export default function CropProblemGalleryClient({ cropSlug }: { cropSlug: string }) {
  const crop = getCropProblemCrop(cropSlug);
  if (!crop) notFound();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredProblems = useMemo(() => {
    return crop.problems.filter((p) => {
      // 1. Text search
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.nameHi.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.tagHi.toLowerCase().includes(q) ||
        p.whatHi.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // 2. Chip filter
      if (activeFilter === "pest") {
        return /कीट|इल्ली|मक्खी|माइट|थ्रिप्स|फुदका|सुंडी|माहू/i.test(`${p.tagHi} ${p.nameHi}`);
      }
      if (activeFilter === "disease") {
        return /फफूंद|रोग|झुलसा|ब्लास्ट|सड़न|उकठा|रस्ट|टिक्का|मोज़ेक|जीवाणु/i.test(`${p.tagHi} ${p.nameHi}`);
      }
      if (activeFilter === "yellow") {
        return /पील|yellow|chlorosis/i.test(`${p.nameHi} ${p.whatHi} ${p.tagHi}`);
      }

      return true;
    });
  }, [crop.problems, search, activeFilter]);

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
      {/* Search & Header banner */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between rounded-2xl border border-emerald-900/10 bg-white/90 px-3.5 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{crop.emoji}</span>
            <p className="text-[12.5px] font-black text-emerald-950">
              {crop.nameHi} में मुख्य समस्याएं ({crop.problems.length})
            </p>
          </div>
          <span className="text-[10.5px] font-bold text-slate-500">फोटो देखकर चुनें</span>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="समस्या खोजें (उदा. सुंडी, झुलसा, पीला पत्ता)..."
            className="w-full rounded-2xl border border-emerald-900/15 bg-white py-2.5 pl-10 pr-3 text-[12.5px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-xs"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-black">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`shrink-0 rounded-xl px-3 py-1.5 transition active:scale-95 ${
              activeFilter === "all"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            🌿 सभी ({crop.problems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("pest")}
            className={`shrink-0 rounded-xl px-3 py-1.5 transition active:scale-95 ${
              activeFilter === "pest"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            🐛 कीट व सुंडी
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("disease")}
            className={`shrink-0 rounded-xl px-3 py-1.5 transition active:scale-95 ${
              activeFilter === "disease"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            🍂 रोग व फफूंद
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("yellow")}
            className={`shrink-0 rounded-xl px-3 py-1.5 transition active:scale-95 ${
              activeFilter === "yellow"
                ? "bg-yellow-500 text-slate-950 shadow-xs"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            🟡 पीली पत्तियां
          </button>
        </div>
      </div>

      {/* Grid of visual cards */}
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 pb-6">
          {filteredProblems.map((p, idx) => (
            <AppLink
              key={p.id}
              href={`/crop-problems/${crop.slug}/${p.id}`}
              className="group relative overflow-hidden rounded-[22px] border border-emerald-900/10 bg-white shadow-[0_16px_40px_-28px_rgba(4,120,87,0.5)] active:scale-[0.98] transition"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-emerald-50">
                <Image
                  src={p.image}
                  alt={p.nameHi}
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
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-[10px] font-black text-white backdrop-blur-sm">
                  {idx + 1}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="text-[13px] font-extrabold leading-snug text-white drop-shadow">
                    {p.nameHi}
                  </p>
                  {p.nameEn ? (
                    <p className="mt-0.5 text-[10px] font-semibold text-white/80 line-clamp-1">
                      {p.nameEn}
                    </p>
                  ) : null}
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-1.5 py-0.5 text-[8.5px] font-bold text-white shadow-2xs">
                    सटीक दवा व डोज़ देखें →
                  </span>
                </div>
              </div>
            </AppLink>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-emerald-300 bg-white p-6 text-center shadow-xs">
          <p className="text-[13px] font-black text-slate-800">
            कोई समस्या नहीं मिली &ldquo;{search}&rdquo;
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            फसल का फोटो खींचकर AI डॉक्टर से सीधा निदान कराएं:
          </p>
          <AppLink
            href="/ai-doctor"
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white shadow-md active:scale-95"
          >
            <Camera className="h-4 w-4" />
            <span>📷 AI फोटो से जाँच करें</span>
          </AppLink>
        </div>
      )}

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
