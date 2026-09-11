"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import CropCard from "@/components/CropCard";
import { AddCustomCropCard } from "@/components/crops/AddCustomCropCard";
import {
  CROP_LISTING_CATEGORIES,
  matchesListingCategory,
  type CropListingCategory,
} from "@/lib/crops/crop-display";
import type { Crop } from "@/types/crop";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName } from "@/lib/crops/crop-display";

const CATEGORY_HI: Record<string, string> = {
  All: "सभी फसल",
  Cereals: "अनाज",
  Millets: "मिलेट",
  Pulses: "दलहन",
  Oilseeds: "तिलहन",
  Vegetables: "सब्ज़ी",
  Spices: "मसाला",
  Fruits: "फल",
  "Cash Crops": "नकदी फसल",
};

interface Props {
  crops: Crop[];
}

export default function CropsListingClient({ crops }: Props) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CropListingCategory>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops.filter((crop) => {
      if (!matchesListingCategory(crop, category)) return false;
      if (!q) return true;
      const hi = getCropHindiName(crop.slug)?.toLowerCase() ?? "";
      return (
        crop.name.toLowerCase().includes(q) ||
        hi.includes(q) ||
        crop.scientificName.toLowerCase().includes(q) ||
        crop.category.toLowerCase().includes(q) ||
        crop.suitableSeason.toLowerCase().includes(q)
      );
    });
  }, [crops, query, category]);

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-20 -mx-1 space-y-1.5 bg-[var(--background)]/92 px-1 py-1.5 backdrop-blur-xl">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isHi ? "धान, चना, अदरक खोजो…" : "Search paddy, chana, ginger…"}
            className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2 pl-11 pr-3 text-[13px] font-medium text-[var(--av-text-primary)] placeholder:text-[var(--av-text-muted)] outline-none focus:border-[var(--av-accent)]"
          />
        </label>

        <div className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CROP_LISTING_CATEGORIES.map((cat) => {
            const active = category === cat;
            const label = isHi ? CATEGORY_HI[cat] || cat : cat === "All" ? "All" : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold transition active:scale-95 ${
                  active
                    ? "bg-[var(--av-accent)] text-white"
                    : "text-[var(--av-text-muted)] ring-1 ring-[var(--av-border)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div id="crop-grid" className="flex items-center justify-between gap-3 scroll-mt-28">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
          {isHi ? `${filtered.length} फसल` : `${filtered.length} crops`}
        </p>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((crop, index) => (
            <CropCard key={crop.slug} crop={crop} index={index} variant="grid" />
          ))}
          <AddCustomCropCard
            crops={crops}
            index={filtered.length}
            onSelectName={(name) => setQuery(name)}
          />
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-14 text-center"
          >
            <p className="text-base font-bold text-[var(--av-text-primary)]">
              {isHi ? "कोई फसल नहीं मिली" : "No crops found"}
            </p>
            <p className="mt-1 text-sm text-[var(--av-text-muted)]">
              {isHi ? "दूसरा नाम या समूह आज़माओ" : "Try another name or group"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
