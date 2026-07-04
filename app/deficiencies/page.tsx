"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { deficiencies } from "@/data/deficiencies";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";

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
    <main className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <div className="relative mx-auto max-w-lg px-4 py-5">
        <h1 className="text-xl font-extrabold theme-text-primary">Plant nutrients</h1>
        <p className="mt-1 text-xs theme-text-muted">Tap a name to open full details</p>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nutrient name..."
            className="w-full rounded-2xl border border-emerald-500/20 bg-[var(--panel-bg)] py-2.5 pl-10 pr-3 text-sm theme-text-primary outline-none focus:border-emerald-500"
          />
        </div>

        <ul className="mt-4 divide-y divide-emerald-500/10 overflow-hidden rounded-2xl border border-emerald-500/15 bg-[var(--panel-bg)]">
          {filtered.map((nutrient) => (
            <li key={nutrient.slug}>
              <Link
                href={`/deficiencies/${nutrient.slug}`}
                className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-emerald-500/10"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-lg">
                  {nutrient.icon}
                </span>
                <span className="flex-1 text-sm font-bold theme-text-primary">
                  {nutrient.name}
                  <span className="ml-2 text-xs font-semibold theme-text-muted">
                    {nutrient.symbol}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 theme-text-muted" />
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm theme-text-muted">No nutrient found.</p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
