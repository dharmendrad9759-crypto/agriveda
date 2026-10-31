"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { speakFarmer } from "@/components/ui/SpeakButton";
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
  Droplets,
  Edit3,
  FlaskConical,
  Info,
  Sprout,
  Volume2,
  X,
} from "lucide-react";
import { CropGrowthSparkleIcon } from "@/components/brand/icons";

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
    img: string;
  };
  isHi: boolean;
  onUpdateSowingDate: (fieldId: string, newDateIso: string) => void;
  onChangeCrop?: (cropSlug: string, cropName: string) => void;
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
  onUpdateSowingDate,
  onChangeCrop,
  allFields,
}: HomeCropStatusCardProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCropSwitcher, setShowCropSwitcher] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const seasonalPopularCrops = useMemo(() => sortCropsByCurrentSeason(POPULAR_CROPS), []);
  useBodyScrollLock(showDatePicker || showCropSwitcher);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showDatePicker) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const preventTouch = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-modal-content="true"]')) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      window.removeEventListener("touchmove", preventTouch);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
      window.scrollTo(0, scrollY);
    };
  }, [showDatePicker]);

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

  // Compute live timeline & agricultural guidance
  const timeline = getCropTimelineGuidance({
    cropSlug,
    cropName: field.crop,
    sowingDate: field.sowingDate,
    isHi,
  });

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

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    speakFarmer(timeline.speechScript, isHi, () => setIsSpeaking(false));
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
      {/* ── MAIN REDESIGNED CROP CARD ── */}
      <div className="group relative overflow-hidden rounded-[1.6rem] border border-emerald-900/15 bg-gradient-to-b from-white via-white to-emerald-50/40 shadow-[0_12px_36px_-15px_rgba(11,61,40,0.22)] transition-all dark:border-emerald-500/20 dark:from-[var(--av-surface)] dark:via-[var(--av-surface)] dark:to-emerald-950/20">
        {/* Soft Agrarian Light Bloom in Background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/5"
        />

        {/* ── CARD HEADER: Crop Identity & Sowing Info (Categorized & Compact) ── */}
        <div className="relative z-10 p-2.5 pb-2 sm:p-3 sm:pb-2">
          <div className="flex items-center justify-between gap-2.5">
            {/* Left: Thumbnail + Crop Title + Inline Field & Sowing Date */}
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <AppLink
                href={cropSlug ? `/crops/${cropSlug}` : "/my-farm"}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-2 ring-emerald-600/20 shadow-sm transition-transform active:scale-95"
                aria-label={isHi ? `${cropDisplayName} का विवरण देखें` : `View ${cropDisplayName}`}
              >
                <Image
                  src={field.img}
                  alt={cropDisplayName}
                  fill
                  sizes="48px"
                  quality={85}
                  priority
                  className="object-cover"
                />
              </AppLink>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <AppLink
                    href={cropSlug ? `/crops/${cropSlug}` : "/my-farm"}
                    className="font-display text-[17px] sm:text-[18.5px] font-black leading-snug tracking-tight text-[var(--av-text-primary)] hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    {cropDisplayName}
                  </AppLink>
                  <AppLink
                    href={cropSlug ? `/crops/${cropSlug}` : "/my-farm"}
                    className="text-[var(--av-text-muted)] hover:text-emerald-600 p-0.5"
                    title={isHi ? "फसल विवरण खोलें" : "Open crop details"}
                  >
                    <ChevronRight className="h-4 w-4 shrink-0 stroke-[2.5]" />
                  </AppLink>

                  {onChangeCrop && (
                    <button
                      type="button"
                      onClick={() => setShowCropSwitcher(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-extrabold text-emerald-800 shadow-2xs hover:bg-emerald-100 active:scale-95 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300"
                      title={isHi ? "दूसरी फसल चुनें या बदलें" : "Switch crop"}
                    >
                      <ArrowLeftRight className="h-2.5 w-2.5" />
                      <span>{isHi ? "फ़सल बदलें" : "Change"}</span>
                    </button>
                  )}
                </div>

                {/* Subline: Field Name · Sowing Date (Clean, fully readable, no ellipsis truncation) */}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] sm:text-[12px] font-semibold text-[var(--av-text-secondary)]">
                  <span className="shrink-0 text-emerald-800 dark:text-emerald-300 font-bold">
                    {field.name || (isHi ? "खेत #1" : "Field #1")}
                  </span>
                  <span className="opacity-40">·</span>
                  <span className="text-[var(--av-text-muted)] font-medium">
                    {timeline.hasSowingDate
                      ? `${isHi ? "बुवाई:" : "Sown:"} ${timeline.sowingDateFormatted}`
                      : isHi
                        ? "तारीख जोड़ें"
                        : "No date set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Days Pill (Single Primary Edit Action) + Speaker Button */}
            <div className="flex shrink-0 items-center gap-1.5">
              {/* SOWING DATE PILL - SINGLE PRIMARY EDIT ACTION ("हरा वाला बेस्ट है") */}
              <button
                type="button"
                onClick={openDatePicker}
                className={`group/btn relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black transition-all active:scale-95 ${
                  timeline.hasSowingDate
                    ? "bg-emerald-600 text-white shadow-xs shadow-emerald-700/25 hover:bg-emerald-700"
                    : "animate-pulse border border-amber-500/40 bg-amber-500/15 text-amber-900 hover:bg-amber-500/25 dark:text-amber-200"
                }`}
                title={isHi ? "बुवाई की तारीख बदलें" : "Change sowing date"}
              >
                <Calendar className="h-3 w-3" />
                <span>
                  {timeline.hasSowingDate
                    ? isHi
                      ? `${timeline.days} दिन`
                      : `Day ${timeline.days}`
                    : isHi
                      ? "तारीख डालें"
                      : "Set Date"}
                </span>
                <Edit3 className="h-2.5 w-2.5 opacity-75 group-hover/btn:opacity-100" />
              </button>

              {/* TTS Listen Button */}
              <button
                type="button"
                onClick={handleSpeak}
                disabled={isSpeaking}
                aria-label={isHi ? "फसल सलाह सुनें" : "Listen to advice"}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 ${
                  isSpeaking
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                    : "bg-emerald-100/70 text-emerald-800 ring-1 ring-emerald-600/20 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-200"
                }`}
              >
                <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── STAGE MICRO-PROGRESS BAR (COMPACT) ── */}
        <div className="relative z-10 px-2.5 sm:px-3">
          <div className="rounded-xl border border-emerald-600/15 bg-white/80 px-2.5 py-1.5 backdrop-blur-xs dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sprout className="h-3 w-3 shrink-0 text-emerald-600" />
                <span className="truncate text-[11px] sm:text-[11.5px] font-black text-emerald-950 dark:text-emerald-200">
                  {timeline.stageName}
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-extrabold text-[var(--av-text-muted)]">
                {timeline.stageSubtitle}
              </span>
            </div>

            {/* Lifecycle Progress line */}
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-emerald-900/10 dark:bg-emerald-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${Math.max(8, timeline.stageProgressPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── BOTTOM ACTIONS STRIP (COMPACT TWO-BUTTON ROW WITH GATEKEEPER LOGIC) ── */}
        <div className="relative z-10 mt-1.5 grid grid-cols-2 divide-x divide-emerald-900/10 border-t border-emerald-900/10 bg-emerald-50/70 text-center dark:divide-emerald-500/15 dark:border-emerald-500/15 dark:bg-emerald-950/30">
          {timeline.hasSowingDate ? (
            <AppLink
              href={cropSlug ? `/crops/${cropSlug}/care/fertilizer?das=${timeline.days}` : "/services/fertilizer-calculator"}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11.5px] sm:text-[12px] font-extrabold text-emerald-800 transition hover:bg-emerald-100/60 active:scale-[0.98] dark:text-emerald-200"
            >
              <Droplets className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{isHi ? "अभी कौन-सी खाद डालें →" : "Fertilizer for now →"}</span>
            </AppLink>
          ) : (
            <button
              type="button"
              onClick={openDatePicker}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11.5px] sm:text-[12px] font-extrabold text-emerald-800 transition hover:bg-emerald-100/60 active:scale-[0.98] dark:text-emerald-200"
            >
              <Droplets className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{isHi ? "अभी कौन-सी खाद डालें →" : "Fertilizer for now →"}</span>
            </button>
          )}

          {timeline.hasSowingDate ? (
            <AppLink
              href={cropSlug ? `/crops/${cropSlug}/care/calendar?das=${timeline.days}` : "/crop-calendar"}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11.5px] sm:text-[12px] font-extrabold text-emerald-800 transition hover:bg-emerald-100/60 active:scale-[0.98] dark:text-emerald-200"
            >
              <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{isHi ? "इस हफ्ते का काम →" : "This week's tasks →"}</span>
            </AppLink>
          ) : (
            <button
              type="button"
              onClick={openDatePicker}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11.5px] sm:text-[12px] font-extrabold text-emerald-800 transition hover:bg-emerald-100/60 active:scale-[0.98] dark:text-emerald-200"
            >
              <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{isHi ? "इस हफ्ते का काम →" : "This week's tasks →"}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MODAL: IN-PLACE SOWING DATE PICKER (PORTALED TO BODY FOR TRUE CENTER VIEWPORT) ── */}
      {showDatePicker && mounted && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 touch-none select-none overscroll-none"
              onClick={() => setShowDatePicker(false)}
              onTouchMove={(e) => e.preventDefault()}
              onWheel={(e) => e.preventDefault()}
            >
              {/* Backdrop blur */}
              <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
                onClick={() => setShowDatePicker(false)}
              />

              {/* Modal Container */}
              <div
                data-modal-content="true"
                className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] border border-emerald-600/30 bg-white p-4 shadow-2xl dark:border-emerald-500/30 dark:bg-slate-900 sm:p-5 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
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
              className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 touch-none select-none overscroll-none bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowCropSwitcher(false)}
            >
              <div
                className="relative w-full max-w-lg rounded-3xl border border-emerald-500/20 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#111c15] max-h-[86vh] flex flex-col touch-auto text-left"
                onClick={(e) => e.stopPropagation()}
              >
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
                                onChangeCrop?.(f.cropSlug || f.crop.toLowerCase(), f.crop);
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
