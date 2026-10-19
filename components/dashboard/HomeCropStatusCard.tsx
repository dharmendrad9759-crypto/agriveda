"use client";

import { useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { speakFarmer } from "@/components/ui/SpeakButton";
import {
  getCropTimelineGuidance,
  getOptimalSowingWindow,
} from "@/lib/crops/cropTimelineEngine";
import { getCropHindiName } from "@/lib/crops/crop-display";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Edit3,
  FlaskConical,
  Info,
  Sparkles,
  Sprout,
  Volume2,
  X,
} from "lucide-react";

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
}

export default function HomeCropStatusCard({
  field,
  isHi,
  onUpdateSowingDate,
}: HomeCropStatusCardProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Form state for date picker modal
  const todayIso = new Date().toISOString().split("T")[0];
  const initialDate =
    field.sowingDate && !Number.isNaN(new Date(field.sowingDate).getTime())
      ? new Date(field.sowingDate).toISOString().split("T")[0]
      : todayIso;
  const [selectedDate, setSelectedDate] = useState(initialDate);

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
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleSaveDate = () => {
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

        {/* ── CARD HEADER: Crop Identity & Sowing Pill ── */}
        <div className="relative z-10 p-3.5 pb-2.5 sm:p-4 sm:pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Left: Thumbnail + Crop Title + Field Name */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <AppLink
                href={cropSlug ? `/crops/${cropSlug}` : "/my-farm"}
                className="relative h-15 w-15 shrink-0 overflow-hidden rounded-2xl ring-2 ring-emerald-600/20 shadow-sm transition-transform active:scale-95"
                aria-label={isHi ? `${cropDisplayName} का विवरण देखें` : `View ${cropDisplayName}`}
              >
                <Image
                  src={field.img}
                  alt={cropDisplayName}
                  fill
                  sizes="64px"
                  quality={85}
                  priority
                  className="object-cover"
                />
              </AppLink>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <AppLink
                    href={cropSlug ? `/crops/${cropSlug}` : "/my-farm"}
                    className="truncate font-display text-[18px] sm:text-[19px] font-black leading-tight tracking-tight text-[var(--av-text-primary)] hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    {cropDisplayName}
                  </AppLink>
                  <AppLink
                    href={cropSlug ? `/crops/${cropSlug}` : "/my-farm"}
                    className="text-[var(--av-text-muted)] hover:text-emerald-600"
                    title={isHi ? "फसल विवरण खोलें" : "Open crop details"}
                  >
                    <ChevronRight className="h-4 w-4 shrink-0 stroke-[2.5]" />
                  </AppLink>
                </div>

                <p className="mt-0.5 truncate text-[12px] font-semibold text-[var(--av-text-secondary)]">
                  {field.name || (isHi ? "मुख्य खेत" : "Main Field")}
                </p>
              </div>
            </div>

            {/* Right: Interactive Sowing Date Pill + Speaker Button */}
            <div className="flex shrink-0 items-center gap-1.5">
              {/* SOWING DATE PILL - TAPPING OPENS MODAL DIRECTLY */}
              <button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className={`group/btn relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all active:scale-95 ${
                  timeline.hasSowingDate
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-700/25 hover:bg-emerald-700"
                    : "animate-pulse border border-amber-500/40 bg-amber-500/15 text-amber-900 hover:bg-amber-500/25 dark:text-amber-200"
                }`}
                title={isHi ? "बुवाई की तारीख बदलें" : "Change sowing date"}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {timeline.hasSowingDate
                    ? isHi
                      ? `${timeline.days} दिन`
                      : `Day ${timeline.days}`
                    : isHi
                      ? "तारीख डालें"
                      : "Set Date"}
                </span>
                <Edit3 className="h-3 w-3 opacity-75 group-hover/btn:opacity-100" />
              </button>

              {/* TTS Listen Button */}
              <button
                type="button"
                onClick={handleSpeak}
                disabled={isSpeaking}
                aria-label={isHi ? "फसल सलाह सुनें" : "Listen to advice"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 ${
                  isSpeaking
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                    : "bg-emerald-100/70 text-emerald-800 ring-1 ring-emerald-600/20 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-200"
                }`}
              >
                <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-pulse" : ""}`} />
              </button>
            </div>
          </div>

          {/* Sowing Date Subtitle with Direct "तारीख बदलें" trigger */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-900/8 pt-2 text-[11.5px] dark:border-emerald-500/10">
            <span className="flex items-center gap-1 text-[var(--av-text-secondary)]">
              <span className="font-bold text-[var(--av-text-muted)]">
                {isHi ? "बुवाई:" : "Sown:"}
              </span>{" "}
              {timeline.sowingDateFormatted}
            </span>
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="font-extrabold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {timeline.hasSowingDate
                ? isHi
                  ? "तारीख बदलें ✎"
                  : "Change Date ✎"
                : isHi
                  ? "यहाँ क्लिक कर तारीख डालें →"
                  : "Click to set date →"}
            </button>
          </div>
        </div>

        {/* ── STAGE MICRO-PROGRESS BAR ── */}
        <div className="relative z-10 px-3.5 sm:px-4">
          <div className="rounded-xl border border-emerald-600/15 bg-white/80 p-2.5 backdrop-blur-xs dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sprout className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span className="truncate text-[12px] font-black text-emerald-950 dark:text-emerald-200">
                  {timeline.stageName}
                </span>
              </div>
              <span className="shrink-0 text-[10.5px] font-extrabold text-[var(--av-text-muted)]">
                {timeline.stageSubtitle}
              </span>
            </div>

            {/* Lifecycle Progress line */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-900/10 dark:bg-emerald-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${Math.max(8, timeline.stageProgressPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── TODAY'S KEY AGRICULTURAL TASK ── */}
        <div className="relative z-10 mt-2.5 px-3.5 sm:px-4">
          <div
            className={`rounded-2xl border p-3 transition-all ${
              timeline.todayTask.priority === "high"
                ? "border-emerald-600/30 bg-emerald-500/10 dark:bg-emerald-950/30"
                : "border-[var(--av-border)] bg-[var(--av-surface-inset)]/70"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    {isHi ? "आज का मुख्य काम" : "Today's Key Task"}
                  </span>
                  {timeline.todayTask.priority === "high" && (
                    <span className="rounded-full bg-emerald-600 px-1.5 py-0.2 text-[9px] font-black text-white">
                      {isHi ? "ज़रूरी" : "Urgent"}
                    </span>
                  )}
                </div>
                <h4 className="mt-0.5 text-[13px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                  {timeline.todayTask.title}
                </h4>
                <p className="mt-1 text-[11.5px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                  {timeline.todayTask.details}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── DYNAMIC FERTILIZER GUIDANCE (USER'S KEY REQUEST) ── */}
        <div className="relative z-10 mt-2.5 px-3.5 pb-3 sm:px-4 sm:pb-3.5">
          <div
            className={`rounded-2xl border p-3 transition-all ${
              timeline.fertilizer.isDueNow
                ? "border-emerald-500/35 bg-gradient-to-br from-emerald-100/70 via-emerald-50/50 to-teal-50/70 shadow-xs dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-teal-950/30 dark:border-emerald-500/30"
                : "border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl ${
                  timeline.fertilizer.isDueNow
                    ? "bg-emerald-600 text-white shadow-xs shadow-emerald-700/30"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {timeline.fertilizer.isDueNow ? (
                  <Droplets className="h-3.5 w-3.5" />
                ) : (
                  <Info className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                      timeline.fertilizer.isDueNow
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {timeline.fertilizer.badge}
                  </span>

                  {timeline.fertilizer.nextDueNote && (
                    <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300">
                      ⏰ {timeline.fertilizer.nextDueNote}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[13px] font-black leading-tight text-[var(--av-text-primary)]">
                  {timeline.fertilizer.title}
                </p>

                <p className="mt-0.5 text-[12px] font-bold text-emerald-900 dark:text-emerald-200">
                  {timeline.fertilizer.dose}
                </p>

                <p className="mt-1 text-[11px] font-medium leading-normal text-[var(--av-text-secondary)]">
                  {timeline.fertilizer.tip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ACTIONS STRIP ── */}
        <div className="relative z-10 grid grid-cols-2 divide-x divide-emerald-900/10 border-t border-emerald-900/10 bg-emerald-50/70 text-center dark:divide-emerald-500/15 dark:border-emerald-500/15 dark:bg-emerald-950/30">
          <AppLink
            href={cropSlug ? `/crops/${cropSlug}/care/fertilizer` : "/services/fertilizer-calculator"}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12.5px] font-extrabold text-emerald-800 transition hover:bg-emerald-100/60 active:scale-[0.98] dark:text-emerald-200"
          >
            <Droplets className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{isHi ? "अभी कौन-सी खाद डालें →" : "Fertilizer for now →"}</span>
          </AppLink>

          <AppLink
            href={cropSlug ? `/crops/${cropSlug}/care/calendar` : "/crop-calendar"}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12.5px] font-extrabold text-emerald-800 transition hover:bg-emerald-100/60 active:scale-[0.98] dark:text-emerald-200"
          >
            <Calendar className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{isHi ? "इस हफ्ते का काम →" : "This week's tasks →"}</span>
          </AppLink>
        </div>
      </div>

      {/* ── MODAL: IN-PLACE SOWING DATE PICKER ── */}
      {showDatePicker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        >
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowDatePicker(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] border border-emerald-600/30 bg-white p-4 shadow-2xl dark:border-emerald-500/30 dark:bg-slate-900 sm:p-5">
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

            {/* Optimum Sowing Window Banner (From buwai-data as user highlighted) */}
            <div className="mt-3.5 rounded-xl border border-emerald-500/25 bg-emerald-50/70 p-2.5 text-xs dark:bg-emerald-950/40">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <span className="font-black">
                    {isHi ? "उत्तम बुवाई समय (अनुशंसित):" : "Optimal Sowing Window:"}
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
                <span>{isHi ? "गणना किए गए दिन:" : "Calculated Days:"}</span>
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
        </div>
      )}
    </>
  );
}
