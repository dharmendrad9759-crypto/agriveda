"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { GaugeChart } from "@/components/shell/charts";
import { AV } from "@/lib/design/tokens";
import { AI_DOCTOR_CROPS, OTHER_CROP } from "@/data/ai-doctor-crops";
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
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import type { AIHistoryEntry } from "@/hooks/useAIHistory";

export const SYMPTOM_CHIPS = [
  { id: "yellowing", label: "Yellowing", hi: "पीलापन" },
  { id: "spots", label: "Spots", hi: "धब्बे" },
  { id: "curling", label: "Curling", hi: "मुड़ना" },
  { id: "holes", label: "Holes", hi: "छेद" },
  { id: "wilting", label: "Wilting", hi: "मुरझाना" },
  { id: "stunted", label: "Stunted growth", hi: "कम वृद्धि" },
  { id: "leaf-burn", label: "Leaf burn", hi: "पत्ती जलना" },
] as const;

const EXPERTS = [
  {
    name: "Dr. Rakesh Sharma",
    title: "Agronomist (PhD)",
    exp: "15 years",
    status: "Online",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop",
  },
  {
    name: "Dr. Priya Verma",
    title: "Plant Pathologist",
    exp: "12 years",
    status: "Online",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop",
  },
  {
    name: "Dr. Amit Singh",
    title: "Entomologist",
    exp: "10 years",
    status: "Busy",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&h=80&fit=crop",
  },
];

const PROTECTION_TIPS = [
  "Monitor your field regularly for early symptoms",
  "Use yellow sticky traps for flying pests",
  "Rotate crops to break pest cycles",
  "Follow PHI before harvest spray",
];

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

function SectionLabel({
  step,
  title,
  subtitle,
}: {
  step?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        {step && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-[10px] font-black text-white">
            {step}
          </span>
        )}
        <h2 className="text-[15px] font-bold tracking-tight text-[var(--av-text-primary)]">{title}</h2>
      </div>
      {subtitle && <p className={`mt-1 ${step ? "pl-8" : ""} ${AV.sectionSubtitle}`}>{subtitle}</p>}
    </div>
  );
}

