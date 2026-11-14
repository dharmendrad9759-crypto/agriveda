"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronRight,
  Plus,
  Ruler,
  Search,
  X,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { sortCropsByCurrentSeason } from "@/lib/crops/seasonalCropEngine";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { softTap } from "@/lib/appEssentials";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export interface HomeAddCropHeroProps {
  isHi: boolean;
  onAddCrop: (cropSlug: string, cropName: string, sowingDateIso?: string) => void;
}

const POPULAR_CROPS = [
  { slug: "wheat", hi: "गेहूँ", en: "Wheat", emoji: "🌾" },
  { slug: "paddy", hi: "धान", en: "Paddy", emoji: "🌾" },
  { slug: "tomato", hi: "टमाटर", en: "Tomato", emoji: "🍅" },
  { slug: "potato", hi: "आलू", en: "Potato", emoji: "🥔" },
  { slug: "maize", hi: "मक्का", en: "Maize", emoji: "🌽" },
  { slug: "soybean", hi: "सोयाबीन", en: "Soybean", emoji: "🌱" },
  { slug: "chilli", hi: "मिर्च", en: "Chilli", emoji: "🌶️" },
  { slug: "onion", hi: "प्याज", en: "Onion", emoji: "🧅" },
  { slug: "cotton", hi: "कपास", en: "Cotton", emoji: "🌿" },
  { slug: "mustard", hi: "सरसों", en: "Mustard", emoji: "🌼" },
  { slug: "bajra", hi: "बाजरा", en: "Bajra", emoji: "🌾" },
  { slug: "garlic", hi: "लहसुन", en: "Garlic", emoji: "🧄" },
];

const CATEGORIES = [
  { id: "all", hi: "सभी", en: "All" },
  { id: "Cereals", hi: "अनाज", en: "Cereals" },
  { id: "Vegetables", hi: "सब्ज़ियां", en: "Vegetables" },
  { id: "Cash Crops", hi: "नकदी", en: "Cash Crops" },
  { id: "Pulses", hi: "दालें", en: "Pulses" },
  { id: "Oilseeds", hi: "तिलहन", en: "Oilseeds" },
];

