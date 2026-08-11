"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { AV } from "@/lib/design/tokens";
import { AI_DOCTOR_CROPS, OTHER_CROP } from "@/data/ai-doctor-crops";
import {
  getSymptomChipsForCrop,
  SYMPTOM_CHIPS as DEFAULT_SYMPTOM_CHIPS,
} from "@/data/ai-doctor-symptoms";
import { getCropImageUrl } from "@/lib/crops/crop-display";
import { crops } from "@/data/crops";
import {
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  Clock,
  History,
  ImagePlus,
  Leaf,
  Stethoscope,
} from "lucide-react";
import type { AIHistoryEntry } from "@/hooks/useAIHistory";

/** @deprecated Prefer getSymptomChipsForCrop — kept for older imports */
export const SYMPTOM_CHIPS = DEFAULT_SYMPTOM_CHIPS;

function SectionLabel({ title, step, hint }: { title: string; step?: number; hint?: string }) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-2">
        {step != null && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white">
            {step}
          </span>
        )}
        <h2 className="text-[15px] font-bold tracking-tight text-[var(--av-text-primary)]">{title}</h2>
      </div>
      {hint && <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">{hint}</p>}
    </div>
  );
}

/** AI Doctor hero — compact for phone */
export function AiDoctorHero({
  aiConfigured,
  onHistoryClick,
  historyCount,
}: {
  aiConfigured: boolean | null;
  onHistoryClick: () => void;
  historyCount: number;
}) {
  return (
    <section className="ai-doctor-hero relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 px-4 py-4 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.25)] dark:from-emerald-950/40 dark:via-[var(--av-surface)] dark:to-emerald-950/20 sm:p-5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/15 blur-2xl"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30">
              <Camera className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-[var(--av-text-primary)] sm:text-2xl">
                पत्ती की फोटो लो
              </h1>
              <p className="mt-0.5 text-xs leading-snug text-[var(--av-text-secondary)] sm:text-sm">
                फोटो दिखाओ — बीमारी और इलाज दिखेगा
              </p>
            </div>
          </div>
          {aiConfigured === false ? (
            <span className="mt-2 inline-flex rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200">
              Setup
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onHistoryClick}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-white/90 px-3 text-xs font-bold text-emerald-800 shadow-sm transition active:scale-[0.98] dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <History className="h-4 w-4" />
          {historyCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-black text-white">
              {historyCount > 9 ? "9+" : historyCount}
            </span>
          ) : (
            <span>पिछली जांचें</span>
          )}
        </button>
      </div>

      {aiConfigured === false && (
        <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {typeof window !== "undefined" &&
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "GEMINI_API_KEY .env.local में add karein."
            : "GEMINI_API_KEY enable karke Redeploy karein."}
        </p>
      )}
    </section>
  );
}

function CropPickerButton({
  active,
  onClick,
  labelHi,
  labelEn,
  children,
}: {
  active: boolean;
  onClick: () => void;
  labelHi: string;
  labelEn?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={labelEn ? `${labelHi} (${labelEn})` : labelHi}
      className={`flex w-[76px] shrink-0 flex-col items-center gap-1 rounded-2xl border-2 p-2 transition active:scale-[0.97] sm:w-[88px] sm:gap-1.5 sm:p-3 ${
        active
          ? "border-emerald-500 bg-emerald-50 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] dark:bg-emerald-950/40"
          : "border-[var(--av-border)] bg-[var(--av-surface)]"
      }`}
    >
      {children}
      <span
        className={`w-full truncate text-center text-[10px] font-bold leading-tight sm:text-[11px] ${
          active ? "text-emerald-800 dark:text-emerald-200" : "text-[var(--av-text-primary)]"
        }`}
      >
        {labelHi}
      </span>
      {labelEn ? (
        <span className="w-full truncate text-center text-[9px] font-medium leading-tight text-[var(--av-text-muted)]">
          {labelEn}
        </span>
      ) : null}
    </button>
  );
}

