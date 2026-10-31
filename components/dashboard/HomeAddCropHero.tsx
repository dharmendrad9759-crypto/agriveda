"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
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

export default function HomeAddCropHero({ isHi, onAddCrop }: HomeAddCropHeroProps) {
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

  const [sowingDate, setSowingDate] = useState(() => toLocalIso(15));

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
    onAddCrop(slug, name, toLocalIso(15));
  };

  const handleConfirmModalAdd = () => {
    if (!selectedSlug) return;
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
          {/* Header pill & badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-black tracking-wide text-emerald-200 shadow-sm backdrop-blur-md">
              <Sprout className="h-3.5 w-3.5 text-emerald-400 animate-bounce" />
              {isHi ? "फसल प्रबंधन" : "Crop Care"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200">
              <Sparkles className="h-3 w-3 text-amber-300" />
              {isHi ? "दैनिक खाद व स्प्रे सलाह" : "Daily Advisory"}
            </span>
          </div>

          {/* Punchy Headline */}
          <div className="mt-2.5">
            <h2 className="font-display text-[19px] sm:text-[21px] font-black leading-tight tracking-tight text-white drop-shadow-sm">
              {isHi ? "अपनी मुख्य फसल जोड़ें" : "Add Your Primary Crop"}
            </h2>
            <p className="mt-1 text-[12px] sm:text-[12.5px] font-medium leading-relaxed text-emerald-100/80">
              {isHi
                ? "दैनिक खाद-पानी कैलेंडर, बीमारी अलर्ट और सटीक मौसम सलाह पाने के लिए फसल चुनें।"
                : "Select your crop to get personalized fertilizer, spray timeline, and live mandi rates."}
            </p>
          </div>

          {/* Quick Popular Crop Chips Carousel */}
          <div className="mt-3.5">
            <p className="text-[10.5px] font-black uppercase tracking-wider text-emerald-300/90">
              {isHi ? "⚡ एक टैप में चुनें (लोकप्रिय फसलें):" : "⚡ Quick Select (Popular Crops):"}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
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
          </div>

          {/* Primary Action Button */}
          <div className="mt-4 pt-1">
            <button
              type="button"
              onClick={() => {
                softTap(16);
                setModalOpen(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 py-3.5 text-sm font-black text-emerald-950 shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition-all hover:brightness-105 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>{isHi ? "+ अन्य सभी 40+ फसलों में से चुनें" : "+ Explore All 40+ Crops"}</span>
              <ChevronRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE FULL CROP SELECTION MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 touch-none select-none overscroll-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm touch-none overscroll-none"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-emerald-500/30 bg-[var(--av-surface,#0c1a14)] text-white shadow-2xl touch-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative border-b border-emerald-500/20 bg-gradient-to-r from-[#042416] to-[#02180e] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-[17px] font-black leading-tight text-white">
                        {isHi ? "फसल चुनें व जोड़ें" : "Select & Add Crop"}
                      </h3>
                      <p className="text-[11px] text-emerald-100/70">
                        {isHi ? "अपनी ज़मीन पर उगाई गई फसल तय करें" : "Pick the crop currently in your field"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95"
                    aria-label={isHi ? "बंद करें" : "Close"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/70" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isHi
                        ? "फसल खोजें: गेहूँ, धान, टमाटर, मक्का, कपास..."
                        : "Search crop: wheat, paddy, tomato, cotton..."
                    }
                    className="w-full rounded-xl border border-emerald-500/30 bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs font-bold text-white placeholder-emerald-100/50 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all",
                        selectedCategory === cat.id
                          ? "bg-emerald-500 text-emerald-950 font-black shadow-xs"
                          : "border border-emerald-500/20 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/50"
                      )}
                    >
                      {isHi ? cat.hi : cat.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crops Grid Body */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                          "group relative flex flex-col items-center overflow-hidden rounded-2xl border p-2 text-center transition-all active:scale-95",
                          isSelected
                            ? "border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-400 shadow-lg"
                            : "border-white/10 bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-900/80"
                        )}
                      >
                        {/* Crop Photo */}
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-sm">
                          <Image
                            src={img}
                            alt={hi}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/60 backdrop-blur-xs">
                              <Check className="h-6 w-6 stroke-[3] text-white" />
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <p className="mt-1.5 font-bold text-[13px] leading-tight text-white">
                          {isHi ? hi : crop.name}
                        </p>
                        <p className="text-[10px] text-emerald-200/70">
                          {isHi ? crop.name : hi}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {filteredCrops.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm font-bold text-gray-400">
                      {isHi ? "कोई फसल नहीं मिली" : "No crop found"}
                    </p>
                  </div>
                )}
              </div>

              {/* Sowing Date & Confirm Footer */}
              <div className="border-t border-emerald-500/20 bg-slate-950/90 p-4">
                {selectedSlug && (
                  <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-200">
                        <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                        {isHi ? "बुवाई की तारीख:" : "Sowing Date:"}
                      </span>
                      <input
                        type="date"
                        value={sowingDate}
                        max={toLocalIso(0)}
                        onChange={(e) => setSowingDate(e.target.value)}
                        className="rounded-lg border border-emerald-500/40 bg-slate-900 px-2.5 py-1 text-xs font-bold text-white outline-none"
                      />
                    </div>
                    {/* Quick date presets */}
                    <div className="mt-2 flex items-center gap-1.5 text-[10.5px]">
                      <span className="text-gray-400">{isHi ? "त्वरित:" : "Quick:"}</span>
                      <button
                        type="button"
                        onClick={() => setSowingDate(toLocalIso(0))}
                        className="rounded-md bg-white/10 px-2 py-0.5 font-semibold text-emerald-200 hover:bg-white/20"
                      >
                        {isHi ? "आज" : "Today"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSowingDate(toLocalIso(15))}
                        className="rounded-md bg-white/10 px-2 py-0.5 font-semibold text-emerald-200 hover:bg-white/20"
                      >
                        {isHi ? "15 दिन पहले" : "15d ago"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSowingDate(toLocalIso(30))}
                        className="rounded-md bg-white/10 px-2 py-0.5 font-semibold text-emerald-200 hover:bg-white/20"
                      >
                        {isHi ? "1 महीना पहले" : "30d ago"}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!selectedSlug}
                  onClick={handleConfirmModalAdd}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 py-3.5 text-sm font-black text-emerald-950 shadow-lg transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>
                    {selectedSlug
                      ? isHi
                        ? `यह फसल जोड़ें (${getCropHindiName(selectedSlug) || selectedSlug})`
                        : `Add Crop (${selectedSlug})`
                      : isHi
                        ? "कृपया ऊपर से फसल चुनें"
                        : "Please select a crop above"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
