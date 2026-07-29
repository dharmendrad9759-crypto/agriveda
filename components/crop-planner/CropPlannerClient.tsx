"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Calendar,
  Download,
  Share2,
  Sprout,
  Droplets,
  IndianRupee,
  Stethoscope,
  Loader2,
  Sparkles,
  ShieldCheck,
  Clock3,
  TrendingUp,
  ChevronRight,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  Leaf,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { tf, type FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import {
  getCropHindiName,
  getCropImageUrl,
  getPlannerSeasonsForCrop,
  pickDefaultPlannerSeason,
  type PlannerSeasonId,
} from "@/lib/crops/crop-display";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import { buildFertilizerPlan } from "@/lib/agriveda2/fertilizerEngine";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { writeStorage } from "@/lib/storage";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import { shortenFarmerLine, shortenFarmerLines, stageTipsFromPoints } from "@/lib/crops/farmerShortCopy";

const SEASONS: { id: PlannerSeasonId; labelKey: FarmerUiKey; months: string }[] = [
  { id: "kharif", labelKey: "plannerKharif", months: "Jun–Oct" },
  { id: "rabi", labelKey: "plannerRabi", months: "Nov–Mar" },
  { id: "zaid", labelKey: "plannerZaid", months: "Apr–Jun" },
];

const AREA_PRESETS = ["0.5", "1", "2", "5"];

const PLAN_TAB_IDS = [
  "Overview",
  "Irrigation",
  "Fertilizer",
  "Pest Control",
  "Disease Control",
  "Weed Control",
  "Harvest",
] as const;

type PlanTab = (typeof PLAN_TAB_IDS)[number];

const STAGE_ICONS = ["🌱", "🚜", "🌿", "🌾", "🌸", "🌽", "✅", "📦"];

interface SavedPlan {
  cropSlug: string;
  season: string;
  areaAcres: number;
  generatedAt: string;
}

function cropShortName(name: string) {
  return name.split("(")[0]?.trim() || name;
}

export default function CropPlannerClient() {
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const planRef = useRef<HTMLDivElement>(null);

  const [cropSlug, setCropSlug] = useState("paddy");
  const [season, setSeason] = useState<PlannerSeasonId>("kharif");
  const [area, setArea] = useState("1");
  const [activeTab, setActiveTab] = useState<PlanTab>("Overview");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planStamp, setPlanStamp] = useState<string | null>(null);

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindi = getCropHindiName(crop.slug);
  const mgmt = getCropManagementProfile(crop.slug);
  const acres = Math.max(0.1, Number(area) || 1);
  const displayName = cropShortName(crop.name);
  const acreUnit = t("plannerAreaLabel");

  const hooks = useMemo(
    () =>
      [
        { icon: ShieldCheck, title: t("plannerHookLoss"), text: t("plannerHookLossDesc") },
        { icon: IndianRupee, title: t("plannerHookCost"), text: t("plannerHookCostDesc") },
        { icon: Clock3, title: t("plannerHookDaily"), text: t("plannerHookDailyDesc") },
      ] as const,
    [t]
  );

  const planTabs = useMemo(
    () =>
      [
        { id: "Overview" as const, label: t("plannerTabWork"), hint: t("plannerTabHintStages") },
        { id: "Irrigation" as const, label: t("plannerTabWater"), hint: t("plannerTabHintWater") },
        { id: "Fertilizer" as const, label: t("plannerTabFert"), hint: t("plannerTabHintDose") },
        { id: "Pest Control" as const, label: t("plannerTabPest"), hint: t("plannerTabHintScout") },
        { id: "Disease Control" as const, label: t("plannerTabDisease"), hint: t("plannerTabHintProtect") },
        { id: "Weed Control" as const, label: t("plannerTabWeed"), hint: t("plannerTabHintClean") },
        { id: "Harvest" as const, label: t("plannerTabHarvest"), hint: t("plannerTabHintYield") },
      ] as const,
    [t]
  );

  const allowedSeasons = useMemo(
    () => getPlannerSeasonsForCrop(crop.slug, crop.suitableSeason),
    [crop.slug, crop.suitableSeason]
  );

  const seasonOptions = useMemo(
    () => SEASONS.filter((s) => allowedSeasons.includes(s.id)),
    [allowedSeasons]
  );

  useEffect(() => {
    const next = pickDefaultPlannerSeason(allowedSeasons);
    setSeason((prev) => (allowedSeasons.includes(prev) ? prev : next));
  }, [crop.slug, allowedSeasons]);

  const fertPlan = useMemo(
    () => (generated ? buildFertilizerPlan(crop.slug, acres) : null),
    [generated, crop.slug, acres, planStamp]
  );

  const varieties = useMemo(
    () => getVarietiesForCrop(crop.slug, profile.state || undefined).slice(0, 3),
    [crop.slug, profile.state, planStamp]
  );

  const timeline = useMemo(() => {
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        { stage: "Buwai", days: shortenFarmerLine(crop.sowingGuide.bestSowingTime, 28), icon: "🌱" },
        { stage: "Badhaw", days: "Shuruat", icon: "🌿" },
        { stage: "Phool/dana", days: "Beech", icon: "🌸" },
        { stage: "Kataai", days: shortenFarmerLine(crop.harvestAndYield.harvestingTime, 28), icon: "✅" },
      ];
    }
    return stages.slice(0, 6).map((s, i) => ({
      stage: shortenFarmerLine(s.title.split(/[—(]/)[0]?.trim() || s.title, 16),
      days: shortenFarmerLine(s.period, 24),
      icon: STAGE_ICONS[i] ?? "🌱",
    }));
  }, [mgmt, crop, planStamp]);

  const scheduleRows = useMemo(() => {
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        {
          stage: "Buwai",
          days: shortenFarmerLine(crop.sowingGuide.bestSowingTime, 32),
          activities: stageTipsFromPoints(
            [
              `Beej: ${crop.sowingGuide.seedRate}`,
              crop.sowingGuide.seedTreatment,
              crop.sowingGuide.sowingMethod,
            ],
            "Certified beej + sahi spacing"
          ),
        },
        {
          stage: "Dekhbhal",
          days: shortenFarmerLine(crop.durationDays, 32),
          activities: stageTipsFromPoints(
            crop.irrigationManagement.schedule,
            "Paani mitti dekh ke dein"
          ),
        },
        {
          stage: "Kataai",
          days: shortenFarmerLine(crop.harvestAndYield.harvestingTime, 32),
          activities: stageTipsFromPoints(
            crop.harvestAndYield.maturitySigns,
            "Pakne ke nishaan dekh ke kaatein"
          ),
        },
      ];
    }
    return stages.slice(0, 6).map((s) => ({
      stage: shortenFarmerLine(s.title.split(/[—(]/)[0]?.trim() || s.title, 22),
      days: shortenFarmerLine(s.period, 28),
      activities: stageTipsFromPoints(s.keyPoints, s.title),
    }));
  }, [mgmt, crop, planStamp]);

  const reminders = useMemo(() => {
    const list: { tone: "good" | "warn" | "info" | "hot"; text: string }[] = [];
    const fert = fertPlan?.schedule?.[0];
    if (fert) {
      list.push({
        tone: "good",
        text: shortenFarmerLine(`Khad: ${fert.time} — ${fert.apply}`, 78),
      });
    } else if (crop.fertilizerSchedule.stageWise[0]) {
      list.push({
        tone: "good",
        text: shortenFarmerLine(
          `Khad (${crop.fertilizerSchedule.stageWise[0].stage}): ${crop.fertilizerSchedule.stageWise[0].details[0]}`,
          78
        ),
      });
    }
    const pest = mgmt?.pestManagement?.[0];
    if (pest) {
      list.push({
        tone: "warn",
        text: shortenFarmerLine(`Keet: ${pest.pestName} — field check karte rahein`, 78),
      });
    }
    if (crop.irrigationManagement.criticalStages[0]) {
      list.push({
        tone: "info",
        text: shortenFarmerLine(
          `Paani zaroori: ${crop.irrigationManagement.criticalStages.slice(0, 2).join(", ")}`,
          78
        ),
      });
    }
    list.push({
      tone: "hot",
      text: shortenFarmerLine(`Kataai: ${crop.harvestAndYield.harvestingTime}`, 78),
    });
    return list.slice(0, 4);
  }, [fertPlan, mgmt, crop, planStamp]);

  const seasonLabel = (id: PlannerSeasonId) => {
    const meta = SEASONS.find((s) => s.id === id);
    return meta ? t(meta.labelKey) : id;
  };

  const downloadShortPlan = () => {
    const lines = [
      `Agriveda plan — ${crop.name}${hindi ? ` (${hindi})` : ""}`,
      `${t("plannerSeason")}: ${seasonLabel(season)}`,
      `${t("plannerAreaLabel")}: ${acres} ${acreUnit}`,
      "",
      `${t("plannerStageChecklist")}:`,
      ...scheduleRows.flatMap((r) => [
        `• ${r.stage} (${r.days})`,
        ...r.activities.map((a) => `  - ${a}`),
      ]),
      "",
      `${t("plannerRemember")}:`,
      ...reminders.map((r) => `• ${r.text}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${crop.slug}-plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("plannerPlanDownloaded"));
  };

  const selectCrop = (nextSlug: string) => {
    const nextCrop = crops.find((c) => c.slug === nextSlug) ?? crops[0];
    const seasons = getPlannerSeasonsForCrop(nextCrop.slug, nextCrop.suitableSeason);
    setCropSlug(nextSlug);
    setSeason(pickDefaultPlannerSeason(seasons));
    setGenerated(false);
  };

  const generatePlan = async () => {
    if (!cropSlug) {
      showToast(t("plannerSelectCropFirst"), "error");
      return;
    }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 450));

    const stamp = new Date().toISOString();
    const saved: SavedPlan = {
      cropSlug: crop.slug,
      season,
      areaAcres: acres,
      generatedAt: stamp,
    };
    writeStorage("agriveda-last-crop-plan", saved);

    setPlanStamp(stamp);
    setGenerated(true);
    setActiveTab("Overview");
    setGenerating(false);
    showToast(
      tf(locale, "plannerToastReady", {
        crop: `${displayName}${hindi ? ` (${hindi})` : ""}`,
        acres,
        season: seasonLabel(season),
      })
    );

    requestAnimationFrame(() => {
      planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const waterNeed = shortenFarmerLine(
    crop.irrigationManagement.waterRequirement ||
      mgmt?.irrigationSchedule?.[0] ||
      "Mitti dekh ke paani",
    40
  );

  const seasonMeta = SEASONS.find((s) => s.id === season);

  const tabBody = () => {
    if (activeTab === "Overview") {
      return (
        <section className="overflow-hidden rounded-[1.75rem] border border-emerald-500/20 bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] xl:col-span-8">
          <div className="border-b border-emerald-500/15 bg-gradient-to-r from-emerald-500/10 via-transparent to-amber-500/5 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                  {t("plannerStartToday")}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--av-text-primary)]">
                  {displayName} — {t("plannerStageChecklist")}
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-white">
                {acres} {acreUnit}
              </span>
            </div>
          </div>
          <ul className="space-y-2.5 p-4">
            {scheduleRows.map((row, idx) => (
              <li
                key={row.stage + row.days}
                className="relative overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3.5 py-3"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-400" />
                <div className="flex items-baseline justify-between gap-2 pl-2">
                  <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    <span className="mr-1.5 text-[10px] text-[var(--av-text-muted)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {row.stage}
                  </p>
                  <p className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-[var(--av-text-muted)] dark:bg-white/5">
                    {row.days}
                  </p>
                </div>
                <ul className="mt-1.5 space-y-0.5 pl-2">
                  {row.activities.map((a) => (
                    <li key={a} className="flex gap-1.5 text-xs leading-snug text-[var(--av-text-secondary)]">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 border-t border-[var(--av-border)] px-4 py-3">
            <button
              type="button"
              onClick={downloadShortPlan}
              className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              <Download className="h-3.5 w-3.5" />
              {t("plannerSavePlan")}
            </button>
            <button
              type="button"
              onClick={() => {
                const text = [
                  `${crop.name} · ${acres} ${acreUnit} · ${seasonLabel(season)}`,
                  ...scheduleRows.map((r) => `${r.stage}: ${r.activities.join("; ")}`),
                ].join("\n");
                if (navigator.share) {
                  void navigator.share({ title: "Agriveda Crop Plan", text });
                } else {
                  void navigator.clipboard?.writeText(text);
                  showToast(t("plannerPlanCopied"));
                }
              }}
              className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              <Share2 className="h-3.5 w-3.5" />
              {t("plannerShare")}
            </button>
            <AppLink
              href={`/crops/${crop.slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white"
            >
              {t("plannerFullGuide")} <ChevronRight className="h-3.5 w-3.5" />
            </AppLink>
          </div>
        </section>
      );
    }

    if (activeTab === "Irrigation") {
      const lines = shortenFarmerLines(
        mgmt?.irrigationSchedule?.length
          ? mgmt.irrigationSchedule
          : [
              crop.irrigationManagement.waterRequirement,
              ...crop.irrigationManagement.criticalStages.map((c) => `Critical: ${c}`),
              ...crop.irrigationManagement.schedule,
            ],
        4,
        70
      );
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabWater")}
          title={`${displayName} — ${t("plannerTabHintWater")}`}
          accent="sky"
        >
          <ul className="space-y-2">
            {lines.map((line) => (
              <li
                key={line}
                className="flex gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-3 py-2.5 text-sm font-medium text-[var(--av-text-primary)]"
              >
                <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                {line}
              </li>
            ))}
          </ul>
        </PlanPanel>
      );
    }

    if (activeTab === "Fertilizer") {
      const lines = shortenFarmerLines(
        fertPlan?.schedule?.length
          ? fertPlan.schedule.map((s) => `${s.time}: ${s.apply}`)
          : [
              ...crop.fertilizerSchedule.basalDose,
              ...crop.fertilizerSchedule.stageWise.flatMap((s) =>
                s.details.map((d) => `${s.stage}: ${d}`)
              ),
            ],
        5,
        75
      );
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabFert")}
          title={`${displayName} — ${acres} ${acreUnit}`}
          accent="emerald"
        >
          <ul className="space-y-2">
            {lines.map((line) => (
              <li
                key={line}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-sm font-medium"
              >
                {line}
              </li>
            ))}
          </ul>
          {fertPlan?.bags?.length ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {fertPlan.bags.slice(0, 3).map((b) => (
                <div
                  key={b.name}
                  className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-transparent px-2 py-3 text-center"
                >
                  <p className="text-[9px] text-[var(--av-text-muted)]">{shortenFarmerLine(b.name, 18)}</p>
                  <p className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-300">{b.amount}</p>
                </div>
              ))}
            </div>
          ) : null}
        </PlanPanel>
      );
    }

    if (activeTab === "Pest Control") {
      const pests = mgmt?.pestManagement?.slice(0, 4) ?? [];
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabPest")}
          title={`${t("plannerTabPest")} — ${displayName}`}
          accent="amber"
        >
          {pests.length ? (
            <ul className="space-y-2">
              {pests.map((p) => (
                <li key={p.pestName} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                  <p className="text-sm font-bold text-[var(--av-text-primary)]">
                    {shortenFarmerLine(p.pestName, 40)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {shortenFarmerLine(`${p.activeIngredient} — ${p.dose}`, 70)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3 w-3" />
                    {t("plannerTabHintScout")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--av-text-muted)]">
              {shortenFarmerLines(crop.cropProtection.majorPests, 3, 40).join(" · ") || t("plannerFullGuide")}
            </p>
          )}
        </PlanPanel>
      );
    }

    if (activeTab === "Disease Control") {
      const diseases = mgmt?.diseaseManagement?.slice(0, 4) ?? [];
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabDisease")}
          title={`${t("plannerTabDisease")} — ${displayName}`}
          accent="rose"
        >
          {diseases.length ? (
            <ul className="space-y-2">
              {diseases.map((d) => (
                <li key={d.diseaseName} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5">
                  <p className="text-sm font-bold">{shortenFarmerLine(d.diseaseName, 40)}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {shortenFarmerLine(`${d.activeIngredient} — ${d.dose}`, 70)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--av-text-muted)]">
              {shortenFarmerLines(crop.cropProtection.majorDiseases, 3, 40).join(" · ") || t("plannerFullGuide")}
            </p>
          )}
        </PlanPanel>
      );
    }

    if (activeTab === "Weed Control") {
      const weeds = mgmt?.weedManagement?.slice(0, 3) ?? [];
      const program = mgmt?.weedProgram;
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabWeed")}
          title={`${t("plannerTabWeed")} — ${displayName}`}
          accent="lime"
        >
          {program?.criticalPeriod ? (
            <p className="mb-2 text-xs font-semibold text-lime-700 dark:text-lime-300">
              {shortenFarmerLine(program.criticalPeriod, 50)}
            </p>
          ) : null}
          {weeds.length ? (
            <ul className="space-y-2">
              {weeds.map((w) => (
                <li key={w.weedName} className="rounded-2xl border border-lime-500/20 bg-lime-500/5 px-3 py-2.5">
                  <p className="text-sm font-bold">{shortenFarmerLine(w.weedName, 36)}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {shortenFarmerLine(
                      `${w.postEmergenceHerbicide || w.preEmergenceHerbicide} · ${w.dose}`,
                      72
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-1.5">
              {shortenFarmerLines(crop.cropProtection.weedManagement, 3, 70).map((w) => (
                <li
                  key={w}
                  className="rounded-2xl border border-[var(--av-border)] px-3 py-2 text-sm text-[var(--av-text-secondary)]"
                >
                  {w}
                </li>
              ))}
            </ul>
          )}
        </PlanPanel>
      );
    }

    return (
      <PlanPanel
        className="xl:col-span-12"
        eyebrow={t("plannerTabHarvest")}
        title={`${t("plannerTabHarvest")} — ${displayName}`}
        accent="amber"
      >
        <p className="text-base font-black text-amber-600 dark:text-amber-300">
          {shortenFarmerLine(crop.harvestAndYield.harvestingTime, 50)}
        </p>
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {t("plannerYield")}: {shortenFarmerLine(crop.estimatedYield, 40)}
        </p>
        <ul className="mt-3 space-y-1.5">
          {shortenFarmerLines(
            [...crop.harvestAndYield.maturitySigns, ...crop.harvestAndYield.storageTips.slice(0, 2)],
            4,
            70
          ).map((m) => (
            <li
              key={m}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-[var(--av-text-secondary)]"
            >
              {m}
            </li>
          ))}
        </ul>
      </PlanPanel>
    );
  };

  return (
    <div className="space-y-5">
      {/* Marketing hero */}
      <section className="relative overflow-hidden rounded-[1.85rem] border border-emerald-500/25 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-white shadow-[0_24px_60px_-24px_rgba(6,78,59,0.7)]">
        <div className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100">
              <Sparkles className="h-3 w-3 text-amber-300" />
              {t("plannerHeroBadge")}
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[1.65rem] font-bold leading-tight tracking-tight sm:text-3xl">
              {t("plannerHeroLine1a")}{" "}
              <span className="text-amber-300">{t("plannerHeroLine1b")}</span>
              <br />
              {t("plannerHeroLine2a")} <span className="text-emerald-300">{t("plannerHeroLine2b")}</span>
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-emerald-50/80">
              {t("plannerHeroDesc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hooks.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex min-w-[9.5rem] flex-1 items-start gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5 backdrop-blur-md"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-white">{title}</p>
                    <p className="text-[10px] leading-snug text-white/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl sm:mx-0 sm:h-40 sm:w-40">
            <Image
              src={getCropImageUrl(crop)}
              alt={displayName}
              fill
              className="object-cover"
              sizes="160px"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
              <p className="text-xs font-bold text-white">{displayName}</p>
              {hindi ? <p className="text-[10px] text-emerald-200">{hindi}</p> : null}
            </div>
          </div>
        </div>
      </section>

      {/* Step progress */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { n: "01", label: t("plannerStepCrop"), done: true },
          { n: "02", label: t("plannerStepSeason"), done: true },
          { n: "03", label: t("plannerStepPlan"), done: generated },
        ].map((s) => (
          <div
            key={s.n}
            className={cn(
              "rounded-2xl border px-3 py-2.5",
              s.done
                ? "border-emerald-500/35 bg-emerald-500/10"
                : "border-[var(--av-border)] bg-[var(--av-surface)]"
            )}
          >
            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-300">{s.n}</p>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Crop picker */}
      <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--av-accent)]">
              {t("plannerStep1")}
            </p>
            <h3 className="text-base font-bold text-[var(--av-text-primary)]">{t("plannerWhichCrop")}</h3>
          </div>
          <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">{crops.length}</p>
        </div>

        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {crops.map((c) => {
            const active = c.slug === cropSlug;
            const h = getCropHindiName(c.slug);
            const short = cropShortName(c.name);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => selectCrop(c.slug)}
                className={cn(
                  "group relative w-[5.6rem] shrink-0 overflow-hidden rounded-2xl border text-left transition active:scale-[0.98]",
                  active
                    ? "border-emerald-500 ring-2 ring-emerald-500/35 shadow-[0_12px_28px_-12px_rgba(16,185,129,0.55)]"
                    : "border-[var(--av-border)] opacity-90 hover:opacity-100"
                )}
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={getCropImageUrl(c)}
                    alt={short}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="90px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {active ? (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </div>
                <div className="bg-[var(--av-surface-inset)] px-2 py-2">
                  <p className="truncate text-[11px] font-bold text-[var(--av-text-primary)]">{short}</p>
                  {h ? <p className="truncate text-[9px] text-[var(--av-text-muted)]">{h}</p> : null}
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
          {t("plannerSeasonFit")}:{" "}
          <span className="font-semibold text-[var(--av-text-secondary)]">{crop.suitableSeason}</span>
        </p>
      </section>

      {/* Season + area */}
      <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--av-accent)]">
          {t("plannerStep2")}
        </p>
        <h3 className="mt-0.5 text-base font-bold text-[var(--av-text-primary)]">{t("plannerSeasonArea")}</h3>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {seasonOptions.map((s) => {
            const active = season === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSeason(s.id);
                  setGenerated(false);
                }}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left transition",
                  active
                    ? "border-emerald-500 bg-emerald-500/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                )}
              >
                <p className="text-sm font-black text-[var(--av-text-primary)]">{t(s.labelKey)}</p>
                <p className="mt-0.5 text-[10px] font-medium text-[var(--av-text-muted)]">{s.months}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-[var(--av-text-secondary)]">{t("plannerArea")}</label>
            <div className="flex items-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-1">
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setGenerated(false);
                }}
                className="w-16 bg-transparent text-sm font-black text-[var(--av-text-primary)] outline-none"
              />
              <span className="text-[10px] font-bold text-[var(--av-text-muted)]">{acreUnit}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {AREA_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setArea(preset);
                  setGenerated(false);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-bold transition",
                  area === preset
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
                )}
              >
                {preset} {acreUnit}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Generate CTA — commitment trap */}
      <section className="sticky bottom-24 z-20 overflow-hidden rounded-[1.75rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-4 text-white shadow-[0_18px_40px_-16px_rgba(16,185,129,0.65)] lg:static lg:bottom-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-50/90">
              <Zap className="h-3 w-3 text-amber-200" />
              {t("plannerStep3")}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug">
              {displayName}
              {hindi ? ` (${hindi})` : ""} · {seasonMeta ? t(seasonMeta.labelKey) : season} · {acres}{" "}
              {acreUnit}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-50/85">
              {generated ? t("plannerReadyHint") : t("plannerTapHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void generatePlan()}
            disabled={generating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-emerald-800 shadow-lg transition active:scale-[0.98] disabled:opacity-60"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {generating ? t("plannerGenerating") : generated ? t("plannerRegenerate") : t("plannerGenerate")}
          </button>
        </div>
      </section>

      {!generated && (
        <section className="rounded-[1.75rem] border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[var(--av-text-primary)]">{t("plannerWhatInside")}</p>
              <ul className="mt-2 space-y-1.5 text-xs text-[var(--av-text-secondary)]">
                <li className="flex gap-2">
                  <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {t("plannerBenefitStages")}
                </li>
                <li className="flex gap-2">
                  <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                  {t("plannerBenefitWater")}
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  {t("plannerBenefitWatch")}
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {generated && (
        <div ref={planRef} className="space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{t("plannerUnlocked")}</p>
              <p className="text-[11px] text-[var(--av-text-muted)]">{t("plannerUnlockedHint")}</p>
            </div>
          </div>

          {/* Growth stages */}
          <section className="overflow-hidden rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--av-accent)]">
                  {t("plannerJourney")}
                </p>
                <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
                  {displayName}
                  {hindi ? ` (${hindi})` : ""} — {t("plannerGrowthStages")}
                </h3>
              </div>
              <span className="rounded-full border border-[var(--av-border)] px-2.5 py-1 text-[10px] font-bold text-[var(--av-text-muted)]">
                {tf(locale, "plannerStagesCount", { n: timeline.length })}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {timeline.map((item, i) => (
                <div
                  key={item.stage + i}
                  className="relative flex min-w-[108px] shrink-0 flex-col items-center rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent px-3 py-3 text-center"
                >
                  {i < timeline.length - 1 && (
                    <span className="absolute left-[calc(50%+54px)] top-8 hidden h-0.5 w-4 bg-emerald-500/30 sm:block" />
                  )}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-[var(--av-surface)] text-lg shadow-sm">
                    {item.icon}
                  </span>
                  <p className="mt-2 text-[11px] font-bold text-[var(--av-text-primary)]">{item.stage}</p>
                  <p className="text-[9px] text-[var(--av-text-muted)]">{item.days}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tabs */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
            {planTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "min-w-[4.4rem] shrink-0 rounded-2xl border px-3 py-2.5 text-center transition",
                  activeTab === tab.id
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.7)]"
                    : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                )}
              >
                <p className="text-xs font-black leading-none">{tab.label}</p>
                <p
                  className={cn(
                    "mt-1 text-[9px] font-semibold",
                    activeTab === tab.id ? "text-emerald-50/85" : "text-[var(--av-text-muted)]"
                  )}
                >
                  {tab.hint}
                </p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            {tabBody()}

            {activeTab === "Overview" && (
              <div className="space-y-4 xl:col-span-4">
                <section className="overflow-hidden rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
                  <div className="relative h-32">
                    <Image
                      src={getCropImageUrl(crop)}
                      alt={displayName}
                      fill
                      className="object-cover object-center"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                        {t("plannerFieldSnapshot")}
                      </p>
                      <p className="text-base font-black text-white">
                        {displayName}
                        {hindi ? ` · ${hindi}` : ""}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 p-4 text-xs">
                    {[
                      { icon: Calendar, label: t("plannerDays"), value: shortenFarmerLine(crop.durationDays, 28) },
                      {
                        icon: Sprout,
                        label: t("plannerSeason"),
                        value: seasonMeta ? `${t(seasonMeta.labelKey)} (${seasonMeta.months})` : season,
                      },
                      { icon: Droplets, label: t("plannerWater"), value: waterNeed },
                      {
                        icon: IndianRupee,
                        label: t("plannerYield"),
                        value: shortenFarmerLine(crop.estimatedYield, 28),
                      },
                      { icon: Target, label: t("plannerAreaLabel"), value: `${acres} ${acreUnit}` },
                    ].map(({ icon: Icon, label, value }) => (
                      <li key={label} className="flex items-start gap-2 text-[var(--av-text-secondary)]">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span>
                          <span className="font-semibold text-[var(--av-text-primary)]">{label}:</span> {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("plannerRemember")}</h3>
                  </div>
                  <ul className="space-y-2">
                    {reminders.map((r) => (
                      <li
                        key={r.text}
                        className={cn(
                          "rounded-xl border p-2.5 text-xs text-[var(--av-text-secondary)]",
                          r.tone === "good" &&
                            "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
                          r.tone === "warn" &&
                            "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
                          r.tone === "info" &&
                            "border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10",
                          r.tone === "hot" &&
                            "border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10"
                        )}
                      >
                        {r.text}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>

          {/* Varieties */}
          <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-300">
                  {t("plannerVarietiesBadge")}
                </p>
                <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
                  {t("plannerVarietiesTitle")} — {displayName}
                  {profile.district ? ` · ${profile.district}` : ""}
                </h3>
              </div>
              <AppLink href={`/crops/${crop.slug}?tab=varieties`} className={AV.link}>
                {t("plannerViewAll")} →
              </AppLink>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {varieties.map((v, i) => (
                <div
                  key={v.name}
                  className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-3"
                >
                  {i === 0 ? (
                    <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black text-white">
                      {t("plannerTop")}
                    </span>
                  ) : null}
                  <p className="pr-10 text-xs font-bold text-[var(--av-text-primary)]">{v.name}</p>
                  <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{v.trait}</p>
                  <p className="mt-2 text-[10px] font-semibold text-amber-700 dark:text-amber-300">{v.season}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Upsell CTA */}
          <section className="relative overflow-hidden rounded-[1.85rem] border border-emerald-500/25 bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900 p-5 text-white">
            <div className="pointer-events-none absolute -right-6 top-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                  <Stethoscope className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                    {t("plannerNextUnlock")}
                  </p>
                  <p className="mt-1 text-base font-bold">{t("plannerAiTitle")}</p>
                  <p className="mt-0.5 text-xs text-white/65">{t("plannerAiDesc")}</p>
                </div>
              </div>
              <AppLink
                href="/ai-doctor"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg"
              >
                {t("plannerAskAi")}
                <ChevronRight className="h-4 w-4" />
              </AppLink>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function PlanPanel({
  className,
  eyebrow,
  title,
  accent,
  children,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  accent: "emerald" | "sky" | "amber" | "rose" | "lime";
  children: ReactNode;
}) {
  const accentBar =
    accent === "sky"
      ? "from-sky-500/15"
      : accent === "amber"
        ? "from-amber-500/15"
        : accent === "rose"
          ? "from-rose-500/15"
          : accent === "lime"
            ? "from-lime-500/15"
            : "from-emerald-500/15";

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]",
        className
      )}
    >
      <div className={cn("border-b border-[var(--av-border)] bg-gradient-to-r to-transparent px-4 py-3", accentBar)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--av-text-muted)]">
          {eyebrow}
        </p>
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
