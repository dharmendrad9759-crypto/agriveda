"use client";

import { ChevronRight, AlertTriangle } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import MotionCard from "@/components/motion/MotionCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { isHindiLocale } from "@/lib/i18n/farmer-ui";
import { riskLabelHi, stageLabelHi } from "@/lib/i18n/farmer-display";
import { AV } from "@/lib/design/tokens";
import {
  formatClimateCard,
  formatSowingCard,
  getCropDiseaseRisk,
  getCropExpertTip,
  getCropIrrigationSummary,
  getCropPestRisk,
  getCropStageAlerts,
  getCropTasksDue,
} from "@/lib/crops/cropAgroMeta";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import GrowthStageImage, { growthKindFromStage } from "@/components/crops/GrowthStageImage";
import CropGrowthHonestySection from "@/components/crops/sections/CropGrowthHonestySection";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import { getGrowthStageImage } from "@/lib/crops/growthStageImages";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import type { CropTabId } from "@/lib/crops/crop-tabs";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { useMemo } from "react";

function MiniStat({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <MotionCard delay={index} className="av-card min-h-[72px] px-3 py-2.5">
      <p className={AV.label}>{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--av-text-primary)] break-words">{value}</p>
    </MotionCard>
  );
}

function watchLevelLabel(level: "high" | "medium" | "low", hi: boolean): string {
  if (!hi) {
    return level === "high" ? "Priority" : level === "medium" ? "Monitor" : "Low";
  }
  return level === "high"
    ? riskLabelHi("priority")
    : level === "medium"
      ? riskLabelHi("monitor")
      : riskLabelHi("low");
}

interface CropOverviewSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  onTabChange: (tab: CropTabId) => void;
}

