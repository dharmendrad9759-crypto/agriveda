"use client";

import { Search } from "lucide-react";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { AV } from "@/lib/design/tokens";

interface PestDiseaseFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: ThreatCategory | "all";
  onCategoryChange: (c: ThreatCategory | "all") => void;
  resultCount: number;
  placeholder?: string;
}

export default function PestDiseaseFilters({
  search,
  onSearchChange,
  resultCount,
  placeholder = "नाम से खोजें — कीट, रोग या खरपतवार…",
}: PestDiseaseFiltersProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-accent)]" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="av-input w-full rounded-2xl border-[var(--av-border)] bg-[var(--av-surface)] py-3 pl-11 pr-4 text-sm shadow-sm outline-none ring-[var(--av-accent-ring)] transition focus:border-[var(--av-accent)] focus:ring-2"
        />
      </div>
      <p className={AV.micro}>
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </p>
    </div>
  );
}
