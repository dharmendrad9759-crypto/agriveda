"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import ProblemFlowShell from "@/components/crop-problems/ProblemFlowShell";
import { CROP_PROBLEM_CROPS, type CropProblemCrop } from "@/data/crop-curative-problems";
import { Search, Camera, Sparkles } from "lucide-react";

const GROUPS: { id: string; title: string; match: (c: CropProblemCrop) => boolean }[] = [
  {
    id: "cereals",
    title: "अनाज (Cereals)",
    match: (c) => ["paddy", "wheat", "maize"].includes(c.slug),
  },
  {
    id: "veg",
    title: "सब्ज़ियाँ (Vegetables)",
    match: (c) =>
      ["tomato", "potato", "onion", "chilli", "brinjal", "cauliflower", "bhindi", "cucumber"].includes(
        c.slug
      ),
  },
  {
    id: "cash",
    title: "नकदी व तिलहन (Cash & Oilseeds)",
    match: (c) => ["cotton", "sugarcane", "mustard", "soybean"].includes(c.slug),
  },
  {
    id: "spice",
    title: "मसाला फसलें (Spices)",
    match: (c) => ["turmeric", "ginger", "garlic"].includes(c.slug),
  },
];

function CropTile({ crop }: { crop: CropProblemCrop }) {
  return (
    <AppLink
      href={`/crop-problems/${crop.slug}`}
      className="group relative overflow-hidden rounded-[22px] border border-emerald-900/10 bg-white p-2.5 shadow-[0_14px_36px_-26px_rgba(4,120,87,0.55)] transition active:scale-[0.97] hover:border-emerald-600/40"
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
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </span>
      <span className="relative mt-2 block text-center text-[12.5px] font-black tracking-tight text-[#052e1c]">
        {crop.nameHi}
      </span>
      <span className="relative mt-0.5 block text-center text-[9.5px] font-extrabold text-emerald-800/70">
        {crop.problems.length} समस्याएं
      </span>
    </AppLink>
  );
}

/** Step 1 — crop picker */
export default function CropProblemsClient() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const filteredCrops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CROP_PROBLEM_CROPS.filter((c) => {
      const matchSearch =
        !q ||
        c.nameHi.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (activeGroup === "all") return true;
      const grp = GROUPS.find((g) => g.id === activeGroup);
      return grp ? grp.match(c) : true;
    });
  }, [query, activeGroup]);

  const used = new Set<string>();
  const sections = GROUPS.map((g) => {
    const items = filteredCrops.filter((c) => g.match(c));
    items.forEach((c) => used.add(c.slug));
    return { ...g, items };
  }).filter((g) => g.items.length > 0);

  const leftover = filteredCrops.filter((c) => !used.has(c.slug));
  if (leftover.length) {
    sections.push({ id: "more", title: "अन्य फसलें", match: () => true, items: leftover });
  }

  return (
    <ProblemFlowShell
      title="फसल चुनें"
      step={1}
      backHref="/"
    >
      {/* Header Banner */}
      <div className="mb-4 overflow-hidden rounded-[24px] border border-emerald-900/10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-4 text-white shadow-[0_20px_50px_-30px_rgba(4,47,26,0.7)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              🌾 फसल डॉक्टर क्लिनिक
            </p>
            <h1 className="font-display text-[22px] font-bold leading-tight mt-0.5">
              खेत में क्या समस्या है?
            </h1>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-xl backdrop-blur-xs">
            🌿
          </span>
        </div>
        <p className="text-[11px] text-emerald-100/80 mt-1">
          अपनी फसल चुनकर कीट, रोग या पीली पत्ती का 15L टंकी डोज़ व इलाज देखें
        </p>
      </div>

      {/* Instant Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="फसल खोजें (गेहूं, धान, टमाटर, कपास...)..."
          className="w-full rounded-2xl border border-emerald-900/15 bg-white py-2.5 pl-10 pr-3 text-[12.5px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-xs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-[11px] font-black mb-4">
        <button
          type="button"
          onClick={() => setActiveGroup("all")}
          className={`shrink-0 rounded-xl px-3 py-1.5 transition active:scale-95 ${
            activeGroup === "all"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          सभी ({CROP_PROBLEM_CROPS.length})
        </button>
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActiveGroup(g.id)}
            className={`shrink-0 rounded-xl px-3 py-1.5 transition active:scale-95 ${
              activeGroup === g.id
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            {g.title.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Sections Grid */}
      <div className="space-y-6 pb-6">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.id}>
              <div className="mb-2.5 flex items-center gap-2">
                <h2 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-800/70">
                  {section.title}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-emerald-900/15 to-transparent" />
                <span className="text-[10px] font-black text-emerald-900/40">{section.items.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {section.items.map((crop) => (
                  <CropTile key={crop.slug} crop={crop} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-300 bg-white p-6 text-center shadow-xs">
            <p className="text-[13px] font-black text-slate-800">
              कोई फसल नहीं मिली &ldquo;{query}&rdquo;
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              सीधे कैमरे से फोटो खींचकर AI डॉक्टर से जाँच कराएं:
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
      </div>

      {/* AI Doctor Camera Banner */}
      <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-900 to-teal-950 p-3.5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black">फसल नहीं पहचान पा रहे?</p>
              <p className="text-[10px] text-emerald-200">कैमरे से फोटो लें — AI डॉक्टर तुरंत रोग और दवा बताएगा</p>
            </div>
          </div>
          <AppLink
            href="/ai-doctor"
            className="shrink-0 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-emerald-950 active:scale-95 shadow-xs"
          >
            कैमरा खोलें 📸
          </AppLink>
        </div>
      </div>
    </ProblemFlowShell>
  );
}