/** 1 — AI Doctor hero */
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
    <section className="ai-doctor-hero relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-5 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.25)] dark:from-emerald-950/40 dark:via-[var(--av-surface)] dark:to-emerald-950/20">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-teal-300/10 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur dark:bg-emerald-950/50 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                aiConfigured
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : aiConfigured === false
                    ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
                    : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
              }`}
            >
              <CircleDot className={`h-2.5 w-2.5 ${aiConfigured ? "text-emerald-500" : ""}`} />
              {aiConfigured === null ? "Checking…" : aiConfigured ? "24×7 Active" : "Setup needed"}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--av-text-primary)] sm:text-[1.75rem]">
                AI Doctor
              </h1>
              <p className="mt-0.5 text-sm text-[var(--av-text-secondary)]">
                Crop photo se disease pehchaanein — upchaar turant paayein
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onHistoryClick}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/25 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition active:scale-[0.98] dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <History className="h-4 w-4" />
          History
          {historyCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-black text-white">
              {historyCount > 9 ? "9+" : historyCount}
            </span>
          )}
        </button>
      </div>

      <ol className="relative mt-5 flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
        {["Crop चुनें", "Symptoms", "Photo", "Diagnosis"].map((label, i) => (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl bg-white/70 px-1.5 py-2 dark:bg-black/20">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
                {i + 1}
              </span>
              <span className="truncate text-center text-[9px] font-semibold text-[var(--av-text-secondary)]">
                {label}
              </span>
            </div>
            {i < 3 && <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-emerald-400 sm:block" />}
          </li>
        ))}
      </ol>

      {aiConfigured === false && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {typeof window !== "undefined" &&
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "GEMINI_API_KEY .env.local में add karein — Google AI Studio se key lein."
            : "Vercel → Environment Variables → GEMINI_API_KEY enable karke Redeploy karein."}
        </p>
      )}
    </section>
  );
}

/** 2 — Crop selection */
export function AiDoctorCropSelect({
  selectedCrop,
  onSelectCrop,
}: {
  selectedCrop: string;
  onSelectCrop: (slug: string) => void;
}) {
  const quickCrops = AI_DOCTOR_CROPS.slice(0, 9);

  return (
    <DarkCard className="!p-4 sm:!p-5">
      <SectionLabel
        step="1"
        title="Select crop"
        subtitle="Apni fasal choose karein — diagnosis uske hisaab se milega"
      />
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {quickCrops.map((c) => {
          const full = crops.find((x) => x.slug === c.slug);
          const active = selectedCrop === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onSelectCrop(c.slug)}
              aria-pressed={active}
              className={`flex min-w-[88px] shrink-0 flex-col items-center gap-2 rounded-2xl border-2 p-3 transition active:scale-[0.97] ${
                active
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] dark:bg-emerald-950/40"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-emerald-400/50"
              }`}
            >
              <div
                className={`relative h-14 w-14 overflow-hidden rounded-xl ${
                  active ? "ring-2 ring-emerald-500/40" : ""
                }`}
              >
                {full ? (
                  <Image src={getCropImageUrl(full)} alt={c.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[var(--av-surface-inset)] text-3xl">
                    {c.emoji}
                  </span>
                )}
                {active && (
                  <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-emerald-600/80 to-transparent pb-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-bold ${
                  active ? "text-emerald-800 dark:text-emerald-200" : "text-[var(--av-text-primary)]"
                }`}
              >
                {c.name}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onSelectCrop(OTHER_CROP.slug)}
          aria-pressed={selectedCrop === OTHER_CROP.slug}
          className={`flex min-w-[88px] shrink-0 flex-col items-center gap-2 rounded-2xl border-2 p-3 transition active:scale-[0.97] ${
            selectedCrop === OTHER_CROP.slug
              ? "border-emerald-500 bg-emerald-50 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] dark:bg-emerald-950/40"
              : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-emerald-400/50"
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--av-surface-inset)] text-3xl">
            {OTHER_CROP.emoji}
          </span>
          <span className="text-[11px] font-bold text-[var(--av-text-primary)]">{OTHER_CROP.name}</span>
        </button>
        <AppLink
          href="/crops"
          className="flex min-w-[88px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-400/40 p-3 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
            <Leaf className="h-6 w-6" />
          </span>
          More crops
        </AppLink>
      </div>
    </DarkCard>
  );
}

/** 3 — Symptoms / notes */
export function AiDoctorSymptoms({
  value,
  onChange,
  activeChips,
  onToggleChip,
  voiceSlot,
}: {
  value: string;
  onChange: (v: string) => void;
  activeChips: string[];
  onToggleChip: (id: string, label: string) => void;
  voiceSlot?: ReactNode;
}) {
  return (
    <DarkCard className="!p-4 sm:!p-5">
      <SectionLabel
        step="2"
        title="Symptoms / notes"
        subtitle="Optional — photo ke saath likhein ya chip select karein"
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 300))}
        placeholder="Jaise: patti pe peele dabbe, kinare sukh rahe hain, neeche se peelaapan..."
        rows={4}
        className="av-input min-h-[110px] w-full resize-none text-[15px] leading-relaxed"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {SYMPTOM_CHIPS.map((chip) => {
          const active = activeChips.includes(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onToggleChip(chip.id, chip.label)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition active:scale-[0.97] ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                  : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] hover:border-emerald-400/50"
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
      {voiceSlot && <div className="mt-3">{voiceSlot}</div>}
      <p className="mt-2 text-right text-[10px] text-[var(--av-text-muted)]">{value.length}/300</p>
    </DarkCard>
  );
}

/** 4 — Photo upload (main action) */
export function AiDoctorPhotoUpload({
  previewUrl,
  previewFailed,
  fileName,
  onCamera,
  onGallery,
  cameraInput,
  galleryInput,
}: {
  previewUrl: string | null;
  previewFailed: boolean;
  fileName: string;
  onCamera: () => void;
  onGallery: () => void;
  cameraInput: ReactNode;
  galleryInput: ReactNode;
}) {
  return (
    <DarkCard className="!p-4 sm:!p-5 ring-1 ring-emerald-500/15">
      <SectionLabel
        step="3"
        title="Upload crop photo"
        subtitle="Saaf, paas se leaf / plant photo — best diagnosis ke liye"
      />
      {cameraInput}
      {galleryInput}

      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500/45 bg-gradient-to-b from-emerald-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:from-emerald-950/35 dark:to-[var(--av-surface-inset)]">
        {previewUrl && !previewFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Selected crop photo"
            className="mx-auto max-h-72 w-full object-cover"
          />
        ) : previewUrl && previewFailed ? (
          <div className="px-4 py-12 text-center">
            <ImagePlus className="mx-auto h-14 w-14 text-emerald-600" />
            <p className="mt-3 text-base font-bold text-[var(--av-text-primary)]">Photo selected ✓</p>
            <p className="mt-1 break-all px-2 text-xs font-semibold text-[var(--av-text-secondary)]">
              {fileName || "photo"}
            </p>
            <p className="mt-2 text-[11px] text-[var(--av-text-muted)]">
              Preview nahi dikh sakti (HEIC), lekin diagnosis chalega.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onGallery}
            className="w-full px-4 py-10 text-center transition active:bg-emerald-50/80 dark:active:bg-emerald-950/20"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <Camera className="h-8 w-8" />
            </span>
            <p className="mt-4 text-base font-bold text-[var(--av-text-primary)]">
              Leaf / crop photo upload karein
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-[var(--av-text-muted)]">
              Din ke ujaale mein, focus clear rakhein. JPG / PNG, max 10MB.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              Tap to choose from gallery
            </span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2.5 border-t border-emerald-500/15 bg-emerald-50/60 p-3 dark:bg-black/25">
          <button
            type="button"
            onClick={onCamera}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition active:scale-[0.98]"
          >
            <Camera className="h-5 w-5" />
            {previewUrl ? "Nayi photo" : "Camera"}
          </button>
          <button
            type="button"
            onClick={onGallery}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/35 bg-white px-3 text-sm font-bold text-emerald-800 transition active:scale-[0.98] dark:bg-[var(--av-surface)] dark:text-emerald-200"
          >
            <ImagePlus className="h-5 w-5" />
            {previewUrl ? "Change" : "Gallery"}
          </button>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 text-[11px] text-[var(--av-text-muted)]">
        <li className="flex gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          Affected leaf ko frame ke center mein rakhein
        </li>
        <li className="flex gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          Blurry / bahut door ki photo se avoid karein
        </li>
      </ul>
    </DarkCard>
  );
}

/** 5 — Run diagnosis actions */
export function AiDoctorActions({
  canScan,
  isScanning,
  hasFile,
  onScan,
  onReset,
}: {
  canScan: boolean;
  isScanning: boolean;
  hasFile: boolean;
  onScan: () => void;
  onReset: () => void;
}) {
  return (
    <section className="space-y-3">
      <SectionLabel step="4" title="Run diagnosis" subtitle="Photo ready ho to AI analysis shuru karein" />
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
        disabled={!hasFile && !isScanning}
        className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] text-sm font-semibold text-[var(--av-text-secondary)] transition enabled:active:scale-[0.99] disabled:opacity-40"
      >
        Reset
      </button>
    </section>
  );
}

/** 6 — Recent diagnoses (single strong list) */
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
    <DarkCard className="!p-4 sm:!p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 [&>div]:mb-0">
          <SectionLabel title="Recent diagnoses" subtitle="Pehli diagnosis yahan save hoti hai" />
        </div>
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
        <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-8 text-center">
          <History className="mx-auto h-8 w-8 text-[var(--av-text-muted)]" />
          <p className="mt-2 text-sm font-semibold text-[var(--av-text-secondary)]">Abhi koi diagnosis nahi</p>
          <p className={`mt-1 ${AV.micro}`}>Photo upload karke pehli scan shuru karein</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((h) => {
            const severity =
              h.result.severity?.toLowerCase().includes("high")
                ? "high"
                : h.result.severity?.toLowerCase().includes("low")
                  ? "low"
                  : "medium";
            const date =
              typeof h.timestamp === "string"
                ? new Date(h.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : new Date(h.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  });
            return (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => onOpenEntry(h)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2.5 text-left transition hover:border-emerald-400/40 active:scale-[0.99]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--av-surface-inset)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-bold text-[var(--av-text-primary)]">
                        {h.result.diseaseName}
                      </p>
                      <RiskBadge level={severity} />
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-[var(--av-text-secondary)]">
                      {h.result.cropContext || h.result.pathogen || "Crop scan"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-[var(--av-text-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {date}
                      </span>
                      <span>·</span>
                      <span>{h.result.confidence}% conf.</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Done
                      </span>
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

/** 7 — Disease risk forecast */
export function AiDoctorRiskForecast() {
  return (
    <DarkCard className="!p-4 sm:!p-5">
      <SectionLabel
        title="Disease risk forecast"
        subtitle="Aapke area ke mausam ke hisaab se next 7 days"
      />
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <GaugeChart value={78} label="High Risk" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-bold text-[var(--av-text-primary)]">Paddy — Leaf Blast</p>
            <p className={`mt-1 ${AV.body}`}>
              Agle 7 din humid conditions mein risk high hai — early scout zaruri.
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
              Actionable advice
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
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-100">Next step</p>
              <p className="mt-0.5 text-sm font-semibold leading-snug">
                Kal subah field scout karein — suspicious leaf ki photo AI Doctor se check karein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DarkCard>
  );
}

/** 8 — Ask Expert */
export function AiDoctorAskExpert() {
  return (
    <DarkCard className="!p-4 sm:!p-5">
      <SectionLabel
        title="Ask expert"
        subtitle="Verified agronomists — fast chat for second opinion"
      />
      <ul className="space-y-3">
        {EXPERTS.map((e) => (
          <li
            key={e.name}
            className="flex items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-sm"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
              <Image src={e.photo} alt={e.name} fill className="object-cover" sizes="48px" />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  e.status === "Online" ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[var(--av-text-primary)]">{e.name}</p>
              <p className="truncate text-[11px] text-[var(--av-text-secondary)]">
                {e.title} · {e.exp}
              </p>
              <p
                className={`mt-0.5 text-[10px] font-bold ${
                  e.status === "Online" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {e.status}
              </p>
            </div>
            <AppLink
              href="/ask-query"
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-sm active:scale-[0.97]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat
            </AppLink>
          </li>
        ))}
      </ul>
      <AppLink
        href="/ask-query"
        className={`mt-4 flex w-full min-h-[44px] items-center justify-center ${AV.btnSecondary}`}
      >
        Consult Now
      </AppLink>
    </DarkCard>
  );
}

