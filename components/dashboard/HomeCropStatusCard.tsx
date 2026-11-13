"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import {
  getCropTimelineGuidance,
  getOptimalSowingWindow,
} from "@/lib/crops/cropTimelineEngine";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { sortCropsByCurrentSeason } from "@/lib/crops/seasonalCropEngine";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Ruler,
  X,
} from "lucide-react";
import { CropGrowthSparkleIcon } from "@/components/brand/icons";
import { measureFieldHref } from "@/components/farm/MeasureFieldButton";
import { track } from "@/lib/analytics";

const POPULAR_CROPS = [
  { slug: "wheat", nameHi: "गेहूं", emoji: "🌾", category: "अनाज" },
  { slug: "paddy", nameHi: "धान", emoji: "🌾", category: "अनाज" },
  { slug: "mustard", nameHi: "सरसों", emoji: "🌼", category: "तिलहन" },
  { slug: "tomato", nameHi: "टमाटर", emoji: "🍅", category: "सब्जी" },
  { slug: "potato", nameHi: "आलू", emoji: "🥔", category: "सब्जी" },
  { slug: "maize", nameHi: "मक्का", emoji: "🌽", category: "अनाज" },
  { slug: "soybean", nameHi: "सोयाबीन", emoji: "🫘", category: "दलहन" },
  { slug: "cotton", nameHi: "कपास", emoji: "🌱", category: "नकदी" },
  { slug: "chilli", nameHi: "मिर्च", emoji: "🌶️", category: "सब्जी" },
  { slug: "onion", nameHi: "प्याज", emoji: "🧅", category: "सब्जी" },
  { slug: "gram", nameHi: "चना", emoji: "🫘", category: "दलहन" },
  { slug: "sugarcane", nameHi: "गन्ना", emoji: "🎋", category: "नकदी" },
];

export interface HomeCropStatusCardProps {
  field: {
    id: string;
    crop: string;
    cropSlug?: string;
    stage?: string;
    name?: string;
    sowingDate?: string;
    sowingDateIso?: string;
    areaAcres?: number;
    area?: string;
    img: string;
  };
  isHi: boolean;
  adviceHref: string;
  onUpdateSowingDate: (fieldId: string, newDateIso: string) => void;
  onChangeCrop?: (cropSlug: string, cropName: string) => void;
  onSelectField?: (fieldId: string) => void;
  allFields?: Array<{
    id: string;
    crop: string;
    cropSlug?: string;
    name?: string;
    img?: string;
  }>;
}

