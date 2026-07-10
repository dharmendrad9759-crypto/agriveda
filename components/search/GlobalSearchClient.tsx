"use client";

import { useMemo, useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { Card } from "@/components/design-system";
import { Badge } from "@/components/design-system";
import { globalSearch, searchTypeLabel } from "@/lib/search/globalSearch";
import { AV } from "@/lib/design/tokens";

const TYPE_BADGE: Record<string, "success" | "info" | "warning" | "neutral"> = {
  crop: "success",
  nutrient: "info",
  pest: "warning",
  disease: "warning",
  weed: "neutral",
  tool: "info",
  page: "neutral",
};

export default function GlobalSearchClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const results = useMemo(() => globalSearch(searchQuery), [searchQuery]);

  return (
    <AppShell
      className="!bg-transparent"
      title="खोजें"
      subtitle="फसल, कीट, रोग, पोषक तत्व, टूल — सब कुछ एक जगह"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
    >
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            type="search"
            placeholder="खोजें — Paddy, Zinc, Stem Borer, AI Doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="av-input w-full py-2.5 pl-10 pr-10 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--av-text-muted)]"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>

      <p className={`mt-4 ${AV.label}`}>
        {searchQuery ? `${results.length} परिणाम` : "लोकप्रिय खोज"}
      </p>

      <div className="mt-3 space-y-2">
        {results.length === 0 ? (
          <Card className="py-12 text-center">
            <p className={AV.body}>कोई परिणाम नहीं मिला। दूसरा शब्द आज़माएँ।</p>
          </Card>
        ) : (
          results.map((item, i) => (
            <AppLink key={item.id} href={item.href}>
              <Card hover delay={i % 4} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--av-text-primary)]">{item.title}</h4>
                    <Badge variant={TYPE_BADGE[item.type] ?? "neutral"}>
                      {item.badge ?? searchTypeLabel(item.type)}
                    </Badge>
                  </div>
                  <p className={`mt-0.5 line-clamp-1 ${AV.micro}`}>{item.subtitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-accent)]" />
              </Card>
            </AppLink>
          ))
        )}
      </div>
    </AppShell>
  );
}
