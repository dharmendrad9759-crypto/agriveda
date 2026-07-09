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
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--av-text-muted)]">{crops.length} crops available</p>
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-secondary)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crop — Paddy, Tomato, Wheat..."
            className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--av-text-primary)] placeholder:text-[var(--av-text-muted)] outline-none focus:border-[#10b981]"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  active
                    ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                    : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-[var(--av-accent)]/40 hover:text-[var(--av-text-primary)]"
                }`}
              >
                {CATEGORY_LABEL[cat]}
              </button>
            );
          })}
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
            <p className="text-sm font-medium text-[var(--av-text-primary)]">कोई फसल नहीं मिली</p>
            <p className="mt-1 text-xs text-[var(--av-text-secondary)]">खोज या फ़िल्टर बदलकर देखें</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
