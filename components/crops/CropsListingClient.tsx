"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Filter, Grid3X3, LayoutList, Search, X } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import CropCard from "@/components/CropCard";
import { AddCustomCropCard } from "@/components/crops/AddCustomCropCard";
import {
  CROP_LISTING_CATEGORIES,
  matchesListingCategory,
  matchesSeasonFilter,
  type CropListingCategory,
  type SeasonTag,
} from "@/lib/crops/crop-display";
import { AV } from "@/lib/design/tokens";
import type { Crop } from "@/types/crop";

const SEASON_FILTERS = ["All Seasons", "Kharif", "Rabi", "Summer"] as const;

interface Props {
  crops: Crop[];
}

export default function CropsListingClient({ crops }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CropListingCategory>("All");
  const [season, setSeason] = useState<(typeof SEASON_FILTERS)[number]>("All Seasons");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    (category !== "All" ? 1 : 0) + (season !== "All Seasons" ? 1 : 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops.filter((crop) => {
      if (!matchesListingCategory(crop, category)) return false;
      if (!matchesSeasonFilter(crop, season as "All Seasons" | SeasonTag)) return false;
      if (!q) return true;
      return (
        crop.name.toLowerCase().includes(q) ||
        crop.scientificName.toLowerCase().includes(q) ||
        crop.category.toLowerCase().includes(q) ||
        crop.suitableSeason.toLowerCase().includes(q)
      );
    });
  }, [crops, query, category, season]);

  const clearFilters = () => {
    setCategory("All");
    setSeason("All Seasons");
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crops..."
            className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--av-text-primary)] placeholder:text-[var(--av-text-muted)] outline-none focus:border-[var(--av-accent)]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as (typeof SEASON_FILTERS)[number])}
            className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-xs font-semibold text-[var(--av-text-primary)] outline-none focus:border-[var(--av-accent)]"
          >
            {SEASON_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            aria-expanded={filterOpen}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
              filterOpen || activeFilterCount > 0
                ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)] text-[var(--av-accent)]"
                : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--av-accent)] px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">Filter crops</p>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-[10px] font-bold text-[var(--av-accent)]"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="rounded-lg p-1 text-[var(--av-text-muted)] hover:bg-[var(--av-surface-muted)]"
                    aria-label="Close filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className={`mt-3 ${AV.label}`}>Season</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {SEASON_FILTERS.map((s) => {
                  const active = season === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeason(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? "bg-[var(--av-accent)] text-white"
                          : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <p className={`mt-4 ${AV.label}`}>Category</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {CROP_LISTING_CATEGORIES.map((cat) => {
                  const active = category === cat;
                  const label = cat === "All" ? "All Crops" : cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? "bg-[var(--av-accent)] text-white"
                          : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CROP_LISTING_CATEGORIES.map((cat) => {
          const active = category === cat;
          const label = cat === "All" ? "All Crops" : cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                active
                  ? "bg-[var(--av-accent)] text-white shadow-sm"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[var(--av-text-muted)]">
          {filtered.length} crops available
        </p>
        <div className="flex items-center gap-2">
          <AppLink
            href="/crop-calendar"
            className="hidden items-center gap-1.5 rounded-xl border border-[var(--av-accent)] px-3 py-2 text-xs font-bold text-[var(--av-accent)] sm:inline-flex"
          >
            <Calendar className="h-3.5 w-3.5" />
            View Crop Calendar
          </AppLink>
          <div className="flex rounded-lg border border-[var(--av-border)] p-0.5">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`rounded-md p-1.5 ${view === "grid" ? "bg-[var(--av-accent)] text-white" : "text-[var(--av-text-muted)]"}`}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`rounded-md p-1.5 ${view === "list" ? "bg-[var(--av-accent)] text-white" : "text-[var(--av-text-muted)]"}`}
              aria-label="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        layout
        className={
          view === "grid"
            ? "mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
            : "mt-4 flex flex-col gap-3"
        }
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((crop, index) => (
            <CropCard key={crop.slug} crop={crop} index={index} variant={view} />
          ))}
          {view === "grid" && (
            <AddCustomCropCard
              crops={crops}
              index={filtered.length}
              onSelectName={(name) => setQuery(name)}
            />
          )}
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
            <p className={`mt-1 ${AV.body}`}>खोज या फ़िल्टर बदलकर देखें</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