export default function HomeAddCropHero({
 isHi, onAddCrop }: HomeAddCropHeroProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [modalOpen, setModalOpen] = useState(false);
  useBodyScrollLock(modalOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Sowing date presets helper
  const toLocalIso = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [sowingDate, setSowingDate] = useState("");

  const seasonalPopularCrops = useMemo(() => sortCropsByCurrentSeason(POPULAR_CROPS), []);

  const filteredCrops = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = cropCatalog.filter((c) => {
      if (selectedCategory !== "all" && c.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const hiName = getCropHindiName(c.slug) || c.nameHi || "";
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        hiName.includes(q)
      );
    });
    return q ? list : sortCropsByCurrentSeason(list);
  }, [searchQuery, selectedCategory]);

  const handleQuickAdd = (slug: string, name: string) => {
    softTap(18);
    track("crop_quick_add", { slug, name });
    setSelectedSlug(slug);
    setSowingDate("");
    setModalOpen(true);
  };

  const handleConfirmModalAdd = () => {
    if (!selectedSlug || !sowingDate) return;
    const cropItem = cropCatalog.find((c) => c.slug === selectedSlug);
    const cropName = cropItem ? getCropHindiName(selectedSlug) || cropItem.name : selectedSlug;
    softTap(22);
    track("crop_modal_add", { slug: selectedSlug, name: cropName });
    onAddCrop(selectedSlug, cropName, sowingDate);
    setModalOpen(false);
  };

  return (
    <>
      {/* ── CRED-GRADE HERO CARD ── */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-500/25 bg-gradient-to-br from-[#042416] via-[#02180e] to-[#011009] p-4 sm:p-5 text-white shadow-[0_18px_40px_-12px_rgba(2,24,14,0.65)]">
        {/* Ambient radial glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-teal-400/15 blur-3xl"
        />

        <div className="relative z-10">

          {/* Punchy Headline */}
          <div>
            <h2 className="font-display text-[1.15rem] font-bold leading-snug text-white">
              {isHi ? "अपनी मुख्य फसल जोड़ें" : "Add your crop"}
            </h2>
            <p className="mt-1 text-[13px] font-medium leading-snug text-emerald-100/85">
              {isHi ? "खाद, स्प्रे और मौसम इसी फसल पर चलेंगे।" : "Fertilizer, spray and weather follow this crop."}
            </p>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {seasonalPopularCrops.map((crop) => (
              <button
                key={crop.slug}
                type="button"
                onClick={() => handleQuickAdd(crop.slug, isHi ? crop.hi : crop.en)}
                className="group flex items-center gap-1.5 rounded-xl border border-emerald-400/25 bg-emerald-950/60 px-2.5 py-1.5 text-[12px] font-bold text-white shadow-xs backdrop-blur-md transition-all hover:border-emerald-300 hover:bg-emerald-900/90 active:scale-95"
              >
                <span className="text-sm">{crop.emoji}</span>
                <span>{isHi ? crop.hi : crop.en}</span>
                <Plus className="h-3 w-3 text-emerald-400 opacity-60 transition-transform group-hover:scale-125 group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {/* Add crop first; measure is optional after save */}
          <div className="mt-4 space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                softTap(16);
                setModalOpen(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 py-3.5 text-sm font-black text-emerald-950 shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>{isHi ? "फसल जोड़ें" : "Add crop"}</span>
              <ChevronRight className="h-4 w-4 stroke-[3]" />
            </button>
            <AppLink
              href="/my-farm/measure"
              onClick={() => {
                softTap(16);
                track("tool_open", { href: "/my-farm/measure", label: "home_add_crop_measure" });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-950/40 py-3 text-sm font-bold text-emerald-100 transition-all hover:bg-emerald-950/60 active:scale-[0.98]"
            >
              <Ruler className="h-4 w-4 stroke-[3]" />
              <span>{isHi ? "खेत नापें" : "Measure field"}</span>
            </AppLink>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE FULL CROP SELECTION MODAL ── */}
      {mounted && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {modalOpen && (
                <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setModalOpen(false)}
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                  />

                  {/* Modal Dialog */}
                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 32 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-[#cfe5d8] bg-[#f3faf6] text-[#143028] shadow-2xl sm:max-h-[85dvh] sm:rounded-[28px] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-[#b7d7c6] sm:hidden" />
                    <div className="border-b border-[#d7ebdf] px-4 pb-3 pt-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[18px] font-semibold leading-tight text-[#0f6b45]">
                          {isHi ? "फसल चुनें" : "Choose a crop"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#3d6b56] active:bg-[#e5f5ec]"
                          aria-label={isHi ? "बंद करें" : "Close"}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="relative mt-2">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f8f74]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={isHi ? "गेहूँ, धान, टमाटर…" : "Wheat, paddy, tomato…"}
                          className="w-full rounded-xl border border-[#cfe5d8] bg-white py-2.5 pl-10 pr-10 text-[16px] text-[#143028] outline-none placeholder:text-[#7aa38c]"
                        />
                        {searchQuery ? (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f8f74]"
                            aria-label={isHi ? "खोज मिटाएँ" : "Clear search"}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-2.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {CATEGORIES.map((cat) => {
                          const on = selectedCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedCategory(cat.id)}
                              className={cn(
                                "shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold",
                                on
                                  ? "bg-[#059669] text-white"
                                  : "bg-white text-[#3d6b56]"
                              )}
                            >
                              {isHi ? cat.hi : cat.en}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-3">
                      <div className="grid grid-cols-3 gap-2">
                        {filteredCrops.map((crop) => {
                          const isSelected = selectedSlug === crop.slug;
                          const hi = getCropHindiName(crop.slug) || crop.nameHi || crop.name;
                          const img = resolveCropImage({ slug: crop.slug, name: crop.name });
                          return (
                            <button
                              key={crop.slug}
                              type="button"
                              onClick={() => setSelectedSlug(crop.slug)}
                              className={cn(
                                "flex flex-col items-center rounded-2xl border bg-white px-1.5 py-2 text-center active:scale-[0.98]",
                                isSelected
                                  ? "border-[#059669] bg-[#f3faf6] shadow-[0_0_0_1px_#059669]"
                                  : "border-[#d7ebdf]"
                              )}
                            >
                              <span className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#e7f6ee]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.src = "/images/crops/_placeholder.svg";
                                  }}
                                />
                                {isSelected ? (
                                  <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-white">
                                    <Check className="h-2.5 w-2.5" />
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-tight text-[#143028]">
                                {isHi ? hi : crop.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {filteredCrops.length === 0 ? (
                        <p className="py-10 text-center text-[14px] font-semibold text-[#5f8f74]">
                          {isHi ? "कोई फसल नहीं मिली" : "No crop found"}
                        </p>
                      ) : null}
                    </div>

                    <div className="border-t border-[#d7ebdf] bg-[#f3faf6] px-4 py-3">
                      {selectedSlug ? (
                        <div className="mb-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3d6b56]">
                              <Calendar className="h-3.5 w-3.5" />
                              {isHi ? "कब बोया?" : "Sown on"}
                            </span>
                            <input
                              type="date"
                              value={sowingDate}
                              max={toLocalIso(0)}
                              onChange={(e) => setSowingDate(e.target.value)}
                              className="rounded-lg border border-[#cfe5d8] bg-white px-2 py-1 text-[16px] text-[#143028]"
                            />
                          </div>
                          <div className="mt-2 flex gap-1.5">
                            {[
                              { days: 0, hi: "आज", en: "Today" },
                              { days: 15, hi: "15 दिन पहले", en: "15 days ago" },
                              { days: 30, hi: "1 महीना पहले", en: "1 month ago" },
                            ].map((preset) => (
                              <button
                                key={preset.days}
                                type="button"
                                onClick={() => setSowingDate(toLocalIso(preset.days))}
                                className="rounded-full border border-[#d7ebdf] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#3d6b56]"
                              >
                                {isHi ? preset.hi : preset.en}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        disabled={!selectedSlug || !sowingDate}
                        onClick={handleConfirmModalAdd}
                        className="flex h-11 w-full items-center justify-center rounded-xl bg-[#059669] text-[15px] font-bold text-white active:scale-[0.99] disabled:opacity-40"
                      >
                        {selectedSlug
                          ? isHi
                            ? `${getCropHindiName(selectedSlug) || selectedSlug} जोड़ें`
                            : `Add ${selectedSlug}`
                          : isHi
                            ? "पहले फसल चुनें"
                            : "Choose a crop"}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
