"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { deficiencies } from "@/data/deficiencies";
import { Search, ChevronRight } from "lucide-react";
import { AV } from "@/lib/design/tokens";

export default function DeficienciesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return deficiencies;
    return deficiencies.filter((item) =>
      [item.name, item.symbol].some((value) => value.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <AppShell
      title="Plant Nutrients"
      subtitle="Tap a nutrient for symptoms, correction & crop-specific guidance"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Deficiencies" }]}
    >
      <DarkCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nutrient name..."
            className="av-input w-full py-2.5 pl-10"
          />
        </div>
      </DarkCard>

      <ul className="mt-4 space-y-2">
        {filtered.map((nutrient, i) => (
          <li key={nutrient.slug}>
            <AppLink href={`/deficiencies/${nutrient.slug}`}>
              <DarkCard hover delay={i % 4} className="flex items-center gap-3 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--av-accent)]/15 text-lg">
                  {nutrient.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--av-text-primary)]">
                    {nutrient.name}
                    <span className="ml-2 text-xs font-semibold text-[var(--av-text-muted)]">
                      {nutrient.symbol}
                    </span>
                  </p>
                  <p className={`truncate ${AV.micro}`}>{nutrient.role}</p>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
              </DarkCard>
            </AppLink>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <DarkCard className="mt-4 text-center">
          <p className="text-sm text-[var(--av-text-muted)]">No nutrients match your search.</p>
        </DarkCard>
      )}
    </AppShell>
  );
}
