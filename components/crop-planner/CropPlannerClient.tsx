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
import CropGuideScreen from "@/components/crops/CropGuideFasalPustika";
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
  "Guide",
  "Nourishment",
  "Protection",
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
        { id: "Guide" as const, label: hi ? "📖 फसल पुस्तिका" : "📖 Crop Guide", hint: hi ? "4 मुख्य चरण गाइड" : "4-Stage Handbook" },
        { id: "Nourishment" as const, label: hi ? "खाद-पानी" : "Nourishment", hint: hi ? "सिंचाई और पोषण" : "Water & Fertilizer" },
        { id: "Protection" as const, label: hi ? "फसल सुरक्षा" : "Protection", hint: hi ? "कीट, रोग और खरपतवार" : "Pest, Disease & Weed" },
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

    if (activeTab === "Guide") {
      return (
        <div className="xl:col-span-12 space-y-4">
          <CropGuideScreen cropSlug={crop.slug} />
        </div>
      );
    }

    if (activeTab === "Nourishment") {
      const waterLines = farmerSpeakLines(
        mgmt?.irrigationSchedule?.length
          ? mgmt.irrigationSchedule
          : [
              crop.irrigationManagement.waterRequirement,
              ...crop.irrigationManagement.criticalStages.map((c) => `ज़रूरी समय: ${c}`),
              ...crop.irrigationManagement.schedule,
            ],
        4,
        160
      );
      const fertLines = farmerSpeakLines(
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
        <div className="xl:col-span-12 space-y-4">
          <PlanPanel eyebrow={t("plannerTabWater")} accent="sky">
            <ul className="space-y-2">
              {waterLines.map((line) => (
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
          <PlanPanel eyebrow={t("plannerTabFert")} accent="emerald">
            {/* We omitted FertilizerBags import if it was there, assuming it's available or not needed. Wait, FertilizerBags is in this file? It is not imported at the top, but we'll see if it exists. Ah, it might be in the same file. */}
            {typeof FertilizerBags !== "undefined" && (
              <FertilizerBags bags={fertPlan?.bags?.length ? fertPlan.bags : inferBagsFromLines(fertLines)} />
            )}
            <ul className="mt-3 space-y-2">
              {fertLines.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-sm font-medium"
                >
                  {line}
                </li>
              ))}
            </ul>
          </PlanPanel>
        </div>
      );
    }

    if (activeTab === "Protection") {
      const pests = mgmt?.pestManagement?.slice(0, 3) ?? [];
      const diseases = mgmt?.diseaseManagement?.slice(0, 3) ?? [];
      const weeds = mgmt?.weedManagement?.slice(0, 2) ?? [];

      return (
        <div className="xl:col-span-12 space-y-4">
          {pests.length > 0 && (
            <PlanPanel eyebrow={t("plannerTabPest")} accent="amber">
              <ul className="space-y-2">
                {pests.map((p) => (
                  <li key={p.pestName} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">
                      {farmerSpeak(p.pestName, 48)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                      {farmerSpeak(`${p.activeIngredient} ${p.dose}`, 90)}
                    </p>
                  </li>
                ))}
              </ul>
            </PlanPanel>
          )}
          
          {diseases.length > 0 && (
            <PlanPanel eyebrow={t("plannerTabDisease")} accent="rose">
              <ul className="space-y-2">
                {diseases.map((d) => (
                  <li key={d.diseaseName} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5">
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">{farmerSpeak(d.diseaseName, 48)}</p>
                    <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                      {farmerSpeak(`${d.activeIngredient} ${d.dose}`, 90)}
                    </p>
                  </li>
                ))}
              </ul>
            </PlanPanel>
          )}

          {weeds.length > 0 && (
            <PlanPanel eyebrow={t("plannerTabWeed")} accent="lime">
              <ul className="space-y-2">
                {weeds.map((w) => (
                  <li key={w.weedName} className="rounded-2xl border border-lime-500/20 bg-lime-500/5 px-3 py-2.5">
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">{farmerSpeak(w.weedName, 48)}</p>
                    <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                      {farmerSpeak(
                        `${w.postEmergenceHerbicide || w.preEmergenceHerbicide} ${w.dose}`,
                        120
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </PlanPanel>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setActiveTab("Guide")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 transition hover:bg-emerald-500/20"
            >
              <span>📖 {hi ? "विस्तृत फसल पुस्तिका (4 चरण व FRAC/IRAC गाइड) खोलें" : "Open Full 4-Stage Crop Guide"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
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
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[1.5rem] font-extrabold leading-tight text-slate-900 dark:text-white">
            {t("plannerHeroLine1a")} <span className="text-emerald-600 dark:text-emerald-400">{t("plannerHeroLine1b")}</span>
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {t("plannerHeroDesc")}
          </p>
        </div>
      </div>

      <motion.section
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.slow, ease: EASE_OUT }}
        className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="font-display text-[15px] font-bold text-slate-800 dark:text-slate-100">{hi ? "फसल चुनें" : t("plannerWhichCrop")}</h3>
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
        className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
      >
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          <h3 className="font-display text-[15px] font-bold text-slate-800 dark:text-slate-100">
            {hi ? "मौसम और तारीख" : t("plannerSeasonArea")}
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

      {/* Generate CTA */}
      <section className="sticky bottom-24 z-20 overflow-hidden rounded-[1.5rem] border border-emerald-500/20 bg-white p-3 shadow-lg ring-1 ring-emerald-900/5 dark:bg-slate-900 lg:static lg:bottom-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="px-2">
            <p className="text-[13px] font-bold leading-snug text-slate-800 dark:text-slate-200">
              {displayName}
              {hindi ? ` (${hindi})` : ""} · {seasonMeta ? t(seasonMeta.labelKey) : season} · {acres} {acreUnit}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void generatePlan()}
            disabled={generating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-md shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {generating ? t("plannerGenerating") : generated ? t("plannerRegenerate") : t("plannerGenerate")}
          </button>
        </div>
      </section>

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