export default function HomeCropStatusCard({
  field,
  isHi,
  adviceHref,
  onUpdateSowingDate,
  onChangeCrop,
  onSelectField,
  allFields,
}: HomeCropStatusCardProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCropSwitcher, setShowCropSwitcher] = useState(false);
  const [mounted, setMounted] = useState(false);
  const seasonalPopularCrops = useMemo(() => sortCropsByCurrentSeason(POPULAR_CROPS), []);
  useBodyScrollLock(showDatePicker || showCropSwitcher);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form state for date picker modal
  const toLocalIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayIso = toLocalIso(new Date());
  const initialDate = (() => {
    if (!field.sowingDate) return todayIso;
    if (/^\d{4}-\d{2}-\d{2}$/.test(field.sowingDate)) return field.sowingDate;
    const parsed = new Date(field.sowingDate);
    return Number.isNaN(parsed.getTime()) ? todayIso : toLocalIso(parsed);
  })();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const openDatePicker = () => {
    setSelectedDate(initialDate);
    setShowDatePicker(true);
  };

  const cropSlug = field.cropSlug || "";
  const cropHindi = getCropHindiName(cropSlug) || field.crop;
  const cropDisplayName = isHi ? cropHindi : field.crop;
  const fieldHomeHref = `/my-farm/${field.id}`;

  // Compute live timeline & agricultural guidance
  const timeline = getCropTimelineGuidance({
    cropSlug,
    cropName: field.crop,
    sowingDate: field.sowingDateIso || field.sowingDate,
    isHi,
  });
  const measureHref = measureFieldHref(field.id);

  const optimalWindow = getOptimalSowingWindow(cropSlug, isHi);

  // Quick preset helper
  const setDaysAgo = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setSelectedDate(toLocalIso(d));
  };

  const handleSaveDate = () => {
    if (!selectedDate || Number.isNaN(new Date(selectedDate).getTime())) return;
    onUpdateSowingDate(field.id, selectedDate);
    setShowDatePicker(false);
  };

  // Preview days in modal
  const modalDaysPreview = (() => {
    if (!selectedDate) return null;
    const sown = new Date(selectedDate);
    sown.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - sown.getTime()) / 86_400_000);
    return diff >= 0 ? diff : 0;
  })();

  return (
    <>
      <div className="flex min-h-[76px] overflow-hidden rounded-[1.35rem] border border-emerald-900/12 bg-[var(--av-surface)] shadow-[0_12px_28px_-18px_rgba(11,61,40,0.45)] dark:border-emerald-500/20">
        <AppLink
          href={fieldHomeHref}
          className="relative w-[76px] shrink-0 self-stretch"
          aria-label={isHi ? `${cropDisplayName} का खेत देखें` : `View ${cropDisplayName} field`}
        >
          <Image
            src={field.img}
            alt={cropDisplayName}
            fill
            sizes="76px"
            quality={80}
            priority
            className="object-cover"
          />
        </AppLink>

        <div className="relative flex min-w-0 flex-1 flex-col justify-between px-2.5 py-2">
          <AppLink
            href={fieldHomeHref}
            className="absolute inset-0 z-0 rounded-[1.1rem]"
            aria-label={isHi ? `${cropDisplayName} का खेत खोलें` : `Open ${cropDisplayName} field`}
          />
          <div className="pointer-events-none relative z-10 flex items-start gap-1.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="truncate text-[15px] font-bold leading-none text-[var(--av-text-primary)]">
                  {cropDisplayName}
                </span>
                {onChangeCrop ? (
                  <button
                    type="button"
                    onClick={() => setShowCropSwitcher(true)}
                    className="pointer-events-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                    title={isHi ? "फ़सल बदलें" : "Switch crop"}
                    aria-label={isHi ? "फ़सल बदलें" : "Switch crop"}
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                  </button>
                ) : null}
              </div>
              <p className="mt-1 truncate text-[10.5px] font-medium leading-none text-[var(--av-text-muted)]">
                {field.name || (isHi ? "खेत" : "Field")}
                {timeline.hasSowingDate ? ` · ${timeline.days} दिन` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={openDatePicker}
                className={`pointer-events-auto flex h-7 shrink-0 items-center gap-1 rounded-full px-2 text-[10px] font-bold active:scale-95 ${
                  timeline.hasSowingDate
                    ? "bg-emerald-800 text-white"
                    : "border border-amber-500/40 bg-amber-500/15 text-amber-900 dark:text-amber-200"
                }`}
                title={isHi ? "बुवाई की तारीख बदलें" : "Change sowing date"}
              >
                <Calendar className="h-3 w-3" />
                {timeline.hasSowingDate
                  ? isHi
                    ? `${timeline.days} दिन`
                    : `Day ${timeline.days}`
                  : isHi
                    ? "तारीख"
                    : "Date"}
              </button>
              <AppLink
                href={measureHref}
                className="pointer-events-auto inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-emerald-700/25 px-2 text-[10px] font-bold text-emerald-800 active:scale-95 dark:text-emerald-200"
                title={isHi ? "अपना खेत नापें" : "Measure your field"}
              >
                <Ruler className="h-3 w-3" />
                {isHi ? "नापें" : "Measure"}
              </AppLink>
            </div>
          </div>

          <div className="pointer-events-none relative z-10 mt-1.5 flex items-center gap-1.5">
            <span className="min-w-0 truncate rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200">
              {timeline.stageName}
            </span>
            <AppLink
              href={adviceHref}
              onClick={() => track("tool_open", { href: adviceHref, label: "home_field_advisor" })}
              className="pointer-events-auto ml-auto inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full bg-emerald-700 px-2.5 text-[11px] font-bold text-white active:scale-95"
            >
              {isHi ? "सलाह" : "Advice"}
              <ChevronRight className="h-3.5 w-3.5" />
            </AppLink>
          </div>
        </div>
      </div>

      {/* ── MODAL: IN-PLACE SOWING DATE PICKER (PORTALED TO BODY FOR TRUE CENTER VIEWPORT) ── */}
      {showDatePicker && mounted && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setShowDatePicker(false)}
            >
              {/* Backdrop blur */}
              <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
                onClick={() => setShowDatePicker(false)}
              />

              {/* Modal Container */}
              <div
                data-modal-content="true"
                className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[32px] sm:rounded-[1.75rem] border border-emerald-600/30 bg-white px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5 shadow-2xl dark:border-emerald-500/30 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile drag handle */}
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700 sm:hidden" />
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-emerald-600/20">
                      <Image src={field.img} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-black text-[var(--av-text-primary)]">
                        {cropDisplayName} — {isHi ? "बुवाई की तारीख" : "Sowing Date"}
                      </h3>
                      <p className="text-[11px] font-medium text-[var(--av-text-secondary)]">
                        {field.name || (isHi ? "मुख्य खेत" : "Main Field")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Optimum Sowing Window Banner */}
                <div className="mt-3.5 rounded-xl border border-emerald-500/25 bg-emerald-50/70 p-2.5 text-xs dark:bg-emerald-950/40">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                    <CropGrowthSparkleIcon className="h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <span className="font-black">
                        {isHi ? "उत्तम बुवाई समय:" : "Optimal Sowing Window:"}
                      </span>{" "}
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                        {optimalWindow}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-emerald-800/80 dark:text-emerald-300/80">
                    {isHi
                      ? "इस समय के अनुसार बुवाई डालने पर आज का सही काम व खाद की मात्रा दिखेगी।"
                      : "Accurate date ensures exact stage tasks and fertilizer timings."}
                  </p>
                </div>

                {/* Date Input */}
                <div className="mt-4">
                  <label
                    htmlFor="sowing-date-picker-input"
                    className="block text-[12px] font-extrabold text-[var(--av-text-primary)]"
                  >
                    {isHi ? "बुवाई की तारीख चुनें:" : "Select Sowing Date:"}
                  </label>
                  <input
                    id="sowing-date-picker-input"
                    type="date"
                    max={todayIso}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[14px] font-bold text-slate-800 shadow-xs focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Quick Presets for Quick 1-Tap Setting */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
                    {isHi ? "आसानी से चुनें (शॉर्टकट):" : "Quick Presets:"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {[
                      { labelHi: "आज", labelEn: "Today", days: 0 },
                      { labelHi: "10 दिन पहले", labelEn: "10d ago", days: 10 },
                      { labelHi: "24 दिन पहले", labelEn: "24d ago", days: 24 },
                      { labelHi: "35 दिन पहले", labelEn: "35d ago", days: 35 },
                      { labelHi: "50 दिन पहले", labelEn: "50d ago", days: 50 },
                    ].map((preset) => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => setDaysAgo(preset.days)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {isHi ? preset.labelHi : preset.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resulting Days Live Preview */}
                {modalDaysPreview !== null && (
                  <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    <span>{isHi ? "फसल की उम्र (बुवाई के बाद के दिन):" : "Crop Age (Days after sowing):"}</span>
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-white">
                      {isHi ? `${modalDaysPreview} दिन` : `Day ${modalDaysPreview}`}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  >
                    {isHi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDate}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-700/25 transition hover:bg-emerald-700 active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                    <span>{isHi ? "तारीख सुरक्षित करें" : "Save Sowing Date"}</span>
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* ── CROP SWITCHER MODAL ── */}
      {mounted && showCropSwitcher && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowCropSwitcher(false)}
            >
              <div
                className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl border border-emerald-500/20 bg-white px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5 shadow-2xl dark:border-white/10 dark:bg-[#111c15] max-h-[92dvh] sm:max-h-[86vh] flex flex-col text-left animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile drag handle */}
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-stone-300 dark:bg-stone-700 sm:hidden" />
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/5 shrink-0">
                  <div>
                    <h3 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                      <ArrowLeftRight className="h-4 w-4 text-emerald-600" />
                      <span>{isHi ? "फ़सल बदलें / दूसरी फ़सल चुनें" : "Change Active Crop"}</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {isHi
                        ? "होम स्क्रीन पर किस फ़सल की लाइव सलाह देखना चाहते हैं?"
                        : "Choose crop to show on home screen"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCropSwitcher(false)}
                    className="rounded-full p-1.5 text-stone-400 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body with Crop Grid */}
                <div className="overflow-y-auto py-3 space-y-3.5 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Existing Farm Fields (if any) */}
                  {allFields && allFields.length > 1 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        {isHi ? "आपके जुड़े हुए खेत:" : "Your Farm Fields:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {allFields.map((f) => {
                          const isCurrent = f.id === field.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                if (onSelectField) {
                                  onSelectField(f.id);
                                } else {
                                  onChangeCrop?.(f.cropSlug || f.crop.toLowerCase(), f.crop);
                                }
                                setShowCropSwitcher(false);
                              }}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition active:scale-95 ${
                                isCurrent
                                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400"
                                  : "bg-stone-100 text-stone-800 hover:bg-emerald-50 dark:bg-stone-800 dark:text-stone-200"
                              }`}
                            >
                              <span>🌾</span>
                              <span>
                                {f.name || f.crop}: {f.crop}
                              </span>
                              {isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Popular Crops Grid */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {isHi ? "लोकप्रिय भारतीय फसलें:" : "Popular Crops:"}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {seasonalPopularCrops.map((c) => {
                        const isCurrent =
                          cropSlug.toLowerCase() === c.slug.toLowerCase() ||
                          field.crop.toLowerCase().includes(c.nameHi);
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => {
                              onChangeCrop?.(c.slug, c.nameHi);
                              setShowCropSwitcher(false);
                            }}
                            className={`flex flex-col items-center justify-center gap-1 rounded-2xl p-2.5 text-center transition active:scale-95 border ${
                              isCurrent
                                ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-500"
                                : "border-stone-200 bg-stone-50/60 text-stone-800 hover:border-emerald-400 hover:bg-emerald-50/30 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-200"
                            }`}
                          >
                            <span className="text-2xl leading-none">{c.emoji}</span>
                            <span className="text-xs font-bold line-clamp-1">{c.nameHi}</span>
                            <span className="text-[9.5px] font-medium text-stone-500 dark:text-stone-400">
                              {c.category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer hint */}
                <div className="border-t border-black/5 pt-2.5 text-center text-[11px] text-stone-500 dark:text-stone-400 font-medium shrink-0">
                  {isHi
                    ? "💡 फसल बदलते ही होम स्क्रीन की सिंचाई, स्प्रे और मौसम सलाह बदल जाएगी।"
                    : "💡 Switching updates all home advisories and timelines."}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
