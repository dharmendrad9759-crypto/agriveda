"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { GaugeChart } from "@/components/shell/charts";
import { AV } from "@/lib/design/tokens";
import { AI_DOCTOR_CROPS, OTHER_CROP } from "@/data/ai-doctor-crops";
import {
  getSymptomChipsForCrop,
  SYMPTOM_CHIPS as DEFAULT_SYMPTOM_CHIPS,
} from "@/data/ai-doctor-symptoms";
import { getCropImageUrl } from "@/lib/crops/crop-display";
import { crops } from "@/data/crops";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  CircleDot,
  Clock,
  History,
  ImagePlus,
  Leaf,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import type { AIHistoryEntry } from "@/hooks/useAIHistory";

/** @deprecated Prefer getSymptomChipsForCrop — kept for older imports */
export const SYMPTOM_CHIPS = DEFAULT_SYMPTOM_CHIPS;

const RISK_WHY = [
  "High humidity + warm nights favour fungal spores",
  "Recent rain increases leaf wetness hours",
  "Dense canopy reduces air flow in the field",
];

const RISK_ADVICE = [
  "Scout lower leaves early morning for grey/olive spots",
  "Keep drainage clear — avoid standing water",
  "Prepare Tricyclazole spray if symptoms appear",
];

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="mb-2.5">
      <h2 className="text-[15px] font-bold tracking-tight text-[var(--av-text-primary)]">{title}</h2>
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
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" />
              AI
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                aiConfigured
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : aiConfigured === false
                    ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
                    : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
              }`}
            >
              <CircleDot className={`h-2.5 w-2.5 ${aiConfigured ? "text-emerald-500" : ""}`} />
              {aiConfigured === null ? "…" : aiConfigured ? "Active" : "Setup"}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-[var(--av-text-primary)] sm:text-2xl">
                AI Doctor
              </h1>
              <p className="mt-0.5 text-xs leading-snug text-[var(--av-text-secondary)] sm:text-sm">
                Symptoms ya photo se diagnosis
              </p>
            </div>
          </div>
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
            <span className="hidden xs:inline sm:inline">History</span>
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
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-[76px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border-2 p-2 transition active:scale-[0.97] sm:w-[88px] sm:gap-2 sm:p-3 ${
        active
          ? "border-emerald-500 bg-emerald-50 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] dark:bg-emerald-950/40"
          : "border-[var(--av-border)] bg-[var(--av-surface)]"
      }`}
    >
      {children}
      <span
        className={`truncate text-[10px] font-bold sm:text-[11px] ${
          active ? "text-emerald-800 dark:text-emerald-200" : "text-[var(--av-text-primary)]"
        }`}
      >
        {label}
      </span>
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
      <SectionLabel title="Crop" />
      <div className="-mx-0.5 flex gap-2 overflow-x-auto px-0.5 pb-0.5 scrollbar-hide">
        <CropPickerButton
          active={otherActive}
          onClick={() => onSelectCrop(OTHER_CROP.slug)}
          label={OTHER_CROP.name}
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
              label={c.name}
            >
              <div
                className={`relative h-12 w-12 overflow-hidden rounded-xl sm:h-14 sm:w-14 ${
                  active ? "ring-2 ring-emerald-500/40" : ""
                }`}
              >
                {full ? (
                  <Image src={getCropImageUrl(full)} alt={c.name} fill className="object-cover" sizes="56px" />
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

        <AppLink
          href="/crops"
          className="flex w-[76px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-emerald-400/40 p-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 sm:w-[88px] sm:gap-2 sm:p-3 sm:text-[11px]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 sm:h-14 sm:w-14">
            <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          More
        </AppLink>
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
      <SectionLabel title="Symptoms" />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 300))}
        placeholder="Jaise: patti pe peele dabbe, kinare sukh rahe hain..."
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
  previewFailed,
  fileName,
  onCamera,
  onGallery,
  onClear,
  cameraInput,
  galleryInput,
}: {
  previewUrl: string | null;
  previewFailed: boolean;
  fileName: string;
  onCamera: () => void;
  onGallery: () => void;
  onClear?: () => void;
  cameraInput: ReactNode;
  galleryInput: ReactNode;
}) {
  const hasPreview = Boolean(previewUrl);

  return (
    <DarkCard className="!p-3.5 sm:!p-5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold tracking-tight text-[var(--av-text-primary)]">Photo</h2>
        {hasPreview && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-semibold text-[var(--av-text-muted)] active:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      {cameraInput}
      {galleryInput}

      <div className="overflow-hidden rounded-2xl border border-dashed border-emerald-500/40 bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-[var(--av-surface-inset)]">
        {previewUrl && !previewFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Selected crop photo"
            className="mx-auto max-h-52 w-full object-cover sm:max-h-64"
          />
        ) : previewUrl && previewFailed ? (
          <div className="px-4 py-8 text-center sm:py-10">
            <ImagePlus className="mx-auto h-10 w-10 text-emerald-600 sm:h-12 sm:w-12" />
            <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">Photo selected</p>
            <p className="mt-1 break-all px-2 text-xs text-[var(--av-text-secondary)]">
              {fileName || "photo"}
            </p>
          </div>
        ) : (
          <div className="flex justify-center px-3 py-5 sm:py-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <Camera className="h-6 w-6" />
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-emerald-500/15 bg-emerald-50/50 p-2.5 dark:bg-black/20 sm:gap-2.5 sm:p-3">
          <button
            type="button"
            onClick={onCamera}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-[0.98]"
          >
            <Camera className="h-5 w-5" />
            {hasPreview ? "Nayi" : "Camera"}
          </button>
          <button
            type="button"
            onClick={onGallery}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/35 bg-white px-3 text-sm font-bold text-emerald-800 transition active:scale-[0.98] dark:bg-[var(--av-surface)] dark:text-emerald-200"
          >
            <ImagePlus className="h-5 w-5" />
            {hasPreview ? "Change" : "Gallery"}
          </button>
        </div>
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
            Analyzing…
          </>
        ) : (
          <>
            <Bot className="h-5 w-5" />
            Run diagnosis
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
        Reset
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
          <SectionLabel title="Recent diagnoses" />
          {onClear && history.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mt-0.5 shrink-0 text-[11px] font-semibold text-[var(--av-text-muted)] hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-7 text-center">
            <History className="mx-auto h-7 w-7 text-[var(--av-text-muted)]" />
            <p className="mt-2 text-sm font-semibold text-[var(--av-text-secondary)]">
              Abhi koi diagnosis nahi
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
              const date = new Date(h.timestamp).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              });
              const hasThumb = Boolean(h.thumbnailUrl);
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
                        <img src={h.thumbnailUrl} alt="" className="h-full w-full object-cover" />
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
                        {h.result.cropContext || h.result.pathogen || "Diagnosis"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[var(--av-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {date}
                        </span>
                        <span>·</span>
                        <span>{h.result.confidence}% conf.</span>
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
  return (
    <DarkCard className="!p-3.5 sm:!p-5">
      <SectionLabel title="Disease risk forecast" />
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="shrink-0">
          <GaugeChart value={78} label="High Risk" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-bold text-[var(--av-text-primary)]">Paddy — Leaf Blast</p>
            <p className={`mt-1 ${AV.body}`}>
              Agle 7 din humid conditions mein risk high hai.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              Why risk is high
            </p>
            <ul className="mt-2 space-y-1.5">
              {RISK_WHY.map((w) => (
                <li key={w} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Advice
            </p>
            <ul className="mt-2 space-y-1.5">
              {RISK_ADVICE.map((a) => (
                <li key={a} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600 to-teal-600 p-3 text-white shadow-md shadow-emerald-500/20">
            <Zap className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold leading-snug">
              Kal subah field scout karein — suspicious leaf AI Doctor se check karein.
            </p>
          </div>
        </div>
      </div>
    </DarkCard>
  );
}

export function AiDoctorAskExpert() {
  return null;
}

export function AiDoctorTipsHelpline() {
  return null;
}

export function AiDoctorSidebarPanels() {
  return (
    <div className="space-y-4">
      <AiDoctorRiskForecast />
    </div>
  );
}

export function AiDoctorDesktopSidebar() {
  return <AiDoctorSidebarPanels />;
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