/** Crop selection — Other Crops first, then horizontal scroll */
export function AiDoctorCropSelect({
  selectedCrop,
  onSelectCrop,
}: {
  selectedCrop: string;
  onSelectCrop: (slug: string) => void;
}) {
  const quickCrops = AI_DOCTOR_CROPS.slice(0, 9);
  const otherActive = selectedCrop === OTHER_CROP.slug;

  return (
    <DarkCard className="!p-3.5 sm:!p-5">
      <SectionLabel title="फसल चुनें" step={2} hint="फोटो वाली फसल चुनें" />
      <div className="-mx-0.5 flex gap-2 overflow-x-auto px-0.5 pb-0.5 scrollbar-hide">
        <CropPickerButton
          active={otherActive}
          onClick={() => onSelectCrop(OTHER_CROP.slug)}
          labelHi={OTHER_CROP.nameHi}
          labelEn={OTHER_CROP.name}
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--av-surface-inset)] text-2xl sm:h-14 sm:w-14 sm:text-3xl ${
              otherActive ? "ring-2 ring-emerald-500/40" : ""
            }`}
          >
            {OTHER_CROP.emoji}
          </span>
        </CropPickerButton>

        {quickCrops.map((c) => {
          const full = crops.find((x) => x.slug === c.slug);
          const active = selectedCrop === c.slug;
          return (
            <CropPickerButton
              key={c.slug}
              active={active}
              onClick={() => onSelectCrop(c.slug)}
              labelHi={c.nameHi}
              labelEn={c.name}
            >
              <div
                className={`relative h-12 w-12 overflow-hidden rounded-xl sm:h-14 sm:w-14 ${
                  active ? "ring-2 ring-emerald-500/40" : ""
                }`}
              >
                {full ? (
                  <Image
                    src={getCropImageUrl(full)}
                    alt={`${c.nameHi} (${c.name})`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[var(--av-surface-inset)] text-2xl sm:text-3xl">
                    {c.emoji}
                  </span>
                )}
                {active && (
                  <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-emerald-600/80 to-transparent pb-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                  </span>
                )}
              </div>
            </CropPickerButton>
          );
        })}

      </div>
    </DarkCard>
  );
}

/** Symptoms — chips change with selected crop */
export function AiDoctorSymptoms({
  cropSlug,
  value,
  onChange,
  activeChips,
  onToggleChip,
  voiceSlot,
}: {
  cropSlug: string;
  value: string;
  onChange: (v: string) => void;
  activeChips: string[];
  onToggleChip: (id: string, label: string) => void;
  voiceSlot?: ReactNode;
}) {
  const chips = getSymptomChipsForCrop(cropSlug);

  return (
    <DarkCard className="!p-3.5 sm:!p-5">
      <SectionLabel
        title="लक्षण"
        step={3}
        hint="वैकल्पिक — chips चुनें या लिखें"
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 300))}
        placeholder="जैसे: पत्ती पर पीले धब्बे, किनारे सूख रहे हैं..."
        rows={3}
        className="av-input min-h-[96px] w-full resize-none text-[15px] leading-relaxed sm:min-h-[110px]"
      />
      <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
        {chips.map((chip) => {
          const active = activeChips.includes(chip.id);
          return (
            <button
              key={`${cropSlug}-${chip.id}`}
              type="button"
              onClick={() => onToggleChip(chip.id, chip.label)}
              className={`min-h-[36px] rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition active:scale-[0.97] sm:px-3 ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                  : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
              }`}
            >
              {chip.label}
              <span className={`ml-1 ${active ? "text-emerald-100" : "text-[var(--av-text-muted)]"}`}>
                · {chip.hi}
              </span>
            </button>
          );
        })}
      </div>
      {voiceSlot && <div className="mt-2.5 sm:mt-3">{voiceSlot}</div>}
      <p className="mt-1.5 text-right text-[10px] text-[var(--av-text-muted)]">{value.length}/300</p>
    </DarkCard>
  );
}

/** Photo upload */
export function AiDoctorPhotoUpload({
  previewUrl,
  previewUrl2,
  previewFailed,
  fileName,
  onCamera,
  onGallery,
  onClear,
  onAddSecond,
  onClearSecond,
  cameraInput,
  galleryInput,
  secondInput,
}: {
  previewUrl: string | null;
  previewUrl2?: string | null;
  previewFailed: boolean;
  fileName: string;
  onCamera: () => void;
  onGallery: () => void;
  onClear?: () => void;
  onAddSecond?: () => void;
  onClearSecond?: () => void;
  cameraInput: ReactNode;
  galleryInput: ReactNode;
  secondInput?: ReactNode;
}) {
  const hasPreview = Boolean(previewUrl);
  const hasSecond = Boolean(previewUrl2);

  return (
    <DarkCard className="!p-3.5 sm:!p-5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <SectionLabel
          title="फोटो लो"
          step={1}
          hint="साफ पत्ती की फोटो — टैप करके चुने"
        />
        {hasPreview && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-[11px] font-semibold text-[var(--av-text-muted)] active:text-red-600"
          >
            हटाएँ
          </button>
        )}
      </div>
      <p className="mb-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-semibold leading-snug text-emerald-800 dark:text-emerald-200">
        कैमरा खोलो — पत्ती करीब से दिखाओ।
      </p>
      {cameraInput}
      {galleryInput}
      {secondInput}

      <div className="overflow-hidden rounded-2xl border border-dashed border-emerald-500/40 bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-[var(--av-surface-inset)]">
        {previewUrl && !previewFailed ? (
          <div className={hasSecond ? "grid grid-cols-2 gap-px bg-emerald-500/15" : ""}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Photo 1"
              className={`mx-auto w-full object-cover ${hasSecond ? "max-h-44" : "max-h-52 sm:max-h-64"}`}
            />
            {hasSecond ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl2!}
                  alt="Photo 2"
                  className="mx-auto max-h-44 w-full object-cover"
                />
                {onClearSecond ? (
                  <button
                    type="button"
                    onClick={onClearSecond}
                    className="absolute right-1.5 top-1.5 rounded-lg bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white"
                  >
                    2 हटाएँ
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : previewUrl && previewFailed ? (
          <div className="px-4 py-8 text-center sm:py-10">
            <ImagePlus className="mx-auto h-10 w-10 text-emerald-600 sm:h-12 sm:w-12" />
            <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">फोटो चुनी गई</p>
            <p className="mt-1 break-all px-2 text-xs text-[var(--av-text-secondary)]">
              {fileName || "photo"}
            </p>
          </div>
        ) : (
          <div className="relative flex min-h-[160px] flex-col items-center justify-center overflow-hidden px-3 py-8 sm:min-h-[180px]">
            <Image
              src="/images/home/home-job-photo.jpg"
              alt=""
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover object-center"
              priority
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm">
              <Camera className="h-7 w-7" />
            </span>
            <p className="relative z-10 mt-3 text-sm font-bold text-white drop-shadow">
              पत्ती की फोटो लो
            </p>
            <p className="relative z-10 mt-1 max-w-[18ch] text-center text-[11px] font-medium text-white/90">
              कैमरा या गैलरी टैप करो
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-emerald-500/15 bg-emerald-50/80 p-2.5 dark:bg-black/25 sm:gap-2.5 sm:p-3">
          <button
            type="button"
            onClick={onCamera}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-[0.98]"
          >
            <Camera className="h-5 w-5" />
            {hasPreview ? "फोटो बदलो" : "कैमरा खोलो"}
          </button>
          <button
            type="button"
            onClick={onGallery}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/35 bg-white px-3 text-sm font-bold text-emerald-800 transition active:scale-[0.98] dark:bg-[var(--av-surface)] dark:text-emerald-200"
          >
            <ImagePlus className="h-5 w-5" />
            गैलरी
          </button>
        </div>

        {hasPreview && !hasSecond && onAddSecond ? (
          <div className="border-t border-emerald-500/15 p-2.5">
            <button
              type="button"
              onClick={onAddSecond}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-white/80 px-3 text-sm font-bold text-emerald-800 dark:bg-transparent dark:text-emerald-200"
            >
              <ImagePlus className="h-4 w-4" />
              वैकल्पिक: एक और फोटो जोड़ें
            </button>
          </div>
        ) : null}
      </div>
    </DarkCard>
  );
}

/** Run diagnosis */
export function AiDoctorActions({
  canScan,
  isScanning,
  hasInput,
  onScan,
  onReset,
}: {
  canScan: boolean;
  isScanning: boolean;
  hasInput: boolean;
  onScan: () => void;
  onReset: () => void;
}) {
  return (
    <section className="space-y-2.5">
      <button
        type="button"
        onClick={onScan}
        disabled={!canScan}
        className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 text-base font-bold text-white shadow-[0_10px_28px_-8px_rgba(5,150,105,0.55)] transition enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isScanning ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            जाँच हो रही है…
          </>
        ) : (
          <>
            <Bot className="h-5 w-5" />
            जांच शुरू करें
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={!hasInput && !isScanning}
        className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] text-sm font-semibold text-[var(--av-text-secondary)] transition enabled:active:scale-[0.99] disabled:opacity-40"
      >
        फिर से सेट करें
      </button>
    </section>
  );
}

/** Recent diagnoses */
export function AiDoctorRecentDiagnoses({
  history,
  onOpenEntry,
  expanded = false,
  onClear,
}: {
  history: AIHistoryEntry[];
  onOpenEntry: (entry: AIHistoryEntry) => void;
  expanded?: boolean;
  onClear?: () => void;
}) {
  const items = history.slice(0, expanded ? 12 : 5);

  return (
    <div id="ai-doctor-history" className="scroll-mt-24">
      <DarkCard className="!p-3.5 sm:!p-5">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <SectionLabel title="पिछली जांचें" />
          {onClear && history.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mt-0.5 shrink-0 text-[11px] font-semibold text-[var(--av-text-muted)] hover:text-red-600"
            >
              साफ़ करें
            </button>
          )}
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-7 text-center">
            <History className="mx-auto h-7 w-7 text-[var(--av-text-muted)]" />
            <p className="mt-2 text-sm font-semibold text-[var(--av-text-secondary)]">
              अभी कोई निदान नहीं हुआ है
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((h) => {
              const severity = h.result.severity?.toLowerCase().includes("high")
                ? "high"
                : h.result.severity?.toLowerCase().includes("low")
                  ? "low"
                  : "medium";
              const date = new Date(h.timestamp).toLocaleDateString("hi-IN", {
                day: "numeric",
                month: "short",
              });
              const thumb = h.thumbnailUrl?.startsWith("data:image/")
                ? h.thumbnailUrl
                : h.thumbnailUrl?.startsWith("http") || h.thumbnailUrl?.startsWith("/")
                  ? h.thumbnailUrl
                  : "";
              const hasThumb = Boolean(thumb);
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => onOpenEntry(h)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2.5 text-left transition active:scale-[0.99]"
                  >
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--av-surface-inset)] sm:h-14 sm:w-14">
                      {hasThumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <Leaf className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-bold text-[var(--av-text-primary)]">
                          {h.result.diseaseName}
                        </p>
                        <RiskBadge level={severity} />
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-[var(--av-text-secondary)]">
                        {h.result.cropContext || h.result.pathogen || "जांच"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[var(--av-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {date}
                        </span>
                        <span>·</span>
                        <span>{h.result.severity}</span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </DarkCard>
    </div>
  );
}

export function AiDoctorRiskForecast() {
  return null;
}

export function AiDoctorAskExpert() {
  return null;
}

export function AiDoctorTipsHelpline() {
  return null;
}

export function AiDoctorSidebarPanels() {
  return null;
}

export function AiDoctorDesktopSidebar() {
  return null;
}

export function AiDoctorDesktopHero({
  onUploadClick,
}: {
  onUploadClick?: () => void;
  onQuickTopic?: (topic: string) => void;
}) {
  return (
    <DarkCard className="overflow-hidden !p-0">
      <div className="bg-gradient-to-br from-emerald-50 to-white p-5 dark:from-emerald-950/30 dark:to-transparent">
        <span className="av-badge av-badge-low">AI Powered</span>
        <h2 className="mt-3 text-lg font-bold text-[var(--av-text-primary)]">
          How can I help your crop today?
        </h2>
        <button
          type="button"
          onClick={onUploadClick}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 sm:w-auto ${AV.btnPrimary}`}
        >
          <Camera className="h-4 w-4" />
          Upload Crop / Leaf Photo
        </button>
      </div>
    </DarkCard>
  );
}

export function AiDoctorQuickIdentify({
  selectedCrop,
  onSelectCrop,
}: {
  selectedCrop: string;
  onSelectCrop: (slug: string) => void;
}) {
  return <AiDoctorCropSelect selectedCrop={selectedCrop} onSelectCrop={onSelectCrop} />;
}
