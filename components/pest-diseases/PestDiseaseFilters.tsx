"use client";

import { Search } from "lucide-react";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { CATEGORY_LABELS } from "@/types/pest-disease-ui";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";

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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search pest, disease, pathogen..."
          className="av-input w-full py-2.5 pl-10 pr-4 text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              category === cat ? "av-chip av-chip-active" : "av-chip"
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <p className={AV.micro}>{resultCount} threat{resultCount !== 1 ? "s" : ""} found</p>
    </div>
  );
}
