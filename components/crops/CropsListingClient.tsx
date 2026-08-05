"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Grid3X3, LayoutList, Search } from "lucide-react";
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
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropHindiName } from "@/lib/crops/crop-display";

const SEASON_FILTERS = ["All Seasons", "Kharif", "Rabi", "Summer"] as const;

interface Props {
  crops: Crop[];
}

export default function CropsListingClient({ crops }: Props) {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CropListingCategory>("All");
  const [season, setSeason] = useState<(typeof SEASON_FILTERS)[number]>("All Seasons");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops.filter((crop) => {
      if (!matchesListingCategory(crop, category)) return false;
      if (!matchesSeasonFilter(crop, season as "All Seasons" | SeasonTag)) return false;
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
  }, [crops, query, category, season]);

  const seasonLabel = (s: (typeof SEASON_FILTERS)[number]) => {
    if (!isHi) return s;
    if (s === "All Seasons") return "सब मौसम";
    if (s === "Kharif") return "खरीफ";
    if (s === "Rabi") return "रबी";
    if (s === "Summer") return "गर्मी";
    return s;
  };

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isHi ? "धान, गेहूँ, टमाटर…" : "Paddy, wheat, tomato…"}
          className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--av-text-primary)] placeholder:text-[var(--av-text-muted)] outline-none focus:border-[var(--av-accent)]"
        />
      </div>

      <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
        {isHi ? "मौसम" : "Season"}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SEASON_FILTERS.map((s) => {
          const active = season === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSeason(s)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                active
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
              }`}
            >
              {seasonLabel(s)}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CROP_LISTING_CATEGORIES.map((cat) => {
          const active = category === cat;
          const label =
            cat === "All" ? (isHi ? "सभी फसल" : t("allCrops")) : cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                active
                  ? "bg-[var(--av-accent)] text-white shadow-sm"
                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[var(--av-text-muted)]">
          {isHi ? `${filtered.length} फसल` : `${filtered.length} crops`}
        </p>
        <div className="flex items-center gap-2">
          <AppLink
            href="/crop-calendar"
            className="hidden items-center gap-1.5 rounded-xl border border-[var(--av-accent)] px-3 py-2 text-xs font-bold text-[var(--av-accent)] sm:inline-flex"
          >
            <Calendar className="h-3.5 w-3.5" />
            {isHi ? "कैलेंडर" : "Calendar"}
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
            <p className="text-sm font-medium text-[var(--av-text-primary)]">
              {isHi ? "कोई फसल नहीं मिली" : "No crops found"}
            </p>
            <p className={`mt-1 ${AV.body}`}>
              {isHi ? "खोज या मौसम बदलकर देखें" : "Try another search or season"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