export default function CropOverviewSection({ crop, detail, onTabChange }: CropOverviewSectionProps) {
  const { t, locale } = useLocale();
  const hi = isHindiLocale(locale);
  const { profile } = useFarmerProfile();
  const dossier = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const profilePests = dossier?.pestManagement ?? [];
  const profileDiseases = dossier?.diseaseManagement ?? [];
  const growthStages = dossier?.growthStages?.length ? dossier.growthStages : detail.growthStages;
  const topDiseases = (
    profileDiseases.length
      ? profileDiseases.map((d) => ({ name: d.diseaseName }))
      : detail.diseases
  ).slice(0, 3);
  const topPests = (
    profilePests.length ? profilePests.map((p) => ({ name: p.pestName })) : detail.pests
  ).slice(0, 3);
  const varieties = getVarietiesForCrop(crop.slug, profile.state || undefined).slice(0, 3);
  const pestRisk = getCropPestRisk(crop, detail);
  const diseaseRisk = getCropDiseaseRisk(crop, detail);
  const stageAlerts = getCropStageAlerts(crop);
  const tasksDue = getCropTasksDue(crop);
  const irrigation = getCropIrrigationSummary(crop);
  const expertTip = getCropExpertTip(crop);
  const irrigationHint = dossier?.irrigationSchedule?.[0];

  const stageName = (name: string) => (hi ? stageLabelHi(name) : name);
  const riskName = (level: string) => (hi ? riskLabelHi(level) : level);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label={t("cropDuration")} value={crop.durationDays} index={0} />
        <MiniStat label={t("cropYield")} value={crop.estimatedYield} index={1} />
        <MiniStat label={t("soil")} value={crop.suitableSoil} index={2} />
        <MiniStat label={t("cropSeason")} value={crop.suitableSeason} index={3} />
        <MiniStat label={t("seedRate")} value={crop.seedRate} index={4} />
        <MiniStat label={t("spacing")} value={crop.spacing} index={5} />
        <MiniStat label={t("cropClimate")} value={formatClimateCard(crop.slug, crop.climate)} index={6} />
        <MiniStat label={t("sowing")} value={formatSowingCard(crop.slug, crop.sowingGuide.bestSowingTime)} index={7} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <DarkCard className="lg:col-span-4" delay={0}>
          <SectionHeader title={t("cropTasksDue")} action={{ label: t("shellCropCalendar"), href: "/crop-calendar" }} />
          <ul className="mt-3 space-y-2">
            {tasksDue.map((task) => (
              <li key={task.id} className="av-card-inset">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{task.task}</p>
                  <RiskBadge level={task.priority} label={riskName(task.priority)} />
                </div>
                <p className={`mt-1 ${AV.micro}`}>{task.due}</p>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard className="lg:col-span-4" delay={1}>
          <SectionHeader title={t("cropPestDiseaseRisk")} />
          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={() => onTabChange("pests")}
              className="av-card-inset flex w-full items-center justify-between text-left"
            >
              <div>
                <p className={AV.label}>
                  {t("cropPestWatch")} · {watchLevelLabel(pestRisk.level, hi)}
                </p>
                <p className="text-sm font-semibold text-[var(--av-text-primary)]">
                  {topPests[0]?.name ?? pestRisk.top}
                </p>
              </div>
              <RiskBadge level={pestRisk.level} label={hi ? riskLabelHi(pestRisk.level) : undefined} />
            </button>
            <button
              type="button"
              onClick={() => onTabChange("diseases")}
              className="av-card-inset flex w-full items-center justify-between text-left"
            >
              <div>
                <p className={AV.label}>
                  {t("cropDiseaseWatch")} · {watchLevelLabel(diseaseRisk.level, hi)}
                </p>
                <p className="text-sm font-semibold text-[var(--av-text-primary)]">
                  {topDiseases[0]?.name ?? diseaseRisk.top}
                </p>
              </div>
              <RiskBadge level={diseaseRisk.level} label={hi ? riskLabelHi(diseaseRisk.level) : undefined} />
            </button>
          </div>
        </DarkCard>

        <DarkCard className="lg:col-span-4" delay={2}>
          <SectionHeader title={t("irrigation")} />
          <div className="mt-3 space-y-2 text-sm">
            {irrigationHint ? (
              <p className="text-xs text-[var(--av-text-secondary)]">{irrigationHint}</p>
            ) : (
              <>
                <p className="flex justify-between gap-2">
                  <span className={AV.micro}>{t("cropTotalWater")}</span>
                  <span className="text-right font-semibold text-[var(--av-text-primary)]">
                    {irrigation.totalWater}
                  </span>
                </p>
                <p className="flex justify-between gap-2">
                  <span className={AV.micro}>{t("cropSchedule")}</span>
                  <span className="text-right font-semibold text-[var(--av-text-primary)]">
                    {irrigation.frequency}
                  </span>
                </p>
                <p className="text-[10px] text-[var(--av-text-muted)]">{irrigation.criticalNote}</p>
              </>
            )}
            <button
              type="button"
              onClick={() => onTabChange("irrigation")}
              className="mt-2 w-full text-left text-xs text-[var(--av-accent)]"
            >
              {t("cropFullIrrigation")} →
            </button>
          </div>
        </DarkCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <DarkCard delay={1}>
          <SectionHeader title={t("cropTopDiseases")} />
          <ul className="mt-2 space-y-2 text-xs">
            {topDiseases.map((d, i) => (
              <li key={d.name} className="flex justify-between">
                <span className="text-[var(--av-text-secondary)]">{d.name}</span>
                <RiskBadge
                  level={
                    i === 0 ? diseaseRisk.level : diseaseRisk.level === "high" ? "medium" : "low"
                  }
                  label={
                    hi
                      ? riskLabelHi(
                          i === 0
                            ? diseaseRisk.level
                            : diseaseRisk.level === "high"
                              ? "medium"
                              : "low"
                        )
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onTabChange("diseases")}
            className="mt-3 text-[10px] font-bold text-[var(--av-accent)]"
          >
            {t("cropViewAllDiseases")} →
          </button>
        </DarkCard>

        <DarkCard delay={2}>
          <SectionHeader title={t("cropTopPests")} />
          <ul className="mt-2 space-y-2 text-xs">
            {topPests.map((p, i) => (
              <li key={p.name} className="flex justify-between">
                <span className="text-[var(--av-text-secondary)]">{p.name}</span>
                <RiskBadge
                  level={i === 0 ? pestRisk.level : pestRisk.level === "high" ? "medium" : "low"}
                  label={
                    hi
                      ? riskLabelHi(
                          i === 0 ? pestRisk.level : pestRisk.level === "high" ? "medium" : "low"
                        )
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onTabChange("pests")}
            className="mt-3 text-[10px] font-bold text-[var(--av-accent)]"
          >
            {t("cropViewAllPests")} →
          </button>
        </DarkCard>

        <DarkCard delay={3}>
          <SectionHeader title={t("cropRecommendedVarieties")} />
          <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
            {crop.name} — {t("cropVarietiesSubtitle")}
          </p>
          <ul className="mt-2 space-y-2">
            {varieties.map((v) => (
              <li key={v.name} className="av-card-inset">
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{v.name}</p>
                <p className={AV.micro}>{v.trait}</p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onTabChange("varieties")}
            className="mt-3 text-[10px] font-bold text-[var(--av-accent)]"
          >
            {t("viewAll")} →
          </button>
        </DarkCard>
      </div>

      <DarkCard delay={2}>
        <SectionHeader title={t("cropStageAlerts")} />
        <ul className="mt-3 space-y-2">
          {stageAlerts.map((a) => (
            <li key={a.id} className="av-card-inset flex gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{stageName(a.stage)}</p>
                  <RiskBadge level={a.level} label={hi ? riskLabelHi(a.level) : undefined} />
                </div>
                <p className={`mt-0.5 ${AV.micro}`}>{a.alert}</p>
              </div>
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard delay={3}>
        <SectionHeader title={t("expertAdvice")} action={expertTip.action} />
        <p className={`mt-2 ${AV.body}`}>{expertTip.tip}</p>
      </DarkCard>

      {crop.slug === "paddy" ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onTabChange("growth")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onTabChange("growth");
            }
          }}
          className="cursor-pointer"
        >
          <CropGrowthHonestySection compact />
        </div>
      ) : null}

      <DarkCard delay={4}>
        <div className="flex items-center justify-between">
          <SectionHeader title={t("growthStages")} />
          <button type="button" onClick={() => onTabChange("growth")} className={AV.link}>
            {t("cropFullTimeline")} →
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 overflow-x-auto scrollbar-hide">
          {growthStages.map((stage, i) => {
            const kind = growthKindFromStage(stage.title, stage.period);
            const img = getGrowthStageImage({
              cropSlug: crop.slug,
              cropName: crop.name,
              title: stage.title,
              period: stage.period,
              index: i,
            });
            return (
              <button
                key={`${stage.title}-${stage.period}`}
                type="button"
                onClick={() => onTabChange("growth")}
                className="relative min-h-[92px] min-w-[110px] shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] text-left"
              >
                <GrowthStageImage src={img} kind={kind} className="absolute inset-0" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                <span className="relative z-10 flex h-full min-h-[92px] flex-col justify-end p-2">
                  <p className="text-[10px] font-bold text-emerald-200">{stage.period}</p>
                  <p className="mt-0.5 text-[10px] font-extrabold leading-tight text-white">
                    {stageName(stage.title)}
                  </p>
                  {i === 2 && (
                    <span className="mt-1 inline-block w-fit rounded bg-emerald-500/90 px-1.5 py-0.5 text-[8px] font-bold text-white">
                      {t("currentStage")}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </DarkCard>

      {dossier?.pgrProducts?.length ? (
        <DarkCard delay={5}>
          <SectionHeader title={hi ? "आधुनिक PGR / बायो-स्टीमुलेंट" : "Modern PGR / biostimulant"} />
          <CropSprayMedicineList products={dossier.pgrProducts} hi={hi} />
        </DarkCard>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <AppLink href={`/pest-diseases?crop=${crop.slug}`} className={`${AV.btnSecondarySm}`}>
          {t("cropSprayGuide")} <ChevronRight className="h-3 w-3" />
        </AppLink>
        <AppLink href="/schemes" className={AV.btnSecondarySm}>
          {hi ? "योजना / KCC" : "Schemes"} <ChevronRight className="h-3 w-3" />
        </AppLink>
        <AppLink href="/ai-doctor" className={AV.btnPrimarySm}>
          {t("toolAi")}
        </AppLink>
      </div>
    </div>
  );
}
