"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { isHindiLocale, tf, type FarmerUiKey } from "@/lib/i18n/farmer-ui";
import { stageLabelHi } from "@/lib/i18n/farmer-display";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import {
  getCropHindiName,
  getCropImageUrl,
  getPlannerSeasonsForCrop,
  pickDefaultPlannerSeason,
  type PlannerSeasonId,
} from "@/lib/crops/crop-display";
import { buildFertilizerPlan } from "@/lib/agriveda2/fertilizerEngine";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { writeStorage } from "@/lib/storage";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import { shortenFarmerLine, shortenFarmerLines, stageTipsFromPoints } from "@/lib/crops/farmerShortCopy";
import { applyHarvestVerb, farmerSpeak, farmerSpeakLines } from "@/lib/crops/farmerSpeak";
import { cropHarvestLabel } from "@/lib/crops/harvestLabel";
import { clampSowingDate, datesInOfficialWindow, sowingBoundsForSeason } from "@/lib/crops/sowingDateOptions";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { fertilizerBagLabel } from "@/data/agriveda2/fertilizer-data";

const SEASONS: { id: PlannerSeasonId; labelKey: FarmerUiKey; months: string; monthsHi: string }[] = [
  { id: "kharif", labelKey: "plannerKharif", months: "Jun–Oct", monthsHi: "जून–अक्तूबर" },
  { id: "rabi", labelKey: "plannerRabi", months: "Oct–Mar", monthsHi: "अक्तूबर–मार्च" },
  { id: "zaid", labelKey: "plannerZaid", months: "Feb–Jun", monthsHi: "फरवरी–जून" },
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

function stageJobImage(stage: string, cropImage: string): string {
  const s = stage.toLowerCase();
  if (/पानी|सिंचाई|water|irrig|moist/.test(s)) return "/images/home/home-job-weather.jpg";
  if (/खाद|fert|urea|npk|dap/.test(s)) return "/images/jobs/job-fertilizer.jpg";
  if (/कीट|रोग|स्प्रे|pest|disease|spray|scoutd/.test(s) || /scout/.test(s))
    return "/images/jobs/job-pest.jpg";
  if (/खरपत|weed/.test(s)) return "/images/jobs/job-weeds.jpg";
  if (/कटाई|harvest|कटा|yield/.test(s)) return cropImage;
  if (/बुवाई|buwai|sow|रोप|transplant/.test(s)) return "/images/jobs/job-crops-hero.jpg";
  return cropImage;
}

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
  const hi = isHindiLocale(locale);
  const planRef = useRef<HTMLDivElement>(null);

  const [cropSlug, setCropSlug] = useState("paddy");
  const [season, setSeason] = useState<PlannerSeasonId>("kharif");
  const [area, setArea] = useState("1");
  const [activeTab, setActiveTab] = useState<PlanTab>("Overview");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planStamp, setPlanStamp] = useState<string | null>(null);
  const [sowingDate, setSowingDate] = useState("");
  const [pickOpen, setPickOpen] = useState(false);
  const reduced = useReducedMotion();

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
        { id: "Harvest" as const, label: cropHarvestLabel(crop, hi), hint: t("plannerTabHintYield") },
      ] as const,
    [t, crop, hi]
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

  const sowingPack = useMemo(
    () => sowingBoundsForSeason(crop.slug, season, profile.state),
    [crop.slug, season, profile.state]
  );
  const sowingDays = useMemo(
    () => datesInOfficialWindow(crop.slug, season, profile.state),
    [crop.slug, season, profile.state]
  );

  useEffect(() => {
    setPickOpen(false);
  }, [crop.slug, season]);

  useEffect(() => {
    setSowingDate((prev) => clampSowingDate(prev, sowingPack.min, sowingPack.max));
    setGenerated(false);
  }, [sowingPack.min, sowingPack.max]);

  const fertPlan = useMemo(
    () => (generated ? buildFertilizerPlan(crop.slug, acres) : null),
    [generated, crop.slug, acres, planStamp]
  );

  const timeline = useMemo(() => {
    const labelStage = (name: string) => (hi ? stageLabelHi(name) : name);
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        { stage: labelStage("Buwai"), days: shortenFarmerLine(crop.sowingGuide.bestSowingTime, 28), icon: "🌱" },
        { stage: labelStage("Badhaw"), days: hi ? "शुरुआत" : "Shuruat", icon: "🌿" },
        { stage: labelStage("Phool/dana"), days: hi ? "बीच" : "Beech", icon: "🌸" },
        { stage: labelStage("Kataai"), days: shortenFarmerLine(crop.harvestAndYield.harvestingTime, 28), icon: "✅" },
      ];
    }
    return stages.slice(0, 6).map((s, i) => ({
      stage: labelStage(shortenFarmerLine(s.title.split(/[—(]/)[0]?.trim() || s.title, 16)),
      days: shortenFarmerLine(s.period, 24),
      icon: STAGE_ICONS[i] ?? "🌱",
    }));
  }, [mgmt, crop, planStamp, hi]);

  const scheduleRows = useMemo(() => {
    const labelStage = (name: string) => (hi ? stageLabelHi(name) : name);
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        {
          stage: labelStage("Buwai"),
          days: shortenFarmerLine(crop.sowingGuide.bestSowingTime, 32),
          activities: stageTipsFromPoints(
            [
              `Beej: ${crop.sowingGuide.seedRate}`,
              crop.sowingGuide.seedTreatment,
              crop.sowingGuide.sowingMethod,
            ],
            hi ? "प्रमाणित बीज + सही दूरी" : "Certified beej + sahi spacing"
          ),
        },
        {
          stage: labelStage("Dekhbhal"),
          days: shortenFarmerLine(crop.durationDays, 32),
          activities: stageTipsFromPoints(
            crop.irrigationManagement.schedule,
            hi ? "मिट्टी देखकर पानी दें" : "Paani mitti dekh ke dein"
          ),
        },
        {
          stage: labelStage("Kataai"),
          days: shortenFarmerLine(crop.harvestAndYield.harvestingTime, 32),
          activities: stageTipsFromPoints(
            crop.harvestAndYield.maturitySigns,
            hi ? "पकने के निशान देखकर काटें" : "Pakne ke nishaan dekh ke kaatein"
          ),
        },
      ];
    }
    return stages.slice(0, 6).map((s) => ({
      stage: labelStage(shortenFarmerLine(s.title.split(/[—(]/)[0]?.trim() || s.title, 22)),
      days: shortenFarmerLine(s.period, 28),
      activities: stageTipsFromPoints(s.keyPoints, s.title),
    }));
  }, [mgmt, crop, planStamp, hi]);

  const reminders = useMemo(() => {
    const list: { tone: "good" | "warn" | "info" | "hot"; text: string }[] = [];
    const fert = fertPlan?.schedule?.[0];
    if (fert) {
      list.push({
        tone: "good",
        text: shortenFarmerLine(
          hi ? `खाद: ${fert.time} — ${fert.apply}` : `Khad: ${fert.time} — ${fert.apply}`,
          78
        ),
      });
    } else if (crop.fertilizerSchedule.stageWise[0]) {
      const sw = crop.fertilizerSchedule.stageWise[0];
      const stage = hi ? stageLabelHi(sw.stage) : sw.stage;
      list.push({
        tone: "good",
        text: shortenFarmerLine(
          hi ? `खाद (${stage}): ${sw.details[0]}` : `Khad (${sw.stage}): ${sw.details[0]}`,
          78
        ),
      });
    }
    const pest = mgmt?.pestManagement?.[0];
    if (pest) {
      list.push({
        tone: "warn",
        text: shortenFarmerLine(
          hi
            ? `कीट: ${pest.pestName} — खेत की नियमित जाँच करें`
            : `Keet: ${pest.pestName} — field check karte rahein`,
          78
        ),
      });
    }
    if (crop.irrigationManagement.criticalStages[0]) {
      const critical = crop.irrigationManagement.criticalStages
        .slice(0, 2)
        .map((s) => (hi ? stageLabelHi(s) : s))
        .join(", ");
      list.push({
        tone: "info",
        text: shortenFarmerLine(
          hi ? `पानी ज़रूरी: ${critical}` : `Paani zaroori: ${critical}`,
          78
        ),
      });
    }
    list.push({
      tone: "hot",
      text: shortenFarmerLine(
        hi ? `कटाई: ${crop.harvestAndYield.harvestingTime}` : `Kataai: ${crop.harvestAndYield.harvestingTime}`,
        78
      ),
    });
    return list.slice(0, 4);
  }, [fertPlan, mgmt, crop, planStamp, hi]);

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
            {scheduleRows.map((row, idx) => {
              const img = stageJobImage(row.stage, getCropImageUrl(crop));
              return (
                <li
                  key={row.stage + row.days}
                  className="relative overflow-hidden rounded-2xl border border-[var(--av-border)] shadow-[var(--av-shadow-sm)]"
                >
                  <div className="relative flex min-h-[88px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
                    <div className="relative z-10 flex flex-1 flex-col justify-end p-3.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[14px] font-extrabold text-white">
                          <span className="mr-1.5 text-[10px] font-bold text-emerald-200">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          {row.stage}
                        </p>
                        <p className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                          {row.days}
                        </p>
                      </div>
                      <ul className="mt-1.5 space-y-0.5">
                        {row.activities.slice(0, 2).map((a) => (
                          <li
                            key={a}
                            className="flex gap-1.5 text-[11px] leading-snug text-white/85"
                          >
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-300" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
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
      const lines = farmerSpeakLines(
        mgmt?.irrigationSchedule?.length
          ? mgmt.irrigationSchedule
          : [
              crop.irrigationManagement.waterRequirement,
              ...crop.irrigationManagement.criticalStages.map((c) => `ज़रूरी समय: ${c}`),
              ...crop.irrigationManagement.schedule,
            ],
        6,
        160
      );
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabWater")}
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
      const lines = farmerSpeakLines(
        fertPlan?.schedule?.length
          ? fertPlan.schedule.map((s) => `${s.time}: ${s.apply}`)
          : [
              ...crop.fertilizerSchedule.basalDose,
              ...crop.fertilizerSchedule.stageWise.flatMap((s) =>
                s.details.map((d) => `${s.stage}: ${d}`)
              ),
            ],
        6,
        180
      );
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabFert")}
          accent="emerald"
        >
          <FertilizerBags bags={fertPlan?.bags?.length ? fertPlan.bags : inferBagsFromLines(lines)} />
          <ul className="mt-3 space-y-2">
            {lines.map((line) => (
              <li
                key={line}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-sm font-medium"
              >
                {line}
              </li>
            ))}
          </ul>
        </PlanPanel>
      );
    }

    if (activeTab === "Pest Control") {
      const pests = mgmt?.pestManagement?.slice(0, 4) ?? [];
      return (
        <PlanPanel
          className="xl:col-span-12"
          eyebrow={t("plannerTabPest")}
          accent="amber"
        >
          {pests.length ? (
            <ul className="space-y-2">
              {pests.map((p) => (
                <li key={p.pestName} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                  <p className="text-sm font-bold text-[var(--av-text-primary)]">
                    {farmerSpeak(p.pestName, 48)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {farmerSpeak(`${p.activeIngredient} ${p.dose}`, 90)}
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
          accent="rose"
        >
          {diseases.length ? (
            <ul className="space-y-2">
              {diseases.map((d) => (
                <li key={d.diseaseName} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5">
                  <p className="text-sm font-bold">{farmerSpeak(d.diseaseName, 48)}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {farmerSpeak(`${d.activeIngredient} ${d.dose}`, 90)}
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
          accent="lime"
        >
          {program?.criticalPeriod ? (
            <p className="mb-2 text-xs font-semibold text-lime-700 dark:text-lime-300">
              {farmerSpeak(program.criticalPeriod, 90)}
            </p>
          ) : null}
          {weeds.length ? (
            <ul className="space-y-2">
              {weeds.map((w) => (
                <li key={w.weedName} className="rounded-2xl border border-lime-500/20 bg-lime-500/5 px-3 py-2.5">
                  <p className="text-sm font-bold">{farmerSpeak(w.weedName, 48)}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {farmerSpeak(
                      `${w.postEmergenceHerbicide || w.preEmergenceHerbicide} ${w.dose}`,
                      120
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-1.5">
              {farmerSpeakLines(crop.cropProtection.weedManagement, 5, 160).map((w) => (
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
        eyebrow={cropHarvestLabel(crop, hi)}
        accent="amber"
      >
        <p className="text-base font-black text-amber-600 dark:text-amber-300">
          {applyHarvestVerb(farmerSpeak(crop.harvestAndYield.harvestingTime), cropHarvestLabel(crop, hi))}
        </p>
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {t("plannerYield")}: {farmerSpeak(crop.estimatedYield)}
        </p>
        <ul className="mt-3 space-y-1.5">
          {farmerSpeakLines(
            [...crop.harvestAndYield.maturitySigns, ...crop.harvestAndYield.storageTips],
            8
          ).map((m) => {
            const line = applyHarvestVerb(m, cropHarvestLabel(crop, hi));
            return (
            <li
              key={line}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-[var(--av-text-secondary)]"
            >
              {line}
            </li>
          );
          })}
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
          { n: "02", label: t("plannerStepSeason"), done: Boolean(season) },
          { n: "03", label: t("plannerStepPlan"), done: generated },
        ].map((s) => (
          <motion.div
            key={s.n}
            layout
            className={cn(
              "rounded-2xl border px-3 py-2.5",
              s.done
                ? "border-emerald-500/35 bg-emerald-500/10"
                : "border-[var(--av-border)] bg-[var(--av-surface)]"
            )}
          >
            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-300">{s.n}</p>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.section
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT }}
        className="overflow-hidden rounded-[1.85rem] border border-emerald-900/8 bg-[var(--av-surface)] shadow-[0_18px_40px_-24px_rgba(6,78,59,0.45)] dark:border-white/8"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
          <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-100">{t("plannerStep1")}</p>
          <h3 className="font-display text-lg font-bold">{hi ? "फसल चुनो" : t("plannerWhichCrop")}</h3>
        </div>
        <div className="-mx-0 flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
          {crops.map((c) => {
            const active = c.slug === cropSlug;
            const h = getCropHindiName(c.slug);
            const short = cropShortName(c.name);
            return (
              <motion.button
                key={c.slug}
                type="button"
                whileTap={reduced ? undefined : { scale: 0.96 }}
                onClick={() => selectCrop(c.slug)}
                className={cn(
                  "group relative w-[7.2rem] shrink-0 overflow-hidden rounded-[1.35rem] border text-left",
                  active
                    ? "border-emerald-500 ring-2 ring-emerald-400/40 shadow-[0_16px_32px_-16px_rgba(16,185,129,0.7)]"
                    : "border-transparent"
                )}
              >
                <div className="relative h-[5.4rem] w-full">
                  <Image
                    src={getCropImageUrl(c)}
                    alt={h || short}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="120px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  {active ? (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-emerald-950">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  ) : null}
                  <p className="absolute bottom-2 left-2 right-2 truncate text-[13px] font-extrabold text-white">
                    {hi ? h || short : short}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.06 }}
        className="overflow-hidden rounded-[1.85rem] border border-emerald-900/8 bg-[var(--av-surface)] shadow-[0_18px_40px_-24px_rgba(6,78,59,0.4)] dark:border-white/8"
      >
        <div className="px-4 pt-4">
          <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            {t("plannerStep2")}
          </p>
          <h3 className="font-display text-lg font-bold text-[var(--av-text-primary)]">
            {hi ? "मौसम चुनो — तारीख खुद खुल जाएगी" : t("plannerSeasonArea")}
          </h3>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 px-4">
          {seasonOptions.map((s) => {
            const active = season === s.id;
            return (
              <motion.button
                key={s.id}
                type="button"
                whileTap={reduced ? undefined : { scale: 0.97 }}
                onClick={() => {
                  setSeason(s.id);
                  setGenerated(false);
                }}
                className={cn(
                  "relative overflow-hidden rounded-[1.2rem] border px-2.5 py-3 text-left",
                  active
                    ? "border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-700/25"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                )}
              >
                <p className="text-[13px] font-extrabold">{t(s.labelKey)}</p>
                <p className={cn("mt-0.5 text-[10px] font-medium", active ? "text-emerald-100" : "text-[var(--av-text-muted)]")}>
                  {hi ? s.monthsHi : s.months}
                </p>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${crop.slug}-${season}`}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="mx-4 mt-3 overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 p-3.5 dark:from-emerald-950/50 dark:via-stone-900 dark:to-sky-950/30"
          >
            <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-100">
              {hi ? "बुवाई का सही समय" : "Best sowing time"}
            </p>
            <p className="mt-1 font-display text-[1.25rem] font-bold leading-tight text-emerald-950 dark:text-emerald-50">
              {sowingPack.window.rangeHi}
            </p>
            <p className="mt-3 text-[11px] font-bold text-emerald-900/70 dark:text-emerald-100/70">
              {hi ? "बुवाई की तारीख चुनें" : "Choose sowing date"}
            </p>
            <button
              type="button"
              onClick={() => setPickOpen((v) => !v)}
              className="mt-1.5 flex w-full items-center justify-between rounded-2xl border border-emerald-900/10 bg-white px-3.5 py-3 text-left dark:border-white/10 dark:bg-white/5"
            >
              <span className="text-[14px] font-extrabold text-emerald-950 dark:text-emerald-50">
                {sowingDays.find((d) => d.iso === sowingDate)?.label ||
                  sowingPack.window.startLabel}
              </span>
              <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            </button>
            <AnimatePresence>
              {pickOpen ? (
                <motion.div
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduced ? undefined : { opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="grid max-h-48 grid-cols-4 gap-1.5 overflow-y-auto pr-0.5">
                    {sowingDays.map((d) => {
                      const on = sowingDate === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => {
                            setSowingDate(d.iso);
                            setPickOpen(false);
                            setGenerated(false);
                          }}
                          className={cn(
                            "rounded-xl px-1 py-2 text-[11px] font-extrabold",
                            on
                              ? "bg-emerald-600 text-white"
                              : "bg-white/80 text-emerald-950 dark:bg-white/10 dark:text-emerald-50"
                          )}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-[var(--av-text-secondary)]">
              {hi ? "खेत कितना बड़ा?" : t("plannerArea")}
            </label>
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
          <div className="mt-2 grid grid-cols-4 gap-2">
            {AREA_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setArea(preset);
                  setGenerated(false);
                }}
                className={cn(
                  "rounded-xl border py-2 text-[12px] font-extrabold",
                  area === preset
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

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
              {sowingDate
                ? ` · ${new Date(`${sowingDate}T00:00:00`).toLocaleDateString(hi ? "hi-IN" : "en-IN", { day: "numeric", month: "short" })}`
                : ""}
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

const BAG_FACE: Record<string, { en: string; tone: string }> = {
  DAP: { en: "DAP", tone: "from-rose-700 to-rose-900" },
  Urea: { en: "UREA", tone: "from-sky-600 to-sky-900" },
  MOP: { en: "MOP", tone: "from-amber-600 to-amber-900" },
  SOP: { en: "SOP", tone: "from-orange-600 to-orange-900" },
  SSP: { en: "SSP", tone: "from-lime-700 to-lime-900" },
  Gypsum: { en: "GYPSUM", tone: "from-stone-500 to-stone-800" },
  ZnSO4: { en: "ZnSO4", tone: "from-teal-600 to-teal-900" },
  ZnSO4_21: { en: "ZnSO4", tone: "from-teal-600 to-teal-900" },
  Calcium_nitrate: { en: "CaNO3", tone: "from-emerald-700 to-emerald-950" },
};

function bagCode(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("dap") || n.includes("डीएपी")) return "DAP";
  if (n.includes("urea") || n.includes("यूरिया")) return "Urea";
  if (n.includes("mop") || n.includes("एमओपी")) return "MOP";
  if (n.includes("sop") || n.includes("एसओपी")) return "SOP";
  if (n.includes("ssp") || n.includes("एसएसपी")) return "SSP";
  if (n.includes("gypsum") || n.includes("जिप्सम")) return "Gypsum";
  if (n.includes("zn") || n.includes("जिंक") || n.includes("zinc")) return "ZnSO4";
  if (n.includes("calcium") || n.includes("कैल्शियम")) return "Calcium_nitrate";
  return name;
}

function inferBagsFromLines(lines: string[]): { name: string; amount: string }[] {
  const seen = new Set<string>();
  const out: { name: string; amount: string }[] = [];
  for (const line of lines) {
    const code = bagCode(line);
    if (!BAG_FACE[code] || seen.has(code)) continue;
    seen.add(code);
    const kg = line.match(/(\d+(?:\.\d+)?)\s*(किग्रा|kg|किलो)/i)?.[1];
    out.push({ name: code, amount: kg ? `${kg} kg` : "" });
  }
  return out.slice(0, 4);
}

function FertilizerBags({ bags }: { bags: { name: string; amount: string }[] }) {
  if (!bags.length) return null;
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {bags.slice(0, 4).map((b) => {
        const code = bagCode(b.name);
        const face = BAG_FACE[code] ?? { en: code.slice(0, 6).toUpperCase(), tone: "from-emerald-700 to-emerald-950" };
        return (
          <div key={`${b.name}-${b.amount}`} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "relative flex h-[72px] w-[54px] flex-col items-center justify-end overflow-hidden rounded-b-lg rounded-t-[6px] bg-gradient-to-b pb-1.5 shadow-md",
                face.tone
              )}
            >
              <span className="absolute top-0 h-2 w-full bg-black/25" />
              <span className="px-0.5 text-center text-[10px] font-black leading-none tracking-wide text-white">
                {face.en}
              </span>
            </div>
            <p className="text-center text-[10px] font-bold leading-tight text-[var(--av-text-primary)]">
              {fertilizerBagLabel(code)}
            </p>
            {b.amount ? (
              <p className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">{b.amount}</p>
            ) : null}
          </div>
        );
      })}
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
  title?: string;
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
        {title ? <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{title}</h3> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
