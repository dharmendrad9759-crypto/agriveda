"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { cropsData, type Crop as CropData } from "@/data/crops";
import { AV } from "@/lib/design/tokens";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = cropsData.filter((crop: CropData) => {
    const query = searchQuery.toLowerCase();
    return (
      crop.name.toLowerCase().includes(query) ||
      crop.scientificName.toLowerCase().includes(query) ||
      crop.overview.toLowerCase().includes(query) ||
      crop.category.toLowerCase().includes(query)
    );
  });

  return (
    <AppShell
      title="फसल खोजें"
      subtitle="फसल, बीमारी, कीट या खाद — नाम लिखकर तुरंत खोजें।"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          type="text"
          placeholder="फसल का नाम टाइप करें... (जैसे: टमाटर, Paddy)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="av-input w-full py-2.5 pl-10 pr-10 text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className={`mt-4 ${AV.label}`}>
        खोज परिणाम ({searchQuery ? filteredResults.length : cropsData.length})
      </p>

      <div className="mt-3 space-y-2">
        {filteredResults.length === 0 ? (
          <DarkCard className="py-12 text-center">
            <p className={`text-sm ${AV.body}`}>
              आपकी खोज के अनुसार कोई डेटा नहीं मिला। कृपया सही स्पेलिंग जांचें।
            </p>
          </DarkCard>
        ) : (
          filteredResults.map((crop) => (
            <AppLink key={crop.slug} href={`/crops/${crop.slug}`}>
              <DarkCard hover className="flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--av-text-primary)]">{crop.name}</h4>
                    <span className="av-chip text-[9px]">{crop.category}</span>
                  </div>
                  <p className={`font-mono italic ${AV.micro}`}>{crop.scientificName}</p>
                  <p className={`line-clamp-1 ${AV.body}`}>{crop.overview}</p>
                </div>
                <span className="shrink-0 text-lg text-[var(--av-accent)]">→</span>
              </DarkCard>
            </AppLink>
          ))
        )}
      </div>
    </AppShell>
  );
}
