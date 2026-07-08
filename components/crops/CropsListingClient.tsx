"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import CropCard from "@/components/CropCard";
import type { Crop } from "@/types/crop";

const CATEGORIES = ["All", "Cereals", "Vegetables", "Pulses", "Millets", "Cash-Crops"] as const;

const CATEGORY_LABEL: Record<string, string> = {
  All: "सभी",
  Cereals: "अनाज",
  Vegetables: "सब्जियाँ",
  Pulses: "दालें",
  Millets: "मिलेट",
  "Cash-Crops": "नकदी फसल",
};

interface Props {
  crops: Crop[];
}

export default function CropsListingClient({ crops }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops.filter((crop) => {
      if (category !== "All" && crop.category !== category) return false;
      if (!q) return true;
      return (
        crop.name.toLowerCase().includes(q) ||
        crop.scientificName.toLowerCase().includes(q) ||
        crop.category.toLowerCase().includes(q)
      );
    });
  }, [crops, query, category]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-4">
      <header className="flex max-h-20 flex-col gap-3 border-b border-[#1f2937] pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-[#f1f5f9] sm:text-xl">
            फसल लाइब्रेरी
          </h1>
          <p className="text-[11px] text-[#94a3b8]">{crops.length} crops</p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="फसल खोजें…"
            className="w-full rounded-lg border border-[#1f2937] bg-[#111827] py-2 pl-9 pr-3 text-sm text-[#f1f5f9] placeholder:text-[#64748b] outline-none transition-colors duration-150 focus:border-[#10b981]/50"
          />
        </div>
      </header>

      <div className="sticky top-0 z-20 -mx-4 mt-3 border-b border-[#1f2937] bg-[#0a0f1a]/95 px-4 py-2 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  active
                    ? "bg-[#10b981] text-[#0a0f1a]"
                    : "border border-[#1f2937] bg-[#111827] text-[#94a3b8] hover:border-[#10b981]/40 hover:text-[#f1f5f9]"
                }`}
              >
                {CATEGORY_LABEL[cat]}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        layout
        className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((crop, index) => (
            <CropCard key={crop.slug} crop={crop} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-16 text-center"
          >
            <p className="text-sm font-medium text-[#f1f5f9]">कोई फसल नहीं मिली</p>
            <p className="mt-1 text-xs text-[#94a3b8]">खोज या फ़िल्टर बदलकर देखें</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
