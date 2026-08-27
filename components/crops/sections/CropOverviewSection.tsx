"use client";

import { AlertTriangle, ChevronRight, Lightbulb, ListChecks } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { isHindiLocale } from "@/lib/i18n/farmer-ui";
import { riskLabelHi } from "@/lib/i18n/farmer-display";
import {
  getCropDiseaseRisk,
  getCropExpertTip,
  getCropPestRisk,
  getCropTasksDue,
} from "@/lib/crops/cropAgroMeta";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { useMemo } from "react";

interface CropOverviewSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  onTabChange: (tab: CropTabId) => void;
}

export default function CropOverviewSection({ crop, detail, onTabChange }: CropOverviewSectionProps) {
  const { locale } = useLocale();
  const hi = isHindiLocale(locale);
  const dossier = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const profilePests = dossier?.pestManagement ?? [];
  const profileDiseases = dossier?.diseaseManagement ?? [];
  const topDisease = (
    profileDiseases.length
      ? profileDiseases.map((d) => ({ name: d.diseaseName }))
      : detail.diseases
  )[0];
  const topPest = (
    profilePests.length ? profilePests.map((p) => ({ name: p.pestName })) : detail.pests
  )[0];
  const pestRisk = getCropPestRisk(crop, detail);
  const diseaseRisk = getCropDiseaseRisk(crop, detail);
  const tasksDue = getCropTasksDue(crop).slice(0, 2);
  const expertTip = getCropExpertTip(crop);
  const watchIsPest =
    pestRisk.level === "high" ||
    (pestRisk.level === "medium" && diseaseRisk.level !== "high");
  const watchName =
    watchIsPest ? topPest?.name ?? pestRisk.top : topDisease?.name ?? diseaseRisk.top;
  const watchRisk = riskLabelHi(watchIsPest ? pestRisk.level : diseaseRisk.level);
  const hasTasks = tasksDue.length > 0;

  return (
    <section
      className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
      aria-label={hi ? "आज खेत में" : "Field today"}
    >
      <div className="flex items-center gap-2 border-b border-[var(--av-border-subtle)] bg-[linear-gradient(135deg,var(--av-accent-soft)_0%,color-mix(in_srgb,var(--av-surface)_88%,transparent)_100%)] px-3.5 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--av-accent)_14%,transparent)] text-[var(--av-accent)]">
          <ListChecks className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-black leading-tight text-[var(--av-text-primary)]">
            {hi ? "आज खेत में" : "In the field today"}
          </p>
          <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">
            {hi ? "काम · चेतावनी · एक सीधी सलाह" : "Tasks · watch · one clear tip"}
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 p-3 sm:grid-cols-[1.35fr_1fr] sm:items-stretch">
        {hasTasks ? (
          <div className="rounded-xl bg-[var(--av-surface-inset)] px-3 py-2.5">
            <p className="text-[10px] font-extrabold tracking-wide text-[var(--av-accent)]">
              {hi ? "इस हफ्ते करें" : "Do this week"}
            </p>
            <ol className="mt-2 space-y-2">
              {tasksDue.map((task, i) => (
                <li key={task.id} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--av-surface)] text-[11px] font-black text-[var(--av-accent)] shadow-[var(--av-shadow-sm)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold leading-snug text-[var(--av-text-primary)]">
                      {task.task}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
                      {task.due}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="flex items-center rounded-xl bg-[var(--av-surface-inset)] px-3 py-2.5">
            <p className="text-[12px] font-semibold text-[var(--av-text-secondary)]">
              {hi
                ? "इस हफ्ते कोई खास काम नहीं — खेत साफ रखें।"
                : "No urgent task this week — keep the field clean."}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onTabChange(watchIsPest ? "pests" : "diseases")}
          className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-amber-300/70 bg-[linear-gradient(160deg,#FFF7ED_0%,#FFEDD5_100%)] px-3 py-2.5 text-left transition active:scale-[0.99] sm:min-h-0"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-900">
              <AlertTriangle className="h-3 w-3" />
              {hi ? "खेत में देखें" : "Watch now"}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-amber-800 transition group-hover:translate-x-0.5" />
          </div>
          <div className="mt-2 min-w-0">
            <p className="line-clamp-2 text-[13px] font-black leading-snug text-[#7C2D12]">
              {watchName}
            </p>
            <p className="mt-1 text-[10px] font-bold text-amber-900/80">
              {hi
                ? `${watchIsPest ? "कीट" : "रोग"} · ${watchRisk} · टैप → पूरी जानकारी`
                : `${watchIsPest ? "Pest" : "Disease"} · tap for details`}
            </p>
          </div>
        </button>
      </div>

      <div className="mx-3 mb-3 flex gap-2.5 rounded-xl border border-[var(--av-border-subtle)] bg-[color-mix(in_srgb,var(--av-accent-soft)_55%,var(--av-surface))] px-3 py-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--av-surface)] text-[var(--av-accent)] shadow-[var(--av-shadow-sm)]">
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold text-[var(--av-accent)]">
            {hi ? "एक सीधी सलाह" : "One clear tip"}
          </p>
          <p className="mt-0.5 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
            {expertTip.tip}
          </p>
        </div>
      </div>
    </section>
  );
}
