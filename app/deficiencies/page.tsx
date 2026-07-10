"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { Card, Badge } from "@/components/design-system";
import { deficiencies } from "@/data/deficiencies";
import { toFarmerNutrientView } from "@/lib/nutrients/farmerNutrientView";
import { Search, ChevronRight, Sparkles } from "lucide-react";
import { AV } from "@/lib/design/tokens";

export default function DeficienciesPage() {
  const [query, setQuery] = useState("");

  const items = useMemo(
    () => deficiencies.map((d) => toFarmerNutrientView(d)),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.nameHi, item.nameEn, item.symbol].some((v) => v.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <AppShell
      className="!bg-transparent"
      title="पोषक तत्व की कमी"
      subtitle="टैप करें — सरल हिंदी में लक्षण और उपाय"
      breadcrumbs={[{ label: "होम", href: "/" }, { label: "पोषक कमी" }]}
    >
      <Card className="border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs font-bold">16 पोषक तत्व · crop-wise सलाह</p>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="नाम खोजें — जैसे जिंक, नाइट्रोजन…"
            className="av-input w-full py-2.5 pl-10"
          />
        </div>
      </Card>

      <ul className="mt-4 space-y-2">
        {filtered.map((nutrient, i) => (
          <li key={nutrient.slug}>
            <AppLink href={`/deficiencies/${nutrient.slug}`}>
              <Card hover delay={i % 4} className="flex items-center gap-3 p-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-xl">
                  {nutrient.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">{nutrient.nameHi}</p>
                    <Badge variant="success">{nutrient.symbol}</Badge>
                  </div>
                  <p className={`mt-0.5 line-clamp-2 ${AV.micro}`}>{nutrient.oneLiner}</p>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-accent)]" />
              </Card>
            </AppLink>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <Card className="mt-4 text-center">
          <p className="text-sm text-[var(--av-text-muted)]">कोई मिलान नहीं मिला।</p>
        </Card>
      )}
    </AppShell>
  );
}