export function AiDoctorTipsHelpline() {
  return (
    <div className="space-y-4">
      <DarkCard className="!p-4 sm:!p-5">
        <SectionLabel title="Plant protection tips" />
        <ul className="mt-1 space-y-2.5">
          {PROTECTION_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-xs leading-relaxed text-[var(--av-text-secondary)]">
              <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              {tip}
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard className="!p-4 border-emerald-500/25 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-[var(--av-surface)] sm:!p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">Emergency Helpline</p>
            <p className="text-lg font-black tracking-tight text-emerald-700 dark:text-emerald-300">
              1800 120 2474
            </p>
            <p className={AV.micro}>Mon–Sat, 8 AM – 6 PM</p>
          </div>
        </div>
      </DarkCard>
    </div>
  );
}

/** Desktop / mobile supporting column */
export function AiDoctorSidebarPanels() {
  return (
    <div className="space-y-4">
      <AiDoctorRiskForecast />
      <AiDoctorAskExpert />
      <AiDoctorTipsHelpline />
    </div>
  );
}

export function AiDoctorDesktopSidebar() {
  return <AiDoctorSidebarPanels />;
}

/** Kept for any external imports of the old hero */
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

/** Alias used by older imports */
export function AiDoctorQuickIdentify({
  selectedCrop,
  onSelectCrop,
}: {
  selectedCrop: string;
  onSelectCrop: (slug: string) => void;
}) {
  return <AiDoctorCropSelect selectedCrop={selectedCrop} onSelectCrop={onSelectCrop} />;
}
