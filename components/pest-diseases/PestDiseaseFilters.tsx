"use client";

import { Search } from "lucide-react";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { CATEGORY_LABELS } from "@/types/pest-disease-ui";
import { cn } from "@/lib/cn";

const FILTER_CATEGORIES: (ThreatCategory | "all")[] = [
  "all",
  "fungal",
  "bacterial",
  "viral",
  "insect",
  "weed",
];

interface PestDiseaseFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: ThreatCategory | "all";
  onCategoryChange: (c: ThreatCategory | "all") => void;
  resultCount: number;
}

export default function PestDiseaseFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  resultCount,
}: PestDiseaseFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search pest, disease, pathogen..."
          className="theme-input w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition",
              category === cat
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-gray-200 bg-white theme-text-muted dark:border-white/10 dark:bg-black/20"
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <p className="text-[11px] font-semibold theme-text-muted">
        {resultCount} threat{resultCount !== 1 ? "s" : ""} found
      </p>
    </div>
  );
}
